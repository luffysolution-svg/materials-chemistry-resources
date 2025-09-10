// 资源管理器
class ResourceManager {
    constructor() {
        this.resources = {};
        this.favorites = this.loadFavorites();
        this.searchHistory = this.loadSearchHistory();
        this.currentFilters = {
            category: 'all',
            subcategory: 'all',
            tags: 'all',
            status: 'all'
        };
    }

    // 加载资源数据
    async loadResources() {
        try {
            const response = await fetch('data/resources.json');
            this.resources = await response.json();
            this.renderAllSections();
            this.updateStats();
        } catch (error) {
            console.error('加载资源数据失败:', error);
            this.showError('资源数据加载失败，请刷新页面重试。');
        }
    }

    // 渲染所有资源部分
    renderAllSections() {
        const container = document.getElementById('dynamic-sections');
        container.innerHTML = '';

        Object.entries(this.resources.categories).forEach(([categoryId, category]) => {
            const sectionHTML = this.createSectionHTML(categoryId, category);
            container.innerHTML += sectionHTML;
        });

        // 初始化标签页功能
        this.initializeTabs();
        // 初始化筛选功能
        this.initializeFilters();
    }

    // 创建单个分类的HTML
    createSectionHTML(categoryId, category) {
        const subcategories = Object.entries(category.subcategories);
        
        return `
            <section id="${categoryId}" class="resource-section">
                <div class="container">
                    <h2>
                        <i class="${category.icon}"></i> 
                        ${category.title}
                    </h2>
                    
                    ${subcategories.length > 1 ? this.createTabsHTML(categoryId, subcategories) : ''}
                    
                    ${this.createFilterBarHTML(categoryId)}
                    
                    ${subcategories.map(([subId, subcategory]) => 
                        this.createTabContentHTML(categoryId, subId, subcategory, subcategories.length === 1)
                    ).join('')}
                </div>
            </section>
        `;
    }

    // 创建标签页HTML
    createTabsHTML(categoryId, subcategories) {
        return `
            <div class="subcategory-tabs" data-category="${categoryId}">
                ${subcategories.map(([subId, subcategory], index) => `
                    <button class="tab-btn ${index === 0 ? 'active' : ''}" 
                            data-tab="${categoryId}-${subId}">
                        <span class="status-dot ${this.getStatusDotClass(subId)}"></span>
                        ${subcategory.title}
                    </button>
                `).join('')}
            </div>
        `;
    }

    // 创建筛选条HTML
    createFilterBarHTML(categoryId) {
        return `
            <div class="filter-bar" data-category="${categoryId}">
                <select class="filter-select" data-filter="tags">
                    <option value="all">全部标签</option>
                    <option value="free">免费</option>
                    <option value="paid">付费</option>
                    <option value="chinese">中文</option>
                    <option value="english">英文</option>
                    <option value="mirror">镜像站</option>
                </select>
                <select class="filter-select" data-filter="difficulty">
                    <option value="all">全部难度</option>
                    <option value="初级">初级</option>
                    <option value="中级">中级</option>
                    <option value="高级">高级</option>
                </select>
                <select class="filter-select" data-filter="status">
                    <option value="all">全部状态</option>
                    <option value="active">正常</option>
                    <option value="limited">受限</option>
                </select>
            </div>
        `;
    }

    // 创建标签页内容HTML
    createTabContentHTML(categoryId, subId, subcategory, isOnlyTab = false) {
        return `
            <div class="tab-content ${isOnlyTab ? 'active' : (subId === Object.keys(this.resources.categories[categoryId].subcategories)[0] ? 'active' : '')}" 
                 id="${categoryId}-${subId}">
                <div class="resource-grid">
                    ${subcategory.resources.map(resource => this.createResourceCardHTML(resource, categoryId)).join('')}
                </div>
            </div>
        `;
    }

