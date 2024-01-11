import {memo} from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import './index.scss'
import App from '../App'
import Login from '../Login'
import TitleBar from './TitleBar'

const Index = memo(function Index() {
  return (
    <div className="indexWrap">
      <TitleBar />
      <div className="indexWrap-bg" />
      <Router basename="/">
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  )
})

export default Index
