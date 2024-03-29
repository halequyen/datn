import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/Main.vue'
import { store } from "@/stores"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/patient_list',
      name: 'patient list',
      component: () => import('../components/components/PatientList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/medicine_price_list',
      name: 'medicine price list',
      component: () => import('../components/components/MedicinePriceList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/service_price_list',
      name: 'service price list',
      component: () => import('../components/components/ServicePriceList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/medicine_manage_list',
      name: 'medicine manage list',
      component: () => import('../components/components/MedicineManageList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/equipment_list',
      name: 'equipment list',
      component: () => import('../components/components/EquipmentList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/material_list',
      name: 'material list',
      component: () => import('../components/components/MaterialList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/staff_list',
      name: 'staff list',
      component: () => import('../components/components/StaffList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user_list',
      name: 'user list',
      component: () => import('../components/components/UserList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/information',
      name: 'information',
      component: () => import('../components/components/Information.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../components/components/Schedule.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/change_password',
      name: 'change password',
      component: () => import('../components/ChangePassword.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../components/components/Map.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' && store.state.token) {
    next('/')
    return
  } 
  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.token) {
    next('/login')
    return
  }

  next()
})

export default router
