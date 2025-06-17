<template>
  <div>
    <div v-if="isLoading" class="text-center text-light p-3">
      <div class="spinner-border text-light mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Memuat chart irradiance...</p>
    </div>
    <div v-show="!isLoading" ref="plotlyContainer" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import Plotly from "plotly.js-dist-min";

const props = defineProps({
  x: { type: Array, required: true },
  y: { type: Array, required: true },
  title: { type: String, default: "Chart Title" },
  display: { type: Object, default: () => ({ responsive: true }) },
});

const plotlyContainer = ref(null);
const isLoading = ref(true);

// Fungsi utama menggambar chart
const drawChart = async () => {
  isLoading.value = true;

  await nextTick(); // Tunggu DOM dan binding siap

  if (!plotlyContainer.value) {
    console.warn("Container chart belum siap.");
    return;
  }

  const trace1 = {
    x: props.x,
    y: props.y,
    mode: "lines",
    type: "scatter",
    name: "Line Chart",
    line: {
      color: "rgb(67, 166, 163)",
      width: 1,
    },
  };

  const layout = {
    title: props.title,
    xaxis: { title: "Time" },
    yaxis: { title: "Global Irradiance (Watt/m²)" },
    autosize: true,
    useResizeHandler: true,
    // margin: { l: 40, r: 20, t: 40, b: 40 },
  };

  try {
    await Plotly.newPlot(plotlyContainer.value, [trace1], layout, props.display);
  } catch (error) {
    console.error("Gagal menggambar chart:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watcher: gambar chart ketika data siap
watch(
  () => [props.x, props.y],
  ([x, y]) => {
    const hasData = Array.isArray(x) && x.length > 0 && Array.isArray(y) && y.length > 0;
    if (hasData) {
      drawChart();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.chart {
  width: 100%;
}
</style>
