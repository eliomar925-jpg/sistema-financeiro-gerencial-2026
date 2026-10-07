# Plano de teste — Conciliação Diária de Pagamentos

Objetivo: validar o sistema atual antes de novas funcionalidades.

## Escopo inicial

Usar Outubro/2026 como mês piloto, com os espelhos e extratos reais já carregados.

## Critérios de aceite

1. Espelhos recebidos
   - quantidade de arquivos únicos correta;
   - arquivos adicionais podem ser incluídos sem apagar os anteriores;
   - duplicados exatos não são adicionados novamente.

2. Pagamentos identificados
   - OCR separa corretamente vários pagamentos no mesmo arquivo;
   - valores, datas e beneficiários podem ser corrigidos;
   - arquivos lidos sem pagamento identificado não contam como pendência financeira.

3. Conciliação
   - pagamento encontrado no banco pode ser confirmado;
   - um movimento bancário não pode ser usado duas vezes;
   - lotes podem ser conciliados por composição;
   - ausência de extrato pode ser marcada como AGUARDANDO EXTRATO.

4. Conferência bidirecional
   - BANCO SEM ESPELHO lista toda saída bancária ainda sem vínculo;
   - ESPELHO SEM BANCO lista pagamento identificado sem evidência bancária;
   - ao conciliar, ambos os lados são atualizados imediatamente.

5. Fechamento operacional
   - Espelhos recebidos
   - Pagamentos identificados
   - Conciliados
   - Pendentes
   - Divergências
   - Aguardando extrato
   devem refletir apenas o mês/dia filtrado.

## Roteiro

1. Selecionar Outubro/2026.
2. Confirmar quantidade de espelhos carregados.
3. Confirmar quantidade de saídas bancárias carregadas.
4. Ler os espelhos ainda não processados.
5. Revisar os pagamentos identificados pelo OCR.
6. Abrir a Conferência bidirecional.
7. Validar manualmente pelo menos:
   - 1 match forte;
   - 1 pagamento sem banco;
   - 1 saída bancária sem espelho;
   - 1 divergência;
   - 1 lote, se houver.
8. Exportar o diagnóstico CSV.
9. Comparar o diagnóstico com os arquivos de origem.
10. Somente após essa validação, testar outro mês.

## Regra

Durante o teste, não adicionar novos módulos gerenciais. Corrigir somente erros que impeçam a conciliação, a leitura, a classificação ou a rastreabilidade dos pagamentos.
