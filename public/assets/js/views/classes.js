export default {
  template: `<pv-table :items="classes" :fields="fields" :busy="loading" bordered filter sort>
    <template #empty>
      <p>No classes found</p>
      <button @click="() => createClassRef.openModal()">Create Class</button>
    </template>
    <template #title="{id,title}">
      <router-link :to="'/classes/'+id">{{ title }}</router-link>
    </template>
    <template #instructors-names="{instructorsNames}">
      <span v-if="instructorsNames.length === 0">No instructors assigned</span>
      <div v-for="p of instructorsNames" :key="p.id" style="margin-right:5px"><router-link :to="'/people/'+p.id">{{ p.name }}</router-link></div>
    </template>
    <template #students-names="{studentsNames}">
      <span v-if="studentsNames.length === 0">No students assigned</span>
      <div v-for="p of studentsNames" :key="p.id" style="margin-right:5px"><router-link :to="'/people/'+p.id">{{ p.name }}</router-link></div>
    </template>
    <template #created="{created}">
      {{ new Date(created).toLocaleDateString() }}
    </template>
    <template #modified="{modified}">
      {{ new Date(modified).toLocaleDateString() }}
    </template>
  </pv-table>
  <div align="center" v-if="!loading && classes.length > 0">
    <button @click="() => createClassRef.openModal()">Create Class</button>
  </div>
  <pv-modal ref="createClassRef">
    <template #header>
      <b>Create Class</b>
    </template>
    <form @submit.prevent="createClass">
      <label>Class Title
        <input v-model="classObj.title" @blur="classObj.title = classObj.title.trim()" type="text" required>
      </label>
      <label>Class Description
        <textarea v-model="classObj.description" @blur="classObj.description = classObj.description.trim()" rows="5"></textarea>
      </label>
      <button type="submit">Create</button>
    </form>
  </pv-modal>`,
  setup() {
    const api = Vue.inject('api')
    const loading = Vue.ref(false)
    const classes = Vue.ref([])
    const fields = [
      'title',
      { name: 'instructorsNames', label: 'Instructors' },
      { name: 'studentsNames', label: 'Students' },
      'modified'
    ]
    const createClassRef = Vue.ref(null)
    const classObj = Vue.reactive({
      title: '',
      description: ''
    })

    async function fetchClasses() {
      try {
        loading.value = true
        classes.value = await api.get('classes').then(data => {
          return data
            .map(s => ({
              ...s,
              instructorsNames: (s.instructorsNames || '').split(',')
                .filter(c => c.trim() !== '')
                .map(c => {
                  const parts = c.split(':')
                  return { id: parts[0], name: parts[1] }
                }),
              studentsNames: (s.studentsNames || '').split(',')
                .filter(c => c.trim() !== '')
                .map(c => {
                  const parts = c.split(':')
                  return { id: parts[0], name: parts[1] }
                })
            }))
        })
      } catch (error) {
        console.error('Error fetching classes:', error)
        PicoVue.appendToast('Error fetching classes', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    async function createClass() {
      try {
        const newClass = await api.post('classes', classObj)
        classes.value.push(newClass)
        PicoVue.appendToast('Class created successfully', { variant: 'success' })
        createClassRef.value.closeModal()
        classObj.title = ''
      } catch (error) {
        console.error('Error creating class:', error)
        PicoVue.appendToast('Error creating class', { variant: 'danger' })
      }
    }

    Vue.onBeforeMount(fetchClasses)

    return {
      loading,
      classes,
      fields,
      createClassRef,
      classObj,
      fetchClasses,
      createClass,
    }
  }
}