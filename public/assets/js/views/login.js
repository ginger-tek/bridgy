export default {
  template: `<form @submit.prevent="login" class="login-form">
    <h2>Login</h2>
    <label>Username
      <input v-model="username" type="text" required>
    </label>
    <label>Password
      <input v-model="password" type="password" required>
    </label>
    <pv-button type="submit" :busy="loading">Login</pv-button>
  </form>`,
  setup() {
    const api = Vue.inject('api')
    const store = Vue.inject('store')
    const loading = Vue.ref(false)
    const username = Vue.ref('')
    const password = Vue.ref('')
    const router = VueRouter.useRouter()

    async function login() {
      try {
        loading.value = true
        const response = await api.post('login', {
          username: username.value.trim(),
          password: password.value.trim()
        })
        if (response.result == 'success') {
          store.session = await api.get('session')
          Vue.nextTick(() => {
            router.replace('/')
            PicoVue.appendToast('Logged in successfully', { variant: 'success' })
          })
        } else
          PicoVue.appendToast(response.error || 'Login failed', { variant: 'danger' })
      } catch (ex) {
        console.error('Login error:', ex)
        PicoVue.appendToast('An error occurred during login', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      username,
      password,
      login
    }
  }
}