FROM node:20-alpine 

WORKDIR /path

COPY package* .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]