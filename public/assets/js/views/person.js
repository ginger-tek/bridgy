export default {
  template: `<div :aria-busy="loading">
    <h1>{{ personObj.firstName }} {{ personObj.lastName }}</h1>
    <p>{{ personObj.email }}</p>
    <p>Created: {{ new Date(personObj.created).toLocaleDateString() }}</p>
    <p>Modified: {{ new Date(personObj.modified).toLocaleDateString() }}</p>
  </div>`,
  setup() {
    const route = VueRouter.useRoute()
    const api = Vue.inject('api')
    const loading = Vue.ref(false)
    const personObj = Vue.ref({})

    async function fetchPerson() {
      try {
        loading.value = true
        personObj.value = await api.get(`people/${route.params.id}`)
      } catch (error) {
        console.error('Error fetching person:', error)
        PicoVue.appendToast('Error fetching class', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    Vue.onBeforeMount(fetchPerson)

    return {
      loading,
      personObj,
      fetchPerson,
    }
  }
}