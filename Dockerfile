FROM node:16
ARG UNAME=app
ARG UID=1000
ARG GID=1000

LABEL maintainer="mrio@umich.edu"

RUN npm install -g npm
RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
  vim-tiny


RUN groupadd -g ${GID} -o ${UNAME}
RUN useradd -m -d /app -u ${UID} -g ${GID} -o -s /bin/bash ${UNAME}
USER $UNAME

WORKDIR /app
