import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'




//加载vant组件库
import Vant from 'vant';
//加载vant组件库样式
import 'vant/lib/index.css';
//全局注册vant中的组件
Vue.use(Vant);

//自动设置REM基准值,VueCLI内部使用了postcss，故不需要引入
import 'amfe-flexible'

//加载全局样式(最好放在最后，以便去覆盖第三方库的样式)
import './styles/index.less'

Vue.config.productionTip = false

//创建vue根实例，将router、store配置到根实例中
//把app根组件渲染到#app节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
