<template>
  <div>
    <div style="margin-top: 100px" v-html="createIcon(desc, 0, false)"></div>
    <v-list class="transparent">
      <v-list-item v-for="(d, idx) in desc" :key="idx">
        <v-list-item-content class="mx-auto">
          <v-avatar>
            <icon-circle :fillCol="d.color" :strokeWidth="1" />
          </v-avatar>
          {{ d.name }} - {{ d.value }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div id="text" style="display: none"></div>
  </div>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  computePropCircle,
  drawCircleDiagram,
  drawRect,
  drawTriangle,
  drawCircle
} from '@/helpers/MapCompute';
import { Symbols } from '@/static/apiModels';
import CircleDiagram from './CircleDiagram.vue';
import IconCircle from '@/icons/IconCircle.vue';

export interface Description {
  color: string;
  name: string;
  value: number;
}

@Component({
  components: { CircleDiagram, IconCircle },
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  /*
  @Prop({
    type: Array, required: false, default: [{
      color: '#F00',
      name: 'I1',
      value: 20
    },
    {
      color: '#0F0',
      name: 'I2',
      value: 60
    }]
  }) readonly desc!: Array<Description>;
    */
  desc: Array<Description> = [{
    color: '#F00',
    name: 'I1',
    value: 20
  },
  {
    color: '#0F0',
    name: 'I2',
    value: 60
  }];
  icon: Symbols = Symbols.Circle;

  drawCircleDiagram(
    size: number,
    border: number,
    borderColor: string,
    color: string,
    data: any,
    encoded: boolean
  ) {
    return drawCircleDiagram(size, border, borderColor, color, data, encoded, 1.2);
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
    icon: Symbols,
    encode: boolean
  ) {

    switch (icon) {
      default:
      case Symbols.Circle:
        return this.createCircleIcon(data.map((el) => { return { v: el.value, c: el.color, id: el.name } }), encode);
      /*  
      case Symbols.Rect:
        return this.createRectIcon(data);
      case Symbols.Tri:
        return this.createTriIcon(data);
      */
    }
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
          const element = this.desc.find(el => el.name === id);
          if (element) {
            el.textContent = `Name: ${element.name} - Anzahl: ${element.value.toString()}`;
          }
        }
        // console.log(document.elementFromPoint(event.clientX, event.clientY)?.id)
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
    position: absolute;
    background-color: white;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid black;
  }
</style>