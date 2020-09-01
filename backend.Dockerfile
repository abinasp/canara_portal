FROM node
RUN apt-get update --fix-missing

ADD canara-services /
RUN npm install
CMD npm start