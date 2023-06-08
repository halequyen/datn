<script setup>
import { defineProps } from 'vue'

const props = defineProps<{
  data?: any;
}>();
</script>

<template>
  <el-dialog>
    <template #header>
      <div class="patient-drawer-title-bill">Hóa đơn</div>
    </template>
    <el-table border :data="props.data">
      <el-table-column property="name" label="Tên dịch vụ/ thuốc" min-width="250" />
      <el-table-column property="price" label="Đơn giá" min-width="100" />
      <el-table-column property="quantity" label="Số lượng" min-width="100" />
      <el-table-column property="total" label="Thành tiền" min-width="100" />
    </el-table>
    Tổng thanh toán: 
  </el-dialog>
</template>
