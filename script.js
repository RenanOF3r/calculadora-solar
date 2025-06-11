document.addEventListener('DOMContentLoaded', () => {
  const estado = document.getElementById('estado');
  const cidade = document.getElementById('cidade');
  const gastoMensal = document.getElementById('gasto-mensal');
  const tarifa = document.getElementById('tarifa');
  const form = document.getElementById('calculadora-form');

  const resultado = document.getElementById('resultado-calculo');
  const graficosContainer = document.getElementById('graficos-resultado-container');

  const elementos = {
    investimento: document.getElementById('resultado-investimento'),
    economiaMes: document.getElementById('resultado-economia-mes'),
    economiaTotal: document.getElementById('resultado-economia-total'),
    payback: document.getElementById('resultado-payback'),
    co2: document.getElementById('resultado-co2'),
    arvores: document.getElementById('resultado-arvores'),
    kmCarro: document.getElementById('resultado-km-carro'),
    potencia: document.getElementById('resultado-potencia'),
    paineis: document.getElementById('resultado-paineis'),
    geracaoAnual: document.getElementById('resultado-geracao-anual'),
    area: document.getElementById('resultado-area'),
    peso: document.getElementById('resultado-peso')
  };

  const dadosCidades = {
    RJ: [{ nome: 'Rio de Janeiro', hsp: 4.55 }, { nome: 'Niterói', hsp: 4.6 }],
    SP: [{ nome: 'São Paulo', hsp: 4.7 }, { nome: 'Campinas', hsp: 4.85 }],
    MG: [{ nome: 'Belo Horizonte', hsp: 5.1 }],
    BA: [{ nome: 'Salvador', hsp: 5.4 }],
    CE: [{ nome: 'Fortaleza', hsp: 5.9 }]
  };

  let grafico1, grafico2, grafico3;

  estado.addEventListener('change', () => {
    cidade.innerHTML = '<option value="">Selecione...</option>';
    cidade.disabled = true;
    if (dadosCidades[estado.value]) {
      dadosCidades[estado.value].forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.hsp;
        opt.textContent = `${c.nome} (HSP: ${c.hsp})`;
        cidade.appendChild(opt);
      });
      cidade.disabled = false;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const hsp = parseFloat(cidade.value);
    const gasto = parseFloat(gastoMensal.value);
    const valorTarifa = parseFloat(tarifa.value);

    if (!hsp || !gasto || !valorTarifa) return;

    const consumoMensal = gasto / valorTarifa;
    const energiaDiaria = consumoMensal / 30;
    const energiaCorrigida = energiaDiaria / 0.8;
    const potenciaKWp = energiaCorrigida / hsp;

    const numPaineis = Math.ceil((potenciaKWp * 1000) / 550);
    const areaTotal = numPaineis * 2.5;
    const pesoTotal = numPaineis * 25;

    const geracaoAnual = potenciaKWp * hsp * 365 * 0.8;
    const geracaoMensal = geracaoAnual / 12;
    const economiaMensal = Math.min(geracaoMensal, consumoMensal) * valorTarifa;
    const economiaAnual = economiaMensal * 12;
    const economiaTotal = economiaAnual * 25;
    const investimento = potenciaKWp * 1000 * 3.5;
    const paybackAnos = investimento / economiaAnual;

    const paybackAnosInt = Math.floor(paybackAnos);
    const paybackMeses = Math.round((paybackAnos - paybackAnosInt) * 12);
    const paybackTexto = `${paybackAnosInt} ano${paybackAnosInt !== 1 ? 's' : ''} e ${paybackMeses} mês${paybackMeses !== 1 ? 'es' : ''}`;

    const co2 = geracaoAnual * 0.075;
    const arvores = (co2 / 1000) * 7;
    const kmCarro = geracaoAnual * 5;

    // Atualizar os resultados
    elementos.investimento.textContent = formatarMoeda(investimento);
    elementos.economiaMes.textContent = formatarMoeda(economiaMensal);
    elementos.economiaTotal.textContent = formatarMoeda(economiaTotal);
    elementos.payback.textContent = paybackTexto;
    elementos.co2.textContent = `${co2.toFixed(0)} kg`;
    elementos.arvores.textContent = `${arvores.toFixed(0)} árvores`;
    elementos.kmCarro.textContent = `${kmCarro.toFixed(0)} km`;
    elementos.potencia.textContent = `${potenciaKWp.toFixed(2)} kWp`;
    elementos.paineis.textContent = numPaineis;
    elementos.geracaoAnual.textContent = `${geracaoAnual.toFixed(0)} kWh`;
    elementos.area.textContent = `${areaTotal.toFixed(2)} m²`;
    elementos.peso.textContent = `${pesoTotal.toFixed(0)} kg`;

    resultado.classList.remove('hidden');
    graficosContainer.classList.remove('hidden');

    criarGraficoConsumoMensal(consumoMensal, geracaoMensal);
    criarGraficoPizza(consumoMensal, geracaoMensal);
    criarGraficoPayback(investimento, economiaAnual);
  });

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function criarGraficoConsumoMensal(consumo, geracao) {
    if (grafico1) grafico1.destroy();
    const ctx = document.getElementById('graficoConsumoComparativo').getContext('2d');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const variacao = [0.95, 0.97, 1, 1.03, 1.05, 1.08, 1.1, 1.05, 1, 0.98, 0.96, 0.94];

    const consumoMensal = variacao.map(v => consumo * v);
    const geracaoMensal = variacao.map(v => geracao * v);

    grafico1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Consumo (kWh)',
            data: consumoMensal,
            backgroundColor: '#e74c3c'
          },
          {
            label: 'Geração (kWh)',
            data: geracaoMensal,
            backgroundColor: '#2ecc71'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Consumo vs. Geração Mensal (com sazonalidade)' }
        }
      }
    });
  }

  function criarGraficoPizza(consumo, geracao) {
    if (grafico2) grafico2.destroy();
    const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
    grafico2 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Consumo Médio', 'Geração Estimada'],
        datasets: [{
          data: [consumo, geracao],
          backgroundColor: ['#f39c12', '#3498db']
        }]
      }
    });
  }

  function criarGraficoPayback(investimento, economiaAnual) {
    if (grafico3) grafico3.destroy();
    const ctx = document.getElementById('graficoPaybackAcumulado').getContext('2d');
    const anos = Array.from({ length: 11 }, (_, i) => i);
    const economia = anos.map(i => economiaAnual * i);
    const saldo = economia.map(e => e - investimento);
    grafico3 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: anos.map(a => `Ano ${a}`),
        datasets: [{
          label: 'Saldo acumulado (R$)',
          data: saldo,
          borderColor: '#2b6cb0',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Payback ao Longo dos Anos'
          }
        },
        scales: {
          y: {
            ticks: {
              callback: value => formatarMoeda(value)
            }
          }
        }
      }
    });
  }
});
