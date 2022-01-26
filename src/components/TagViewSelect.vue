<template>
  <v-row no-gutters>
    <v-btn elevation="0" tile color="light-green">{{
      tagData.tagAbbrev
    }}</v-btn>
    <v-btn
      v-if="children.length > 0"
      icon
      tile
      dark
      :class="{ addTag: true, addButton: true }"
    >
      <v-icon dark @click="addChildTag(group, gkey)">mdi-plus</v-icon>
    </v-btn>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { tagModule } from "@/store/modules/tags";
import { TagTree } from "@/api/dioe-public-api";
import { SingleTag, TagSelection } from "@/static/apiModels";

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: "TagViewSelect",
})
export default class TagViewSelect extends Vue {
  TM = tagModule;

  @Prop() readonly children!: TagTree[];
  @Prop() readonly tagData!: SingleTag;
  @Prop() readonly generation!: number;
}
</script>
<style scoped>
  .groupAdd {
    border-radius: 15px;
    margin-left: 5px;
  }

  .addTag {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .addButton {
    margin-right: 5px;
    background-color: grey;
  }
  .tagGroup {
    border: 1px solid black;
    padding: 0px 10px;
    border-radius: 10px;
  }
</style>