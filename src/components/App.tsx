import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import Feed from './Feed';
import Login from './Login';
import CreateLink from './CreateLink';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact={true} path="/" component={Feed} />
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path="/create" component={CreateLink} />
        </Switch>
      </div>
    );
  }
}

export default App;
