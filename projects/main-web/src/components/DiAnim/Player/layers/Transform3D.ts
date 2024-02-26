import {DiFrameInfo, DiLayerProps} from '../types'

class DiProperty<T = number[] | number> {
  constructor(data: {inFrame: number; value: T}[]) {
    this.data = data
  }

  readonly data: {inFrame: number; value: T}[]

  getValue(frameId: number) {
    if (!this.data.length) return null
    if (frameId < this.data[0].inFrame) return null

    const l = this.data.length
    let idx = 0
    for (let i = 0, l = this.data.length; i < l; i++) {
      const temp = this.data[i]
      if (temp.inFrame === frameId) return temp.value
      if (temp.inFrame > frameId) break
      idx = i
    }
    if (idx === l - 1) {
      return this.data[l - 1].value
    }
    // 计算
    const lhs = this.data[idx]
    const rhs = this.data[idx + 1]

    const fas = (frameId - lhs.inFrame) / (rhs.inFrame - lhs.inFrame)

    if (typeof lhs.value === 'number') {
      return lhs.value + ((rhs.value as number) - lhs.value) * fas
    }

    const larr = lhs.value as number[]
    const rarr = rhs.value as number[]

    return larr.map((lvalue, index) => {
      return lvalue + ((rarr[index] as number) - lvalue) * fas
    })
  }
}

export default class DiTransform3D {
  constructor(props: DiLayerProps['transform']) {
    this.anchorPoint = new DiProperty<number[]>(props.anchorPoint)
    this.position = new DiProperty<number[]>(props.position)

    this.scale = new DiProperty<number[]>(props.scale)

    this.opacity = new DiProperty<number>(props.opacity)

    if (props.rotationX) {
      this.rotationX = new DiProperty<number>(props.rotationX)
    }
    if (props.rotationY) {
      this.rotationY = new DiProperty<number>(props.rotationY)
    }
    if (props.rotationZ) {
      this.rotationZ = new DiProperty<number>(props.rotationZ)
    }
  }

  // 锚点
  anchorPoint?: DiProperty<number[]>
  // 位置
  position?: DiProperty<number[]>
  // 缩放
  scale?: DiProperty<number[]>
  // 透明度
  opacity?: DiProperty<number>
  // 旋转
  rotationX?: DiProperty<number>
  // 旋转
  rotationY?: DiProperty<number>
  // 旋转
  rotationZ?: DiProperty<number>

  getAnchorPoint(frameInfo: DiFrameInfo) {
    if (!this.anchorPoint) return null

    const value = this.anchorPoint.getValue(frameInfo.frameId)
    if (!value) return null

    return [value[0] || 0, value[1] || 0, value[2] || 0] as number[]
  }

  getPosition(frameInfo: DiFrameInfo) {
    if (!this.position) return null

    const value = this.position.getValue(frameInfo.frameId)
    if (!value) return null

    const x = value[0] || 0
    const y = value[1] || 0
    const z = value[2] || 0

    // return [x, y, z] as number[]
    return [-frameInfo.width * 0.5 + x, -y + frameInfo.height * 0.5, z] as number[]
  }

  getScale(frameInfo: DiFrameInfo) {
    return this.scale?.getValue(frameInfo.frameId) as number[]
  }

  getRotation(frameInfo: DiFrameInfo) {
    const x = this.rotationX?.getValue(frameInfo.frameId) || 0
    const y = this.rotationY?.getValue(frameInfo.frameId) || 0
    const z = this.rotationZ?.getValue(frameInfo.frameId) || 0

    return [x, y, z] as number[]
  }
}
