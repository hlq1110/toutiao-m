import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

//vuex容器中的数据页面一刷新就会恢复初始值
export default new Vuex.Store({
  state: {
    // user: null //当前登录用户的登录状态(token等数据)
    // user: JSON.parse(window.localStorage.getItem('user'))
    user: getItem('user')
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      //为了防止页面刷新数据丢失，我们还需要把数据放到本地存储(只能放字符串)中
      //还需要将对象形式转为字符串形式,这里仅仅是为了持久化数据
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem('user', state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})


