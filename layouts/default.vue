<template>
  <main class="desktop bg-dark">
    <Header />

    <div class="content px-0">
      <slot />
    </div>
  </main>
</template>

<script setup>
// Import komponen header
import Header from "@/components/Header.vue";

// Metadata halaman
useHead({
  title: "BSS Optima",
  meta: [
    {
      name: "description",
      content: "Dashboard PLTD Tahuna",
    },
  ],
});
</script>

<style scoped>
.content {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 55px;
}

@media screen and (max-width: 1000px) {
  .content {
    padding-top: 60px;
  }
}
</style>
