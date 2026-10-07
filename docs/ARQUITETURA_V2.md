# Arquitetura funcional V2

## 1. Princípio

O sistema deixa de ser uma única página acumulando importação, OCR, banco, DRE e auditoria. Cada módulo tem responsabilidade própria, mas todos usam o mesmo modelo de dados.

## 2. Fluxo operacional

### Pagamentos
WhatsApp / espelho → leitura → pagamento identificado → conciliação → status.

Status operacionais:
- PENDENTE
- CONCILIADO
- DIVERGÊNCIA
- AGUARDANDO_EXTRATO
- SEM_ESPELHO
- SEM_BANCO

### Caixa
Extrato bancário → classificação financeira → vínculo com lançamento operacional quando aplicável.

Naturezas financeiras:
- OPERACIONAL
- TRANSFERENCIA
- MUTUO
- APORTE
- APLICACAO
- RESGATE
- TARIFA
- ESTORNO
- OUTROS

### DRE
A DRE usa competência e somente movimentos que pertencem ao resultado econômico.

### Resultado × Caixa
Explica por que o resultado econômico e o caixa líquido são diferentes.

## 3. Hierarquia analítica

Empresa → Centro de custo → Evento/Banda → Natureza → Lançamento → Documento → Banco.

Empresas iniciais:
- Salvador Produções
- Sofá da Sogra

Centros iniciais:
- WET
- EVENTOS / OUTROS
- ESCRITÓRIO
- BANDAS

## 4. Indicadores principais

### Operação de pagamentos
- Espelhos recebidos
- Pagamentos identificados
- Conciliados
- Pendentes
- Divergências
- Aguardando extrato

### Conciliação bidirecional
- Espelho sem banco
- Banco sem espelho
- Match forte
- Match possível
- Conflito

### Econômico
- Receita
- Despesa
- Resultado
- Margem

### Caixa
- Entradas
- Saídas
- Caixa líquido

## 5. Ponte Resultado → Caixa

Resultado econômico
+/- competências anteriores
+/- contas a receber/pagar
+/- transferências
+/- mútuos e aportes
+/- aplicações e resgates
+/- outros movimentos
= Caixa líquido

A coluna "Efeito comp. anteriores" deve ser uma parcela dessa ponte, e não a explicação completa da diferença.

## 6. Etapas de implementação

### Fase 1
Modelo único de dados e reconciliação bidirecional.

### Fase 2
Bancos & Caixa com classificação financeira.

### Fase 3
DRE e abertura Empresa × Centro.

### Fase 4
Resultado × Caixa.

### Fase 5
Auditoria / Exceções.

### Fase 6
Base central + Acessos & Compartilhamentos.

## 7. Regra de publicação

Dados brutos ficam fora do repositório. O site deve receber somente dados derivados/autorizados ou consultar uma base protegida.
