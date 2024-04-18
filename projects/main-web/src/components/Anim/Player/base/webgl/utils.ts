import {BlendMode} from '../../types'

export type ThisWebGLContext = WebGLRenderingContext & {
  program?: WebGLProgram
  attribs: {
    position: number
    texcoord: number
  }
  uniforms: {
    matrix: WebGLUniformLocation
    opacity: WebGLUniformLocation
    isAlpha: WebGLUniformLocation
  }
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number) {
  multiplier = multiplier || 1
  const width = (canvas.clientWidth * multiplier) | 0
  const height = (canvas.clientHeight * multiplier) | 0
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

export function createTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture()
  if (!texture) return null

  gl.bindTexture(gl.TEXTURE_2D, texture)
  // 对纹理图像进行y轴反转，因为WebGL纹理坐标系统的t轴（分为t轴和s轴）的方向和图片的坐标系统Y轴方向相反。因此将Y轴进行反转。
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.bindTexture(gl.TEXTURE_2D, null)

  return texture
}

export type AttribInfo = {
  data: number[]
  size?: number
  type?: number
  normalize?: boolean
  stride?: number
  offset?: number
}

export function setArribInfo(gl: WebGLRenderingContext, attribId: number, info: AttribInfo) {
  const vertice = new Float32Array(info.data)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertice, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(attribId)
  gl.vertexAttribPointer(
    attribId,
    info.size || 2,
    info.type || gl.FLOAT,
    info.normalize || false,
    info.stride || 0,
    info.offset || 0,
  )
}

export function blend(gl: WebGLRenderingContext, blendMode?: BlendMode) {
  switch (blendMode) {
    case BlendMode.Add:
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ZERO, gl.ONE)
      break
    case BlendMode.Screen:
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      break
    case BlendMode.Overlay:
      break
    case BlendMode.SoftLight:
      break
    default:
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  }
}
