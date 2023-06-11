<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox, ElNotification } from 'element-plus'
import {
  formatDate,
  patientType,
  patientStateColor,
  patientState,
  gender,
  formatExpense,
  formatTotalPrices
} from '../../format'

interface Patient {
  _id: String
  name: String
  gender: String
  dob: String | Date
  phone: String
  checkDate: String | Date
  type: String
  doctor: String
  state: String
  expense: String
  room: String
}

interface PatientBill {
  _id: String
  name: String
  quantity: String
  price: String
  patientId: String
  date: String
}

const patients = ref<Patient[]>([])
const search = ref('')
const showPatientForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Patient[]>([])
const assignPatientData = ref<Patient[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()
const ruleBillFormRef = ref<InstanceType<typeof ElDrawer>>()
const dialogTableVisible = ref(false)
const patientBills = ref<PatientBill[]>([])
const patientBillData = ref<PatientBill[]>([])
const showPatientBillForm = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined

const patientFormData = ref<Patient>({
  _id: '',
  name: '',
  gender: '',
  dob: '',
  phone: '',
  checkDate: '',
  type: '',
  doctor: '',
  state: '',
  expense: '',
  room: ''
})

const patientBillFormData = ref<PatientBill>({
  _id: '',
  name: '',
  quantity: '',
  price: '',
  patientId: '',
  date: ''
})

const fetchPatientBills = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/patient_bill')
    patientBills.value = response.data
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const openPatientBill = (patient: Patient) => {
  dialogTableVisible.value = true;
  assignPatientData.value = pagingData.value.filter((item: Patient) => item._id === patient._id)
  patientBillData.value = patientBills.value.filter(
    (bill: PatientBill) => bill.patientId === patient._id
  );
};

const openPatientBillForm = (patientBill: PatientBill) => {
  showPatientBillForm.value = true
  patientBillFormData.value = { ...patientBill }
}

const resetBillForm = () => {
  patientBillFormData.value = {
    _id: '',
    name: '',
    quantity: '0',
    price: '',
    patientId: '',
    date: ''
  }
}

const onClickBill = (item: any) => {
  const newPatientBill = { ...patientBillFormData.value }
  console.log(newPatientBill)
  newPatientBill.date = formatDate(new Date().toDateString())
  if (newPatientBill._id) {
    axios
      .put(`http://127.0.0.1:3333/patient_bill/${newPatientBill._id}`, newPatientBill)
      .then((response) => {
        console.log(response.data)
        resetBillForm()
        fetchPatientBills().then(() => {
          patientBillData.value = patientBills.value.filter(
            (bill: PatientBill) => bill.patientId === item[0]._id
          )
        })
        showPatientBillForm.value = false
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
    newPatientBill.patientId = item[0]._id
    axios
      .post('http://127.0.0.1:3333/patient_bill', newPatientBill)
      .then((response) => {
        console.log(response.data)
        resetBillForm()
        fetchPatientBills().then(() => {
          patientBillData.value = patientBills.value.filter(
            (bill: PatientBill) => bill.patientId === item[0]._id
          )
        })
        showPatientBillForm.value = false
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

const handleOnClickBill = async (item: any) => {
  try {
    await ElMessageBox.confirm('Bạn muốn lưu?', 'Xác nhận', {
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy'
    })
    loading.value = true
    await onClickBill(item)
    loading.value = false
  } catch (error) {
    console.log('error')
  }
}

const handleCloseBill = () => {
  ruleBillFormRef.value!.close()
}

const deletePatientBill = (patient: Patient) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa mục này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/patient_bill/${patient._id}`)
        .then((response) => {
          console.log(response.data)
          fetchPatientBills().then(() => {
          patientBillData.value = patientBills.value.filter(
            (bill: PatientBill) => bill.patientId === assignPatientData.value[0]._id
          )
        })
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

const cancelBillForm = () => {
  loading.value = false
  showPatientBillForm.value = false
  clearTimeout(timer)
}

const totalPrice = computed<any>(() => {
  let total = 0
  const priceArr = patientBillData.value.map((item: any) => item.price)
  const quantityArr = patientBillData.value.map((item: any) => item.quantity)
  if (priceArr.length > 0) {
    for (let i = 0; i < priceArr.length; i++) {
      total += priceArr[i] * quantityArr[i]
    }
    return total
  } else {
    return '0'
  }
})

const fetchPatients = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333')
    patients.value = response.data
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    onPageChange(currentPage.value)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const filterTableData = computed(() =>
  patients.value.filter(
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

const openPatientForm = (patient: Patient) => {
  showPatientForm.value = true
  patientFormData.value = { ...patient }
}

const resetForm = () => {
  patientFormData.value = {
    _id: '',
    name: '',
    gender: '',
    dob: '',
    phone: '',
    checkDate: '',
    type: '',
    doctor: '',
    state: '',
    expense: '',
    room: ''
  }
}

const onClick = (item: any) => {
  const newPatient = { ...patientFormData.value }
  console.log(newPatient)

  if (newPatient._id) {
    axios
      .put(`http://127.0.0.1:3333/${newPatient._id}`, newPatient)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchPatients()
        showPatientForm.value = false
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
      .post('http://127.0.0.1:3333', newPatient)
      .then((response) => {
        console.log(response.data)
        resetForm()
        fetchPatients()
        showPatientForm.value = false
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

const deletePatient = (patient: Patient) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn xóa bệnh nhân này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning'
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/${patient._id}`)
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
  clearTimeout(timer)
}

onMounted(() => {
  fetchPatients()
  fetchPatientBills()
  // pagingData.value = filterTableData.value.slice(0, pageSize.value)
  // ruleFormRef.value = ref<InstanceType<typeof ElDrawer>>()
})

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})

</script>

<template>
  <el-main class="patient-list-main">
    <h1>DANH SÁCH CA KHÁM</h1>
    <div class="d-flex">
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập số điện thoại"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openPatientForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên bệnh nhân" min-width="200">
          <template #default="scope">
            <div class="patient-name primary-color">
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
        <el-table-column label="Ngày sinh" min-width="110">
          <template #default="scope">
            <div>
              {{ formatDate(scope.row.dob) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="Số điện thoại" min-width="130" />
        <el-table-column label="Ngày khám" min-width="120">
          <template #default="scope">
            <div>
              {{ formatDate(scope.row.checkDate) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Nhóm bệnh nhân" min-width="140">
          <template #default="scope">
            <div>
              {{ patientType[scope.row.type] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="Trạng thái" min-width="140">
          <template #default="scope">
            <div
              :style="{
                color: patientStateColor[scope.row.state],
                fontWeight: 700
              }"
            >
              {{ patientState[scope.row.state] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="expense" label="Chi phí" min-width="130">
          <template #default="scope">
            <div>
              {{ formatExpense(parseInt(scope.row.expense)) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Hóa đơn" min-width="110">
          <template #default="scope">
            <div class="patient-bill" @click="openPatientBill(scope.row)">Xem chi tiết</div>
          </template>
        </el-table-column>
        <el-table-column prop="doctor" label="Bác sĩ khám" min-width="200" />
        <el-table-column prop="room" label="Phòng khám" min-width="120" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openPatientForm(scope.row)"
            />
            <font-awesome-icon
              @click="deletePatient(scope.row)"
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
    v-model="showPatientForm"
    :before-close="handleClose"
    direction="rtl"
    class="patient-drawer"
    size="50%"
  >
    <template #header>
      <div class="patient-drawer-title">Thông tin bệnh nhân</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="patientFormData" label-width="140px">
        <el-form-item label="Tên bệnh nhân" prop="name" class="patient-form-item">
          <el-input v-model="patientFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="Giới tính" class="patient-form-item" width="100%">
          <el-select v-model="patientFormData.gender" placeholder="Chọn giới tính">
            <el-option label="Nam" :value="'0'" />
            <el-option label="Nữ" :value="'1'" />
            <el-option label="Khác" :value="'2'" />
          </el-select>
        </el-form-item>
        <el-form-item label="Ngày sinh" prop="dob" class="patient-form-item">
          <el-input v-model="patientFormData.dob"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone" class="patient-form-item">
          <el-input v-model="patientFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Ngày khám" prop="checkDate" class="patient-form-item">
          <el-input v-model="patientFormData.checkDate"></el-input>
        </el-form-item>
        <el-form-item label="Nhóm bệnh nhân" class="patient-form-item">
          <el-select v-model="patientFormData.type" placeholder="Chọn nhóm bệnh nhân">
            <el-option label="Bệnh nhân mới" :value="'0'" />
            <el-option label="Tái khám" :value="'1'" />
          </el-select>
        </el-form-item>
        <el-form-item label="Bác sĩ khám" prop="doctor" class="patient-form-item">
          <el-input v-model="patientFormData.doctor"></el-input>
        </el-form-item>
        <el-form-item label="Trạng thái" class="patient-form-item">
          <el-select v-model="patientFormData.state" placeholder="Chọn trạng thái">
            <el-option label="Chưa thanh toán" :value="'0'" />
            <el-option label="Đã thanh toán" :value="'1'" />
          </el-select>
        </el-form-item>
        <el-form-item label="Chi phí" prop="expense" class="patient-form-item">
          <el-input v-model="patientFormData.expense"></el-input>
        </el-form-item>
        <el-form-item label="Phòng khám" prop="room" class="patient-form-item">
          <el-input v-model="patientFormData.room"></el-input>
        </el-form-item>
      </el-form>
      <div class="patient-drawer-button">
        <el-button @click="cancelForm">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loading" @click="handleOnClick">{{
          loading ? '' : 'Lưu'
        }}</el-button>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="dialogTableVisible">
    <template #header>
      <div class="patient-drawer-title-bill">Hóa đơn</div>
    </template>
    <div class="d-flex add-icon-bill">
      <font-awesome-icon
        class="icon-add-bill"
        icon="fa-solid fa-plus"
        @click="openPatientBillForm"
      />
      <div class="title-add-bill">Thêm</div>
    </div>
    <el-table border :data="patientBillData">
      <el-table-column property="name" label="Tên dịch vụ/ thuốc" min-width="250" />
      <el-table-column property="price" label="Đơn giá" min-width="100">
        <template #default="scope">
          <div>
            {{ formatExpense(parseInt(scope.row.price)) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column property="quantity" label="Số lượng" min-width="100" />
      <el-table-column property="total" label="Thành tiền" min-width="100">
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
              @click="openPatientBillForm(scope.row)"
            />
            <font-awesome-icon
              @click="deletePatientBill(scope.row)"
              class="font-awesome-icon"
              icon="fa-regular fa-trash-can"
            />
          </template>
        </el-table-column>
    </el-table>
    <div class="total-bill">Tổng thanh toán: {{ formatExpense(totalPrice) }}</div>
  </el-dialog>

  <el-drawer
    ref="ruleBillFormRef"
    v-model="showPatientBillForm"
    :before-close="handleCloseBill"
    direction="rtl"
    class="patient-drawer"
    size="40%"
  >
    <template #header>
      <div class="patient-drawer-title">Thêm danh mục</div>
    </template>
    <div class="demo-drawer__content">
      <el-form :model="patientBillFormData" label-width="140px">
        <el-form-item label="Tên thuốc, dịch vụ" prop="name" class="patient-form-item">
          <el-input v-model="patientBillFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="Đơn giá" prop="price" class="patient-form-item">
          <el-input v-model="patientBillFormData.price"></el-input>
        </el-form-item>
        <el-form-item label="Số Lượng" prop="quantity" class="patient-form-item">
          <el-input v-model="patientBillFormData.quantity"></el-input>
        </el-form-item>
      </el-form>
      <div class="patient-drawer-button">
        <el-button @click="cancelBillForm">Hủy bỏ</el-button>
        <el-button type="primary" :loading="loading" @click="handleOnClickBill(assignPatientData)">{{
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
  // position: absolute;
  // right: 100px;
}
.patient-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.patient-form-item {
  width: 100%;
}

.patient-drawer {
  .patient-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .patient-drawer-button {
    position: absolute;
    right: 20px;
  }
}

.patient-bill {
  cursor: pointer;
}
.patient-bill:hover {
  color: #000;
}

.patient-drawer-title-bill {
  text-align: center;
  font-size: 180%;
  font-weight: bold;
  color: #000;
}

.add-icon-bill {
  position: absolute;
  top: 50px;
  right: 60px;
  color: red;

  .icon-add-bill {
    font-size: 120%;
  }

  .title-add-bill {
    margin: 0 0 15px 10px;
  }
}

.total-bill {
  margin-top: 15px;
  font-weight: 700;
}
</style>
