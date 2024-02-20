export type Mat4Type = Float32Array
export const Mat4 = Float32Array

// Makes an identity matrix.
export function identity(dst?: Mat4Type) {
  dst = dst || new Mat4(16)

  dst[0 * 4 + 0] = 1
  dst[0 * 4 + 1] = 0
  dst[0 * 4 + 2] = 0
  dst[0 * 4 + 3] = 0
  dst[1 * 4 + 0] = 0
  dst[1 * 4 + 1] = 1
  dst[1 * 4 + 2] = 0
  dst[1 * 4 + 3] = 0
  dst[2 * 4 + 0] = 0
  dst[2 * 4 + 1] = 0
  dst[2 * 4 + 2] = 1
  dst[2 * 4 + 3] = 0
  dst[3 * 4 + 0] = 0
  dst[3 * 4 + 1] = 0
  dst[3 * 4 + 2] = 0
  dst[3 * 4 + 3] = 1

  return dst
}

// 正交投影
export function orthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
  dst?: Mat4Type,
) {
  dst = dst || new Mat4(16)

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
  dst[2 * 4 + 2] = 2 / (near - far)
  dst[2 * 4 + 3] = 0
  dst[3 * 4 + 0] = (left + right) / (left - right)
  dst[3 * 4 + 1] = (bottom + top) / (bottom - top)
  dst[3 * 4 + 2] = (near + far) / (near - far)
  dst[3 * 4 + 3] = 1

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

export function translation(tx: number, ty: number, tz: number, dst?: Mat4Type) {
  dst = dst || new Mat4(16)

  dst[0 * 4 + 0] = 1
  dst[0 * 4 + 1] = 0
  dst[0 * 4 + 2] = 0
  dst[0 * 4 + 3] = 0
  dst[1 * 4 + 0] = 0
  dst[1 * 4 + 1] = 1
  dst[1 * 4 + 2] = 0
  dst[1 * 4 + 3] = 0
  dst[2 * 4 + 0] = 0
  dst[2 * 4 + 1] = 0
  dst[2 * 4 + 2] = 1
  dst[2 * 4 + 3] = 0
  dst[3 * 4 + 0] = tx
  dst[3 * 4 + 1] = ty
  dst[3 * 4 + 2] = tz
  dst[3 * 4 + 3] = 1

  return dst
}

/**
 * Multiply by translation matrix.
 * @param {Matrix4} m matrix to multiply
 * @param {number} tx x translation.
 * @param {number} ty y translation.
 * @param {number} tz z translation.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function translate(m: Mat4Type, tx: number, ty: number, tz: number, dst?: Mat4Type) {
  // This is the optimized version of
  // return multiply(m, translation(tx, ty, tz), dst);
  dst = dst || new Mat4(16)

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

  if (m !== dst) {
    dst[0] = m00
    dst[1] = m01
    dst[2] = m02
    dst[3] = m03
    dst[4] = m10
    dst[5] = m11
    dst[6] = m12
    dst[7] = m13
    dst[8] = m20
    dst[9] = m21
    dst[10] = m22
    dst[11] = m23
  }

  dst[12] = m00 * tx + m10 * ty + m20 * tz + m30
  dst[13] = m01 * tx + m11 * ty + m21 * tz + m31
  dst[14] = m02 * tx + m12 * ty + m22 * tz + m32
  dst[15] = m03 * tx + m13 * ty + m23 * tz + m33

  return dst
}

/**
 * Takes two 4-by-4 matrices, a and b, and computes the product in the order
 * that pre-composes b with a.  In other words, the matrix returned will
 * transform by b first and then a.  Note this is subtly different from just
 * multiplying the matrices together.  For given a and b, this function returns
 * the same object in both row-major and column-major mode.
 * @param {Matrix4} a A matrix.
 * @param {Matrix4} b A matrix.
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 */
export function multiply(a: Mat4Type, b: Mat4Type, dst?: Mat4Type) {
  dst = dst || new Mat4(16)
  const b00 = b[0 * 4 + 0]
  const b01 = b[0 * 4 + 1]
  const b02 = b[0 * 4 + 2]
  const b03 = b[0 * 4 + 3]
  const b10 = b[1 * 4 + 0]
  const b11 = b[1 * 4 + 1]
  const b12 = b[1 * 4 + 2]
  const b13 = b[1 * 4 + 3]
  const b20 = b[2 * 4 + 0]
  const b21 = b[2 * 4 + 1]
  const b22 = b[2 * 4 + 2]
  const b23 = b[2 * 4 + 3]
  const b30 = b[3 * 4 + 0]
  const b31 = b[3 * 4 + 1]
  const b32 = b[3 * 4 + 2]
  const b33 = b[3 * 4 + 3]
  const a00 = a[0 * 4 + 0]
  const a01 = a[0 * 4 + 1]
  const a02 = a[0 * 4 + 2]
  const a03 = a[0 * 4 + 3]
  const a10 = a[1 * 4 + 0]
  const a11 = a[1 * 4 + 1]
  const a12 = a[1 * 4 + 2]
  const a13 = a[1 * 4 + 3]
  const a20 = a[2 * 4 + 0]
  const a21 = a[2 * 4 + 1]
  const a22 = a[2 * 4 + 2]
  const a23 = a[2 * 4 + 3]
  const a30 = a[3 * 4 + 0]
  const a31 = a[3 * 4 + 1]
  const a32 = a[3 * 4 + 2]
  const a33 = a[3 * 4 + 3]
  dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
  dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
  dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
  dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
  dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
  dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
  dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
  dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
  dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
  dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
  dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
  dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
  dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
  dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
  dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
  dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
  return dst
}

/**
 * Multiply by an y rotation matrix
 * @param {Matrix4} m matrix to multiply
 * @param {number} angleInRadians amount to rotate
 * @param {Matrix4} [dst] optional matrix to store result
 * @return {Matrix4} dst or a new matrix if none provided
 * @memberOf module:webgl-3d-math
 */
export function yRotate(m: Mat4Type, angleInRadians: number, dst?: Mat4Type) {
  // this is the optimized version of
  // return multiply(m, yRotation(angleInRadians), dst);
  dst = dst || new Mat4(16)

  const m00 = m[0 * 4 + 0]
  const m01 = m[0 * 4 + 1]
  const m02 = m[0 * 4 + 2]
  const m03 = m[0 * 4 + 3]
  const m20 = m[2 * 4 + 0]
  const m21 = m[2 * 4 + 1]
  const m22 = m[2 * 4 + 2]
  const m23 = m[2 * 4 + 3]
  const c = Math.cos(angleInRadians)
  const s = Math.sin(angleInRadians)

  dst[0] = c * m00 - s * m20
  dst[1] = c * m01 - s * m21
  dst[2] = c * m02 - s * m22
  dst[3] = c * m03 - s * m23
  dst[8] = c * m20 + s * m00
  dst[9] = c * m21 + s * m01
  dst[10] = c * m22 + s * m02
  dst[11] = c * m23 + s * m03

  if (m !== dst) {
    dst[4] = m[4]
    dst[5] = m[5]
    dst[6] = m[6]
    dst[7] = m[7]
    dst[12] = m[12]
    dst[13] = m[13]
    dst[14] = m[14]
    dst[15] = m[15]
  }

  return dst
}
