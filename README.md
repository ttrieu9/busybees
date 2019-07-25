# Steps to get this thing working

## Getting the client up

1. Import ApolloClient from `apollo-boost`

App.js
```
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: <get from graph cms>
});
```

- by creating the client you've created:
    - connection to your graphql api
    - the cache (which we will see in action later)

2. Connect the client to your app

App.js
```
import { ApolloProvider } from 'react-apollo';

    * <ApolloProvider client={client}>
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
    * </ApolloProvider>
```

- typically it's placed pretty high in the app where you would need access to the API
- for react users, it's placing the client on the context to be accessed from anywhere using other Apollo Client components
- tl;dr gives the app access to the client to fetch data

3. Apollo dev tools!

- before we keep writing code, let's look a bit at what we can do now that are connected to the client

type this in apollo dev tools GraphiQL
```
{
  bees {
    id
    name
    totalHoneyProduced
    isInHive
  }
}
```

- this is a graphql query to get every bee
- if we press play in graphiql, it will make a request to the api using our query
- it returns the data we specify!
- the dev tools also:
    - watch the queries that have been made in the app
    - watches the mutations that have been made
    - let's you look at the current state of the cache
- we will keep the dev tools open so that we can watch some of this functionality as we develop the app

4. Let's make a query!

- the Route for our home page has the component `beeList` connected to it
    - let's go there to make that first request to get the list of bees

- first let's write our graphql query

BeeList.jsx
```
import gql from 'graphql-tag';

const GET_ALL_BEES_QUERY = gql`
  query GetAllBees {
    bees {
        id
        name
        isInHive
    }
  }
`;
```

- this is the same query we used before, so we know what it does

- next, let's start to create the query component

```
import { Query } from 'react-apollo';

const beeList = () => (
    <Query query={GET_ALL_BEES_QUERY}>
        {({ loading, data, error }) => {
            return null
        }}
    </Query>
```

- this is the query component
- it takes a query! duh.
- the syntax you see here is using react render props, which maybe can be a topic for another day
    - what we need to do is that we have a function in this query component that is being passed an object containing the data we need to know about the query we are making

- let's add a load state and an error state

```
...
{({ loading, data, error }) => {
            if (error) return <h1>OMG OMG OMG OMG OMG THERE'S AN ERROR</h1>;
            if (loading) return <h1>LOADING...</h1>;
            return null
```

- Apollo client is taking care of tracking the loading an error state for us
- largely reduces the amount of code we may have had to write to do these things otherwise
- when the result of the query comes back, that `data` property will be populated
- if we look in apollo dev tools we see it's tracking...something, not super useful
    - but if we look at the cache we can see that the query resulted in the cache being filled with all these bees
    - our query is working! let's do something with the data

```
const { bees } = data;
const beeList = bees.map(bee => (
    <Link to={{
        pathname: `/bee/${bee.id}`,
        state: { id: bee.id }
    }}>
        <h1 key={bee.name} className={bee.isInHive ? 'isInHive':'isNotInHive'}>{bee.name}</h1>
    </Link>
))


return beeList
```

- we are taking the bees out of the data using destructuring
- we are using the map function to populate `beeList` with a list of Links that correlate to each bee
- what does each bee link do?
    - brings us to the bee-specific page
    - also passes some state up for that page to use
- we are just displaying the name, and setting a className for styling purposes on the header
- we've made our first query!
- what we just saw was **declaritive data fetching**
    - Apollo was able to take care of:
        - making the call to retrieve data
        - loading state
        - error state
        - and updating the UI after the data was received
    - we can see our selves that the amount of code to produce this list was pretty small
        - it all fits on the page of two files
- we aren't done tho! we have a clickable link that takes us to a useless page, let's fix that

5. Let's query specific data

- so we've made a very general query, let's step it up and query for something based on its id

```
import gql from 'graphql-tag';

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
```

- now we actually specify the fact that we are taking in a field `$id` as input of type `ID`
- we also specify we are looking for a `bee` `where` the `id` matches our `$id` input
- we show that we want all that info back as a response
    - note that before we were **NOT** asking for `totalHoneyProduced`
- let's starting making the query

```
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
                        <h1 className={'pointer'} onClick={e => {
                            e.preventDefault();
                        }}>
                            {isInHive ? 'In Hive':'Out Collecting Honey'}
                        </h1>
                    </>
                )
            }}
        </Query>
    )
}
```

- we've created a query component that takes in our new query
- we are also passing in `variables` as props to the Query component, which contains the object that should have all the info we specified as necessary to make the query, in this case an id
    - we are grabbing this id from  the location state, which is what we explicitly passed before
