import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'
import {ortho, scale, scaling, translate, zRotate} from '../utils/m4'
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

  render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo) {
    if (!this.image) return

    // gl.activeTexture(gl.TEXTURE0)
    // gl.bindTexture(gl.TEXTURE_2D, this.texture)

    // setVertexBufferInfo(gl, {
    //   position: {
    //     data: [-1, 1, 1, 1, -1, -1, 1, -1],
    //   },
    //   texcoord: {
    //     data: [0, 1, 1, 1, 0, 0, 1, 0],
    //   },
    // })

    // gl.uFragTypeLocation && gl.uniform1i(gl.uFragTypeLocation, 1)

    // let matrix = orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)

    // matrix = translate(matrix, 0.25, 0.25, 0)

    // gl.uMatrixLocation && gl.uniformMatrix4fv(gl.uMatrixLocation, false, matrix)

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    const drawInfo = {
      x: 0 * gl.canvas.width,
      y: 0 * gl.canvas.height,
      xScale: 1.0,
      yScale: 1.0,
      offX: 0,
      offY: 0,
      rotation: 0 * Math.PI,
      width: 1,
      height: 1,
      textureInfo: {
        width: this.image.width,
        height: this.image.height,
      },
    }

    const dstX = drawInfo.x
    const dstY = drawInfo.y
    const dstWidth = drawInfo.textureInfo.width * drawInfo.xScale
    const dstHeight = drawInfo.textureInfo.height * drawInfo.yScale

    const srcX = drawInfo.textureInfo.width * drawInfo.offX
    const srcY = drawInfo.textureInfo.height * drawInfo.offY
    const srcWidth = drawInfo.textureInfo.width * drawInfo.width
    const srcHeight = drawInfo.textureInfo.height * drawInfo.height
    const texWidth = drawInfo.textureInfo.width
    const texHeight = drawInfo.textureInfo.height
    const rotation = drawInfo.rotation

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    setVertexBufferInfo(gl, {
      position: {
        data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      },
      texcoord: {
        data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      },
    })

    gl.uFragTypeLocation && gl.uniform1i(gl.uFragTypeLocation, 1)

    let matrix = ortho(0, gl.canvas.width, gl.canvas.height, 0)

    // this matrix will translate our quad to dstX, dstY
    matrix = translate(matrix, dstX, dstY, 0)

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = scale(matrix, dstWidth, dstHeight, 1)

    // Set the matrix.
    gl.uMatrixLocation && gl.uniformMatrix4fv(gl.uMatrixLocation, false, matrix)

    let texMatrix = scaling(1 / texWidth, 1 / texHeight, 1)

    // We need to pick a place to rotate around
    // We'll move to the middle, rotate, then move back
    texMatrix = translate(texMatrix, texWidth * 0.5, texHeight * 0.5, 0)
    // texMatrix = zRotate(texMatrix, rotation)
    texMatrix = translate(texMatrix, texWidth * -0.5, texHeight * -0.5, 0)

    // because were in pixel space
    // the scale and translation are now in pixels
    texMatrix = translate(texMatrix, srcX, srcY, 0)
    texMatrix = scale(texMatrix, srcWidth, srcHeight, 1)

    gl.uTexMatrixLocation && gl.uniformMatrix4fv(gl.uTexMatrixLocation, false, texMatrix)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.texture)
    this.texture = null
  }
}
