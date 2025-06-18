<template>
  <div class="login-layout">
    <slot />
  </div>
</template>

<script setup>
useHead({
  title: "Login | BSS Optima",
  meta: [
    {
      name: "description",
      content: "Halaman Login BSS Optima",
    },
  ],
});
</script>

<style scoped>
.login-layout {
  background-image: url("../public/img/bgbss.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  opacity: 0.8;
}
</style>
