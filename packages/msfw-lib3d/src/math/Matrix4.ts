import {WebGLCoordinateSystem} from '../constants'
import Euler from './Euler'
import Vector3 from './Vector3'

export default class Matrix4 {
  constructor(...args: number[])
  // prettier-ignore
  constructor(
    n11: number, n12: number, n13: number, n14: number,
    n21: number, n22: number, n23: number, n24: number,
    n31: number, n32: number, n33: number, n34: number,
    n41: number, n42: number, n43: number, n44: number,
  ) {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    if (n11 !== undefined) {
      this.set(
        n11, n12, n13, n14,
        n21, n22, n23, n24,
        n31, n32, n33, n34,
        n41, n42, n43, n44
      )
    }
  }

  elements: number[]

  // prettier-ignore
  set(
    n11: number, n12: number, n13: number, n14: number,
    n21: number, n22: number, n23: number, n24: number,
    n31: number, n32: number, n33: number, n34: number,
    n41: number, n42: number, n43: number, n44: number,
  ) {
    const te = this.elements

    te[0] = n11
    te[4] = n12
    te[8] = n13
    te[12] = n14

    te[1] = n21
    te[5] = n22
    te[9] = n23
    te[13] = n24
    
    te[2] = n31
    te[6] = n32
    te[10] = n33
    te[14] = n34
    
    te[3] = n41
    te[7] = n42
    te[11] = n43
    te[15] = n44

    return this
  }

  identity() {
    // prettier-ignore
    this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )

