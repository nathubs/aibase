# FROM node:alpine3.19
FROM node:alpine3.19

# 添加代码
ADD . /workspace
WORKDIR /workspace

# npm换源

# 安装npm依赖库
RUN yarn \
    && yarn build

ENTRYPOINT ["yarn","dev"]

