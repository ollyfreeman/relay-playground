import * as graphql from 'graphql'; // importing like this so I can see in the code which functions come from which import
import graphqlHTTP from 'express-graphql';
import express from 'express';
import * as relay from 'graphql-relay'; // importing like this so I can see in the code which functions come from which import

import {
  User,
  getUser,
  getUsers,
  getFriends,
  userHasFriend,
  setUserName,
} from './database';

// Get the "node" interface and field from the Relay library.
// The first method defines the way we resolve the global id to its object.
// The second method defines the way we resolve an object to its GraphQL type.

var { nodeInterface, nodeField } = relay.nodeDefinitions(
  (globalId) => {
    var { type, id } = relay.fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if(obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

var userType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'A user in our simple example system',
  fields: () => ({
    id: relay.globalIdField('User', user => user.userId), // the 'globalId' of the user
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
  interfaces: [nodeInterface]
});

var { connectionType: userConnection } = relay.connectionDefinitions({name: 'User', nodeType: userType});

var queryType = new graphql.GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    node: nodeField,
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
        return getUser(args.userId);
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
