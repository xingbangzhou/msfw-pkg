import {DiWebGLRenderingContext, setArribInfo} from './glapi'

export function drawRect(gl: DiWebGLRenderingContext, w: number, h: number) {
  const x1 = 0
  const x2 = w
  const y1 = -h
  const y2 = 0
  const z = 0

  setArribInfo(gl, gl.attribs.position, {
    size: 3,
    data: [x1, y1, z, x2, y1, z, x1, y2, z, x1, y2, z, x2, y1, z, x2, y2, z],
  })

  const tx1 = 0
  const tx2 = 1
  const ty1 = 1
  const ty2 = 0
  setArribInfo(gl, gl.attribs.texcoord, {
    data: [tx1, ty1, tx2, ty1, tx1, ty2, tx1, ty2, tx2, ty1, tx2, ty2],
  })

  const primitiveType = gl.TRIANGLES
  const count = 6
  gl.drawArrays(primitiveType, 0, count)
}
