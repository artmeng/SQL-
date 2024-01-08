import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

//路由懒加载
const routes = [
  { path: '/', component: () => import('@/pages/index.vue') },
]

const router = new VueRouter({
  routes
})

export default router

