FROM node:latest

WORKDIR /usr/src/face-recognition-api

COPY ./ ./

RUN npm install -g npm@7.17.0
RUN rm -r node_modules
RUN npm install

CMD ["/bin/bash"]