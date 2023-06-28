<script lang="ts" setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import { formatDate } from '../../format'
import { Edit } from '@element-plus/icons-vue'
import moment from 'moment'

interface Patient {
  _id: String
  name: String
  phone: String
  note: String
  date: String | Date
  timeSlot: String
}

const selectedDate = ref<any>(new Date().toISOString().split('T')[0])
const patients = ref<Patient[]>([])
const search = ref('')
const filterSlot = ref('')
const showPatientForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Patient[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()
const ruleScheduleFormRef = ref<InstanceType<typeof ElDrawer>>()
const showScheduleForm = ref(false)
const calendarData = ref<Date>()
const assignDateData = ref<Patient[]>([])
let timer: ReturnType<typeof setTimeout> | undefined

const scheduleFormData = ref<Patient>({
  _id: '',
  name: '',
  phone: '',
  note: '',
  date: '',
  timeSlot: ''
})

const filterTableData = computed(() =>
  patients.value.filter(
    (data) => !search.value || data.phone.toLowerCase().includes(search.value.toLowerCase())
  )
)

const compareDate = (date1: string, date2: string) => {
  if (!date1 || !date2) {
    return false
  }
  const arr1 = date1.split('/')
  const arr2 = date2.split('/')
  if (arr1[0] === arr2[0] && arr1[1] === arr2[1] && arr1[2] === arr2[2]) {
    return true
  }
  return false
}

const filteredData = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === filterSlot.value
  )
  return data
})

const badge1 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '1'
  )
  return data
})

const badge2 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '2'
  )
  return data
})

const badge3 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '3'
  )
  return data
})

const badge4 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '4'
  )
  return data
})

const badge5 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '5'
  )
  return data
})

const badge6 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '6'
  )
  return data
})

const badge7 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '7'
  )
  return data
})

const badge8 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '8'
  )
  return data
})

const badge9 = computed(() => {
  const data = filterTableData.value.filter((item: any) =>
    compareDate(item.date, selectedDate.value) && item.timeSlot === '9'
  )
  return data
})

const fetchPatients = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/schedule')
    patients.value = response.data
    selectedDate.value = selectedDate.value || formatDate(new Date().toDateString())
    pagingData.value = filteredData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const handleDateSelect = (date: any) => {
  selectedDate.value = formatDate(date)
}

const onPageChange = async (pageNumber: number): Promise<void> => {
  currentPage.value = pageNumber
  const rowsNumber = pageSize.value
  const startIndex = (pageNumber - 1) * rowsNumber
  const endIndex = pageNumber * rowsNumber
  pagingData.value = filteredData.value.slice(startIndex, endIndex)
}

const openPatientForm = (timeSlot: any) => {
  showPatientForm.value = true
  filterSlot.value = timeSlot
}

const handleClose = () => {
  ruleFormRef.value!.close()
}

const handleScheduleClose = () => {
  ruleScheduleFormRef.value!.close()
}

const openScheduleForm = (patient: Patient) => {
  showScheduleForm.value = true
  scheduleFormData.value = { ...patient }
}

const resetForm = () => {
  scheduleFormData.value = {
    _id: '',
    name: '',
    phone: '',
    note: '',
    date: '',
    timeSlot: ''
  }
}

