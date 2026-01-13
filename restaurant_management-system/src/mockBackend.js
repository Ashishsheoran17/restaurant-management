// Lightweight mock backend: overrides window.fetch for frontend-only use
(function setupMockBackend() {
  if (window.__mockBackendInstalled) return;
  window.__mockBackendInstalled = true;

  const originalFetch = window.fetch.bind(window);

  const readJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  // Seed mock foods on first run
  if (!localStorage.getItem('foods')) {
    writeJSON('foods', [
      { food_id: 1, food_name: 'Margherita Pizza', food_price: 299, food_image: 'https://images.unsplash.com/photo-1601924582971-b0d1f9c87a3a?q=80&w=800&auto=format&fit=crop' },
      { food_id: 2, food_name: 'Veg Burger', food_price: 149, food_image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { food_id: 3, food_name: 'Pasta Alfredo', food_price: 249, food_image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop' },
      { food_id: 4, food_name: 'Chocolate Shake', food_price: 119, food_image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop' }
    ]);
  }
  if (!localStorage.getItem('cart')) writeJSON('cart', []);
  if (!localStorage.getItem('users')) writeJSON('users', []);

  function jsonResponse(body, init = { status: 200 }) {
    return new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  }

  window.fetch = async (input, init = {}) => {
    try {
      const url = typeof input === 'string' ? input : input.url;
      const method = (init.method || 'GET').toUpperCase();

      // Foods
      if (url.endsWith('/api/foods') && method === 'GET') {
        const foods = readJSON('foods', []);
        return jsonResponse(foods);
      }

      // Cart GET
      if (url.endsWith('/api/cart') && method === 'GET') {
        const cart = readJSON('cart', []);
        return jsonResponse(cart);
      }

      // Cart POST: { food_id, user_id }
      if (url.endsWith('/api/cart') && method === 'POST') {
        const body = init.body ? JSON.parse(init.body) : {};
        const foods = readJSON('foods', []);
        const item = foods.find(f => f.food_id === body.food_id);
        if (!item) return jsonResponse({ error: 'Item not found' }, { status: 400 });
        const cart = readJSON('cart', []);
        const existing = cart.find(c => c.food_id === item.food_id);
        if (existing) existing.quantity += 1; else cart.push({
          food_id: item.food_id,
          food_name: item.food_name,
          food_price: item.food_price,
          quantity: 1,
        });
        writeJSON('cart', cart);
        window.dispatchEvent(new Event('cartUpdated'));
        return jsonResponse({ message: 'Item Added to cart successfully' }, { status: 200 });
      }

      // Register
      if (url.endsWith('/api/register') && method === 'POST') {
        const { fullname, email, password } = init.body ? JSON.parse(init.body) : {};
        if (!fullname || !email || !password) {
          return jsonResponse({ error: 'fill the credential properly' }, { status: 400 });
        }
        const users = readJSON('users', []);
        if (users.find(u => u.email === email)) {
          return jsonResponse({ error: 'User already exists' }, { status: 409 });
        }
        users.push({ fullname, email, password });
        writeJSON('users', users);
        return jsonResponse({ message: 'Registration successful' }, { status: 201 });
      }

      // Login
      if (url.endsWith('/api/login') && method === 'POST') {
        const { email, password } = init.body ? JSON.parse(init.body) : {};
        if (!email || !password) return jsonResponse({ message: 'Enter email and password' }, { status: 400 });
        const users = readJSON('users', []);
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) return jsonResponse({ message: 'Wrong email and password' }, { status: 400 });
        // Store a simple session flag
        writeJSON('session', { email });
        return jsonResponse({ message: 'Login successful' }, { status: 200 });
      }

      // Fallback to original fetch for non-API resources
      return originalFetch(input, init);
    } catch (e) {
      return jsonResponse({ error: 'Mock backend error', details: String(e) }, { status: 500 });
    }
  };
})();
