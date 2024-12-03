# Étape 1 : Construire l'application Angular
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --output-path=dist/frontend/browser

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:alpine

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers Angular construits
COPY --from=build /app/dist/frontend/browser/browser /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

