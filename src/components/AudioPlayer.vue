<template>
  <v-layout>
    <audio
      :id="trackId"
      :ref="trackId"
      :src="getAudioPath(dateipfad, audiofile)"
    ></audio>
    <template>
      <v-container>
        <!--

            <v-row no-gutters>
              <v-col class="mr-2">
                <v-checkbox
                v-model="kontext"
                label="Kontext"
                color="info"
                @change="changeTime()"
                ></v-checkbox>
              </v-col>
            </v-row>
          -->
        <v-row align-self="center" align="center" justify="center">
          <v-col>
            <span>
              <v-progress-circular :value="completion"></v-progress-circular
            ></span>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  small
                  v-bind="attrs"
                  v-on="on"
                  elevation="1"
                  @click="timestampId--"
                  :disabled="timestampId === 0"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </template>
              <span> Voriges Beispiel </span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  fab
                  elevation="1"
                  small
                  @click="play()"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </template>
              <span> Beispiel abspielen</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  fab
                  elevation="1"
                  small
                  @click="pause()"
                >
                  <v-icon>mdi-pause</v-icon>
                </v-btn>
              </template>
              <span> Beispiel pausieren</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  elevation="1"
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="timestampId++"
                  :disabled="timestampId >= maxLength - 1"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </template>
              <span> Nächstes Beispiel</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  elevation="1"
                  fab
                  small
                  @click="repeat = !repeat"
                >
                  <v-icon v-if="repeat">mdi-repeat</v-icon>
                  <v-icon v-if="!repeat">mdi-repeat-off</v-icon>
                </v-btn>
              </template>
              <span v-if="repeat"> Aufnahme wiederholen </span>
              <span v-else> Einmalig wiedergeben </span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row align="center" align-content="center">
          <v-col>
            <div class="text-center">
              <template v-if="data[timestampId].tagName">
                <div class="mx-2">
                  Tag-Name: {{ data[timestampId]['tagName'] }}
                </div>
              </template>
              <template v-if="data[timestampId].orthoText">
                <div class="mx-2">
                  Ortho:
                  {{
                    data[timestampId]['orthoText'] === ''
                      ? data[timestampId]['ortho']
                      : data[timestampId]['orthoText']
                  }}
                </div>
              </template>
              <template v-if="data[timestampId].aufgabe">
                <div class="mx-2">Aufgabe: {{ data[timestampId].aufgabe }}</div>
                <div v-if="type !== ''" class="mx-2">Typ: {{ type }}</div>
              </template>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <kontext-view
              v-if="data[timestampId].kontext"
              :kontextData="data[timestampId].kontext"
              :focusTag="data[timestampId].reihung"
              :focusOrtho="data[timestampId].ortho"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-layout>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { isAufgabeStandard } from '@/helpers/helper';
import KontextView from './KontextView.vue';
import { AntwortKontext } from '@/api/dioe-public-api';

export interface Audio {
  start: {
    minutes?: number;
    seconds: number;
    milliseconds: number;
  };
  stop: {
    minutes?: number;
    seconds: number;
    milliseconds: number;
  };
  tagName?: string;
  orthoText?: string;
  ortho?: string;
  aufgabe?: string;
  kontext?: AntwortKontext[];
  reihung?: number;
}

@Component({
  components: { KontextView },
  name: 'AudioPlayer'
})
export default class AudioPlayer extends Vue {
  @Prop(String) readonly dateipfad!: string;
  @Prop(String) readonly audiofile!: string;
  @Prop({ type: Array, required: true }) readonly data!: Array<Audio>;
  // dateipfad = "allsptd03";
  // audiofile = "0032_NECK_alt_m_SPTD.ogg";
  timestampId = 0;
  repeat = false;
  time = 0;
  completion = 0;

  // audioTrack = this.$refs[this.trackId] as HTMLAudioElement;
  fadeIn: number = -1;
  fadeOut: number = -1;

  fadeValue: number = 0;

  kontextNum: number = 0;

  kontext: boolean = false;

  get maxLength() {
    return this.data.length;
  }

  get audioTrack() {
    return this.$refs[this.trackId] as HTMLAudioElement;
  }

  get type() {
    return isAufgabeStandard(this.audiofile);
  }

  get duration() {
    const start = this.timestampStart;
    const end = this.timestampEnd;
    return end - start;
  }

