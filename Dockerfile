FROM node:lts-alpine
ENV NODE_ENV=production
ENV PORT=80
ENV KEYROCK_ID=db3fc8d1-7c0b-43e4-be9b-237ac2fb778c
ENV KEYROCK_SECRET=71f7af22-1f9d-44bd-b5ff-1b6493ec3d8b
ENV KEYROCK_ADMIN=admin@tuc.gr
ENV KEYROCK_PASS=admin
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 80
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
