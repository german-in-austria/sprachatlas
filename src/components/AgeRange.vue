<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="500"
      offset-y
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="mx-1"
              fab
              small
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon> mdi-av-timer </v-icon>
            </v-btn>
          </template>
          <span>Altersgrenzen in Jahren einstellen</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <h3>Alter in Jahren einstellen</h3>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-divider></v-divider>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-range-slider
                hint="Alter (Jahre) einstellen"
                min="0"
                max="100"
                v-model="ages"
                ><template v-slot:prepend>
                  <v-text-field
                    :value="ages[0]"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                    @change="$set(range, 0, $event)"
                  ></v-text-field>
                </template>
                <template v-slot:append>
                  <v-text-field
                    :value="ages[1]"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                    @change="$set(range, 1, $event)"
                  ></v-text-field>
                </template>
              </v-range-slider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-5">
          <v-btn class="mr-10" fab small color="error"
            ><v-icon>mdi-arrow-u-left-top</v-icon></v-btn
          >
          <v-btn fab small color="success"
            ><v-icon>mdi-filter-outline</v-icon></v-btn
          >
        </v-card-actions>
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