import {createTexture} from './utils'

export default class Framebuffer {
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.reset()
  }

  gl: WebGLRenderingContext | null = null
  buffer: WebGLFramebuffer | null = null
  texture: WebGLTexture | null = null
  private texWidth?: number
  private texHeight?: number

  bind() {
    const gl = this.gl
    gl?.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
  }

  viewport(w: number, h: number, noClr?: boolean) {
    const gl = this.gl

    if (w !== this.texWidth || h !== this.texHeight) {
      this.texWidth = w
      this.texHeight = h
      gl?.bindTexture(gl.TEXTURE_2D, this.texture)
      gl?.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl?.bindTexture(gl.TEXTURE_2D, null)
    }

    gl?.viewport(0, 0, w, h)
    if (!noClr) {
      gl?.clear(gl.COLOR_BUFFER_BIT)
    }
  }

  reset() {
    const texture = this.texture
    const gl = this.gl

    if (gl) {
      this.buffer && gl.deleteFramebuffer(this.buffer)

      this.buffer = gl.createFramebuffer()
      this.texture = createTexture(gl)

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      this.texWidth = undefined
      this.texHeight = undefined
    }

    return texture
  }

  destory() {
    this.gl?.deleteFramebuffer(this.buffer)
    this.gl?.deleteTexture(this.texture)
    this.gl = null
    this.buffer = null
    this.texture = null
  }
}