const onClick = (item: any) => {
  const newSchedule = { ...scheduleFormData.value }
  console.log(newSchedule)
  if (newSchedule._id) {
    axios
      .put(`http://127.0.0.1:3333/schedule/${newSchedule._id}`, newSchedule)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchPatients()
        showScheduleForm.value = false
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
    newSchedule.date = selectedDate.value
    newSchedule.timeSlot = filterSlot.value
    axios
      .post('http://127.0.0.1:3333/schedule', newSchedule)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchPatients()
        showScheduleForm.value = false
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

const deleteSchedule = (schedule: Patient) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa đặt lịch này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/schedule/${schedule._id}`)
        .then((response) => {
          console.log(response.data)
          fetchPatients()
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
      console.log('Hủy bỏ xóa bệnh nhân')
    })
}

const cancelForm = () => {
  loading.value = false
  showPatientForm.value = false
  showScheduleForm.value = false
  clearTimeout(timer)
}

const rules = ref({
  name: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  phone: [{ required: true, message: 'Vui lòng không bỏ trống' }]
})

onMounted(async () => {
  selectedDate.value = selectedDate.value || formatDate(new Date().toDateString())
  await fetchPatients()
})

watch([search, selectedDate], () => {
  currentPage.value = 1
  pagingData.value = filteredData.value.slice(0, pageSize.value)
})

watch([filterSlot, selectedDate], () => {
  currentPage.value = 1
  pagingData.value = filteredData.value.slice(0, pageSize.value)
})

watch(
  () => calendarData.value,
  () => {
    handleDateSelect(calendarData.value)
  }
)
</script>

<template>
  <h1 class="schedule-title">LỊCH HẸN KHÁM</h1>
  <el-calendar v-model="calendarData">
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
        <el-badge :value="badge1.length" :max="10" class="item">
          <el-button @click="openPatientForm('1')" size="large" type="primary">08:00 - 09:00</el-button>
        </el-badge>
        <el-badge :value="badge2.length" :max="10" class="item">
          <el-button @click="openPatientForm('2')" size="large" type="primary">09:00 - 10:00</el-button>
        </el-badge>
        <el-badge :value="badge3.length" :max="10" class="item">
          <el-button @click="openPatientForm('3')" size="large" type="primary">10:00 - 11:00</el-button>
        </el-badge>
        <el-badge :value="badge4.length" :max="10" class="item">
          <el-button @click="openPatientForm('4')" size="large" type="primary">11:00 - 12:00</el-button>
        </el-badge>
      </div>
      <div class="schedule-pick-afternoon d-flex">
        <div class="afternoon">Chiều:</div>
        <el-badge :value="badge5.length" :max="10" class="item">
          <el-button @click="openPatientForm('5')" size="large" type="primary">13:00 - 14:00</el-button>
        </el-badge>
        <el-badge :value="badge6.length" :max="10" class="item">
          <el-button @click="openPatientForm('6')" size="large" type="primary">14:00 - 15:00</el-button>
        </el-badge>
        <el-badge :value="badge7.length" :max="10" class="item">
          <el-button @click="openPatientForm('7')" size="large" type="primary">15:00 - 16:00</el-button>
        </el-badge>
        <el-badge :value="badge8.length" :max="10" class="item">
          <el-button @click="openPatientForm('8')" size="large" type="primary">16:00 - 17:00</el-button>
        </el-badge>
        <el-badge :value="badge9.length" :max="10" class="item">
          <el-button @click="openPatientForm('9')" size="large" type="primary">17:00 - 18:00</el-button>
        </el-badge>
      </div>
    </div>
  </div>

  <el-drawer
    ref="ruleFormRef"
    v-model="showPatientForm"
    :before-close="handleClose"
    direction="rtl"
    destroy-on-close
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
        placeholder="Nhập số điện thoại"
      />
      <div class="d-flex add-icon-schedule">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openScheduleForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên bệnh nhân" min-width="140">
          <template #default="scope">
            <div class="patient-name primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Số điện thoại" min-width="100" />
        <el-table-column prop="note" label="Ghi chú" min-width="150" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openScheduleForm(scope.row)"
            />
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
              @click="deleteSchedule(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex">
        <div class="pagination-total">
          <span>Số lượng: {{ filteredData.length }}</span>
        </div>
        <div class="pagination-button">
          <el-pagination
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            :total="filteredData.length"
            background
            layout="prev, pager, next"
            @current-change="onPageChange"
          />
        </div>
      </div>
    </el-scrollbar>
  </el-drawer>

  <el-drawer
    ref="ruleScheduleFormRef"
    v-model="showScheduleForm"
    :before-close="handleScheduleClose"
    direction="rtl"
    destroy-on-close
    class="patient-drawer"
    size="35%"
  >
    <template #header>
      <div class="patient-drawer-title">Thông tin đặt lịch</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="scheduleFormData" :rules="rules" label-width="140px">
        <el-form-item label="Tên bệnh nhân" prop="name" class="patient-form-item">
          <el-input v-model="scheduleFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone" class="patient-form-item">
          <el-input v-model="scheduleFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Ghi chú" prop="note" class="patient-form-item">
          <el-input v-model="scheduleFormData.note"></el-input>
        </el-form-item>
      </el-form>
      <div class="schedule-drawer-button">
        <el-button @click="cancelForm">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loading" @click="handleOnClick(assignDateData)">{{
          loading ? '' : 'Lưu'
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>

.schedule-title {
  margin: 20px 0 0 20px;
  font-size: 200%;
}
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

.patient-name {
  cursor: pointer;
  font-weight: 700;
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

.add-icon-schedule {
  color: red;
  position: absolute;
  right: 80px;
  top: 115px;

  .icon-add {
    font-size: 120%;
    padding: 5px;
  }

  .title-add {
    padding: 5px;
  }
}

.schedule-drawer-button {
  position: absolute;
  right: 20px;
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
