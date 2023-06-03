<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
import { ElMessageBox, ElNotification } from 'element-plus'

interface Information {
  _id: String
  agency: String
  own: String
  hotline: String
  address: String
  email: String
  fanpage: String
  website: String
}

const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const informations = ref<Information>({
  _id: '',
  agency: '',
  own: '',
  hotline: '',
  address: '',
  email: '',
  fanpage: '',
  website: ''
})

const fetchInformations = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/information')
    const fetchedInformation = response.data[0]
    if (fetchedInformation) {
      informations.value = {
        _id: fetchedInformation._id,
        agency: fetchedInformation.agency,
        own: fetchedInformation.own,
        hotline: fetchedInformation.hotline,
        address: fetchedInformation.address,
        email: fetchedInformation.email,
        fanpage: fetchedInformation.fanpage,
        website: fetchedInformation.website
      }
    }
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const cancelForm = () => {
  fetchInformations()
}

const onClick = (item: any) => {
  const newInformation = { ...informations.value }

  if (newInformation._id) {
    axios
      .put(`http://127.0.0.1:3333/information/${newInformation._id}`, newInformation)
      .then((response) => {
        console.log(response.data)
        fetchInformations()
        loading.value = false
        ElNotification({
          title: 'Thành công',
          type: 'success'
        })
      })
      .catch((error) => {
        console.log(error)
        ElNotification({
          title: 'Thất bại',
          type: 'error'
        })
      })
  }
}

const handleOnClick = async (item: any) => {
  try {
    await ElMessageBox.confirm('Bạn muốn lưu?', 'Xác nhận', {
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy'
    })
    loading.value = true
    await onClick(item)
    loading.value = false
  } catch (error) {
    console.log('error')
  }
}

onMounted(() => {
  fetchInformations()
})
</script>

<template>
  <el-main class="information-list-main">
    <h1>THÔNG TIN CƠ SỞ</h1>
    <el-form
      ref="ruleFormRef"
      :model="informations"
      label-width="120px"
      class="information-form"
      size="large"
    >
      <el-form-item label="Tên cơ sở" prop="agency" class="information-form-item">
        <el-input v-model="informations.agency" />
      </el-form-item>
      <el-form-item label="Chủ cơ sở" prop="agency" class="information-form-item">
        <el-input v-model="informations.own" />
      </el-form-item>
      <el-form-item label="Hotline" prop="agency" class="information-form-item">
        <el-input v-model="informations.hotline" />
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="agency" class="information-form-item">
        <el-input v-model="informations.address" />
      </el-form-item>
      <el-form-item label="Email" prop="agency" class="information-form-item">
        <el-input v-model="informations.email" />
      </el-form-item>
      <el-form-item label="Fanpage" prop="agency" class="information-form-item">
        <el-input v-model="informations.fanpage" />
      </el-form-item>
      <el-form-item label="Website" prop="agency" class="information-form-item">
        <el-input v-model="informations.website" />
      </el-form-item>
    </el-form>
    <div class="information-drawer-button">
      <el-button @click="cancelForm">Hủy bỏ</el-button>
      <el-button type="primary" :loading="loading" @click="handleOnClick">{{
        loading ? '' : 'Lưu'
      }}</el-button>
    </div>
  </el-main>
</template>

<style scoped>
h1 {
  margin-bottom: 50px;
  font-size: 200%;
}
.information-form-item {
  width: 1000px;
}

.material-drawer-button {
  position: absolute;
  right: 20px;
}
</style>
