import Vue from 'vue';
import BaiduMap from 'vue-baidu-map'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from '@/router/router'
// 引入富文本组件
import QuillEditor from 'vue-quill-editor'
// 引入富文本组件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(QuillEditor)
Vue.use(ElementUI);
Vue.use(BaiduMap, {
  ak: "L0eY0aB9So7nEfQLkLAdG4cHuS9S68Oc"
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});