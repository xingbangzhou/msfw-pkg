import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, degToRad} from '../base'
import * as m4 from '../base/m4'
import {Transform3D} from '../base/transforms'

export const VertexShader = `
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
    vec4 texColor = texture2D(u_texture, v_texcoord);
    if(texColor.a < 0.1)
        discard;

    gl_FragColor = texColor;
  }
`

export default abstract class BaseLayer {
  constructor(props: LayerProps) {
    this.props = props
    this.transform3D = new Transform3D(props.transform)
  }

  protected props: LayerProps
  protected transform3D: Transform3D

  abstract init(gl: ThisWebGLContext): Promise<void>

  abstract render(gl: ThisWebGLContext, parentMatrix: m4.Mat4, frameInfo: FrameInfo): void

  abstract clear(gl?: WebGLRenderingContext): void

  protected getLocalMatrix({frameId, width, height}: FrameInfo) {
    const anchorPoint = this.transform3D.getAnchorPoint(frameId)
    const position = this.transform3D.getPosition(frameId)
    const scale = this.transform3D.getScale(frameId)
    const rotation = this.transform3D.getRotation(frameId)

    if (!anchorPoint || !position) return null

    const [x, y, z] = position
    let localMatrix = m4.translation(x, -y, -z)

    if (rotation) {
      localMatrix = m4.xRotate(localMatrix, degToRad(rotation[0]))
      localMatrix = m4.yRotate(localMatrix, degToRad(360 - rotation[1]))
      localMatrix = m4.zRotate(localMatrix, degToRad(360 - rotation[2]))
    }
    if (scale) {
      localMatrix = m4.scale(localMatrix, (scale[0] || 100) * 0.01, (scale[1] || 100) * 0.01, (scale[2] || 100) * 0.01)
    }

    const moveOrighMatrix = m4.translation(-anchorPoint[0], anchorPoint[1], 0)
    localMatrix = m4.multiply(localMatrix, moveOrighMatrix)

    return localMatrix
  }
}
