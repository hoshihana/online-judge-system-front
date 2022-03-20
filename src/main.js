import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import axios from "@/utils/axios";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.component('v-icon', Icon)

new Vue({
    data: {
        isLogin: null,  // Vue全局变量维护登录状态
    },
    router,
    render: h => h(App),
    beforeCreate() {
        // 初始化isLogin
        axios.post("/account/isLogin")
            .then((response) => {
                this.isLogin = response.data
            })
            .catch((error) => {
                console.log(error.response.data)
            })
        // 每次路由前检查登录状态
        this.$router.beforeEach((to, from, next) => {
            axios.post("/account/isLogin")
                .then((response) => {
                    this.$root.isLogin = response.data
                })
                .catch((error) => {
                    console.log(error.response.data)
                })
            next()
        })
    }
}).$mount('#app')
