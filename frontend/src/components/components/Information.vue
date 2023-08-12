<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus/lib/components/form/index.js'
import { ElMessageBox, ElNotification } from 'element-plus'
import * as echarts from 'echarts'

interface Information {
  _id: String
  agency: String
  own: String
  hotline: String
  address: String
  email: String
  fanpage: String
  website: String
}

const datePicker = ref('')
const patients = ref<any[]>([])
const chartRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const informations = ref<Information>({
  _id: '',
  agency: '',
  own: '',
  hotline: '',
  address: '',
  email: '',
  fanpage: '',
  website: ''
})

const fetchInformations = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/information')
    const fetchedInformation = response.data[0]
    if (fetchedInformation) {
      informations.value = {
        _id: fetchedInformation._id,
        agency: fetchedInformation.agency,
        own: fetchedInformation.own,
        hotline: fetchedInformation.hotline,
        address: fetchedInformation.address,
        email: fetchedInformation.email,
        fanpage: fetchedInformation.fanpage,
        website: fetchedInformation.website
      }
    }
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const cancelForm = () => {
  fetchInformations()
}

const onClick = () => {
  const newInformation = { ...informations.value }

  if (newInformation._id) {
    axios
      .put(`http://127.0.0.1:3333/information/${newInformation._id}`, newInformation)
      .then((response) => {
        console.log(response.data)
        fetchInformations()
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

const handleOnClick = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await ElMessageBox.confirm('Bạn muốn lưu?', 'Xác nhận', {
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Hủy'
        })
        loading.value = true
        await onClick()
        loading.value = false
      } catch (error) {
        console.log('error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const rules = reactive<FormRules>({
  agency: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  own: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  hotline: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  address: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  email: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  fanpage: [{ required: true, message: 'Vui lòng không bỏ trống' }],
  website: [{ required: true, message: 'Vui lòng không bỏ trống' }]
})

const fetchPatients = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://127.0.0.1:3333')
    patients.value = response.data
    console.log(response)
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const filteredPatients = computed(() => {
  if (!datePicker.value) {
    return patients.value
  }
  const startDate = new Date(datePicker.value[0])
  const endDate = new Date(datePicker.value[1])
  return patients.value.filter((patient) => {
    const checkDate = new Date(patient.checkDate)
    return checkDate >= startDate && checkDate <= endDate
  })
})

const filterNewPatient = computed(() =>
  filteredPatients.value.filter((patient) => patient.type === '0')
)
const filterOldPatient = computed(() =>
  filteredPatients.value.filter((patient) => patient.type === '1')
)

const newPatient = ref(0)
const oldPatient = ref(0)

const handleChartData = () => {
  newPatient.value = filterNewPatient.value.length
  oldPatient.value = filterOldPatient.value.length
}

const filteredChartData = computed(() => [
  { value: newPatient.value, name: 'Bệnh nhân mới', itemStyle: { color: '#91cc75' } },
  { value: oldPatient.value, name: 'Tái khám', itemStyle: { color: '#ee6666' } }
])

console.log(datePicker)

const updateChart = () => {
  const chartDom = chartRef.value
  const myChart = echarts.init(chartDom)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Bệnh nhân',
        type: 'pie',
        radius: '60%',
        data: filteredChartData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  myChart.setOption(option)
}

const shortcuts = [
  {
    text: 'Tuần trước',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Tháng trước',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '3 tháng qua',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

onMounted(async () => {
  await fetchInformations()
  await fetchPatients()
  await handleChartData()

  updateChart()
})

watch(datePicker, () => {
  handleChartData()
  updateChart()
})

</script>

<template>
  <el-main class="information-list-main">
    <h1>THÔNG TIN CƠ SỞ</h1>
    <div v-loading="loading" class="d-flex">
      <div class="information-left">
        <el-form
          ref="ruleFormRef"
          :model="informations"
          :rules="rules"
          label-width="120px"
          class="information-form"
          size="large"
        >
          <el-form-item label="Tên cơ sở" prop="agency" class="information-form-item">
            <el-input v-model="informations.agency" />
          </el-form-item>
          <el-form-item label="Chủ cơ sở" prop="own" class="information-form-item">
            <el-input v-model="informations.own" />
          </el-form-item>
          <el-form-item label="Hotline" prop="hotline" class="information-form-item">
            <el-input v-model="informations.hotline" />
          </el-form-item>
          <el-form-item label="Địa chỉ" prop="address" class="information-form-item">
            <el-input v-model="informations.address" />
          </el-form-item>
          <el-form-item label="Email" prop="email" class="information-form-item">
            <el-input v-model="informations.email" />
          </el-form-item>
          <el-form-item label="Fanpage" prop="fanpage" class="information-form-item">
            <el-input v-model="informations.fanpage" />
          </el-form-item>
          <el-form-item label="Website" prop="website" class="information-form-item">
            <el-input v-model="informations.website" />
          </el-form-item>
        </el-form>
        <div class="information-drawer-button">
          <el-button @click="cancelForm">Hủy bỏ</el-button>
          <el-button type="primary" :loading="loading" @click="handleOnClick(ruleFormRef)">{{
            loading ? '' : 'Lưu'
          }}</el-button>
        </div>
      </div>
      <div class="information-right">
        <h2>Thống kê số lượng bệnh nhân</h2>
        <div class="information-date-picker">
          <el-date-picker
            v-model="datePicker"
            type="daterange"
            range-separator="Đến"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            :shortcuts="shortcuts"
            placement="bottom"
          />
        </div>
        <div ref="chartRef" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
h1 {
  margin-bottom: 50px;
  font-size: 200%;
}
.information-form-item {
  width: 100%;
}

.information-left {
  margin: 20px;
  width: 50%;
}

.information-right {
  margin: 20px;
  width: 50%;

  h2 {
    display: flex;
    justify-content: center;
  }
}

.information-drawer-button {
  display: flex;
  justify-content: right;
}

.information-date-picker {
  margin: 20px;
  display: flex;
  justify-content: right;
}
</style>
