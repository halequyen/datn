<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { ElDrawer, ElMessageBox } from 'element-plus'
import { formatDate } from '../../formatDate'

interface Patient {
  _id: String
  patientCode: String
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

const patients = ref<Patient[]>([])
const search = ref('')
const showPatientForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Patient[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined

const patientFromData = ref<Patient>({
  _id: '',
  patientCode: '',
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

const fetchPatients = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333')
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
  await fetchPatients();
}

const openPatientForm = (patient: Patient) => {
  showPatientForm.value = true
  patientFromData.value = { ...patient }
}

const handleClose = () => {
  ruleFormRef.value!.close()
}

const resetForm = () => {
  // Đặt lại giá trị mặc định cho đối tượng patientFromData
  patientFromData.value = {
    _id: '',
    patientCode: '',
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
  };
}


const onClick = () => {
  if (loading.value) {
    return;
  }
  ElMessageBox.confirm('Bạn có muốn lưu?')
    .then(() => {
      loading.value = true;

      const newPatient = { ...patientFromData.value };
      console.log(newPatient);
      
      if (newPatient._id) {
        axios.put(`http://127.0.0.1:3333/${newPatient._id}`, newPatient)
          .then(response => {
            console.log(response.data);
            resetForm();
            fetchPatients();
            showPatientForm.value = false;
            loading.value = false;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios.post('http://127.0.0.1:3333', newPatient)
          .then(response => {
            console.log(response.data);
            resetForm();
            fetchPatients();
            showPatientForm.value = false;
            loading.value = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(() => {
      console.log('error');
    });
}

const deletePatient = (patient: Patient) => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?', 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
  })
    .then(() => {
      axios
        .delete(`http://127.0.0.1:3333/${patient._id}`)
        .then((response) => {
          console.log(response.data);
          fetchPatients();
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(() => {
      console.log('Hủy bỏ xóa bệnh nhân');
    });
};


const cancelForm = () => {
  loading.value = false
  showPatientForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchPatients()
  // pagingData.value = filterTableData.value.slice(0, pageSize.value)
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
        placeholder="Nhập tên bệnh nhân"
      />
      <div class="d-flex add-icon">
        <font-awesome-icon class="icon-add" icon="fa-solid fa-plus" @click="openPatientForm" />
        <div class="title-add">Thêm</div>
      </div>
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Mã bệnh nhân" min-width="140">
          <template #default="scope">
            <div class="patient-code primary-color">
              {{ scope.row.patientCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên bệnh nhân" min-width="200" />
        <el-table-column prop="gender" label="Giới tính" min-width="90" />
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
        <el-table-column prop="doctor" label="Bác sĩ khám" min-width="200" />
        <el-table-column label="Kết quả khám" width="120">
          <div class="patient-code information-color">Xem kết quả</div>
        </el-table-column>
        <el-table-column prop="type" label="Nhóm bệnh nhân" min-width="140" />
        <el-table-column prop="state" label="Trạng thái" min-width="130" />
        <el-table-column prop="expense" label="Chi phí" min-width="130" />
        <el-table-column prop="room" label="Phòng khám" min-width="120" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openPatientForm(scope.row)"
            />
            <font-awesome-icon @click="deletePatient(scope.row)" class="font-awesome-icon" icon="fa-regular fa-trash-can" />
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
      <el-form :model="patientFromData" label-width="140px">
        <el-form-item label="Mã bệnh nhân" prop="patientCode" class="patient-form-item">
          <el-input v-model="patientFromData.patientCode"></el-input>
        </el-form-item>
        <el-form-item label="Tên bệnh nhân" prop="name" class="patient-form-item">
          <el-input v-model="patientFromData.name"></el-input>
        </el-form-item>
        <el-form-item label="Giới tính" prop="gender" class="patient-form-item">
          <el-input v-model="patientFromData.gender"></el-input>
        </el-form-item>
        <el-form-item label="Ngày sinh" prop="dob" class="patient-form-item">
          <el-input v-model="patientFromData.dob"></el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phone" class="patient-form-item">
          <el-input v-model="patientFromData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Ngày khám" prop="checkDate" class="patient-form-item">
          <el-input v-model="patientFromData.checkDate"></el-input>
        </el-form-item>
        <el-form-item label="Nhóm bệnh nhân" prop="type" class="patient-form-item">
          <el-input v-model="patientFromData.type"></el-input>
        </el-form-item>
        <el-form-item label="Bác sĩ khám" prop="doctor" class="patient-form-item">
          <el-input v-model="patientFromData.doctor"></el-input>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="state" class="patient-form-item">
          <el-input v-model="patientFromData.state"></el-input>
        </el-form-item>
        <el-form-item label="Chi phí" prop="expense" class="patient-form-item">
          <el-input v-model="patientFromData.expense"></el-input>
        </el-form-item>
        <el-form-item label="Phòng khám" prop="room" class="patient-form-item">
          <el-input v-model="patientFromData.room"></el-input>
        </el-form-item>
      </el-form>
      <div class="patient-drawer-button">
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
  // position: absolute;
  // right: 100px;
}
.patient-code {
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
</style>