    return this
  }

  clone() {
    return new Matrix4().fromArray(this.elements)
  }

  copy(m: Matrix4) {
    const te = this.elements
    const me = m.elements

    te[0] = me[0]
    te[1] = me[1]
    te[2] = me[2]
    te[3] = me[3]
    te[4] = me[4]
    te[5] = me[5]
    te[6] = me[6]
    te[7] = me[7]
    te[8] = me[8]
    te[9] = me[9]
    te[10] = me[10]
    te[11] = me[11]
    te[12] = me[12]
    te[13] = me[13]
    te[14] = me[14]
    te[15] = me[15]

    return this
  }

  copyPosition(m: Matrix4) {
    const te = this.elements
    const me = m.elements

    te[12] = me[12]
    te[13] = me[13]
    te[14] = me[14]

    return this
  }

  extractRotation(m: Matrix4) {
    // this method does not support reflection matrices

    const te = this.elements
    const me = m.elements

    const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length()
    const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length()
    const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length()

    te[0] = me[0] * scaleX
    te[1] = me[1] * scaleX
    te[2] = me[2] * scaleX
    te[3] = 0

    te[4] = me[4] * scaleY
    te[5] = me[5] * scaleY
    te[6] = me[6] * scaleY
    te[7] = 0

    te[8] = me[8] * scaleZ
    te[9] = me[9] * scaleZ
    te[10] = me[10] * scaleZ
    te[11] = 0

    te[12] = 0
    te[13] = 0
    te[14] = 0
    te[15] = 1

    return this
  }

  multiply(m: Matrix4) {
    return this.multiplyMatrices(this, m)
  }

  premultiply(m: Matrix4) {
    return this.multiplyMatrices(m, this)
  }

  multiplyMatrices(a: Matrix4, b: Matrix4) {
    const ae = a.elements
    const be = b.elements
    const te = this.elements

    const a11 = ae[0],
      a12 = ae[4],
      a13 = ae[8],
      a14 = ae[12]
    const a21 = ae[1],
      a22 = ae[5],
      a23 = ae[9],
      a24 = ae[13]
    const a31 = ae[2],
      a32 = ae[6],
      a33 = ae[10],
      a34 = ae[14]
    const a41 = ae[3],
      a42 = ae[7],
      a43 = ae[11],
      a44 = ae[15]

    const b11 = be[0],
      b12 = be[4],
      b13 = be[8],
      b14 = be[12]
    const b21 = be[1],
      b22 = be[5],
      b23 = be[9],
      b24 = be[13]
    const b31 = be[2],
      b32 = be[6],
      b33 = be[10],
      b34 = be[14]
    const b41 = be[3],
      b42 = be[7],
      b43 = be[11],
      b44 = be[15]

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44

    return this
  }

  determinant() {
    const te = this.elements

    const n11 = te[0],
      n12 = te[4],
      n13 = te[8],
      n14 = te[12]
    const n21 = te[1],
      n22 = te[5],
      n23 = te[9],
      n24 = te[13]
    const n31 = te[2],
      n32 = te[6],
      n33 = te[10],
      n34 = te[14]
    const n41 = te[3],
      n42 = te[7],
      n43 = te[11],
      n44 = te[15]

    //TODO: make this more efficient
    //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

    return (
      n41 *
        (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
      n42 *
        (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
      n43 *
        (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
      n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
    )
  }

  transpose() {
    const te = this.elements

    let tmp = te[1]
    te[1] = te[4]
    te[4] = tmp
    tmp = te[2]
    te[2] = te[8]
    te[8] = tmp
    tmp = te[6]
    te[6] = te[9]
    te[9] = tmp

    tmp = te[3]
    te[3] = te[12]
    te[12] = tmp
    tmp = te[7]
    te[7] = te[13]
    te[13] = tmp
    tmp = te[11]
    te[11] = te[14]
    te[14] = tmp

    return this
  }

  setPosition(x: number, y: number, z: number) {
    const te = this.elements

    te[12] = x
    te[13] = y
    te[14] = z

    return this
  }

  invert() {
    const te = this.elements
    const n11 = te[0]
    const n21 = te[1]
    const n31 = te[2]
    const n41 = te[3]
    const n12 = te[4]
    const n22 = te[5]
    const n32 = te[6]
    const n42 = te[7]
    const n13 = te[8]
    const n23 = te[9]
    const n33 = te[10]
    const n43 = te[11]
    const n14 = te[12]
    const n24 = te[13]
    const n34 = te[14]
    const n44 = te[15]

    const t11 =
      n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44
    const t12 =
      n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44
    const t13 =
      n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44
    const t14 =
      n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

    if (det === 0) {
      // prettier-ignore
      return this.set(
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0
      )
    }

    const detInv = 1 / det

    te[0] = t11 * detInv
    te[1] =
      (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) *
      detInv
    te[2] =
      (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) *
      detInv
    te[3] =
      (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) *
      detInv

    te[4] = t12 * detInv
    te[5] =
      (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) *
      detInv
    te[6] =
      (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) *
      detInv
    te[7] =
      (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) *
      detInv

    te[8] = t13 * detInv
    te[9] =
      (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) *
      detInv
    te[10] =
      (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) *
      detInv
    te[11] =
      (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) *
      detInv

    te[12] = t14 * detInv
    te[13] =
      (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) *
      detInv
    te[14] =
      (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) *
      detInv
    te[15] =
      (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) *
      detInv

    return this
  }

  scale(v: Vector3) {
    const te = this.elements
    const x = v.x
    const y = v.y
    const z = v.z

    te[0] *= x
    te[4] *= y
    te[8] *= z
    te[1] *= x
    te[5] *= y
    te[9] *= z
    te[2] *= x
    te[6] *= y
    te[10] *= z
    te[3] *= x
    te[7] *= y
    te[11] *= z

    return this
  }

  makeTranslation(x: number, y: number, z: number) {
    // prettier-ignore
    this.set(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1
    )
  }

  makeRotationX(theta: number) {
    const c = Math.cos(theta)
    const s = Math.sin(theta)

    // prettier-ignore
    this.set(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    )

    return this
  }

  makeRotationY(theta: number) {
    const c = Math.cos(theta)
    const s = Math.sin(theta)

    // prettier-ignore
    this.set(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    )

    return this
  }

  makeRotationZ(theta: number) {
    const c = Math.cos(theta),
      s = Math.sin(theta)

    // prettier-ignore
    this.set(
      c, - s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )

    return this
  }

  makeRotationAxis(axis: Vector3, angle: number) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const t = 1 - c
    const x = axis.x
    const y = axis.y
    const z = axis.z
    const tx = t * x
    const ty = t * y

    // prettier-ignore
    this.set(
      tx * x + c, tx * y - s * z, tx * z + s * y, 0,
      tx * y + s * z, ty * y + c, ty * z - s * x, 0,
      tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
      0, 0, 0, 1
    )

    return this
  }

  makeRotationFromEuler(euler: Euler) {
    const te = this.elements

    const x = euler.x,
      y = euler.y,
      z = euler.z
    const a = Math.cos(x),
      b = Math.sin(x)
    const c = Math.cos(y),
      d = Math.sin(y)
    const e = Math.cos(z),
      f = Math.sin(z)

    if (euler.order === 'XYZ') {
      const ae = a * e,
        af = a * f,
        be = b * e,
        bf = b * f

      te[0] = c * e
      te[4] = -c * f
      te[8] = d

      te[1] = af + be * d
      te[5] = ae - bf * d
      te[9] = -b * c

      te[2] = bf - ae * d
      te[6] = be + af * d
      te[10] = a * c
    } else if (euler.order === 'YXZ') {
      const ce = c * e,
        cf = c * f,
        de = d * e,
        df = d * f

      te[0] = ce + df * b
      te[4] = de * b - cf
      te[8] = a * d

      te[1] = a * f
      te[5] = a * e
      te[9] = -b

      te[2] = cf * b - de
      te[6] = df + ce * b
      te[10] = a * c
    } else if (euler.order === 'ZXY') {
      const ce = c * e,
        cf = c * f,
        de = d * e,
        df = d * f

      te[0] = ce - df * b
      te[4] = -a * f
      te[8] = de + cf * b

      te[1] = cf + de * b
      te[5] = a * e
      te[9] = df - ce * b

      te[2] = -a * d
      te[6] = b
      te[10] = a * c
    } else if (euler.order === 'ZYX') {
      const ae = a * e,
        af = a * f,
        be = b * e,
        bf = b * f

      te[0] = c * e
      te[4] = be * d - af
      te[8] = ae * d + bf

      te[1] = c * f
      te[5] = bf * d + ae
      te[9] = af * d - be

      te[2] = -d
      te[6] = b * c
      te[10] = a * c
    } else if (euler.order === 'YZX') {
      const ac = a * c,
        ad = a * d,
        bc = b * c,
        bd = b * d

      te[0] = c * e
      te[4] = bd - ac * f
      te[8] = bc * f + ad

      te[1] = f
      te[5] = a * e
      te[9] = -b * e

      te[2] = -d * e
      te[6] = ad * f + bc
      te[10] = ac - bd * f
    } else if (euler.order === 'XZY') {
      const ac = a * c,
        ad = a * d,
        bc = b * c,
        bd = b * d

      te[0] = c * e
      te[4] = -f
      te[8] = d * e

      te[1] = ac * f + bd
      te[5] = a * e
      te[9] = ad * f - bc

      te[2] = bc * f - ad
      te[6] = b * e
      te[10] = bd * f + ac
    }

    // bottom row
    te[3] = 0
    te[7] = 0
    te[11] = 0

    // last column
    te[12] = 0
    te[13] = 0
    te[14] = 0
    te[15] = 1

    return this
  }

  makeScale(x: number, y: number, z: number) {
    // prettier-ignore
    this.set(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    )

    return this
  }

  lookAt(eye: Vector3, target: Vector3, up: Vector3) {
    const te = this.elements

    _z.subVectors(eye, target)

    if (_z.lengthSq() === 0) {
      // eye and target are in the same position

      _z.z = 1
    }

    _z.normalize()
    _x.crossVectors(up, _z)

    if (_x.lengthSq() === 0) {
      // up and z are parallel

      if (Math.abs(up.z) === 1) {
        _z.x += 0.0001
      } else {
        _z.z += 0.0001
      }

      _z.normalize()
      _x.crossVectors(up, _z)
    }

    _x.normalize()
    _y.crossVectors(_z, _x)

    te[0] = _x.x
    te[4] = _y.x
    te[8] = _z.x
    te[1] = _x.y
    te[5] = _y.y
    te[9] = _z.y
    te[2] = _x.z
    te[6] = _y.z
    te[10] = _z.z

    return this
  }

  makePerspective(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
    coordinateSystem = WebGLCoordinateSystem,
  ) {
    const x = (2 * near) / (right - left)
    const y = (2 * near) / (top - bottom)

    const a = (right + left) / (right - left)
    const b = (top + bottom) / (top - bottom)

    let c = 0
    let d = 0

    if (coordinateSystem === WebGLCoordinateSystem) {
      c = -(far + near) / (far - near)
      d = (-2 * far * near) / (far - near)
    } else {
      throw new Error('Matrix4.makePerspective(): Invalid coordinate system: ' + coordinateSystem)
    }

    // prettier-ignore
    this.set(
      x, 0, a, 0,
      0, y, b, 0,
      0, 0, c, d,
      0, 0, -1, 0
    )

    return this
  }

  fromArray(array: number[], offset = 0) {
    const te = this.elements
    for (let i = 0; i < 16; i++) {
      te[i] = array[i + offset]
    }

    return this
  }

  toArray(array = [] as number[], offset = 0) {
    const te = this.elements

    array[offset] = te[0]
    array[offset + 1] = te[1]
    array[offset + 2] = te[2]
    array[offset + 3] = te[3]

    array[offset + 4] = te[4]
    array[offset + 5] = te[5]
    array[offset + 6] = te[6]
    array[offset + 7] = te[7]

    array[offset + 8] = te[8]
    array[offset + 9] = te[9]
    array[offset + 10] = te[10]
    array[offset + 11] = te[11]

    array[offset + 12] = te[12]
    array[offset + 13] = te[13]
    array[offset + 14] = te[14]
    array[offset + 15] = te[15]

    return array
  }
}

const _v1 = /*@__PURE__*/ new Vector3()
const _x = /*@__PURE__*/ new Vector3()
const _y = /*@__PURE__*/ new Vector3()
const _z = /*@__PURE__*/ new Vector3()
