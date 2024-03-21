import {memo} from 'react'
import './index.scss'
import {Box} from '@mui/system'
import {Typography} from '@mui/material'

const TitleBar = memo(function TitleBar() {
  return (
    <Box className="titleBarWrap">
      <Typography className="title">图形世界</Typography>
    </Box>
  )
})

export default TitleBar
