<template>
  <div class="login-wrapper d-flex">
    <!-- Panel kiri sebagai background (kosong atau bisa diisi sesuai desain) -->
    <div class="left-panel"></div>

    <!-- Panel kanan berisi form login -->
    <div class="right-panel d-flex flex-column justify-content-center align-items-center bg-dark">
      <form @submit.prevent="handleLogin" class="login-form p-4 w-100">
        <div class="icon-user text-center mb-4">
         <img src="/public/img/iconhd.png" width="150" alt="">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label visually-hidden">Username</label>
          <input id="email" v-model="email" type="email" placeholder="Username" class="form-control form-control-lg" required autocomplete="username" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label visually-hidden">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Password" class="form-control form-control-lg" required autocomplete="current-password" />
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="rememberMe" />
            <label class="form-check-label" for="rememberMe">Remember me</label>
          </div>
          <a href="#" class="text-primary text-decoration-none">Forgot Password?</a>
        </div>
        <button type="submit" class="btn btn-secondary btn-lg w-100" :disabled="loading">
          {{ loading ? "Memproses..." : "LOGIN" }}
        </button>
        <p v-if="errorMsg" class="text-danger mt-3 text-center">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "login",
});

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (res?.success) {
      router.push("/");
    } else {
      errorMsg.value = res?.error || "Gagal login.";
    }
  } catch (err) {
    errorMsg.value = "Terjadi kesalahan saat menghubungi server.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
}

/* Panel kiri sebagai background biru keren */
.left-panel {
  width: 50%;
  /* background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); */
  /* clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%); */
}

/* Panel kanan berisi form login */
.right-panel {
  width: 50%;
  padding: 4rem 3rem;
  box-shadow: -10px 0px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-form {
  max-width: 380px;
  width: 100%;
}

.icon-user {
  color: #0d6efd;
}

.form-control-lg {
  border-radius: 50px;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  box-shadow: 0 0 6px rgba(13, 110, 253, 0.3);
  transition: box-shadow 0.3s ease;
}

.form-control-lg:focus {
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.7);
  border-color: #0d6efd;
  outline: none;
}

.btn-secondary {
  /* background-color: #0d6efd; */
  border: none;
  border-radius: 50px;
  font-weight: 600;
  letter-spacing: 1.2px;
  padding: 0.75rem 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0a58ca;
}

.form-check-label {
  user-select: none;
}

a.text-primary:hover {
  text-decoration: underline;
}
</style>
