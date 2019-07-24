import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import logo from './bee.jpg';
import './App.css';
import beeList from './views/BeeList';
import beeDetail from './views/BeeDetail';
import beeEdit from './views/BeeEdit';
import { View } from 'react-native-web';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'https://api-useast.graphcms.com/v1/cjydq0tm126y401f6cg9cijkd/master'
});

function App() {
  return (
    <ApolloProvider client={client}>
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
              <Route path="/bee/:id/edit" exact component={beeEdit} />
            </Switch>
          </View>
        </Router>
    </ApolloProvider>
  );
}

export default App;
