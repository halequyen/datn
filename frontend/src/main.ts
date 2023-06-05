import './index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouseChimneyMedical } from '@fortawesome/free-solid-svg-icons'
import { faImagePortrait } from '@fortawesome/free-solid-svg-icons'
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'



library.add(faHouseChimneyMedical, faImagePortrait, faFileInvoiceDollar, faScrewdriverWrench, faPencil, faTrashCan, faGear, faMagnifyingGlass, faPlus, faEye, faEyeSlash)

createApp(App).use(ElementPlus).component('font-awesome-icon', FontAwesomeIcon).use(router).use(createPinia()).mount('#app')