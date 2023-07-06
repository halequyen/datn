<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { userType } from '../../format'

interface User {
  _id: String
  userName: String
  password: String
  type: String
  ownerId: String
  owner: String
}

interface Staff {
  _id: String
  name: String
}

const users = ref<User[]>([])
const search = ref('')
const showUserForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<User[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()
const staffs = ref<Staff[]>([])
const selectedStaff = ref<Staff[]>([])
const selectedStaffId = ref<string[]>([])

let timer: ReturnType<typeof setTimeout> | undefined

const userFromData = ref<User>({
  _id: '',
  userName: '',
  password: '',
  type: '',
  ownerId: '',
  owner: ''
})

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/user')
    users.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const fetchStaffs = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/staff')
    staffs.value = response.data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  users.value.filter(
    (data) => !search.value || data.userName.toLowerCase().includes(search.value.toLowerCase())
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
  userFromData.value = {
    _id: '',
    userName: '',
    password: '',
    type: '',
    ownerId: '',
    owner: ''
  }
}

const openUserForm = (user: User) => {
  showUserForm.value = true
  userFromData.value = { ...user }
  selectedStaffId.value = user.ownerId
  selectedStaff.value = staffs.value.filter((staff) =>
    selectedStaffId.value.includes(staff._id.toString())
  )
}

const onClick = (item: any) => {
  const newUser = { ...userFromData.value }
  console.log(newUser)
  newUser.ownerId = selectedStaffId.value
  newUser.owner = staffs.value
    .filter((staff) => selectedStaffId.value.includes(staff._id.toString()))
    .map((staff) => staff.name)
    .join(', ')

  if (newUser._id) {
    axios
      .put(`http://127.0.0.1:3333/user/${newUser._id}`, newUser)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchUsers()
        showUserForm.value = false
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
      .post('http://127.0.0.1:3333/user', newUser)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchUsers()
        showUserForm.value = false
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
    console.log(error)
  }
}

const handleClose = () => {
  ruleFormRef.value!.close()
}

const deleteUser = (user: User) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa tài khoản này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/user/${user._id}`)
        .then((response) => {
          console.log(response.data)
          fetchUsers()
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
      console.log('Hủy bỏ xóa tài khoản')
    })
}

const cancelForm = () => {
  loading.value = false
  showUserForm.value = false
  clearTimeout(timer)
}

const rules = ref({
  userName: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  password: [{ required: true, message: 'Vui lòng không bỏ trống' }]
})

onMounted(() => {
  fetchUsers()
  fetchStaffs()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})

watch(staffs, () => {
  users.value.forEach((user) => {
    const selectedStaffNames = staffs.value
      .filter((staff) => user.ownerId.includes(staff._id.toString()))
      .map((staff) => staff.name)
    user.owner = selectedStaffNames.join(', ')
  })
})
</script>

<template>
  <el-main class="user-list-main">
    <h1>DANH SÁCH TÀI KHOẢN</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên đăng nhập"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openUserForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên đăng nhập" min-width="140">
          <template #default="scope">
            <div class="user-name primary-color">
              {{ scope.row.userName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="Mật khẩu" min-width="200" />
        <el-table-column label="Phân loại" min-width="200">
          <template #default="scope">
            <div>
              {{ userType[scope.row.type] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="Chủ sở hữu" min-width="200" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openUserForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteUser(scope.row)"
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
    v-model="showUserForm"
    :before-close="handleClose"
    destroy-on-close
    direction="rtl"
    class="user-drawer"
    size="50%"
  >
    <template #header>
      <div class="user-drawer-title">Thông tin tài khoản</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="userFromData" :rules="rules" label-width="140px">
        <el-form-item label="Tên đăng nhập" prop="userName" class="user-form-item">
          <el-input v-model="userFromData.userName"></el-input>
        </el-form-item>
        <el-form-item label="Mật khẩu" class="user-form-item">
          <el-input type="password" show-password="showPassword" v-model="userFromData.password"></el-input>
        </el-form-item>
        <el-form-item label="Phân loại" class="user-form-item">
          <el-select v-model="userFromData.type" placeholder="Chọn loại tài khoản">
            <el-option label="Quản trị viên" :value="'0'" />
            <el-option label="Quản lý thiết bị" :value="'1'" />
            <el-option label="Lễ tân" :value="'2'" />
            <el-option label="Bác sĩ" :value="'3'" />
          </el-select>
        </el-form-item>
        <el-form-item label="Chủ sở hữu" class="user-form-item">
          <el-select
            v-model="selectedStaffId"
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="Chọn nhân viên"
            @change="() => {console.log(selectedStaffId)}"
          >
            <el-option
              v-for="item in staffs"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="user-drawer-button">
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
.user-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.user-form-item {
  width: 100%;
}

.user-drawer {
  .user-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .user-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
