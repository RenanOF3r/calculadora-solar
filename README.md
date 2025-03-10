# Calculadora Solar

Este projeto é uma calculadora de economia de energia solar que permite ao usuário estimar os custos mensais com e sem um sistema de energia solar. A aplicação considera sazonalidade no consumo e geração de energia no Rio de Janeiro, bem como créditos de energia excedente, garantindo um cálculo mais realista.

## Funcionalidades

- Cálculo do consumo mensal de energia elétrica
- Simulação do custo com e sem energia solar
- Aplicação da sazonalidade no consumo e geração de energia
- Exibição de um gráfico comparativo para análise financeira
- Cálculo do impacto dos créditos de energia no custo final

## Demonstração

A aplicação exibe um gráfico interativo com três variáveis:

1. Consumo mensal (kWh)
2. Custo mensal sem energia solar (R$)
3. Custo mensal com energia solar (R$)

O gráfico reflete variações sazonais, considerando meses com maior e menor incidência solar.

## Tecnologias Utilizadas

- HTML5 - Estrutura da página
- CSS3 - Estilização da interface
- JavaScript (ES6+) - Lógica de cálculo e manipulação do DOM
- Chart.js - Biblioteca para geração de gráficos

## Estrutura do Projeto

```
/calculadora-solar
│── index.html          # Estrutura da aplicação
│── styles.css          # Estilos da página
│── script.js           # Lógica e cálculos
│── README.md           # Documentação do projeto
│── assets/             # Recursos visuais (se houver)
│── libs/               # Bibliotecas externas (Chart.js opcionalmente)
```

## Como Usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/calculadora-solar.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd calculadora-solar
   ```
3. Abra o arquivo index.html em seu navegador.

## Lógica do Cálculo

A calculadora segue os seguintes passos:

1. Aplica a sazonalidade no consumo de energia elétrica
2. Aplica a sazonalidade na geração solar para cada mês
3. Calcula o custo sem energia solar:
   ```js
   custoSemSolar = (consumoMensal * tarifa) + CUSTO_FIXO_ILUMINACAO;
   ```
4. Calcula o custo com energia solar, considerando créditos de energia:
   ```js
   energiaExcedente = Math.max(geracaoMensal - consumoMensal, 0);
   valorCredito = energiaExcedente * tarifa * PERCENTUAL_CREDITO;
   custoComSolar = Math.max((CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO - valorCredito, (CONSUMO_MINIMO_KWH * tarifa) + CUSTO_FIXO_ILUMINACAO);
   ```
5. Exibe os resultados no gráfico interativo.

## Possíveis Melhorias

- Permitir ao usuário escolher a cidade e carregar a sazonalidade automaticamente
- Adicionar mais variáveis, como incentivos fiscais ou depreciação do sistema
- Criar uma versão PWA para uso offline

## Licença

Este projeto é de código aberto e está sob a licença MIT. Você pode usá-lo e modificá-lo conforme necessário.

## Contribuição

Se deseja contribuir para o projeto, siga estes passos:

1. Faça um fork do repositório
2. Crie um branch para sua funcionalidade (`git checkout -b feature-nova`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o GitHub (`git push origin feature-nova`)
5. Abra um Pull Request

Desenvolvido por Renan Fernandes  
Contato: renanofernandes@gmail.com 
LinkedIn: https://www.linkedin.com/in/renan-oliveira-fernandes-50319b172/
