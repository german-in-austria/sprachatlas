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
  resize_left = false;
  resize_right = false;
  resize_top = false;
  resize_bottom = false;

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
  @Prop({ type: Number, default: 300 }) readonly minWidth!: number;
  @Prop({ type: Number, default: 100 }) readonly minHeight!: number;

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
      width: box.width,
      height: box.height
    };
  }

  detectIfResizable(event: any) {
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const box = this.element;
    const bounding = this.getBoundingBoxCoords(box);

    const top =
      bounding.top - this.CALC_MASK <= cursorY &&
      cursorY <= bounding.top + this.CALC_MASK;
    const bottom =
      bounding.bottom - this.CALC_MASK <= cursorY &&
      cursorY <= bounding.bottom + this.CALC_MASK;
    const left =
      bounding.left - this.CALC_MASK <= cursorX &&
      cursorX <= bounding.left + this.CALC_MASK;
    const right =
      bounding.left + bounding.width - this.CALC_MASK <= cursorX &&
      cursorX <= bounding.left + bounding.width + this.CALC_MASK;
    if (top) {
      box.style.cursor = 'ns-resize';
      this.resize_height = true;
      this.resize_top = true;
    } else if (bottom) {
      box.style.cursor = 'ns-resize';
      this.resize_height = true;
      this.resize_bottom = true;
    } else if (left) {
      if (this.resize_top) {
        box.style.cursor = 'nw-resize';
      } else if (this.resize_bottom) {
        box.style.cursor = 'sw-resize';
      } else {
        box.style.cursor = 'ew-resize';
        this.resize_width = true;
        this.resize_left = true;
      }
    } else if (right) {
      box.style.cursor = 'ew-resize';
      this.resize_width = true;
      this.resize_right = true;
    } else if (top && left) {
      box.style.cursor = 'nw-resize';
    } else if (!this.resize_state) {
      //@ts-ignore
      box.style.cursor = null;
      this.resize_height = this.resize_width = false;
      this.resize_left =
        this.resize_right =
        this.resize_bottom =
        this.resize_top =
          false;
    }

    if (this.resize_state) {
      console.log('resizing');
      // resize height of window based on cursor and bounding box
      if (this.resize_top) {
        const size = bounding.top - cursorY;
        const newHeight = bounding.height + size;
        if (newHeight < this.minHeight) return;
        box.style.height = newHeight + 'px';
        box.style.top = bounding.top - size + 'px'; // keep the top position the same
      } else if (this.resize_bottom) {
        console.log('resizing bottom');
        const newHeight =
          bounding.height + cursorY - (bounding.top + bounding.height);
        console.log(newHeight, this.minHeight);
        if (newHeight >= this.minHeight) box.style.height = newHeight + 'px';
      }

      // resize window width based on cursor and bounding box
      if (this.resize_left) {
        const size = bounding.left - cursorX;
        const newWidth = bounding.width + size;
        if (newWidth < this.minWidth) return;
        box.style.width = newWidth + 'px';
        box.style.left = bounding.left - size + 'px'; // keep the left position the same
      } else if (this.resize_right) {
        const newWidth =
          bounding.width + cursorX - (bounding.left + bounding.width);
        if (newWidth >= this.minWidth) box.style.width = newWidth + 'px';
      }
    }
  }

  // This function is called when the user wants to resize the card
  // This is done by changing the width and height of the card
  // The width and height are changed as well as the left and top position to keep the card in the same position
  // The left and top position are changed to keep the card in the same position
  resizeWindow(event: any) {
    const box = this.element;
    const bounding = box.getBoundingClientRect();
    const cursorX = event.clientX - bounding.left;
    const cursorY = event.clientY - bounding.top;
    const h = bounding.height;
    const w = bounding.width;
    if (this.resize_height || this.resize_width) {
      this.resize_state = true;
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
