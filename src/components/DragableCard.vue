<template>
  <div :id="id" class="box" :class="{ bottomBarTransition: transform }">
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
  transform: boolean = true;
  CALC_MASK = 10;
  resize_height = false;
  resize_width = false;
  resize_state = false;
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
    this.transform = false;
    const el = this.element;
    const rectX = event.clientX - this.boundingBox.rectX;
    const rectY = event.clientY - this.boundingBox.rectY;
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    let topVal = event.clientY - rectY;
    let leftVal = event.clientX - rectX;
    if (rectX >= 0 && rectX + this.boundingBox.width <= vw) {
      el.style.left = `${event.clientX - this.boundingBox.rectX}px`;
    }

    if (rectY >= 50 && rectY + this.boundingBox.height <= vh) {
      el.style.top = `${event.clientY - this.boundingBox.rectY}px`;
    }
    el.style.cursor = 'grabbing';
    el.style.zIndex = '100';
    el.classList.add('elevation-22');
  }

  getBoundingBoxCoords(element: HTMLElement) {
    const box = element.getBoundingClientRect();
    return {
      top: box.top,
      left: box.left,
      bottom: box.bottom,
      right: box.bottom,
      width: box.width
    };
  }

  detectIfResizable(event: any) {
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const box = this.element;
    const bounding = this.getBoundingBoxCoords(box);
    if (
      (bounding.top - this.CALC_MASK <= cursorY &&
        cursorY <= bounding.top + this.CALC_MASK) ||
      (bounding.bottom - this.CALC_MASK <= cursorY &&
        cursorY <= bounding.bottom + this.CALC_MASK)
    ) {
      box.style.cursor = 'ns-resize';
      this.resize_height = true;
    } else if (
      (bounding.left - this.CALC_MASK <= cursorX &&
        cursorX <= bounding.left + this.CALC_MASK) ||
      (bounding.right - this.CALC_MASK <= cursorX &&
        cursorX <= bounding.right + this.CALC_MASK)
    ) {
      box.style.cursor = 'ew-resize';
      this.resize_width = true;
      if (this.resize_state) {
        console.log('resizing');
        box.style.width = cursorX - bounding.left + bounding.width + 'px';
        box.style.left = cursorX + 'px';
      }
    } else {
      if (!this.resize_state) {
        //@ts-ignore
        box.style.cursor = null;
        this.resize_height = this.resize_width = false;
      }
    }
  }

  resizeWindow(event: any) {
    const box = this.element;
    const bounding = box.getBoundingClientRect();
    const cursorX = event.clientX - bounding.left;
    const cursorY = event.clientY - bounding.top;
    const h = bounding.height;
    const w = bounding.width;
    if (this.resize_width) {
      this.resize_state = true;
      // box.style.width = cursorX + 'px';
    }
  }

  stopResizeWindow(event: any) {
    this.resize_state = false;
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
    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', this.moveListener, false);
        element.classList.remove('elevation-22');
        //@ts-ignore
        element.style.cursor = null;
        this.transform = true;
      },
      { once: true }
    );
  }

  resetPosition() {
    const element = this.element;
    //@ts-ignore
    element.style.left = null;
    //@ts-ignore
    element.style.top = null;
    element.classList.add('animation');
    element.addEventListener(
      'transitionend',
      () => {
        element.classList.remove('animation');
      },
      { once: true }
    );
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
    document.documentElement.addEventListener(
      'mousemove',
      this.detectIfResizable,
      true
    );

    document.documentElement.addEventListener(
      'mousedown',
      this.resizeWindow,
      true
    );

    document.documentElement.addEventListener(
      'mouseup',
      this.stopResizeWindow,
      true
    );
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

.bottomBarTransition {
  transition: transform 0.2s ease-in-out;
}
</style>
