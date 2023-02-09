<template>
  <div class="settings">
    <TransitionGroup
      name="location-list"
      tag="ul"
      class="settings__location-list location-list"
    >
      <li
        v-for="(location, index) of locations"
        :ref="addLocationRef"
        :key="location.id"
        :id="index"
        class="location-list__item location-item"
        @dragstart="dragStartHandler"
        @dragover="dragOverHandler"
        @dragend="dragEndHandler"
        @drop="dragDropHandler"
      >
        <button
          @mousedown="mouseDownHandler"
          class="location-item__action button"
        >
          <svg
            class="location-item__action-icon"
            width="22"
            height="22"
          >
            <use xlink:href="../assets/sprite.svg#dragg-handle"></use>
          </svg>
        </button>
        <div class="location-item__info">{{ location.cityName }}, {{ location.country }}</div>
        <button
          @click="deleteLocation(index)"
          class="location-item__action location-item__action_delete button"
        >
          <svg
            class="location-item__action-icon"
            width="22"
            height="22"
          >
            <use xlink:href="../assets/sprite.svg#garbage-can"></use>
          </svg>
        </button>
      </li>
    </TransitionGroup>
    <div class="settings__new-location new-location">
      <label
        class="new-location__label"
        for="location-name"
        >Add location</label
      >
      <div class="new-location__field input-wrapper">
        <input
          v-model="cityName"
          id="location-name"
          class="input"
          :class="{invalid: !isValidCityName}"
          type="text"
          @input="isValidCityName = true"
          @keydown.enter="addLocation"
        />
        <div
          v-if="!isValidCityName"
          class="input-wrapper__validation-message"
        >
          {{ validationMessage }}
        </div>
      </div>
      <button
        class="new-location__action button"
        :disabled="!cityName || !isValidCityName"
        @click="addLocation"
      >
        <svg
          class="new-location__action-icon"
          width="24"
          height="24"
        >
          <use xlink:href="../assets/sprite.svg#arrow-left"></use>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import {computed, defineComponent, ref} from 'vue';
  import {getWeatherDataByCity} from '@/api/apiOpenWheaterMap';
  import {PropType} from 'vue';
  import type WeatherData from '@/types/weatherData';
  import WeatherDataPayload from '@/types/weatherDataPayload';

  export default defineComponent({
    name: 'WidgetSettings',
    props: {
      locations: {type: Object as PropType<WeatherData[]>, required: true},
    },
    emits: ['addLocation', 'deleteLocation', 'swapLocations'],
    setup(props, {emit}) {
      const locationRefs = ref<HTMLElement[]>([]);

      const addLocationRef = (element: HTMLElement) => {
        if (element) {
          locationRefs.value.push(element);
        }
      };

      const mouseDownHandler = () => {
        locationRefs.value.forEach((element: HTMLElement) => {
          element.setAttribute('draggable', 'true');
        });
      };

      const dragStartHandler = (event: DragEvent) => {
        if (event.dataTransfer && event.currentTarget && event.currentTarget instanceof Element) {
          event.dataTransfer.setData('id', event.currentTarget.getAttribute('id') || '');
          event.dataTransfer.effectAllowed = 'move';
        }
      };

      const dragOverHandler = (event: DragEvent) => {
        event.preventDefault();
      };

      const dragDropHandler = (event: DragEvent) => {
        if (event.dataTransfer && event.currentTarget && event.currentTarget instanceof Element) {
          const draggableItemId = event.dataTransfer.getData('id');
          const droppedItemId = event.currentTarget.getAttribute('id');
          if (draggableItemId !== droppedItemId) {
            emit('swapLocations', draggableItemId, droppedItemId);
            locationRefs.value = [];
          }
        }
      };

      const dragEndHandler = () => {
        locationRefs.value.forEach((element: HTMLElement) => {
          element.setAttribute('draggable', 'false');
        });
      };

      const cityName = ref('');
      const isValidCityName = ref(true);
      const isUniqueCity = ref(true);
      const validationMessage = computed(() => (isUniqueCity.value ? "There isn't such city." : 'This city already exists.'));

      const addLocation = async () => {
        if (cityName.value) {
          const payload: WeatherDataPayload = await getWeatherDataByCity({q: cityName.value});
          isUniqueCity.value = !props.locations.find((item) => item.id === payload?.id);
          if (payload.cod === 200 && isUniqueCity.value) {
            emit('addLocation', payload);
            isValidCityName.value = true;
            cityName.value = '';
          } else {
            isValidCityName.value = false;
          }
        }
      };

      const deleteLocation = (index: number) => {
        emit('deleteLocation', index);
        locationRefs.value = [];
      };

      return {
        locationRefs,
        addLocationRef,
        mouseDownHandler,
        dragStartHandler,
        dragOverHandler,
        dragDropHandler,
        dragEndHandler,
        cityName,
        isValidCityName,
        validationMessage,
        addLocation,
        deleteLocation,
      };
    },
  });
</script>

<style scoped lang="scss">
  @use '../styles/main';
  @use '../styles/utils/variables';
  @use '../styles/utils/mixins';

  .settings {
    display: grid;
    gap: 2rem;
    padding: 1rem;
    @include mixins.text-md-regular;
  }

  .location-list {
    display: grid;
    gap: 0.5rem;
    padding: 1rem 0;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 18rem;
  }

  .location-item {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 1rem;
    gap: 1rem;
    background: variables.$color-blue-lighter;
    border-radius: 0.25rem;

    &__action {
      &_delete {
        margin-left: auto;
      }
    }
  }

  .new-location {
    display: grid;
    align-items: start;
    grid-template-areas:
      'label label'
      'field button';
    gap: 0.5rem;

    &__label {
      @include mixins.text-md-semi-bold;
      grid-area: label;
    }

    &__field {
      grid-area: field;
    }

    &__action {
      grid-area: button;
      margin-top: 0.5rem;
    }
  }
</style>
