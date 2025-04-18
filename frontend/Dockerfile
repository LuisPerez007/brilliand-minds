FROM node:22.14.0

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run","dev"]
EXPOSE 5173