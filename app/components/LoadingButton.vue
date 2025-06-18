<template>
  <button
    type="submit"
    :class="[
      styles[style].base,
      props.disabled ? styles[style].disabled : styles[style].dft,
    ]"
    :disabled="props.disabled"
  >
    <div v-if="props.loading" role="status">
      <svg
        aria-hidden="true"
        :class="['w-5 h-5 animate-spin', styles[style].spinner]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
type Style = "default" | "none" | "simple-red" | "pagination";
const props = defineProps<{
  loading: boolean;
  style?: Style;
  disabled?: boolean;
}>();

const style = props.style ?? "default";

const styles: {
  [key in Style]: {
    base: string;
    dft: string;
    disabled: string;
    spinner: string;
  };
} = {
  ["default"]: {
    base: "cursor-pointer inline-flex min-h-9 items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    dft: "text-white bg-blue-600 hover:bg-blue-500",
    disabled: "text-slate-400 bg-blue-600/10 hover:bg-blue-600/10",
    spinner: "text-transparent fill-white",
  },
  ["simple-red"]: {
    base: "cursor-pointer",
    dft: "text-red-600 hover:text-red-900",
    disabled: "text-red-600 hover:text-red-600",
    spinner: "text-transparent fill-red-600",
  },
  ["pagination"]: {
    base: "relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0",
    dft: "cursor-pointer hover:bg-gray-50",
    disabled: "bg-gray-200",
    spinner: "text-transparent text-zinc-400",
  },
  ["none"]: { base: "", dft: "", disabled: "", spinner: "" },
};
</script>
