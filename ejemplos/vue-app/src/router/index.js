import { createRouter, createWebHistory } from 'vue-router'
import TaskList from '../views/TaskList.vue'
import TaskForm from '../views/TaskForm.vue'
import TaskDetail from '../views/TaskDetail.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tasks' },
    { path: '/tasks', name: 'tasks', component: TaskList },
    { path: '/tasks/new', name: 'task-new', component: TaskForm },
    { path: '/tasks/:id(\\d+)', name: 'task-detail', component: TaskDetail, props: true }
  ]
})
