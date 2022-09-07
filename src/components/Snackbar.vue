<template>
  <div>
    <v-snackbar
      v-for="(item, idx) of queue.filter((el) => el.show)"
      :key="idx"
      bottom
      right
      vertical
      :timeout="-1"
      time
      :color="latestLogColor"
      :value="item.show"
      :style="`bottom: ${idx * 150}px`"
    >
      <Message :msg="item.message" :icon="item.icon" :date="item.time" />
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';
import Message from '@/components/Message.vue';

@Component({
  components: { Message },
  name: 'Snackbar'
})
export default class Snackbar extends Vue {
  progressTime: number = 0;

  get queue() {
    return messageHandler.queue;
  }

  get latestLogColor() {
    if (!this.queue || this.queue.length < 1) {
      return 'info';
    }
    return this.queue[this.queue.length - 1].type;
  }

  get time() {
    return messageHandler.activation;
  }

  get showSnackbar() {
    return messageHandler.showSnack;
  }

  mounted() {
  }
}
</script>