function converterParaNumero(valor) {
  return parseFloat(valor.replace(",", "."));
}

function calcular() {
  limparMensagensErro();

  const consumo = converterParaNumero(document.getElementById('consumo').value);
  const tarifa = converterParaNumero(document.getElementById('tarifa').value);

  if (isNaN(consumo) || consumo <= 0) {
    mostrarErro('consumo', 'Por favor, insira um valor válido.');
    return;
  }
  if (isNaN(tarifa) || tarifa <= 0) {
    mostrarErro('tarifa', 'Por favor, insira um valor válido.');
    return;
  }

  const economiaAnual = consumo * tarifa * 12;
  document.getElementById('graficoConsumoGeracao').classList.add('show');
  document.getElementById('graficoEconomiaMensal').classList.add('show');

  desenharGrafico(economiaAnual);
}

function mostrarErro(id, mensagem) {
  const erroElemento = document.getElementById(`erro-${id}`);
  erroElemento.innerText = mensagem;
  erroElemento.classList.add('show');
}

function limparMensagensErro() {
  const mensagensErro = document.querySelectorAll('.error-message');
  mensagensErro.forEach(mensagem => mensagem.classList.remove('show'));
}

function desenharGrafico(valor) {
  const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Economia Anual'],
      datasets: [{
        label: 'R$ Economizados',
        data: [valor],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
