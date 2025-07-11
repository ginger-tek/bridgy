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
        <li><b><icon width="24px"></icon> Bridgy</b></li>
      </ul>
      <ul v-if="store.session">
        <li><i class="bi bi-person-circle"></i> {{ store.session.username }}</li>
      </ul>
    </nav>
  </header>
  <main>
    <div class="side-menu-split" :style="{ 'justify-content': !store.session ? 'center' : 'flex-start' }">
      <article v-if="store.session">
        <aside>
          <nav>
            <ul>
              <li><router-link to="/"><i class="bi bi-graph-up"></i> Dashboard</router-link></li>
              <li><router-link to="/classes"><i class="bi bi-list-task"></i> Classes</router-link></li>
              <li><router-link to="/students"><i class="bi bi-person-lines-fill"></i> Students</router-link></li>
              <li><router-link to="/people"><i class="bi bi-people-fill"></i> People</router-link></li>
              <li><hr></li>
              <li><router-link to="/settings"><i class="bi bi-gear-fill"></i> Settings</router-link></li>
              <li><router-link to="/about"><i class="bi bi-info-circle-fill"></i> About</router-link></li>
              <li><a @click="logout"><i class="bi bi-box-arrow-right"></i> Logout</a>
                <pv-confirm ref="confirmRef"></pv-confirm>
              </li>
            </ul>
          </nav>
        </aside>
      </article>
      <article :style="{'max-width': (!store.session ? '320px' : 'unset')}">
        <router-view></router-view>
      </article>
    </div>
  </main>
  <pv-toaster></pv-toaster>`,
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
        Vue.nextTick(() => {
          PicoVue.appendToast('Logged out successfully', { variant: 'success' })
          router.replace('/login')
        })
      } else
        PicoVue.appendToast(res.error || 'Logout failed', { variant: 'danger' })
    }

    return {
      store,
      confirmRef,
      logout
    }
  }
})
  .use(router)
  .use(PicoVue)
  .mount('#app')