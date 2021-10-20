<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height">
    <circle
      :cx="width / 2"
      :cy="height / 2"
      :r="radius"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :fill="fillCol"
    />
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "IconCircle",
})
export default class IconCircle extends Vue {
  @Prop([Number, String]) readonly radius: number | string | undefined;
  @Prop({ type: String, default: "black" }) readonly strokeColor!: string;
  @Prop({ type: [Number, String], default: 18 }) readonly width!:
    | number
    | string;
  @Prop({ type: [Number, String], default: 18 }) readonly height!:
    | number
    | string;
  @Prop({ type: Number, default: 1 }) readonly strokeWidth!: number;
  @Prop({ type: String, default: "black" }) readonly fillCol!: string;
}
</script>