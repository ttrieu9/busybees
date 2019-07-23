import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import logo from './logo.svg';
import './App.css';

const client = new ApolloClient({
  uri: 'https://api-useast.graphcms.com/v1/cjydq0tm126y401f6cg9cijkd/master'
});

const GET_ALL_BEES_QUERY = gql`
  {
    bees {
      name
      isInHive
    }
  }
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Query query={GET_ALL_BEES_QUERY}>
          {({ loading, data, error }) => {
            if (loading) return 'Loading...';

            const { bees } = data;
            return bees.map(bee => <h1 key={bee.name} className={bee.isInHive ? 'isInHive':'isNotInHive'}>{bee.name}</h1>)
          }}
        </Query>
      </div>
    </ApolloProvider>
  );
}

export default App;
