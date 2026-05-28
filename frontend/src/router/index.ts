import { createRouter, createWebHistory } from 'vue-router';

// 句乐部新功能页面
import Home from '../pages/Home.vue';
import PracticePage from '../pages/PracticePage.vue';
import CoursePlaza from '../pages/CoursePlaza.vue';
import StatisticsPage from '../pages/StatisticsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import CourseEditor from '../pages/CourseEditor.vue';
import PKArena from '../pages/PKArena.vue';
import LoginPage from '../pages/LoginPage.vue';
import MyProgress from '../pages/MyProgress.vue';
import FavoritesPage from '../pages/FavoritesPage.vue';
import DailyTasksPage from '../pages/DailyTasksPage.vue';
import AchievementsPage from '../pages/AchievementsPage.vue';

// 原有功能页面
import Chat from '../pages/Chat.vue';
import VocabularyLearning from '../pages/VocabularyLearning.vue';
import Learning from '../pages/Learning.vue';
import Lesson from '../pages/Lesson.vue';
import Writing from '../pages/Writing.vue';

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  
  // 首页
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  
  // 学习进度
  {
    path: '/my-progress',
    name: 'MyProgress',
    component: MyProgress,
    meta: { requiresAuth: true },
  },
  
  // 错题本
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
    meta: { requiresAuth: true },
  },
  
  // 每日任务
  {
    path: '/daily-tasks',
    name: 'DailyTasks',
    component: DailyTasksPage,
    meta: { requiresAuth: true },
  },
  
  // 成就系统
  {
    path: '/achievements',
    name: 'Achievements',
    component: AchievementsPage,
    meta: { requiresAuth: true },
  },
  
  // 句乐部新功能
  {
    path: '/practice',
    name: 'Practice',
    component: PracticePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursePlaza,
    meta: { requiresAuth: true },
  },
  {
    path: '/courses/create',
    name: 'CourseEditor',
    component: CourseEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/pk-arena',
    name: 'PKArena',
    component: PKArena,
    meta: { requiresAuth: true },
  },
  
  // 原有功能
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: '/vocabulary',
    name: 'Vocabulary',
    component: VocabularyLearning,
    meta: { requiresAuth: true },
  },
  {
    path: '/lessons',
    name: 'Lessons',
    component: Learning,
    meta: { requiresAuth: true },
  },
  {
    path: '/lesson/:id',
    name: 'LessonDetail',
    component: Lesson,
    meta: { requiresAuth: true },
  },
  {
    path: '/writing',
    name: 'Writing',
    component: Writing,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const requiresAuth = to.meta?.requiresAuth !== false;
  
  // 需要登录但没有 token，跳转到登录页
  if (requiresAuth && !token) {
    next('/login');
    return;
  }
  
  // 已登录但访问登录页，重定向到首页
  if (!requiresAuth && token) {
    next('/');
    return;
  }
  
  next();
});

export default router;
