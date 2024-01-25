import {DiGLRenderingContext} from '../types'

export function createTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture()
  if (!texture) return null

  gl.bindTexture(gl.TEXTURE_2D, texture)
  // 对纹理图像进行y轴反转，因为WebGL纹理坐标系统的t轴（分为t轴和s轴）的方向和图片的坐标系统Y轴方向相反。因此将Y轴进行反转。
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return texture
}

// export function activeTexImage2D(gl: WebGLRenderingContext, texture: WebGLTexture | null, source: TexImageSource) {
//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texture)
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source)
//   gl.generateMipmap(gl.TEXTURE_2D)
// }

export interface VertexBufferInfo {
  position: {
    numComponents?: number // Default: 2
    data: number[]
  }
  texcoord: {
    numComponents?: number // Default: 2
    data: number[]
  }
  fragType: number
}

export function setVertexBufferInfo(gl: DiGLRenderingContext, bufferInfo: VertexBufferInfo) {
  const {program, aPositionLocation, aTexcoordLocation, uFragTypeLocation} = gl
  if (!program) return

  const {position, texcoord, fragType} = bufferInfo

  // Position
  const positionVertice = new Float32Array(position.data)
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positionVertice, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(aPositionLocation)
  gl.vertexAttribPointer(aPositionLocation, position.numComponents || 2, gl.FLOAT, false, 0, 0)

  // Texcoord
  const textureBuffer = gl.createBuffer()
  const textureVertice = new Float32Array(texcoord.data)
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureVertice, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(aTexcoordLocation)
  gl.vertexAttribPointer(aTexcoordLocation, texcoord.numComponents || 2, gl.FLOAT, false, 0, 0)

  // FragType
  uFragTypeLocation && gl.uniform1i(uFragTypeLocation, fragType)
}
