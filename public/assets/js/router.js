import store from './store.js'

const routes = [
  { path: '/', component: () => import('./views/dashboard.js'), meta: { auth: true } },
  { path: '/classes', component: () => import('./views/classes.js'), meta: { auth: true } },
  { path: '/classes/:id', component: () => import('./views/class.js'), meta: { auth: true } },
  { path: '/people', component: () => import('./views/people.js'), meta: { auth: true } },
  { path: '/people/:id', component: () => import('./views/person.js'), meta: { auth: true } },
  { path: '/students', component: () => import('./views/students.js'), meta: { auth: true } },
  { path: '/login', component: () => import('./views/login.js') },
  { path: '/:pathMatch(.*)*', component: () => import('./views/notFound.js') },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.session && to.meta.auth) {
    return next('/login')
  }
  next()
})

export default router