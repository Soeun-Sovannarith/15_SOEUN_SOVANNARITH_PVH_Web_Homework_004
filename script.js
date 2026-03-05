let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { id: 1, name: 'Java Homework', priority: 'High', status: 'Progress' },
    { id: 2, name: 'Korean Homework', priority: 'Medium', status: 'Progress' },
    { id: 3, name: 'Java Project', priority: 'Low', status: 'Progress' }
];

let currentEditId = null;
let currentDeleteId = null;

const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskDialog = document.getElementById('taskDialog');
const deleteDialog = document.getElementById('deleteDialog');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelBtn');
const deleteConfirmBtn = document.getElementById('confirmDelete');

const inputTaskId = document.getElementById('taskId');
const inputTaskName = document.getElementById('taskName');

function init() {
    renderTasks();
    setupEventListeners();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'bg-white grid grid-cols-4 items-center rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200';
        
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
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function setupEventListeners() {
    addTaskBtn.addEventListener('click', () => {
        resetForm();
        showModal('add');
    });

    // No-JS closing handled by form method="dialog" in HTML
    
    // Optional: Close on backdrop click
    [taskDialog, deleteDialog].forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
        });
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!inputTaskName.value.trim()) {
            alert('Please input the task name');
            return;
        }

        const formData = new FormData(taskForm);
        const taskData = {
            id: currentEditId || Date.now(),
            name: inputTaskName.value,
            priority: formData.get('priority'),
            status: formData.get('status')
        };

        if (currentEditId) {
            tasks = tasks.map(t => t.id === currentEditId ? taskData : t);
        } else {
            tasks.unshift(taskData);
        }

        renderTasks();
        hideModal();
    });

    deleteConfirmBtn.addEventListener('click', () => {
        if (currentDeleteId) {
            tasks = tasks.filter(t => t.id !== currentDeleteId);
            renderTasks();
            hideModal();
        }
    });
}

function showModal(type) {
    const activeDialog = (type === 'add' || type === 'edit') ? taskDialog : deleteDialog;
    
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

    activeDialog.showModal();
}

function hideModal() {
    taskDialog.close();
    deleteDialog.close();
    currentEditId = null;
    currentDeleteId = null;
}

function resetForm() {
    taskForm.reset();
    inputTaskId.value = '';
    currentEditId = null;
}

window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        inputTaskName.value = task.name;
        
        // Set radio buttons
        const priorityRadio = taskForm.querySelector(`input[name="priority"][value="${task.priority}"]`);
        const statusRadio = taskForm.querySelector(`input[name="status"][value="${task.status}"]`);
        if (priorityRadio) priorityRadio.checked = true;
        if (statusRadio) statusRadio.checked = true;
        
        showModal('edit');
    }
};

window.confirmDelete = function(id) {
    currentDeleteId = id;
    showModal('delete');
};

init();