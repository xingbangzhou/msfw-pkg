import {memo, useCallback, useEffect, useRef} from 'react'
import './index.scss'
import Anim, {AnimHandler} from 'src/components/Anim'
import {Box, Grid} from '@mui/material'
import DrapArea from './DrapArea'
import JSZip from 'jszip'

const AnimView = memo(function AnimView() {
  const handlerRef = useRef<AnimHandler>(null)

  useEffect(() => {
    import('./mock_blend.json').then(data => {
      handlerRef.current?.play(data.default as any)
    })
  }, [])

  const onDrapped = useCallback((fileObj: File) => {
    const ziper = new JSZip()
    ziper.loadAsync(fileObj).then(
      data => {
        console.log(data)
      },
      err => {
        console.log(err)
      },
    )
  }, [])

  return (
    <Box className="animView">
      <Grid className="contentWrap" container spacing={2} justifyContent={'center'}>
        <DrapArea className="animWrap" onDrapped={onDrapped}>
          <Anim className="anim" handlerRef={handlerRef} />
        </DrapArea>
      </Grid>
    </Box>
  )
})

export default AnimView
