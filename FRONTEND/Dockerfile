FROM node:18-alpine

WORKDIR /app

# Bağımlılıkları kuralım
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyalayalım
COPY . .

# Next.js build alalım
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]