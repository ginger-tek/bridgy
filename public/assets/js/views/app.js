export default {
  template: `<div class="side-menu-split">
    <article>
      <aside>
        <nav>
          <ul>
            <li><router-link to="/app"><i class="bi bi-graph-up"></i> Dashboard</router-link></li>
            <li><router-link to="/app/classes"><i class="bi bi-list-task"></i> Classes</router-link></li>
            <li><router-link to="/app/students"><i class="bi bi-person-lines-fill"></i> Students</router-link></li>
            <li><router-link to="/app/people"><i class="bi bi-people-fill"></i> People</router-link></li>
            <li><router-link to="/app/settings"><i class="bi bi-gear-fill"></i> Settings</router-link></li>
          </ul>
        </nav>
      </aside>
    </article>
    <article>
      <router-view></router-view>
    </article>
  </div>`,
  setup() {
    
  }
}