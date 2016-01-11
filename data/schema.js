import * as graphql from 'graphql'; // importing like this so I can see in the code which functions come from which import
import graphqlHTTP from 'express-graphql';
import express from 'express';
import * as relay from 'graphql-relay'; // importing like this so I can see in the code which functions come from which import

import * as relayHelpers from './relay'; // my re-implentations of some of the graphql-relay-js helpers

import {
  User,
  getUser,
  getUsers,
  getFriends,
  userHasFriend,
  setUserName,
} from './database';

var userType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'A user in our simple example system',
  fields: () => ({
    id: {
      description: 'The id of the user',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      resolve: user => relayHelpers.toGlobalId('User', user.userId)
    },
    userId: {
      description: 'The userId of the user',
      type: graphql.GraphQLString,
      resolve: user => user.userId,
    },
    name: {
      description: 'The name of the user',
      type: graphql.GraphQLString,
      resolve: user => user.name,
    },
    hobby: {
      description: 'The hobby of the user',
      type: graphql.GraphQLString,
      resolve: user => user.hobby,
    },
    friends: {
      type: userConnection,
      description: 'The friends of a user',
      args: relay.connectionArgs,
      resolve: (user, args) => relay.connectionFromArray(getFriends(user.userId), args), // args = after, before, first, last
    },
    friend: {
      type: userType,
      description: 'A friend of a user',
      args: {
        friendId: {
          description: 'The userId of the friend',
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        }
      },
      resolve: (user, args) => {
        if(userHasFriend(user.userId, args.friendId)) {
          return getUser(args.friendId);
        }
      },
    }
  }),
  interfaces: [relayHelpers.nodeInterface]
});

var { connectionType: userConnection } = relay.connectionDefinitions({name: 'User', nodeType: userType});

var queryType = new graphql.GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    // Note that this query definition, and the definition of nodeInterface can be done using
    // the 'nodeDefinitions' function in 'graphyql-relay-js' instead of my longer-winded but
    // hopefully more transparent implementations
    node: {
      type: relayHelpers.nodeInterface,
      description: 'Get an object by its globalId',
      args: {
        id: {
          description: 'The global id of the object',
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        }
      },
      resolve: (_, args) => {
        var { type, id } = relayHelpers.fromGlobalId(args.id);
        if (type === 'User') {
          return getUser(id);
        } else {
          return null;
        }
      }
    },
    user: {
      type: userType,
      description: 'Get the user with the given id',
      args: {
        userId: {
          description: 'The id of the user',
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        }
      },
      resolve: (_, args) => {
        var user = getUser(args.userId);
        user.id = relayHelpers.toGlobalId('User', user.userId);
        return user;
      }
    }
  }
});

var mutationType = new graphql.GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    changeName: relay.mutationWithClientMutationId({
      name: 'changeName',
      inputFields: {
        userId: {
          description: 'The id of the user',
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        name: {
          description: 'The new name of the user',
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
      },
      outputFields: {
        user: {
          type: userType,
          resolve: ( payload ) => {
            return getUser(payload.userId);
          }
        },
      },
      mutateAndGetPayload: ( inputFields ) => {
        setUserName(inputFields.userId, inputFields.name);
        return {
          userId: inputFields.userId,
        };
      },
    }),
  }
});

export var Schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
