<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import BaseHeader from './BaseHeader.vue'
import AsideLeft from './AsideLeft.vue'
</script>

<template>
  <el-main>
    <el-container>
      <el-header>
        <base-header class="base-header"/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <aside-left class="aside-left"/>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
    
  </el-main>
</template>


<style scoped>
.aside-left {
  margin-top: 50px;
}
</style>