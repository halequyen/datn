<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { formatExpense } from '../../format'

interface ServicePrice {
  _id: String
  name: String
  price: String
  description: String
  type: String
}

const servicePrices = ref<ServicePrice[]>([])
const search = ref('')
const showServiceForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<ServicePrice[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined

const serviceFromData = ref<ServicePrice>({
  _id: '',
  name: '',
  price: '',
  description: '',
  type: ''
})

const fetchServicePrices = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/service_price')
    servicePrices.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value) 
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  servicePrices.value.filter(
    (data) => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const onPageChange = async (pageNumber: number): Promise<void> => {
  currentPage.value = pageNumber
  const rowsNumber = pageSize.value
  const startIndex = (pageNumber - 1) * rowsNumber
  const endIndex = pageNumber * rowsNumber
  pagingData.value = filterTableData.value.slice(startIndex, endIndex)
}

const resetForm = () => {
  serviceFromData.value = {
    _id: '',
    name: '',
    price: '',
    description: '',
    type: ''
  }
}

const openServiceForm = (service: ServicePrice) => {
  showServiceForm.value = true
  serviceFromData.value = { ...service }
}

const onClick = (item: any) => {
  const newService = { ...serviceFromData.value }
  console.log(newService)

  if (newService._id) {
    axios
      .put(`http://127.0.0.1:3333/service_price/${newService._id}`, newService)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchServicePrices()
        showServiceForm.value = false
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
  } else {
    axios
      .post('http://127.0.0.1:3333/service_price', newService)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchServicePrices()
        showServiceForm.value = false
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

const handleClose = () => {
  ruleFormRef.value!.close()
}

const deleteService = (service: ServicePrice) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa dịch vụ này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/service_price/${service._id}`)
        .then((response) => {
          console.log(response.data)
          fetchServicePrices()
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
    })
    .catch(() => {
      console.log('Hủy bỏ xóa dịch vụ')
    })
}

const cancelForm = () => {
  loading.value = false
  showServiceForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchServicePrices()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>

<template>
  <el-main class="service-list-main">
    <h1>BẢNG GIÁ DỊCH VỤ</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên dịch vụ"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openServiceForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên dịch vụ" min-width="300">
          <template #default="scope">
            <div class="service-name primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Mô tả" min-width="400" />
        <el-table-column label="Đơn giá" min-width="200" >
          <template #default="scope">
            <div>
              {{ formatExpense(parseInt(scope.row.price)) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openServiceForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteService(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="d-flex">
      <div class="pagination-total">
        <span>Số lượng: {{ filterTableData.length }}</span>
      </div>
      <div class="pagination-button">
        <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          :total="filterTableData.length"
          background
          layout="prev, pager, next"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </el-main>

  <el-drawer
    ref="ruleFormRef"
    v-model="showServiceForm"
    :before-close="handleClose"
    direction="rtl"
    class="service-drawer"
    size="50%"
  >
    <template #header>
      <div class="service-drawer-title">Thông tin dịch vụ</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="serviceFromData" label-width="140px">
        <el-form-item label="Tên dịch vụ" prop="name" class="service-form-item">
          <el-input v-model="serviceFromData.name"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="description" class="service-form-item">
          <el-input v-model="serviceFromData.description"></el-input>
        </el-form-item>
        <el-form-item label="Giá dịch vụ" prop="price" class="service-form-item">
          <el-input v-model="serviceFromData.price"></el-input>
        </el-form-item>
        <el-form-item label="Phân loại" prop="type" class="service-form-item">
          <el-input v-model="serviceFromData.type"></el-input>
        </el-form-item>
      </el-form>
      <div class="service-drawer-button">
        <el-button @click="cancelForm">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loading" @click="handleOnClick">{{
          loading ? '' : 'Lưu'
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
h1 {
  margin-bottom: 20px;
  font-size: 200%;
}
.input-search {
  width: 250px;
  margin-bottom: 10px;
}
.service-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.service-form-item {
  width: 100%;
}

.service-drawer {
  .service-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .service-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
