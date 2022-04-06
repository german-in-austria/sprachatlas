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
            <v-badge
              bordered
              bottom
              offset-x="18"
              offset-y="15"
              color="primary"
              :icon="`mdi-filter${filterByAge ? '' : '-off'}`"
              overlap
            >
              <v-btn
                class="mx-1"
                fab
                small
                elevation="1"
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <v-icon> mdi-av-timer </v-icon>
              </v-btn>
            </v-badge>
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
              <template v-if="!singleAge">
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
              </template>
              <template v-else>
                <v-slider
                  v-model="age"
                  hint="Alter (Jahre) einstellen"
                  min="0"
                  max="100"
                  :color="`${onlyLower ? 'red lighten-2' : 'primary'}`"
                  :track-color="`${onlyLower ? 'primary' : 'red lighten-2'}`"
                >
                  <template v-if="onlyLower" v-slot:prepend>
                    <v-text-field
                      :value="age"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 0, $event)"
                    ></v-text-field>
                  </template>
                  <template v-else v-slot:append>
                    <v-text-field
                      :value="age"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 1, $event)"
                    ></v-text-field>
                  </template>
                </v-slider>
              </template>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-5">
          <v-row class="pa-5">
            <v-switch flat v-model="singleAge" label="Grenzen"></v-switch>
            <v-switch
              flat
              v-if="singleAge"
              v-model="onlyLower"
              label="Untere/Obere"
            ></v-switch>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pa-5">
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
          </v-row>
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
  age = 20;
  ages = [20, 70];
  LM = legendMod;
  MM = messageHandler;
  singleAge = false;
  onlyLower = false;

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
    this.LM.setAgeRange({ lower: -1, upper: -1 });
    this.MM.setSuccessMsg({
      message: 'Filter wurde entfernt',
      icon: 'mdi-info'
    });
  }

  applyAge() {
    if (this.singleAge) {
      if (this.onlyLower) {
        this.LM.setAgeRange({ lower: this.age, upper: -1 });
      } else {
        this.LM.setAgeRange({ lower: -1, upper: this.age });
      }
      this.MM.setSuccessMsg({
        message: `Altersfilter wurde mit dem Wert ${this.age} hinzugefügt`,
        icon: 'mdi-info'
      });
    } else {
      const res = { lower: this.ages[0], upper: this.ages[1] };
      this.LM.setAgeRange(res);
      this.MM.setSuccessMsg({
        message: `Altersfilter wurde mit den Werten ${this.ages[0]} und ${this.ages[1]} hinzugefügt`,
        icon: 'mdi-info'
      });
    }
  }
}
</script>