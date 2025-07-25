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
        <li id="brand"><icon></icon> <span><b>Bridgy</b></span></li>
      </ul>
      <ul>
        <li v-if="store.session"><i class="bi bi-person-circle"></i> {{ store.session.username }}</li>
        <li v-if="!store.session"><router-link to="/login"><i class="bi bi-box-arrow-in-right"></i> Login</router-link></li>
        <li v-else-if="store.session"><a @click="logout" id="logout"><i class="bi bi-box-arrow-right"></i> <span>Logout</span></a></li>
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