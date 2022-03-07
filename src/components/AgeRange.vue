<template>
  <div>
    <v-menu :close-on-content-click="false" :nudge-width="800" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-1" fab small v-bind="attrs" v-on="on">
          <v-icon> mdi-av-timer </v-icon>
        </v-btn>
      </template>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'AgeRange',
  components: {}
})
export default class AgeRange extends Vue {}
</script>