<template>
  <section class="text-light mt-3">
    <div>
      <h3 class="mb-3 text-center">REKAP DATA SETTING PARAMETER</h3>
    </div>

    <div class="row mb-2 px-2 mx-5">
      <div class="col-6">
        <div class="row d-flex align-items-center">
          <label for="inputMonth" class="col-sm-2 col-form-label">Pilih bulan</label>
          <div class="col-sm-4">
            <form>
              <input type="month" class="form-control form-control-sm" v-model="valueSearch" name="bulan" @change="submitQuery" />
            </form>
          </div>
        </div>
      </div>
      <div class="col-6 d-flex align-items-center justify-content-end">
        <h6>DATA BULAN {{ dataBulan.toUpperCase() }}</h6>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center text-light p-3">
      <div class="spinner-border text-light mb-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Memuat data rekap setting parameter...</p>
    </div>

    <!-- Tabel data -->
    <div v-else class="mx-5">
      <table class="border border-3 table table-bordered text-center bg-white">
        <thead class="table-dark">
          <tr>
            <th class="align-middle">NO</th>
            <th class="align-middle">TANGGAL</th>
            <th class="align-middle">
              <div class="d-flex flex-column justify-content-center align-items-center">
                KEBUTUHAN %DOD
                <p>(%)</p>
              </div>
            </th>
            <th class="align-middle">
              <div class="d-flex flex-column justify-content-center align-items-center">
                SETTING C-RATE
                <p>(C)</p>
              </div>
            </th>
            <th class="align-middle">
              <div class="d-flex flex-column justify-content-center align-items-center">
                SETTING RAMP RATE
                <p>(kW/Hz)</p>
              </div>
            </th>
            <th class="align-middle">
              <div class="d-flex flex-column justify-content-center align-items-center">
                SETTING MAX BEBAN BSS
                <p>(kW)</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(set, index) in settings" :key="set.id">
            <td>{{ index + 1 }}</td>
            <td>{{ date3(set.tanggal) }}</td>
            <td>{{ set.dod.toFixed(2) }}</td>
            <td>{{ set.crate }}</td>
            <td>{{ set.ramprate.toFixed(0) }}</td>
            <td>{{ set.maxbss.toFixed(0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import { date3, getYearMonth, yearMonthID } from "@/utils/date";

const route = useRoute();
const router = useRouter();

const valueSearch = ref(route.query.bulan || getYearMonth());
const settings = ref([]);
const loading = ref(true);
const error = ref(null);

function submitQuery() {
  router.replace({
    query: {
      ...route.query,
      bulan: valueSearch.value,
    },
  });
}

// Fetch wrapper
const fetchRekap = async (month) => {
  try {
    loading.value = true;
    const res = await $fetch(`/api/rekap/${month}`);
    error.value = null;
    return res?.data || [];
  } catch (err) {
    error.value = err.message;
    console.error("Fetch error:", err);
    return [];
  } finally {
    loading.value = false;
  }
};

// Auto-fetch saat valueSearch berubah
watchEffect(async () => {
  loading.value = true;
  settings.value = await fetchRekap(valueSearch.value);
});

const dataBulan = computed(() => yearMonthID(valueSearch.value));
</script>

<style scoped>
thead {
  font-size: 14px;
}
tbody {
  font-size: 12px;
}
thead p {
  margin: 0px;
  font-weight: 400;
}
label {
  font-size: 1vw;
}
h6 {
  margin: 0px;
  font-weight: 700;
}
h3 {
  font-weight: 700;
  font-size: 1.8rem;
}
</style>
