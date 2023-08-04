FROM node:16.19.1

COPY package*.json .
COPY src src
COPY build-ecs.js build-ecs.js
COPY tsconfig.json tsconfig.json

RUN npm ci \
&& npm run build-ecs

ENTRYPOINT ["node"]
CMD ["./dist/sui-events-listener.mjs"]
