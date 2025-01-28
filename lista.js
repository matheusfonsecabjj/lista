// Seleciona o ícone de menu (hamburger) e o menu
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

// Adiciona um evento de clique no ícone do menu
menuToggle.addEventListener('click', () => {
    // Alterna a visibilidade do menu ao adicionar/remover a classe "active"
    menu.classList.toggle('active');
});


let activeFilterColumn = null;

function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.produto}</td>
            <td>${produto.cor}</td>
            <td>${produto.espessura}</td>
            <td>${produto.peso}</td>
            <td>${produto.placas}</td>
            <td>${produto.sku}</td>
            <td>
                <button class="edit-btn" onclick="editarProduto('${produto.sku}')">Editar</button>
                <button onclick="confirmarExclusao('${produto.sku}')">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function confirmarExclusao(sku) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        excluirProduto(sku);
    }
}

function excluirProduto(sku) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(produto => produto.sku !== sku);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    carregarProdutos();
}

function editarProduto(sku) {
    window.location.href = `https://matheusfonsecabjj.github.io/editar/?sku=${sku}`;
}

function toggleFilter(column, event) {
    const dropdown = document.getElementById('dropdown-filters');
    const rect = event.target.getBoundingClientRect();

    if (activeFilterColumn === column) {
        dropdown.style.display = 'none';
        activeFilterColumn = null;
        return;
    }
    activeFilterColumn = column;

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const uniqueValues = [...new Set(produtos.map(produto => produto[column]))];

    const filterOptions = document.getElementById('filterOptions');
    filterOptions.innerHTML = uniqueValues.map(value => `
        <label>
            <input type="checkbox" value="${value}" onchange="aplicarFiltro('${column}')"> ${value}
        </label>
    `).join('');

    dropdown.style.display = 'block';
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
}

function filtrarOpcoes() {
    const termo = document.getElementById('filterSearch').value.toLowerCase();
    const labels = document.querySelectorAll('#filterOptions label');
    labels.forEach(label => {
        label.style.display = label.textContent.toLowerCase().includes(termo) ? 'block' : 'none';
    });
}

function aplicarFiltro(column) {
    const checkboxes = document.querySelectorAll('#filterOptions input[type="checkbox"]');
    const valoresFiltrados = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtosFiltrados = produtos.filter(produto => valoresFiltrados.includes(produto[column]));

    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = '';

    produtosFiltrados.forEach(produto => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.produto}</td>
            <td>${produto.cor}</td>
            <td>${produto.espessura}</td>
            <td>${produto.peso}</td>
            <td>${produto.placas}</td>
            <td>${produto.sku}</td>
            <td>
                <button class="edit-btn" onclick="editarProduto('${produto.sku}')">Editar</button>
                <button onclick="confirmarExclusao('${produto.sku}')">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function selecionarTodos() {
    const checkboxes = document.querySelectorAll('#filterOptions input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = true);
    aplicarFiltro(activeFilterColumn);
}

function gerarRelatorio() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const ws = XLSX.utils.json_to_sheet(produtos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Produtos');
    XLSX.writeFile(wb, 'RelatorioProdutos.xlsx');
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
