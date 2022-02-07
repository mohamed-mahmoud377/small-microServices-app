#a docker image that has node js preinstalled in it but the alpine verison which that has the peer mimum of fetures
FROM node:16-alpine

#the folder that has all the porject files
WORKDIR /app
#we first copy the package.json file to the app dir so we are inable to run the npm install command but we are not copying
#all of the files directlly so we make any change to code the part of npm install does not run again
COPY package.json ./

# install all the denpencies in the package.json file
RUN npm install

#copying all the project data from the current dir to /app because it is the WORKDIR
Copy ./ ./


#the command that will run when you run the container
CMD ["npm", "start"]