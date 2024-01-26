import {DiGLRenderingContext} from '../types'

export function setFrameBuffer(gl: DiGLRenderingContext, fbo: WebGLFramebuffer | null, width: number, height: number) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.viewport(0, 0, width, height)
}
