# Homologação — importação PDF Bradesco (03/11/2026)

## Evidência de referência
Arquivo: `Extrato Mensal Setembro.2026 LS Bradesco(2).pdf`, 19 páginas, agência 3326, conta 0197297-9, setembro/2026. O arquivo foi analisado em ambiente isolado; não foi carregado em produção.

### Resultado de conferência geométrica independente
A extração por coordenadas de texto, espelhando as regras do parser JavaScript, identificou:
- 730 lançamentos: 693 débitos e 37 créditos.
- Créditos R$ 5.053.068,17.
- Débitos R$ 5.890.408,69.
- 19 páginas processadas.
- Há páginas de continuação sem nova data no início; por isso a data precisa persistir entre páginas, mas somente dentro do mesmo arquivo.
- Cabeçalho do arquivo identifica agência e conta e metadados informam Banco Bradesco S/A.

### Alterações na branch
- Chave de origem por SHA-256 e posição de lançamento.
- Duplicidade avaliada por origem e comparação de dados, sem igualar documentos bancários distintos.
- Continuidade de data corrigida.
- Transferências são *possíveis*, não conciliadas automaticamente.
- Persistência anterior do navegador preservada; sem migração destrutiva.

## Limitações e testes pendentes
- A extração acima usa PyMuPDF para simular a lógica geométrica, **não** é um teste de ponta a ponta do PDF.js no navegador.
- Não foi testada importação na instância real com estado local do usuário.
- Não foi comprovada conciliação com espelhos nem confirmação de transferências em contas de contrapartida.
- PDF digitalizado não é suportado.
- Sem testes CI reportados para o commit.
- Sem autorização para afirmar que a produção foi atualizada.

**Parecer:** conferência de leitura aprovada com ressalvas; homologação integral e publicação ainda não aprovadas.