import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter  from './Routes/AppRouter'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <AppRouter id='app-box'/>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
