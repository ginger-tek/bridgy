import api from './api.js'
import router from './router.js'
import store from './store.js'
import Icon from './components/icon.js'

store.session = await api.get('session')

Vue.createApp({
  components: { Icon },
  template: `<header>
    <nav>
      <ul>
        <li><b><icon></icon> Bridgy</b></li>
      </ul>
      <ul>
        <li v-if="!store.session"><router-link to="/portal"><i class="bi bi-person-workspace"></i> Portal</router-link></li>
        <li v-if="store.session"><i class="bi bi-person-circle"></i> {{ store.session.username }}</li>
        <li v-if="store.session"><a @click="logout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <pv-toaster position="bottom-center"></pv-toaster>
  <pv-confirm ref="confirmRef"></pv-confirm>`,
  setup() {
    Vue.provide('api', api)
    Vue.provide('store', store)

    const router = VueRouter.useRouter()
    const confirmRef = Vue.ref(null)

    async function logout() {
      const result = await confirmRef.value.confirmAsync('Are you sure you want to log out?')
      if (!result) return
      const res = await api.post('logout')
      if (res.result === 'success') {
        store.session = null
        router.replace('/login')
      } else
        PicoVue.appendToast(res.error || 'Logout failed', { variant: 'danger' })
    }

    return {
      logout,
      store,
      confirmRef
    }
  }
})
  .use(router)
  .use(PicoVue)
  .mount('#app')