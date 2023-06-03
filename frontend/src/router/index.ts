import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/patient_list',
      name: 'patient list',
      component: () => import('../components/components/PatientList.vue')
    },
    {
      path: '/medicine_price_list',
      name: 'medicine price list',
      component: () => import('../components/components/MedicinePriceList.vue')
    },
    {
      path: '/service_price_list',
      name: 'service price list',
      component: () => import('../components/components/ServicePriceList.vue')
    },
    {
      path: '/medicine_manage_list',
      name: 'medicine manage list',
      component: () => import('../components/components/MedicineManageList.vue')
    },
    {
      path: '/equipment_list',
      name: 'equipment list',
      component: () => import('../components/components/EquipmentList.vue')
    },
    {
      path: '/material_list',
      name: 'material list',
      component: () => import('../components/components/MaterialList.vue')
    },
    {
      path: '/staff_list',
      name: 'staff list',
      component: () => import('../components/components/StaffList.vue')
    },
    {
      path: '/user_list',
      name: 'user list',
      component: () => import('../components/components/UserList.vue')
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('../components/components/Information.vue')
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../components/components/Schedule.vue')
    }
  ]
})

export default router
