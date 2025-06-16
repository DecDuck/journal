<template>
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" :alt="alt">
    <rect
      x="96"
      y="48"
      width="320"
      height="416"
      rx="48"
      ry="48"
      style="
        fill: none;
        stroke: #2563eb;
        stroke-linejoin: round;
        stroke-width: 32px;
      "
    />
    <line
      x1="320"
      y1="48"
      x2="320"
      y2="464"
      style="
        fill: none;
        stroke: #2563eb;
        stroke-linejoin: round;
        stroke-width: 60px;
      "
    />
  </svg>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const alt = `${runtimeConfig.public.whitelabel.title} Icon`;
</script>