  get timestampStart() {
    const start = this.data[this.timestampId].start;
    let sec = 0;
    if (start.minutes) {
      sec += start.minutes * 60;
    }
    if (start.seconds) {
      sec += start.seconds;
    }
    if (start.milliseconds) {
      sec += start.milliseconds / 1000;
    }
    const val = sec - this.fadeValue - this.kontextNum;
    return val <= 0 ? sec : val;
  }

  get timestampEnd() {
    const end = this.data[this.timestampId].stop;
    let sec = 0;
    if (end.minutes) {
      sec += end.minutes * 60;
    }
    if (end.seconds) {
      sec += end.seconds;
    }
    if (end.milliseconds) {
      sec += end.milliseconds / 1000;
    }
    const val = sec + this.fadeValue + this.kontextNum;
    return val > this.trackDuration ? sec : val;
  }

  get trackId() {
    return `${this.dateipfad}-${this.audiofile}`;
  }

  get trackDuration() {
    const track = this.$refs[this.trackId] as HTMLAudioElement;
    return track.duration;
  }

  get currTime() {
    const track = this.$refs[this.trackId] as HTMLAudioElement;
    return track !== null ? track.currentTime : 0;
  }

  changeTime() {
    if (this.kontext) {
      this.kontextNum = 2;
    } else {
      this.kontextNum = 0;
    }
  }

  fadeInVal(x: number) {
    return Math.pow(x, 2);
  }

  fadeOutVal(x: number) {
    if (x >= 1) return 0;
    return Math.pow(x, 3) * -1 + 1;
  }

  get dioeDBEndpoint() {
    return process.env.VUE_APP_DB_ENDPOINT;
  }

  getAudioPath(path: string, file: string) {
    return `${this.dioeDBEndpoint}/private-media/${path}/${file}`;
  }

  @Watch('timestampId')
  ontimestapid() {
    const track = this.$refs[this.trackId] as HTMLAudioElement;
    if (this.timestampId >= this.data.length) {
      this.timestampId = this.data.length - 1;
    }

    if (this.timestampId < 0) {
      this.timestampId = 0;
    }
    this.completion = 0;
    track.currentTime = this.timestampStart;
  }

  async play() {
    const track = this.$refs[this.trackId] as HTMLAudioElement;
    if (track.paused) {
      if (
        track.currentTime <= this.timestampStart ||
        track.currentTime >= this.timestampEnd ||
        this.completion >= 100
      ) {
        track.currentTime = this.timestampStart;
      }
      track.volume = 1;
      // this.audioFadeIn(this.timestampStart);
      try {
        await track.play();
      } catch (e) {
        console.log('Pausing play');
      }
    } else {
      await this.pause();
    }
  }

  async pause() {
    const track = this.$refs[this.trackId] as HTMLAudioElement;
    try {
      await track.pause();
    } catch (e) {
      console.log('Pausing track');
    }
  }

  audioFadeIn(fadePoint: number) {
    const sound = this.$refs[this.trackId] as HTMLAudioElement;
    clearInterval(this.fadeIn);
    var that = this;
    let val = 0;
    this.fadeIn = setInterval(function () {
      if (sound.currentTime >= fadePoint && sound.volume != 1.0) {
        sound.volume = that.fadeInVal(val);
        val += 0.1;
      }
      if (sound.volume > 0.9) {
        clearInterval(that.fadeIn);
      }
    }, 100);
  }

  audioFadeOut() {
    const sound = this.$refs[this.trackId] as HTMLAudioElement;
    var fadePoint = this.timestampEnd - this.fadeValue;
    // clearInterval(this.fadeOut);
    var that = this;
    let val = 0;
    this.fadeOut = setInterval(function () {
      if (sound.currentTime >= fadePoint) {
        sound.volume = that.fadeOutVal(val);
        val += 0.1;
      }
      if (sound.volume <= 0.1) {
        clearInterval(that.fadeOut);
      }
    }, 100);
  }

  mounted() {
    this.$nextTick(() => {
      const sound = this.$refs[this.trackId] as HTMLAudioElement;
      sound.addEventListener('timeupdate', () => {
        this.time = sound.currentTime - this.timestampStart;
        if (!sound.paused) {
          this.completion = (this.time / this.duration) * 100;
          if (sound.currentTime >= this.timestampEnd && !this.repeat) {
            // this.audioFadeOut();
            sound.volume = 0;
            if (sound.currentTime >= this.timestampEnd) {
              this.pause();
            }
          } else if (sound.currentTime >= this.timestampEnd && this.repeat) {
            sound.currentTime = this.timestampStart;
            this.completion = 0;
          }
        }
      });
    });
  }
}
</script>
