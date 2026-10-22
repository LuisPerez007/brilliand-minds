FROM node:22.14.0

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN ln -s src/views/inscripciones/components/TablaProfesores.js src/views/inscripciones/components/tablaProfesores.js

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
