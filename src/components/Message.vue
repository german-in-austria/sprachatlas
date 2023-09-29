<template>
  <div>
    <div>
      <h3>
        <v-row justify="center">
          <v-col cols="1">
            <v-icon>{{ icon }}</v-icon>
          </v-col>
          <v-col cols="9">
            {{ msg }}
          </v-col>
          <v-col cols="2">
            <v-btn icon small @click="closeMsg()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </h3>
      <template v-if="date">
        <v-subheader>{{ new Date(date).toLocaleString() }}</v-subheader>
      </template>
    </div>
    <v-progress-linear
      v-model="progressTime"
      absolute
      bottom
      stream
      color="deep-purple accent-4"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';
import { SNACK_BAR_TIMEOUT } from '@/constants/index';

@Component({
  components: {},
  name: 'Message'
})
export default class Message extends Vue {
  @Prop({ type: String, default: 'mdi-information-outline' })
  readonly icon!: string;
  @Prop(String) readonly msg!: string;
  @Prop({ type: Number, default: null }) readonly date!: number | null;

  progressTime: number = 0;

  closeMsg() {
    messageHandler.setSingleShow({ shw: false, id: this.date ? this.date : 0 });
  }

  created() {
    if (this.date && Date.now() - this.date < SNACK_BAR_TIMEOUT) {
      const intvId = setInterval(() => {
        if (this.date) {
          const intv = Date.now() - this.date;
          if (intv >= SNACK_BAR_TIMEOUT) {
            console.log('Closing');
            this.closeMsg();
            clearInterval(intvId);
          }
          this.progressTime = 100 * (intv / SNACK_BAR_TIMEOUT);
        } else {
          clearInterval(intvId);
        }
      }, 200);
    }
  }
}
</script>
<style scoped lang="scss">
.v-progress-linear__bar,
.v-progress-linear__bar__determinate {
  transition: none;
}
</style>
