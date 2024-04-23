export type ThisWebGLContext = WebGLRenderingContext & {
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
