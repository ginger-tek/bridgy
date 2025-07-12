import store from './store.js'

const routes = [
  { path: '/login', component: () => import('./views/login.js') },
  {
    path: '/app', component: () => import('./views/app.js'), meta: { auth: true }, children: [
      { path: '', component: () => import('./views/app/dashboard.js') },
      { path: 'classes', component: () => import('./views/app/classes.js') },
      { path: 'classes/:id', component: () => import('./views/app/class.js') },
      { path: 'people', component: () => import('./views/app/people.js') },
      { path: 'people/:id', component: () => import('./views/app/person.js') },
      { path: 'students', component: () => import('./views/app/students.js') },
      { path: 'settings', component: () => import('./views/app/settings.js'), meta: { admin: true } },
    ]
  },
  { path: '/:pathMatch(.*)*', component: () => import('./views/notFound.js') },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.path !== '/login' && !store.session && to.meta.auth)
    return next('/login')
  else if (to.path == '/login' && store.session)
    return next('/app')
  next()
})

export default router