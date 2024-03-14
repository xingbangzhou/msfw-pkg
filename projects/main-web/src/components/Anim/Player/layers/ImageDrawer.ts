import {ThisWebGLContext, createTexture, drawTexRectangle, m4} from '../base'
import {FrameInfo} from '../types'
import AbstractDrawer from './AbstractDrawer'
import Layer from './Layer'

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

export default class ImageDrawer extends AbstractDrawer {
  constructor(layerRef: Layer) {
    super(layerRef)
  }

  private textureInfo?: {
    texture: WebGLTexture
    width: number
    height: number
  }

  private textureInfos: Record<
    number,
    {
      texture: WebGLTexture
      width: number
      height: number
    }
  > = {}

  get url() {
    return this.layerRef.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    // const image = await loadImage(this.url)
    // const texture = createTexture(gl)
    // if (texture) {
    //   gl.bindTexture(gl.TEXTURE_2D, texture)
    //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    //   this.textureInfo = {
    //     texture,
    //     width: image.width,
    //     height: image.height,
    //   }
    // }

    const layerName = this.layerRef.props.name
    for (let frameId = 0; frameId <= 120; frameId++) {
      const url = `http://localhost:5002/q1/${layerName}_${`0000${frameId}`.slice(-4)}.png`
      const image = await loadImage(url)
      const texture = createTexture(gl)
      if (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        const textureInfo = {
          texture,
          width: image.width,
          height: image.height,
        }
        this.textureInfos[frameId] = textureInfo
      }
    }
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    // Test
    const frameId = frameInfo.frameId
    this.textureInfo = this.textureInfos[frameId]
    if (!this.textureInfo) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture)

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.layerRef.width || this.textureInfo.width
    const height = this.layerRef.height || this.textureInfo.height

    drawTexRectangle(gl, width, height)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}
