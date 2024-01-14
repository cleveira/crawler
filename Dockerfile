FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3333

CMD [ "node", "./dist/server.js" ]
