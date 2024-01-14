FROM node:20.9.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .


EXPOSE 3000

CMD [ "node", "./dist/server.js" ]
