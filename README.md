# PI_II_ES_TIME-17

Este repositório será destinado ao armazenamento do projeto "Nota Dez" da matéria do Projeto Integrador II.

A main será reservada apenas aos arquivos do programa e suas versões finais 
e nas Branches as versões de cada parte do projeto, separado por tópicos, a qual estão sendo desenvolvidas e/ou terminadas. 

Para iniciar o sistema e seu correto funcionamento é necessario seguir as sequintes etapas:

. instalar as dependencias com o comando 'npm install';

. instalar o TS com o comando 'npm i typescript' (caso o TS já esteja instalado prossiga para o próximo passo);

. rodar o comando 'npx tsc' ou 'npm run build' para compilar o typescript;

. baixar o Oracle Database 21c Express Edition, correpondente a maquina a ser utilizada, no site: https://www.oracle.com/br/database/technologies/xe-downloads.html

. baixar o Oracle SQL Developer, correpondente a maquina a ser utilizada, no site: https://www.oracle.com/br/database/sqldeveloper/technologies/download/

. rodar o arquivo 'BD_Fisico.sql'(localizado em 'src/database/BD_Fisico.sql') no seu banco de dados;

. alterar as informações de conexão com o banco de dados no arquivo 'oracle.ts'(localizado em 'src/database/oracle.ts') 

. por fim, iniciar o servidor com o comando 'node .\dist\server.js'.

Integrantes:

. Caio José Burdim Menali       RA:25013468

. Felipe Cesar Ferreira Lirani  RA:25007003

. Felipe Batista Bastos         RA:25005337

. Gabriel Batista Bastos        RA:25005338
