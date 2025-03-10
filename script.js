function converterParaNumero(valor) {
  if (typeof valor !== 'string' || !valor.trim()) {
    return NaN;
  }
  return parseFloat(valor.replace(",", "."));
}

// Constantes para cálculo
const CONSUMO_MINIMO_KWH = 100;
const CUSTO_FIXO_ILUMINACAO = 60.94;
const PERCENTUAL_CREDITO = 0.7; // Percentual de desconto no crédito da energia excedente

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

  // Energia gerada supõe que 100% do consumo é coberto pelo sistema
  const energiaGerada = consumo;
  
  // Cálculo da energia excedente
  const energiaExcedente = Math.max(energiaGerada - consumo, 0);
  const valorCredito = energiaExcedente * tarifa * PERCENTUAL_CREDITO;

  // Cálculo do custo mensal com energia solar
  let custoComSolar = Math.max((CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO - valorCredito, CONSUMO_MINIMO_KWH * tarifa + CUSTO_FIXO_ILUMINACAO);
  
  // Cálculo do custo sem energia solar
  const custoSemSolar = (consumo * tarifa) + CUSTO_FIXO_ILUMINACAO;

  // Economia mensal e anual
  const economiaMensal = custoSemSolar - custoComSolar;
  const economiaAnual = economiaMensal * 12;

  // Criar arrays para os meses
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  // Criar arrays para custo com e sem solar
  const custoSemSolarArray = Array(12).fill(custoSemSolar);
  const custoComSolarArray = Array(12).fill(custoComSolar);

  // Atualizar o gráfico
  desenharGrafico(consumo, custoSemSolarArray, custoComSolarArray);
}

function mostrarErro(id, mensagem) {
  const erroElemento = document.getElementById(`erro-${id}`);
  erroElemento.innerText = mensagem;
  erroElemento.style.display = 'block';
}

function limparMensagensErro() {
  const mensagensErro = document.querySelectorAll('.error-message');
  mensagensErro.forEach(mensagem => mensagem.style.display = 'none');
}

function desenharGrafico(consumo, custoSemSolar, custoComSolar) {
  const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
  
  // Definir os meses do ano
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  // Destruir gráfico anterior para evitar sobreposição
  if (window.consumoGeracaoChart) {
    window.consumoGeracaoChart.destroy();
  }

  window.consumoGeracaoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Consumo (kWh)',
          data: Array(12).fill(consumo),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Custo Sem Solar (R$)',
          data: custoSemSolar,
          backgroundColor: 'rgba(231, 76, 60, 0.7)',
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 1
        },
        {
          label: 'Custo Com Solar (R$)',
          data: custoComSolar,
          backgroundColor: 'rgba(39, 174, 96, 0.7)',
          borderColor: 'rgba(39, 174, 96, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Comparação de Consumo e Custos Mensais' }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Valor (R$) / Consumo (kWh)' } },
        x: { title: { display: true, text: 'Meses' } }
      }
    }
  });
}
