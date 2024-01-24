import {activeTexImage2D, createTexture, setVertexBufferInfo} from '../../utils/textures'
import DiModel from './DiModel'

interface ImageModelProps {
  url: string
}

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
  constructor(props: ImageModelProps) {
    super()

    this.props = props
  }

  private props: ImageModelProps
  private image?: HTMLImageElement
  private _texture: WebGLTexture | null = null

  async init(gl: WebGLRenderingContext, program: WebGLProgram) {
    this.image = await loadImage(this.props.url)

    this._texture = createTexture(gl)
  }

  render(gl: WebGLRenderingContext, program: WebGLProgram) {
    if (!this.image) return

    activeTexImage2D(gl, this._texture, this.image)

    setVertexBufferInfo(gl, program, {
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

  clear(gl: WebGLRenderingContext) {
    gl.deleteTexture(this._texture)
    this._texture = null
  }
}
