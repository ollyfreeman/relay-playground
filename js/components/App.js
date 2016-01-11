import React from 'react';
import Relay from 'react-relay';
import OptionElement from './OptionElement';
import FriendElement from './FriendElement';
import ChangeNameMutation from '../mutations/ChangeNameMutation';

class App extends React.Component {
  render() {
    return (
      <div>
        <h2>User: <input type="text" name="fname" onChange={e => this._changeName(e.target.value)} value={this.props.user.name} /></h2>
        <h2>Friends of {this.props.user.name}:</h2>
        <select size="3" onChange={e => this._setUser(e.target.value)}>
          {this.props.user.friends.edges.map(edge =>
            <OptionElement friend={edge.node} />
          )}
        </select>
        <FriendElement friend={this.props.user.friend} />
      </div>
    );
  }
  _setUser = (friendId) => {
    this.props.relay.setVariables({
      friendId: friendId,
    });
  }
  _changeName = (name) => {
    // To perform a mutation, pass an instance of a Relay.Mutation to `Relay.Store.update`
    Relay.Store.update(new ChangeNameMutation({user: this.props.user, name: name}));
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    friendId: '', // i.e. an invalid userId
  },
  fragments: {
    // i.e. the data for props.users
    user: () => Relay.QL`
      fragment on User {
        name
        ${ChangeNameMutation.getFragment('user')}
        friends(first:10) {
          edges {
            node {
              ${OptionElement.getFragment('friend')},
            }
          },
        },
        friend(friendId: $friendId) {
          ${FriendElement.getFragment('friend')}
        }
      }
    `,
  },
});
