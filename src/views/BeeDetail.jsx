import React from 'react';
import gql from 'graphql-tag';
// import { Link } from 'react-router-dom';

import { Query, Mutation } from 'react-apollo';

const GET_BEE_QUERY = gql`
    query getBeeById($id: ID) {
        bee(where: {
            id: $id
        }) {
            id
            name
            totalHoneyProduced
            isInHive
        }
    }
`;

const CHANGE_HIVE_STATUS_MUTATION = gql`
    mutation UpdateBee($id: ID, $isInHive: Boolean) {
        updateBee(
            data:{
                isInHive: $isInHive
            }
            where: {
                id: $id
            }
        ) {
            id
            isInHive
        }
    }
`;

const beeDetail = ({ location: { state : { id } } }) => {
    return(
        <Query query={GET_BEE_QUERY} variables={{ id }}>
            {({ loading, data, error }) => {
                if (loading) return <h1>LOADING...</h1>;

                if (error) return <h1>OMG OMG OMG OMG OMG THERE'S AN ERROR</h1>

                const { name, totalHoneyProduced, isInHive } = data.bee;
                return(
                    <>
                        <h1>{name}</h1>
                        <h1>{totalHoneyProduced}g of Honey Produced in Lifetime</h1>
                        <Mutation mutation={CHANGE_HIVE_STATUS_MUTATION}>
                            {(toggleIsInHive, { data }) => {
                                return (
                                    <h1 className={'pointer'} onClick={e => {
                                        e.preventDefault();
                                        toggleIsInHive({ variables: { id, isInHive: !isInHive } })
                                    }}>
                                        {isInHive ? 'In Hive':'Out Collecting Honey'}
                                    </h1>
                                )
                            }}
                        </Mutation>
                    </>
                )
            }}
        </Query>
    )
}

export default beeDetail;