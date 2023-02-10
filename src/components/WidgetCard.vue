<template>
  <li class="widget-card__item widget-card">
    <div class="widget-card__text-content">{{ weatherData.cityName }}, {{ weatherData.country }}</div>
    <div class="widget-card__weather-info weather-info">
      <div class="weather-info__temperature temperature">
        <img
          :src="`http://openweathermap.org/img/wn/${weatherData.weatherIcon}@2x.png`"
          alt="current weather icon"
        />
        <div class="temperature__degree">{{ weatherData.temperature }}°С</div>
      </div>
      <div class="weather-info__description">Feels like {{ weatherData.feelsLike }}°С. {{ weatherData.description }}.</div>
      <div class="weather-info__data weather-data">
        <div
          class="weather-data__item wind-speed"
          title="Wind speed"
        >
          <svg
            width="24"
            height="24"
          >
            <use
              y="3"
              xlink:href="../assets/sprite.svg#wind-speed"
            ></use>
          </svg>
          {{ weatherData.windSpeed }}m/s SSE
        </div>
        <div
          class="weather-data__item pressure"
          title="Pressure"
        >
          <svg
            width="24"
            height="24"
          >
            <use
              y="1"
              xlink:href="../assets/sprite.svg#hPa"
            ></use>
          </svg>
          {{ weatherData.pressure }}hPa
        </div>
        <div
          class="weather-data__item humidity"
          title="Humidity percentage"
        >
          <svg
            width="24"
            height="20"
          >
            <use xlink:href="../assets/sprite.svg#humidity"></use>
          </svg>
          {{ weatherData.humidity }}%
        </div>
        <div
          class="weather-data__item visibility"
          title="Visibility"
        >
          <svg
            width="24"
            height="24"
          >
            <use xlink:href="../assets/sprite.svg#eye"></use>
          </svg>
          {{ weatherData.visibility }}km
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import type {PropType} from 'vue';
  import type WeatherData from '@/types/weatherData';

  export default defineComponent({
    name: 'WidgetCard',
    components: {},
    props: {
      weatherData: {
        type: Object as PropType<WeatherData>,
        required: true,
      },
    },
    setup() {
      return {};
    },
  });
</script>

<style scoped lang="scss">
  @use '../styles/main';
  @use '../styles/utils/mixins';
  @use '../styles/utils/variables';

  .widget-card {
    display: grid;
    gap: 1rem;
    @include mixins.text-sm-regular;
    box-sizing: border-box;
    min-width: 16rem;
    padding: 1rem;
    border: 1px solid variables.$color-grey-lighter;
    border-radius: 0.25rem;

    &__text-content {
      @include mixins.text-md-semi-bold;
    }
  }

  .weather-info {
    display: grid;
    gap: 1rem;

    &__description {
      text-transform: capitalize;
    }
  }

  .temperature {
    display: flex;
    align-items: center;
    justify-self: center;
    gap: 0.5rem;

    &__degree {
      @include mixins.text-h1-bold;
    }
  }

  .weather-data {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;

    &__item {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }
  }
</style>
