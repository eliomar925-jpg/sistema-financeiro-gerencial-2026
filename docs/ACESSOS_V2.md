# Acessos & Compartilhamentos V2

## Objetivo

O administrador define exatamente o que cada pessoa poderá visualizar.

Não existem perfis rígidos obrigatórios de CEO, Bandas ou Eventos. Cada acesso é uma combinação de permissões.

## Cadastro de acesso

Campos:
- nome
- celular
- módulos permitidos
- empresas permitidas
- centros permitidos
- eventos/bandas permitidos
- período
- acompanhamento contínuo ou fechado
- validade
- somente leitura
- status ativo/revogado

## Exemplos

### Acesso executivo
- Visão Geral
- DRE
- Resultado × Caixa
- Salvador Produções + Sofá da Sogra
- Todos os centros
- Acompanhamento contínuo

### Acesso Eventos
- Pagamentos
- DRE
- Resultado × Caixa
- Salvador Produções
- EVENTOS / OUTROS
- Acompanhamento contínuo

### Acesso restrito
- Somente um artista/banda
- Período fechado
- Somente leitura

## Convite

Fluxo desejado:
1. Administrador cria autorização.
2. Sistema gera convite individual.
3. Convite pode ser enviado por link ou QR Code.
4. Primeiro acesso autoriza navegador/dispositivo.
5. Acesso posterior reutiliza a autorização.
6. Administrador pode revogar ou alterar a qualquer momento.

## Segurança

Link ou QR Code não devem ser a única proteção.

A evolução recomendada é:
- convite de uso único;
- sessão vinculada ao dispositivo;
- passkey/biometria/PIN do dispositivo;
- expiração e revogação;
- logs de acesso.

## Base central

O modelo atual baseado em localStorage não suporta acompanhamento compartilhado confiável.

Para acesso contínuo:
- dados validados devem ficar em base central protegida;
- permissões devem ser aplicadas no servidor;
- cada pessoa consulta somente o recorte autorizado;
- uma atualização mensal publicada passa a aparecer automaticamente para acessos contínuos.

## Regra

Usuário final nunca importa base nem altera classificação financeira. Ele apenas consulta.
