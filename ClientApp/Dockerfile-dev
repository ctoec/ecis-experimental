FROM node:12

RUN apt-get update && apt-get install -y \
  rsync

RUN mkdir -p /home/node/app && mkdir -p /home/node/mapped-app

CMD [ "/bin/bash" ]