    // 创建资源卡片HTML
    createResourceCardHTML(resource, categoryId) {
        const isFavorite = this.favorites.includes(`${categoryId}-${resource.name}`);
        const statusClass = resource.status || 'active';
        const statusText = this.getStatusText(statusClass);

        return `
            <div class="resource-card" data-tags="${resource.tags.join(',')}" data-difficulty="${resource.difficulty}" data-status="${resource.status}">
                <div class="card-header">
                    <h3>${resource.name}</h3>
                    <div class="card-status">
                        <span class="status-indicator ${statusClass}" title="${statusText}"></span>
                        <span class="last-checked">今日验证</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <p>${resource.description}</p>
                    <div class="tags">
                        ${resource.tags.map(tag => `<span class="tag ${this.getTagClass(tag)}">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="card-footer">
                    <a href="${resource.url}" target="_blank" class="resource-link" 
                       onclick="resourceManager.recordVisit('${categoryId}', '${resource.name}')">
                        访问网站 <i class="fas fa-external-link-alt"></i>
                    </a>
                    <div class="card-actions">
                        <button class="btn-icon ${isFavorite ? 'active' : ''}" 
                                title="${isFavorite ? '取消收藏' : '收藏'}"
                                onclick="resourceManager.toggleFavorite('${categoryId}', '${resource.name}', this)">
                            <i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>
                        </button>
                        <button class="btn-icon" title="复制链接" 
                                onclick="resourceManager.copyLink('${resource.url}', this)">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 获取状态点颜色类
    getStatusDotClass(subId) {
        const statusMap = {
            'domestic': 'green',
            'vpn': 'red',
            'mirror': 'yellow',
            'api': 'yellow',
            'academic': 'green'
        };
        return statusMap[subId] || 'green';
    }

    // 获取标签类
    getTagClass(tag) {
        const tagMap = {
            '免费': 'free',
            '付费': 'paid',
            '需注册': 'registration',
            '中文': 'chinese',
            '英文': 'english',
            '镜像站': 'mirror'
        };
        return tagMap[tag] || tag.toLowerCase();
    }

    // 获取状态文本
    getStatusText(status) {
        const statusMap = {
            'active': '正常访问',
            'limited': '访问受限',
            'inactive': '暂不可用'
        };
        return statusMap[status] || '未知状态';
    }

    // 初始化标签页功能
    initializeTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                const categoryTabs = e.currentTarget.closest('.subcategory-tabs');
                
                // 切换活跃标签页
                categoryTabs.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // 切换内容显示
                const section = categoryTabs.closest('.resource-section');
                section.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                section.querySelector(`#${tabId}`).classList.add('active');
            });
        });
    }

    // 初始化筛选功能
    initializeFilters() {
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.applyFilters(e.currentTarget.closest('.resource-section'));
            });
        });
    }

    // 应用筛选
    applyFilters(section) {
        const filterBar = section.querySelector('.filter-bar');
        const filters = {
            tags: filterBar.querySelector('[data-filter="tags"]').value,
            difficulty: filterBar.querySelector('[data-filter="difficulty"]').value,
            status: filterBar.querySelector('[data-filter="status"]').value
        };

        const cards = section.querySelectorAll('.resource-card');
        cards.forEach(card => {
            const cardTags = card.dataset.tags.split(',');
            const cardDifficulty = card.dataset.difficulty;
            const cardStatus = card.dataset.status;

            const matchesTags = filters.tags === 'all' || cardTags.some(tag => this.getTagClass(tag) === filters.tags);
            const matchesDifficulty = filters.difficulty === 'all' || cardDifficulty === filters.difficulty;
            const matchesStatus = filters.status === 'all' || cardStatus === filters.status;

            if (matchesTags && matchesDifficulty && matchesStatus) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 搜索资源
    searchResources(query) {
        if (!query.trim()) {
            this.showAllResources();
            return;
        }

        const searchTerm = query.toLowerCase();
        this.addToSearchHistory(searchTerm);

        let hasResults = false;
        document.querySelectorAll('.resource-card').forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'pulse 0.5s ease';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (!hasResults) {
            this.showNoResults(searchTerm);
        }
    }

    // 显示所有资源
    showAllResources() {
        document.querySelectorAll('.resource-card').forEach(card => {
            card.style.display = 'block';
        });
    }

    // 显示无结果
    showNoResults(query) {
        // 可以在这里添加无结果提示的逻辑
        console.log('没有找到匹配的资源:', query);
    }

    // 切换收藏
    toggleFavorite(categoryId, resourceName, button) {
        const favoriteId = `${categoryId}-${resourceName}`;
        const icon = button.querySelector('i');
        
        if (this.favorites.includes(favoriteId)) {
            this.favorites = this.favorites.filter(id => id !== favoriteId);
            button.classList.remove('active');
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.title = '收藏';
        } else {
            this.favorites.push(favoriteId);
            button.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.title = '取消收藏';
        }
        
        this.saveFavorites();
    }

    // 复制链接
    async copyLink(url, button) {
        try {
            await navigator.clipboard.writeText(url);
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
            }, 1000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    }

    // 记录访问
    recordVisit(categoryId, resourceName) {
        const visitId = `${categoryId}-${resourceName}`;
        let visits = JSON.parse(localStorage.getItem('resource-visits') || '{}');
        visits[visitId] = Date.now();
        localStorage.setItem('resource-visits', JSON.stringify(visits));
    }

    // 加载收藏
    loadFavorites() {
        return JSON.parse(localStorage.getItem('resource-favorites') || '[]');
    }

    // 保存收藏
    saveFavorites() {
        localStorage.setItem('resource-favorites', JSON.stringify(this.favorites));
    }

    // 加载搜索历史
    loadSearchHistory() {
        return JSON.parse(localStorage.getItem('search-history') || '[]');
    }

    // 添加到搜索历史
    addToSearchHistory(query) {
        this.searchHistory = this.searchHistory.filter(q => q !== query);
        this.searchHistory.unshift(query);
        this.searchHistory = this.searchHistory.slice(0, 10); // 只保留最近10次
        localStorage.setItem('search-history', JSON.stringify(this.searchHistory));
    }

    // 更新统计信息
    updateStats() {
        let totalResources = 0;
        Object.values(this.resources.categories).forEach(category => {
            Object.values(category.subcategories).forEach(subcategory => {
                totalResources += subcategory.resources.length;
            });
        });
        
        const totalElement = document.getElementById('totalResources');
        if (totalElement) {
            totalElement.textContent = totalResources + '+';
        }
    }

    // 显示错误信息
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--danger-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: var(--shadow-medium);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// 创建全局资源管理器实例
const resourceManager = new ResourceManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    resourceManager.loadResources();
});

// 搜索功能
function searchResources() {
    const searchInput = document.getElementById('searchInput');
    resourceManager.searchResources(searchInput.value);
}

// 支持回车搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchResources();
            }
        });
    }
});
