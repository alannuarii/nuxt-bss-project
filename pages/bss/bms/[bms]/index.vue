<template>
  <section class="desktop">
    <div class="container-fluid mx-4 mt-4">
      <div v-if="error" class="text-center text-light p-5">Error: {{ error }}</div>
      <div class="row text-center" v-else>
        <div class="col-6">
          <div class="text-light">
            <div class="mb-3">
              <div class="text-center">
                <h4 class="fw-bold mb-0">BMS {{ activeData?.id_bms ?? bms }}</h4>
                <p>Ranked by lowest capacity of BMS</p>
              </div>
            </div>

            <label>Capacity</label>
            <div class="progress mb-3 me-5">
              <div class="progress-bar" :style="{ width: (activeData?.capacity ?? 0).toFixed(2) + '%' }">{{ (activeData?.capacity ?? 0).toFixed(2) }}%</div>
            </div>

            <div class="row">
              <div class="col-4">
                <div
                  v-for="item in [
                    { label: 'RUL', value: activeData?.rul },
                    { label: 'SOC', value: activeData?.soc },
                    { label: 'Temperature', value: activeData?.temperature },
                    { label: 'Min Voltage', value: activeData?.min_volt },
                    { label: 'Max Voltage', value: activeData?.max_volt },
                    { label: 'Avg Voltage', value: activeData?.avg_volt },
                    { label: 'Total Voltage', value: activeData?.voltage },
                  ]"
                  :key="item.label"
                  class="row mb-3"
                >
                  <label class="text-start col-sm-5 col-form-label">{{ item.label }}</label>
                  <div class="col-sm-6">
                    <input type="text" class="text-center form-control form-control-sm" :value="item.value ?? '-'" disabled />
                  </div>
                </div>
              </div>

              <div v-for="col in [0, 1]" :key="col" class="col-4">
                <div v-for="cell in Array.from({ length: 8 }, (_, i) => i + 1 + col * 8)" :key="cell" class="row mb-3">
                  <label class="text-start col-sm-4 col-form-label">Cell {{ cell }}</label>
                  <div class="col-sm-6">
                    <input type="text" class="text-center form-control form-control-sm" :value="activeData?.[`cell${cell}`] ?? '-'" disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHART SECTION -->
        <div class="col-6">
          <div class="text-light">
            <div class="btn-group mb-3">
              <button class="btn btn-sm btn-secondary" :class="{ active: selectedTab === 'voltToCap' }" @click="selectedTab = 'voltToCap'">Voltage to Capacity</button>
              <button class="btn btn-sm btn-secondary" :class="{ active: selectedTab === 'capToRul' }" @click="selectedTab = 'capToRul'">Capacity to RUL</button>
            </div>

            <div v-if="chartLoading" class="text-center text-light p-3">
              <div class="spinner-border text-light mb-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Memuat chart BMS...</p>
            </div>

            <div v-show="!chartLoading && selectedTab === 'voltToCap'" ref="chartVoltToCapRef" style="height: 400px"></div>
            <div v-show="!chartLoading && selectedTab === 'capToRul'" ref="chartCapToRulRef" style="height: 400px"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const bms = Number(route.params.bms);

const bss1Data = ref([]);
const bss2Data = ref([]);
const voltToCapData = ref([]);
const capToRulData = ref([]);
const error = ref(null);
const chartVoltToCapRef = ref(null);
const chartCapToRulRef = ref(null);
const selectedTab = ref("voltToCap");
const chartLoading = ref(true);
let Plotly = null; // inisialisasi Plotly

const fetchData = async (endpoint) => {
  try {
    const res = await $fetch(endpoint);
    error.value = null;

    if (res?.data) return res.data; // ✅ ambil langsung array-nya

    return res; // fallback
  } catch (err) {
    error.value = err.message;
    console.error(`Fetch error ${endpoint}:`, err);
    return [];
  }
};

