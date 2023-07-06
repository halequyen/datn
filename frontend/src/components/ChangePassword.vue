<script lang="ts" setup>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus/lib/components/form/index.js'
import { store } from '@/stores'
import axios from 'axios'
import { ElNotification } from 'element-plus'

const userName = localStorage.getItem('userName')
const password = localStorage.getItem('password')
const owner = localStorage.getItem('owner')

const ruleFormRef = ref<FormInstance>()
const users = ref<any[]>([])

const userFormData = reactive<any>({
  _id: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  oldPassword: [
    { required: true, message: 'Vui lòng không bỏ trống' },
    {
      validator: (_, value, callback) => {
        if (value === password) {
          callback()
        } else {
          callback(new Error('Mật khẩu không khớp'))
        }
      },
      trigger: 'blur'
    }
  ],
  newPassword: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  confirmPassword: [
    { required: true, message: 'Vui lòng không bỏ trống' },
    {
      validator: (_, value, callback) => {
        if (value === userFormData.newPassword) {
          callback()
        } else {
          callback(new Error('Mật khẩu không khớp'))
        }
      },
      trigger: 'blur'
    }
  ]
}

async function fetchUsers() {
  try {
    const response = await axios.get('http://127.0.0.1:3333/user')
    users.value = response.data
  } catch (error) {
    console.log(error)
  }
}

const changePassword = () => {
  const userFilter = computed(() => users.value.filter((user) => user.userName === userName))
  const newUser = {
    _id: userFilter.value[0]._id,
    userName,
    password: userFormData.newPassword
  }

  axios
    .put(`http://127.0.0.1:3333/user/${newUser._id}`, newUser)
    .then(response => {
      console.log(response.data)
      ElNotification({
        title: 'Thành công',
        type: 'success'
      })
    })
    .catch(error => {
      console.log(error)
      ElNotification({
        title: 'Thất bại',
        type: 'error'
      })
    })
}

onMounted(() => {
  fetchUsers()
})

</script>

<template>
  <div class="login d-flex">
    <div class="login-left">
      <img class="login-left-logo" src="../assets/images/SkinSyncLogo.png" alt="" />
    </div>
    <div class="login-right">
      <h1>ĐỔI MẬT KHẨU</h1>
      <el-form :model="userFormData" class="login-right-form" :rules="rules" ref="ruleFormRef">
        <el-form-item size="large" class="login-form login-form-first" prop="oldPassword">
          <label class="required">Nhập mật khẩu cũ</label>
          <el-input v-model="userFormData.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item size="large" class="login-form" prop="newPassword">
          <label class="required">Nhập mật khẩu mới</label>
          <el-input v-model="userFormData.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item size="large" class="login-form" prop="confirmPassword">
          <label class="required">Nhập lại mật khẩu mới</label>
          <el-input v-model="userFormData.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item class="login-button" size="large">
          <el-button type="primary" @click="changePassword">Đổi mật khẩu</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-left {
  margin: 50px;
}

.login-left-logo {
  width: 400px;
}

.login-right {
  margin: 80px;

  h1 {
    margin: 10px 0;
    font-size: 300%;
    font-weight: 700;
  }

  h2 {
    margin: 40px 0;

    b {
      font-weight: 900;
    }
  }

  .login-right-form {
    margin-top: 50px;

    .login-form {
      width: 100%;
    }
  }

  .login-button {
    margin-top: 30px;
  }
}
</style>

<style>
.old-password {
  margin-bottom: 50px;
}

.login-form-first .el-form-item__content {
  margin-bottom: 20px;
}
</style>
