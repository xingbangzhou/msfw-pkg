import {memo} from 'react'
import './index.scss'
import Button from '@mui/material/Button'

const TitleBar = memo(function TitleBar() {
  return (
    <div className="titleBarWrap">
      <p className="title">Mfx Web</p>
      <Button color="primary">Menu</Button>
    </div>
  )
})

export default TitleBar
