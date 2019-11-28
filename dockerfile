FROM node:10
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
<<<<<<< HEAD
COPY . /usr/src/app
#RUN rm -rf node_modules
#RUN npm install --only=prod
EXPOSE 3001
CMD npm run start
=======
COPY package.json /usr/src/app/
RUN npm install --only=prod
COPY ./dist /usr/src/app/
EXPOSE 2000
CMD node server.js
>>>>>>> 20512585d6ea07d17adba1ad5802358b653cd57c
