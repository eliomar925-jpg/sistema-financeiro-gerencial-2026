# Modelo de dados V2

## Entidade principal: lançamento

Cada operação financeira possui um único identificador e pode ser relacionada a documentos, banco e classificação econômica.

Campos mínimos:

| Campo | Uso |
|---|---|
| id | Identificador único |
| empresa | Salvador Produções / Sofá da Sogra |
| centro | WET / EVENTOS / ESCRITÓRIO / BANDAS |
| evento_banda | Evento, show, artista ou unidade quando aplicável |
| natureza_economica | Receita / Despesa / Fora da DRE |
| natureza_financeira | Operacional / Transferência / Mútuo / Aporte / etc. |
| competencia | Data econômica |
| data_financeira | Data da movimentação de caixa |
| valor | Valor do lançamento |
| beneficiario_pagador | Contraparte |
| documento_origem_id | Espelho, PDF, imagem, planilha |
| movimento_bancario_id | Débito/crédito conciliado |
| status_conciliacao | Estado operacional |
| observacao | Auditoria/revisão |
| criado_em | Data de criação |
| atualizado_em | Última alteração |

## Documento de origem

Um documento pode gerar vários pagamentos.

Campos:
- id
- arquivo
- tipo
- grupo_origem
- data_recebimento
- hash
- status_leitura
- origem

## Movimento bancário

Campos:
- id
- banco
- agência
- conta
- data
- histórico
- favorecido
- documento
- valor
- natureza_financeira
- lançamento_id
- status

## Relação de conciliação

A relação deve suportar:
- 1 espelho → 1 movimento bancário
- 1 espelho/lote → N movimentos bancários
- N espelhos → 1 movimento bancário, quando validado como composição

Campos:
- id
- lançamento_id
- movimento_bancario_id
- confiança
- método
- confirmado_por
- confirmado_em

## Regra de não duplicidade

O mesmo movimento bancário não pode ser conciliado duas vezes, salvo quando existir uma composição explicitamente validada.

## Chaves de auditoria

Todos os registros devem manter:
- fonte
- arquivo de origem
- data de importação
- usuário/responsável pela confirmação
- histórico de alteração
