import {DiGLRenderingContext, DiLayerInfo} from '../types'
import {createTexture, setVertexBufferInfo} from '../utils/textures'
import DiModel from './DiModel'

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

export default class ImageModel extends DiModel {
  constructor(layerInfo: DiLayerInfo) {
    super(layerInfo)
  }

  private image?: HTMLImageElement
  private texture: WebGLTexture | null = null

  async init(gl: DiGLRenderingContext) {
    this.image = await loadImage(this.layerInfo.value)

    this.texture = createTexture(gl)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image)
  }

  render(gl: DiGLRenderingContext) {
    if (!this.image) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    setVertexBufferInfo(gl, {
      position: {
        data: [-0.25, 0.5, 0.25, 0.5, -0.25, -0.0, 0.25, -0.0],
      },
      texcoord: {
        data: [0.0, 1.0, 0.5, 1.0, 0.0, 0.0, 0.5, 0.0],
      },
      fragType: 1,
    })

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.texture)
    this.texture = null
  }
}
