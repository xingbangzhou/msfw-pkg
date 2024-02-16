export type Mat4Type = Float32Array
export const Mat4 = Float32Array

// 正交投影
export function ortho(left: number, right: number, bottom: number, top: number) {
  const dst = new Mat4(16)

  dst[0 * 4 + 0] = 2 / (right - left)
  dst[0 * 4 + 1] = 0
  dst[0 * 4 + 2] = 0
  dst[0 * 4 + 3] = 0
  dst[1 * 4 + 0] = 0
  dst[1 * 4 + 1] = 2 / (top - bottom)
  dst[1 * 4 + 2] = 0
  dst[1 * 4 + 3] = 0
  dst[2 * 4 + 0] = 0
  dst[2 * 4 + 1] = 0
  dst[2 * 4 + 2] = 1
  dst[2 * 4 + 3] = 0
  dst[3 * 4 + 0] = (left + right) / (left - right)
  dst[3 * 4 + 1] = (bottom + top) / (bottom - top)
  dst[3 * 4 + 2] = 0
  dst[3 * 4 + 3] = 0

  return dst
}

export function translate(m: Mat4Type, tx: number, ty: number, tz: number) {
  const dst = new Mat4(16)

  const m00 = m[0]
  const m01 = m[1]
  const m02 = m[2]
  const m03 = m[3]
  const m10 = m[1 * 4 + 0]
  const m11 = m[1 * 4 + 1]
  const m12 = m[1 * 4 + 2]
  const m13 = m[1 * 4 + 3]
  const m20 = m[2 * 4 + 0]
  const m21 = m[2 * 4 + 1]
  const m22 = m[2 * 4 + 2]
  const m23 = m[2 * 4 + 3]
  const m30 = m[3 * 4 + 0]
  const m31 = m[3 * 4 + 1]
  const m32 = m[3 * 4 + 2]
  const m33 = m[3 * 4 + 3]

  dst[0 * 4 + 0] = m00
  dst[0 * 4 + 1] = m01
  dst[0 * 4 + 2] = m02
  dst[0 * 4 + 3] = m03
  dst[1 * 4 + 0] = m10
  dst[1 * 4 + 1] = m11
  dst[1 * 4 + 2] = m12
  dst[1 * 4 + 3] = m13
  dst[2 * 4 + 0] = m20
  dst[2 * 4 + 1] = m21
  dst[2 * 4 + 2] = m22
  dst[2 * 4 + 3] = m23
  dst[3 * 4 + 0] = m00 * tx + m10 * ty + m20 * tz + m30
  dst[3 * 4 + 1] = m01 * tx + m11 * ty + m21 * tz + m31
  dst[3 * 4 + 2] = m02 * tx + m12 * ty + m22 * tz + m32
  dst[3 * 4 + 3] = m03 * tx + m13 * ty + m23 * tz + m33

  return dst
}

export function scaling(sx: number, sy: number, sz: number) {
  const dst = new Mat4(16)

  dst[0 * 4 + 0] = sx
  dst[0 * 4 + 1] = 0
  dst[0 * 4 + 2] = 0
  dst[0 * 4 + 3] = 0
  dst[1 * 4 + 0] = 0
  dst[1 * 4 + 1] = sy
  dst[1 * 4 + 2] = 0
  dst[1 * 4 + 3] = 0
  dst[2 * 4 + 0] = 0
  dst[2 * 4 + 1] = 0
  dst[2 * 4 + 2] = sz
  dst[2 * 4 + 3] = 0
  dst[3 * 4 + 0] = 0
  dst[3 * 4 + 1] = 0
  dst[3 * 4 + 2] = 0
  dst[3 * 4 + 3] = 1

  return dst
}

export function scale(m: Mat4Type, sx: number, sy: number, sz: number) {
  // This is the optimized version of
  // return multiply(m, scaling(sx, sy, sz), dst);
  const dst = new Mat4(16)

  dst[0 * 4 + 0] = sx * m[0 * 4 + 0]
  dst[0 * 4 + 1] = sx * m[0 * 4 + 1]
  dst[0 * 4 + 2] = sx * m[0 * 4 + 2]
  dst[0 * 4 + 3] = sx * m[0 * 4 + 3]
  dst[1 * 4 + 0] = sy * m[1 * 4 + 0]
  dst[1 * 4 + 1] = sy * m[1 * 4 + 1]
  dst[1 * 4 + 2] = sy * m[1 * 4 + 2]
  dst[1 * 4 + 3] = sy * m[1 * 4 + 3]
  dst[2 * 4 + 0] = sz * m[2 * 4 + 0]
  dst[2 * 4 + 1] = sz * m[2 * 4 + 1]
  dst[2 * 4 + 2] = sz * m[2 * 4 + 2]
  dst[2 * 4 + 3] = sz * m[2 * 4 + 3]
  dst[3 * 4 + 0] = m[12]
  dst[3 * 4 + 1] = m[13]
  dst[3 * 4 + 2] = m[14]
  dst[3 * 4 + 3] = m[15]

  return dst
}

export function zRotate(m: Mat4Type, angleInRadians: number, dst?: Mat4Type) {
  // This is the optimized version of
  // return multiply(m, zRotation(angleInRadians), dst);
  dst = dst || new Mat4(16)

  const m00 = m[0 * 4 + 0]
  const m01 = m[0 * 4 + 1]
  const m02 = m[0 * 4 + 2]
  const m03 = m[0 * 4 + 3]
  const m10 = m[1 * 4 + 0]
  const m11 = m[1 * 4 + 1]
  const m12 = m[1 * 4 + 2]
  const m13 = m[1 * 4 + 3]
  const c = Math.cos(angleInRadians)
  const s = Math.sin(angleInRadians)

  dst[0 * 4 + 0] = c * m00 + s * m10
  dst[0 * 4 + 1] = c * m01 + s * m11
  dst[0 * 4 + 2] = c * m02 + s * m12
  dst[0 * 4 + 3] = c * m03 + s * m13
  dst[1 * 4 + 0] = c * m10 - s * m00
  dst[1 * 4 + 1] = c * m11 - s * m01
  dst[1 * 4 + 2] = c * m12 - s * m02
  dst[1 * 4 + 3] = c * m13 - s * m03

  if (m !== dst) {
    dst[2 * 4 + 0] = m[2 * 4 + 0]
    dst[2 * 4 + 1] = m[2 * 4 + 1]
    dst[2 * 4 + 2] = m[2 * 4 + 2]
    dst[2 * 4 + 3] = m[2 * 4 + 3]
    dst[3 * 4 + 0] = m[3 * 4 + 0]
    dst[3 * 4 + 1] = m[3 * 4 + 1]
    dst[3 * 4 + 2] = m[3 * 4 + 2]
    dst[3 * 4 + 3] = m[3 * 4 + 3]
  }

  return dst
}
