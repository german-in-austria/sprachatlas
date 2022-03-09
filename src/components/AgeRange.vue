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
          <v-btn
            class="mr-10"
            fab
            small
            color="primary"
            @click="changeFilter()"
          >
            <template v-if="filterByAge">
              <v-icon>mdi-filter</v-icon>
            </template>
            <template v-else>
              <v-icon>mdi-filter-off</v-icon>
            </template>
          </v-btn>
          <v-btn class="mr-10" fab small color="error" @click="removeAge()"
            ><v-icon>mdi-arrow-u-left-top</v-icon></v-btn
          >
          <v-btn fab small color="success" @click="applyAge()"
            ><v-icon>mdi-check</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';

@Component({
  name: 'AgeRange',
  components: {}
})
export default class AgeRange extends Vue {
  menu = false;
  ages = [20, 70];
  LM = legendMod;
  MM = messageHandler;

  get filterByAge() {
    return this.LM.filterByAge;
  }

  changeFilter() {
    this.LM.setFilterByAge(!this.filterByAge);
    if (this.filterByAge) {
      this.MM.setSuccessMsg({
        message: 'Daten werden nach Alter gefiltert',
        icon: 'mdi-info'
      });
    } else {
      this.MM.setSuccessMsg({
        message: 'Daten werden nicht nach Alter gefiltert',
        icon: 'mdi-info'
      });
    }
  }

  removeAge() {
    this.LM.setAgeRange(-1, -1);
    this.MM.setSuccessMsg({
      message: 'Filter wurde entfernt',
      icon: 'mdi-info'
    });
  }

  applyAge() {
    this.LM.setAgeRange(this.ages[0], this.ages[1]);
    this.MM.setSuccessMsg({
      message: `Altersfilter wurde mit den Werten ${this.ages[0]} und ${this.ages[1]} hinzugefügt`,
      icon: 'mdi-info'
    });
  }
}
</script>