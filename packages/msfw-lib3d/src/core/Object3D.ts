import EventDispatcher from './EventDispatcher'
import * as MathUtils from '../math/MathUtils'

export interface Object3DEventMap {
  added: object
}

export default class Object3D<
  TEventMap extends Object3DEventMap = Object3DEventMap,
> extends EventDispatcher<TEventMap> {
  constructor() {
    super()

    this.id = _object3DId++
    this.uuid = MathUtils.generateUUID()

    this.parent = null
    this.children = []
  }

  readonly id: number
  readonly uuid: string

  parent: Object3D | null
  children: Object3D[]

  add(object: Object3D) {
    if (object === (this as any)) {
      console.error("Object3D.add: object can't be added as a child of itself.", object)
      return this
    }

    object.removeFromParent()
    object.parent = this
    this.children.push(object)

    object.dispatchEvent('added', _addedEvent)

    return this
  }

  remove(object: Object3D) {
    const index = this.children.indexOf(object)

    if (index !== -1) {
      object.parent = null
      this.children.splice(index, 1)
    }

    return this
  }

  removeFromParent() {
    const parent = this.parent

    if (parent !== null) {
      parent.remove(this as any)
    }

    return this
  }

  traverse(callback: (object: Object3D) => void) {
    callback(this as any)

    const children = this.children
    for (let i = 0, l = children.length; i < l; i++) {
      children[i].traverse(callback)
    }
  }
}

let _object3DId = 0
const _addedEvent = {type: 'added'}
