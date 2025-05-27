  // Mobile hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('ul.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('open');
  });
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });

  // Close mobile menu on nav link click
  navLinks.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      if(window.innerWidth <= 768){
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Highlight nav links on scroll
  const sections = document.querySelectorAll('section');
  const navLinkEls = document.querySelectorAll('ul.nav-links li a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  /* STORAGE KEYS */
  const CART_KEY = 'enhypen_cart';
  const PURCHASES_KEY = 'enhypen_purchases';
  const USER_PROFILE_KEY = 'enhypen_profile';

  // Get refs
  const cartOpenBtn = document.getElementById('cart-open-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const purchaseItemsContainer = document.getElementById('purchase-items');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  const cartTabBtn = document.getElementById('cart-tab-btn');
  const purchaseTabBtn = document.getElementById('purchase-tab-btn');
  const cartContent = document.getElementById('cart-content');
  const purchaseContent = document.getElementById('purchase-content');

  // Profile panel refs
  const profileOpenBtn = document.getElementById('profile-open-btn');
  const profilePanel = document.getElementById('profile-panel');
  const profileCloseBtn = document.getElementById('profile-close-btn');
  const signInTab = document.getElementById('sign-in-tab');
  const signUpTab = document.getElementById('sign-up-tab');
  const signInForm = document.getElementById('sign-in-form');
  const signUpForm = document.getElementById('sign-up-form');
  const profileInfoView = document.getElementById('profile-info-view');
  const profileEditForm = document.getElementById('profile-edit-form');

  const profileEditBtn = document.getElementById('profile-edit-btn');
  const signOutBtn = document.getElementById('signout-btn');
  const profileCancelEditBtn = document.getElementById('profile-cancel-edit-btn');

  const profileUsernameSpan = document.getElementById('profile-username');
  const profileAddressPre = document.getElementById('profile-address');
  const profileCardMaskedSpan = document.getElementById('profile-card-masked');

  // Forms fields (edit)
  const editUsernameInput = document.getElementById('edit-username');
  const editAddressInput = document.getElementById('edit-address');
  const editCardInput = document.getElementById('edit-card');

  // Forms fields (sign in)
  const signinUsernameInput = document.getElementById('signin-username');
  const signinPasswordInput = document.getElementById('signin-password');

  // Forms fields (sign up)
  const signupNewUsernameInput = document.getElementById('signup-new-username');
  const signupPasswordInput = document.getElementById('signup-password');
  const signupAddressInput = document.getElementById('signup-address');
  const signupCardInput = document.getElementById('signup-card');

  // State vars
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  let purchases = JSON.parse(localStorage.getItem(PURCHASES_KEY)) || [];
  let userProfile = JSON.parse(localStorage.getItem(USER_PROFILE_KEY)) || null;

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function savePurchases() {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  }
  function saveProfile() {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
  }

  function maskCardNumber(cardNum) {
    // Format to show last 4 digits only, mask the rest
    if (!cardNum) return '';
    const cleaned = cardNum.replace(/\s+/g, '');
    if(cleaned.length <= 4) return cleaned;
    return '**** **** **** ' + cleaned.slice(-4);
  }

  /* --- CART RENDER --- */
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    const keys = Object.keys(cart);
    if(keys.length === 0){
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      checkoutBtn.disabled = true;
      clearCartBtn.disabled = true;
      return;
    }
    checkoutBtn.disabled = false;
    clearCartBtn.disabled = false;
    keys.forEach(id => {
      const item = cart[id];
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.setAttribute('role','group');
      div.setAttribute('aria-label',`Cart item: ${item.name}`);

      const name = document.createElement('div');
      name.className = 'cart-item-name';
      name.textContent = item.name;

      const qty = document.createElement('div');
      qty.className = 'cart-item-qty';
      qty.textContent = 'Quantity: ' + item.quantity;

      const price = document.createElement('div');
      price.className = 'cart-item-price';
      price.textContent = 'Price: $' + (item.price * item.quantity).toFixed(2);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.backgroundColor = 'transparent';
      removeBtn.style.border = '1px solid #f04e3e';
      removeBtn.style.color = '#f04e3e';
      removeBtn.style.padding = '0.3rem 0.8rem';
      removeBtn.style.fontSize = '0.9rem';
      removeBtn.style.borderRadius = '4px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.marginTop = '0.4rem';
      removeBtn.addEventListener('click', () => {
        delete cart[id];
        saveCart();
        renderCart();
      });

      div.appendChild(name);
      div.appendChild(qty);
      div.appendChild(price);
      div.appendChild(removeBtn);
      cartItemsContainer.appendChild(div);
    });
  }

  /* --- PURCHASES RENDER --- */
  function renderPurchases() {
    purchaseItemsContainer.innerHTML = '';
    if(purchases.length === 0){
      purchaseItemsContainer.innerHTML = '<p>You have no purchases yet.</p>';
      return;
    }
    purchases.forEach((purchase, index) => {
      const div = document.createElement('div');
      div.className = 'purchase-item';
      div.setAttribute('role','group');
      div.setAttribute('aria-label', `Purchase #${index + 1}: ${purchase.items.length} items`);

      const header = document.createElement('div');
      header.style.fontWeight = '700';
      header.style.marginBottom = '0.5rem';
      header.textContent = `Purchase #${index + 1} - Order Date: ${purchase.date}`;

      div.appendChild(header);

      purchase.items.forEach(item => {
        const name = document.createElement('div');
        name.className = 'purchase-item-name';
        name.textContent = `${item.name} x${item.quantity}`;

        const price = document.createElement('div');
        price.className = 'purchase-item-price';
        price.textContent = `Price: $${(item.price * item.quantity).toFixed(2)}`;

        const delivery = document.createElement('div');
        delivery.className = 'purchase-item-delivery';
        delivery.textContent = `Delivery Status: ${purchase.status}, Expected Delivery: ${purchase.deliveryDate}`;

        div.appendChild(name);
        div.appendChild(price);
        div.appendChild(delivery);

        div.appendChild(document.createElement('hr'));
      });

      purchaseItemsContainer.appendChild(div);
    });
  }

  /* --- PROFILE RENDER & LOGIC --- */
  function showProfilePanel() {
    profilePanel.classList.add('open');
    profilePanel.setAttribute('aria-hidden', "false");
    if(isUserSignedIn()) {
      showProfileView();
    } else {
      showSignInForm();
    }
  }
  function closeProfilePanel() {
    profilePanel.classList.remove('open');
    profilePanel.setAttribute('aria-hidden', "true");
  }

  function isUserSignedIn() {
    return userProfile !== null;
  }
  function showSignInForm() {
    signInForm.hidden = false;
    signInForm.setAttribute('aria-hidden', 'false');
    signUpForm.hidden = true;
    signUpForm.setAttribute('aria-hidden', 'true');
    profileInfoView.hidden = true;
    profileInfoView.setAttribute('aria-hidden', 'true');
    profileEditForm.hidden = true;
    profileEditForm.setAttribute('aria-hidden', 'true');

    signInTab.classList.add('active');
    signInTab.setAttribute('aria-selected', 'true');
    signUpTab.classList.remove('active');
    signUpTab.setAttribute('aria-selected', 'false');
  }
  function showSignUpForm() {
    signInForm.hidden = true;
    signInForm.setAttribute('aria-hidden', 'true');
    signUpForm.hidden = false;
    signUpForm.setAttribute('aria-hidden', 'false');
    profileInfoView.hidden = true;
    profileInfoView.setAttribute('aria-hidden', 'true');
    profileEditForm.hidden = true;
    profileEditForm.setAttribute('aria-hidden', 'true');

    signUpTab.classList.add('active');
    signUpTab.setAttribute('aria-selected', 'true');
    signInTab.classList.remove('active');
    signInTab.setAttribute('aria-selected', 'false');
  }
  function showProfileView() {
    signInForm.hidden = true;
    signInForm.setAttribute('aria-hidden', 'true');
    signUpForm.hidden = true;
    signUpForm.setAttribute('aria-hidden', 'true');
    profileInfoView.hidden = false;
    profileInfoView.setAttribute('aria-hidden', 'false');
    profileEditForm.hidden = true;
    profileEditForm.setAttribute('aria-hidden', 'true');

    signInTab.classList.remove('active');
    signInTab.setAttribute('aria-selected', 'false');
    signUpTab.classList.remove('active');
    signUpTab.setAttribute('aria-selected', 'false');

    // Set profile info fields
    profileUsernameSpan.textContent = userProfile.username || '';
    profileAddressPre.textContent = userProfile.address || '';
    profileCardMaskedSpan.textContent = maskCardNumber(userProfile.cardNumber || '');
  }
  function showProfileEdit() {
    signInForm.hidden = true;
    signInForm.setAttribute('aria-hidden', 'true');
    signUpForm.hidden = true;
    signUpForm.setAttribute('aria-hidden', 'true');
    profileInfoView.hidden = true;
    profileInfoView.setAttribute('aria-hidden', 'true');
    profileEditForm.hidden = false;
    profileEditForm.setAttribute('aria-hidden', 'false');

    // Pre-fill edit form fields with current profile data
    editUsernameInput.value = userProfile.username || '';
    editAddressInput.value = userProfile.address || '';
    editCardInput.value = userProfile.cardNumber || '';
  }

  // User sign in logic (simple)
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = signinUsernameInput.value.trim();
    const password = signinPasswordInput.value;
    if (!username || !password) {
      alert('Please fill all sign-in fields.');
      return;
    }
    // Validate credentials against stored profile
    if (userProfile && userProfile.username === username && userProfile.password === password) {
      alert(`Welcome back, ${username}!`);
      closeProfilePanel();
    } else {
      alert('Invalid username or password.');
    }
    signinPasswordInput.value = '';
  });

  // User sign up logic
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = signupNewUsernameInput.value.trim();
    const password = signupPasswordInput.value;
    const address = signupAddressInput.value.trim();
    const card = signupCardInput.value.trim();

    // Basic validation
    if (!username || !password || !address || !card) {
      alert('Please fill all sign-up fields.');
      return;
    }
    // Check if username is already taken
    if (userProfile && userProfile.username === username) {
      alert('Username already registered. Please choose another.');
      return;
    }
    // Save profile
    userProfile = { username, password, address, cardNumber: card };
    saveProfile();
    alert(`Sign up successful. Welcome, ${username}!`);
    closeProfilePanel();
  });

  // Edit profile button
  profileEditBtn.addEventListener('click', () => {
    showProfileEdit();
  });

  // Cancel edit button
  profileCancelEditBtn.addEventListener('click', () => {
    showProfileView();
  });

  // Save profile edits
  profileEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = editUsernameInput.value.trim();
    const address = editAddressInput.value.trim();
    const card = editCardInput.value.trim();
    if(!username || !address || !card){
      alert('Please fill all profile fields.');
      return;
    }
    // Update profile (keep previous password)
    userProfile.username = username;
    userProfile.address = address;
    userProfile.cardNumber = card;
    saveProfile();
    alert('Profile updated successfully.');
    showProfileView();
  });

  // Sign out button
  signOutBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to sign out?')){
      userProfile = null;
      localStorage.removeItem(USER_PROFILE_KEY);
      alert('You have signed out.');
      showSignInForm();
    }
  });

  /* CART & PURCHASES LOGIC */
  function addItemToCart(id, name, price, type, img) {
    if(cart[id]){
      cart[id].quantity += 1;
    } else {
      cart[id] = {id, name, price: parseFloat(price), quantity: 1, type, img};
    }
    saveCart();
    alert(`Added "${name}" to your cart.`);
  }

  function buyNowItem(id, name, price, type, img) {
    if(!isUserSignedIn()) {
      alert('You must sign in or sign up before purchasing.');
      showProfilePanel();
      return;
    }
    purchases.push({
      date: new Date().toLocaleDateString(),
      items: [{id, name, price: parseFloat(price), quantity: 1, type, img}],
      status: 'Processing',
      deliveryDate: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString(),
    });
    savePurchases();
    alert(`Thank you for purchasing "${name}"! Your order is being processed.`);
    renderPurchases();
    cartTabBtn.click();
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', "false");
  }

  function setupButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.onclick = (e) => {
        const card = e.target.closest('[data-id]');
        addItemToCart(card.dataset.id, card.dataset.name, card.dataset.price, card.dataset.type, card.dataset.img);
      };
    });
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.onclick = (e) => {
        const card = e.target.closest('[data-id]');
        buyNowItem(card.dataset.id, card.dataset.name, card.dataset.price, card.dataset.type, card.dataset.img);
      };
    });
  }

  checkoutBtn.addEventListener('click', () => {
    if(!isUserSignedIn()) {
      alert('You must sign in or sign up before purchasing.');
      closeCartPanel();
      showProfilePanel();
      return;
    }
    if (Object.keys(cart).length === 0) return;
    // Compose purchase
    let purchasedItems = [];
    for(const id in cart){
      purchasedItems.push(cart[id]);
    }
    purchases.push({
      date: new Date().toLocaleDateString(),
      items: purchasedItems,
      status: 'Processing',
      deliveryDate: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString(),
    });
    // Clear cart
    cart = {};
    saveCart();
    savePurchases();
    alert('Thank you for your purchase! Your order is being processed.');
    renderCart();
    renderPurchases();
    purchaseTabBtn.click();
  });

  clearCartBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear your cart?')){
      cart = {};
      saveCart();
      renderCart();
    }
  });

  // Cart open/close
  cartOpenBtn.addEventListener('click', () => {
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', "false");
    renderCart();
    cartTabBtn.focus();
  });
  const closeCartPanel = () => {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', "true");
  };
  cartCloseBtn.addEventListener('click', closeCartPanel);

  // Cart tabs
  cartTabBtn.addEventListener('click', () => {
    cartTabBtn.classList.add('active');
    purchaseTabBtn.classList.remove('active');
    cartTabBtn.setAttribute('aria-selected', 'true');
    purchaseTabBtn.setAttribute('aria-selected', 'false');
    cartContent.hidden = false;
    purchaseContent.hidden = true;
  });
  purchaseTabBtn.addEventListener('click', () => {
    purchaseTabBtn.classList.add('active');
    cartTabBtn.classList.remove('active');
    purchaseTabBtn.setAttribute('aria-selected', 'true');
    cartTabBtn.setAttribute('aria-selected', 'false');
    cartContent.hidden = true;
    purchaseContent.hidden = false;
    renderPurchases();
  });

  // Profile open/close
  profileOpenBtn.addEventListener('click', () => {
    showProfilePanel();
  });
  profileCloseBtn.addEventListener('click', () => {
    closeProfilePanel();
  });

  // Profile tabs toggling
  signInTab.addEventListener('click', () => {
    showSignInForm();
  });
  signUpTab.addEventListener('click', () => {
    showSignUpForm();
  });

  // Contact form submit handler
  function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (name && email && message) {
      alert(`Thank you, ${name}! Your message has been received.`);
      event.target.reset();
      return true;
    } else {
      alert('Please fill out all fields.');
      return false;
    }
  }

  // On page load
  window.addEventListener('DOMContentLoaded', () => {
    setupButtons();
    renderCart();
    renderPurchases();
  });