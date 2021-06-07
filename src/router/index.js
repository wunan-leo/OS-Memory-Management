import Vue from 'vue'
import VueRouter from 'vue-router'
import MemoryInterface from '../views/MemoryInterface.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MemoryInterface',
    component: MemoryInterface
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
