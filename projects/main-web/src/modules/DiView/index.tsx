import {memo, useEffect, useRef} from 'react'
import './index.scss'
import DiAnim, {DiAnimHandler} from 'src/components/DiAnim'
import {Box, Grid} from '@mui/material'
import {mocks} from './mocks'

const DiView = memo(function DiView() {
  const handlerRef = useRef<DiAnimHandler>(null)

  useEffect(() => {
    handlerRef.current?.play(mocks)
  }, [])

  return (
    <Box className="diView">
      <Grid className="contentWrap" container spacing={2} justifyContent={'center'}>
        <Box className="diAnimWrap">
          <DiAnim className="diAnim" handlerRef={handlerRef} />
        </Box>
      </Grid>
    </Box>
  )
})

export default DiView
