import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'
import {ortho, scale, scaling, translate, zRotate} from '../utils/m4'
import {setVertexBufferInfo} from '../utils/textures'
import DiModel from './DiModel'

export default class RectangleModel extends DiModel {
  constructor(layerInfo: DiLayerInfo) {
    super(layerInfo)
  }

  private image?: HTMLImageElement

  async init(gl: DiGLRenderingContext) {}

  render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
    setVertexBufferInfo(gl, {
      position: {
        data: [0, 1, 1, 1, 0, 0, 1, 0],
      },
      texcoord: {
        data: [0, 0, 1, 0, 0, 1, 1, 1],
      },
    })

    let matrix = ortho(0, gl.canvas.width, gl.canvas.height, 0)

    matrix = translate(matrix, 0, 0, 0)

    matrix = scale(matrix, 200, 200, 1)

    gl.uMatrixLocation && gl.uniformMatrix4fv(gl.uMatrixLocation, false, matrix)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl?: WebGLRenderingContext) {}
}
