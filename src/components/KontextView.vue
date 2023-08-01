<template>
  <div>
    <div class="token ma-2" v-for="(d, idx) in kontextData" :key="idx">
      {{ d.ortho }} / {{ d.sppos }} / {{ d.sigle }}
    </div>
  </div>
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

  mounted() {}
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
