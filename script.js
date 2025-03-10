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

// Índices de sazonalidade para o consumo no RJ
const indicesSazonalidadeConsumo = [1.04, 1.03, 0.98, 0.99, 0.97, 0.96, 0.98, 1.01, 1.02, 1.03, 1.05, 1.02];

// Fatores de correção para a geração solar no RJ
const fatoresCorrecaoGeracao = [1.08, 1.07, 1.05, 1.02, 0.97, 0.95, 0.94, 0.96, 0.98, 1.03, 1.06, 1.07];

function calcular() {
  limparMensagensErro();

  const consumoBase = converterParaNumero(document.getElementById('consumo').value);
  const tarifa = converterParaNumero(document.getElementById('tarifa').value);

  if (isNaN(consumoBase) || consumoBase <= 0) {
    mostrarErro('consumo', 'Por favor, insira um valor válido.');
    return;
  }
  if (isNaN(tarifa) || tarifa <= 0) {
    mostrarErro('tarifa', 'Por favor, insira um valor válido.');
    return;
  }

  // Aplicar a sazonalidade ao consumo
  const consumoMensal = indicesSazonalidadeConsumo.map(indice => consumoBase * indice);
  
  // Aplicar a sazonalidade à geração de energia
  const geracaoMensal = consumoMensal.map((consumo, mes) => consumo * fatoresCorrecaoGeracao[mes]);

  // Cálculo dos custos sem energia solar
  const custoSemSolar = consumoMensal.map(consumo => (consumo * tarifa) + CUSTO_FIXO_ILUMINACAO);

  // Cálculo dos custos com energia solar e créditos
  const custoComSolar = geracaoMensal.map((geracao, mes) => {
    const energiaExcedente = Math.max(geracao - consumoMensal[mes], 0);
    const valorCredito = energiaExcedente * tarifa * PERCENTUAL_CREDITO;
    return Math.max((CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO - valorCredito, (CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO);
  });

  // Atualizar gráfico com os dados corrigidos
  desenharGrafico(consumoMensal, custoSemSolar, custoComSolar);
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

function desenharGrafico(consumoMensal, custoSemSolar, custoComSolar) {
  const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

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
          data: consumoMensal,
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
        title: { display: true, text: 'Comparação de Consumo e Custos Mensais com Sazonalidade' }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Valor (R$) / Consumo (kWh)' } },
        x: { title: { display: true, text: 'Meses' } }
      }
    }
  });
}
