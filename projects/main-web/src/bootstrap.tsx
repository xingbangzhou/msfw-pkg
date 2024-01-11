import ReactDOM from 'react-dom/client'
import Index from './pages/Index'

const root = document.querySelector('#root')

root ? ReactDOM.createRoot(root).render(<Index />) : console.error('Bootstrap Has Error: No Root Div')
