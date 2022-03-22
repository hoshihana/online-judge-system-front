import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView";
import ProblemListView from "@/views/ProblemListView";
import problemSetListView from "@/views/ProblemSetListView";
import statusListView from "@/views/StatusListView";
import LoginView from "@/views/LoginView";
import RegisterView from "@/views/RegisterView";
import ProblemView from "@/views/ProblemView";
import axios from "@/utils/axios";
import ProblemEditView from "@/views/ProblemEditView";

Vue.use(VueRouter)

const routes = [
    // todo 配置404页面
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/problem/list',
        name: 'problemList',
        component: ProblemListView
    },
    {
        path: '/problem/edit',
        name: 'problemEdit',
        component: ProblemEditView,
    },
    {
        path: '/problem/:id',
        name: 'problem',
        component: ProblemView,
        props: true
    },
    {
        path: '/problemSet/list',
        name: 'problemSetList',
        component: problemSetListView
    },
    {
        path: '/statusListView',
        name: 'statusList',
        component: statusListView
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    axios.post("/account/isLogin")
        .then((response) => {
            router.app.$root.isLogin = response.data  // router.app对应Vue实例的this
            if (response.data) {
                router.app.$root.isLogin = true
                next()
            } else {
                router.app.$root.isLogin = false
                if (to.path === "/" || to.path === "/login" || to.path === "/register") {
                    next();
                } else {
                    router.app.$message.error("请先登录后查看")
                    next(false)
                }
            }
        })
        .catch((error) => {
            console.log(error.response.data)
        })
})

export default router
