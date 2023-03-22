<template>
  <div :id="id" class="box">
    <component
      :is="component"
      v-bind="props"
      v-on="func"
      v-on:moveCard="dragElement"
    />
  </div>
</template>
<script lang="ts">

import { generateID } from '@/helpers/helper';
import { Component, Vue, Prop } from 'vue-property-decorator';

/*
  Add component to list in case you want to use it
*/
import VariationCard from './VariationCard.vue';
import LegendItem from './LegendItem.vue';
import AudioCard from './AudioCard.vue';

@Component({
  components: { VariationCard, LegendItem, AudioCard },
  name: 'DragableCard'
})
export default class DragableCard extends Vue {
  id!: string;
  element!: HTMLElement;
  boundingBox: {
    left: number;
    top: number;
    rectX: number;
    rectY: number;
    height: number;
    width: number;
  } = {} as any;
  @Prop(String) readonly component!: string;
  @Prop() readonly props!: any;
  @Prop() readonly func!: any;


  moveListener(event: any) {
    const el = this.element;
    const rectX = event.clientX - this.boundingBox.rectX;
    const rectY = event.clientY - this.boundingBox.rectY;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    let topVal = event.clientY - rectY;
    let leftVal = event.clientX - rectX;
    if (rectX >= 0 && rectX + this.boundingBox.width <= vw) {
      el.style.left = `${(event.clientX - this.boundingBox.rectX)}px`;
    }

    if (rectY >= 50 && rectY + this.boundingBox.height <= vh) {
      el.style.top = `${(event.clientY - this.boundingBox.rectY)}px`;
    }
    el.style.cursor = 'grabbing';
    el.style.zIndex = '100';
    el.classList.add('elevation-22');

  }

  dragElement(e: any) {
    const element = this.element;
    const box = element.getBoundingClientRect();
    this.boundingBox.left = box.left;
    this.boundingBox.top = box.top;
    this.boundingBox.height = box.height;
    this.boundingBox.width = box.width;
    this.boundingBox.rectX = e.clientX - box.left;
    this.boundingBox.rectY = e.clientY - box.top;
    document.addEventListener('mousemove', this.moveListener, false);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.moveListener, false);
      element.classList.remove('elevation-22');
      //@ts-ignore
      element.style.cursor = null;
    }, { once: true });
  }

  resetPosition() {
    const element = this.element;
    //@ts-ignore
    element.style.left = null;
    //@ts-ignore
    element.style.top = null;
    element.classList.add('animation');
    element.addEventListener('transitionend', () => {
      element.classList.remove('animation');
    }, { once: true })
  }

  emitInterface() {
    this.$emit('interface', {
      reset: () => this.resetPosition()
    });
  }

  beforeCreate() {
    this.id = generateID();
  }

  mounted() {
    this.emitInterface();
    this.element = document.getElementById(this.id) as HTMLElement;
  }
}
</script>
<style lang="scss" scoped>
  .box {
    transition: box-shadow 0.3s ease-in-out;
  }

  .animation {
    transition: all 1s ease-in-out;
  }
</style>