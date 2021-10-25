<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Vue, Prop } from "vue-property-decorator";

@Component({
  name: "IconBase",
})
export default class IconBase extends Vue {
  @Prop({ default: "box" }) readonly iconName!: string;
  @Prop({ type: [Number, String], default: 18 }) readonly width!:
    | number
    | string;
  @Prop({ type: [Number, String], default: 18 }) readonly height!:
    | number
    | string;
  @Prop({ default: "currentColor" }) readonly iconColor!: string;
}
</script>