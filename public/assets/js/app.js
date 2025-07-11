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
      <ul>
        <li><i class="bi bi-person-circle"></i></li>
      </ul>
    </nav>
  </header>
  <main>
    <div class="side-menu-split">
      <article>
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
              <li><router-link to="/logout"><i class="bi bi-box-arrow-right"></i> Logout</router-link></li>
            </ul>
          </nav>
        </aside>
      </article>
      <article>
        <router-view></router-view>
      </article>
    </div>
  </main>
  <pv-toaster></pv-toaster>`,
  setup() {
    Vue.provide('api', api)
    Vue.provide('store', store)
  }
})
  .use(router)
  .use(PicoVue)
  .mount('#app')