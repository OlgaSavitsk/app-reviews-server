FROM node:lts-alpine

WORKDIR /home/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]