import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/HomePage.vue';

const routes = [{ path: '/', component: Home }];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // short for `routes: routes`
});

export default router;
