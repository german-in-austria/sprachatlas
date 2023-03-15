<template>
  <div style="margin-top: 200px">
    <v-tooltip :disabled="!disable" bottom>
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <template v-if="!loading">
            <v-autocomplete
              @change="updateTag()"
              :disabled="disable"
              v-if="editMode"
              v-show="selMode"
              v-model="selTag"
              :items="tagList"
              item-text="tagName"
              clearable
              :label="autoCompleteLabel"
              return-object
            ></v-autocomplete>
            <v-row no-gutters>
              <v-col
                v-for="(group, gkey) in selectedTags"
                md="auto"
                :key="gkey + group.parentId"
              >
                <TagViewSelect
                  :generation="0"
                  :children="group.children"
                  :tagData="group.tagGroup"
                  :tagSelection="group"
                  :color="color"
                  :editMode="editMode"
                  :topTag="true"
                  @deleteTag="onDelete"
                />
              </v-col>
              <v-col v-if="editMode">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :v-show="selectedTags.length > 0"
                      fab
                      dark
                      small
                      class="ml-5"
                      v-bind="attrs"
                      v-on="on"
                      :class="{ addTag: false, groupAdd: false }"
                    >
                      <v-icon dark @click="addTag()">mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span> Neuen Elterntag hinzufügen </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </template>
          <template v-else> Lade.... </template>
        </div>
      </template>
      <span>
        Suche nach Taggruppen ist nur ohne ausgewählten Lemma/Token möglich
      </span>
    </v-tooltip>
  </div>
</template>
<script lang = "ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { tagModule } from '@/store/modules/tags';
import { TagTree } from '@/api/dioe-public-api';
import { SingleTag, TagSelection } from '@/static/apiModels';
import TagViewSelect from '@/components/TagViewSelect.vue';

@Component({
  // if you use components add them here
  components: { TagViewSelect },
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'TagView'
})
export default class TagView extends Vue {
  @Prop({ default: '#F00', type: String }) readonly color!: string;
  @Prop({ default: false, type: Boolean }) readonly disable!: boolean;
  @Prop({ default: true, type: Boolean }) readonly editMode!: boolean;

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
    return this.tagList ? this.tagList.length > 0 : false;
  }

  get childrenTag() {
    return this.TM.childrenTag;
  }

  get selectedTags() {
    return this.TM.tagSelection;
  }

  get autoCompleteLabel() {
    return tagModule.autocompleteLabel;
  }

  set autoCompleteLabel(s: string) {
    this.TM.setAutoCompleteLabel(s);
  }

  onDelete(val: number) {
    // Steps
    // Find according child
    // Delete all child Ids from tagIDs
    // Delete the according child
    let parent = this.selectedTags.find((el) => el.tagIds.includes(val));

    if (this.selectedTags.find((el) => el.parentId === val)) {
      const tag = this.selectedTags;
      tag.splice(
        this.selectedTags.findIndex((el) => el.parentId === val),
        1
      );
      this.TM.setChildrenTag([]);
      return;
    }
    if (parent) {
      const elements = this.findChildParentElement(val, parent.tagGroup);
      if (elements) {
        let tagIDs = [elements.child.tagId];
        for (const c of elements.child.children) {
          tagIDs.push(c.tagId);
        }
        parent.tagIds = parent.tagIds.filter((el) => !tagIDs.includes(el));
        elements.parent.children = elements.parent.children.filter(
          (el) => el.tagId !== val
        );
      }

    }
  }

  beforeCreate() {
    if (tagModule.tagList.length === 0) {
      tagModule.fetchTags();
    }
  }

  clear() {
    this.selectionTag = [];
  }

  addTag() {
    this.autoCompleteLabel = 'Neuen Tag hinzufügen';
    this.TM.setChildrenTag(this.TM.tagList ? this.TM.tagList.filter((el) => el.tagGene === 0) : []);
  }

  findParentElement(parId: number, element: SingleTag): SingleTag | null {
    if (!element) {
      return null;
    }
    if (element.tagId === parId) {
      return element;
    }
    for (const c of element.children) {
      const parent = this.findParentElement(parId, c);
      if (parent) {
        return parent;
      }
    }
    return null;
  }

  findChildParentElement(parId: number, element: SingleTag) {
    if (!element) {
      return null;
    }
    for (const c of element.children) {
      const child: any = this.findParentElement(parId, c);
      if (child) {
        if (c.tagId === child.tagId) {
          return { parent: element, child: child };
        } else {
          return { parent: c, child: child };
        }
      }
    }
    return null;
  }

  updateTag() {
    if (this.selTag) {
      if (this.selTag.parentIds && this.selTag.parentIds.length > 0) {
        const parentIds = this.selTag.parentIds;
        // Find top element
        const element = this.selectedTags.find((el) => {
          if (
            parentIds.some((ele) => {
              return el.tagIds.includes(ele);
            })
          ) {
            return true;
          }
        });
        let cT: SingleTag = {} as SingleTag;
        cT.tagId = this.selTag.tagId;
        cT.tagAbbrev = this.selTag.tagAbbrev;
        cT.tagName = this.selTag.tagName ? this.selTag.tagName : "";
        cT.children = [];
        if (element) {
          let parent: SingleTag = {} as SingleTag;
          parentIds.forEach((id) => {
            const par = this.findParentElement(id, element.tagGroup);
            if (par) {
              parent = par;
              return;
            }
          });
          if (parent) {
            parent.children.push(cT);
            element.tagIds.push(cT.tagId);
          }
        }
      } else {
        const currTag = this.selTag;
        let cT: SingleTag = {} as SingleTag;
        cT.tagId = currTag.tagId;
        cT.tagAbbrev = currTag.tagAbbrev;
        cT.tagName = this.selTag.tagName ? this.selTag.tagName : "";
        cT.children = [];
        const tG: SingleTag = cT;
        const tS: TagSelection = {} as TagSelection;
        tS.tagIds = [cT.tagId];
        tS.tagGroup = tG;
        tS.tagName = cT.tagName;
        tS.parentId = cT.tagId;
        for (const t in this.selTag.children) {
          this.selTag.children[t].parentIds = [tS.parentId];
        }
        tS.children = this.selTag.children;
        this.selectionTag.push(tS);
      }

      this.$nextTick(() => {
        this.TM.setTagSelection(this.selectionTag);
        this.TM.setChildrenTag(this.selTag ? this.selTag.children : []);
        if (this.selTag) {
          this.autoCompleteLabel = `Kindtag für ${this.selTag.tagName} auswählen`;
        }
        this.selTag = null;

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