<script setup>
import { defineComponent, ref, reactive } from 'vue';
// import { useStore } from 'vuex'

  const login_form = ref({})
  const store = useStore()

  const rules = ref({
    user: [
      { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, message: 'Tên đăng nhập không hợp lệ', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }
    ],
  });

  const login = () => {
    store.dispatch('login', login_form.value)
    .then(() => {
      store.commit('setLoggedInUser', login_form.value.user)
    })
  }
</script>

<template>
    <div class="login d-flex">
      <div class="login-left">
        <img class="login-left-logo" src="../assets/images/SkinSyncLogo.png" alt="">
      </div>
      <div class="login-right">
        <h1>SKIN SYNC</h1>
        <h2></h2>
        <el-form :model="login_form" :rules="rules" ref="ruleFormRef" label-width="200px">
          <el-form-item label="Tên đăng nhập" class="login-form" prop="user">
            <el-input v-model="login_form.user"></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu" prop="password">
            <el-input v-model="login_form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">Đăng nhập</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </template>

<style scoped>
.login {
  /* align-items: center; */
}

.login-left {
  margin: 50px;
}

.login-left-logo {
  width: 400px;

}

.login-right {
  margin: 50px;
}

.login-right h1 {
  margin-top: 100px;
  font-size: 300%;
  font-weight: 800;
}

.login-form {
  
}

</style>
  