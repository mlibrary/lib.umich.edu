FROM node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
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
