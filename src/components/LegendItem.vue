<template>
  <v-list class="transparent">
    <v-list-item v-for="(d, index) in data">
      <template :key="index + d.">
        <v-list-item-icon>
          <v-menu
            ref="menu"
            v-model="menu"
            transition="scale-transition"
            :close-on-content-click="false"
            :return-value.sync="color"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-avatar v-on="on">
                <icon-circle
                  width="50"
                  height="50"
                  radius="15"
                  fillCol="#F00"
                />
              </v-avatar>
            </template>
            <v-color-picker
              v-model="color"
              hide-canvas
              hide-inputs
              show-swatches
              class="mx-auto"
            ></v-color-picker>
          </v-menu>
        </v-list-item-icon>
        {{ searchTerm.content.tagName }}
      </template>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";

@Component({
  name: "LegendItem",
})
export default class LegendItem extends Vue {
  @Prop(String) readonly name!: string;
  @Prop(String) readonly color!: string;
  @Prop(Number) readonly size!: number;
}
</script>
