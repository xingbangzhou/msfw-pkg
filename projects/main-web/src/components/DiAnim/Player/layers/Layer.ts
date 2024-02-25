import {DiFrameInfo, DiLayerProps} from '../types'
import {MatType} from '../utils/m4'
import {DiWebGLRenderingContext} from '../utils/types'

export const VertexShader = `
  precision highp float;
  attribute vec4 a_position;  // 接受顶点坐标
  attribute vec2 a_texcoord;  // 接受纹理坐标

  uniform mat4 u_matrix;  // 顶点矩阵
  uniform mat4 u_texMatrix; // 纹理矩阵

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_matrix * a_position;

    v_texcoord = a_texcoord;
  }
`

export const FragmenShader = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main(void) {
    gl_FragColor = vec4(texture2D(u_texture, v_texcoord).rgb, 1.0);
  }
`

export default abstract class DiLayer {
  constructor(props: DiLayerProps) {
    this.props = props
  }

  protected props: DiLayerProps

  abstract init(gl: DiWebGLRenderingContext): Promise<void>

  abstract render(gl: DiWebGLRenderingContext, parentMatrix: MatType, frameInfo: DiFrameInfo): void

  abstract clear(gl?: WebGLRenderingContext): void
}
