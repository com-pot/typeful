import { computed, reactive, ref } from "vue";

type AsyncStatus = 'n/a' | 'busy' | 'ready' | 'error'
type AsyncWrapper<T> =
    {status: Readonly<'ready'>, ready: Readonly<true>, value: T}
    | {status: Readonly<'n/a' | 'busy' | 'error'>, ready: Readonly<false>}
type AsyncWrapperControls<T> = {
    _await: (source: Promise<T>) => Promise<T>,
    _clear: () => void,
    _set: (value: T) => void,
}
export type AsyncRef<T=unknown> = AsyncWrapper<T> & AsyncWrapperControls<T>

export default function asyncRef<T>(promise?: Promise<T>): AsyncRef<T> {
    const status = ref<AsyncStatus>('n/a')

    const awaitValue = (promise: Promise<T>) => {
        status.value = 'busy'
        ar.value = null

        return promise
            .then((value) => {
                ar.value = value as typeof ar['value']
                status.value = 'ready'
                return value
            })
            .catch((err) => {
                status.value = 'error'

                throw err
            })
    }

    const ar = reactive({
        status: computed(() => status.value),
        ready: computed(() => status.value === 'ready'),

        value: null as null | T,

        poll: null,

        _await: awaitValue,
        _set: (value: T) => {
            ar.value = value as typeof ar['value']
            status.value = 'ready'
        },
        _clear: () => {
            status.value = 'n/a'
            ar.value = null
        },
    })

    if (promise) {
        awaitValue(promise)
    }

    return ar as AsyncRef<T>
}
export function asyncComputed<TRes, T1>(cb: (v1: T1) => TRes, aRef1: AsyncWrapper<T1>): AsyncWrapper<TRes>;
export function asyncComputed<TRes, T1, T2>(cb: (v1: T1, v2: T2) => TRes, aRef1: AsyncWrapper<T1>, aRef2: AsyncWrapper<T2>): AsyncWrapper<TRes>;
export function asyncComputed<TRes>(cb: (...values: any[]) => TRes, ...refs: AsyncWrapper<any>[]): AsyncWrapper<TRes> {
    const ready = computed(() => refs.every((ref) => ref.ready))
    const error = computed(() => !ready.value && refs.some((ref) => ref.status === 'error'))
    const status = computed<AsyncWrapper<any>['status']>(() => {
        if (ready.value) return 'ready'
        if (error.value) return 'error'
        return 'busy'
    })

    const value = computed<TRes>(() => {
        if (!ready.value) return null as unknown as TRes
        return cb(...refs.map((ref) => (ref as typeof ref & {status: 'ready'}).value))
    })

    return reactive({
        ready,
        status,
        value,
    }) as AsyncWrapper<TRes>
}
