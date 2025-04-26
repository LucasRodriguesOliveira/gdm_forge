# Forge
gdm_forge

GDM Back-end engineer test Project

![Static Badge](https://img.shields.io/badge/Converage-100%25-green)

## Description

Forge is a microservice api server with the sole purpose to receive data and store in a 
NoSQL database such as MongoDB

## Project setup

It's highly recommended to use docker for this project

Complete and more succinct documentation can be found at Eraser (available only under direct request by email, or previously authorized by the author)

```bash
$ docker compose create --build
```

This project is expected to run with other projects such as [Whisper](https://github.com/LucasRodriguesOliveira/gdm_whisper) and [Scribe](https://github.com/LucasRodriguesOliveira/gdm_scribe), with **Whisper** been a dependency. So, to keep everything running smoothly, you must run **Whisper** first. With **Whisper** running, you have to include this project in the same network in order to allow **Forge** to send messages to the queue in the **Whisper** container (the container, not the project, which is probably called `gdm_whisper-rmq-1`). To do so, type the following in the bash:

It is up to you to decide to use the network already existing that was created when you built the `Whisper` Container (which is probably called `gdm_whisper_default`) or create a new one (If you care for some aesthetics)

To create a new network, it's pretty simple:

```bash
$ docker network create <network_name>
# I would suggest `gdm_rabbitmq` for semantics sake

$ docker network connect <network_name> gdm_whisper-rmq-1
```

Then, wether you choose create a new one or use the existing one, just add this container to the network that contains the `gdm_whisper-rmq-1` container

```bash
$ docker network connect <network_name> gdm_forge-api-1
```

With everything in order, we can run this project right away

```bash
$ docker compose up -d
# We don't wanna that boring database logs, right? *wink*

$ docker logs --follow gdm_forge-api-1
# Just the application logs is fine
```

**⚠️ Warning**

At this point, you don't have to worry much about this project. It will do its job, but remember that that are other project that depends on this one, so as a heads up: you'll have to connect the other container to a network with this container.

If you want to go a little ahead, create a network and add this project to it:

```bash
$ docker network create <some_network>
# what about `gdm_scribe_forge`?

$ docker network connect --alias forge gdm_scribe_forge gdm_forge-api-1
```

<details>
<summary>Why are we adding "<strong><em>--alias forge</em></strong>"?</summary>
<p>That's the reason why we're creating a different network, to make things easier for gdm_scribe when we pass the env value for the gdm_forge url</p>
<p>Instead of http://<strong>gdm_forge-api-1</strong>:50051</p>
<p>It's much better: http://<strong>forge</strong>:50051</p>
</details>
<br/>

With that, both containers can see each other, which for Forge doesn't mean much, but 
it means everything for gdm_scribe

We're halfway there! Now, go to [Scribe](https://github.com/LucasRodriguesOliveira/gdm_scribe) Project and Rock!

## Tests

```bash
## Run tests

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Resources

Most details can be found inside the GDM Project Documentation on Eraser

## License

Forge is [MIT licensed](https://github.com/LucasRodriguesOliveira/gdm_forge/blob/master/LICENSE).
