<template>
  <div>
    <template v-if="!loading">
      <v-btn depressed color="primary" @click="addTag()">
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
      <template v-for="(group, gkey) in selectionTag">
        <v-chip-group column>
          <template v-for="(tag, tkey) in group.tagGroup">
            <v-menu top :close-on-content-click="true" :offset-y="true">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ tag.tagAbbrev }}
                  <v-icon
                    v-if="tkey == selectionTag[gkey].tagGroup.length - 1"
                    right
                    @click="addChildTag(group, gkey)"
                    >mdi-plus
                  </v-icon>
                </v-chip>
              </template>
              <v-list>
                <v-list-item link>
                  <v-list-item-title @click="deleteTags(gkey, tag)"
                    >Tag löschen</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-chip-group>
      </template>
    </template>
    <template v-else> Lade.... </template>
  </div>
</template>
<script lang = "ts">
import { Component, Vue } from "vue-property-decorator";
import { tagModule } from "@/store/modules/tags";
import { TagTree } from "@/api/dioe-public-api";
import { SingleTag, TagSelection } from "@/static/apiModels";

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: "TagView",
})
export default class TagView extends Vue {
  TM = tagModule;
  selTag: TagTree | null = null;
  selMode: boolean = false;
  itemTagList: TagTree[] | null = null;
  idx: number = -1;

  selectionTag: TagSelection[] = [];

  get tagList() {
    if (this.itemTagList === null || this.itemTagList === undefined) {
      return this.TM.tags;
    } else {
      return this.itemTagList;
    }
  }

  get loading() {
    return this.TM.loading;
  }

  beforeCreate() {
    if (tagModule.tagList == null) {
      tagModule.fetchTags();
    }
  }

  clear() {
    this.selectionTag = [];
  }

  addChildTag(tag: TagSelection, idx: number) {
    this.selMode = true;
    this.itemTagList = tag.children;
    this.idx = idx;
  }

  addTag() {
    this.selMode = true;
    this.itemTagList = null;
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
      if (
        this.selTag.parentIds &&
        this.selTag.parentIds.length > 0 &&
        this.idx > -1
      ) {
        const parentId =
          this.selTag.parentIds[this.selTag.parentIds.length - 1];
        const element = this.selectionTag[this.idx];
        let cT: SingleTag = {} as SingleTag;
        cT.tagId = this.selTag.tagId;
        cT.tagAbbrev = this.selTag.tagAbbrev;
        if (element) {
          element.tagGroup.push(cT);
          element.tagIds.push(cT.tagId);
          element.children = this.selTag.children;
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
        tS.children = this.selTag.children;
        this.selectionTag.push(tS);
      }

      this.$nextTick(() => {
        this.selTag = null;
        this.selMode = false;
        this.itemTagList = null;
        this.TM.setTagSelection(this.selectionTag);
      });
    }
  }
}
</script>