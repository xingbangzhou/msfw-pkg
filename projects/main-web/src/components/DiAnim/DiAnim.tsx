import React, {HTMLAttributes, Ref, memo, useEffect, useImperativeHandle, useRef} from 'react'
import {DiRenderOptions} from './Render/types'
import {useForkRef} from '@mui/material/utils'
import DiRender from './Render'

export interface DiAnimHandler {
  play(opts: DiRenderOptions): void
  clear(): void
}

type DiAnimProps = {
  rootRef?: Ref<HTMLDivElement>
  handlerRef?: Ref<DiAnimHandler>
} & HTMLAttributes<HTMLDivElement>

const DiAnim = memo(function DiAnim(props: DiAnimProps) {
  const {handlerRef, rootRef: rootRefProp, ...other} = props
  const renderRef = useRef<DiRender>()
  const rootRef = useRef<HTMLDivElement>(null)
  const forkRef = useForkRef(rootRef, rootRefProp)

  useImperativeHandle(handlerRef, () => ({
    play: (opts: DiRenderOptions) => {
      if (renderRef.current) renderRef.current.clear()
      if (!rootRef.current) {
        console.error('[DiAnim]: play', 'container is null')
      } else {
        renderRef.current = new DiRender(rootRef.current, opts)
        renderRef.current.play()
      }
    },
    clear: () => {
      renderRef.current?.clear()
    },
  }))

  useEffect(() => {
    return () => {
      renderRef.current?.clear()
    }
  }, [])

  return <div ref={forkRef} {...other}></div>
})

export default DiAnim
