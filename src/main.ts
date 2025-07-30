import './assets/main.css'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark-mode',
            cssLayer: {
                name: 'primevue',
                order: 'primevue'
            }
        }
    }
});
app.mount("#app");