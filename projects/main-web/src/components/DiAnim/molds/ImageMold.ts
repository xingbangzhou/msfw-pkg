import {loadImage} from '../glutils'
import DiBaseMold from './BaseMold'

interface ImageMoldProps {
  url: string
  texIndex: number
}

export default class ImageMold extends DiBaseMold {
  constructor(props: ImageMoldProps) {
    super()

    this.props = props
  }

  private props: ImageMoldProps
  private image?: HTMLImageElement
  private texture!: WebGLTexture

  async init(gl: WebGLRenderingContext, program: WebGLProgram) {
    this.image = await loadImage(this.props.url)

    const texture = (this.texture = gl.createTexture() as WebGLTexture)

    // gl.activeTexture(gl.TEXTURE0 + this.props.texIndex)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // const u_imageLocation = gl.getUniformLocation(program, `u_image${this.props.texIndex}`)
    // gl.uniform1i(u_imageLocation, this.props.texIndex)
  }

  render(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Position Vertex
    const positionVertice = new Float32Array([-0.25, 0.5, 0.25, 0.5, -0.25, -0.0, 0.25, -0.0])
    const positionBuffer = gl.createBuffer()
    const aPositionLocation = gl.getAttribLocation(program, 'a_position')
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positionVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aPositionLocation)
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0)

    // Texture Vertex
    const textureBuffer = gl.createBuffer()
    const textureVertice = new Float32Array([0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0])
    const aTexcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, textureVertice, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aTexcoordLocation)
    gl.vertexAttribPointer(aTexcoordLocation, 2, gl.FLOAT, false, 0, 0)

    const uTexmodeLocation = gl.getUniformLocation(program, 'u_moldType')
    gl.uniform1i(uTexmodeLocation, 1)

    gl.activeTexture(gl.TEXTURE0 + this.props.texIndex)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image!)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  clear(gl: WebGLRenderingContext) {
    gl.deleteTexture(this.texture)
  }
}