const renderVoltToCapChart = () => {
  if (!Plotly || !voltToCapData.value.length || !chartVoltToCapRef.value || !activeData.value) return;

  const voltage = voltToCapData.value.map((item) => item.Voltage);
  const capacity = voltToCapData.value.map((item) => item.Capacity);

  const activeVolt = activeData.value.avg_volt;
  const activeCap = activeData.value.capacity;

  const data = [
    {
      x: voltage,
      y: capacity,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "skyblue" },
      name: "Voltage vs Capacity",
    },
    {
      x: [activeVolt],
      y: [activeCap],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 12,
        line: { color: "black", width: 2 },
      },
      name: "Current BMS Point",
    },
  ];

  const layout = {
    xaxis: {
      title: { text: "Voltage (V)", font: { color: "white", size: 14 } },
      showgrid: true,
      tickfont: { color: "white" },
    },
    yaxis: {
      title: { text: "Capacity (%)", font: { color: "white", size: 14 } },
      showgrid: true,
      tickfont: { color: "white" },
    },
    margin: { t: 30 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "white" },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: -0.3,
      xanchor: "center",
      x: 0.5,
      font: { color: "white" },
    },
    shapes: [
      {
        type: "line",
        x0: Math.min(...voltage),
        x1: Math.max(...voltage),
        y0: activeCap,
        y1: activeCap,
        line: { color: "red", width: 1, dash: "dash" },
      },
      {
        type: "line",
        x0: activeVolt,
        x1: activeVolt,
        y0: Math.min(...capacity),
        y1: Math.max(...capacity),
        line: { color: "red", width: 1, dash: "dash" },
      },
    ],
  };

  Plotly.newPlot(chartVoltToCapRef.value, data, layout, { responsive: true });
};

const renderCapToRulChart = () => {
  if (!Plotly || !capToRulData.value.length || !chartCapToRulRef.value || !activeData.value) return;

  const capacity = capToRulData.value.map((item) => item.Capacity);
  const rul = capToRulData.value.map((item) => item.RUL);

  const activeCap = activeData.value.capacity;
  const activeRul = activeData.value.rul;

  const data = [
    {
      x: capacity,
      y: rul,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "limegreen" },
      name: "Capacity vs RUL",
    },
    {
      x: [activeCap],
      y: [activeRul],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 12,
        line: { color: "black", width: 2 },
      },
      name: "Current BMS Point",
    },
  ];

  const layout = {
    xaxis: {
      title: { text: "Capacity (%)", font: { color: "white", size: 14 } },
      showgrid: true,
      tickfont: { color: "white" },
    },
    yaxis: {
      title: { text: "RUL (Cycles)", font: { color: "white", size: 14 } },
      showgrid: true,
      tickfont: { color: "white" },
    },
    margin: { t: 30 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "white" },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: -0.3,
      xanchor: "center",
      x: 0.5,
      font: { color: "white" },
    },
    shapes: [
      {
        type: "line",
        x0: activeCap,
        x1: activeCap,
        y0: Math.min(...rul),
        y1: Math.max(...rul),
        line: { color: "red", width: 1, dash: "dash" },
      },
      {
        type: "line",
        x0: Math.min(...capacity),
        x1: Math.max(...capacity),
        y0: activeRul,
        y1: activeRul,
        line: { color: "red", width: 1, dash: "dash" },
      },
    ],
  };

  Plotly.newPlot(chartCapToRulRef.value, data, layout, { responsive: true });
};

const fetchAllData = async () => {
  chartLoading.value = true;
  bss1Data.value = await fetchData("/api/bss/bss1");
  bss2Data.value = await fetchData("/api/bss/bss2");
  voltToCapData.value = await fetchData("/dataset/volt_to_cap.json");
  capToRulData.value = await fetchData("/dataset/cap_to_rul.json");
  renderVoltToCapChart();
  renderCapToRulChart();
  chartLoading.value = false;
};

const shortedData = computed(() => {
  return [...bss1Data.value, ...bss2Data.value].sort((a, b) => a.capacity - b.capacity);
});

const activeData = computed(() => shortedData.value.find((item) => item.id_bms === bms));

watch(selectedTab, (tab) => {
  if (tab === "voltToCap") renderVoltToCapChart();
  else if (tab === "capToRul") renderCapToRulChart();
});

onMounted(async () => {
  if (process.client) {
    const plotlyModule = await import("plotly.js-dist-min");
    Plotly = plotlyModule.default || plotlyModule;
    await fetchAllData();
  }
});
</script>

<style scoped>
h4 {
  font-size: 1.5rem;
}
.unit {
  font-size: 0.9rem;
  font-weight: 600;
}
.card-header,
.card-body {
  padding: 0.5rem;
}
h5 {
  font-size: 0.9rem;
  font-weight: 600;
}
label,
input {
  font-size: 0.8rem !important;
}
:deep(.js-plotly-plot) {
  width: 100% !important;
}
.nav-tabs .nav-link {
  color: #aaa;
}
.nav-tabs .nav-link.active {
  background-color: #343a40;
  color: white;
  border-color: #dee2e6 #dee2e6 #343a40;
}
</style>
