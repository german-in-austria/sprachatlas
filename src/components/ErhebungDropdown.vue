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
    @change="$emit('update:chips', data)"
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
import { Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'ErhebungDropdown',
  components: {
  }
})
export default class ErhebungDropdown extends Vue {
  @Prop() readonly chips!: any[];
  @Prop({ required: false, default: [] as number[] }) readonly startId!: number[];

  data: any[] = [];
  get erhLoading() {
    return erhebungModule.erhLoading;
  }

  get erhArten() {
    return erhebungModule.erhebungsarten;
  }

  remove(item: any) {
    this.data = [...this.data.splice(this.data.indexOf(item), 1)];
    this.$emit('update:chips', this.data);
    // this.$emit('update:chips', [...this.data]);
  }

  checkID() {
    if (this.startId.length > 0) {
      const selArten = this.erhArten.filter(el => this.startId.some(id => id === el.id));
      this.$emit('chips', selArten);
      this.data = selArten;
    } else {
      this.data = this.chips;
    }
  }

  @Watch("startId")
  onStartIdChange() {
    // this.checkID();
  }

  updated() {
    if (this.startId.length !== this.data.length) {
      console.log('checking1');
      // this.checkID();
    }
  }

  mounted() {
    this.checkID();
    if (!this.erhArten || this.erhArten.length === 0) {
      erhebungModule.fetchErhebungsArten();
    }
  }

}
</script>