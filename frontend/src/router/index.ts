import { createRouter, createWebHistory } from 'vue-router';

// 句乐部新功能页面
import Home from '../pages/Home.vue';
import PracticePage from '../pages/PracticePage.vue';
import CoursePlaza from '../pages/CoursePlaza.vue';
import StatisticsPage from '../pages/StatisticsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import CourseEditor from '../pages/CourseEditor.vue';
import PKArena from '../pages/PKArena.vue';

// 原有功能页面
import Chat from '../pages/Chat.vue';
import VocabularyLearning from '../pages/VocabularyLearning.vue';
import Learning from '../pages/Learning.vue';
import Lesson from '../pages/Lesson.vue';
import Writing from '../pages/Writing.vue';

const routes = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  
  // 句乐部新功能
  {
    path: '/practice',
    name: 'Practice',
    component: PracticePage,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: CoursePlaza,
  },
  {
    path: '/courses/create',
    name: 'CourseEditor',
    component: CourseEditor,
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/pk-arena',
    name: 'PKArena',
    component: PKArena,
  },
  
  // 原有功能
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/vocabulary',
    name: 'Vocabulary',
    component: VocabularyLearning,
  },
  {
    path: '/lessons',
    name: 'Lessons',
    component: Learning,
  },
  {
    path: '/lesson/:id',
    name: 'LessonDetail',
    component: Lesson,
  },
  {
    path: '/writing',
    name: 'Writing',
    component: Writing,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
