<template>
  <v-combobox
    v-model="data"
    :items="erhArten"
    :loading="erhLoading"
    chips
    clearable
    item-text="Bezeichnung"
    item-value="id"
    label="Erhebungsarten auswählen"
    multiple
    prepend-icon="mdi-filter-variant"
    solo
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        <strong>{{ item.Bezeichnung }}</strong
        >&nbsp;
        <span>(Erhebungsart)</span>
      </v-chip>
    </template>
  </v-combobox>
</template>
<script lang="ts">
import { erhebungModule } from '@/store/modules/erhebungen';
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ErhebungDropdown',
  components: {
  }
})
export default class ErhebungDropdown extends Vue {
  @Prop() readonly chips!: any[];
  data: any[] = [];
  get erhLoading() {
    return erhebungModule.erhLoading;
  }

  get erhArten() {
    return erhebungModule.erhebungsarten;
  }

  remove(item: any) {
    this.$emit('update:chips', [...this.data.splice(this.data.indexOf(item), 1)]);
    // this.$emit('update:chips', [...this.data]);
  }

  mounted() {
    this.data = this.chips;
  }

}
</script>