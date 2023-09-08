<script lang="ts" setup>
import authStore from "@/modules/auth/store/authStore";
import {useI18n} from "@typeful/vue-app/i18n";

const i18n = useI18n()
</script>

<template>
  <footer class="app-footer fixed-bottom">
    <template v-if="authStore.user.isLoggedIn">
      <router-link :to="{name: 'auth.AuthInfo'}">{{ i18n.t('auth.accountTypeLabel') }}: <b class="app-connection-notice text-warning">{{ i18n.t('auth.accountType.local') }}</b></router-link>
      <i role="separator"/>
    </template>

    <nav v-if="$slots.links">
      <slot name="links"/>
    </nav>
  </footer>
</template>
