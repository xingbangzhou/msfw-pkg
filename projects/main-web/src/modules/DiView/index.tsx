import {memo, useEffect, useRef, useState} from 'react'
import DiAnim, {DiAnimHandler} from 'src/components/DiAnim'
import styles from './index.module.scss'
import {Box, IconButton} from '@mui/material'
import {PauseCircleOutline, PlayCircleOutline} from '@mui/icons-material'

const DiView = memo(function DiView() {
  const handlerRef = useRef<DiAnimHandler>(null)
  const [playState, setPlayState] = useState(false)

  useEffect(() => {
    if (playState) {
      handlerRef.current?.play({
        video: 'http://lxcode.bs2cdn.yy.com/858b3958-f03a-4bc9-b38c-1686cdc25827.mp4',
        loop: true,
      })
    } else {
      handlerRef.current?.pause()
    }
  }, [playState])

  // const onDrapped = useCallback(
  //   (url: string) => {
  //     handlerRef.current?.play({video: url, loop: true})
  //   },
  //   [handlerRef.current],
  // )

  return (
    <Box className={styles.diViewWrap}>
      <Box className={styles.diView}>
        <DiAnim className={styles.diAnim} handlerRef={handlerRef} />
      </Box>
      <Box className={styles.controls}>
        <Box className={styles.playBox}>
          <IconButton onClick={() => setPlayState(!playState)}>
            {playState ? <PauseCircleOutline color="primary" /> : <PlayCircleOutline color="primary" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
})

export default DiView
