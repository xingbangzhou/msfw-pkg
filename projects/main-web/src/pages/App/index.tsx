import './index.scss'
import {memo} from 'react'
import LeftBar from './LeftBar'
import MainView from './MainView'

const App = memo(function App() {
  return (
    <div className="app">
      <div className="mainArea">
        <LeftBar />
        <MainView />
      </div>
    </div>
  )
})

export default App
