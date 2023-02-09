<template>
  <Transition name="modal">
    <div
      v-if="isShown"
      class="base-modal"
    >
      <div
        class="base-modal__dialog dialog"
        :style="{
          width: `${width}px`,
        }"
      >
        <div class="dialog__header header">
          <slot name="header">
            <slot name="title">
              <div class="header__title">
                {{ title }}
              </div>
            </slot>
            <button
              class="header__action button"
              @click="onCancel"
            >
              <svg
                width="24"
                height="24"
              >
                <use xlink:href="../assets/sprite.svg#cross"></use>
              </svg>
            </button>
          </slot>
        </div>
        <div class="dialog__body">
          <slot name="main" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';

  export default defineComponent({
    name: 'BaseModal',
    props: {
      title: {
        type: String,
        default: 'title',
      },
      isShown: {
        type: Boolean,
        default: true,
      },
      width: {
        type: Number,
        default: 618,
      },
    },
    emits: ['cancel', 'submit', 'update:isShown'],
    setup(props, {emit}) {
      const onCancel = () => {
        emit('cancel');
        emit('update:isShown', false);
      };
      const onSubmit = () => {
        emit('submit');
      };
      return {
        onCancel,
        onSubmit,
      };
    },
  });
</script>

<style lang="scss" scoped>
  @use '../styles/main';
  @use '../styles/utils/variables';
  @use '../styles/utils/mixins';

  .base-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(variables.$color-blue-harder, 0.21);
    transition: all 0.3s ease;
  }

  .dialog {
    position: relative;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    max-height: calc(100vh - 7.5rem);
    padding: 2.75rem;
    gap: 2rem;
    border-radius: 1.25rem;
    box-shadow: 0 0.125rem 0.5rem rgba(variables.$color-black-hard, 0.33);
    background: variables.$color-white-light;
    transition: all 0.3s ease;

    &__body {
      @include mixins.text-md-semi-bold;
    }
  }

  .header {
    display: grid;
    justify-content: center;
    @include mixins.text-h2-bold;

    &__title {
      text-align: center;
    }

    &__action {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }
  }
</style>
