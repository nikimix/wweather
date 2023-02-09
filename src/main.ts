import './styles/main.scss';
import {defineAsyncComponent} from 'vue';
import WeatherWidget from '@/components/WeatherWidget.vue';

const weatherWidgetElement = defineCustomElement(WeatherWidget, {
  globalComponents: {
    BaseModal: defineAsyncComponent(() => import('@/components/BaseModal.vue')),
    WidgetCard: defineAsyncComponent(() => import('@/components/WidgetCard.vue')),
    WidgetSettings: defineAsyncComponent(() => import('@/components/WidgetSettings.vue')),
  },
});
// @ts-ignore
import {defineCustomElement} from './defineCustomElementWithStyles.js';

customElements.define('weather-widget', weatherWidgetElement);
