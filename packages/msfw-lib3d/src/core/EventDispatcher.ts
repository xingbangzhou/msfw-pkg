export interface BaseEvent<TEventType extends string = string> {
  readonly type: TEventType
}

export interface Event<TEventType extends string = string, TTarget = unknown> {
  readonly type: TEventType
  readonly target: TTarget
}

export type EventListener<TEventData, TEventType extends string, TTarget = unknown> = (
  event: TEventData & Event<TEventType, TTarget>,
) => void

export default class EventDispatcher<TEventMap extends object = NonNullable<null>> {
  private _listeners?: Record<string, EventListener<any, any, this>[]>

  addEventListener<T extends Extract<keyof TEventMap, string>>(
    type: T,
    listener: EventListener<TEventMap[T], T, this>,
  ) {
    if (this._listeners === undefined) this._listeners = {}

    const listeners = this._listeners

    if (listeners[type] === undefined) {
      listeners[type] = []
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener)
    }
  }

  hasEventListener<T extends Extract<keyof TEventMap, string>>(
    type: T,
    listener: EventListener<TEventMap[T], T, this>,
  ) {
    if (this._listeners === undefined) return false

    const listeners = this._listeners

    return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
  }

  removeEventListener<T extends Extract<keyof TEventMap, string>>(
    type: T,
    listener: EventListener<TEventMap[T], T, this>,
  ) {
    if (this._listeners === undefined) return

    const listeners = this._listeners
    const listenerArray = listeners[type]

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener)

      if (index !== -1) {
        listenerArray.splice(index, 1)
      }
    }
  }

  dispatchEvent<T extends Extract<keyof TEventMap, string>>(type: T, data: TEventMap[T]) {
    if (this._listeners === undefined) return

    const listeners = this._listeners
    const listenerArray = listeners[type]

    const eventRef = data as any

    if (listenerArray !== undefined) {
      eventRef.target = this

      // Make a copy, in case listeners are removed while iterating.
      const array = listenerArray.slice(0)

      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, eventRef)
      }

      eventRef.target = null
    }
  }
}
