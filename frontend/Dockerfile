# Étape 1 : Construire l'application Angular
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --output-path=dist/frontend/browser

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser/browser /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

