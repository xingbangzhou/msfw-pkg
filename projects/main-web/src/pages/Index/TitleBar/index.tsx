import {memo} from 'react'
import './index.scss'
import {Box} from '@mui/system'
import {Typography} from '@mui/material'

const TitleBar = memo(function TitleBar() {
  return (
    <Box className="titleBarWrap">
      <Typography className="title">DIANIM</Typography>
    </Box>
  )
})

export default TitleBar
