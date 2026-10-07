# Sistema Financeiro 2026 — Arquitetura V2

Esta branch reorganiza o projeto em módulos claros e elimina a mistura entre conciliação diária, DRE, caixa e auditoria.

## Objetivo

Um único sistema financeiro com um único modelo de dados. O mesmo lançamento pode aparecer em diferentes visões sem ser duplicado.

## Módulos

1. **Visão Geral**
   - Resultado econômico
   - Caixa
   - Situação da conciliação
   - Exceções críticas

2. **Pagamentos / Conciliação**
   - Espelhos recebidos
   - Pagamentos identificados
   - Conciliados
   - Pendentes
   - Divergências
   - Aguardando extrato
   - Banco sem espelho
   - Espelho sem banco

3. **Bancos & Caixa**
   - Entradas e saídas
   - Contas bancárias
   - Movimentos operacionais
   - Transferências
   - Mútuos
   - Aportes
   - Aplicações/resgates
   - Tarifas, estornos e outros movimentos

4. **DRE**
   - Empresa
   - Centro de custo
   - Evento/Banda
   - Natureza
   - Lançamento

5. **Resultado × Caixa**
   - Resultado econômico
   - Competências anteriores
   - Contas a receber/pagar
   - Transferências
   - Mútuos/aportes
   - Aplicações/resgates
   - Outros movimentos
   - Caixa líquido

6. **Auditoria / Exceções**
   - Banco sem espelho
   - Espelho sem banco
   - Duplicidades
   - Divergências de valor/data
   - Não classificados
   - Transferências não pareadas
   - Lotes aguardando extrato

7. **Acessos & Compartilhamentos**
   - Permissões personalizadas por pessoa
   - Somente leitura
   - Acompanhamento contínuo ou período fechado
   - Link/QR individual
   - Revogação e alteração de acesso

## Regra central

**Um lançamento existe uma vez.**

As telas são diferentes leituras do mesmo registro, com dimensões de empresa, centro, natureza, competência, data financeira, valor, documento, banco, conciliação e status.

## Segurança

Os arquivos financeiros brutos não devem ser publicados no GitHub. A versão final deverá usar base central protegida para permitir acesso contínuo e compartilhamento seguro.

Veja:
- `docs/ARQUITETURA_V2.md`
- `docs/MODELO_DADOS_V2.md`
- `docs/ACESSOS_V2.md`
