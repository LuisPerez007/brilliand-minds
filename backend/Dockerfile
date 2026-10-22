FROM node:22.14.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ln -s inscripcionController.js controllers/inscripcioncontroller.js
CMD ["npm", "run","dev"]
EXPOSE 5000