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
    faAnglesRight,
    faFileZipper,
    faBox,
    faHashtag,
    faCloudArrowDown,
    faArrowsRotate,
    faGears,
    faGrip,
    faCaretRight,
    faAnglesLeft,
    faLock,
    faList,
    faHourglassStart,
    faHourglassEnd,
    faUsers,
    faScaleBalanced,
    faPen,
    faStopwatch,
    faClockRotateLeft, faCalendarDays, faFlag, faCheck, faDice
} from '@fortawesome/free-solid-svg-icons'
import {faCopy} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import moment from 'moment'
import ScrollNumber from "vue-scroll-number";

/* add icons to the library */
library.add(faCopy, faUser, faClock, faMemory, faCircleRight, faCircleCheck,
    faXmark, faArrowRightFromBracket, faHomeUser, faAddressCard, faBarsStaggered,
    faPenToSquare, faArrowLeft, faTrashCan, faFloppyDisk, faPlus, faMagnifyingGlass,
    faCode, faAnglesUp, faHourglass, faBookmark, faRulerHorizontal, faHome, faBook,
    faCircleQuestion, faAngleLeft, faAngleRight, faClipboardList, faArrowPointer,
    faAnglesRight, faFileZipper, faBox, faHashtag, faCloudArrowDown, faArrowsRotate,
    faGears, faGrip, faCaretRight, faAnglesLeft, faLock, faList, faHourglassStart,
    faHourglassEnd, faUsers, faScaleBalanced, faStopwatch, faPen, faClockRotateLeft,
    faCalendarDays, faFlag, faCheck, faDice)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.prototype.$moment = moment

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(ScrollNumber, {transitionTime: 500})

new Vue({
    data: {
        loginStatus: {  // Vue全局变量维护登录状态
            login: false,
            userid: null,
            username: null,
            role: null,
        }
    },
    router,
    render: h => h(App),
}).$mount('#app')
