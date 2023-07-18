<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus/lib/components/form/index.js'
import { ElMessageBox, ElNotification } from 'element-plus'
import * as echarts from 'echarts'
import clinicMap from '../../assets/images/map.png'

const chartDom = ref(null)
    const myChart = ref(null)

    onMounted(async () => {

      echarts.registerMap('MacOdrum-LV5-floorplan-web', { clinicMap })

      const option = {
        tooltip: {},
        geo: {
          map: 'MacOdrum-LV5-floorplan-web',
          roam: true,
          emphasis: {
            itemStyle: {
              color: undefined
            },
            label: {
              show: false
            }
          }
        },
        series: [
          {
            name: 'Route',
            type: 'lines',
            coordinateSystem: 'geo',
            geoIndex: 0,
            emphasis: {
              label: {
                show: false
              }
            },
            polyline: true,
            lineStyle: {
              color: '#c46e54',
              width: 5,
              opacity: 1,
              type: 'dotted'
            },
            effect: {
              show: true,
              period: 8,
              color: '#a10000',
              constantSpeed: 80,
              trailLength: 0,
              symbolSize: [20, 12],
              symbol:
                'path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z'
            },
            data: [
              {
                coords: [
                  [930.6189462165178, 30.64349563895087],
                  [880.6189462165178, 110.8570048730469],
                  [680.9272226116071, 110.8570048730469],
                  [680.9272226116071, 73.87942320312504],
                  [680.9272226116071, 73.87942320312504],
                  [543.29514854771196, 72.8954315876116],
                  [543.29514854771196, 380.8559607533482],
                  [520.29514854771196, 380.8559607533482],
                  [520.29514854771196, 72.8954315876116],
                  [480.06907909458701, 72.8954315876116]
                ]
              }
            ]
          }
        ]
      }

      myChart.value = echarts.init(chartDom.value)
      myChart.value.setOption(option)
    })

</script>

<template>
  <el-main>
    <h1>SƠ ĐỒ PHÒNG KHÁM</h1>
    <div class="map-main">
      <img class="map-img" src="../../assets/images/map.png" alt="">
        <div ref="chartDom" style="width: 100%; height: 400px"></div>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
h1 {
  margin-bottom: 10px;
  font-size: 200%;
}

.map-main {
  display: flex;
  justify-content: center;
}

.map-img {
  position: absolute;
  width: 800px;
}
</style>
