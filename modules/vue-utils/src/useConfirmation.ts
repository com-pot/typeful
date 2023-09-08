import { computed, reactive, Ref } from "vue"

type ConfirmationOptions = {
  template: string | Ref<string>,
}

type Confirmation = {
  template: string,
  value: string,

  readonly valid: boolean,
}

export default function useConfirmation(opts: ConfirmationOptions) {
  const confirmation: Confirmation = reactive({
    template: opts.template,
    value: '',

    valid: computed<boolean>(() => {
      return confirmation.value.toLowerCase() === confirmation.template.toLowerCase()
    })
  })

  return confirmation
}

export function useDeleteConfirmation<TRef = string | number>(deleteCb: (ref: TRef) => Promise<unknown>) {
  return reactive({
    value: null as TRef | null,

    delete(ref: TRef) {
      console.log('confirm delete', ref, this.value);

      if (!ref) {
        this.value = null
        return
      }
      if (ref !== this.value) {
        this.value = ref
        return
      }
      this.value = null
      return deleteCb(ref)
    },
  })
}
