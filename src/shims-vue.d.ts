declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'selenium-webdriver/testing' {
  import * as suite from require('selenium-webdriver/testing');
  export default suite;
}
