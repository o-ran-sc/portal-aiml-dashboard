FROM node:14

# location in the container
WORKDIR /home/gui/
COPY . .

RUN npm install
RUN . ./set_env_and_npm_run_build.sh
RUN npm install -g serve

EXPOSE 32005

#------------- ENTRYPOINT -----------------------
ENTRYPOINT ["serve","-s","build", "-l","32005"]
