<template></template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';


@Component({
  name: 'ExportMap',
  components: {}
})
export default class ExportMap extends Vue {
  get url() {
    return window.location.href;
  }
}
</script>