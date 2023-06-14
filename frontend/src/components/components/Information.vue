<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus/lib/components/form/index.js'
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

const onClick = () => {
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

const handleOnClick = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await ElMessageBox.confirm('Bạn muốn lưu?', 'Xác nhận', {
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Hủy'
        })
        loading.value = true
        await onClick()
        loading.value = false
      } catch (error) {
        console.log('error')
      }
    } else {
      console.log('error submit!', fields);
    }
  })
}

const rules = reactive<FormRules>({
  agency: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  own: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  hotline: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  address: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  email: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  fanpage: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  website: [{ required: true, message: 'Vui lòng không bỏ trống' }]
})

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
      :rules="rules"
      label-width="120px"
      class="information-form"
      size="large"
    >
      <el-form-item label="Tên cơ sở" prop="agency" class="information-form-item">
        <el-input v-model="informations.agency" />
      </el-form-item>
      <el-form-item label="Chủ cơ sở" prop="own" class="information-form-item">
        <el-input v-model="informations.own" />
      </el-form-item>
      <el-form-item label="Hotline" prop="hotline" class="information-form-item">
        <el-input v-model="informations.hotline" />
      </el-form-item>
      <el-form-item label="Địa chỉ" prop="address" class="information-form-item">
        <el-input v-model="informations.address" />
      </el-form-item>
      <el-form-item label="Email" prop="email" class="information-form-item">
        <el-input v-model="informations.email" />
      </el-form-item>
      <el-form-item label="Fanpage" prop="fanpage" class="information-form-item">
        <el-input v-model="informations.fanpage" />
      </el-form-item>
      <el-form-item label="Website" prop="website" class="information-form-item">
        <el-input v-model="informations.website" />
      </el-form-item>
    </el-form>
    <div class="information-drawer-button">
      <el-button @click="cancelForm">Hủy bỏ</el-button>
      <el-button type="primary" :loading="loading" @click="handleOnClick(ruleFormRef)">{{
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
  width: 100%;
}

.information-drawer-button {
  position: absolute;
  right: 60px;
}
</style>
