// Biến game state
let secretNumber;
let attempts = 0;
let guessHistory = [];
let bestScore = localStorage.getItem('bestScore') || null;


/**
 * Khởi tạo game mới
 * Generate số ngẫu nhiên từ 1-100
 */
function initGame() {
    // GIẢI THÍCH LOGIC GENERATE RANDOM:
    // Math.random() tạo số thực từ 0 đến 0.999...
    // Nhân với 100 được: 0 đến 99.999...
    // Cộng 1 được: 1 đến 100.999...
    // Math.floor() làm tròn xuống được: 1 đến 100
    secretNumber = Math.floor(Math.random() * 100) + 1;
    
    attempts = 0;
    guessHistory = [];
    
    updateDisplay();
    hideMessage();
    
    // Clear và focus input
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').focus();
    
    console.log('🎮 Game mới bắt đầu!');
    console.log('🔐 Số bí mật:', secretNumber); // Debug only
}


/**
 * Cập nhật hiển thị (số lần thử, kỷ lục, lịch sử)
 */
function updateDisplay() {
    // Cập nhật stats
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('bestScore').textContent = bestScore || '-';
    
    // Hiển thị lịch sử đoán
    renderHistory();
}

/**
 * Render lịch sử đoán
 */
function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (guessHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999;">Chưa có lịch sử</p>';
        return;
    }
    
    guessHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>Lần ${index + 1}: <strong>${item.guess}</strong></span>
            <span>${item.result}</span>
        `;
        historyList.appendChild(historyItem);
    });
}


/**
 * Hiển thị thông báo
 * @param {string} text - Nội dung thông báo
 * @param {string} type - Loại thông báo (info, success, warning, error)
 */
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}

/**
 * Ẩn thông báo
 */
function hideMessage() {
    document.getElementById('message').style.display = 'none';
}


/**
 * Kiểm tra số đoán của người chơi
 * GIẢI THÍCH LOGIC XỬ LÝ INPUT ĐỂ TRÁNH LỖI:
 */
function checkGuess() {
    const input = document.getElementById('guessInput').value.trim();
    
    // BƯỚC 1: Kiểm tra input rỗng
    if (input === '') {
        showMessage('⚠️ Vui lòng nhập một số!', 'error');
        return;
    }
    
    // BƯỚC 2: Parse sang số nguyên
    const guess = parseInt(input);
    
    // BƯỚC 3: Kiểm tra NaN (Not a Number)
    // Tránh lỗi khi người dùng nhập chữ hoặc ký tự đặc biệt
    if (isNaN(guess)) {
        showMessage('❌ Vui lòng nhập số hợp lệ!', 'error');
        return;
    }
    
    // BƯỚC 4: Validate khoảng 1-100
    // Đảm bảo số nằm trong phạm vi cho phép
    if (guess < 1 || guess > 100) {
        showMessage('⚠️ Số phải nằm trong khoảng 1-100!', 'warning');
        return;
    }
    
    // Tăng số lần thử
    attempts++;
    
    // BƯỚC 5: So sánh với số bí mật
    let result;
    
    if (guess < secretNumber) {
        // Số đoán quá thấp
        result = '⬆️ Quá thấp';
        showMessage(`📊 ${guess} quá thấp! Hãy thử số lớn hơn.`, 'info');
        
    } else if (guess > secretNumber) {
        // Số đoán quá cao
        result = '⬇️ Quá cao';
        showMessage(`📊 ${guess} quá cao! Hãy thử số nhỏ hơn.`, 'info');
        
    } else {
        // ĐOÁN ĐÚNG!
        result = '🎉 CHÍNH XÁC!';
        handleWin();
    }
    
    // Lưu vào lịch sử
    guessHistory.push({ guess, result });
    
    // Cập nhật hiển thị
    updateDisplay();
    
    // Clear input và focus
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').focus();
}

/**
 * Xử lý khi người chơi đoán đúng
 */
function handleWin() {
    // Thông báo chiến thắng
    let message = `🎉 Chúc mừng! Bạn đã đoán đúng số ${secretNumber} sau ${attempts} lần thử!`;
    
    // Kiểm tra và cập nhật kỷ lục
    if (!bestScore || attempts < bestScore) {
        bestScore = attempts;
        localStorage.setItem('bestScore', bestScore);
        message += ' 🏆 KỶ LỤC MỚI!';
    }
    
    showMessage(message, 'success');
    
    // Hiệu ứng confetti
    createConfetti();
}

/**
 * Reset game (chơi lại)
 */
function resetGame() {
    if (confirm('Bạn có chắc muốn chơi lại?')) {
        initGame();
    }
}


/**
 * Tạo hiệu ứng confetti khi thắng
 */
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = [
        '#ff0000', // Đỏ
        '#00ff00', // Xanh lá
        '#0000ff', // Xanh dương
        '#ffff00', // Vàng
        '#ff00ff', // Hồng
        '#00ffff', // Cyan
        '#ffa500', // Cam
        '#ff1493'  // Hồng đậm
    ];
    
    // Tạo 100 mảnh confetti
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random vị trí ngang (0-100%)
            confetti.style.left = Math.random() * 100 + '%';
            
            // Random màu sắc
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Random thời gian bắt đầu
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            // Random thời gian rơi (2-4 giây)
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(confetti);
            
            // Xóa element sau khi animation kết thúc
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20); // Delay giữa các mảnh confetti
    }
}


// Khởi tạo game khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

// Cho phép nhấn Enter để đoán
document.addEventListener('DOMContentLoaded', function() {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkGuess();
            }
        });
    }
});
