FROM node:21

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001
CMD ["npm", "run", "dev"]