import {DiFrameInfo, DiLayerProps} from '../types'
import * as m4 from '../utils/m4'
import {DiWebGLRenderingContext} from '../utils/types'
import DiTransform3D from './Transform3D'

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
    this.transform3D = new DiTransform3D(props.transform)
  }

  protected props: DiLayerProps
  protected transform3D: DiTransform3D

  abstract init(gl: DiWebGLRenderingContext): Promise<void>

  abstract render(gl: DiWebGLRenderingContext, parentMatrix: m4.MatType, frameInfo: DiFrameInfo): void

  abstract clear(gl?: WebGLRenderingContext): void

  protected getLocalMatrix(frameInfo: DiFrameInfo) {
    const anchorPoint = this.transform3D.getAnchorPoint(frameInfo)
    const position = this.transform3D.getPosition(frameInfo)
    const scale = this.transform3D.getScale(frameInfo)
    const rotation = this.transform3D.getRotation(frameInfo)

    if (!anchorPoint || !position) return null

    let localMatrix = m4.translation(position[0], position[1], position[2])

    if (rotation) {
      localMatrix = m4.xRotate(localMatrix, m4.degToRad(rotation[0]))
      localMatrix = m4.yRotate(localMatrix, m4.degToRad(rotation[1]))
      localMatrix = m4.zRotate(localMatrix, m4.degToRad(rotation[2]))
      const moveOrighMatrix = m4.translation(-anchorPoint[0], anchorPoint[1], 0)
      localMatrix = m4.multiply(localMatrix, moveOrighMatrix)
    }
    if (scale) {
      localMatrix = m4.scale(localMatrix, (scale[0] || 100) * 0.01, (scale[1] || 100) * 0.01, (scale[2] || 100) * 0.01)
    }

    return localMatrix
  }
}
