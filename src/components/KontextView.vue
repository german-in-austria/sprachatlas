<template>
  <span>
    <span v-for="(sig, i) in sigle" :key="i">
      <span
        :class="{
          'mb-2': true,
          'mr-2': true,
          focustoken: focusTag === d.reihung && focusOrtho === d.ortho,
          token: focusTag !== d.reihung
        }"
        class="token mb-2 mr-2"
        v-for="(d, idx) in kontextData.filter((el) => el.sigle === sig)"
        :key="idx"
      >
        {{ d.ortho }} / {{ d.sppos }} / {{ d.sigle }}
      </span>
      <br />
    </span>
  </span>
</template>
<script lang="ts">
import { AntwortKontext } from '@/api/dioe-public-api';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'KontextView'
})
export default class KontextView extends Vue {
  @Prop() readonly kontextData!: AntwortKontext[];
  @Prop(Number) readonly focusTag!: number;
  @Prop(String) readonly focusOrtho!: string;
  sigle = null as any;

  mounted() {
    this.sigle = new Set(this.kontextData.map((el) => el.sigle));
  }
}
</script>
<style lang="scss">
.token {
  background-color: #eee;
  border: 1px solid black;
  border-radius: 5px;
}

.token:hover {
  background-color: lightblue;
  border: 1px solid purple;
}

.focustoken {
  background-color: #999;
  border: 1px solid black;
  border-radius: 5px;
}
</style>
