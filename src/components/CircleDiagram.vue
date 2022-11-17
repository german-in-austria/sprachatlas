<template>
  <div v-if="code.length > 0" v-html="code"></div>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'CircleDiagram'
})
export default class CircleDiagram extends Vue {
  @Prop(String) readonly code!: string;
}