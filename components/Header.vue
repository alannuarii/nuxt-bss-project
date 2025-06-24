<template>
  <nav class="navbar bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand text-light fw-bold" href="/">
        <img src="/img/np.png" alt="Logo" height="24" class="d-inline-block align-text-top me-3" />
        <h6 class="d-none d-md-inline">BSS OPTIMA | <span>Machine Learning Based Battery Storage System Parameters Optimization <span class="version">V2.0.0</span></span></h6>
      </a>
      <div class="d-flex align-items-center">
        <div class="me-4 d-none d-md-flex">
          <Timer />
        </div>
        <img src="/img/icon.png" class="d-inline-block" height="40" alt="" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import Timer from "@/components/Timer.vue";
</script>

<style scoped>
h6 {
  margin: 0px;
  font-weight: 700;
  font-size: 1.2rem;
}
span {
  margin: 0px;
  font-weight: 400;
}
.version{
  font-size: 0.8rem;
}
</style>
