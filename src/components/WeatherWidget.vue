<template>
  <div class="widget-board">
    <button
      class="widget-board__action button"
      @click="openSettings"
    >
      <svg
        width="24"
        height="24"
      >
        <use xlink:href="../assets/sprite.svg#gear"></use>
      </svg>
    </button>
    <TransitionGroup
      class="widget-card__list widget-card-list"
      name="card-list"
      tag="ul"
    >
      <widget-card
        v-for="weatherCardData of weatherData"
        :key="weatherCardData.id"
        :weather-data="weatherCardData"
      />
    </TransitionGroup>
    <base-modal
      v-model:isShown="isShownSettings"
      :width="500"
      title="Settings"
    >
      <template #main>
        <widget-settings
          :locations="weatherData"
          @addLocation="addNewWeatherData"
          @deleteLocation="deleteWeatherDataByIndex"
          @swapLocations="sortWidgetCards"
        />
      </template>
    </base-modal>
  </div>
</template>

<script lang="ts">
  import {defineComponent, onBeforeMount, ref} from 'vue';
  import {getWeatherData} from '@/api/apiOpenWheaterMap';
  import {getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem} from '@/services/localStorage';
  import WidgetCard from '@/components/WidgetCard.vue';
  import WidgetSettings from '@/components/WidgetSettings.vue';
  import BaseModal from '@/components/BaseModal.vue';
  import WeatherDataPayload from '@/types/weatherDataPayload';
  import Coordinates from '@/types/coordinates';
  import type WeatherData from '@/types/weatherData';

  export default defineComponent({
    name: 'WeatherWidget',
    components: {
      WidgetCard,
      WidgetSettings,
      BaseModal,
    },
    setup() {
      // SETTINGS
      const isShownSettings = ref(false);

      const openSettings = () => {
        isShownSettings.value = true;
      };

      //WEATHER
      const defaultCoords: Coordinates = {
        lat: 53.9024716,
        lon: 27.5618225,
      };
      const weatherData = ref<WeatherData[]>([]);

      const mapWeatherData = (data: WeatherDataPayload) => ({
        id: data.id,
        cityName: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        feelsLike: +data.main.feels_like.toFixed(),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        weatherIcon: data.weather[0].icon,
        temperature: +data.main.temp.toFixed(),
        visibility: data.visibility / 1000,
        windSpeed: data.wind.speed,
      });

      const addWeatherDataByCoords = async (coords = defaultCoords) => {
        const payload: WeatherDataPayload = await getWeatherData(coords);
        weatherData.value.push(mapWeatherData(payload));
        setLocalStorageItem<Array<WeatherData>>('weatherData', weatherData.value);
      };

      const addNewWeatherData = (payload: WeatherDataPayload) => {
        console.log(payload);
        weatherData.value.push(mapWeatherData(payload));
        setLocalStorageItem<Array<WeatherData>>('weatherData', weatherData.value);
      };

      const setWeatherDataByCurrentPosition = (): void => {
        navigator.geolocation.getCurrentPosition(
            async ({coords}) => {
              await addWeatherDataByCoords({lat: coords.latitude, lon: coords.longitude});
            },
            async () => {
              await addWeatherDataByCoords();
            },
        );
      };

      const deleteWeatherDataByIndex = (index: number) => {
        weatherData.value.splice(index, 1);
        if (weatherData.value.length) {
          setLocalStorageItem<Array<WeatherData>>('weatherData', weatherData.value);
        } else {
          removeLocalStorageItem('weatherData');
          setWeatherDataByCurrentPosition();
        }
      };


      const initWeatherData = () => {
        const data: Array<WeatherData> | undefined = getLocalStorageItem<Array<WeatherData>>('weatherData');
        if (data) {
          weatherData.value = data;
        } else {
          setWeatherDataByCurrentPosition();
        }
      };

      onBeforeMount(async () => {
        initWeatherData();
      });

      const sortWidgetCards = (draggableItemId: number, droppedItemId: number) => {
        const replacedItem = weatherData.value.splice(draggableItemId, 1)[0];
        weatherData.value.splice(droppedItemId, 0, replacedItem);
        setLocalStorageItem<Array<WeatherData>>('weatherData', weatherData.value);
      };

      return {
        weatherData,
        isShownSettings,
        openSettings,
        addWeatherDataByCoords,
        addNewWeatherData,
        deleteWeatherDataByIndex,
        sortWidgetCards,
      };
    },
  });
</script>

<style scoped lang="scss">
  @use '../styles/main';

  .widget-board {
    position: relative;
    padding: 1rem 2rem;

    &__action {
      position: absolute;
      top: 1rem;
      right: 0;
    }
  }

  .widget-card-list {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  }
</style>