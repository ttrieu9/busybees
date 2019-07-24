import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { Query } from 'react-apollo';

const GET_ALL_BEES_QUERY = gql`
  {
    bees {
        id
        name
        isInHive
    }
  }
`;

const beeList = () => (
    <Query query={GET_ALL_BEES_QUERY}>
    {({ loading, data, error }) => {
        if (loading) return <h1>LOADING...</h1>;

        if (error) return <h1>OMG OMG OMG OMG OMG THERE'S AN ERROR</h1>

        const { bees } = data;
        const beeList = bees.map(bee => (
            <Link to={{
                pathname: `/bee/${bee.id}`,
                state: { id: bee.id }
            }}>
                <h1 key={bee.name} className={bee.isInHive ? 'isInHive':'isNotInHive'}>{bee.name}</h1>
            </Link>
        ))


        return (
            <div className="bee-container">
                {beeList}
            </div>
        )
    }}
    </Query>
)

export default beeList;