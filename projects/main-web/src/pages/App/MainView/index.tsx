import React, {memo} from 'react'
import AnimView from 'src/modules/AnimView'
import styles from './index.module.scss'

const MainView = memo(function MainView() {
  return (
    <div className={styles.mainView}>
      <AnimView />
    </div>
  )
})

export default MainView
