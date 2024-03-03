import {ThisWebGLContext, setArribInfo} from './glapi'

export function setRectangle(gl: ThisWebGLContext, x: number, y: number, w: number, h: number) {
  const x1 = 0
  const y1 = 0
  const x2 = w
  const y2 = -h
  const z = 0

  setArribInfo(gl, gl.attribs.position, {
    size: 3,
    data: [x1, y1, z, x2, y1, z, x1, y2, z, x1, y2, z, x2, y1, z, x2, y2, z],
  })
}

// 绘制纹理矩形
export function drawTexRect(gl: ThisWebGLContext, w: number, h: number) {
  setRectangle(gl, 0, 0, w, h)

  const tx1 = 0
  const ty1 = 0
  const tx2 = 1
  const ty2 = 1
  setArribInfo(gl, gl.attribs.texcoord, {
    data: [tx1, ty1, tx2, ty1, tx1, ty2, tx1, ty2, tx2, ty1, tx2, ty2],
  })

  const primitiveType = gl.TRIANGLES
  const count = 6
  gl.drawArrays(primitiveType, 0, count)
}

// 绘制矩形框
export function drawLineRect(gl: ThisWebGLContext, w: number, h: number) {
  const x1 = 0
  const y1 = 0
  const x2 = w
  const y2 = -h
  const z = 0

  setArribInfo(gl, gl.attribs.position, {
    size: 3,
    data: [x1, y1, z, x2, y1, z, x2, y2, z, x1, y2, z],
  })

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

  const tx1 = 0
  const ty1 = 0
  const tx2 = 1
  const ty2 = 1
  setArribInfo(gl, gl.attribs.texcoord, {
    data: [tx1, ty1, tx2, ty1, tx1, ty2, tx1, ty2, tx2, ty1, tx2, ty2],
  })

  const primitiveType = gl.LINE_LOOP
  const count = 4
  gl.drawArrays(primitiveType, 0, count)
}
