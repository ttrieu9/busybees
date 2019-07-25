

import React from 'react';
import logo from './bee.jpg';
import './App.css';
import beeList from './views/BeeList';
import beeDetail from './views/BeeDetail';
import { View } from 'react-native-web';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
  return (
    
        <Router>
          <View>
              <div className="App">
                <header className="App-header">
                  <Link to={'/'}>
                    <img src={logo} className="App-logo" alt="logo" />
                  </Link>
                </header>
              </div>
            <Switch>
              <Route path="/" exact component={beeList} />
              <Route path="/bee/:id" exact component={beeDetail} />
            </Switch>
          </View>
        </Router>

  );
}

export default App;
