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


## Execução no Windows

A pasta `automation` agora contém um motor executável. No computador da Controladoria:

1. mantenha a estrutura oficial em `C:\Users\Eliomarssa\Controladoria\01_2026`;
2. não crie `00_ENTRADA`;
3. execute `ATUALIZAR_SISTEMA_FINANCEIRO.cmd`;
4. o motor percorre os arquivos XLSX, normaliza/classifica, recalcula DRE e faz o pareamento intercompany;
5. o resultado derivado é salvo em `03_CONTROLE\painel-2026.json`.

O motor aborta se encontrar a pasta proibida `00_ENTRADA`. Bases brutas continuam locais; somente a saída derivada deve ser usada na publicação do painel.

### Próxima camada

A publicação automática do JSON no site exige um mecanismo de entrega do arquivo local ao Cloudflare/GitHub. Isso não deve ser feito incluindo bases financeiras no repositório.
