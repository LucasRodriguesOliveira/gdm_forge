# Forge
gdm_forge

GDM Back-end engineer test Project

![Static Badge](https://img.shields.io/badge/Converage-0%25-green)

## Description

Forge is a microservice api server with the sole purpose to receive data and store in a 
NoSQL database such as MongoDB

## Project setup

If you wish to run locally, make sure to change the database host to `localhost` instead
of a docker container nickname

```bash
$ yarn install
```

If you wish to run using docker, this project does not rely on docker compose file, instead, 
follow the instructions bellow and keep in mind that this process consider multiple
projects that should run in a orchestration

```bash
$ docker compose build
$ docker compose up
```
**⚠️ Warning**

At this point, probably the application should not be able to see the database connection
due to the fact that the database is in an another container. This is done purposely!

To solve this issue, we must create a network and add both (which needs both to exist in a container)

```bash
$ docker network create <some_network>
$ docker network connect <database_container_name> <some_network>
$ docker network connect <project_container_name> <some_network>
```

I would suggest `forge_database` instead of `<some_network>`

With that, both containers can see each other, which for MongoDB doesn't mean much, but 
it means everything for gdm_forge

## Compile and run the project (locally)

```bash
# development
$ yarn start

## Run tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Resources

Most details can be found inside the GDM Project Documentation on Eraser

## License

Forge is [MIT licensed](https://github.com/LucasRodriguesOliveira/gdm_forge/blob/master/LICENSE).
