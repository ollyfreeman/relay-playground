import * as graphql from 'graphql'; // importing like this so I can see in the code which functions come from which import
import { base64, unbase64 } from '../utils/base64'

/**
 * This file contains my 'readable' implementations of the official
 * 'graphql-relay-js' (https://github.com/graphql/graphql-relay-js)
 * functions which allow the implementation of the 'Object Identification'
 * requirement of Relay-compliant GraphQL servers:
 * https://facebook.github.io/relay/docs/graphql-object-identification.html#content
 **/

// all objects should implement this interface to allow refetching
var nodeInterface = new graphql.GraphQLInterfaceType({
  name: 'Node',
  description: 'An object with a global ID',
  fields: {
    id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString),
      description: 'The global id of the object.',
    },
  },
  // GraphQL interfaces have a 'resolveType' function so that
  // we can resolve the underlying type of objects that implement
  // this interface
  resolveType: (obj) => {
    if(obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
});

var toGlobalId = (type, id) => {
  return base64([type, id].join(':'));
}

var fromGlobalId = (globalId) => {
  var unbasedGlobalId = unbase64(globalId);
  var delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

export { nodeInterface, toGlobalId, fromGlobalId };
