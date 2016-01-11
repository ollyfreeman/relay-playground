import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
  	// 'user' here has to match with the fragments in the relay containers
    user: () => Relay.QL`
      query {
        user(userId: $userId)
      }
    `,
  };
  static paramDefinitions = {
    userId: {required: true},
  };
  static routeName = 'UserRoute';
}
