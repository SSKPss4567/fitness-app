import {useState} from 'react'
import {Link} from 'react-router-dom'

import '../../GlobalStyles.css'
import classes from './Footer.module.css'

import SupportModal from '../Modals/SupportModal/SupportModal'
import TextButton from '../UI/Buttons/TextButton/TextButton'

export default function Footer(){
  const [isModalActive, setModalActive] = useState(false);

  return (
    <footer id={classes.footer}>
      <div className={classes.footer_box}>
        <ul>
          <li>
            <Link to='/faq' className='link-decoration-remover'>
              <TextButton style={{fontSize: '0.8rem'}} theme='white'>FAQ</TextButton>
            </Link>
          </li>
          <li>            
            <TextButton style={{fontSize: '0.8rem'}} onClick={() => setModalActive(true)} theme='white'>Support</TextButton>
            <SupportModal active={isModalActive} setActive={() => setModalActive(false)}/>
          </li>
          <li>
            <Link to='/faq' className='link-decoration-remover'>
              <TextButton style={{fontSize: '0.8rem'}} theme='white'>Telegram</TextButton>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

