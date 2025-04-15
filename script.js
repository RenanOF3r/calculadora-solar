// --- Seleção de Elementos do DOM ---
const formCalculadora = document.getElementById('calculadora-form');
const selectEstado = document.getElementById('estado');
const selectCidade = document.getElementById('cidade');
const inputGastoMensal = document.getElementById('gasto-mensal');
const outputGastoMensalValor = document.getElementById('gasto-mensal-valor');
const inputTarifa = document.getElementById('tarifa');
const spanConsumoEstimado = document.getElementById('consumo-estimado');
const secaoResultado = document.getElementById('resultado-calculo');
const botaoCalcular = document.getElementById('botao-calcular'); // Embora o submit do form seja capturado

// Elementos da seção de resultados (para preenchimento futuro)
const resultadoInvestimento = document.getElementById('resultado-investimento');
const resultadoEconomiaMes = document.getElementById('resultado-economia-mes');
const resultadoEconomiaTotal = document.getElementById('resultado-economia-total');
const resultadoPayback = document.getElementById('resultado-payback');
const resultadoCO2 = document.getElementById('resultado-co2');
const resultadoArvores = document.getElementById('resultado-arvores');
const resultadoKmCarro = document.getElementById('resultado-km-carro');
const resultadoPotencia = document.getElementById('resultado-potencia');
const resultadoPaineis = document.getElementById('resultado-paineis');
const resultadoGeracaoAnual = document.getElementById('resultado-geracao-anual');
const resultadoArea = document.getElementById('resultado-area');
const resultadoPeso = document.getElementById('resultado-peso');

// --- Dados (Exemplo - PRECISA SER EXPANDIDO!) ---
const dadosCidadesPorEstado = {
    'RJ': [
        { nome: 'Rio de Janeiro', hsp: 4.55 },
        { nome: 'Niterói', hsp: 4.60 },
        { nome: 'Duque de Caxias', hsp: 4.50 }
    ],
    'SP': [
        { nome: 'São Paulo', hsp: 4.30 },
        { nome: 'Campinas', hsp: 4.45 },
        { nome: 'Guarulhos', hsp: 4.25 }
    ],
    'MG': [
        { nome: 'Belo Horizonte', hsp: 4.70 },
        { nome: 'Uberlândia', hsp: 5.10 },
        { nome: 'Contagem', hsp: 4.65 }
    ],
     'BA': [
        { nome: 'Salvador', hsp: 5.20 },
        { nome: 'Feira de Santana', hsp: 5.30 }
    ],
     'CE': [
        { nome: 'Fortaleza', hsp: 5.80 },
        { nome: 'Caucaia', hsp: 5.75 }
    ]
    // Adicionar mais estados e cidades com seus respectivos HSPs
};

// --- Funções ---

/**
 * Atualiza o valor exibido abaixo do slider de gasto mensal.
 */
function atualizarValorSlider() {
    const valor = parseFloat(inputGastoMensal.value);
    outputGastoMensalValor.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    calcularConsumoEstimado(); // Recalcula o consumo ao mudar o gasto
}

/**
 * Calcula e exibe o consumo mensal estimado baseado no gasto e tarifa.
 */
function calcularConsumoEstimado() {
    const gasto = parseFloat(inputGastoMensal.value);
    const tarifa = parseFloat(inputTarifa.value);

    if (gasto > 0 && tarifa > 0) {
        const consumo = gasto / tarifa;
        spanConsumoEstimado.textContent = `${consumo.toFixed(0)} kWh`;
    } else {
        spanConsumoEstimado.textContent = '-- kWh';
    }
}

/**
 * Carrega as opções de cidade no select correspondente ao estado selecionado.
 */
function carregarCidades() {
    const estadoSelecionado = selectEstado.value;
    selectCidade.innerHTML = '<option value="">Selecione...</option>'; // Limpa opções anteriores

    if (estadoSelecionado && dadosCidadesPorEstado[estadoSelecionado]) {
        selectCidade.disabled = false;
        dadosCidadesPorEstado[estadoSelecionado].forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade.hsp; // O valor da opção será o HSP
            option.textContent = `${cidade.nome} (${cidade.hsp.toFixed(2)})`;
            selectCidade.appendChild(option);
        });
    } else {
        selectCidade.disabled = true;
        selectCidade.innerHTML = '<option value="">Selecione o estado primeiro...</option>';
    }
}

/**
 * Valida os inputs do formulário.
 * Retorna true se válido, false caso contrário.
 * (Implementação básica, pode ser melhorada)
 */
