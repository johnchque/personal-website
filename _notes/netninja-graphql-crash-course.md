---
layout: notes
title: GraphQL Crash Course by Netninja
date: 2023-12-27
updated: 2023-12-27
description: Notes from the @NetNinja course in YouTube.
category: Learning
---

https://www.youtube.com/watch?v=xMCnDesBggM&list=PL4cUxeGkcC9gUxtblNUahcsg0WLxmrK_y

It is a query language.
A syntax to request or mutate data. An alternative to REST API.
We still use http requests but gives us more flexibility.
REST API:

```
website.com/api/animal
website.com/api/animal/123 // Fetch a single element.
```

Problems

- Over fetching: Getting more data than what we need.
- Under fetching: We don't get the data we need.

GraphQL
Request to a single endpoint.

```
website.com/graphql
```

The query syntax will specify the data we need from the server.

## Query basics

How to make a query:

```
Query [nameofquery] {
	reviews { // entrypoint.
		rating,
		content,
		id
	}
}
```

In GraphQL we need to define what fields we want to get back.
Nest query:

```
Query [nameofquery] {
	reviews { // entrypoint.
		rating,
		content,
		id,
		author {
			name,
			id,
			verified,
			reviews {
				rating,
				id,
				game {
					title
				}
			}
		},
		game {
			title,
			platform
		}
	}
}
```

## A GraphQL server with Apollo

Apollo server is a way to setup a graphql server.
Follow the steps from the following link to get started.
https://www.apollographql.com/docs/apollo-server/getting-started

```js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// server setup.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port", 4000);
```

ApolloServer expects an object as argument.
The object expects 2 properties:

- TypeDefs, type definitions: Descriptions of our data data types and the relationships they have with other data types.
- Resolvers: Functions that determine how we respond to queries for different data on the graph.

## Schema and Types

TypeDefs, are the definitions of the different types of data we want to expose.
Schema is what describes the shape of the graph and the data available there.
Schema will look similar to the kind of data in the database.

schema.js

```js
export const typeDefs = `#graphql
	// Differnet data types.
	type Game {
	  id: ID!,
	  title: String!,
	  platform: [String!]!
	}
	type Review {
	  id: ID!
	  rating: Int!
	  content: String!
	}
	type Author {
	  id: ID!
	  name: String!
	  verified: Boolean!
	}
	type Query {
	  reviews: [Review],
	  games: [Game],
	  authors: [Author]
	}
`;
```

There are 5 types built in in graphql.
int, float, string, boolean, ID.
ID is a key for data objects.
To make a field required, add a ! at the end of the type definition of each field. Otherwise it allows the fields to be null.
The type Query is not optional. Defines the entry points of the graph and define the return type of the entry points.
If, the type Query has only `reviews: [Review]` then that means we provide only that one entry point to the graph.

To import to the apollo server:

```
import { typeDefs } from './schema.js'
```

Resolver functions handle queries based on our schema.

## Resolver functions

Allows to decide how we are gonna respond to queries in the graph.

```js
const resolver = {
    Query: {
        games() {
            return db.games
        },
        ...
    }
}
```

Query matches exactly the type name.
We are sending back the array of games.
If users make a query, they may request it this way:

```
games {
	title
}
```

Apollo only needs to know where to grab the data.
We don't have to worry what fields it has to return.
Pass the resolvers when creating the instance of the Apollo Server.

## Query variables

When a user wants to get only one resource.
We don't have ways to handle single entries.

```js
export const typeDefs = `#graphql
	...
	type Query {
	  reviews: [Review],
	  review(id: ID!): Review
	  games: [Game],
	  authors: [Author]
	}
`;
```

An user can make a query for a single review. They must pass in the id.
Now we need to add a resolver function.

```js
const resolver = {
    Query: {
        ...
        review(_, args) {
	        return db.reviews.find((review) => review.id === args.id)
        }
    }
}
```

In the resolver functions we automatically have access to 3 arguments.
parent, the parent resolver in a resolver chain.
args, we can access any query variable.
context, to supply context values across all resolvers, such as auth.

In Apollo:

```json
query ReviewQuery($id: ID!) {
  review(id: $id) {
    rating,
    content
  }
}
```

We declare every argument that we want to pass with a $ sign.
In the variables section:

```json
{
  "id": "1"
}
```

We send the allowed variables for the query.

## Related data

The current resolvers don't allow how to get nested data. Inside query, the resolvers are for the entry points in the graph.
Instead, we make a property inside the resolvers object:

```js
const resolvers = {
    Query: {
	    ...
    },
    Game: {
	    reviews(parent) {
		    return db.reviews.filter((r) => r.game_id === parent.id)
	    }
    }
}
```

To get a single object, graphql will look at the resolver of the single Game. Then it will look at the Game object where it will look for the reviews resolver. To get the id, we use the parent argument, which is a reference to the parent resolver.

## Mutations

Mutation is a generic term in graphql to any kind of change we want to make to the data.
Define our allowed mutations in the schema by making a new type called Mutation.

```graphql
type Mutation {
  deleteGame(id: ID!): [Game]
}
```

In the resolvers:

```js
Mutation: {
	deleteGame(_, args) {
		db.games = db.games.filter((g) => args.id !== g.id)
		return db.games
	}
}
```

To create a Game, in the schema.

```graphql
type Mutation {
  addGame(game: AddGameInput!): Game
}
input AddGameInput {
  title: String!
  platform: [String!]!
}
```

The input type allows to group fields that will serve as input.
To create game, in the resolvers:

```js
    Mutation: {
        addGame(_, args) {
	        let game = {
		        ...args.game,
		        id: Math.floor(Math.random() * 10000).toString()
	        }
	        db.games.push(game)
	        return game
        }
    }
```

## Update mutation

```graphql
type Mutation {
  updateGame(id: ID!, edits: EditGameInput!): Game
}
input EditGameInput {
  title: String
  platform: [String!]
}
```

EditGameInput type does not make the fields required. That is why we don't reuse the AddGameInput type.
In the resolvers:

```js
    Mutation: {
	    ...
        updateGame(_, args) {
	        db.games = db.games.map((g) => {
		        if (g.id === args.id) {
			        return {...g, ...args.edits}
		        }
			    return g
	        })
		    return db.games.find((g) => g.id === args.id)
        }
    }
```
