<template>
  <div :class="{ tagGroup: true }">
    <v-row no-gutters>
      <v-btn
        elevation="0"
        tile
        :class="{ whiteText: textColor }"
        :color="color"
        @contextmenu="show"
        >{{ tagData.tagAbbrev }}</v-btn
      >
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item link>
            <v-list-item-title @click="deleteTags()"
              >Tag löschen</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-for="(tag, key) in tagSelection.tagGroup.children">
        <TagViewSelect
          :key="key + generation"
          :generation="generation + 1"
          :children="tag.children ? tag.children : []"
          :tagData="tag"
          :color="color"
          :tagSelection="tagSel(tag)"
          @bus="bus"
        />
      </template>
      <v-btn
        v-if="tagSelection.children.length > 0"
        icon
        tile
        dark
        :class="{ addTag: true, addButton: true }"
      >
        <v-icon dark @click="addChildTag()">mdi-plus</v-icon>
      </v-btn>
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
  x = 0;
  y = 0;

  @Prop() readonly children!: TagTree[];
  @Prop() readonly tagData!: SingleTag;
  @Prop() readonly generation!: number;
  @Prop() private tagSelection!: TagSelection;
  @Prop({ default: '#F00', type: String }) readonly color!: string;

  get tagSelectioAll() {
    return this.TM.tagSelection;
  }

  get textColor(): boolean {
    const hsl = convertHexToHsl(this.color);
    console.log(hsl);
    console.log(hsl[2] > 0.5);
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
    this.TM.setChildrenTag(this.tagSelection.children);
  }

  bus(val: number) {
    this.$emit('bus', val);
    this.$emit('deleteTag', val);
  }

  deleteTags() {
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
  .tagGroup {
    border: 1px solid black;
    padding: 0px 10px;
    border-radius: 10px;
  }
</style>