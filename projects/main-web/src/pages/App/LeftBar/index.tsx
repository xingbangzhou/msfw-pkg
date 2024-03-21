import {Drawer, List} from '@mui/material'
import {memo} from 'react'

const LeftBar = memo(function LeftBar() {
  return (
    <Drawer>
      <div>
        <List></List>
      </div>
    </Drawer>
  )
})

export default LeftBar
