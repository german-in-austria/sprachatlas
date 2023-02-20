<template>
  <div>
    <v-chip
      v-for="(val, idx) in selectedElements"
      :key="idx"
      class="ma-2"
      :close="edit"
      :color="color"
      text-color="white"
      @click:close="deleteItem(idx)"
    >
      <template v-if="val.state === 'nicht'">
        <v-icon left> mdi-code-not-equal </v-icon>
      </template>
      <template v-else-if="val.state === 'genau'">
        <v-icon left> mdi-equal-box </v-icon>
      </template>
      <template v-if="val.case === 'case-sensitive'">
        <v-icon left> mdi-case-sensitive-alt </v-icon>
      </template>
      <template v-else-if="val.case === 'case-insensitive'">
        <v-icon left> mdi-format-letter-case </v-icon>
      </template>
      <template v-else-if="val.case === 'Regexp'">
        <v-icon left> mdi-regex </v-icon>
      </template>
      {{ val.val }}
      <template v-if="val.sppos !== ''"> - {{ val.sppos }} </template>
    </v-chip>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component, PropSync } from 'vue-property-decorator';
import { selectionObject } from '@/api/dioe-public-api';

@Component({
  name: 'TokenChips',
  components: {}
})
export default class TokenChips extends Vue {
  @Prop() readonly selectedElements!: selectionObject[];
  @Prop({ type: String, default: '#FF0000' }) readonly color!: string;
  @Prop(Boolean) readonly edit!: boolean;

  value: selectionObject[] = [];

  created() {
    this.value = this.selectedElements;
  }

  deleteItem(idx: number) {
    const el = this.selectedElements.length === 1 ? [] as selectionObject[] : this.selectedElements.splice(idx, 1);
    this.$emit('update:selectedElements', el);
  }
}
</script>