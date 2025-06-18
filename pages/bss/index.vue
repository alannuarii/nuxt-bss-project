<template>
  <section class="desktop">
    <div class="container-fluid mx-4 mt-4">
      <div v-if="error" class="text-center text-light p-5">Error: {{ error }}</div>

      <div v-else class="row text-center">
        <div class="col-6">
          <div class="text-light">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <button class="btn btn-sm btn-light rounded-0" @click="handlePrevious" :disabled="activeIndex === 0">« Previous</button>
              <div class="text-center">
                <h4 class="fw-bold mb-0">BMS {{ shortedData[activeIndex]?.id_bms }}</h4>
                <p>Ranked by lowest capacity of BMS</p>
              </div>
              <button class="btn btn-sm btn-light rounded-0 me-5" @click="handleNext" :disabled="activeIndex >= shortedData.length - 1">Next »</button>
            </div>

            <label>Capacity</label>
            <div class="progress mb-3 me-5">
              <div class="progress-bar" :style="{ width: (shortedData[activeIndex]?.capacity || 0).toFixed(2) + '%' }">{{ (shortedData[activeIndex]?.capacity || 0).toFixed(2) }}%</div>
            </div>

            <div class="row">
              <div class="col-4">
                <div
                  v-for="item in [
                    { label: 'RUL', value: shortedData[activeIndex]?.rul },
                    { label: 'SOC', value: shortedData[activeIndex]?.soc },
                    { label: 'Temperature', value: shortedData[activeIndex]?.temperature },
                    { label: 'Min Voltage', value: shortedData[activeIndex]?.min_volt },
                    { label: 'Max Voltage', value: shortedData[activeIndex]?.max_volt },
                    { label: 'Avg Voltage', value: shortedData[activeIndex]?.avg_volt },
                    { label: 'Total Voltage', value: shortedData[activeIndex]?.voltage },
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
                    <input type="text" class="text-center form-control form-control-sm" :value="shortedData[activeIndex]?.[`cell${cell}`] ?? '-'" disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="rounded-0 mb-2 mx-3">
            <div class="card-header bg-dark text-light">
              <div class="btn-group">
                <button class="btn btn-sm btn-secondary" :class="{active:activeTab === 'bss1'}" @click="activeTab = 'bss1'">BSS 1</button>
                <button class="btn btn-sm btn-secondary" :class="{active:activeTab === 'bss2'}" @click="activeTab = 'bss2'">BSS 2</button>
              </div>
            </div>

            <div v-if="isDataAvailable(bss1Data) && isDataAvailable(bss2Data)" class="card-body bg-dark px-4 text-light">
              <!-- BSS 1 Tab -->
              <div v-if="activeTab === 'bss1'">
                <h5 class="mb-2">BSS Feeder 1</h5>
                <div class="bss-card-grid">
                  <div v-for="data in bss1Data" :key="data.id_bms" class="card bss-card rounded-0">
                    <NuxtLink :to="`/bss/bms/${data.id_bms}`" class="title btn text-light"> BMS {{ data.id_bms }} </NuxtLink>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        :class="{
                          'bg-success': data.capacity >= 60,
                          'bg-warning': data.capacity >= 30 && data.capacity < 60,
                          'bg-danger': data.capacity < 30,
                        }"
                        :style="{ width: data.capacity.toFixed(2) + '%' }"
                      >
                        <span class="capacity">{{ data.capacity.toFixed(2) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- BSS 2 Tab -->
              <div v-if="activeTab === 'bss2'">
                <h5 class="mb-2">BSS Feeder 2</h5>
                <div class="bss-card-grid">
                  <div v-for="data in bss2Data" :key="data.id_bms" class="card bss-card rounded-0">
                    <NuxtLink :to="`/bss/bms/${data.id_bms}`" class="title btn text-light"> BMS {{ data.id_bms }} </NuxtLink>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        :class="{
                          'bg-success': data.capacity >= 60,
                          'bg-warning': data.capacity >= 30 && data.capacity < 60,
                          'bg-danger': data.capacity < 30,
                        }"
                        :style="{ width: data.capacity.toFixed(2) + '%' }"
                      >
                        <span class="capacity">{{ data.capacity.toFixed(2) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-light p-3">
              <div class="spinner-border text-light mb-2" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Memuat data BSS...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const bss1Data = ref([]);
const bss2Data = ref([]);
const error = ref(null);
const activeTab = ref("bss1");
const activeIndex = ref(0);

const fetchBss = async (feeder) => {
  try {
    const res = await $fetch(`/api/bss/${feeder}`);
    error.value = null;
    return res;
  } catch (err) {
    error.value = err.message;
    console.error(`Fetch error ${feeder}:`, err);
    return [];
  }
};

const fetchData = async () => {
  bss1Data.value = await fetchBss("bss1");
  bss2Data.value = await fetchBss("bss2");
};

const sortByCapacityAsc = (data1, data2) => {
  return [...data1, ...data2].sort((a, b) => a.capacity - b.capacity);
};

const shortedData = computed(() => sortByCapacityAsc(bss1Data.value, bss2Data.value));

const handleNext = () => {
  if (activeIndex.value < shortedData.value.length - 1) activeIndex.value++;
};

const handlePrevious = () => {
  if (activeIndex.value > 0) activeIndex.value--;
};

const isDataAvailable = (data) => data && data.length > 0;

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
h4 {
  margin: 0px;
  font-size: 1.5rem;
}
.unit {
  margin: 0px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}
.card-header {
  margin: 0px;
  font-size: 0.7rem;
}
.card-header,
.card-body {
  padding: 0.5rem;
}
h5 {
  margin: 0px;
  font-size: 0.9rem;
  font-weight: 600;
}
.bss-card-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 0.5rem;
}

.bss-card {
  background-color: #1e1e1e;
  color: white;
  padding: 0.4rem;
  border: 1px solid #ccc;
}

.title {
  margin: 0px;
  padding: 0px;
  font-size: 0.5rem !important;
  font-weight: 600;
  border: none;
}

.capacity {
  margin: 0px;
  font-size: 0.5rem;
}
label,
input {
  font-size: 0.8rem !important;
}

p {
  margin: 0px;
  font-size: 0.7rem;
}

.btn-group {
  width: 30%;
}
</style>
