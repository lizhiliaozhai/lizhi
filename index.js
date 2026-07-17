// 商品数据
const products = [
    {
        id: 1,
        name: '私贼',
        price: 99.99,
        image: 'images/1.png',
        description: '这是一款高品质的商品，具有卓越的性能和精美的外观设计。适合日常使用，为您的生活带来便利。'
    },
    {
        id: 2,
        name: '熊',
        price: 199.99,
        image: 'images/2.png',
        description: '精选优质材料，匠心打造。品质保证，让您购物无忧。'
    },
    {
        id: 3,
        name: '商品名称',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
        description: '创新设计，引领潮流。为您带来全新的使用体验。'
    },
    {
        id: 4,
        name: '商品名称',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400',
        description: '经典款式，经久耐用。性价比高，物超所值。'
    },
    {
        id: 5,
        name: '商品名称',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        description: '高端品质，奢华享受。彰显品味，提升生活品质。'
    },
    {
        id: 6,
        name: '商品名称',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
        description: '时尚简约，百搭款式。适合各种场合，让您与众不同。'
    },
    {
        id: 7,
        name: '商品名称',
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1544568100-e505dffd62d2?w=400',
        description: '科技感十足，功能强大。满足您的各种需求。'
    },
    {
        id: 8,
        name: '商品名称',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: '精致工艺，细节完美。每一处都体现用心。'
    }
];

// 购物车数据
let cart = [];

// 初始化商品展示
function initProducts() {
    const grid = document.getElementById('products-grid');
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// 创建商品卡片
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">¥${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">加入购物车</button>
        </div>
    `;
    card.addEventListener('click', () => openModal(product));
    return card;
}

// 打开商品详情模态框
function openModal(product) {
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <img src="${product.image}" alt="${product.name}" class="modal-product-image">
            <div class="modal-product-info">
                <h3 class="modal-product-name">${product.name}</h3>
                <p class="modal-product-description">${product.description}</p>
                <p class="modal-product-price">¥${product.price.toFixed(2)}</p>
                <button class="modal-add-to-cart-btn" onclick="addToCart(${product.id}); closeModal()">加入购物车</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('modal-overlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// 添加到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('已添加到购物车');
}

// 更新购物车UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // 更新购物车数量
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    
    // 更新购物车内容
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">购物车为空</p>';
        cartTotal.textContent = '¥0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">¥${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">删除</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // 更新总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total.toFixed(2)}`;
}

// 更新数量
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// 切换购物车侧边栏
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// 滚动到商品区域
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 添加动画样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(styleSheet);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initProducts);