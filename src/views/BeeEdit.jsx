import React from 'react';
import gql from 'graphql-tag';

import { Mutation } from 'react-apollo';

const EDIT_BEE = gql`
    mutation updateBee($id: ID, $totalHoneyProduced: Int, $isInHive: Boolean) {
        updateBee(
            data:{
                totalHoneyProduced: $totalHoneyProduced
                isInHive: $isInHive
            }
            where: {
                id: $id
            }
        ) {
            name
            totalHoneyProduced
        }
    }
`

const beeEdit = ({ location: { state : { id, totalHoneyProduced } } }) => {
    return(
        <Mutation mutation={EDIT_BEE}>
            {(editBee, { data }) => {
                // editBee({ variables: { id, totalHoneyProduced: (totalHoneyProduced + 10), isInHive: true } })
                return(
                    <>
                        <button type={'submit'} onClick={() => {editBee({ variables: { id, totalHoneyProduced: (totalHoneyProduced + 10), isInHive: true } })}}>Add 10</button>
                    </>
                )
            }}
        </Mutation>
    )
}

export default beeEdit;