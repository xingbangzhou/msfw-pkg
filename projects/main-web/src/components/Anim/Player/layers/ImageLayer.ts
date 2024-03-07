import BaseLayer from './BaseLayer'
import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createTexture} from '../base/glapi'
import * as m4 from '../base/m4'
import {drawTexRectangle} from '../base/primitives'
import {newLayer} from './factories'

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

export default class ImageLayer extends BaseLayer {
  constructor(props: LayerProps) {
    super(props)

    if (props.maskLayer) {
      this.setMaskLayer(newLayer(props.maskLayer))
    }
  }

  private textureInfo?: {
    texture: WebGLTexture
    width: number
    height: number
  }

  get url() {
    return this.props.content || ''
  }

  protected async onInit(gl: ThisWebGLContext) {
    const image = await loadImage(this.url)
    const texture = createTexture(gl)
    if (texture) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      this.textureInfo = {
        texture,
        width: image.width,
        height: image.height,
      }
    }
  }

  protected onDraw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo): void {
    const {textureInfo} = this
    if (!textureInfo) return

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture)

    const texWidth = textureInfo.width
    const texHeight = textureInfo.height
    drawTexRectangle(gl, texWidth, texHeight)
  }

  protected onDestroy(gl?: ThisWebGLContext | undefined): void {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}
