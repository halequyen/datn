<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { formatExpense, formatTotalPrices } from '../../format'

interface MedicinePrice {
  _id: String
  name: String
  activeSubstance: String
  unit: String
  concentration: String
  quantity: Number
  price: Number
  type: String
}

const medicinePrices = ref<MedicinePrice[]>([])
const search = ref('')
const showMedicineForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<MedicinePrice[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined

const medicineFromData = ref<MedicinePrice>({
  _id: '',
  name: '',
  unit: '',
  quantity: 0,
  price: 0,
  type: '',
  activeSubstance: '',
  concentration: ''
})

const fetchMedicinePrices = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/medicine_price')
    medicinePrices.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value) 
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  medicinePrices.value.filter(
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
  medicineFromData.value = {
    _id: '',
    name: '',
    unit: '',
    quantity: 0,
    price: 0,
    type: '',
    activeSubstance: '',
    concentration: ''
  }
}

const openMedicineForm = (medicine: MedicinePrice) => {
  showMedicineForm.value = true
  medicineFromData.value = { ...medicine }
}

const onClick = (item: any) => {
  const newMedicine = { ...medicineFromData.value }
  console.log(newMedicine)

  if (newMedicine._id) {
    axios
      .put(`http://127.0.0.1:3333/medicine_price/${newMedicine._id}`, newMedicine)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchMedicinePrices()
        showMedicineForm.value = false
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
      .post('http://127.0.0.1:3333/medicine_price', newMedicine)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchMedicinePrices()
        showMedicineForm.value = false
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

const deleteMedicine = (medicine: MedicinePrice) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa thuốc này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/medicine_price/${medicine._id}`)
        .then((response) => {
          console.log(response.data)
          fetchMedicinePrices()
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
      console.log('Hủy bỏ xóa thuốc')
    })
}

const cancelForm = () => {
  loading.value = false
  showMedicineForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchMedicinePrices()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>

<template>
  <el-main class="medicine-list-main">
    <h1>QUẢN LÝ THUỐC</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên thuốc"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openMedicineForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên thuốc" min-width="300">
          <template #default="scope">
            <div class="medicine-name primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="activeSubstance" label="Hoạt chất" min-width="220" />
        <el-table-column prop="unit" label="ĐVT" min-width="90" />
        <el-table-column prop="concentration" label="Hàm lượng/Nồng độ" min-width="170" />
        <el-table-column label="Đơn giá" min-width="150" >
          <template #default="scope">
            <div>
              {{ formatExpense(parseInt(scope.row.price)) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Số lượng" min-width="150" />
        <el-table-column label="Tổng giá trị" min-width="150" >
          <template #default="scope">
            <div>
              {{ formatTotalPrices(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openMedicineForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteMedicine(scope.row)"
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
    v-model="showMedicineForm"
    :before-close="handleClose"
    direction="rtl"
    class="medicine-drawer"
    size="50%"
  >
    <template #header>
      <div class="medicine-drawer-title">Thông tin thuốc</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="medicineFromData" label-width="140px">
        <el-form-item label="Tên thuốc" prop="name" class="medicine-form-item">
          <el-input v-model="medicineFromData.name"></el-input>
        </el-form-item>
        <el-form-item label="Hoạt chất" prop="activeSubstance" class="medicine-form-item">
          <el-input v-model="medicineFromData.activeSubstance"></el-input>
        </el-form-item>
        <el-form-item label="ĐVT" prop="unit" class="medicine-form-item">
          <el-input v-model="medicineFromData.unit"></el-input>
        </el-form-item>
        <el-form-item label="Hàm lượng/Nồng độ" prop="concentration" class="medicine-form-item">
          <el-input v-model="medicineFromData.concentration"></el-input>
        </el-form-item>
        <el-form-item label="Giá" prop="price" class="medicine-form-item">
          <el-input v-model="medicineFromData.price"></el-input>
        </el-form-item>
        <el-form-item label="Số lượng" prop="quantity" class="medicine-form-item">
          <el-input v-model="medicineFromData.quantity"></el-input>
        </el-form-item>
        <el-form-item label="Tổng giá trị" prop="price" class="medicine-form-item">
          <el-input v-model="medicineFromData.price"></el-input>
        </el-form-item>
        <el-form-item label="Phân loại" prop="type" class="medicine-form-item">
          <el-input v-model="medicineFromData.type"></el-input>
        </el-form-item>
      </el-form>
      <div class="medicine-drawer-button">
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
.medicine-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.medicine-form-item {
  width: 100%;
}

.medicine-drawer {
  .medicine-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .medicine-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
