<template>
  <div>test</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'ListView'
})
export default class ListView extends Vue {
  darkMode: boolean = false;

  mounted() { }
}
</script>