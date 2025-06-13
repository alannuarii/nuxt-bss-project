<template>
  <div v-if="message" class="container-fluid">
    <div class="d-flex justify-content-center">
      <img src="/img/error.png" class="img-fluid" alt="Error Image" />
    </div>
    <div class="d-flex justify-content-center mt-2">
      <button class="btn btn-sm rounded-0 btn-outline-light" @click="reloadPage" title="Reload Halaman">Reload Page</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: "",
  },
});

const reloadPage = () => {
  location.reload();
};
</script>

<style scoped>
/* Tambahkan jika butuh kustomisasi lebih lanjut */
</style>
