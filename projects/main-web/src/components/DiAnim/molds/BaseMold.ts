export default abstract class DiBaseMold {
  constructor() {}

  abstract init(gl: WebGLRenderingContext, program: WebGLProgram): Promise<void>

  abstract render(gl: WebGLRenderingContext, program: WebGLProgram): void

  abstract clear(gl: WebGLRenderingContext): void
}
