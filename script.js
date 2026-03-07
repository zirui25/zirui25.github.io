// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    // 点击菜单按钮切换显示/隐藏
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // 点击导航链接后关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // 页面滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // 加载产品数据
    loadProducts();
    
    // 加载新闻数据
    loadNews();
    
    // 处理联系表单提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Banner轮播
    initBannerSlider();
});

// 加载产品数据
async function loadProducts() {
    try {
        const response = await fetch('/api/products?limit=4');
        const data = await response.json();
        
        if (data.success) {
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.innerHTML = data.data.map(product => `
                    <div class="product-card">
                        <div class="product-icon">
                            <i class="fas fa-${getProductIcon(product.category)}"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <p>${product.description.substring(0, 50)}...</p>
                        <a href="${product.officialUrl || '#'}" class="product-link">了解更多 <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('加载产品失败:', error);
    }
}

// 加载新闻数据
async function loadNews() {
    try {
        const response = await fetch('/api/news?limit=4');
        const data = await response.json();
        
        if (data.success) {
            const newsGrid = document.getElementById('newsGrid');
            if (newsGrid) {
                newsGrid.innerHTML = data.data.map(news => `
                    <div class="news-card">
                        <div class="news-image">
                            <img src="${news.image}" alt="${news.title}">
                        </div>
                        <div class="news-content">
                            <span class="news-category">${news.category}</span>
                            <h3>${news.title}</h3>
                            <p>${news.summary}</p>
                            <div class="news-meta">
                                <span><i class="far fa-calendar"></i> ${formatDate(news.publishDate)}</span>
                                <span><i class="far fa-eye"></i> ${news.views}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('加载新闻失败:', error);
    }
}

// 处理联系表单提交
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('提交成功，我们会尽快回复您！');
            e.target.reset();
        } else {
            alert('提交失败：' + result.message);
        }
    } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败，请稍后重试');
    }
}

// 初始化Banner轮播
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // 自动轮播
    setInterval(nextSlide, 5000);
    
    // 点击点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// 辅助函数：获取产品图标
function getProductIcon(category) {
    const icons = {
        '社交': 'users',
        '游戏': 'gamepad',
        '金融': 'wallet',
        '云服务': 'cloud',
        '广告': 'chart-line',
        '其他': 'cube'
    };
    return icons[category] || 'cube';
}

// 辅助函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}