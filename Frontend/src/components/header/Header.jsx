import React, { useState } from 'react';
import Logo from '../../assets/logo.png';
import Bars from '../../assets/bars.png';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const mobile = window.innerWidth <= 768 ? true : false;
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className="header">
        {/* <img src={Logo} alt="" className="logo"/> */}
        <h1 className=''>FLEX-IT-OUT</h1>
        {menuOpened === false && mobile === true ? (
          <div style={{
            backgroundColor: 'var(--appColor)',
            padding: '0.5rem',
            borderRadius: '5px'
          }}
            onClick={() => setMenuOpened(true)}
          >
            <img 
              src={Bars} 
              alt="" 
              style={{
                width: '1.5rem', 
                height: '1.5rem'
              }}
            /> 
          </div>
          ) : (
          <ul className="header-menu">
            <li>
              <Link className='button'
                onClick={() => setMenuOpened(false)}
                to='/'
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
              className='button'
                onClick={() => setMenuOpened(false)}
                to='/analytics'
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link 
              className='button'
                onClick={() => setMenuOpened(false)}
                to='/leaderboard'
              >
                LeaderBoard
              </Link>
            </li>
            <li>
              <Link 
              className='button'
                onClick={() => setMenuOpened(false)}
                to='/challenges'
              >
                Challenges
              </Link>
            </li>
            <li>
              <Link 
              className='button'
                onClick={() => setMenuOpened(false)}
                to='/Login'
              >
                Login
      
              </Link>
            </li>
            
            <li>
              <Link 
              className='button'
                onClick={() => setMenuOpened(false)}
                to='/Signup'
              >
                Signup
              </Link>
            </li>
          </ul>
        )}
    </div>
    
  )
}

export default Header;