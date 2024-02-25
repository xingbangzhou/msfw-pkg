import DiLayer from './Layer'
import {DiFrameInfo} from '../types'
import {DiWebGLRenderingContext} from '../utils/types'
import {createTexture, setArribInfo} from '../utils/glutils'
import {xRotate, yRotate, zRotate, scale, multiply, translation, MatType} from '../utils/m4'

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
    return this.props.content
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

  render(gl: DiWebGLRenderingContext, parentMatrix: MatType, frameInfo: DiFrameInfo) {
    const {textureInfo} = this
    if (!textureInfo) return

    // 本地坐标系
    const texWidth = textureInfo.width
    const texHeight = textureInfo.height

    const translateXYZ = [-texWidth * 0.5, texHeight * 0.5, 0]
    const rotation = [degToRad(0), degToRad(0), degToRad(0)]
    let localMatrix = translation(translateXYZ[0], translateXYZ[1], translateXYZ[2])
    localMatrix = xRotate(localMatrix, rotation[0])
    localMatrix = yRotate(localMatrix, rotation[1])
    localMatrix = zRotate(localMatrix, rotation[2])
    localMatrix = scale(localMatrix, 1, 1, 1)

    const matrix = multiply(parentMatrix, localMatrix)

    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture)

    drawRect(gl, 0, 0, texWidth, texHeight)
  }

  clear(gl?: WebGLRenderingContext) {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}

function degToRad(d: number) {
  return (d * Math.PI) / 180
}

function drawRect(gl: DiWebGLRenderingContext, x: number, y: number, w: number, h: number) {
  const x1 = 0
  const x2 = w
  const y1 = -h
  const y2 = 0
  const z = 0

  setArribInfo(gl, gl.attribs.position, {
    size: 3,
    data: [x1, y1, z, x2, y1, z, x1, y2, z, x1, y2, z, x2, y1, z, x2, y2, z],
  })

  const tx1 = 0
  const tx2 = 1
  const ty1 = 1
  const ty2 = 0
  setArribInfo(gl, gl.attribs.texcoord, {
    data: [tx1, ty1, tx2, ty1, tx1, ty2, tx1, ty2, tx2, ty1, tx2, ty2],
  })

  const primitiveType = gl.TRIANGLES
  const count = 6
  gl.drawArrays(primitiveType, 0, count)
}
