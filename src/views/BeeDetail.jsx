import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { Query } from 'react-apollo';

const GET_BEE_QUERY = gql`
    query getBeeById($id: ID) {
        bee(where: {
            id: $id
        }) {
            name
            totalHoneyProduced
            isInHive
        }
    }
`;

const beeDetail = ({ location: { state : { id } } }) => {
    console.log('trying to get bee')
    return(
        <Query query={GET_BEE_QUERY} variables={{ id }}>
            {({ loading, data, error }) => {
                if (loading) return <h1>LOADING...</h1>;

                if (error) return <h1>OMG OMG OMG OMG OMG THERE'S AN ERROR</h1>

                const { bee } = data;
                return(
                    <>
                        <h1>{bee.name}</h1>
                        <h1>{bee.totalHoneyProduced}g of Honey Produced in Lifetime</h1>
                        <h1>{bee.isInHive ? 'In Hive':'Out Collecting Honey'}</h1>

                        <Link to={`/bee/${id}/edit`}>
                            Edit Bee Info
                        </Link>
                    </>
                )
            }}
        </Query>
    )
}

export default beeDetail;