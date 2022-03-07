<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="800"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-1" fab small v-bind="attrs" v-on="on">
          <v-icon> mdi-av-timer </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item-title> Alter einstellen </v-list-item-title>
          <v-list-item-content>
            <v-range-slider
              hint="Alter einstellen"
              min="0"
              max="100"
              v-model="ages"
            ></v-range-slider>
          </v-list-item-content>
        </v-list>
      </v-card>
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
export default class AgeRange extends Vue {
  menu = false;
  ages = [20, 70];
}
</script>