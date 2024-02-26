import DiLayer from './Layer'
import {DiFrameInfo} from '../types'
import {DiWebGLRenderingContext} from '../utils/types'
import {createTexture, setArribInfo} from '../utils/glutils'
import * as m4 from '../utils/m4'
import {drawRect} from '../utils/primitives'

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
  private textureInfo?: {
    texture: WebGLTexture
    width: number
    height: number
  }

  get url() {
    return this.props.content || ''
  }

  async init(gl: DiWebGLRenderingContext) {
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

  render(gl: DiWebGLRenderingContext, parentMatrix: m4.MatType, frameInfo: DiFrameInfo) {
    const {textureInfo} = this
    if (!textureInfo) return

    const localMatrix = this.getLocalMatrix(frameInfo)
    if (!localMatrix) return

    const matrix = m4.multiply(parentMatrix, localMatrix)

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture)

    const texWidth = textureInfo.width
    const texHeight = textureInfo.height
    drawRect(gl, 0, 0, texWidth, texHeight)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}
