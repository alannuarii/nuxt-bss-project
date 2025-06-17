<template>
  <div class="container-fluid">
    <div class="row gx-0">
      <div class="text-center my-3">
        <div class="btn-group">
          <NuxtLink :to="`/optimization/${yesterday}`" class="btn btn-sm btn-secondary" :class="{ active: route.params.date === yesterday }" aria-current="page"> Hari Ini </NuxtLink>
          <NuxtLink :to="`/optimization/${today}`" class="btn btn-sm btn-secondary" :class="{ active: route.params.date === today }"> Besok </NuxtLink>
        </div>
      </div>
      <hr />

      <div class="col-md-6 px-4 text-center">
        <Setting :settingData="settingParameter" />
      </div>
      <div class="col-md-6">
        <ClientOnly>
          <PlotlyChart :x="x4" :y="y4" :forecastDate="date" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { format, subDays } from "date-fns";
import PlotlyChart from "~/components/PlotlyChart.vue";
import { date2 } from "@/utils/date";
import Setting from "~/components/Setting.vue";

const route = useRoute();
const date = route.params.date;

const todayDate = new Date();
const today = format(todayDate, "yyyy-MM-dd");
const yesterday = format(subDays(todayDate, 1), "yyyy-MM-dd");

const irr1 = ref([]);
const irr2 = ref([]);
const irr3 = ref([]);
const minIrr = ref([]);
const maxIrr = ref([]);
const error = ref(null);

const fetchOpt = async () => {
  try {
    const res = await $fetch(`/api/optimization/${date}`);
    error.value = null;
    irr1.value = res?.data?.irr1 ?? [];
    irr2.value = res?.data?.irr2 ?? [];
    irr3.value = res?.data?.irr3 ?? [];
    minIrr.value = res?.data?.avg ?? [];
    maxIrr.value = res?.data?.max ?? [];
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
  }
};

onMounted(() => {
  fetchOpt();
});

const x4 = computed(() => minIrr.value.map((item) => date2(item.waktu)));
const y4 = computed(() => minIrr.value.map((item) => item.irradiance));
const sumMin = computed(() => minIrr.value.map((item) => item.irradiance / 360));
const totalmin = computed(() => sumMin.value.reduce((acc, cur) => acc + cur, 0));
const forecastProduksiPV = computed(() => totalmin.value * 6.8 * 0.1917);

const x5 = computed(() => maxIrr.value.map((item) => date2(item.waktu)));
const y5 = computed(() => maxIrr.value.map((item) => item.irradiance));
const sumMax = computed(() => maxIrr.value.map((item) => item.irradiance / 360));
const totalMax = computed(() => sumMax.value.reduce((acc, cur) => acc + cur, 0));
const forecastProduksiPVBSS = computed(() => totalMax.value * 6.8 * 0.1917);

const arrayRampRate = computed(() => {
  const result = [];
  for (let i = 1; i < y4.value.length - 1; i++) {
    const selisih = y5.value[i + 1] - y4.value[i];
    if (!isNaN(selisih)) {
      result.push(selisih);
    }
  }
  return result;
});

const arrayMaxBeban = computed(() => {
  const result = [];
  for (let i = 1; i < y4.value.length; i++) {
    result.push(y5.value[i] - y4.value[i]);
  }
  return result;
});

const forecastSmooting = computed(() => forecastProduksiPVBSS.value - forecastProduksiPV.value);
const kebutuhanDoD = computed(() => (forecastSmooting.value / 900) * 100);
const maxBebanBSS = computed(() => {
  const max = Math.max(...arrayMaxBeban.value) * 6.8 * 0.1917;
  return max < 600 ? max : 600;
});
const rampRate = computed(() => {
  const max = Math.max(...arrayRampRate.value) * 6.8 * 0.1917;
  return max < 200 ? max : 20;
});

const settingParameter = computed(() => {
  if (minIrr.value.length === 0 || maxIrr.value.length === 0) {
    return [];
  }

  return [
    {
      tanggal: date,
      prod_pv: forecastProduksiPV.value,
      smooth_bss: forecastSmooting.value,
      total_pv_bss: forecastProduksiPVBSS.value,
      dod: kebutuhanDoD.value,
      crate: 0.2,
      ramprate: rampRate.value,
      maxbss: maxBebanBSS.value,
    },
  ];
});
</script>

<style scoped>
.btn-group {
  width: 20%;
}
</style>
