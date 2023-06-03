<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from 'axios';
import { ElDrawer, ElMessageBox } from 'element-plus'

interface Equipment {
  id: String,
  name: String,
  unit: String,
  quantity: Number,
  price: String,
  type: String,
}

const equipments = ref<Equipment[]>([])
const search = ref("")
const showEquipmentForm = ref(false)
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const pagingData = ref<Equipment[]>([])
const ruleFormRef = ref<InstanceType<typeof ElDrawer>>()

let timer: ReturnType<typeof setTimeout> | undefined;

const equipmentFromData = ref<Equipment>({
  id: '',
  name: '',
  unit: '',
  quantity: 0,
  price: '',
  type: '',
})

const fetchEquipments = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:3333/equipment");
    equipments.value = response.data;
    pagingData.value = filterTableData.value.slice(0, pageSize.value)
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const filterTableData = computed(() =>
equipments.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const onPageChange = async (pageNumber: number): Promise<void> => {
  currentPage.value = pageNumber
  const rowsNumber = pageSize.value
  const startIndex = (pageNumber - 1) * rowsNumber
  const endIndex = pageNumber * rowsNumber
  pagingData.value = filterTableData.value.slice(startIndex, endIndex)
}

const openEquipmentForm = (equipment: Equipment) => {
  showEquipmentForm.value = true;
  equipmentFromData.value = { ...equipment };
};

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

const handleClose = () => {
  ruleFormRef.value!.close()
}

const cancelForm = () => {
  loading.value = false
  showEquipmentForm.value = false
  clearTimeout(timer)
}

onMounted(() => {
  fetchEquipments();
});

watch(search, () => {
  currentPage.value = 1
  pagingData.value = filterTableData.value.slice(0, pageSize.value)
})
</script>

<template>
  <el-main class="equipment-list-main">
    <h1>QUẢN LÝ THIẾT BỊ</h1>
    <div>
      <el-input
        v-model="search"
        class="input-search"
        prefix-icon="el-icon-search"
        placeholder="Nhập tên thiết bị"
      />
    </div>
    <el-scrollbar>
      <el-table :data="pagingData">
        <el-table-column label="Tên thiết bị" min-width="300">
          <template #default="scope">
            <div class="equipment-name primary-color">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="ĐVT" min-width="90" />
        <el-table-column prop="price" label="Đơn giá" min-width="150" />
        <el-table-column prop="quantity" label="Số lượng" min-width="150" />
        <el-table-column prop="price" label="Tổng giá trị" min-width="150" />
        <el-table-column fixed="right" width="100">
          <template #default="scope">
            <font-awesome-icon
              class="font-awesome-icon"
              icon="fa-solid fa-pencil"
              @click="openEquipmentForm(scope.row)"
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
      v-model="showEquipmentForm"
      :before-close="handleClose"
      direction="rtl"
      class="equipment-drawer"
      size="50%"
    >
    <template #header>
      <div class="equipment-drawer-title">
        Thông tin thiết bị
      </div>
    </template>
      <div class="demo-drawer__content">
        <el-form :model="equipmentFromData" label-width="140px">
          <el-form-item label="Tên thiết bị" prop="name" class="equipment-form-item">
            <el-input v-model="equipmentFromData.name"></el-input>
          </el-form-item>
          <el-form-item label="ĐVT" prop="unit" class="equipment-form-item">
            <el-input v-model="equipmentFromData.unit"></el-input>
          </el-form-item>
          <el-form-item label="Giá" prop="price" class="equipment-form-item">
            <el-input v-model="equipmentFromData.price"></el-input>
          </el-form-item>
          <el-form-item label="Số lượng" prop="quantity" class="equipment-form-item">
            <el-input v-model="equipmentFromData.quantity"></el-input>
          </el-form-item>
          <el-form-item label="Tổng giá trị" prop="price" class="equipment-form-item">
            <el-input v-model="equipmentFromData.price"></el-input>
          </el-form-item>
          <el-form-item label="Phân loại" prop="type" class="equipment-form-item">
            <el-input v-model="equipmentFromData.type"></el-input>
          </el-form-item>
        </el-form>
        <div class="equipment-drawer-button">
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
.equipment-name {
  cursor: pointer;
  font-weight: 700;
}
.font-awesome-icon {
  padding-left: 10px;
  color: #ee402d;
}

.equipment-form-item {
  width: 100%;
}

.equipment-drawer {
  .equipment-drawer-title {
    font-size: 200%;
    font-weight: bold;
    color: #000;
  }

  .equipment-drawer-button {
    position: absolute;
    right: 20px;
  }
}
</style>
