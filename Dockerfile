FROM node:lts-alpine
ENV NODE_ENV=production
ENV PORT=80
ENV ADMIN_SALT=QqjnpsFF-B0i-xzVq_sk0A
ENV ADMIN_HASH=c9f67cd0e7e9d34a26b8648419a6808cf0da05ab143ea14fc12597cc9512752a1e4368b1ba65784ab1d0a48497cfb2da62ce7466a816cd7b6e497694e5ec8199
WORKDIR /usr/src/app
COPY ["package*.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 80
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
