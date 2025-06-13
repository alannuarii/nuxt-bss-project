<!-- components/Timer.vue -->
<template>
  <div class="text-center">
    <h5 class="text-light">{{ formattedDate }} {{ time }} WITA</h5>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { date, getToday } from "@/utils/date.js";

const time = ref("00:00:00");
const today = getToday();

const formattedDate = computed(() => date(today));

let interval;

const updateTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  time.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateTime();
  interval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
h5 {
  margin: 0px;
  font-size: 13px;
  font-weight: 300;
}
</style>
