<template>
  <nav class="navbar bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand text-light fw-bold" href="/">
        <img src="/img/np.png" alt="Logo" height="24" class="d-inline-block align-text-top me-3" />
        <h6 class="d-none d-md-inline">BSS OPTIMA | <span>Machine Learning Based Battery Storage System Parameters Optimization</span></h6>
      </a>
      <div class="d-flex align-items-center">
        <div class="me-4 d-none d-md-flex">
          <Timer />
        </div>
        <a href="/logout" class="logout btn btn-sm btn-danger border-2 border rounded-0 text-light"> Logout </a>
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
span{
  margin: 0px;
  font-weight: 400;
}
@media screen and (max-width: 1000px) {
  .logout {
    font-size: 0.8rem;
  }
}
</style>
