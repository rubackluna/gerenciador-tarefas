// Selecionando elementos do DOM
const inputTarefa = document.getElementById('inputTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaTarefas = document.getElementById('listaTarefas');
const mensagemVazia = document.getElementById('mensagemVazia');
const totalTarefas = document.getElementById('totalTarefas');
const tarefasConcluidas = document.getElementById('tarefasConcluidas');

// Array para armazenar tarefas
let tarefas = [];

// Chave do localStorage
const CHAVE_LOCAL_STORAGE = 'tarefas_app';

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    carregarTarefasDoLocalStorage();
    renderizarLista();
    atualizarEstatisticas();
});

// ==================== EVENT LISTENERS ====================
btnAdicionar.addEventListener('click', adicionarTarefa);

inputTarefa.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        adicionarTarefa();
    }
});

// ==================== FUNÇÕES PRINCIPAIS ====================

/**
 * Adiciona uma nova tarefa à lista
 */
function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    // Validação
    if (texto === '') {
    alert('Por favor, digite uma tarefa antes de adicionar!');  // Mudou
    inputTarefa.focus();
    return;
    }

    // Criar objeto de tarefa
    const tarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
    };

    // Adicionar ao array
    tarefas.push(tarefa);

    // Salvar no localStorage
    salvarTarefasNoLocalStorage();

    // Limpar input
    inputTarefa.value = '';
    inputTarefa.focus();

    // Atualizar interface
    renderizarLista();
    atualizarEstatisticas();
}

/**
 * Remove uma tarefa pelo ID
 */
function removerTarefa(id) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        salvarTarefasNoLocalStorage();
        renderizarLista();
        atualizarEstatisticas();
    }
}

/**
 * Marca/desmarcar uma tarefa como concluída
 */
function marcarConcluida(id) {
    tarefas = tarefas.map(tarefa => 
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    salvarTarefasNoLocalStorage();
    renderizarLista();
    atualizarEstatisticas();
}

/**
 * Renderiza a lista de tarefas na tela
 */
function renderizarLista() {
    listaTarefas.innerHTML = '';

    if (tarefas.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    }

    mensagemVazia.style.display = 'none';

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.className = `tarefa ${tarefa.concluida ? 'concluida' : ''}`;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${tarefa.concluida ? 'checked' : ''}
                onchange="marcarConcluida(${tarefa.id})"
            >
            <span class="texto-tarefa">${escaparHTML(tarefa.texto)}</span>
            <button class="btn-remover" onclick="removerTarefa(${tarefa.id})">X</button>
        `;

        listaTarefas.appendChild(li);
    });
}

/**
 * Atualiza as estatísticas (total e concluídas)
 */
function atualizarEstatisticas() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;

    totalTarefas.textContent = total;
    tarefasConcluidas.textContent = concluidas;
}

// ==================== FUNÇÕES DE ARMAZENAMENTO ====================

/**
 * Salva as tarefas no localStorage
 */
function salvarTarefasNoLocalStorage() {
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(tarefas));
}

/**
 * Carrega as tarefas do localStorage
 */
function carregarTarefasDoLocalStorage() {
    const tarefasSalvas = localStorage.getItem(CHAVE_LOCAL_STORAGE);
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
}

/**
 * Limpa todas as tarefas (função auxiliar)
 */
function limparTodasAsTarefas() {
    if (confirm('Deseja remover TODAS as tarefas? Esta ação não pode ser desfeita!')) {
        tarefas = [];
        salvarTarefasNoLocalStorage();
        renderizarLista();
        atualizarEstatisticas();
    }
}

// ==================== FUNÇÕES UTILITÁRIAS ====================

/**
 * Escapa caracteres HTML para evitar injeção XSS
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Detecta preferência do sistema
function aplicarTemaEscuro() {
    const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefereEscuro) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Executa ao carregar
document.addEventListener('DOMContentLoaded', aplicarTemaEscuro);