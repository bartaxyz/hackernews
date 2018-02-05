import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { AUTH_TOKEN } from '../constants';

interface Props {
  history: [string];
}

class Header extends React.Component<Props> {
  logout() {
    localStorage.removeItem(AUTH_TOKEN);
    this.props.history.push(`/`);
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <header className="header">
        <h1 className="header__title">Hackernews Clone</h1>
        <Link to="/" className="header__link">Feed</Link>
        {authToken && (
            <Link to="/create" className="header__link">Submit</Link>
        )}
        {authToken ? (
            <Link to="/" onClick={this.logout} className="header__link">Logout</Link>
        ) : (
            <Link to="/login" className="header__link">Login</Link>
        )}
      </header>
    );
  }
}

export default withRouter(Header);
