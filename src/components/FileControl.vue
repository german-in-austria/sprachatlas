<template></template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'FileControl'
})
export default class FileControl extends Vue {
  @PropSync("dataIdx") readonly dataIdx!: number;
}
</script>