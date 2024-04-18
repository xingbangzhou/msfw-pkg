import {shaderGlsls} from '../base/shader'
import {Program, ThisWebGLContext} from '../base/webgl'
import {TrackMatteType} from '../types'

let curProgram: Program | null = null

export const setProgram = (gl: ThisWebGLContext) => {
  if (curProgram?.vertexGlsl !== shaderGlsls.vertexGlsl || curProgram?.fragmentGlsl !== shaderGlsls.fragmentGlsl) {
    curProgram?.destroy()
    curProgram = new Program(gl, {vertexShader: shaderGlsls.vertexGlsl, fragmentShader: shaderGlsls.fragmentGlsl})
    curProgram.use()
  }
}

export const setMaskProgram = (gl: ThisWebGLContext, trackType: TrackMatteType) => {
  let fragmentGlsl = ''
  switch (trackType) {
    case TrackMatteType.ALPHA:
      fragmentGlsl = shaderGlsls.maskAlphaGlsl
      break
    case TrackMatteType.ALPHA_INVERTED:
      fragmentGlsl = shaderGlsls.maskAlphaInvertedGlsl
      break
    case TrackMatteType.LUMA:
      fragmentGlsl = shaderGlsls.maskLumaGlsl
      break
    case TrackMatteType.LUMA_INVERTED:
      fragmentGlsl = shaderGlsls.maskLumaInvertedGlsl
      break
  }
  if (!fragmentGlsl) return

  curProgram = new Program(gl, {vertexShader: shaderGlsls.vertexGlsl, fragmentShader: fragmentGlsl})
  curProgram.use()
}

const simpleVertexGlsl = `
attribute vec4 a_position;  // 接受顶点坐标
attribute vec2 a_texcoord;  // 接受纹理坐标

varying vec2 v_texcoord;

void main() {
  gl_Position = a_position;

  v_texcoord = a_texcoord;
}
`

const simpleFragmentGlsl = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);

  gl_FragColor = texColor;
}
`

export const setSimpleProgram = (gl: ThisWebGLContext) => {
  if (curProgram?.vertexGlsl !== simpleVertexGlsl || curProgram?.fragmentGlsl !== simpleFragmentGlsl) {
    curProgram?.destroy()
    curProgram = new Program(gl, {vertexShader: simpleVertexGlsl, fragmentShader: simpleFragmentGlsl})
    curProgram.use()
  }
}
