export type ThisWebGLContext = WebGLRenderingContext & {
  program?: WebGLProgram
  attribs: {
    position: number
    texcoord: number
  }
  uniforms: {
    matrix: WebGLUniformLocation
    texMatrix: WebGLUniformLocation
    maskMode: WebGLUniformLocation
    opacity: WebGLUniformLocation
  }
}

export type Framebuffer = WebGLFramebuffer & {texture: WebGLTexture}

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

export function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) {
    console.error(`An error occurred createShader[${type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'}]: return null`)
    return
  }
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
  }

  return shader
}

export function createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram()
  if (!program) {
    console.error('An error occurred createProgram: return null')
    return undefined
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
  vertexShader && gl.attachShader(program, vertexShader)

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
  fragmentShader && gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`An error occurred linkProgram: ${gl.getProgramInfoLog(program)}`)
  }
  gl.useProgram(program)

  return program
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

export function createFramebuffer(gl: WebGLRenderingContext, width: number, height: number): Framebuffer | null {
  const framebuffer = gl.createFramebuffer() as Framebuffer | null
  if (!framebuffer) return null
  const texture = createTexture(gl)
  if (!texture) {
    gl.deleteFramebuffer(framebuffer)
    return null
  }
  framebuffer.texture = texture
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (gl.FRAMEBUFFER_COMPLETE !== status) {
    console.log('Framebuffer object is incomplete: ', status)
    gl.deleteFramebuffer(framebuffer)
    gl.deleteTexture(texture)
    return null
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return framebuffer
}
