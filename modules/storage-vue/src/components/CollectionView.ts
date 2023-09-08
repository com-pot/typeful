import { computed, defineComponent, h, PropType, Slots, VNode } from "vue";
import { ListController } from "../listController";
import ComposableFilter from "./ComposableFilter.vue"
import ComposableSorting from "./ComposableSorting.vue"
import Pagination from "./Pagination.vue"

export default defineComponent({
  props: {
    ctrl: {type: Object as PropType<ListController>, required: true},
    appearance: {type: String as PropType<'list'>, default: "list"},
    flow: {type: String},
  },
  setup(props, {slots}) {

    const viewController = computed(() => {
      if (props.appearance !== "list") {
        console.warn(`Collection view '${props.appearance}' not supported. Using 'view'`);
      }

      return viewControllers.list
    })

    return () => {
      let elements: VNode[] = []
      pushNode(hView.optionsContainer(props.ctrl), elements)

      pushNode(viewController.value.h.body(props.ctrl, slots, props), elements)

      pushNode(hView.pagination(props.ctrl), elements)

      return elements
    }
  },
})

const viewControllers = {
  list: {
    h: {
      body(ctrl: ListController, slots: Readonly<Slots>, props: any) {
        if (ctrl.data.status === 'n/a') {
          return h('span', 'n/a')
        }
        if (ctrl.data.status === "busy") {
          return h('span', ['loading'])
        }
        if (ctrl.data.status === 'error' || !ctrl.data.ready) {
          return h('span', ['error'])
        }
        const items = ctrl.data.value.items.map((item) => {
          return slots.item?.({item})
        })

        return h('div', {class: ['list-items', props?.flow && 'flow-' + props.flow]}, items)
      },
    }
  }
}

const hView = {
  optionsContainer: (ctrl: ListController) => {
    let result: VNode[] | undefined
    if (ctrl.filter) {
      result = pushNode(h(ComposableFilter, {ctrl: ctrl.filter}), result)
    }
    if (ctrl.sort) {
      result = pushNode(h(ComposableSorting, {ctrl: ctrl.sort}), result)
    }

    if (result) {
      pushNode(h('div', {class: 'submit-group'}, [
        h('button', {
          class: 'btn btn-secondary',
          'onClick'() {
            ctrl.load()
          },
        }, ['Zobrazit']),
      ]), result)

      return h('div', {class: 'list-options'}, result)
    }
  },

  pagination: (ctrl: ListController) => {
    if (!ctrl.pagination || (ctrl.data.ready && !ctrl.data.value.pagination)) {
      return
    }

    return h(Pagination, {
      modelValue: ctrl.pagination.page,
      'onUpdate:modelValue': (value: number) => {
        ctrl.pagination.page = value
        ctrl.load()
      },
      maxPage: ctrl.getTotalPages(),
    })
  },
}

function pushNode(node: VNode | VNode[], container?: VNode[]): VNode[]
function pushNode(node: VNode | VNode[] | undefined, container: VNode[]): VNode[]
function pushNode(node?: VNode | VNode[], container?: VNode[]): VNode[] | undefined
function pushNode(node?: VNode | VNode[] , container?: VNode[]) {
  if (node) {
    if (!container) {
      container = []
    }
    Array.isArray(node)
      ? container.push(...node)
      : container.push(node)
  }

  return container
}


/*
    <div class="list-items" v-if="list.data.ready">

    </div>
*/
