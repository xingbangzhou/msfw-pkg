export enum ShaderType {
  Vertex = 'vertex',
  Fragment = 'fragment',
}

export function createProgram(gl: WebGLRenderingContext, shaders: Record<ShaderType, string>) {
  const program = gl.createProgram()
  if (!program) {
    console.error('An error occurred createProgram: return null')
    return null
  }

  for (const type in shaders) {
    const source = shaders[type as ShaderType]
    const shader = gl.createShader(type === ShaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)
    if (!shader) {
      console.error(
        `An error occurred createShader[${type === ShaderType.Vertex ? 'Vertex' : 'Fragment'}]: return null`,
      )
      continue
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
    }

    gl.attachShader(program, shader)
  }

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`An error occurred linkProgram: ${gl.getProgramInfoLog(program)}`)
  }
  gl.useProgram(program)

  return program
}
