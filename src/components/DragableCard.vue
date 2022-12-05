<template>
  <div :id="id" class="box" @mousedown.left="dragElement($event)">
    <component :is="component" v-bind="props" />
  </div>
</template>
<script lang="ts">
/*
  Add component to list in case you want to use it
*/
import { generateID } from '@/helpers/helper';
import { Component, Vue, Prop } from 'vue-property-decorator';
import VariationCard from './VariationCard.vue';
import LegendItem from './LegendItem.vue';

@Component({
  components: { VariationCard, LegendItem },
  name: 'DragableCard'
})
export default class DragableCard extends Vue {
  @Prop({ type: String, default: generateID() }) readonly id!: string;
  @Prop(String) readonly component!: string;
  @Prop() readonly props!: any;

  moveListener(event: any) {
    const el = document.getElementById(this.id) as HTMLElement;
    const rectX = event.currentTarget.rectX;
    const rectY = event.currentTarget.rectY;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    let topVal = event.clientY - rectY;
    let leftVal = event.clientX - rectX;
    if (leftVal >= 0 && leftVal + event.currentTarget.size.width <= vw) {
      el.style.left = `${(event.clientX - rectX)}px`;
    }

    if (topVal >= 50 && topVal + event.currentTarget.size.height <= vh) {
      el.style.top = `${(event.clientY - rectY)}px`;
    }
    el.style.cursor = 'grabbing';
    el.style.zIndex = '100';
    el.classList.add('elevation-22');

  }

  dragElement(e: any) {
    const element = document.getElementById(this.id) as HTMLElement;
    element.addEventListener('mousemove', this.moveListener);
    const boundingBox = element.getBoundingClientRect();
    //@ts-ignore
    element.rectX = e.clientX - boundingBox.left;
    //@ts-ignore
    element.rectY = e.clientY - boundingBox.top;
    //@ts-ignore
    element.size = { height: boundingBox.height, width: boundingBox.width };
    document.addEventListener('mouseup', () => {
      element.removeEventListener('mousemove', this.moveListener, false);
      element.classList.remove('elevation-22');
      element.style.cursor = "default";
      /**/
      element.style.left = "";
      element.style.top = "";
      element.classList.add('animation');
      element.addEventListener('transitionend', () => {
        element.classList.remove('animation');
      }, { once: true })
    }, { once: true });
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