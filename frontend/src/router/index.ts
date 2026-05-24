import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Learning from '../pages/Learning.vue'
import Chat from '../pages/Chat.vue'
import Lesson from '../pages/Lesson.vue'
import Login from '../pages/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/learning', component: Learning },
  { path: '/chat', component: Chat },
  { path: '/lesson', component: Lesson },
  { path: '/login', component: Login },
  { path: '/writing', component: () => import('../pages/Writing.vue') },
  { path: '/progress', component: () => import('../pages/Progress.vue') },
  { path: '/profile', component: () => import('../pages/Profile.vue') },
  { path: '/vocabulary', component: () => import('../pages/VocabularyLearning.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
