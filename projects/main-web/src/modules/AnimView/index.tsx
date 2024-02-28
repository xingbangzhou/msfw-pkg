import {memo, useEffect, useRef} from 'react'
import './index.scss'
import Anim, {AnimHandler} from 'src/components/Anim'
import {Box, Grid} from '@mui/material'
import {mocks} from './mocks'

const DiView = memo(function DiView() {
  const handlerRef = useRef<AnimHandler>(null)

  useEffect(() => {
    handlerRef.current?.play(mocks)
  }, [])

  return (
    <Box className="animView">
      <Grid className="contentWrap" container spacing={2} justifyContent={'center'}>
        <Box className="animWrap">
          <Anim className="anim" handlerRef={handlerRef} />
        </Box>
      </Grid>
    </Box>
  )
})

export default DiView
