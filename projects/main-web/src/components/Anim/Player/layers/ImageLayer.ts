import BaseLayer from './BaseLayer'
import {FrameInfo, LayerProps} from '../types'
import {ThisWebGLContext, createTexture, setArribInfo} from '../base/glapi'
import * as m4 from '../base/m4'
import {drawLineRectangle, drawTexRectangle, setRectangle} from '../base/primitives'
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
  }

  private textureInfo?: {
    texture: WebGLTexture
    width: number
    height: number
  }

  // 测试Mask
  private maskTextureInfo?: {
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

    // 测试Mask
    const maskImage = await loadImage('http://localhost:5002/mask.png')
    const maskTexture = createTexture(gl)
    if (maskTexture) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskImage)
      this.maskTextureInfo = {
        texture: maskTexture,
        width: maskImage.width,
        height: maskImage.height,
      }
    }
  }

  private framebuffer: (WebGLFramebuffer & {texture: WebGLTexture}) | null = null

  protected onDraw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo): void {
    const {textureInfo} = this
    if (!textureInfo) return

    const w = textureInfo.width
    const h = textureInfo.height

    // 测试Mask
    const maskTextureInfo = this.maskTextureInfo
    if (maskTextureInfo && this.props.name === 'testpic') {
      const framebuffer = this.framebuffer || (gl.createFramebuffer() as WebGLFramebuffer & {texture: WebGLTexture})

      // 创建TextureBuffer
      const frameTexture = createTexture(gl) as WebGLTexture
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      framebuffer.texture = frameTexture
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameTexture, 0)

      const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
      if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('Frame buffer object is incomplete: ' + e.toString())
      }

      // const depthbuffer = gl.createRenderbuffer()
      // gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer)
      // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h)
      // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.bindTexture(gl.TEXTURE_2D, null)
      // gl.bindRenderbuffer(gl.RENDERBUFFER, null)

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.viewport(0, 0, w, h)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, maskTextureInfo.texture)

      gl.uniform1i(gl.uniforms.test, 0)
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, m4.identity())
      {
        const x1 = -1
        const y1 = 1
        const x2 = 1
        const y2 = -1
        const z = 0

        setArribInfo(gl, gl.attribs.position, {
          size: 3,
          data: [x1, y1, z, x2, y1, z, x1, y2, z, x1, y2, z, x2, y1, z, x2, y2, z],
        })

        const tx1 = 0
        const ty1 = 0
        const tx2 = 1
        const ty2 = 1
        setArribInfo(gl, gl.attribs.texcoord, {
          data: [tx1, ty1, tx2, ty1, tx1, ty2, tx1, ty2, tx2, ty1, tx2, ty2],
        })

        const primitiveType = gl.TRIANGLES
        const count = 6
        gl.drawArrays(primitiveType, 0, count)
      }

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // 绘制图
      gl.uniform1i(gl.uniforms.test, 1)

      gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)

      drawTexRectangle(gl, w, h)

      // gl.uniform1i(gl.uniforms.test, 1)
      // gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
      // gl.activeTexture(gl.TEXTURE0)
      // gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture)

      // gl.activeTexture(gl.TEXTURE1)
      // gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture)

      // drawTexRectangle(gl, w, h)
    }
  }

  protected onDestroy(gl?: ThisWebGLContext | undefined): void {
    gl?.deleteTexture(this.textureInfo?.texture || null)
    this.textureInfo = undefined
  }
}
