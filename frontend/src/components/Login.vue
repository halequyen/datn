<script lang="ts" setup>
import { defineComponent, ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus/lib/components/form/index.js'
import {store} from "@/stores"

const ruleFormRef = ref<FormInstance>()

const login_form = reactive({
  userName: '',
  password: ''
});

const rules = reactive<FormRules>({
  userName: [
    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
    { pattern: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, message: 'Tên đăng nhập không hợp lệ' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu' }
  ],
});

const login = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await store.dispatch('login', login_form);
      } catch (error) {
        console.error('Đăng nhập thất bại:', error.message);
      }
    } else {
      console.log('error submit!', fields)
    }
  })
};

</script>

<template>
    <div class="login d-flex">
      <div class="login-left">
        <img class="login-left-logo" src="../assets/images/SkinSyncLogo.png" alt="">
      </div>
      <div class="login-right">
        <h1>SKIN SYNC</h1>
        <el-form class="login-right-form" :model="login_form" :rules="rules" ref="ruleFormRef">
          <el-form-item size="large" class="login-form" prop="userName">
            <label class="required">Tên đăng nhập</label>
            <el-input v-model="login_form.userName"></el-input>
          </el-form-item>
          <el-form-item size="large" class="login-form" prop="password">
            <label class="required">Mật khẩu</label>
            <el-input v-model="login_form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="login-button" size="large">
            <el-button type="primary" @click="login(ruleFormRef)">Đăng nhập</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </template>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-left {
  margin: 50px;
}

.login-left-logo {
  width: 400px;
}

.login-right {
  margin: 50px;

  h1 {
  margin: 60px;
  font-size: 500%;
  font-weight: 800;
  }

  label {
    font-size: 135%;
  }

  .login-right-form {
    margin-top: 80px;

    .login-form {
      width: 100%;
    }
  }

  .login-button {
    margin-top: 30px;
  }

}

</style>
  