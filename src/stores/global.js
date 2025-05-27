import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
    loginUser: null, // 전체 사용자 정보
  }),
  actions: {
    setUser(user) {
      this.isLoggedIn = true
      this.loginUser = {
        uuid: user.memberUuid,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        accessToken: user.accessToken,
      }
    },
    logout() {
      this.isLoggedIn = false
      this.loginUser = null
    },
  },
})
