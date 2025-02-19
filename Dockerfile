# FROM node:alpine3.19
# 使用阿里云镜像
FROM node:alpine3.19

# 添加代码
ADD web/ /workspace
WORKDIR /workspace

# npm换源

# 安装npm依赖库
RUN npm install \
    && npm run build

ENTRYPOINT ["npm", "run", "dev"]