function validarFormulario() {
    let valido = true;
    // Limpar erros anteriores (implementar se adicionar spans de erro)

    if (!selectEstado.value) {
        console.error("Erro: Estado não selecionado.");
        // Adicionar feedback visual para o usuário (ex: borda vermelha)
        valido = false;
    }
    if (!selectCidade.value) {
        console.error("Erro: Cidade não selecionada.");
        valido = false;
    }
    if (isNaN(parseFloat(inputTarifa.value)) || parseFloat(inputTarifa.value) <= 0) {
        console.error("Erro: Tarifa inválida.");
        valido = false;
    }
    // Adicionar mais validações se necessário

    return valido;
}

/**
 * Realiza os cálculos principais da simulação.
 * (PRECISA SER IMPLEMENTADO COM A LÓGICA CORRETA)
 */
function calcularSimulacao(dadosEntrada) {
    console.log("Dados de entrada para cálculo:", dadosEntrada);

    // --- Constantes e Parâmetros (AJUSTAR CONFORME NECESSÁRIO) ---
    const taxaMinima = 50; // Exemplo de taxa mínima (R$) - varia por concessionária
    const perdasSistema = 0.20; // Ex: 20% de perdas (inversor, sombreamento, sujeira, etc.)
    const potenciaPainelWp = 550; // Potência de um painel em Wp
    const areaPainelM2 = 2.5; // Área aproximada de um painel em m²
    const pesoPainelKg = 25; // Peso aproximado de um painel em kg
    const custoInstalacaoPorWp = 3.50; // Custo médio de instalação por Wp (R$) - varia muito!
    const fatorCo2PorKwh = 0.07; // kg de CO2 evitados por kWh gerado (média Brasil) - verificar fonte
    const fatorArvoresPorCo2 = 1 / 180; // Quantas árvores para sequestrar 1kg de CO2/ano (estimativa)
    const fatorKmCarroPorCo2 = 1 / 0.1; // km rodados por kg de CO2 (carro elétrico médio) - verificar fonte
    const vidaUtilSistemaAnos = 25;

    // --- Cálculos ---

    // 1. Consumo Médio Mensal (já calculado ou pegar do input se mudar a lógica)
    const consumoMensalKwh = dadosEntrada.gastoMensal / dadosEntrada.tarifa;

    // 2. Consumo Diário Médio
    const consumoDiarioKwh = consumoMensalKwh / 30; // Média simples

    // 3. Energia a ser Gerada Diariamente (considerando perdas)
    const energiaGerarDiariaKwh = consumoDiarioKwh / (1 - perdasSistema);

    // 4. Potência Necessária do Sistema (kWp)
    // HSP = Horas de Sol Pleno (kWh/m²/dia) - já temos no dadosEntrada.hspCidade
    const potenciaNecessariaKwp = energiaGerarDiariaKwh / dadosEntrada.hspCidade;

    // 5. Número de Painéis
    const numeroPaineis = Math.ceil((potenciaNecessariaKwp * 1000) / potenciaPainelWp); // Arredonda para cima

    // 6. Potência Real do Sistema (kWp)
    const potenciaRealSistemaKwp = (numeroPaineis * potenciaPainelWp) / 1000;

    // 7. Geração Anual Estimada (kWh)
    // Geração = Potência * HSP * 365 * (1 - Perdas)
    const geracaoAnualEstimadaKwh = potenciaRealSistemaKwp * dadosEntrada.hspCidade * 365 * (1 - perdasSistema);

    // 8. Investimento Estimado (R$)
    const investimentoEstimado = potenciaRealSistemaKwp * 1000 * custoInstalacaoPorWp;

    // 9. Economia Mensal Média (R$)
    // Considera a taxa mínima que ainda será paga
    const economiaMensalMedia = Math.max(0, dadosEntrada.gastoMensal - taxaMinima);

    // 10. Economia Total em 25 anos (R$)
    // Simplificado, sem considerar inflação energética ou degradação dos painéis
    const economiaTotal25Anos = economiaMensalMedia * 12 * vidaUtilSistemaAnos;

    // 11. Tempo de Retorno (Payback) em Anos
    let paybackAnos = 0;
    if (economiaMensalMedia > 0) {
        paybackAnos = investimentoEstimado / (economiaMensalMedia * 12);
    }

    // 12. Impacto Ambiental
    const reducaoCo2AnualKg = geracaoAnualEstimadaKwh * fatorCo2PorKwh;
    const arvoresEquivalentes25Anos = reducaoCo2AnualKg * vidaUtilSistemaAnos * fatorArvoresPorCo2;
    const kmCarroEquivalenteAnual = reducaoCo2AnualKg * fatorKmCarroPorCo2;

    // 13. Área e Peso
    const areaMinimaM2 = numeroPaineis * areaPainelM2;
    const pesoEstimadoKg = numeroPaineis * pesoPainelKg;


    // --- Montar Objeto de Resultado ---
    const resultados = {
        investimento: investimentoEstimado,
        economiaMes: economiaMensalMedia,
        economiaTotal: economiaTotal25Anos,
        payback: paybackAnos,
        co2: reducaoCo2AnualKg,
        arvores: arvoresEquivalentes25Anos,
        kmCarro: kmCarroEquivalenteAnual,
        potencia: potenciaRealSistemaKwp,
        paineis: numeroPaineis,
        geracaoAnual: geracaoAnualEstimadaKwh,
        area: areaMinimaM2,
        peso: pesoEstimadoKg
    };

    console.log("Resultados Calculados:", resultados);
    return resultados;
}


