import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props传参，说白了就是把路由参数映射到组件props数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/',
    name: 'layout', // 如果父路由有默认子路由，那它的name没有意义
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      { path: '/home', name: 'home', component: () => import('@/views/home') }, // 默认子路由，只能有一个
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/my', name: 'my', component: () => import('@/views/my') },
      { path: '/video', name: 'video', component: () => import('@/views/video') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
