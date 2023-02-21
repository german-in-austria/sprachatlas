<template></template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';

import { legendMod } from '@/store/modules/legend';
import { SearchItems } from '@/static/apiModels';

@Component({
  components: {},
  name: 'QueryHistory'
})
export default class QueryHistory extends Vue {
}
</script>