/**
 * Exibe os resultados calculados na seção correspondente do HTML.
 */
function exibirResultados(resultados) {
    if (!resultados) return;

    resultadoInvestimento.textContent = `R$ ${resultados.investimento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultadoEconomiaMes.textContent = `R$ ${resultados.economiaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultadoEconomiaTotal.textContent = `R$ ${resultados.economiaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultadoPayback.textContent = resultados.payback > 0 ? `${resultados.payback.toFixed(1)} anos`.replace('.', ',') : 'N/A';
    resultadoCO2.textContent = `${resultados.co2.toFixed(0)} kg`;
    resultadoArvores.textContent = `${resultados.arvores.toFixed(0)} árvores`;
    resultadoKmCarro.textContent = `${resultados.kmCarro.toFixed(0)} km`;
    resultadoPotencia.textContent = `${resultados.potencia.toFixed(2)} kWp`.replace('.', ',');
    resultadoPaineis.textContent = resultados.paineis;
    resultadoGeracaoAnual.textContent = `${resultados.geracaoAnual.toFixed(0)} kWh`;
    resultadoArea.textContent = `${resultados.area.toFixed(1)} m²`.replace('.', ',');
    resultadoPeso.textContent = `${resultados.peso.toFixed(0)} kg`;

    // Mostra a seção de resultados
    secaoResultado.classList.remove('hidden');

    // Rola a página para mostrar os resultados (opcional)
    secaoResultado.scrollIntoView({ behavior: 'smooth' });

    // Chamar funções para gerar gráficos aqui, se implementado
    // gerarGraficoPayback(resultados);
    // gerarGraficoConsumoGeracao(resultados);
}

/**
 * Manipula o evento de submit do formulário.
 */
function manipularSubmitFormulario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log("Formulário submetido.");

    if (validarFormulario()) {
        console.log("Formulário válido. Coletando dados...");
        // Coleta os dados dos inputs
        const dadosEntrada = {
            estado: selectEstado.value,
            hspCidade: parseFloat(selectCidade.value), // O valor da cidade é o HSP
            nomeCidade: selectCidade.options[selectCidade.selectedIndex].text.split(' (')[0], // Pega só o nome
            tipoImovel: document.querySelector('input[name="tipo_imovel"]:checked').value,
            gastoMensal: parseFloat(inputGastoMensal.value),
            tarifa: parseFloat(inputTarifa.value),
            acessoRede: document.querySelector('input[name="acesso_rede"]:checked').value
        };

        // Chama a função de cálculo
        const resultados = calcularSimulacao(dadosEntrada);

        // Exibe os resultados
        exibirResultados(resultados);

    } else {
        console.error("Formulário inválido. Verifique os campos.");
        // Poderia mostrar uma mensagem de erro geral
    }
}


// --- Event Listeners ---

// Atualiza o valor do slider em tempo real
inputGastoMensal.addEventListener('input', atualizarValorSlider);

// Atualiza o consumo estimado quando a tarifa muda
inputTarifa.addEventListener('input', calcularConsumoEstimado);

// Carrega as cidades quando o estado muda
selectEstado.addEventListener('change', carregarCidades);

// Processa o formulário ao ser submetido
formCalculadora.addEventListener('submit', manipularSubmitFormulario);


// --- Inicialização ---

// Garante que o valor inicial do slider e consumo sejam exibidos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarValorSlider();
    // Poderia pré-selecionar um estado/cidade ou carregar estados dinamicamente aqui
});

// --- Funções de Gráfico (Exemplo - PRECISAM SER IMPLEMENTADAS) ---

// function gerarGraficoPayback(resultados) {
//     const ctx = document.getElementById('graficoPaybackAcumulado').getContext('2d');
//     // Lógica para criar o gráfico de payback com Chart.js
//     console.log("Gerando gráfico de payback...");
// }

// function gerarGraficoConsumoGeracao(resultados) {
//     const ctx = document.getElementById('graficoConsumoGeracao').getContext('2d');
//     // Lógica para criar o gráfico de consumo vs geração com Chart.js
//     console.log("Gerando gráfico de consumo/geração...");
// }
