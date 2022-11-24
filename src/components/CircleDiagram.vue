<template>
  <div v-if="diagramData">
    <div
      v-if="diagramData.length > 0"
      v-html="createIcon(diagramData, false)"
    ></div>
    <div id="text" style="display: none"></div>
  </div>
</template>
<script lang="ts">
import { drawCircleDiagram } from '@/helpers/MapCompute';
import { Description } from '@/static/apiModels';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'CircleDiagram'
})
export default class CircleDiagram extends Vue {
  @Prop({ type: Array, default: [] }) readonly data!: Array<Description>;

  get diagramData() {
    return this.data ? this.data : [] as Array<Description>;
  }

  drawCircleDiagram(
    size: number,
    border: number,
    borderColor: string,
    color: string,
    data: any,
    encoded: boolean
  ) {
    return drawCircleDiagram(size, border, borderColor, color, data, encoded, 1.2, false);
  }

  createCircleIcon(val: { v: number; c: string, id: string }[], encode: boolean) {
    return this.drawCircleDiagram(
      200,
      1,
      '#000',
      '#000',
      val,
      encode
    );
  }

  createIcon(
    data: Array<Description>,
    encode: boolean
  ) {
    return this.createCircleIcon(data.map((el) => { return { v: el.value, c: el.color, id: el.name } }), encode);
  }

  mounted() {
    //@ts-ignore
    document.getElementById('graph').addEventListener('mousemove', (event: any) => {
      const el = document.getElementById('text');
      if (el) {
        el.style.display = "inline";
        el.style.top = (event.clientY + 20) + "px";
        el.style.left = (event.clientX + 20) + "px";
        const id = document.elementFromPoint(event.clientX, event.clientY)?.id;
        if (id) {
          const element = this.data.find(el => el.name === id);
          if (element) {
            el.textContent = `Name: ${element.name} - Anzahl: ${element.value.toString()}`;
            console.log(el.textContent);
          }
        }
      }
    });

    document.getElementById('graph')?.addEventListener('mouseleave', (e) => {
      const el = document.getElementById('text');
      if (el) {
        el.style.display = "None";
      }
    });
  }
}
</script>
<style lang="scss">
  .hover {
    transition: 0.5s ease-in-out;
    transform-origin: 50% 50%;
    cursor: pointer;
  }

  .hover:hover {
    transform: scaleY(1.1) scaleX(1.1);
  }

  .hover p:hover {
    cursor: pointer;
  }

  #text {
    position: fixed;
    background-color: white;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid black;
  }
</style>