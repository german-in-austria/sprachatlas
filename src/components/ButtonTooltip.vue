<template>
  <v-tooltip right v-if="show">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        small
        v-bind="attrs"
        v-on="on"
        :class="class"
        @click.stop="dialog = true"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span> {{ text }} </span>
  </v-tooltip>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'ButtonTooltip',
  components: {}
})
export default class ButtonTooltip extends Vue {
  @Prop({ type: String, required: true }) readonly text!: string;
  @Prop({ type: Boolean, default: false }) readonly show!: boolean;
  @Prop({ type: String, default: '' }) readonly class!: string;
  @Prop({ type: String, default: 'mdi-export' }) readonly icon!: string;
}

</script>