import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import {
  getEinzelerhebungen,
  getTranscripts,
  getSingleTranscript
} from "../../api/transcripts";

import { ISelectMatchingTokensResult } from "../../api/dioe-public-api/models/ISelectMatchingTokensResult";

import { AxiosResponse } from "axios";
import Vue from "../../main";
import {
  ServerTranscript,
  transRoute,
  einzErhebung
} from "../../static/apiModels";

@Module({
  name: "transModule",
  namespaced: true,
  store,
  dynamic: true
})
class Transcripts extends VuexModule {
  einzelErhebungen: einzErhebung[] | null = null;
  transcripts: transRoute[] | null = null;
  singleTranscript: ServerTranscript | null = null;
  matchingTokens = [] as Array<ISelectMatchingTokensResult>;

  loading: boolean = false;

  singleLoading: boolean = false;

  @Mutation
  setLoading(val: boolean) {
    this.loading = val;
  }

  @MutationAction({ mutate: ["matchingTokens", "loading"] })
  async fetchMatchingTokens(arg: {
    ortho: string;
    phon: string;
    lemma: string;
  }) {
    this.commit("setLoading", true);
    const res = await api.dioePublic.getMatchingTokens(arg.ortho, arg.phon, arg.lemma);
    return {
      matchingTokens: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ["singleTranscript", "loading"] })
  async fetchSingleTranscript(arg: any) {
    this.singleLoading = true;
    console.log("trying to fetch data");
    const response = await getSingleTranscript(arg.id, arg.page);
    console.log("fetched data");
    return {
      singleTranscript: response.data,
      loading: false
    };
  }

  @MutationAction({ mutate: ["transcripts", "loading"] })
  async fetchTranscripts() {
    this.loading = true;
    console.log("trying to fetch data");
    const response = await getTranscripts();
    console.log("fetched data");
    return {
      transcripts: response.data.transcripts,
      loading: false
    };
  }

  @MutationAction({ mutate: ["einzelErhebungen", "loading"] })
  async fetchEinzelerhebungen() {
    this.loading = true;
    console.log("trying to fetch data");
    const response = await getEinzelerhebungen();
    console.log("fetched data");
    return {
      einzelErhebungen: response.data.einzelerhebungen,
      loading: false
    };
  }
}

export const transModule = getModule(Transcripts);
