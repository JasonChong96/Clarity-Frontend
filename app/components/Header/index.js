import React from 'react';
import { FormattedMessage } from 'react-intl';
import A from './A';
import Banner from './banner.jpg';
import HeaderLink from './HeaderLink';
import Img from './Img';
import messages from './messages';
import NavBar from './NavBar';

function Header() {
  return (
    <div>
      <A href="https://www.reactboilerplate.com/">
        <Img src={Banner} alt="react-boilerplate - Logo" />
      </A>
      <NavBar>
        <HeaderLink to="/">
          <FormattedMessage {...messages.home} />
        </HeaderLink>
        <HeaderLink to="/features">
          <FormattedMessage {...messages.features} />
        </HeaderLink>
      </NavBar>
    </div>
  );
}

export default Header;
