// 用户信息管理
// 用户信息管理
const UserInfo = {
    init() {
        this.addUserInfoToAllPages();
        this.updateUserInfo();
        this.updateAvatarPreview(); // 在 Step 2 页面显示预览
        this.setupAdminTrigger(); // <-- 新增：初始化管理员触发器
    },

    // 添加用户信息显示区域到所有页面
    addUserInfoToAllPages() {
        // 在管理员页面不显示用户信息
        if (window.location.pathname.includes('admin.html')) {
            return;
        }

        const userInfoHTML = `
            <div class="user-info">
                <span class="username">游客</span>
                <div class="avatar-container">
                    <span class="placeholder">头像</span>
                </div>
                <div class="mood-container">
                    <span class="placeholder">心情</span>
                </div>
            </div>
        `;
        // 确保只添加一次
        if (!document.querySelector('.user-info')) {
            document.body.insertAdjacentHTML('afterbegin', userInfoHTML);
        }
    },

    // 更新右上角全局用户信息
    updateUserInfo() {
        const username = localStorage.getItem('username') || '游客';
        const avatarSrc = localStorage.getItem('selectedAvatar');
        const mood = localStorage.getItem('selectedMood');

        const usernameElement = document.querySelector('.user-info .username');
        if (usernameElement) {
            usernameElement.textContent = username;
        }

        const avatarContainer = document.querySelector('.user-info .avatar-container');
        if (avatarContainer) {
            if (avatarSrc) {
                avatarContainer.innerHTML = `<img src="${avatarSrc}" alt="Avatar">`;
            } else {
                avatarContainer.innerHTML = `<span class="placeholder">头像</span>`;
            }
        }

        const moodContainer = document.querySelector('.user-info .mood-container');
        if (moodContainer) {
            if (mood) {
                // 假设图片命名是首字母大写
                const moodImage = `../img/moods/${mood.charAt(0).toUpperCase() + mood.slice(1)}.png`;
                moodContainer.innerHTML = `<img src="${moodImage}" alt="Mood">`;
            } else {
                moodContainer.innerHTML = `<span class="placeholder">心情</span>`;
            }
        }
    },

    // 在 Step 2 页面更新头像预览
    updateAvatarPreview() {
        const avatarPreview = document.querySelector('.selected-avatar-preview');
        if (avatarPreview) {
            const avatarSrc = localStorage.getItem('selectedAvatar');
            if (avatarSrc) {
                avatarPreview.innerHTML = `<img src="${avatarSrc}" alt="Selected Avatar">`;
            } else {
                avatarPreview.innerHTML = `<span class="placeholder">Avatar</span>`;
            }
        }
    },

    // --- 新增：管理员5连击触发器 ---
    setupAdminTrigger() {
        // 检查当前页面是否为管理员页面
        const isAdminPage = window.location.pathname.includes('admin.html');

        let triggerElement;
        if (isAdminPage) {
            // 在管理员页面，监听psychologist_avatar.png的点击
            triggerElement = document.querySelector('.psychologist-info img');
        } else {
            // 在其他页面，监听头像容器的点击
            triggerElement = document.querySelector('.user-info .avatar-container');
        }

        if (!triggerElement) {
            console.warn('Admin trigger: Trigger element not found yet.');
            return;
        }

        let clickCount = 0;
        let clickTimer = null;

        triggerElement.addEventListener('click', () => {
            clickCount++;

            // 如果已有定时器，清除它 (重新开始计时)
            if (clickTimer) {
                clearTimeout(clickTimer);
            }

            // 设置一个1秒的定时器，如果1秒内没有再次点击，则重置计数
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);

            // 如果点击次数达到5次
            if (clickCount === 5) {
                clearTimeout(clickTimer); // 清除定时器
                clickCount = 0; // 重置计数

                if (isAdminPage) {
                    console.log('Returning to welcome page!');
                    window.location.href = 'welcome.html'; // 从管理员页面回到欢迎页面
                } else {
                    console.log('Admin access triggered!');
                    window.location.href = 'admin.html'; // 跳转到 admin.html
                }
            }
        });
    }
};

