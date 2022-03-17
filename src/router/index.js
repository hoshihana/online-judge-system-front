import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView";
import ProblemListView from "@/views/ProblemListView";
import problemSetListView from "@/views/ProblemSetListView";
import statusListView from "@/views/StatusListView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/problem/list',
    name: 'problemList',
    component: ProblemListView
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

export default router
