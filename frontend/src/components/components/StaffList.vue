<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import {
  formatDate,
  staffStateColor,
  staffState,
  gender,
} from '../../format'

interface Staff {
  _id: String
  name: String
  gender: String
  dob: String
  phone: String
  jobTitle: String
  email: String
  state: String
}

const staffs = ref<Staff[]>([])
const search = ref('')
const showStaffForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Staff[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined

const staffFromData = ref<Staff>({
  _id: '',
  name: '',
  gender: '',
  dob: '',
  phone: '',
  jobTitle: '',
  email: '',
  state: ''
})

const fetchStaffs = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/staff')
    staffs.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value) 
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  staffs.value.filter(
    (data) => !search.value || data.phone.toLowerCase().includes(search.value.toLowerCase())
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
  staffFromData.value = {
    _id: '',
    name: '',
    gender: '',
    dob: '',
    phone: '',
    jobTitle: '',
    email: '',
    state: ''
  }
}

const openStaffForm = (staff: Staff) => {
  showStaffForm.value = true
  staffFromData.value = { ...staff }
}

const onClick = (item: any) => {
  const newStaff = { ...staffFromData.value }
  console.log(newStaff)

  if (newStaff._id) {
    axios
      .put(`http://127.0.0.1:3333/staff/${newStaff._id}`, newStaff)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchStaffs()
        showStaffForm.value = false
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
      .post('http://127.0.0.1:3333/staff', newStaff)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchStaffs()
        showStaffForm.value = false
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

const deleteStaff = (staff: Staff) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa nhân viên này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/staff/${staff._id}`)
        .then((response) => {
          console.log(response.data)
          fetchStaffs()
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
      console.log('Hủy bỏ xóa nhân viên')
    })
}

const cancelForm = () => {
  loading.value = false
  showStaffForm.value = false
  clearTimeout(timer)
}

const rules = ref({
  name: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  dob: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  phone: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  jobTitle: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  email: [{ required: true, message: 'Vui lòng không bỏ trống' }]
})

onMounted(() => {
  fetchStaffs()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>
<template>
  <el-main class="staff-list-main">
    <h1>DANH SÁCH NHÂN VIÊN</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập số điện thoại"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openStaffForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên nhân viên" min-width="180">
          <template #default="scope">
            <div class="staff-code primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Giới tính" min-width="90">
          <template #default="scope">
            <div>
              {{ gender[scope.row.gender] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jobTitle" label="Chức vụ" min-width="170" />
        <el-table-column label="Ngày sinh" min-width="110">
          <template #default="scope">
            <div>
              {{ formatDate(scope.row.dob) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Số điện thoại" min-width="120" />
        <el-table-column prop="email" label="Email" min-width="150" />
        <el-table-column prop="state" label="Trạng thái" min-width="140">
          <template #default="scope">
            <div
              :style="{
                color: staffStateColor[scope.row.state],
                fontWeight: 700
              }"
            >
              {{ staffState[scope.row.state] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openStaffForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteStaff(scope.row)"
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
    v-model="showStaffForm"
    :before-close="handleClose"
    direction="rtl"
    destroy-on-close
    class="staff-drawer"
    size="50%"
  >
    <template #header>
      <div class="staff-drawer-title">Thông tin nhân viên</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="staffFromData" :rules="rules" label-width="140px">
        <el-form-item label="Tên nhân viên" prop="name" class="staff-form-item">
          <el-input v-model="staffFromData.name"></el-input>
        </el-form-item>
        <el-form-item label="Giới tính" class="staff-form-item" width="100%">
          <el-select v-model="staffFromData.gender" placeholder="Chọn giới tính">
            <el-option label="Nam" :value="'0'" />
            <el-option label="Nữ" :value="'1'" />
            <el-option label="Khác" :value="'2'" />
          </el-select>
        </el-form-item>
        <el-form-item label="Ngày sinh" prop="dob" class="staff-form-item">
          <el-input v-model="staffFromData.dob"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone" class="staff-form-item">
          <el-input v-model="staffFromData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Chức vụ" prop="jobTitle" class="staff-form-item">
          <el-input v-model="staffFromData.jobTitle"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email" class="staff-form-item">
          <el-input v-model="staffFromData.email"></el-input>
        </el-form-item>
        <el-form-item label="Trạng thái" class="staff-form-item">
          <el-select v-model="staffFromData.state" placeholder="Chọn trạng thái">
            <el-option label="Đang hoạt động" :value="'0'" />
            <el-option label="Đã thôi việc" :value="'1'" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="staff-drawer-button">
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
.staff-code {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.staff-form-item {
  width: 100%;
}

.staff-drawer {
  .staff-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .staff-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
