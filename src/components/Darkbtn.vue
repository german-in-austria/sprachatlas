<template>
  <v-switch
    append-icon="mdi-theme-light-dark"
    v-model="darkMode"
    color="primary"
    @change="changeMode()"
  ></v-switch>
</template>
<script lang="ts">
import { expData } from '@/service/ExportBase';
import { legendMod } from '@/store/modules/legend';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'Darkbtn'
})
export default class Navigation extends Vue {
  darkMode: boolean = false;

  get isDarkMode() {
    return this.$vuetify.theme.dark;
  }

  get swColor() {
    return this.isDarkMode ? 'primary' : 'indigo';
  }

  changeMode() {
    this.$vuetify.theme.dark = this.darkMode;
    expData.setDarkModeItem(this.darkMode);
  }

  created() {
    this.darkMode = expData.hasDarkModeSet();
    this.$vuetify.theme.dark = this.darkMode;
  }

  mounted() { }
}
</script>