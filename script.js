
let participantes = [];

// 🔹 Ler o JSON do servidor
async function carregarParticipantes() {
  try {
    const resposta = await fetch('https://pontos-amber.vercel.app/dados.json');
    participantes = await resposta.json();
    renderRanking();
  } catch (erro) {
    console.error("Erro ao carregar participantes:", erro);
  }
}

// 🔹 Salvar o JSON atualizado no servidor
async function salvarParticipantes() {
  try {
    await fetch('https://pontos-amber.vercel.app/dados.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participantes)
    });
  } catch (erro) {
    console.error("Erro ao salvar participantes:", erro);
  }
}

// 🔹 Exibir o ranking nas duas tabelas
function renderRanking() {
  // Ordena por pontuação para definir as posições
  participantes.sort((a, b) => a.num - b.num);//.sort((a, b) => b.pontuacao - a.pontuacao);
  const total = participantes.length;
  const qtdTop = Math.ceil(total * 0.3); // 30% dos primeiros

  // Divide os grupos
  const topGroup = participantes.slice(0, qtdTop);//.sort((a, b) => a.num - b.num);
  const restanteGroup = participantes.slice(qtdTop).sort((a, b) => b.pontuacao - a.pontuacao);;

  const topBody = document.getElementById('topBody');
  const restanteBody = document.getElementById('restanteBody');
  topBody.innerHTML = '';
  restanteBody.innerHTML = '';

  // Preenche a primeira tabela (30%)
  topGroup.forEach((p, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.num}</td>
      <td>${p.nome}</td>
      <td>${p.pontuacao}</td>
    `;
    topBody.appendChild(row);
  });

  // Ordena o restante pela pontuação novamente
  restanteGroup.sort((a, b) => b.pontuacao - a.pontuacao);

  // Preenche a segunda tabela (restante)
  restanteGroup.forEach((p, i) => {
    const row = document.createElement('tr');
    // Destacar os melhores classificados do restante (igual qtdTop)
    if (i < qtdTop) row.classList.add('destaque');

    row.innerHTML = `
      <td>${qtdTop + i + 1}</td>
      <td>${p.num}</td>
      <td>${p.nome}</td>
      <td>${p.pontuacao}</td>
    `;
    restanteBody.appendChild(row);
  });

  document.getElementById('totalParticipantes').textContent = total;
}

// 🔹 Manipular o envio do formulário
async function handleFormSubmit(event) {
  event.preventDefault();

  const numInput = document.getElementById('num');
  const pontosInput = document.getElementById('pontos');
  const num = parseInt(numInput.value);
  const pontos = parseInt(pontosInput.value, 10);

  if (num && pontos >= 0) {
    const participante = participantes.find(p => p.num == num);

    if (participante) {
      participante.pontuacao = pontos;
      alert(`Pontuação de ${participante.nome} atualizada.`);
    } else {
      alert(`Número ${num} não encontrado no sistema!`);
    }

    renderRanking();
    await salvarParticipantes();
  } else {
    alert('Preencha os campos corretamente.');
  }
}

document.getElementById('meritForm').addEventListener('submit', handleFormSubmit);
document.addEventListener('DOMContentLoaded', carregarParticipantes);

// 🔹 Função para alternar exibição das tabelas
function configurarVisibilidadeTabelas() {
  const btnAntiguidade = document.getElementById("antiguidade");
  const btnMerecimento = document.getElementById("merecimento");
  const blocoAntiguidade = document.getElementById("bloco-antiguidade");
  const blocoMerecimento = document.getElementById("bloco-merecimento");

  // Inicialmente: mostra apenas uma (opcional)
  blocoAntiguidade.style.display = "block";
  blocoMerecimento.style.display = "none";

  btnAntiguidade.addEventListener("click", () => {
    blocoAntiguidade.style.display = "block";
    blocoMerecimento.style.display = "none";
  });

  btnMerecimento.addEventListener("click", () => {
    blocoAntiguidade.style.display = "none";
    blocoMerecimento.style.display = "block";
  });
}

// 🔹 Inicializar junto com o carregamento dos dados
document.addEventListener("DOMContentLoaded", () => {
  carregarParticipantes();
  configurarVisibilidadeTabelas();
});
