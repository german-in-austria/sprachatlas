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
    </template>
  </v-layout>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {},
  name: "AudioPlayer",
})
export default class QueryCreator extends Vue {
  dateipfad = "allsptd03";
  audiofile = "0032_NECK_alt_m_SPTD.ogg";
  timestampId = 0;
  repeat = false;
  time = 0;
  completion = 0;

  audioTrack = document.getElementById(this.trackId) as HTMLAudioElement;
  audio = {
    dateipfad: "allsptd03",
    audiofile: "0032_NECK_alt_m_SPTD.ogg",
    gruppeBez: "Alt (65+)",
    teamBez: "PP03",
    data: [
      {
        startAntwort: {
          seconds: 10,
          milliseconds: 110,
        },
        stopAntwort: {
          seconds: 13,
          milliseconds: 190,
        },
        kommentar: "",
        tagId: 34,
        tagName: "Irrelevant",
        satzId: 4271,
        aufgabeId: 184,
      },
      {
        startAntwort: {
          minutes: 1,
          seconds: 19,
          milliseconds: 119,
        },
        stopAntwort: {
          minutes: 1,
          seconds: 29,
          milliseconds: 129,
        },
        kommentar: "",
        tagId: 34,
        tagName: "Irrelevant",
        satzId: 4271,
        aufgabeId: 185,
      },
    ],
  };

  get maxLength() {
    return this.audio.data.length;
  }

  get duration() {
    const start = this.timestampStart;
    const end = this.timestampEnd;
    return end - start;
  }

  get timestampStart() {
    const start = this.audio.data[this.timestampId].startAntwort;
    let sec = 0;
    if (start.minutes) {
      sec += start.minutes * 60;
    }
    sec += start.seconds + start.milliseconds / 1000;
    return sec;
  }

  get timestampEnd() {
    const end = this.audio.data[this.timestampId].stopAntwort;
    let sec = 0;
    if (end.minutes) {
      sec += end.minutes * 60;
    }
    sec += end.seconds + end.milliseconds / 1000;
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

  @Watch("timestampId")
  ontimestapid() {
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    if (this.timestampId >= this.audio.data.length) {
      this.timestampId = this.audio.data.length - 1;
    }

    if (this.timestampId < 0) {
      this.timestampId = 0;
    }

    track.currentTime = this.timestampStart;
    if (track.paused) track.pause();
  }

  play() {
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    if (track.paused) {
      track.currentTime = this.timestampStart;
      track.volume = 0;
      this.audioFadeIn(this.timestampStart);
      track.play();
    } else {
      this.pause();
    }
  }

  pause() {
    const track = document.getElementById(this.trackId) as HTMLAudioElement;
    track.pause();
  }

  audioFadeIn(fadePoint: number) {
    const sound = document.getElementById(this.trackId) as HTMLAudioElement;

    var fadeAudio = setInterval(function () {
      if (sound.currentTime >= fadePoint && sound.volume != 1.0) {
        sound.volume += 0.1;
      }
      if (sound.volume > 0.9) {
        clearInterval(fadeAudio);
      }
    }, 200);
  }

  audioFadeOut() {
    if (this.repeat) {
      const sound = document.getElementById(this.trackId) as HTMLAudioElement;

      var fadePoint = this.duration - 1;

      var fadeAudio = setInterval(function () {
        if (sound.currentTime >= fadePoint && sound.volume >= 0.1) {
          sound.volume -= 0.1;
        }
        if (sound.volume < 0.1) {
          clearInterval(fadeAudio);
        }
      }, 200);
    }
  }

  mounted() {
    const sound = document.getElementById(this.trackId) as HTMLAudioElement;
    sound.addEventListener("timeupdate", () => {
      this.time = sound.currentTime - this.timestampStart;
      this.completion = (this.time / this.duration) * 100;
      if (sound.currentTime >= this.timestampEnd && !this.repeat) {
        this.audioFadeOut();
        this.pause();
      } else if (sound.currentTime >= this.timestampEnd && this.repeat) {
        sound.currentTime = this.timestampStart;
      }
    });
  }
}
</script>