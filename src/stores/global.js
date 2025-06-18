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
      console.log('🔐 사용자 정보 업데이트:', this.loginUser)
    },
    logout() {
      this.isLoggedIn = false
      this.loginUser = null
      console.log('🚪 로그아웃 완료')
    },
  },
})
