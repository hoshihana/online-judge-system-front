import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faUser,
    faClock,
    faMemory,
    faCircleRight,
    faCircleCheck,
    faXmark,
    faArrowRightFromBracket,
    faHomeUser,
    faAddressCard,
    faBarsStaggered,
    faPenToSquare,
    faArrowLeft,
    faTrashCan,
    faFloppyDisk,
    faPlus,
    faMagnifyingGlass,
    faCode,
    faAnglesUp,
    faHourglass,
    faBookmark,
    faRulerHorizontal,
    faHome,
    faBook,
    faCircleQuestion,
    faAngleLeft,
    faAngleRight,
    faClipboardList,
    faArrowPointer,
    faAnglesRight, faFileZipper, faBox, faHashtag, faCloudArrowDown, faArrowsRotate, faGears, faMinus
} from '@fortawesome/free-solid-svg-icons'
import {faCopy} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(faCopy, faUser, faClock, faMemory, faCircleRight, faCircleCheck,
    faXmark, faArrowRightFromBracket, faHomeUser, faAddressCard, faBarsStaggered,
    faPenToSquare, faArrowLeft, faTrashCan, faFloppyDisk, faPlus, faMagnifyingGlass,
    faCode, faAnglesUp, faHourglass, faBookmark, faRulerHorizontal, faHome, faBook,
    faCircleQuestion, faAngleLeft, faAngleRight, faClipboardList, faArrowPointer,
    faAnglesRight, faFileZipper, faBox, faHashtag, faCloudArrowDown, faArrowsRotate,
    faGears, faMinus)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
    data: {
        loginStatus: {  // Vue全局变量维护登录状态
            login: null,
            userid: null,
            username: null
        }
    },
    router,
    render: h => h(App),
}).$mount('#app')
