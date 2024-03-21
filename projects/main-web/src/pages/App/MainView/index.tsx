import React, {memo} from 'react'
// import AnimView from 'src/modules/AnimView'
import styles from './index.module.scss'
import ThreeView from 'src/modules/ThreeView'

const MainView = memo(function MainView() {
  return (
    <div className={styles.mainView}>
      {/* <AnimView /> */}
      <ThreeView />
    </div>
  )
})

export default MainView
