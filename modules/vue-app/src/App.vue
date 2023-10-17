<template>
  <div id="app" :class="layoutClass" v-if="loadController?.overallStatus !== 'loading'">
    <Navbar :app-name="appStore.state.appName" />

    <main class="container">
      <router-view/>
    </main>

    <Footer class="card">
      <template #links>
        <router-link :to="{name: 'app.About'}">{{ i18n.t('app.view.About') }}</router-link>
      </template>
    </Footer>
  </div>
  <div id="app" :class="layoutClass" v-else-if="loadController.displayLoading">
    <p>Loading...</p>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {RouteLocationRaw, useRoute, useRouter} from "vue-router"
import { useI18n } from "vue-i18n"
import { useRenderer } from "./rendering"

import Navbar from "./layouts/Navbar.vue";
import Footer from "./layouts/Footer.vue";
import appStore from "./store/appStore";
import { useAppTitle } from "./routeTitleUpdating"
import { useLoadController } from "./loadController";

const loadController = useLoadController()
const i18n = useI18n()

const route = useRoute()
const router = useRouter()
const renderer = useRenderer()

const title = useAppTitle(appStore.state.appName)
router.afterEach((route) => {
  title.pageName = route.meta.title && renderer.stringify(route.meta.title) || ''
})

const layoutClass = computed(() => {
  let cls = 'layout-simple'
  if (route.meta.layoutMode) {
    cls += ' ' + route.meta.layoutMode
  }
  return cls
})
</script>
