<template>
  <div class="card bg-dark rounded-0 border-2 border-light p-2 col-md-6">
    <!-- PLTS -->
    <div class="mb-2">
      <h5 class="text-light">PLTS</h5>
      <template v-if="lvsw1Data && lvsw2Data">
        <span class="badge rounded-0" :class="lvsw1Data[0]?._value + lvsw2Data[0]?._value === 0 ? 'text-bg-warning' : 'text-bg-success'">
          {{ lvsw1Data[0]?._value + lvsw2Data[0]?._value === 0 ? "Standby" : "Operating" }}
        </span>
      </template>
      <div v-else class="spinner-border spinner-border-sm text-light" role="status"></div>
    </div>

    <template v-if="allDataAvailable">
      <div class="row gx-2">
        <div v-for="card in mainCards" :key="card.label" class="col-md-4">
          <div class="card rounded-0 mb-2">
            <div class="card-header bg-dark text-light">{{ card.label }}</div>
            <div class="card-body bg-dark-subtle">
              <h6>{{ card.value }}</h6>
            </div>
          </div>
        </div>
      </div>

      <!-- Battery Storage System -->
      <div class="card rounded-0 mb-2">
        <NuxtLink :to="`/bss`" class="card-header bg-dark text-light text-decoration-none"> Battery Storage System</NuxtLink>
        <div class="card-body bg-dark">
          <div class="row gx-2">
            <div v-for="card in batteryCards" :key="card.label" class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">{{ card.label }}</div>
                <div class="card-body bg-dark-subtle">
                  <h6>{{ card.value }}</h6>
                </div>
              </div>
            </div>
          </div>

          <div class="row gx-2">
            <div v-for="(d, index) in batteryStatus" :key="index" class="col-6">
              <div class="card rounded-0 mb-2">
                <div class="card-header bg-dark text-light">Status</div>
                <div class="card-body bg-dark-subtle">
                  <h6>
                    {{ d > 0 ? "Discharging" : d <= -1 ? "Charging" : "-" }}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weather Station -->
      <div class="card rounded-0 mb-2">
        <div class="card-header bg-dark text-light">Weather Station</div>
        <div class="card-body bg-dark">
          <div class="d-flex flex-wrap justify-content-between">
            <div v-for="field in dataFields" :key="field" class="card card-ws rounded-0 mb-2">
              <div class="card-header bg-dark text-light text-wrap">{{ field }}</div>
              <div class="card-body bg-dark-subtle">
                <h6>{{ getValueByField(field) }} {{ getUnits(field) }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center text-light p-3">
      <div class="spinner-border text-light mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Memuat data PLTS...</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  weatherData: Array,
  it1Data: Array,
  it2Data: Array,
  lvsw1Data: Array,
  lvsw2Data: Array,
});

const dataFields = ["Air Temperature", "External Temperature", "Global Irradiance", "Relative Humidity", "Wind Direction", "Wind Speed"];

const getUnits = (field) => {
  if (field.includes("Temperature")) return "°C";
  if (field === "Global Irradiance") return "W/m2";
  if (field === "Wind Direction") return "°";
  if (field === "Wind Speed") return "m/s";
  if (field === "Relative Humidity") return "%";
  return "";
};

const getValueByField = (field) => {
  const item = props.weatherData?.find((d) => d._field === field);
  return item ? Number(item._value).toFixed(0) : 0;
};

const allDataAvailable = computed(() => [props.lvsw1Data, props.lvsw2Data, props.it1Data, props.it2Data, props.weatherData].every((d) => Array.isArray(d) && d.length > 0));

const mainCards = computed(() => [
  {
    label: "Active Power",
    value: ((props.lvsw1Data?.[0]?._value || 0) + (props.lvsw2Data?.[0]?._value || 0)).toFixed(0) + " kW",
  },
  {
    label: "Reactive Power",
    value: ((props.lvsw1Data?.[4]?._value || 0) + (props.lvsw2Data?.[4]?._value || 0)).toFixed(0) + " kVAR",
  },
  {
    label: "Power Factor",
    value: props.lvsw1Data?.[3]?._value !== 0 ? Number(props.lvsw1Data?.[3]?._value).toFixed(2) : Number(props.lvsw2Data?.[3]?._value || 0).toFixed(2),
  },
]);

const batteryCards = computed(() => [
  {
    label: "Feeder #1",
    value: (props.it1Data?.[0]?._value || 0).toFixed(0) + " kW",
  },
  {
    label: "Feeder #2",
    value: (props.it2Data?.[0]?._value || 0).toFixed(0) + " kW",
  },
]);

const batteryStatus = computed(() => [props.it1Data?.[0]?._value || 0, props.it2Data?.[0]?._value || 0]);
</script>

<style scoped>
h5 {
  margin: 0px;
  font-size: 0.9rem;
  font-weight: 600;
}
h6,
.card-header {
  margin: 0px;
  font-size: 0.7rem;
}
.card-header,
.card-body {
  padding: 0.5rem;
}

.card-ws {
  width: 32%;
}

@media screen and (max-width: 1000px) {
  .card-ws {
    width: 49%;
  }
}
</style>
