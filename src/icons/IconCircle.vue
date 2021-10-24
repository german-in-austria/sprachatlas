<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewbox="'0 0 ' + width + ' ' + height"
  >
    <circle
      cx="50%"
      cy="50%"
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
  @Prop({ type: [Number, String], default: 0 }) readonly radius:
    | number
    | string
    | undefined;
  @Prop({ type: String, default: "black" }) readonly strokeColor!: string;
  @Prop({ type: Number, default: 1 }) readonly strokeWidth!: number;
  @Prop({ type: String, default: "black" }) readonly fillCol!: string;
  height: number = 0;
  width: number = 0;

  beforeCreate() {
    this.width = (Number(this.radius) + this.strokeWidth) * 2;
    this.height = this.width;
  }
}
</script>