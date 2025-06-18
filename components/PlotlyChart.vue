<template>
  <div>
    <div class="mb-2 text-center">
      <h4 class="text-light">Forecast Global Irradiance</h4>
      <h5 class="text-light">{{ date(props.forecastDate) }}</h5>
    </div>
    <div v-if="isLoading" class="text-center text-light p-3">
      <div class="spinner-border text-light mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Memuat chart irradiance...</p>
    </div>
    <div v-show="!isLoading" ref="plotlyContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import Plotly from "plotly.js-dist-min";
import { date } from "@/utils/date";

const props = defineProps({
  x: { type: Array, required: true },
  y: { type: Array, required: true },
  display: { type: Object, default: () => ({ responsive: true }) },
  forecastDate: { type: String, required: true },
});

const plotlyContainer = ref(null);
const isLoading = ref(true);

const drawChart = async () => {
  if (!plotlyContainer.value) return;

  const hasData = Array.isArray(props.x) && props.x.length > 0 && Array.isArray(props.y) && props.y.length > 0;

  if (!hasData) {
    console.warn("x atau y kosong atau tidak valid.");
    return;
  }

  const trace = {
    x: props.x,
    y: props.y,
    mode: "lines",
    type: "scatter",
    name: "Irradiance",
    line: {
      color: "rgb(67, 166, 163)",
      width: 1,
    },
  };

  const layout = {
    xaxis: {
      title: { text: "Time", font: { color: "white" } },
      showgrid: true,
      zeroline: false,
      tickangle: -45,
      tickformat: "%H:%M",
      tickfont: { color: "white" },
      automargin: true,
      gridcolor: "rgba(255, 255, 255, 0.1)",
    },
    yaxis: {
      title: { text: "Global Irradiance (W/m²)", font: { color: "white" } },
      showgrid: true,
      zeroline: false,
      tickfont: { color: "white" },
      gridcolor: "rgba(255, 255, 255, 0.1)",
    },
    margin: { l: 60, r: 30, b: 50, t: 50 },
    autosize: true,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "white" },
  };

  try {
    await Plotly.newPlot(plotlyContainer.value, [trace], layout, props.display);
    Plotly.Plots.resize(plotlyContainer.value);
  } catch (err) {
    console.error("Gagal render chart:", err);
  }
};

watch(
  [() => props.x, () => props.y],
  async ([x, y]) => {
    if (Array.isArray(x) && x.length && Array.isArray(y) && y.length) {
      isLoading.value = true;
      await nextTick();
      await drawChart();
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const resizeHandler = () => {
  if (plotlyContainer.value) {
    Plotly.Plots.resize(plotlyContainer.value);
  }
};

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
}
h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}
h5 {
  font-size: 1rem;
  font-weight: 400;
}
</style>
