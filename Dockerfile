FROM node:lts-alpine
ENV NODE_ENV=production
ENV PORT=80
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 80
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
