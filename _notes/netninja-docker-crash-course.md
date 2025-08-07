---
layout: notes
title: Docker Crash Course by Netninja
date: 2023-12-23
updated: 2023-12-23
description: Notes from the @NetNinja course in YouTube.
category: Learning
---

https://www.youtube.com/watch?v=31ieHmcTUOk&list=PL4cUxeGkcC9hxjeEtdHFNYMtCpjNBm3h7&index=1

An image is a blueprint for a container.
We can distribute the images that when they are run they create containers.
Images are read only. They cannot be changed.
To change an image we have to create a brand new image.

Containers are runable instances of those images.
When we run the image, it creates a container.

A container is a process which runs our application as outlined by the image we created.

Containers are completely isolated from the processes of the computer.

We can share the docker images to make a container to run the application.
The app will work in the same way as it works on my computer.

## Parent images & Docker Hub

Images are made up of different layers. The order of the layers does matter.
The parent image is the first image. It describes the OS and sometimes the runtime environment.
The parent image is an image in itself.
Source code and dependencies can be layers after the parent image.

hub.docker.com.
It is an online repo of docker images. Has lots of premade of docker images that can be used as parent images.
We can pull an image by using the command

```bash
docker pull node [tag]
```

The supported tags are different variations of the node images that we can use.

Once the image is run and the container is created. We can stop, restart, and delete the container.
We can also interact with the container and run commands inside there.

## The dockerfile

A set of instructions to docker to create the image.
Instructions to create the layers on an image.

```
Dockerfile
```

Each instruction will be in a different line on the file.

Example:

1. The first line is the parent image.

```dockerfile
FROM node:17-alpine

WORKDIR /app
```

When we run commands on the image. It will do it from the working directory. 2. Copy the source code into the image

```dockerfile
COPY . .
```

First dot is the relative path from where I want to copy my files.
Second dot is the path inside the image.
Most of the time we don't copy to the root directory. 3. All the dependencies

```dockerfile
RUN npm install
```

Run the command on the image itself. All the project dependencies will be installed.
A RUN command runs it while the image is being built. The image is not a running application.
We are not trying to run the application while building the image. 4. Run commands that should be run on runtime when the container begins to run.

```dockerfile
CMD ["node", "app.js"]
```

This command will spin up the application inside the container.

To build the image, run the command in the project directory.

```bash
docker build -t myapp .
```

-t tag.
. is a relative path to the docker file.

## .dockerignore

In this file we can specify any files or folders that we want docker to ignore when it copies them over to the image.
If we have node_modules on the local folder, it is good to ignore it because the packages may be outdated and they make the images much larger by copying unnecessary files that the container will have when it is run.

## Containers

```bash
docker images
```

Will list all the images we have.

```bash
docker run --name [containername] -p 4000:4000 -d [nameofimage]
```

-p publish the container ports in the host computer.
4000: the port in the container.
:4000 the port we want to map in the computer.
-d detach the terminal from the process.
To run an image.

```bash
docker ps
```

List all the running containers.

```bash
docker stop [containername]
```

Stop a container.

```bash
docker start [containername]
```

Starts an existing container.

## Layer caching

Once an image is created it is read only. We need to make a new image to reflect the changes in our code.
If we copy the package.json before the rest of the files, then we can have npm install cached as well.

## Managing images and containers

```bash
docker images // lists the images.
docker ps // lists the containers.
```

An image cannot be deleted if it is used by a container.

```bash
docker image rm [nameofimage] -f
```

-f force the deletion even if the image is used by a container.

Otherwise delete the container first, then the image.
To delete the container.

```bash
docker container rm [nameofcontainer]
```

To delete all containers and all images

```bash
docker system prune -a
```

## Volumes

Docker run will create a new container from scratch.
Docker start will take a container that is already made.

Volumes are a feature of docker that allows to specify folders in our host computer that can be made available to running the containers.
Map folders between the container and the host computer.
The image does not change at all.
Volumes are useful for development.

For volumes:

```bash
docker run --name [nameofcontainer] -p [port:port] --rm -v [absolutepath:workdirfolder] nameofimage:tag
```

-v maps the folder of the volume.

Anonymous volumes

```bash
-v /app/node_modules
```

It rewrites the previous volume and keeps the folder mapped to a folder managed by docker.

## Docker compose

Gives a way to make a single docker compose file that contains all the configuration of our projects.
First specify the version of docker compose.

```yml
version: "3.8"
```

Services are the projects we want images and containers for.

```yml
services:
  [nameofservice]:
    build: [relativepath] {./api}
    container_name: [nameofthecontainer] {api_c}
    ports:
      - '4000:4000'
    volumes:
      - [pathrelativetodockercomposefile] {./api:/app}
      - ./app/node_modules
```

Docker compose creates the image as well as creating the container for it.
Tu run this, in the root folder:

```bash
docker-compose up
```

It finds its file and run it to start the container.

```bash
docker-compose down [--rmi all -v]
```

Removes the container but keeps the images and volumes.
--rmi all -v will delete both images and volumes.

## Dockerising a React App

.dockerignore

```
node_modules
```

Dockerfile:

```dockerfile
FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```
