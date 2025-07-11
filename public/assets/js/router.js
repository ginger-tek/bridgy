const routes = [
  { path: '/', component: () => import('./views/dashboard.js') },
  { path: '/classes', component: () => import('./views/classes.js') },
  { path: '/classes/:id', component: () => import('./views/class.js') },
  { path: '/people', component: () => import('./views/people.js') },
  { path: '/people/:id', component: () => import('./views/person.js') },
  { path: '/students', component: () => import('./views/students.js') },
  { path: '/:pathMatch(.*)*', component: () => import('./views/notFound.js') },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router