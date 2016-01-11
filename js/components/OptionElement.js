import React from 'react';
import Relay from 'react-relay';

class OptionElement extends React.Component {
  render() {
    return (
      <option key={this.props.friend.userId} value={this.props.friend.userId}>{this.props.friend.name}</option>
    );
  }
}

export default Relay.createContainer(OptionElement, {
  fragments: {
    friend: () => Relay.QL`
      fragment on User {
        name,
        userId,
      },
    `,
  },
});
