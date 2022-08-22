<template>
  <v-layout>
    <audio :id="trackId" :src="getAudioPath(dateipfad, audiofile)"></audio>
    <template>
      <div class="text-center">
        <span class="mx-2">
          <v-progress-circular :value="completion"></v-progress-circular
        ></span>
        <v-btn
          class="mx-2"
          fab
          small
          @click="timestampId--"
          :disabled="timestampId === 0"
        >
          <v-icon>mdi-skip-backward</v-icon>
        </v-btn>
        <v-btn class="mx-2" fab small @click="play()">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn class="mx-2" fab small @click="pause()">
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          small
          @click="timestampId++"
          :disabled="timestampId >= maxLength - 1"
        >
          <v-icon>mdi-skip-forward</v-icon>
        </v-btn>
        <v-btn class="mx-2" fab small @click="repeat = !repeat">
          <v-icon v-if="repeat">mdi-repeat</v-icon>
          <v-icon v-if="!repeat">mdi-repeat-off</v-icon>
        </v-btn>
      </div>
      <div class="text-center">
        <template v-if="data[timestampId].tagName">
          <div class="mx-2">Tag Kurz: {{ data[timestampId]['tagShort'] }}</div>
          <div class="mx-2">Tag-Name: {{ data[timestampId]['tagName'] }}</div>
        </template>
        <template v-if="data[timestampId].orthoText">
          <div class="mx-2">
            Ortho:
            {{
              data[timestampId]['ortho'] === ''
                ? data[timestampId]['orthoText']
                : data[timestampId]['ortho']
            }}
          </div>
        </template>
        <template v-if="data[timestampId].aufgabe">
          <div class="mx-2">Aufgabe: {{ data[timestampId].aufgabe }}</div>
          <div class="mx-2">Typ: {{ type ? 'Standard' : 'Dialekt' }}</div>
        </template>
      </div>
    </template>
  </v-layout>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { isAufgabeStandard } from '@/helpers/helper';

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
}

@Component({
  components: {},
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

  audioTrack = document.getElementById(this.trackId) as HTMLAudioElement;
  fadeIn: number = -1;
  fadeOut: number = -1;

  get maxLength() {
    return this.data.length;
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
    sec += start.seconds;
    if (start.milliseconds) {
      sec += start.milliseconds / 1000;
    }
    return sec;
  }

  get timestampEnd() {
    const end = this.data[this.timestampId].stop;
    let sec = 0;
    if (end.minutes) {
      sec += end.minutes * 60;
    }
    sec += end.seconds;
    if (end.milliseconds) {
      sec += end.milliseconds / 1000;
    }
    return sec;
  }

  get trackId() {
    return `${this.dateipfad}-${this.audiofile}`;
  }

  get currTime() {
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    return track !== null ? track.currentTime : 0;
  }

  getAudioPath(path: string, file: string) {
    return `https://dioedb.dioe.at/private-media/${path}/${file}`;
  }

  @Watch('timestampId')
  ontimestapid() {
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
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
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    if (track.paused) {
      if (
        track.currentTime <= this.timestampStart ||
        track.currentTime >= this.timestampEnd
      ) {
        track.currentTime = this.timestampStart;
      }
      track.volume = 0;
      this.audioFadeIn(this.timestampStart);
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
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    try {
      await track.pause();
    } catch (e) {
      console.log('Pausing track');
    }
  }

  audioFadeIn(fadePoint: number) {
    const sound = document.getElementById(this.trackId) as HTMLAudioElement;
    clearInterval(this.fadeIn);
    var that = this;
    this.fadeIn = setInterval(function () {
      if (sound.currentTime >= fadePoint && sound.volume != 1.0) {
        sound.volume += 0.1;
      }
      if (sound.volume > 0.9) {
        clearInterval(that.fadeIn);
      }
    }, 200);
  }

  audioFadeOut() {
    if (this.repeat) {
      const sound = document.getElementById(this.trackId) as HTMLAudioElement;

      var fadePoint = this.duration - 1;
      clearInterval(this.fadeOut);
      var that = this;
      this.fadeOut = setInterval(function () {
        if (sound.currentTime >= fadePoint && sound.volume >= 0.1) {
          sound.volume -= 0.1;
        }
        if (sound.volume < 0.1) {
          clearInterval(that.fadeOut);
        }
      }, 200);
    }
  }

  mounted() {
    const sound = document.getElementById(this.trackId) as HTMLAudioElement;
    sound.addEventListener('timeupdate', () => {
      this.time = sound.currentTime - this.timestampStart;
      if (!sound.paused) {
        this.completion = (this.time / this.duration) * 100;
        if (sound.currentTime >= this.timestampEnd && !this.repeat) {
          this.audioFadeOut();
          this.pause();
        } else if (sound.currentTime >= this.timestampEnd && this.repeat) {
          sound.currentTime = this.timestampStart;
          this.completion = 0;
        }
      }
    });
  }
}
</script>