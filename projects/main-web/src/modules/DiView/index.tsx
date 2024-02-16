import {memo, useEffect, useRef} from 'react'
import './index.scss'
import DiAnim, {DiAnimHandler} from 'src/components/DiAnim'
import {Box, Button, Grid, Paper, TextField} from '@mui/material'
import {mocks} from './mocks'

const DiView = memo(function DiView() {
  const handlerRef = useRef<DiAnimHandler>(null)

  useEffect(() => {
    handlerRef.current?.play(mocks)
  }, [])

  return (
    <Box className="diView">
      <Grid className="contentWrap" container spacing={2} justifyContent={'center'}>
        <Grid item>
          <Paper className="leftBar" variant="elevation" elevation={0} square>
            <Box className="box">
              <TextField label="资源路劲" />
            </Box>
            <Box className="box">
              <Button variant="contained">提交</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Box className="diAnimWrap">
            <DiAnim className="diAnim" handlerRef={handlerRef} />
          </Box>
        </Grid>
        <Grid item>
          <Paper className="rightBar" variant="elevation" elevation={0} square></Paper>
        </Grid>
      </Grid>
    </Box>
  )
})

export default DiView
