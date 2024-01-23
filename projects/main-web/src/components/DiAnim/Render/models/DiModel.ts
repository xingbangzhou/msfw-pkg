export default abstract class DiModel {
  constructor() {}

  abstract init(gl: WebGLRenderingContext, program: WebGLProgram): Promise<void>

  abstract render(gl: WebGLRenderingContext, program: WebGLProgram): void

  abstract clear(gl: WebGLRenderingContext): void
}
