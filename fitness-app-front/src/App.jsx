import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter  from './Routes/AppRouter'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <div style={{ flex: '1 0 auto' }}>
        <AppRouter id='app-box'/>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
