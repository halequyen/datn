<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { store } from "@/stores"
import { computed, watch, ref, reactive, onMounted } from 'vue'
import Cookies from 'js-cookie'

const token = computed(() => store.state.token)
console.log(token.value);

const router = useRouter()

const logout = async () => {
  try {
    await store.dispatch('logout')
    router.push('/login');
  } catch (error) {
    console.error('Đăng xuất thất bại:', error.message);
  }
};

const refreshToken = async () => {
  try {
    await store.dispatch('refreshToken')
  } catch (error) {
    console.error('Làm mới token thất bại:', error.message);
  }
};

onMounted(async () => {
  if (!token.value) {
    await refreshToken()
  }
});

watch(token, (newValue) => {
  if (newValue === undefined) {
    refreshToken()
  }
});

</script>

<template>
  <header class="header">
    <ul>
      <div class="aside-left-logo">
        <router-link class="no-active-style" to="/">
          <img
            class="aside-left-logo-image"
            src="../assets/images/SkinSyncLogo.png"
            alt=""
            style="width: 50px"
          />
          <span class="aside-left-logo-text">SKINSYNC</span>
        </router-link>
      </div>
    </ul>
    <ul v-if="token" class="login">
      <li><b>Admin</b></li>
      <li>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-gear" /><el-icon
              class="el-icon--right"
              ><arrow-down
            /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Đổi mật khẩu</el-dropdown-item>
              <el-dropdown-item @click="logout">Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

header ul {
  list-style: none;
}

.aside-left-logo {
  position: absolute;
  left: 15px;
  top: 20px;
}

.aside-left-logo-image {
  width: 50px;
}

.aside-left-logo-text {
  font-weight: 700;
  font-size: 150%;
  margin-bottom: 100px;
}

.header-title {
  font-size: 150%;
}

.login {
  display: flex;
  margin-right: 50px;
}

.login li {
  margin-right: 25px;
}

.login b {
  color: #606266;
  font-size: 120%;
}

.login .font-awesome-icon {
  margin-top: 3px;
  font-size: 120%;
}

.login .font-awesome-icon:hover {
  color: black;
}
</style>
