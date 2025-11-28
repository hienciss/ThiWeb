const MSSV = '231A010434'; 
const STUDENT_NAME = 'Lê Ngọc Hiển'; 

// Lấy số cuối MSSV để xác định màu chữ (Logic chống AI)
const lastDigit = parseInt(MSSV.slice(-1));
const isEven = lastDigit % 2 === 0;
const LONG_TEXT_COLOR = isEven ? '#dc3545' : '#2196f3'; 

// LocalStorage key
const STORAGE_KEY = `tasks_${MSSV}`;


document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật thông tin sinh viên
    document.getElementById('userName').textContent = STUDENT_NAME;
    document.getElementById('userMSSV').textContent = `MSSV: ${MSSV}`;
    
    // Load tasks từ LocalStorage
    renderTasks();
    
    // Focus vào input
    document.getElementById('taskName').focus();
    
    // Log thông tin để kiểm tra logic
    console.log('=== THÔNG TIN LOGIC CHỐNG AI ===');
    console.log('MSSV:', MSSV);
    console.log('Số cuối MSSV:', lastDigit);
    console.log('Là số chẵn?', isEven);
    console.log('Màu chữ cho text > 10 ký tự:', LONG_TEXT_COLOR);
    console.log('LocalStorage Key:', STORAGE_KEY);
});


/**
 * Load tasks từ LocalStorage
 * @returns {Array} Mảng các task
 */
function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
}

/**
 * Save tasks vào LocalStorage
 * @param {Array} tasks - Mảng các task cần lưu
 */
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


/**
 * Render tất cả tasks lên giao diện
 */
function renderTasks() {
    const tasks = loadTasks();
    
    // Clear tất cả các ô matrix
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`tasks-${i}`).innerHTML = '';
    }

    // Render từng task
    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        
        // Thêm vào đúng ô matrix dựa trên priority
        document.getElementById(`tasks-${task.priority}`).appendChild(taskElement);
    });
}

/**
 * Tạo element HTML cho một task
 * @param {Object} task - Đối tượng task
 * @param {number} index - Index của task trong mảng
 * @returns {HTMLElement} Task element
 */
function createTaskElement(task, index) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.name;
    
    // Logic chống AI: Đổi màu nếu độ dài > 10 ký tự
    if (task.name.length > 10) {
        taskText.style.color = LONG_TEXT_COLOR;
        taskText.style.fontWeight = 'bold';
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '🗑️ Xóa';
    deleteBtn.onclick = () => deleteTask(index);
    
    taskElement.appendChild(taskText);
    taskElement.appendChild(deleteBtn);
    
    return taskElement;
}

/**
 * Thêm task mới
 */
function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const priority = document.getElementById('priority').value;

    // Validate input
    if (!taskName) {
        alert('⚠️ Vui lòng nhập tên công việc!');
        return;
    }

    // Load tasks hiện tại
    const tasks = loadTasks();
    
    // Thêm task mới
    tasks.push({
        name: taskName,
        priority: priority
    });

    // Save và render
    saveTasks(tasks);
    renderTasks();

    // Clear input và focus
    document.getElementById('taskName').value = '';
    document.getElementById('priority').value = '1';
    document.getElementById('taskName').focus();
    
    console.log('✅ Đã thêm task:', taskName, '| Priority:', priority);
}

/**
 * Xóa task
 * @param {number} index - Index của task cần xóa
 */
function deleteTask(index) {
    if (confirm('Bạn có chắc muốn xóa công việc này?')) {
        const tasks = loadTasks();
        const deletedTask = tasks[index];
        
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
        
        console.log('🗑️ Đã xóa task:', deletedTask.name);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const taskNameInput = document.getElementById('taskName');
    if (taskNameInput) {
        taskNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
});
