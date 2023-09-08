import { App } from "vue";
import { plugin, defaultConfig, createInput } from "@formkit/vue"
import { createInputRegistry, provideInputRegistry } from "./inputRegistry";

import BtnSelect from "./inputs/BtnSelect.vue"

export default {
  install(app: App) {
    const inputRegistry = createInputRegistry()
    provideInputRegistry(app, inputRegistry)

    app.use(plugin, defaultConfig({
      inputs: {
        'btnSelect': createInput(BtnSelect),
      },
    }))
  },
}
