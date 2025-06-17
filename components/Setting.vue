<template>
  <div class="mb-4">
    <h3 class="text-light">REKOMENDASI SETTING BSS</h3>
    <h4 class="text-light">{{ date(today) }}</h4>
  </div>
  <div v-if="allDataAvailable" class="text-light text-start">
    <div class="mb-5">
      <h5 class="mb-3">Forecast Produksi</h5>

      <div class="mb-2 row">
        <label class="col-6 col-form-label">Forecast Total Produksi PV</label>
        <div class="col-4">
          <input type="text" class="form-control text-center" :value="prodPv.toFixed(2)" disabled />
        </div>
        <label class="col-2 col-form-label">kWh</label>
      </div>

      <div class="mb-2 row">
        <label class="col-6 col-form-label">Forecast Kebutuhan Smoothing BSS</label>
        <div class="col-4">
          <input type="text" class="form-control text-center" :value="smoothBss.toFixed(2)" disabled />
        </div>
        <label class="col-2 col-form-label">kWh</label>
      </div>

      <div class="row">
        <label class="col-6 col-form-label">Forecast Total Produksi PV + BSS</label>
        <div class="col-4">
          <input type="text" class="form-control text-center" :value="totalPvBss.toFixed(2)" disabled />
        </div>
        <label class="col-2 col-form-label">kWh</label>
      </div>
    </div>

    <div>
      <h5 class="mb-2">Rekomendasi Setting Parameter</h5>

      <div class="row mb-2">
        <div class="col-2 offset-5 text-center feeder">Feeder 1</div>
        <div class="col-2 offset-1 text-center feeder">Feeder 2</div>
      </div>

      <div class="mb-2 row">
        <label class="col-4 col-form-label">Kebutuhan %DoD</label>
        <div class="col-2 offset-1">
          <input type="text" class="form-control text-center" :value="halfDod.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">%</label>
        <div class="col-2">
          <input type="text" class="form-control text-center" :value="halfDod.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">%</label>
      </div>

      <div class="mb-2 row">
        <label class="col-4 col-form-label">Setting C-rate</label>
        <div class="col-2 offset-1">
          <input type="text" class="form-control text-center" :value="halfCrate.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">C</label>
        <div class="col-2">
          <input type="text" class="form-control text-center" :value="halfCrate.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">C</label>
      </div>

      <div class="mb-2 row">
        <label class="col-4 col-form-label">Setting Ramp Rate</label>
        <div class="col-2 offset-1">
          <input type="text" class="form-control text-center" :value="halfRamprate.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">kW/Hz</label>
        <div class="col-2">
          <input type="text" class="form-control text-center" :value="halfRamprate.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">kW/Hz</label>
      </div>

      <div class="row">
        <label class="col-4 col-form-label">Setting Max Beban BSS</label>
        <div class="col-2 offset-1">
          <input type="text" class="form-control text-center" :value="halfMaxbss.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">kW</label>
        <div class="col-2">
          <input type="text" class="form-control text-center" :value="halfMaxbss.toFixed(2)" disabled />
        </div>
        <label class="col-1 col-form-label">kW</label>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-light p-3">
    <div class="spinner-border text-light mb-2" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Memuat data setting parameter...</p>
  </div>
</template>

<script setup>
import { date } from "@/utils/date";

const props = defineProps({
  settingData: Array,
});

const allDataAvailable = computed(() => Array.isArray(props.settingData) && props.settingData.length > 0);

const setting = computed(() => props.settingData[0] ?? {});
const today = computed(() => setting.value.tanggal || 0);
const prodPv = computed(() => setting.value.prod_pv || 0);
const smoothBss = computed(() => setting.value.smooth_bss || 0);
const totalPvBss = computed(() => setting.value.total_pv_bss || 0);
const halfDod = computed(() => (setting.value.dod || 0) / 2);
const halfCrate = computed(() => (setting.value.crate || 0) / 2);
const halfRamprate = computed(() => (setting.value.ramprate || 0) / 2);
const halfMaxbss = computed(() => (setting.value.maxbss || 0) / 2);
</script>

<style scoped>
h5,
h3 {
  font-weight: 700;
}
h4 {
  font-size: 1.2rem;
}
.feeder {
  font-size: 1rem;
}
.form-control,
label {
  font-size: 0.9rem;
}
</style>
