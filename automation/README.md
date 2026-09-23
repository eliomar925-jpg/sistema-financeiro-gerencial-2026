# Motor de atualização 2026

Pipeline definido para atualização incremental do fechamento gerencial.

1. Ler MASTER e bases da estrutura oficial `Controladoria/01_2026`.
2. Preservar dados originais e normalizar em camada derivada.
3. Classificar natureza gerencial antes de DRE/conciliação.
4. DRE por competência; Caixa por quitação.
5. Conciliar por centro + evento/show + descrição/contratante + valor/composição + data.
6. Parear intercompany Sofá x Salvador; exceções não alteram DRE.
7. Gerar somente indicadores derivados para publicação no painel.

Segurança: bases financeiras brutas não devem ser commitadas no GitHub. A pasta 00_ENTRADA é proibida e não deve ser recriada.
