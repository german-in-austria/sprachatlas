<template>
  <div>
    <v-btn icon :color="color" @click="$emit('hideCard', $event)">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn icon :color="color" @mousedown.left="$emit('moveCard', $event)">
      <v-icon>mdi-arrow-all</v-icon>
    </v-btn>
    <template v-if="showTrash">
      <v-btn icon color="red" @mousedown.left="$emit('removeElement', $event)">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
    <template v-if="showPin">
      <v-btn icon :color="color" @click="$emit('pinCard', $event)">
        <v-icon v-if="pinned">mdi-pin</v-icon>
        <v-icon v-else>mdi-pin-off</v-icon>
      </v-btn>
    </template>
  </div>
</template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'ActionButtons'
})
export default class DragableCard extends Vue {
  @Prop({
    type: String, default: 'indigo'
  }) readonly color!: string;
  @Prop({ type: Boolean, default: false }) readonly pinned!: boolean;
  @Prop({ type: Boolean, default: false }) readonly showPin!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showTrash!: boolean;
}
</script>