FROM node:12-alpine

WORKDIR /home/app

RUN npm install


CMD ["npm", "start"]
