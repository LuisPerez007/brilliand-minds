FROM node:22.14.0
WORKDIR /app
COPY package.json .
RUN  npm install
RUN npm install -g nodemon
COPY . .
CMD ["npm", "run","dev"]
EXPOSE 5000