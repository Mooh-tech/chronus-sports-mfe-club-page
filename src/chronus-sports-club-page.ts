import { h, createApp } from "vue";
import singleSpaVue from "single-spa-vue";
import router from "./router/index";
import App from "./App.vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const vueLifecycles = singleSpaVue({
  createApp: (...args) => {
    const vueInstance = createApp(...args);

    const pinia = createPinia();
    vueInstance.use(router).use(pinia).use(Toast, {
      transition: "Vue-Toastification__bounce",
      maxToasts: 20,
      newestOnTop: true,
    });

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
