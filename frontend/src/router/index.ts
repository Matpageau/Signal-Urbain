import { createRouter, createWebHistory, type NavigationGuardNext } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AdminView from '@/views/AdminView.vue'
import { useUserStore } from '@/stores/userStore'
import { UserRoleEnum } from '@/types/User'

const isConnected = async (to: unknown, from: unknown, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  if(userStore.currentUser) {
    next()
  } else {
    return next({ name: 'app'})
  }
}

const isAdmin = async (to: unknown, from: unknown, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  if (!userStore.currentUser) {
    await userStore.fetchUser(true)
  }
  
  if(userStore.currentUser?.role == UserRoleEnum.ADMIN) {
    next()
  } else {
    return next({ name: 'home' })
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/app",
      name: "app",
      component: MainView
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      beforeEnter: isConnected
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      beforeEnter: isAdmin
    }
  ]
})

export default router
