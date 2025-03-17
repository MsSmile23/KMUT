FROM debian:bullseye
MAINTAINER AK
# docker build . -t office.ed-it.ru/webfront-build-nodejs18 && docker push office.ed-it.ru/webfront-build-nodejs18

RUN  apt-get update && apt-get install -y ca-certificates curl gnupg git wget fakeroot
RUN  mkdir -p /etc/apt/keyrings && \
     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN  NODE_MAJOR=18 && \
     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN  curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor > /usr/share/keyrings/yarnkey.gpg && \
     echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN  apt-get update && apt-get install yarn nodejs -y

