import {memo, useCallback, useRef} from 'react'
import DiAnim, {DiAnimHandler} from 'src/components/DiAnim'
import DrapArea from './DrapArea'
import styles from './index.module.scss'

const DiView = memo(function DiView() {
  const handlerRef = useRef<DiAnimHandler>(null)

  const onDrapped = useCallback(
    (url: string) => {
      handlerRef.current?.play({video: url, loop: true})
    },
    [handlerRef.current],
  )

  return (
    <DrapArea className={styles.diView} onDrapped={onDrapped}>
      <DiAnim className={styles.diAnim} handlerRef={handlerRef} />
    </DrapArea>
  )
})

export default DiView
