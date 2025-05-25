import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import MapPage from '../views/LoadMap.vue'
import NoticeListView from '../views/NoticePage.vue'
import NoticeDetailView from '../views/NoticeDetailView.vue'
import RealEstateNewsView from '@/views/RealEstateNewsView.vue'
import LoginView from '@/components/Login/LoginView.vue'
import SignUpView from '@/components/SignUp/SignUpView.vue'
import MemberDetail from '@/views/member/MemberDetail.vue'
import MyPageView from '@/components/member/MyPageView.vue'
import ChatBot from '@/views/ChatBot.vue'
import NoticeWrite from '@/views/NoticeWrite.vue'

const routes = [
  { path: '/', name: 'Home', component: MainPage },
  { path: '/map', name: 'map', component: MapPage },
  { path: '/notice', name: 'notice', component: NoticeListView },
  { path: '/notice/:id', name: 'NoticeDetail', component: NoticeDetailView, props: true },
  { path: '/news', name: 'NewsView', component: RealEstateNewsView, props: true },
  { path: '/login', name: 'LoginView', component: LoginView, props: true },
  { path: '/signup', name: 'SignUpView', component: SignUpView, props: true },
  { path: '/memberDetail', name: 'MemberDetail', component: MemberDetail, props: true },
  { path: '/myPage', name: 'MyPageView', component: MyPageView, props: true },
  { path: '/chatBot', name: 'ChatBot', component: ChatBot, props: true },
  { path: '/noticeWrite', name: 'NoticeWrite', component: NoticeWrite, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
