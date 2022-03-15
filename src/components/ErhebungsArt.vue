<template>
  <div class="text-center"></div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';

@Component({
  name: 'ErhebungsArt',
  components: {}
})
export default class ErhebungsArt extends Vue {}
</script>