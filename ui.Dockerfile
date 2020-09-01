FROM node
RUN apt-get update --fix-missing

ADD ui /
RUN npm install
CMD npm start