import { createApp } from 'vue';
import router from '@/router';

import 'reset-css';
import '@/assets/scss/app.scss';

import App from './App.vue';

import '@/plugins/form-validation';

const appInstance = createApp(App);

appInstance.use(router);
appInstance.mount('#app');
