FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/simple-express-server .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install
CMD node ./main.js