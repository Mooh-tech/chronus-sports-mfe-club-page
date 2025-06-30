import { h, createApp } from "vue";
import singleSpaVue from "single-spa-vue";
import router from "./router/index";
import App from "./App.vue";
import { createPinia } from "pinia";

const vueLifecycles = singleSpaVue({
  createApp: (...args) => {
    const vueInstance = createApp(...args);

    const pinia = createPinia();
    vueInstance
      .use(router)
      .use(pinia);
      
    return vueInstance;
  },
  appOptions: {
    render() {
      return h(App, {});
    },
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
