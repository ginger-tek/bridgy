export default {
  template: `<pv-table :items="people" :fields="fields" :busy="loading" bordered filter sort>
    <template #empty>
      <p>No people found</p>
      <button @click="() => createPersonRef.openModal()">Add Person</button>
    </template>
    <template #first-name="{id,fullName}">
      <router-link :to="'/people/'+id">{{ fullName }}</router-link>
    </template>
    <template #created="{created}">
      {{ new Date(created).toLocaleDateString() }}
    </template>
    <template #modified="{modified}">
      {{ new Date(modified).toLocaleDateString() }}
    </template>
  </pv-table>
  <div align="center" v-if="!loading && people.length > 0">
    <button @click="() => createPersonRef.openModal()">Add Person</button>
  </div>
  <pv-modal ref="createPersonRef">
    <template #header>
      <b>Add Person</b>
    </template>
    <form @submit.prevent="createPerson">
      <label>Name
        <fieldset role="group">
          <input v-model="personObj.firstName" @blur="personObj.firstName = personObj.firstName.trim()" type="text" placeholder="First Name" required>
          <input v-model="personObj.lastName" @blur="personObj.lastName = personObj.lastName.trim()" type="text" placeholder="Last Name" required>
        </fieldset>
      </label>
      <label>Email
        <input v-model="personObj.email" @blur="personObj.email = personObj.email.trim()" type="email" required>
      </label>
      <button type="submit">Create</button>
    </form>
  </pv-modal>`,
  setup() {
    const api = Vue.inject('api')
    const loading = Vue.ref(false)
    const people = Vue.ref([])
    const fields = [
      { name: 'firstName', label: 'Name' },
      'email',
      'created',
      'modified'
    ]
    const createPersonRef = Vue.ref(null)
    const personObj = Vue.reactive({
      firstName: '',
      lastName: '',
      email: '',
    })

    async function fetchPeople() {
      try {
        loading.value = true
        people.value = await api.get('people')
      } catch (error) {
        console.error('Error fetching people:', error)
        PicoVue.appendToast('Error fetching people', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    async function createPerson() {
      try {
        const newPerson = await api.post(`people`, personObj)
        people.value.push(newPerson)
        PicoVue.appendToast('Class created successfully', { variant: 'success' })
        createPersonRef.value.closeModal()
        personObj.title = ''
      } catch (error) {
        console.error('Error creating class:', error)
        PicoVue.appendToast('Error creating class', { variant: 'danger' })
      }
    }

    Vue.onBeforeMount(fetchPeople)

    return {
      loading,
      people,
      fields,
      createPersonRef,
      personObj,
      fetchPeople,
      createPerson,
    }
  }
}