FROM node:14

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production
ENV PORT 5000

EXPOSE 5000

CMD ["yarn", "start"]