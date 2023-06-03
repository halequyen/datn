<script lang="ts" setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'

interface Patient {
  id: String
  name: String
  phone: String
  note: String
  date: String | Date
  timeSlot: String
}

const patients = ref<Patient[]>([])
const search = ref('')
const showPatientForm = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Patient[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

const fetchPatients = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/schedule')
    patients.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  patients.value.filter(
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

const openPatientForm = () => {
  showPatientForm.value = true
}

const handleClose = () => {
  ruleFormRef.value!.close()
}

onMounted(() => {
  fetchPatients()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>

<template>
  <el-calendar>
    <template #date-cell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-')[2] }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>
    </template>
  </el-calendar>

  <div class="schedule">
    <h2>Khung giờ khám bệnh</h2>
    <div class="schedule-pick">
      <div class="schedule-pick-morning d-flex">
        <div class="morning">Sáng:</div>
        <el-badge :value="patients.length" :max="10" class="item">
          <el-button @click="openPatientForm" size="large" type="primary">08:00 - 09:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">09:00 - 10:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">10:00 - 11:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">11:00 - 12:00</el-button>
        </el-badge>
      </div>
      <div class="schedule-pick-afternoon d-flex">
        <div class="afternoon">Chiều:</div>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">13:00 - 14:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">14:00 - 15:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">15:00 - 16:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">16:00 - 17:00</el-button>
        </el-badge>
        <el-badge :value="4" :max="10" class="item">
          <el-button size="large" type="primary">17:00 - 18:00</el-button>
        </el-badge>
      </div>
    </div>
  </div>

  <el-drawer
    ref="ruleFormRef"
    v-model="showPatientForm"
    :before-close="handleClose"
    direction="rtl"
    class="patient-drawer"
    size="50%"
  >
    <template #header>
      <div class="patient-drawer-title">Danh sách cuộc hẹn</div>
    </template>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên bệnh nhân"
      />
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column prop="name" label="Tên bệnh nhân" min-width="140" />
        <el-table-column prop="phone" label="Số điện thoại" min-width="100" />
        <el-table-column prop="note" label="Ghi chú" min-width="150" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-pencil" />
            <font-awesome-icon class="font-awesome-icon" icon="fa-regular fa-trash-can" />
          </template>
        </el-table-column>
      </el-table>
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
    </el-scrollbar>
  </el-drawer>
</template>

<style lang="scss" scoped>
.schedule {
  margin: 10px;

  .item {
    margin-right: 30px;
  }
}

.schedule-pick {
  margin: 10px;
}

.schedule-pick-morning {
  margin-bottom: 15px;
  .morning {
    width: 60px;
    margin-top: 10px;
  }
}

.schedule-pick-afternoon {
  margin-bottom: 20px;
  .afternoon {
    width: 60px;
    margin-top: 10px;
  }
}

.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.patient-drawer {
  .patient-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }
}

.input-search {
  width: 250px;
  margin-bottom: 10px;
}
</style>

<style>
.is-selected {
  color: #1989fa;
}

.el-calendar-table .el-calendar-day {
  height: 60px;
}
</style>
