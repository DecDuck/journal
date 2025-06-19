<div align="center">
<img src="https://raw.githubusercontent.com/DecDuck/journal/refs/heads/main/icon.png" width="200rem"/>
</div>
<br/>

# Journal

Journal is an open-source lightweight forum software designed to run exclusively on Cloudflare's workers, for cheap or free. It was originally built by the Drop OSS team to be used for their project, but was built with alternative whitelabelling options in mind.

For the record, many of the pages here are **not final.**

## Forum Organisation

Every forum likes to organise posts in their own way. This is how Journal does it:

### Top level: Category

Categories are associated with a single purpose or project. They are also the only organisation structure with permission control for viewing and posting. They can also integrate with a GitHub repository to convert forum threads into issues.

### Second level: Topic

Each category has a series of topics. These are generally correlated to certain features, or something general like "support".

### Final level: Post/thread

Post and thread are used interchangably - it is a single, source post, and then a series of replies.

### Bonus level: Tags

Tags are global, and don't fit into the hierarchy. Tags can be applied at the post level, but between any category and topic.

## Tech Stack

Because of the technical constraints of Cloudflare's workers, we are forced to use this particular stack:

- Nuxt: core framework, SSR, Vue-based, etc
- NuxtHub: providers Cloudflare worker functionality
- Drizzle: ORM, generates migrations and SQL queries

For the frontend, we're using Vue because of Nuxt, and for styling:

- TailwindCSS

## Architecture

Cloudflare workers do not run as a single process, instead executing a global fetch handler with route params every time a request comes in (this is handled by Nuxt/Nitro). We cannot persist data using in-memory variables.

Everything must use the KV store provided by NuxtHub or be saved to the database.

The project is laid out like a standard Nuxt project, but all the frontend uses the optional `app` directory. This is because it was the default.

## Authentication

For now, the backend has opted to use **exclusively session-based** authentication, for simplicity.

For sign in, we have opted to allow various different OAuth2 providers.
