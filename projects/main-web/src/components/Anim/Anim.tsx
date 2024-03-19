import React, {HTMLAttributes, Ref, memo, useEffect, useImperativeHandle, useRef} from 'react'
import {PlayProps} from './Player/types'
import {useForkRef} from '@mui/material/utils'
import DiPlayer from './Player'

export interface AnimHandler {
  play(props: PlayProps): void
}

type DiAnimProps = {
  rootRef?: Ref<HTMLDivElement>
  handlerRef?: Ref<AnimHandler>
} & HTMLAttributes<HTMLDivElement>

const Anim = memo(function DiAnim(props: DiAnimProps) {
  const {handlerRef, rootRef: rootRefProp, ...other} = props
  const playerRef = useRef<DiPlayer>()
  const rootRef = useRef<HTMLDivElement>(null)
  const forkRef = useForkRef(rootRef, rootRefProp)

  useImperativeHandle(handlerRef, () => ({
    play: (opts: PlayProps) => {
      if (!rootRef.current) return

      playerRef.current = new DiPlayer(rootRef.current)
      playerRef.current.load(opts).then(() => {
        playerRef.current?.play()
      })
    },
  }))

  useEffect(() => {
    return () => {
      playerRef.current?.detroy()
    }
  }, [])

  return <div ref={forkRef} {...other}></div>
})

export default Anim
