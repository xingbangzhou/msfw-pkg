export function degToRad(d: number) {
  return (d * Math.PI) / 180
}

// color：0~1， opacity: 0~100 默认100
export function rgba(color: number[], opacity?: number) {
  opacity = opacity ?? 100
  color[0] = color[0] || 0
  color[1] = color[1] || 0
  color[2] = color[2] || 0
  color[3] = color[3] ?? 1
  return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3] * opacity * 0.01})`
}
