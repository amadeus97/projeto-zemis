import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Home from './views/Home.vue'
import Items from './views/Items.vue'
import Login from './components/Login.vue'
import CreateCollection from './components/CreateCollection.vue'
import Register from './components/Register.vue'
import Profile from './views/Profile.vue'
import Forgot from './views/Forgot.vue'
import Reset from './views/Reset.vue'
import UpdateProfile from './views/UpdateProfile.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/create-collection',
      name: 'create-collection',
      component: CreateCollection,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/items/:id',
      name: 'items',
      component: Items,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: Forgot
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: Reset,
      props: true
    },
    {
      path: '/update-profile',
      name: 'update-profile',
      component: UpdateProfile
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router