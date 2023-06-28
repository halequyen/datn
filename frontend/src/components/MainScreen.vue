<script lang="ts" setup>
import { computed, watch, ref, reactive, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import BaseHeader from './BaseHeader.vue'
import AsideLeft from './AsideLeft.vue'
import { store } from "@/stores"

const token = computed(() => store.state.token)

</script>

<template>
  <el-main>
    <el-container>
      <el-header v-if="token">
        <base-header class="base-header"/>
      </el-header>
      <el-container>
        <el-aside v-if="token" width="200px">
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