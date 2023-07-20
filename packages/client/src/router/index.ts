import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Notifications from '../views/Notifications.vue'
import Profile from '../views/profile/slug.vue'
import Thread from '../views/Thread.vue'

export default function () {
  const history = typeof window !== 'undefined' ? createWebHistory() : createMemoryHistory()

  const router = createRouter({
    history,
    routes: [
      { path: '/', component: Home },
      { path: '/notifications', component: Notifications },
      {
        path: '/profile/:slug',
        name: 'Profile',
        component: Profile,
      },
      {
        path: '/profile/:slug/post/:cid',
        name: 'Thread',
        component: Thread,
      },
    ],
    scrollBehavior(_to, _from, _savedPosition) {
      return { top: 0 }
    },
  })

  return router
}
