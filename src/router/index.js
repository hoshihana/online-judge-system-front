import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView";
import ProblemListView from "@/views/ProblemListView";
import ProblemSetListView from "@/views/ProblemSetListView";
import RecordListView from "@/views/RecordListView";
import LoginView from "@/views/LoginView";
import RegisterView from "@/views/RegisterView";
import ProblemView from "@/views/ProblemView";
import axios from "@/utils/axios";
import ProblemEditView from "@/views/ProblemEditView";
import UserView from "@/views/UserView";
import UserHomeView from "@/views/UserHomeView";
import UserProfileView from "@/views/UserProfileView";
import UserProblemListView from "@/views/UserProblemListView";
import RecordView from "@/views/RecordView";

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
        path: '/problem/new',
        name: 'problemNew',
        component: ProblemEditView
    },
    {
        path: '/problem/:id',
        name: 'problem',
        component: ProblemView,
        props: true
    },
    {
        path: '/problem/:id/edit',
        name: 'problemEdit',
        component: ProblemEditView,
        props: true,
    },
    {
        path: '/user/:id',
        name: 'user',
        component: UserView,
        props: true,
        children: [
            {
                path: '',
                name: 'userHome',
                component: UserHomeView,
                props: true
            },
            {
                path: 'profile',
                name: 'userProfile',
                component: UserProfileView,
                props: true
            },
            {
                path: 'problem/list',
                name: 'userProblemList',
                component: UserProblemListView,
                props: true
            }
        ]
    },
    {
        path: '/problemSet/list',
        name: 'problemSetList',
        component: ProblemSetListView
    },
    {
        path: '/record/list',
        name: 'recordList',
        component: RecordListView,
        props: route => ({ initProblemId: route.query.problemId, initOnlySelf: route.query.onlySelf })
    },
    {
        path: '/record/:id',
        name: 'record',
        component: RecordView,
        props: true
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
    axios.get("/accounts/loginStatus")
        .then((response) => {
            router.app.$root.loginStatus = response.data  // router.app对应Vue实例的this
            if (router.app.$root.loginStatus.login) {
                next()
            } else {
                if (to.path === "/" || to.path === "/login" || to.path === "/register") {
                    next();
                } else {
                    router.app.$message.error("请先登录后查看")
                    next(false)
                }
            }
        })
        .catch((error) => {
            router.app.$message.error(error.response.data)
            next(false)
        })
})

export default router
