import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  function login(username, password) {
    token.value = 'mock-token-' + Date.now()
    localStorage.setItem('token', token.value)
    userInfo.value = { username, role: 'superAdmin', enterprise: '利尔达集团' }
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('token')
    userInfo.value = null
  }

  return { token, userInfo, isLoggedIn, login, logout }
})
