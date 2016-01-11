import React from 'react';
import Relay from 'react-relay';

class FriendElement extends React.Component {
  render() {
    if(this.props.friend) {
      var friend = this.props.friend;
      return (
        <div>
          <h3>Selected friend details</h3>
          <ul>
            <li><strong>Name</strong>: {friend.name}</li>
            <li><strong>userId</strong>: {friend.userId}</li>
            <li><strong>(global)Id</strong>: {friend.id}</li>
            <li><strong>Hobby</strong>: {friend.hobby}</li>
          </ul>
        </div>
      );
    } else {
      return (
        <h3>Select a friend to see details</h3>
      );
    }
  }
}

export default Relay.createContainer(FriendElement, {
  fragments: {
    friend: () => Relay.QL`
      fragment on User {
        name
        userId,
        id
        hobby
      },
    `,
  },
});
