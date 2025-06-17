<template>
  <div>
    <!-- Tombol Floating Menu -->
    <button
      class="btn btn-secondary position-fixed bottom-0 start-0 m-2 rounded-circle shadow"
      style="width: 40px; height: 40px; font-size: 16px; z-index: 1100"
      @click="toggleMenu"
      aria-label="Toggle navigation menu"
      :class="{ rotate: menuVisible }"
    >
      ☰
    </button>

    <!-- Container animasi muncul/hilang semua menu -->
    <transition name="fade-slide-up-wrapper">
      <div v-if="menuVisible" class="position-fixed start-0 p-2" :style="menuStyle">
        <div v-for="item in menuItems" :key="item.to" class="mb-1 py-2 px-3 bg-white border rounded shadow-sm card-menu" style="min-width: 180px; cursor: pointer" @click="navigateAndClose(item.to)" role="button" tabindex="0">
          <i :class="item.icon" class="me-1"></i>{{ item.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getYesterday } from "@/utils/date";

const menuVisible = ref(false);
const buttonMargin = 16;
const buttonSize = 20;
const menuItems = ref([
  { label: "Home", to: "/", icon: "bi-house" },
  { label: "BSS", to: "/bss", icon: "bi-battery-charging" },
  { label: "Setting Parameter", to: `/optimization/${getYesterday()}`, icon: "bi-gear" },
  { label: "Rekap", to: "/rekap", icon: "bi-table" },
  { label: "Logout", to: "/logout", icon: "bi-box-arrow-right" },
]);

const menuStyle = computed(() => ({
  bottom: `${buttonSize + buttonMargin * 2}px`,
  left: `${buttonMargin}px`,
  zIndex: 1099,
}));

const router = useRouter();

function toggleMenu() {
  menuVisible.value = !menuVisible.value;
}

function navigateAndClose(route) {
  router.push(route);
  menuVisible.value = false;
}
</script>

<style scoped>
.fade-slide-up-wrapper-enter-active,
.fade-slide-up-wrapper-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-up-wrapper-enter-from,
.fade-slide-up-wrapper-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-up-wrapper-enter-to,
.fade-slide-up-wrapper-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.card-menu {
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.rotate {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.card-menu:hover {
  background-color: #e9f5ff;
  border-color: #0d6efd;
}

.card-menu:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}
</style>