- we have the same old loading and error behavior
- we are taking the necessary data out of the bee data we get back
    - we display this data as a few headers on the detail page
- voila! we have a page containing details of a bee now
- now, what's so great and new about this?
    - if you hadn't noticed, as we switch back between pages that we have already made queries for, the loading state isn't appearing
    - apollo is recognizing that query was made already and pulls that data out of the cache instead of trying to fetch it again
    - this is what they call the normalized cache, and you know that we didn't do any work to explicitly trigger this behavior
- we can see that this query is also recorded in the apollo dev tools
- so we've made two queries, big whoop! You've shown us the same thing twice, one just has an input variable
    - I want to know how to WRITE, not READ
    - you've come to the right place! Let's start taking a look at mutations next

6. Let's work with mutations

- so what is a mutation?
    - mutations are what allow you send updates to your API
    - actions speak louder than words, so let's write a mutation query

```
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
```

- what's going on here?
    - we declare our mutation, `UpdateBee`
    - it will take in two variables, `$id` and `$isInHive`
        - one is used to find a bee, one is used to change the data
    - we specify the data we want changed
    - we specify what bee is want to change that data for
    - we specify the data we want back as a result
- let's use this mutation

```
import { Query, Mutation } from 'react-apollo';

<Mutation mutation={CHANGE_HIVE_STATUS_MUTATION}>
    {(toggleIsInHive, { data }) => {
        return (
            <h1 className={`pointer ${isInHive ? 'isInHive':'isNotInHive'}`} onClick={e => {
                e.preventDefault();
                * toggleIsInHive({ variables: { id, isInHive: !isInHive } })
            }}>
                {isInHive ? 'In Hive':'Out Collecting Honey'}
            </h1>
        )
    }} 
</Mutation> 
```

- we've now wrapped that previous header in a `Mutation` component
    - it takes a mutation, like what we wrote, returns provides:
        - a function `toggleIsInHive`
        - another object containing data, loading, and error from the mutation
    - in the `onClick` of our header, we've added a call to the function that is provided by the mutation through a render prop function param
        - we pass in the data we specified we need as input here
- that's it!
    - since the mutation function is in the onclick for that header, it will be called whenever we click
- this mutation shows up in the apollo dev tools mutations and cache
    - notice how the cache only records two mutations
    - the two requests are repeating themselves over and over, apollo recognizes and make sure not to cache anything more
- noticed also how the state is updating itself
    - wait...did we do anything to update the query or cache???
    - HECK NO
    - apollo was able to recognize that the bee from the query was being updated and made the changes in the changes to update the UI as necessary as well as update the cache using their unique id that we specified in the repsonse for all of our queries
    - you know it's still pulling from cache, because we aren't seeing the loading state appear for showing a list of bees
- by this point, we've actually completed the app! It does everything we set out to make it do now
    - let's show off one more thing if there is time

7. I only want my UIs Optimistic

- there may be cases where you want an optimistic UI, a UI that updates with what it is SUPPOSED to show before that data to display it even returns in a request
    - the best example is messaging apps, where when you pressed send it displays your message, but only marks it as delivered a moment later
    - the request hasn't finished, but it's adding that message there to let the user know that's what it will look like once it is done, which is helpful to the user
- if a request takes a long time, we may want to do this too, adn apollo has integrations to be able to do this
- here's what we would need to change

```
<Mutation mutation={CHANGE_HIVE_STATUS_MUTATION}>
    {(toggleIsInHive, { data }) => {
        return (
            <h1 className={`pointer ${isInHive ? 'isInHive':'isNotInHive'}`} onClick={e => {
                e.preventDefault();
                toggleIsInHive({ 
                    variables: { id, isInHive: !isInHive },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        bee: {
                            id: id,
                            isInHive: !isInHive
                        }
                    }
                })
            }}>
                {isInHive ? 'In Hive':'Out Collecting Honey'}
            </h1>
        )
    }} 
</Mutation> 
```

- we added another property to the object we are passing to the mutation, `optimisticReponse`
- we specify the typename, which is the type of response we are getting, in this case a mutation response
- we recreate the what would be returned, a bee with the variable values we specified
- this isn't a great example, because we aren't actually using the mutation data in this app, but if we were we would see this working!

8. What we didn't cover

- there are plenty of other topics to dive into with apollo that we did NOT cover, including:
    - Local state management
    - error handling
    - pagination
    - server-side rendering
    - apollo-link-rest
    - fragments
    - subscriptions
    - advanced caching
    - network layer
    - not using apollo boost
- it'd be cool to look into it more personally if you wanted to make an individual app, and I can always see if we want a workshop part 2 as well!