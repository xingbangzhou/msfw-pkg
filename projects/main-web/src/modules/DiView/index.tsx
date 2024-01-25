import {memo, useEffect, useRef, useState} from 'react'
import './index.scss'
import DiAnim, {DiAnimHandler, DiModelType} from 'src/components/DiAnim'
import {Box, Button, Grid, Paper, TextField} from '@mui/material'

const DiView = memo(function DiView() {
  const handlerRef = useRef<DiAnimHandler>(null)
  const [videoUrl, setVideoUrl] = useState('http://lxcode.bs2cdn.yy.com/858b3958-f03a-4bc9-b38c-1686cdc25827.mp4')

  useEffect(() => {
    handlerRef.current?.play({
      width: 500,
      height: 500,
      frames: 60,
      fps: 12,
      layers: [
        {
          id: '背景视频',
          type: DiModelType.MP4,
          value: 'https://lxcode.bs2cdn.yy.com/858b3958-f03a-4bc9-b38c-1686cdc25827.mp4',
          position: [0, 0],
          width: 500,
          height: 500,
          startFrame: 0,
          endFrame: 20,
        },
        {
          id: '头像',
          type: DiModelType.IMAGE,
          value: 'https://rhinosystem.bs2dl.yy.com/cont170601677162111file',
          position: [0, 0],
          width: 320,
          height: 320,
          startFrame: 20,
          endFrame: 60,
        },
      ],
    })
  }, [])

  const onChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(ev.target.value)
  }

  return (
    <Box className="diView">
      <Grid className="contentWrap" container spacing={2} justifyContent={'center'}>
        <Grid item>
          <Paper className="leftBar" variant="elevation" elevation={0} square>
            <Box className="box">
              <TextField label="资源路劲" defaultValue={videoUrl} onChange={onChanged} />
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
