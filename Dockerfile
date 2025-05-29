FROM node:20.17-alpine
WORKDIR /app
COPY package.json .

RUN apk add --update --no-cache \
  autoconf \
  automake \
  cairo-dev \
  g++ \
  giflib-dev \
  jpeg-dev \
  libtool \
  make \
  pango-dev

RUN npm install
COPY . .
RUN npm run build

EXPOSE 4173
ENTRYPOINT [ "npm", "run", "preview" ]
