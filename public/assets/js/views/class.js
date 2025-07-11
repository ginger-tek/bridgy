export default {
  template: `<form :aria-busy="loading">
    <div style="float:right;margin-bottom:5px">
      <span @click="edit=!edit"><i :class="['bi',(edit?'bi-x-circle':'bi-pencil')]"></i> {{ edit ? 'Cancel' : 'Edit' }}</span>
      &nbsp;<span v-if="edit" @click="save"><i class="bi-check-circle"></i> Save</span>
    </div>
    <input v-if="edit" v-model="classObj.title" @blur="classObj.title = classObj.title.trim()" type="text" placeholder="Title" required>
    <h1 v-else>{{ classObj.title }}</h1>
    <textarea v-if="edit" v-model="classObj.description" @blur="classObj.description = classObj.description.trim()" rows="3" placeholder="Description"></textarea>
    <p v-else style="white-space:pre-wrap">{{ classObj.description }}</p>
    <p><small>
      Created: {{ new Date(classObj.created).toLocaleDateString() }} |
      Modified: {{ new Date(classObj.modified).toLocaleDateString() }}
    </small></p>
  </form>
  <pv-table :items="classAssignments" :fields="classAssignmentFields" bordered filter sort>
    <template #empty>
      <div class="text-center">
        <p>No one assigned yet</p>
        <button @click="() => assignPersonModalRef.openModal()">Assign Person</button>
      </div>
    </template>
    <template #person-name="{id,personFullName}">
      <router-link :to="'/people/'+id">{{ personFullName }}</router-link>
    </template>
    <template #created="{created}">
      {{ new Date(created).toLocaleDateString() }}
    </template>
    <template #modified="{modified}">
      {{ new Date(modified).toLocaleDateString() }}
    </template>
  </pv-table>
  <div align="center" v-if="!loading && classAssignments.length > 0">
    <button @click="() => assignPersonModalRef.openModal()">Assign Person</button>
  </div>
  <pv-modal ref="assignPersonModalRef" @opening="fetchPeople">
    <template #header>
      <b>Assign Person</b>
    </template>
    <form @submit.prevent="assignPerson">
      <div class="grid">
        <label>Student
          <select v-model="assignObj.personId" :disabled="people.length==0" required>
            <option value="">{{ people.length > 0 ? 'Select a student' : 'No people to select' }}</option>
            <option v-for="p in people" :key="p.id" :value="p.id">{{ p.fullName }}</option>
          </select>
        </label>
        <label>Role
          <select v-model="assignObj.role" required>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="assistant">Assistant</option>
          </select>
        </label>
      </div>
      <button type="submit">Assign</button>
    </form>
  </pv-modal>`,
  setup() {
    const api = Vue.inject('api')
    const edit = Vue.ref(false)
    const route = VueRouter.useRoute()
    const loading = Vue.ref(false)
    const classObj = Vue.ref({})
    const people = Vue.ref([])
    const classAssignments = Vue.ref([])
    const classAssignmentFields = [
      { name: 'personFullName', label: 'Name' },
      'role',
      'created',
      'modified'
    ]
    const assignPersonModalRef = Vue.ref(null)
    const assignObj = Vue.reactive({
      classId: route.params.id,
      personId: '',
      role: 'student'
    })

    async function fetchClass() {
      try {
        loading.value = true
        classObj.value = await api.get(`classes/${route.params.id}`)
        await fetchClassAssignments()
      } catch (error) {
        console.error('Error fetching class:', error)
        PicoVue.appendToast('Error fetching class', { variant: 'danger' })
      } finally {
        loading.value = false
      }
    }

    async function fetchClassAssignments() {
      try {
        classAssignments.value = await api.get(`classes/${classObj.value.id}/assignments`)
      } catch (error) {
        console.error('Error fetching class assignments:', error)
        PicoVue.appendToast('Error fetching class assignments', { variant: 'danger' })
      }
    }

    async function fetchPeople() {
      try {
        people.value = await api.get('people')
      } catch (error) {
        console.error('Error fetching available people:', error)
        PicoVue.appendToast('Error fetching available people', { variant: 'danger' })
      }
    }

    async function assignPerson() {
      try {
        if (!assignObj.personId || !assignObj.role)
          return PicoVue.appendToast('A person and role must be selected', { variant: 'warning' })
        const newAssign = await api.post(`assignments`, assignObj)
        classAssignments.value.push(newAssign)
        PicoVue.appendToast('Student enrolled successfully', { variant: 'success' })
        assignPersonModalRef.value.closeModal()
        assignObj.personId = ''
      } catch (error) {
        console.error('Error enrolling student:', error)
        PicoVue.appendToast('Error enrolling student in class', { variant: 'danger' })
      }
    }

    async function save() {
      try {
        if (!classObj.value.title)
          return PicoVue.appendToast('Title is required', { variant: 'warning' })
        const updatedClass = await api.put(`classes/${classObj.value.id}`, classObj.value)
        classObj.value = updatedClass
        PicoVue.appendToast('Class updated successfully', { variant: 'success' })
        edit.value = false
      } catch (error) {
        console.error('Error updating class:', error)
        PicoVue.appendToast('Error updating class', { variant: 'danger' })
      }
    }

    Vue.onBeforeMount(fetchClass)

    return {
      loading,
      edit,
      classObj,
      people,
      classAssignments,
      classAssignmentFields,
      assignPersonModalRef,
      assignObj,
      fetchClass,
      fetchPeople,
      fetchClassAssignments,
      assignPerson,
      save,
    }
  }
}