<template>
  <span>
    <span v-for="(sig, i) in sigle" :key="i">
      <span
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
</style>
