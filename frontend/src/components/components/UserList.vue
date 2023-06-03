<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from 'axios';
import { ElDrawer, ElMessageBox } from 'element-plus';

interface User {
  id: String
  userName: String
  password: String
  owner: String
}

const users = ref<User[]>([])
const search = ref("")
const showUserForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<User[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined;

const userFromData = ref<User>({
  id: '',
  userName: '',
  password: '',
  owner: '',
})

const fetchUsers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:3333/user")
    users.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  users.value.filter(
    (data) =>
      !search.value ||
      data.userName.toLowerCase().includes(search.value.toLowerCase())
  )
)

const onPageChange = async (pageNumber: number): Promise<void> => {
  currentPage.value = pageNumber
  const rowsNumber = pageSize.value
  const startIndex = (pageNumber - 1) * rowsNumber
  const endIndex = pageNumber * rowsNumber
  pagingData.value = filterTableData.value.slice(startIndex, endIndex)
}

const openUserForm = (user: User) => {
  showUserForm.value = true
  userFromData.value = { ...user }
}

const handleClose = () => {
  ruleFormRef.value!.close()
}

const onClick = (done: () => void) => {
  if (loading.value) {
    return
  }
  ElMessageBox.confirm('Do you want to submit?')
    .then(() => {
      loading.value = true
      timer = setTimeout(() => {
        done()
        setTimeout(() => {
          loading.value = false
        }, 400)
      }, 2000)
    })
    .catch(() => {
      console.log('error');
    }
  )
}

const cancelForm = () => {
  loading.value = false
  showUserForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchUsers()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
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
      direction="rtl"
      class="user-drawer"
      size="50%"
    >
    <template #header>
      <div class="user-drawer-title">
        Thông tin tài khoản
      </div>
    </template>
      <div class="demo-drawer__content">
        <el-form :model="userFromData" label-width="140px">
          <el-form-item label="Tên đăng nhập" prop="userName" class="user-form-item">
            <el-input v-model="userFromData.userName"></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu" prop="password" class="user-form-item">
            <el-input v-model="userFromData.password"></el-input>
          </el-form-item>
          <el-form-item label="Chủ sở hữu" prop="owner" class="user-form-item">
            <el-input v-model="userFromData.owner"></el-input>
          </el-form-item>
        </el-form>
        <div class="user-drawer-button">
          <el-button @click="cancelForm">Hủy bỏ</el-button>
          <el-button type="primary" :loading="loading" @click="onClick">{{
            loading ? 'Submitting ...' : 'Lưu'
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
