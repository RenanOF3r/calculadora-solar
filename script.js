function converterParaNumero(valor) {
  if (typeof valor !== 'string' || !valor.trim()) {
    return NaN;
  }
  return parseFloat(valor.replace(",", "."));
}

const CONSUMO_MINIMO_KWH = 100;
const CUSTO_FIXO_ILUMINACAO = 60.94;
const PERCENTUAL_CREDITO = 0.7; // Considerando um desconto médio no crédito

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

  const economiaMensal = [];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  for (let i = 0; i < 12; i++) {
    // Simulando pequenas variações mensais no consumo
    const consumoMensal = consumo * (0.9 + Math.random() * 0.2);
    const energiaGerada = consumoMensal;
    const energiaExcedente = Math.max(energiaGerada - consumoMensal, 0);
    const valorCredito = energiaExcedente * tarifa * PERCENTUAL_CREDITO;
    const custoComSolar = Math.max((CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO - valorCredito, CONSUMO_MINIMO_KWH * tarifa + CUSTO_FIXO_ILUMINACAO);
    const custoSemSolar = (consumoMensal * tarifa) + CUSTO_FIXO_ILUMINACAO;
    economiaMensal.push(custoSemSolar - custoComSolar);
  }

  document.getElementById('graficoConsumoGeracao').classList.add('show');
  document.getElementById('graficoEconomiaMensal').classList.add('show');

  desenharGrafico(meses, economiaMensal);
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

function desenharGrafico(labels, valores) {
  const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'R$ Economizados por Mês',
        data: valores,
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
