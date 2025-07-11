export default {
  template: `<div align="center">
    <h1>Page not found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <button @click="$router.back('/')">Go Back</button>
  </div>`,
  setup() {
    
  }
}