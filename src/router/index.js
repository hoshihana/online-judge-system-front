import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView";
import ProblemListView from "@/views/ProblemListView";
import RecordListView from "@/views/RecordListView";
import LoginView from "@/views/LoginView";
import RegisterView from "@/views/RegisterView";
import ProblemView from "@/views/ProblemView";
import axios from "@/utils/axios";
import ProblemEditView from "@/views/ProblemEditView";
import UserView from "@/views/UserView";
import UserHomeView from "@/views/UserHomeView";
import UserProblemListView from "@/views/UserProblemListView";
import RecordView from "@/views/RecordView";
import ContestListView from "@/views/ContestListView";
import UserContestListView from "@/views/UserContestListView";
import ContestEditView from "@/views/ContestEditView";
import ContestView from "@/views/ContestView";
import ContestDetailView from "@/views/ContestDetailView";
import ContestProblemList from "@/views/ContestProblemList";
import ContestProblemView from "@/views/ContestProblemView";
import ContestRecordView from "@/views/ContestRecordView";
import ContestRecordListView from "@/views/ContestRecordListView";
import ContestNewView from "@/views/ContestNewView";
import ProblemNewView from "@/views/ProblemNewView";
import ContestRankView from "@/views/ContestRankView";
import UserPasswordView from "@/views/UserPasswordView";
import NotFoundView from "@/views/NotFoundView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: HomeView
    },
    {
        path: '/login',
        component: LoginView,
        beforeEnter: function (to, from, next) {
            if (router.app.$root.loginStatus.login) {
                router.app.$message.error("已登录，如需切换账号请先登出")
                NProgress.done()
                next('/')
            } else {
                next()
            }
        }
    },
    {
        path: '/register',
        component: RegisterView,
        beforeEnter: function (to, from, next) {
            if (router.app.$root.loginStatus.login) {
                router.app.$message.error("已登录，如需注册账号请先登出")
                NProgress.done()
                next('/')
            } else {
                next()
            }
        }
    },
    {
        path: '/problem/list',
        component: ProblemListView
    },
    {
        path: '/problem/new',
        component: ProblemNewView,
        beforeEnter: function (to, from, next) {
            if (router.app.$root.loginStatus.role !== "ADMIN") {
                router.app.$message.error("普通用户无权创建题目")
                NProgress.done()
                next(false)
            } else {
                next()
            }
        }
    },
    {
        path: '/problem/:id',
        component: ProblemView,
        props: true,
        beforeEnter: function (to, from, next) {
            axios.get("/problems/" + to.params.id + "/permissions/get")
                .then(() => {
                    next()
                }).catch((error) => {
                router.app.$message.error(error.response.data)
                NProgress.done()
                next(false)
            })
        }
    },
    {
        path: '/problem/:id/edit',
        component: ProblemEditView,
        props: true,
        beforeEnter: function (to, from, next) {
            axios.get("/problems/" + to.params.id + "/permissions/edit")
                .then(() => {
                    next()
                }).catch((error) => {
                router.app.$message.error(error.response.data)
                NProgress.done()
                next(false)
            })
        }
    },
    {
        path: '/user/:id',
        component: UserView,
        props: true,
        children: [
            {
                path: '',
                component: UserHomeView,
                props: true,
                beforeEnter: function (to, from, next) {
                    axios.get("/accounts/" + to.params.id)
                        .then(() => {
                            next()
                        }).catch((error) => {
                        router.app.$message.error(error.response.data)
                        NProgress.done()
                        next(false)
                    })
                }
            },
            {
                path: 'password',
                component: UserPasswordView,
                props: true,
                beforeEnter: function (to, from, next) {
                    if (router.app.$root.loginStatus.userid !== parseInt(to.params.id)) {
                        router.app.$message.error("无权修改他人密码")
                        NProgress.done()
                        next(false)
                    } else {
                        next()
                    }
                }
            },
            {
                path: 'problem/list',
                component: UserProblemListView,
                props: true,
                beforeEnter: function (to, from, next) {
                    if (router.app.$root.loginStatus.role !== "ADMIN") {
                        router.app.$message.error("普通用户无权创建题目")
                        NProgress.done()
                        next(false)
                    } else if (router.app.$root.loginStatus.userid !== parseInt(to.params.id)) {
                        router.app.$message.error("无权查看他人创建的题目列表")
                        NProgress.done()
                        next(false)
                    } else {
                        next()
                    }
                }
            },
            {
                path: 'contest/list',
                component: UserContestListView,
                props: true,
                beforeEnter: function (to, from, next) {
                    if (router.app.$root.loginStatus.role !== "ADMIN") {
                        router.app.$message.error("普通用户无权创建比赛")
                        NProgress.done()
                        next(false)
                    } else if (router.app.$root.loginStatus.userid !== parseInt(to.params.id)) {
                        router.app.$message.error("无权查看他人创建的比赛列表")
                        NProgress.done()
                        next(false)
                    } else {
                        next()
                    }
                }
            },
        ]
    },
    {
        path: '/contest/new',
        component: ContestNewView,
        beforeEnter: function (to, from, next) {
            if (router.app.$root.loginStatus.role !== "ADMIN") {
                router.app.$message.error("普通用户无权创建比赛")
                NProgress.done()
                next(false)
            } else {
                next()
            }
        }
    },
    {
        path: '/contest/:id/edit',
        component: ContestEditView,
        props: true,
        beforeEnter: function (to, from, next) {
            axios.get("/contests/" + to.params.id + "/permissions/edit")
                .then(() => {
                    next()
                }).catch((error) => {
                router.app.$message.error(error.response.data)
                NProgress.done()
                next(false)
            })
        }
    },
    {
        path: '/contest/list',
        component: ContestListView,
    },
    {
        path: '/contest/:id',
        component: ContestView,
        props: true,
        children: [
            {
                path: '',
                component: ContestDetailView,
                props: true,
            },
            {
                path: 'problem/list',
                component: ContestProblemList,
                props: true,
                beforeEnter: function (to, from, next) {
                    axios.get("/contests/" + to.params.id + "/permissions/enter")
                        .then(() => {
                            next()
                        }).catch((error) => {
                        router.app.$message.error(error.response.data)
                        NProgress.done()
                        next(false)
                    })
                }
            },
            {
                path: 'problem/:number',
                component: ContestProblemView,
                props: true,
                beforeEnter: function (to, from, next) {
                    axios.get("/contests/" + to.params.id + "/problems/" + to.params.number + "/permissions/get")
                        .then(() => {
                            next()
                        }).catch((error) => {
                        router.app.$message.error(error.response.data)
                        NProgress.done()
                        next(false)
                    })
                }
            },
            {
                path: 'record/list',
                component: ContestRecordListView,
                props: true,
                beforeEnter: function (to, from, next) {
                    axios.get("/contests/" + to.params.id + "/permissions/enter")
                        .then(() => {
                            next()
                        }).catch((error) => {
                        router.app.$message.error(error.response.data)
                        NProgress.done()
                        next(false)
                    })
                }
            },
            {
                path: 'rank',
                component: ContestRankView,
                props: true,
                beforeEnter: function (to, from, next) {
                    axios.get("/contests/" + to.params.id + "/permissions/enter")
                        .then(() => {
                            next()
                        }).catch((error) => {
                        router.app.$message.error(error.response.data)
                        NProgress.done()
                        next(false)
                    })
                }
            }
        ]
    },
    {
        path: '/contest/:contestId/record/:recordId',
        component: ContestRecordView,
        props: true,
        beforeEnter: function (to, from, next) {
            axios.get("/contests/" + to.params.contestId + "/records/" + to.params.recordId + "/permissions/get")
                .then(() => {
                    next()
                }).catch((error) => {
                router.app.$message.error(error.response.data)
                NProgress.done()
                next(false)
            })
        }
    },
    {
        path: '/record/list',
        component: RecordListView,
    },
    {
        path: '/record/:id',
        component: RecordView,
        props: true,
        beforeEnter: function (to, from, next) {
            axios.get("/records/" + to.params.id + "/permissions/get")
                .then(() => {
                    next()
                }).catch((error) => {
                router.app.$message.error(error.response.data)
                NProgress.done()
                next(false)
            })
        }

    },
    {
        path: '/about',
        component: AboutView
    },
    {
        path: '*',
        component: NotFoundView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

NProgress.configure({showSpinner: false});

router.beforeEach((to, from, next) => {
    NProgress.start()
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
                    NProgress.done()
                    next(false)
                }
            }
        })
        .catch((error) => {
            router.app.$message.error(error.response.data)
            NProgress.done()
            next(false)
        })
})

router.afterEach(() => {
    NProgress.done()
})

export default router
