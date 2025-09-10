// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化搜索功能
    initSearch();
    
    // 添加滚动动画效果
    initScrollAnimations();
    
    // 初始化回到顶部按钮
    initBackToTop();
    
    // 初始化主题切换
    initTheme();
    
    // 初始化性能监控
    initPerformanceMonitoring();
    
    // 初始化键盘快捷键
    initKeyboardShortcuts();
});

// 移动端菜单初始化
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 平滑滚动初始化
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 搜索功能初始化
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // 支持回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchResources();
            }
        });
        
        // 实时搜索建议（可选功能）
        searchInput.addEventListener('input', function() {
            showSearchSuggestions(this.value);
        });
    }
}

// 搜索资源函数 - 现在由ResourceManager处理
function searchResources() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showToast('请输入搜索关键词', 'warning');
        return;
    }
    
    // 使用ResourceManager的搜索功能
    if (window.resourceManager) {
        resourceManager.searchResources(searchTerm);
    } else {
        // 后备搜索功能
        fallbackSearch(searchTerm);
    }
}

// 后备搜索功能
function fallbackSearch(searchTerm) {
    const resourceCards = document.querySelectorAll('.resource-card');
    let foundResults = false;
    
    resourceCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (cardText.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
            card.style.animation = 'pulse 0.5s ease';
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (!foundResults) {
        showToast('没有找到匹配的资源，请尝试其他关键词', 'info');
        resourceCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        showToast(`找到 ${document.querySelectorAll('.resource-card[style*="block"]').length} 个相关资源`, 'success');
    }
}

// 显示搜索建议（简单实现）
function showSearchSuggestions(query) {
    // 这里可以实现更复杂的搜索建议逻辑
    // 目前只是简单实现
    if (query.length > 2) {
        console.log('搜索建议:', query);
    }
}

// 滚动动画初始化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有资源卡片 - 延迟执行以等待动态内容加载
    setTimeout(() => {
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => {
            if (!card.style.opacity) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            }
        });
    }, 500);
}

// 主题切换功能
function initTheme() {
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}模式`, 'success');
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// 回到顶部功能
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toast通知功能
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'primary'}-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        font-family: inherit;
        font-size: 0.9rem;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });
    
    // 自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 页面性能优化：延迟加载图片
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// 性能监控
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
            
            // 如果加载时间过长，显示提示
            if (loadTime > 3000) {
                showToast('页面加载较慢，建议检查网络连接', 'warning');
            }
        });
    }
}

// 键盘快捷键支持
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+K 或 Cmd+K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                showToast('快捷键提示：Escape清空搜索，Alt+T切换主题', 'info');
            }
        }
        
        // Escape 清空搜索
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                if (window.resourceManager) {
                    resourceManager.showAllResources();
                } else {
                    // 后备方案
                    document.querySelectorAll('.resource-card').forEach(card => {
                        card.style.display = 'block';
                    });
                }
            }
        }
        
        // Alt+T 切换主题
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    showToast('页面出现错误，部分功能可能不可用', 'error');
});

// 网络状态监控
window.addEventListener('online', function() {
    showToast('网络连接已恢复', 'success');
});

window.addEventListener('offline', function() {
    showToast('网络连接已断开，请检查网络设置', 'warning');
});

// 页面可见性API - 页面切换时的处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停某些操作
        console.log('页面已隐藏');
    } else {
        // 页面显示时恢复操作
        console.log('页面已显示');
    }
});

// 服务工作者注册（PWA支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker注册成功');
            })
            .catch(function(error) {
                console.log('Service Worker注册失败，这是正常现象（开发环境）');
            });
    });
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .resource-card[style*="pulse"] {
        animation: pulse 0.5s ease !important;
    }
    
    /* 预加载动画 */
    .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;
document.head.appendChild(style);

// 导出全局函数供HTML调用
window.searchResources = searchResources;
window.toggleTheme = toggleTheme;
window.scrollToTop = scrollToTop;
window.showToast = showToast;

// 调试工具（开发环境）
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    window.debugTools = {
        showAllCards: () => {
            document.querySelectorAll('.resource-card').forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
        },
        clearStorage: () => {
            localStorage.clear();
            showToast('本地存储已清空', 'info');
        },
        testToast: () => {
            showToast('这是一个测试通知', 'success');
        }
    };
    console.log('调试工具已加载，使用 debugTools 对象访问');
}
