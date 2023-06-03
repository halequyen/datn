<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <el-aside width="200px">
    <el-scrollbar height="650px">
      <el-menu :default-openeds="['1', '3']">
        <el-sub-menu index="1">
          <template #title>
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-house-chimney-medical" />Khám bệnh
          </template>
            <el-menu-item index="1-1"><router-link class="no-active-style" to="/patient_list">Danh sách ca khám</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link class="no-active-style" to="/schedule">Lịch hẹn khám</router-link></el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-file-invoice-dollar" />Quản lý bảng giá
          </template>
            <el-menu-item index="2-1"><router-link class="no-active-style" to="/service_price_list">Giá dịch vụ</router-link></el-menu-item>
            <el-menu-item index="2-2"><router-link class="no-active-style" to="/medicine_price_list">Giá thuốc</router-link></el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-screwdriver-wrench" />Quản lý vật tư
          </template>
            <el-menu-item index="3-1"><router-link class="no-active-style" to="/equipment_list">Thiết bị y tế</router-link></el-menu-item>
            <el-menu-item index="3-2"><router-link class="no-active-style" to="/medicine_manage_list">Thuốc</router-link></el-menu-item>
            <el-menu-item index="3-3"><router-link class="no-active-style" to="/material_list">Vật tư</router-link></el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-image-portrait" />Quản trị
          </template>
            <el-menu-item index="4-1"><router-link class="no-active-style" to="/staff_list">Nhân viên</router-link></el-menu-item>
            <el-menu-item index="4-2"><router-link class="no-active-style" to="/user_list">Tài khoản</router-link></el-menu-item>
            <el-menu-item index="4-3"><router-link class="no-active-style" to="/information">Thông tin cơ sở</router-link></el-menu-item>
        </el-sub-menu> 
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>


<style scoped>
.font-awesome-icon {
  padding-right: 10px;
}
</style>
