<template>
  <div
    class="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto_1fr] bg-white lg:grid-cols-[max(50%,36rem)_1fr]"
  >
    <header
      class="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8"
    >
      <NuxtLink href="/">
        <span class="sr-only">Home</span>
        <AppIcon class="h-10 w-auto sm:h-12" />
      </NuxtLink>
    </header>
    <main
      class="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8"
    >
      <div class="max-w-lg">
        <p class="text-base/8 font-semibold text-blue-600">403</p>
        <h1
          class="mt-4 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl"
        >
          Not authorized
        </h1>
        <p
          class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
        >
          Sorry, you're not allowed to access this page.
        </p>
        <div class="mt-10">
          <NuxtLink href="/" class="text-sm/7 font-semibold text-blue-600"
            ><span aria-hidden="true">&larr;</span> Back to home</NuxtLink
          >
        </div>
      </div>
    </main>
    <footer class="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
      <div class="border-t border-gray-100 bg-gray-50 py-10">
        <nav
          class="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm/7 text-gray-600 lg:px-8"
        >
          <a href="#">Contact support</a>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            class="size-0.5 fill-gray-300"
          >
            <circle cx="1" cy="1" r="1" />
          </svg>
          <a href="#">Status</a>
        </nav>
      </div>
    </footer>
    <div
      class="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block"
    >
      <img
        src="@/assets/backdrops/uhoh.jpg"
        alt=""
        class="absolute inset-0 size-full object-cover"
      />
    </div>
  </div>
</template>
