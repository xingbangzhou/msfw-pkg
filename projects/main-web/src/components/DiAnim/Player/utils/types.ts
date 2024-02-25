export type DiWebGLRenderingContext = WebGLRenderingContext & {
  program?: WebGLProgram
  attribs: {
    position: number
    texcoord: number
  }
  uniforms: {
    matrix: WebGLUniformLocation
    texMatrix: WebGLUniformLocation
  }
}

export class Rect {
  static makeEmpty() {
    return new Rect(0, 0, 0, 0)
  }

  static makeWH(w: number, h: number) {
    return new Rect(0, 0, w, h)
  }

  constructor(l = 0, t = 0, r = 0, b = 0) {
    this.left = l
    this.top = t
    this.right = r
    this.bottom = b
  }

  /**
   * smaller x-axis bounds.
   */
  left: number
  /**
   * smaller y-axis bounds.
   */
  top: number
  /**
   * larger x-axis bounds.
   */
  right: number
  /**
   * larger y-axis bounds.
   */
  bottom: number

  isEmpty() {
    return !(this.left < this.right && this.top < this.bottom)
  }

  offset(dx: number, dy: number) {
    this.left += dx
    this.top += dy
    this.right += dx
    this.bottom += dy
  }
}

export class Point {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  x: number
  y: number
}

export class Size {
  constructor(w = 0, h = 0) {
    this.width = w
    this.height = h
  }

  width: number
  height: number
}

// 3D
export class Point3D {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  x: number
  y: number
  z: number
}
