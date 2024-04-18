import {createTexture} from './utils'

export default class Framebuffer {
  constructor(gl: WebGLRenderingContext, no?: boolean) {
    this.gl = gl
    if (no) return
    this.buffer = gl.createFramebuffer()
    this.texture = createTexture(gl)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  gl: WebGLRenderingContext | null = null
  buffer: WebGLFramebuffer | null = null
  texture: WebGLTexture | null = null
  width?: number
  height?: number

  bind() {
    const gl = this.gl
    gl?.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
  }

  viewport(w: number, h: number) {
    const gl = this.gl

    if (w !== this.width || h !== this.height) {
      this.width = w
      this.height = h
      gl?.bindTexture(gl.TEXTURE_2D, this.texture)
      gl?.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl?.bindTexture(gl.TEXTURE_2D, null)
    }

    gl?.viewport(0, 0, w, h)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  destory() {
    this.gl?.deleteFramebuffer(this.buffer)
    this.gl?.deleteTexture(this.texture)
    this.gl = null
    this.buffer = null
    this.texture = null
  }
}
