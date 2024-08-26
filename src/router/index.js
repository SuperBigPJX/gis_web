import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import AfterLogin from "@/views/AfterLogin.vue";
import Map from "@/views/Map.vue";
import jiancha from "@/views/jiancha.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path:'/after',
      name:'after',
      component: AfterLogin
    },
    {
      path:'/map',
      name:'map',
      component: Map
    },
    {
      path:'/jiancha',
      name:'jiancha',
      component: jiancha
    }
  ]
})

export default router
