import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'
import {createTexture, setArribInfo} from '../utils/glutils'
import {identity, multiply, orthographic, scale, translate, translation, yRotate, zRotate} from '../utils/m4'
import DiLayer from './DiLayer'

function loadImage(url: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image()
    image.src = url
    image.crossOrigin = 'Anonymous'
    image.addEventListener(
      'load',
      () => {
        resolve(image)
      },
      false,
    )
  })
}

export default class ImageLayer extends DiLayer {
  constructor(info: DiLayerInfo) {
    super(info)
  }

  private textureInfo?: {
    texture: WebGLTexture
    width: number
    height: number
  }

  get url() {
    return this.info.content
  }

  async init(gl: DiGLRenderingContext) {
    const image = await loadImage(this.url)
    const texture = createTexture(gl)
    if (texture) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      this.textureInfo = {
        texture,
        width: image.width,
        height: image.height,
      }
    }
  }

  render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
    if (!this.textureInfo) return

    const {texture, width: texWidth, height: texHeight} = this.textureInfo

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    setArribInfo(gl, gl.aPositionLocation, {data: [0, 1, 1, 1, 0, 0, 1, 0]})
    setArribInfo(gl, gl.aTexcoordLocation, {data: [0, 1, 1, 1, 0, 0, 1, 0]})

    gl.uniform1i(gl.uLayerTypeLocation, 0)

    let matrix0 = identity()
    matrix0 = translate(matrix0, frameInfo.width * 0.5, frameInfo.height * 0.5, 0)

    let matrix = orthographic(0, frameInfo.width, frameInfo.height, 0, -1, 1)

    matrix = multiply(matrix, matrix0)

    // matrix = translate(matrix, -100, -100, 0)

    matrix = scale(matrix, 250, 301, 1)

    matrix = yRotate(matrix, Math.PI * 0.25)
    // matrix = zRotate(matrix, Math.PI)

    gl.uniformMatrix4fv(gl.uMatrixLocation, false, matrix)

    let texMatrix = translation(0, 0, 0)
    texMatrix = scale(texMatrix, 1, 1, 1)

    // Set the texture matrix.
    gl.uniformMatrix4fv(gl.uTexMatrixLocation, false, texMatrix)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}
