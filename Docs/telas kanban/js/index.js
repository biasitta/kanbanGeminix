// --- Dados Iniciais ---
let users = ['João da Dores de parto', 'Maria Silva'];

let tasks = [
  { id: '00001', title: 'Cards de tarefa 1', status: 'todo', assignee: 'João da Dores de parto' },
  { id: '00005', title: 'Cards de tarefa 2', status: 'doing', assignee: 'João da Dores de parto' }
];

let currentEditId = null;

// --- Funções Auxiliares ---
function generateTaskId() {
  return String(tasks.length + 1).padStart(5, '0');
}

function clearInputs(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function updateUserDropdowns() {
  const selects = [
    document.getElementById('input-executante'),
    document.getElementById('modal-executante')
  ];

  selects.forEach(select => {
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = '';

    if (select.id === 'input-executante') {
      const defaultOption = new Option('Selecione um executante...', '', true, true);
      defaultOption.disabled = true;
      select.appendChild(defaultOption);
    }

    users.forEach(user => {
      select.appendChild(new Option(user, user));
    });

    if (select.id !== 'input-executante' && users.includes(currentVal)) {
      select.value = currentVal;
    }
  });
}

// --- Menu Dropdown ---
function toggleMenu() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches('.menu-btn')) {
    document.querySelectorAll(".dropdown-content.show")
      .forEach(dropdown => dropdown.classList.remove('show'));
  }
};

// --- Criar Usuário (usuario.html) ---
function createUser() {
  const name = document.getElementById('new-user-name').value.trim();
  if (!name) return alert('Digite o nome do usuário.');

  users.push(name);
  alert(`✅ Usuário "${name}" cadastrado com sucesso!`);
  window.location.href = "../index.html"; // volta para o Kanban
}

// --- Criar Tarefa (tarefa.html) ---
function createTask() {
  const title = document.getElementById('input-titulo').value.trim();
  const assignee = document.getElementById('input-executante').value;

  if (!assignee) return alert('Escolha um executante.');
  if (!title) return alert('Digite um título para a tarefa.');

  const newTask = {
    id: generateTaskId(),
    title,
    status: 'todo',
    assignee
  };

  tasks.push(newTask);
  clearInputs('input-titulo', 'input-desc');
  window.location.href = "../index.html"; // volta para o Kanban
}

// --- Renderizar Quadro Kanban (index.html) ---
function renderBoard() {
  const columns = {
    todo: document.getElementById('col-todo'),
    doing: document.getElementById('col-doing'),
    done: document.getElementById('col-done')
  };

  if (!columns.todo) return; // só roda no index.html

  Object.entries(columns).forEach(([key, col]) => {
    col.innerHTML = `<h3>${col.querySelector('h3').innerText}</h3>`;
  });

  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${task.id}</strong>
      <div style="margin: 5px 0;">${task.title}</div>
      <small>👤 ${task.assignee}</small>
    `;
    card.onclick = () => openEditModal(task.id);

    if (columns[task.status]) {
      columns[task.status].appendChild(card);
    }
  });
}

// --- Modal Edição (index.html) ---
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  updateUserDropdowns();
  currentEditId = id;

  document.getElementById('modal-id').innerText = task.id;
  document.getElementById('modal-titulo').value = task.title;
  document.getElementById('modal-status').value = task.status;
  document.getElementById('modal-executante').value = task.assignee;

  document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEdit() {
  const taskIndex = tasks.findIndex(t => t.id === currentEditId);
  if (taskIndex > -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: document.getElementById('modal-titulo').value.trim(),
      status: document.getElementById('modal-status').value,
      assignee: document.getElementById('modal-executante').value
    };
  }
  closeModal();
  renderBoard();
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  updateUserDropdowns();

  // Se estiver no Kanban
  if (document.getElementById('col-todo')) {
    renderBoard();
  }

  // Se estiver na página de Nova Tarefa
  if (document.getElementById('input-executante')) {
    updateUserDropdowns();
  }
});