// --- 页面路由和事件绑定 ---
document.addEventListener("DOMContentLoaded", () => {
    // 初始化用户信息显示
    UserInfo.init();

    // --- 页面 1 (欢迎) -> 页面 1 (选择头像) ---
    const btnWelcomeEnter = document.getElementById('btn-welcome-enter');
    if (btnWelcomeEnter) {
        btnWelcomeEnter.addEventListener('click', () => {
            window.location.href = 'step1-avatar.html'; 
        });
    }

    // --- 页面 1 (选择头像) 逻辑 ---
    const avatarPage = document.getElementById('page-step1-avatar');
    if (avatarPage) {
        // Tab 切换 (Girl/Boy)
        const avatarTabs = avatarPage.querySelectorAll('.avatar-tab');
        const avatarGrids = avatarPage.querySelectorAll('.avatar-grid');

        avatarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                avatarTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetGridId = tab.dataset.target;
                avatarGrids.forEach(grid => grid.classList.remove('active'));
                avatarPage.querySelector(`#${targetGridId}`)?.classList.add('active');
            });
        });

        // Avatar 选择高亮
        const avatarItems = avatarPage.querySelectorAll('.avatar-item');
        avatarItems.forEach(item => {
            item.addEventListener('click', () => {
                avatarItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });

        // 确认按钮 -> 页面 2 (信息设置)
        const btnAvatarConfirm = avatarPage.querySelector('#btn-avatar-confirm');
        if (btnAvatarConfirm) {
            btnAvatarConfirm.addEventListener('click', () => {
                const selectedAvatar = avatarPage.querySelector('.avatar-item.selected img');
                if (selectedAvatar) {
                    localStorage.setItem('selectedAvatar', selectedAvatar.src);
                    UserInfo.updateUserInfo(); // 更新右上角
                    window.location.href = 'step2-info.html'; 
                } else {
                    alert('请选择一个头像');
                }
            });
        }
    }

    // --- 页面 2 (信息设置) -> 页面 3 (选择心情) ---
    const infoPage = document.getElementById('page-step2-info');
    if (infoPage) {
        const btnInfoConfirm = infoPage.querySelector('#btn-info-confirm');
        if (btnInfoConfirm) {
            btnInfoConfirm.addEventListener('click', () => {
                const nickname = infoPage.querySelector('#nickname-input').value;
                const realname = infoPage.querySelector('#realname-input').value;
                const age = infoPage.querySelector('#age-input').value;
                const mode = infoPage.querySelector('input[name="mode-selection"]:checked').value;

                // 根据模式选择要显示的用户名
                const username = (mode === 'anonymous') ? nickname : realname;
                
                if (!username || !username.trim()) {
                    alert('请输入昵称或真实姓名');
                    return;
                }

                localStorage.setItem('username', username);
                localStorage.setItem('realname', realname);
                localStorage.setItem('nickname', nickname);
                localStorage.setItem('age', age);
                localStorage.setItem('displayMode', mode);

                UserInfo.updateUserInfo(); // 更新右上角显示
                window.location.href = 'step3-mood.html'; 
            });
        }
    }

    // --- 页面 3 (选择心情) -> 页面 4 (疗愈星球) ---
    const moodPage = document.getElementById('page-step3-mood');
    if (moodPage) {
        const moodSelectButtons = moodPage.querySelectorAll('.btn-mood-select');
        moodSelectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mood = button.dataset.mood;
                localStorage.setItem('selectedMood', mood);
                UserInfo.updateUserInfo(); // 更新右上角显示
                window.location.href = 'step4-nova.html';
            });
        });
    }
    
    // --- 页面 4 (疗愈星球) 逻辑 ---
    const novaPage = document.getElementById('page-step4-nova');
    if (novaPage) {
        
        // Tab 切换逻辑
        const novaTabs = novaPage.querySelectorAll('.nova-tab');
        const novaScrollWrappers = novaPage.querySelectorAll('.nova-scroll-wrapper');

        novaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                novaTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetGridId = tab.dataset.target;
                novaScrollWrappers.forEach(wrapper => wrapper.classList.remove('active'));
                novaPage.querySelector(`#${targetGridId}`)?.classList.add('active');
            });
        });

        // 选择一个星球 -> 进入疗愈空间
        const novaCards = novaPage.querySelectorAll('.nova-card');
        novaCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardTitle = card.querySelector('h4').textContent;
                localStorage.setItem('selectedHealingSpace', cardTitle);
                window.location.href = 'step5-healing-space.html';
            });
        });
    }

    // --- 页面 5 (疗愈空间) 逻辑 (*** 已重写 ***) ---
    const healingPage = document.getElementById('page-step5-healing');
    if (healingPage) {
        
        // 1. 加载正确的视频
        const selectedSpace = localStorage.getItem('selectedHealingSpace');
        if (selectedSpace) {
            // *** 修正：补全所有视频映射 ***
            const videoMapping = {
                // Calming
                'Mushroom Forest': 'Calming- walking adventure.mp4',
                'Meditation': 'Calming-Meditation.mp4',
                'Reading': 'Calming-reading.mp4',
                // Energetic
                'Skydiving': 'Eergetic- skydiving.mp4', // 沿用您 step4-nova.html 中的拼写
                'Whack-a-mole': 'Eergetic- whack-a-mole.mp4',
                'Diving': 'Eergetic-diving.mp4',
                // Connection
                'Pet Healing': 'Connection- pet healing.png', // 假设视频文件名与图片名一致
                // Music
                'Virtual Idols': 'music healing-二次元偶像.mp4',
                'Action Games': 'music healing-节奏大师.mp4',
                'Lite Music': 'music healing-轻音乐.mp4'
            };

            const videoFile = videoMapping[selectedSpace];
            if (videoFile) {
                const videoSource = document.getElementById('video-source');
                videoSource.src = `../video/${videoFile}`;
                document.getElementById('healing-video').load();
            }
        }

        // 2. 获取所有新的弹窗元素
        const btnShowExit = document.getElementById('btn-show-exit-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        
        // 退出确认弹窗
        const exitModal = document.getElementById('exit-confirm-modal');
        const btnExitConfirm = document.getElementById('btn-exit-confirm');
        const btnExitDismiss = document.getElementById('btn-exit-dismiss');

        // 心情更新弹窗
        const moodModal = document.getElementById('mood-update-modal');
        const moodItems = moodModal.querySelectorAll('.mood-item-popup');
        const btnMoodConfirm = document.getElementById('btn-mood-confirm');
        
        let newSelectedMood = null;

        // 帮助函数：关闭所有弹窗
        function closeAllModals() {
            modalOverlay.classList.remove('active');
            exitModal.classList.remove('active');
            moodModal.classList.remove('active');
        }

        // 3. 绑定事件
        
        // 点击 "Exit Space" 按钮
        btnShowExit.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            exitModal.classList.add('active');
        });

        // 点击 "Dismiss"
        btnExitDismiss.addEventListener('click', closeAllModals);
        // 点击遮罩层本身也会关闭
        modalOverlay.addEventListener('click', closeAllModals);

        // 点击 "Confirm" (退出确认)
        btnExitConfirm.addEventListener('click', () => {
            // 隐藏退出弹窗，显示心情弹窗
            exitModal.classList.remove('active');
            moodModal.classList.add('active');
        });

        // 在心情弹窗中选择一个心情
        moodItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除所有选中
                moodItems.forEach(i => i.classList.remove('selected'));
                // 添加选中
                item.classList.add('selected');
                newSelectedMood = item.dataset.mood;
            });
        });

        // 点击 "Confirm" (心情确认)
        btnMoodConfirm.addEventListener('click', () => {
            if (!newSelectedMood) {
                alert('请选择您现在的心情');
                return;
            }
            
            // 1. 更新 localStorage
            localStorage.setItem('selectedMood', newSelectedMood);
            // 2. 更新右上角 UI
            UserInfo.updateUserInfo();
            // 3. 关闭所有弹窗
            closeAllModals();
            // 4. 返回首页
            window.location.href = 'welcome.html';
        });
    }
});
