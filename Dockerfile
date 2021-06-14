FROM node:16.3.0

WORKDIR /usr/src/face-recognition-api

COPY ./ ./

RUN rm -r node_modules
RUN npm install

CMD ["/bin/bash"]