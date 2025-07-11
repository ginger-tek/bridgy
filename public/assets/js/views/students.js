export default {
  template: `<pv-table :items="students" :fields="fields" :busy="loading" bordered filter sort>
    <template #empty>
      <p>No students found</p>
      <router-link role="button" to="/classes">Go to Classes</router-link>
    </template>
    <template #classes="{classes}">
      <div v-for="c of classes" :key="c.id" style="margin-right:5px"><router-link :to="'/classes/'+c.id">{{ c.title }}</router-link></div>
    </template>
    <template #person-full-name="{id,personFullName}">
      <router-link :to="'/people/'+id">{{ personFullName }}</router-link>
    </template>
    <template #created="{created}">
      {{ new Date(created).toLocaleDateString() }}
    </template>
    <template #modified="{modified}">
      {{ new Date(modified).toLocaleDateString() }}
    </template>
  </pv-table>`,
  setup() {
    const api = Vue.inject('api')
    const loading = Vue.ref(false)
    const students = Vue.ref([])
    const fields = [
      { name: 'personFullName', label: 'Name' },
      'classes'
    ]

    async function fetchStudents() {
      try {
        loading.value = true
        students.value = await api.get(`assignments/students`).then(data => {
          return data
            .map(s => ({
              ...s,
              classes: s.classes.split(',')
                .map(c => {
                  const parts = c.split(':')
                  return { id: parts[0], title: parts[1] }
                })
            }))
        })
      } catch (error) {
        console.error('Error fetching students:', error)
        PicoVue.appendToast('Error fetching students', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    Vue.onBeforeMount(fetchStudents)

    return {
      loading,
      students,
      fields,
      fetchStudents,
    }
  }
}