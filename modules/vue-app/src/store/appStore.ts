import {reactive} from "vue";

const state = reactive({
  appName: process.env.VUE_APP_NAME,
  appVersion: process.env.VUE_APP_VERSION,
  repoLink: process.env.VUE_APP_REPO,
})

export default {
  state,
}
