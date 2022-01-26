<template>
  <div>
    <template v-if="!loading">
      <v-btn
        v-if="selectionTag.length === 0"
        depressed
        color="primary"
        @click="addTag()"
      >
        Neue Taggruppe hinzufügen</v-btn
      >
      <v-autocomplete
        @change="updateTag()"
        v-if="selMode"
        v-model="selTag"
        :items="tagList"
        item-text="tagName"
        clearable
        label="Tags auswählen"
        return-object
      ></v-autocomplete>
      <v-row no-gutters>
        <template v-for="(group, gkey) in selectedTags">
          <TagViewSelect
            :generation="0"
            :children="group.children"
            :tagData="group.tagGroup[0]"
            :tagSelection="group"
          />

          <!--
              <v-menu top :close-on-content-click="true" :offset-y="true">
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  @click="showContext"
                >
                  {{ tag.tagAbbrev }}
                  <v-icon
                    v-if="tkey == selectionTag[gkey].tagGroup.length - 1"
                    right
                    @click="addChildTag(group, gkey)"
                    >mdi-plus
                  </v-icon>
                </v-chip>
                <v-list>
                  <v-list-item link>
                    <v-list-item-title @click="deleteTags(gkey, tag)"
                      >Tag löschen</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>-->
        </template>
        <v-btn
          v-if="selectionTag.length > 0"
          icon
          tile
          dark
          :class="{ addTag: true, groupAdd: true }"
        >
          <v-icon dark @click="addTag()">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </template>
    <template v-else> Lade.... </template>
  </div>
</template>
<script lang = "ts">
import { Component, Vue } from "vue-property-decorator";
import { tagModule } from "@/store/modules/tags";
import { TagTree } from "@/api/dioe-public-api";
import { SingleTag, TagSelection } from "@/static/apiModels";
import TagViewSelect from "@/components/TagViewSelect.vue";

@Component({
  // if you use components add them here
  components: { TagViewSelect },
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: "TagView",
})
export default class TagView extends Vue {
  TM = tagModule;
  selTag: TagTree | null = null;
  idx: number = -1;

  selectionTag: TagSelection[] = [];

  get tagList() {
    if (this.childrenTag.length > 0) {
      return this.childrenTag;
    } else {
      return this.TM.tagList;
    }
  }

  get loading() {
    return this.TM.loading;
  }

  get selMode() {
    return this.TM.childrenTag.length > 0;
  }

  get childrenTag() {
    return this.TM.childrenTag;
  }

  get selectedTags() {
    return this.TM.tagSelection;
  }

  beforeCreate() {
    if (tagModule.tagList == null) {
      tagModule.fetchTags();
    }
  }

  clear() {
    this.selectionTag = [];
  }

  addTag() {
    this.TM.setChildrenTag(this.TM.tagList ? this.TM.tagList : []);
  }

  deleteTags(idx: number, tag: SingleTag) {
    const element = this.selectionTag[idx];
    if (element) {
      const idx = element.tagGroup.indexOf(tag, 0);
      if (idx > -1) element.tagGroup.splice(idx);
    }

    if (tag.tagId === element.parentId) {
      this.selectionTag.splice(idx, 1);
    }
  }

  updateTag() {
    if (this.selTag) {
      if (this.selTag.parentIds && this.selTag.parentIds.length > 0) {
        const parentId = this.selTag.parentIds[0];
        const element = this.selectionTag.find(
          (el) => el.parentId === parentId
        );
        let cT: SingleTag = {} as SingleTag;
        cT.tagId = this.selTag.tagId;
        cT.tagAbbrev = this.selTag.tagAbbrev;
        if (element) {
          element.tagGroup.push(cT);
          element.tagIds.push(cT.tagId);
        }
      } else {
        const currTag = this.selTag;
        let cT: SingleTag = {} as SingleTag;
        cT.tagId = currTag.tagId;
        cT.tagAbbrev = currTag.tagAbbrev;

        const tG: SingleTag[] = [cT];
        const tS: TagSelection = {} as TagSelection;
        tS.tagIds = [cT.tagId];
        tS.tagGroup = tG;
        tS.parentId = cT.tagId;
        for (const t in this.selTag.children) {
          this.selTag.children[t].parentIds = [tS.parentId];
        }
        tS.children = this.selTag.children;
        this.selectionTag.push(tS);
      }

      this.$nextTick(() => {
        this.selTag = null;
        this.TM.setTagSelection(this.selectionTag);
        this.TM.setChildrenTag([]);
      });
    }
  }
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