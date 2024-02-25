class Property<T = number[] | number> {
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

export default class Transform3D {
  anchorPoint?: Property<number[]>
  position?: Property<number[]>
}
