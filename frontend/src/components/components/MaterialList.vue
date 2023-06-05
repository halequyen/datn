<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { formatExpense, formatTotalPrices } from '../../format'

interface Material {
  _id: String
  name: String
  unit: String
  quantity: Number
  price: Number
  type: String
}

const materials = ref<Material[]>([])
const search = ref('')
const showMaterialForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Material[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined

const materialFromData = ref<Material>({
  _id: '',
  name: '',
  unit: '',
  quantity: 0,
  price: 0,
  type: ''
})

const fetchMaterials = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/material')
    materials.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value) 
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  materials.value.filter(
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
  materialFromData.value = {
    _id: '',
    name: '',
    unit: '',
    quantity: 0,
    price: 0,
    type: ''
  }
}

const openMaterialForm = (material: Material) => {
  showMaterialForm.value = true
  materialFromData.value = { ...material }
}

const onClick = (item: any) => {
  const newMaterial = { ...materialFromData.value }
  console.log(newMaterial)

  if (newMaterial._id) {
    axios
      .put(`http://127.0.0.1:3333/material/${newMaterial._id}`, newMaterial)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchMaterials()
        showMaterialForm.value = false
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
      .post('http://127.0.0.1:3333/material', newMaterial)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchMaterials()
        showMaterialForm.value = false
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

const deleteMaterial = (material: Material) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa vật tư này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/material/${material._id}`)
        .then((response) => {
          console.log(response.data)
          fetchMaterials()
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
      console.log('Hủy bỏ xóa vật tư')
    })
}

const cancelForm = () => {
  loading.value = false
  showMaterialForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchMaterials()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>

<template>
  <el-main class="material-list-main">
    <h1>QUẢN LÝ VẬT TƯ</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên vật tư"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openMaterialForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên vật tư" min-width="300">
          <template #default="scope">
            <div class="material-name primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="ĐVT" min-width="90" />
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
              @click="openMaterialForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteMaterial(scope.row)"
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
    v-model="showMaterialForm"
    :before-close="handleClose"
    direction="rtl"
    class="material-drawer"
    size="50%"
  >
    <template #header>
      <div class="material-drawer-title">Thông tin vật tư</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="materialFromData" label-width="140px">
        <el-form-item label="Tên vật tư" prop="name" class="material-form-item">
          <el-input v-model="materialFromData.name"></el-input>
        </el-form-item>
        <el-form-item label="ĐVT" prop="unit" class="material-form-item">
          <el-input v-model="materialFromData.unit"></el-input>
        </el-form-item>
        <el-form-item label="Giá" prop="price" class="material-form-item">
          <el-input v-model="materialFromData.price"></el-input>
        </el-form-item>
        <el-form-item label="Số lượng" prop="quantity" class="material-form-item">
          <el-input v-model="materialFromData.quantity"></el-input>
        </el-form-item>
        <el-form-item label="Tổng giá trị" prop="price" class="material-form-item">
          <el-input v-model="materialFromData.price"></el-input>
        </el-form-item>
        <el-form-item label="Phân loại" prop="type" class="material-form-item">
          <el-input v-model="materialFromData.type"></el-input>
        </el-form-item>
      </el-form>
      <div class="material-drawer-button">
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
.material-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.material-form-item {
  width: 100%;
}

.material-drawer {
  .material-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .material-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
