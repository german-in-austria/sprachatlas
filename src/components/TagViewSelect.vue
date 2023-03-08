<template>
  <div :class="{ tagGroup: true, childGroup: !topTag }">
    <v-row no-gutters style="width: fit-content">
      <v-tooltip v-model="hover" bottom :color="color">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="0"
            v-bind="attrs"
            v-on="on"
            tile
            :class="{ whiteText: textColor }"
            :color="color"
            @contextmenu="show"
            >{{ tagData.tagAbbrev }}
          </v-btn>
        </template>
        <v-expand-transition>
          <div>{{ tagData.tagName }}</div>
        </v-expand-transition>
      </v-tooltip>
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
        v-if="editMode"
      >
        <v-list>
          <v-list-item link>
            <v-list-item-title @click="deleteTags()"
              >Tag löschen</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
      <TagViewSelect
        v-for="(tag, key) in tagSelection.tagGroup.children"
        :key="key + generation"
        :generation="generation + 1"
        :children="tag.children ? tag.children : []"
        :tagData="tag"
        :color="color"
        :tagSelection="tagSel(tag)"
        :editMode="editMode"
        @bus="bus"
      />
      <v-tooltip v-if="editMode" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="tagSelection.children.length > 0"
            icon
            tile
            dark
            v-bind="attrs"
            v-on="on"
            :class="{ addTag: true, addButton: true }"
          >
            <v-icon dark @click="addChildTag()">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span> Neuen Kindtag zu {{ tagData.tagAbbrev }} hinzufügen </span>
      </v-tooltip>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { tagModule } from '@/store/modules/tags';
import { TagTree } from '@/api/dioe-public-api';
import { SingleTag, TagSelection } from '@/static/apiModels';
import { convertHexToHsl } from '@/helpers/helper';

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'TagViewSelect'
})
export default class TagViewSelect extends Vue {
  TM = tagModule;
  showMenu: boolean = false;
  hover: boolean = false;
  x = 0;
  y = 0;

  @Prop() readonly children!: TagTree[];
  @Prop() readonly tagData!: SingleTag;
  @Prop() readonly generation!: number;
  @Prop() readonly tagSelection!: TagSelection;
  @Prop({ default: '#F00', type: String }) readonly color!: string;
  @Prop({ default: true, type: Boolean }) readonly editMode!: boolean;
  @Prop({ default: false, type: Boolean }) readonly topTag!: boolean;


  get tagSelectioAll() {
    return this.TM.tagSelection;
  }

  get textColor(): boolean {
    const hsl = convertHexToHsl(this.color);
    return hsl[2] < 0.4;
  }

  tagSel(tag: SingleTag) {
    return {
      parentId: this.tagSelection.parentId,
      children: this.fetchChildren(tag.tagId),
      tagGroup: tag,
      tagIds: this.tagSelection.tagIds
    } as TagSelection;
  }

  fetchChildren(id: number) {
    if (this.tagSelection) {
      return this.tagSelection.children.find((el) => el.tagId === id)?.children;
    } else {
      return this.children.find((el) => el.tagId === id)?.children;
    }
  }

  addChildTag() {
    let name = this.tagSelection.tagName;
    if (!this.tagSelection.tagName) {
      name = this.tagSelection.tagGroup.tagName;
    }
    this.TM.setAutoCompleteLabel(`Kindtag für ${name} hinzufügen`);
    this.TM.setChildrenTag(this.tagSelection.children);
  }

  bus(val: number) {
    this.$emit('bus', val);
    this.$emit('deleteTag', val);
  }

  deleteTags() {
    this.TM.setAutoCompleteLabel(`Neuen Tag hinzufügen`);
    // this.TM.deleteTag(this.tagData.tagId);
    this.$emit('bus', this.tagData.tagId);
    this.$emit('deleteTag', this.tagData.tagId);
  }

  show(e: any) {
    e.preventDefault();
    this.showMenu = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.$nextTick(() => {
      this.showMenu = true;
    });
  }
}
</script>
<style scoped>
  .whiteText {
    color: white;
  }

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

  .childGroup {
    border-top-width: 0px !important;
    border-bottom-width: 0px !important;
  }
  .tagGroup {
    border: 1px solid black;
    padding: 0px 10px;
    border-radius: 10px;
    width: fit-content;
  }
</style>