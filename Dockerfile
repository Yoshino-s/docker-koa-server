FROM node:latest

RUN yarn config set registry https://registry.npm.taobao.org/ && yarn global add pm2@3.5.1

WORKDIR /app

COPY package.json ecosystem.config.js tsconfig.json ormconfig.json /app/

ENV NPM_CONFIG_LOGLEVEL warn
RUN yarn

EXPOSE 3000 3001

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--web", "3001"]
