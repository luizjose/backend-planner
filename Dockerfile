# Etapa 1: Build
FROM node:18

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos do código-fonte
COPY . /app

# Remover node_modules e instalar dependências
RUN rm -rf node_modules
RUN npm install

# Ajustar permissões
RUN chown -R node:node /app

# Definir o usuário
USER node

# Expor a porta
EXPOSE 3001

# Comando para rodar o app
CMD ["npm", "run", "dev"]
