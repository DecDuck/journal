# Journal

Journal is an open-source lightweight forum software designed to run exclusively on Cloudflare's workers, for cheap or free. It was originally built by the Drop OSS team to be used for their project, but was built with alternative whitelabelling options in mind.

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
