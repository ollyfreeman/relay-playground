export default class ChangeNameMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation {changeName}`;
  }

  getVariables() {
    return {
      userId: this.props.user.userId, // these are ChangeNameMutation's props that got passed in in the constructor,
      name: this.props.name,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on changeNamePayload {
        user {
          name
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        // 'user' is the field in the response that we are referring to
        // 'this.props.user.id' is the global id of the record we want to update in the Relay store
        user: this.props.user.id,
      },
    }];
  }

  getOptimisticResponse() {
    return {
      user: {
        name: this.props.name,
      },
    };
  }

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        userId,
      }
    `,
  };
}