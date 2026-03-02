// Task Data Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { id: 1, name: 'Java Homework', priority: 'High', status: 'Progress' },
    { id: 2, name: 'Korean Homework', priority: 'Medium', status: 'Progress' },
    { id: 3, name: 'Java Project', priority: 'Low', status: 'Progress' }
];

let currentEditId = null;
let currentDeleteId = null;

// DOM Elements
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const modalOverlay = document.getElementById('modalOverlay');
const taskModal = document.getElementById('taskModal');
const deleteModal = document.getElementById('deleteModal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelBtn');
const closeModalBtn = document.getElementById('closeModal');
const deleteConfirmBtn = document.getElementById('confirmDelete');
const deleteCancelBtn = document.getElementById('cancelDelete');

// Form Inputs
const inputTaskId = document.getElementById('taskId');
const inputTaskName = document.getElementById('taskName');
const inputTaskPriority = document.getElementById('taskPriority');
const inputTaskStatus = document.getElementById('taskStatus');
const priorityButtons = document.querySelectorAll('.priority-btn');
const statusButtons = document.querySelectorAll('.status-btn');

// --- Initialization ---
function init() {
    renderTasks();
    setupEventListeners();
}

// --- Render Tasks ---
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'bg-white grid grid-cols-4 items-center rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200';
        
        // Priority Color Mapping
        const priorityColors = {
            'High': 'text-red-600',
            'Medium': 'text-amber-500',
            'Low': 'text-emerald-500'
        };

        row.innerHTML = `
            <span class="text-slate-800 font-bold text-xl ml-4">${task.name}</span>
            <span class="${priorityColors[task.priority]} font-bold text-xl text-center">${task.priority}</span>
            <span class="text-slate-800 font-bold text-xl text-center">${task.status}</span>
            <div class="flex justify-end gap-4 mr-4">
                <button onclick="editTask(${task.id})" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onclick="confirmDelete(${task.id})" class="text-red-500 hover:text-red-700 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        taskList.appendChild(row);
    });
    
    // Save to LocalStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- Event Listeners ---
function setupEventListeners() {
    // Open Add Task Modal
    addTaskBtn.addEventListener('click', () => {
        resetForm();
        showModal('add');
    });

    // Close Modal
    [closeModalBtn, modalOverlay, deleteCancelBtn, cancelEditBtn].forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el === closeModalBtn || el === deleteCancelBtn || el === cancelEditBtn) {
                hideModal();
            }
        });
    });

    // Priority Button Selection
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            inputTaskPriority.value = btn.dataset.priority;
            updateButtonStyles(priorityButtons, btn);
        });
    });

    // Status Button Selection
    statusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            inputTaskStatus.value = btn.dataset.status;
            updateButtonStyles(statusButtons, btn);
        });
    });

    // Form Submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskData = {
            id: currentEditId || Date.now(),
            name: inputTaskName.value,
            priority: inputTaskPriority.value,
            status: inputTaskStatus.value
        };

        if (currentEditId) {
            tasks = tasks.map(t => t.id === currentEditId ? taskData : t);
        } else {
            tasks.push(taskData);
        }

        renderTasks();
        hideModal();
    });

    // Delete Confirmation
    deleteConfirmBtn.addEventListener('click', () => {
        if (currentDeleteId) {
            tasks = tasks.filter(t => t.id !== currentDeleteId);
            renderTasks();
            hideModal();
        }
    });
}

// --- Helper Functions ---

function showModal(type) {
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    
    // Select correct modal content
    const activeModal = (type === 'add' || type === 'edit') ? taskModal : deleteModal;
    const inactiveModal = (type === 'delete') ? taskModal : deleteModal;
    
    inactiveModal.classList.add('hidden');
    activeModal.classList.remove('hidden');

    // Title & Context setup
    if (type === 'add' || type === 'edit') {
        if (type === 'edit') {
            modalTitle.innerText = 'Edit Task';
            submitBtn.innerText = 'Update';
            cancelEditBtn.classList.remove('hidden');
            submitBtn.classList.remove('flex-1');
        } else {
            modalTitle.innerText = 'Add Task';
            submitBtn.innerText = 'Add';
            cancelEditBtn.classList.add('hidden');
            submitBtn.classList.add('flex-1');
        }
    }

    // Trigger animations after reflow
    setTimeout(() => {
        activeModal.classList.remove('scale-95', 'opacity-0');
        activeModal.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hideModal() {
    const activeModal = !taskModal.classList.contains('hidden') ? taskModal : deleteModal;
    
    activeModal.classList.remove('scale-100', 'opacity-100');
    activeModal.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modalOverlay.classList.remove('flex');
        modalOverlay.classList.add('hidden');
        taskModal.classList.add('hidden');
        deleteModal.classList.add('hidden');
        currentEditId = null;
        currentDeleteId = null;
    }, 300);
}

function resetForm() {
    taskForm.reset();
    inputTaskId.value = '';
    currentEditId = null;
    
    // Reset button UI
    updateButtonStyles(priorityButtons, [...priorityButtons].find(b => b.dataset.priority === 'Medium'));
    updateButtonStyles(statusButtons, [...statusButtons].find(b => b.dataset.status === 'Progress'));
    inputTaskPriority.value = 'Medium';
    inputTaskStatus.value = 'Progress';
}

function updateButtonStyles(buttons, activeBtn) {
    buttons.forEach(btn => {
        if (btn === activeBtn) {
            // Active Styles (Match Color based on data)
            const p = btn.dataset.priority || btn.dataset.status;
            if (p === 'High') { btn.className = 'priority-btn border-2 border-red-500 bg-red-500 text-white font-semibold py-2 px-6 rounded-2xl flex-1'; }
            else if (p === 'Medium') { btn.className = 'priority-btn border-2 border-amber-500 bg-amber-500 text-white font-semibold py-2 px-6 rounded-2xl flex-1'; }
            else if (p === 'Low') { btn.className = 'priority-btn border-2 border-emerald-500 bg-emerald-500 text-white font-semibold py-2 px-6 rounded-2xl flex-1'; }
            else { btn.className = 'status-btn border-2 border-[#00BCD4] bg-[#00BCD4] text-white font-semibold py-2 px-6 rounded-2xl flex-1'; }
        } else {
            // Inactive Styles
            const p = btn.dataset.priority || btn.dataset.status;
            if (p === 'High') { btn.className = 'priority-btn border-2 border-red-500 text-red-500 font-semibold py-2 px-6 rounded-2xl hover:bg-red-50 transition-colors duration-200 flex-1'; }
            else if (p === 'Medium') { btn.className = 'priority-btn border-2 border-amber-500 text-amber-500 font-semibold py-2 px-6 rounded-2xl hover:bg-amber-50 transition-colors duration-200 flex-1'; }
            else if (p === 'Low') { btn.className = 'priority-btn border-2 border-emerald-500 text-emerald-500 font-semibold py-2 px-6 rounded-2xl hover:bg-emerald-50 transition-colors duration-200 flex-1'; }
            else { btn.className = 'status-btn border-2 border-[#00BCD4] text-[#00BCD4] font-semibold py-2 px-6 rounded-2xl hover:bg-[#E0F7FA] transition-colors duration-200 flex-1'; }
        }
    });
}

// Expose to window for onclick handlers
window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        inputTaskName.value = task.name;
        inputTaskPriority.value = task.priority;
        inputTaskStatus.value = task.status;
        
        updateButtonStyles(priorityButtons, [...priorityButtons].find(b => b.dataset.priority === task.priority));
        updateButtonStyles(statusButtons, [...statusButtons].find(b => b.dataset.status === task.status));
        
        showModal('edit');
    }
};

window.confirmDelete = function(id) {
    currentDeleteId = id;
    showModal('delete');
};

// Start the app
init();