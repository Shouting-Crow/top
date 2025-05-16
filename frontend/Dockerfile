FROM node:20-alpine as build

WORKDIR /top

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine as production

COPY --from=build /top/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]