// Copied from static/app.js for GitHub Pages
// Static SPA with hash routing and localStorage-backed mock data
(function() {
  const app = document.getElementById('app');
  const cartBadge = document.getElementById('nav-cart-count');
  const navAuth = document.getElementById('nav-auth');

  // Seed foods on first run
  if (!localStorage.getItem('foods')) {
    localStorage.setItem('foods', JSON.stringify([
      // Pizzas
      { id: 1, name: 'Margherita Pizza', price: 299, image: 'https://images.unsplash.com/photo-1601924582971-b0d1f9c87a3a?q=80&w=800&auto=format&fit=crop' },
      { id: 2, name: 'Farmhouse Pizza', price: 379, image: 'https://images.unsplash.com/photo-1541745537413-b8040cda0d7b?q=80&w=800&auto=format&fit=crop' },
      { id: 3, name: 'Pepperoni Pizza', price: 399, image: 'https://images.unsplash.com/photo-1548365328-9f547fb095bb?q=80&w=800&auto=format&fit=crop' },
      // Burgers
      { id: 4, name: 'Veg Burger', price: 149, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' },
      { id: 5, name: 'Cheese Burger', price: 179, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=800&auto=format&fit=crop' },
      // Pastas
      { id: 6, name: 'Pasta Alfredo', price: 249, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop' },
      { id: 7, name: 'Penne Arrabbiata', price: 239, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&auto=format&fit=crop' },
      // Drinks
      { id: 8, name: 'Chocolate Shake', price: 119, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop' },
      { id: 9, name: 'Mango Smoothie', price: 129, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=800&auto=format&fit=crop' },
      // Desserts
      { id: 10, name: 'Brownie Sundae', price: 199, image: 'https://images.unsplash.com/photo-1541976076758-347942db197d?q=80&w=800&auto=format&fit=crop' },
      { id: 11, name: 'Cheesecake', price: 219, image: 'https://images.unsplash.com/photo-1511911063855-3e48a3b9da3e?q=80&w=800&auto=format&fit=crop' },
      { id: 12, name: 'Gulab Jamun', price: 129, image: 'https://images.unsplash.com/photo-1625944525310-7ae811f08a51?q=80&w=800&auto=format&fit=crop' }
    ]));
  }
  if (!localStorage.getItem('cart')) {
    // Pre-seed cart with a couple of items for demo
    localStorage.setItem('cart', JSON.stringify([
      { id: 1, name: 'Margherita Pizza', price: 299, quantity: 1 },
      { id: 8, name: 'Chocolate Shake', price: 119, quantity: 2 }
    ]));
  }
  if (!localStorage.getItem('users')) {
    // Seed a demo user
    localStorage.setItem('users', JSON.stringify([
      { fullname: 'Demo User', email: 'demo@example.com', password: 'demo123' }
    ]));
  }

  const session = () => JSON.parse(localStorage.getItem('session') || 'null');

  function setCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((s, c) => s + (c.quantity || 0), 0);
    cartBadge.textContent = String(count);
  }

  function updateAuthButton() {
    const s = session();
    if (s && s.email) {
      navAuth.textContent = 'Sign Out';
      navAuth.href = '#/logout';
      navAuth.classList.remove('btn-outline-secondary');
      navAuth.classList.add('btn-danger');
    } else {
      navAuth.textContent = 'Login';
      navAuth.href = '#/login';
      navAuth.classList.remove('btn-danger');
      navAuth.classList.add('btn-outline-secondary');
    }
  }

  function render(html) { app.innerHTML = html; }

  function viewHome() {
    const featured = (JSON.parse(localStorage.getItem('foods')) || []).slice(0,3);
    render(`
      <section class="hero">
        <div class="hero-banner">
          <div class="hero-content">
            <div class="badge bg-success mb-2">Open Now</div>
            <h1 class="display-5 fw-bold">Welcome To GKMIT Restaurant</h1>
            <p class="lead mb-4">Fresh flavors. Fast delivery. Friendly prices.</p>
            <div class="d-flex gap-2 flex-wrap">
              <a class="btn btn-primary btn-lg shadow" href="#/menu">Order Now</a>
              <a class="btn btn-outline-light btn-lg" href="#/about">Why Choose Us</a>
            </div>
            <div class="mt-3 small text-white-50">★ 4.8/5 (2,300+ reviews)</div>
          </div>
        </div>

        <div class="category-chips container mt-4">
          <a href="#/menu" class="chip">Pizza</a>
          <a href="#/menu" class="chip">Burgers</a>
          <a href="#/menu" class="chip">Pasta</a>
          <a href="#/menu" class="chip">Drinks</a>
          <a href="#/menu" class="chip">Desserts</a>
        </div>

        <div class="container mt-5">
          <div class="row g-3 feature-cards">
            <div class="col-md-4">
              <div class="card feature-card h-100">
                <div class="card-body">
                  <h5 class="card-title">Fast Delivery</h5>
                  <p class="card-text">Hot and fresh to your doorstep in under 30 minutes.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card h-100">
                <div class="card-body">
                  <h5 class="card-title">Fresh Ingredients</h5>
                  <p class="card-text">Only the best seasonal produce and artisan staples.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card feature-card h-100">
                <div class="card-body">
                  <h5 class="card-title">Great Deals</h5>
                  <p class="card-text">Daily combos and member-exclusive offers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container mt-5">
          <h4 class="mb-3">Featured Dishes</h4>
          <div class="menu-grid">
            ${featured.map(f => `
              <div class="card menu-card">
                <img class="card-img-top" src="${f.image}" alt="${f.name}" />
                <div class="card-body">
                  <h5 class="card-title">${f.name}</h5>
                  <p class="card-text">Price ${f.price}/-</p>
                  <a class="btn btn-sm btn-outline-primary" href="#/menu">See More</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="container mt-5">
          <h4 class="mb-3">What Customers Say</h4>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="testimonial p-3 h-100">
                <div class="mb-2">★★★★★</div>
                <p>“The pasta was incredible and the delivery was super fast!”</p>
                <div class="small text-muted">— Aditi</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="testimonial p-3 h-100">
                <div class="mb-2">★★★★★</div>
                <p>“Best burgers in town. Great value combos.”</p>
                <div class="small text-muted">— Rohit</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="testimonial p-3 h-100">
                <div class="mb-2">★★★★★</div>
                <p>“Love the desserts. Cheesecake is a must-try!”</p>
                <div class="small text-muted">— Meera</div>
              </div>
            </div>
          </div>
        </div>

        <div class="cta-section text-center mt-5">
          <h4 class="mb-3">Ready to treat yourself?</h4>
          <a class="btn btn-lg btn-primary" href="#/menu">Browse Full Menu</a>
        </div>
      </section>
    `);
  }

  function addToCart(id) {
    const foods = JSON.parse(localStorage.getItem('foods'));
    const item = foods.find(f => f.id === id);
    if (!item) return;
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existing = cart.find(c => c.id === id);
    if (existing) existing.quantity += 1; else cart.push({ id, name: item.name, price: item.price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount();
  }

  function viewMenu() {
    const foods = JSON.parse(localStorage.getItem('foods'));
    render(`
      <div class="menu-grid">
        ${foods.map(f => `
          <div class="card">
            <img class="card-img-top" src="${f.image}" alt="${f.name}" />
            <div class="card-body">
              <h5 class="card-title">${f.name}</h5>
              <p class="card-text">Price ${f.price}/-</p>
              <button class="btn btn-primary" data-add="${f.id}">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    `);
    app.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.getAttribute('data-add'), 10)));
    });
  }

  function viewCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
    render(`
      <h3>Your Food Cart</h3>
      <div class="cart-list">
        ${cart.map(c => `
          <div class="cart-item">
            <div>${c.name}</div>
            <div>${c.price}</div>
            <div>
              <button class="btn btn-sm btn-outline-secondary" data-dec="${c.id}">-</button>
              <span class="mx-2">${c.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" data-inc="${c.id}">+</button>
            </div>
            <div>${c.price * c.quantity}</div>
            <button class="btn btn-sm btn-outline-danger" data-del="${c.id}"><i class="fa fa-trash" /></button>
          </div>
        `).join('')}
      </div>
      <div class="cart-total">Total: ${total}</div>
      <div class="mt-3 d-flex gap-2">
        <a class="btn btn-light" href="#/menu">Back to Menu</a>
        <a class="btn btn-primary" href="#/payment">Proceed to Payment</a>
      </div>
    `);
    // Wire buttons
    app.querySelectorAll('[data-inc]').forEach(btn => btn.addEventListener('click', () => changeQty(parseInt(btn.getAttribute('data-inc'), 10), 1)));
    app.querySelectorAll('[data-dec]').forEach(btn => btn.addEventListener('click', () => changeQty(parseInt(btn.getAttribute('data-dec'), 10), -1)));
    app.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => removeItem(parseInt(btn.getAttribute('data-del'), 10))));
  }

  function changeQty(id, delta) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      const idx = cart.findIndex(c => c.id === id);
      cart.splice(idx, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount();
    viewCart();
  }

  function removeItem(id) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const next = cart.filter(c => c.id !== id);
    localStorage.setItem('cart', JSON.stringify(next));
    setCartCount();
    viewCart();
  }

  function viewLogin() {
    render(`
      <div class="form-auth">
        <h3>Login</h3>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" id="login-email" type="email" placeholder="Enter your email" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input class="form-control" id="login-pass" type="password" placeholder="********" />
        </div>
        <button class="btn btn-primary" id="login-btn">Log In</button>
        <div class="form-text mt-2">Demo credentials: demo@example.com / demo123</div>
      </div>
    `);
    document.getElementById('login-btn').addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value.trim();
      if (!email || !pass) return alert('Please fill out the field first');
      const users = JSON.parse(localStorage.getItem('users'));
      const ok = users.find(u => u.email === email && u.password === pass);
      if (!ok) return alert('Wrong email and password');
      localStorage.setItem('session', JSON.stringify({ email }));
      updateAuthButton();
      location.hash = '#/menu';
    });
  }

  function viewRegister() {
    render(`
      <div class="form-auth">
        <h3>Register</h3>
        <div class="mb-3">
          <label class="form-label">Full name</label>
          <input class="form-control" id="reg-name" type="text" placeholder="Enter your full name" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" id="reg-email" type="email" placeholder="Enter your email" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input class="form-control" id="reg-pass" type="password" placeholder="Enter your password" />
        </div>
        <button class="btn btn-primary" id="reg-btn">Register</button>
      </div>
    `);
    document.getElementById('reg-btn').addEventListener('click', () => {
      const fullname = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-pass').value.trim();
      if (!fullname || !email || !password) return alert('Please fill out the field first');
      const users = JSON.parse(localStorage.getItem('users'));
      if (users.find(u => u.email === email)) return alert('User already exists');
      users.push({ fullname, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful');
      location.hash = '#/login';
    });
  }

  function viewAbout() {
    render(`
      <h3>About Us</h3>
      <p>Welcome to GKMIT Restaurant — serving delicious meals crafted with passion. Our mission is to bring you fresh, high-quality food with quick and friendly service.</p>
      <h5 class="mt-3">Our Story</h5>
      <p>Started in 2020 as a small kitchen, we've grown into a beloved neighborhood spot. We believe in great taste, fair pricing, and memorable experiences.</p>
      <h5 class="mt-3">Team</h5>
      <ul>
        <li>Chef Priya Sharma — Head Chef</li>
        <li>Rahul Verma — Operations</li>
        <li>Anita Rao — Customer Success</li>
      </ul>
    `);
  }

  function viewContact() {
    render(`
      <h3>Contact Us</h3>
      <p>
        Address: 221B Baker Street, Jaipur, Rajasthan<br/>
        Email: support@gkmit-restaurant.example<br/>
        Phone: +91 98765 43210
      </p>
      <h5 class="mt-3">Opening Hours</h5>
      <ul>
        <li>Mon–Fri: 10:00 AM – 10:00 PM</li>
        <li>Sat–Sun: 9:00 AM – 11:00 PM</li>
      </ul>
      <h5 class="mt-3">Feedback</h5>
      <p>We love hearing from you. Drop us a message anytime!</p>
    `);
  }

  function viewPayment() {
    render(`<h3>Payment</h3><p>Payments are disabled in this static demo.</p><a class="btn btn-light" href="#/cart">Back to Cart</a>`);
  }

  function viewLogout() {
    localStorage.removeItem('session');
    updateAuthButton();
    location.hash = '#/login';
  }

  const routes = {
    '': viewHome,
    '#/': viewHome,
    '#/menu': viewMenu,
    '#/cart': viewCart,
    '#/login': viewLogin,
    '#/register': viewRegister,
    '#/about': viewAbout,
    '#/contact': viewContact,
    '#/payment': viewPayment,
    '#/logout': viewLogout,
  };

  function router() {
    const hash = location.hash || '#/' ;
    const view = routes[hash] || viewHome;
    view();
    setCartCount();
    updateAuthButton();
  }

  window.addEventListener('hashchange', router);
  document.addEventListener('DOMContentLoaded', router);
})();
