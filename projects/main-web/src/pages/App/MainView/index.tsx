import React, {memo} from 'react'
import DiView from 'src/modules/DiView'
import styles from './index.module.scss'

const MainView = memo(function MainView() {
  return (
    <div className={styles.mainView}>
      <DiView />
    </div>
  )
})

export default MainView
