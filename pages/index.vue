<!-- pages/index.vue -->
<template>
  <section class="desktop">
    <div class="container-fluid mx-4 mb-3">
      <Error v-if="error" :message="error" />
      <div v-else class="row text-center">
        <h5 class="text-light mb-2">
          {{ displayFrequency }}
        </h5>
        <div>
          <Plts :weatherData="weatherData" :it1Data="it1Data" :it2Data="it2Data" :lvsw1Data="lvsw1Data" :lvsw2Data="lvsw2Data" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Plts from "@/components/Plts.vue";
import Error from "@/components/Error.vue";

const weatherData = ref([]);
const lvsw1Data = ref([]);
const lvsw2Data = ref([]);
const it1Data = ref([]);
const it2Data = ref([]);
const error = ref(null);

const fetchData = async () => {
  try {
    const [weatherRes, lvsw1Res, lvsw2Res, it1Res, it2Res] = await Promise.all([$fetch("/api/weatherstation"), $fetch("/api/powermeter/LVSW1"), $fetch("/api/powermeter/LVSW2"), $fetch("/api/powermeter/IT1"), $fetch("/api/powermeter/IT2")]);

    weatherData.value = weatherRes?.data ?? [];
    lvsw1Data.value = lvsw1Res?.data ?? [];
    lvsw2Data.value = lvsw2Res?.data ?? [];
    it1Data.value = it1Res?.data ?? [];
    it2Data.value = it2Res?.data ?? [];
  } catch (err) {
    error.value = err.message;
  }
};

const isDataAvailable = (data) => Array.isArray(data) && data.length > 0;

const displayFrequency = computed(() => {
  try {
    if (isDataAvailable(lvsw1Data.value)) {
      return `${lvsw1Data.value[2]?._value?.toFixed(2) || 0} Hz`;
    } else if (isDataAvailable(lvsw2Data.value)) {
      return `${lvsw2Data.value[2]?._value?.toFixed(2) || 0} Hz`;
    }
  } catch {
    return "0 Hz";
  }
  return "0 Hz";
});

let interval;
onMounted(() => {
  fetchData();
  interval = setInterval(fetchData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
h4 {
  margin: 0px;
  font-size: 1.5rem;
}
h5 {
  margin: 0px;
  font-size: 2.3rem;
  font-weight: 900;
}
</style>
