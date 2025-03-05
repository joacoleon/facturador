import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import SearchClient from '@/components/Client/SearchClient.vue'
import NewClient from '@/components/Client/NewClient.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/change-password',
      name: 'changePassword',
      component: ChangePassword
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/client/search',
      name: 'searchClient',
      component: SearchClient
    },
    {
      path: '/client/new',
      name: 'newClient',
      component: NewClient
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const user = await authStore.getCurrentUser();

  if (!user) {
    // Allow unauthenticated users to access login and change-password
    if (to.name === 'login' || to.name === 'changePassword') {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    // Prevent authenticated users from accessing change-password or login
    if (to.name === 'login') {
      next({ name: 'home' });
    } else {
      next();
    }
  }
});

export default router
