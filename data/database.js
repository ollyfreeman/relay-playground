class User {
    constructor (id, name, hobby, friends) {
      this.userId = id;
      this.name = name;
      this.hobby = hobby;
      this.friends = friends;
    }
}

var data = [
  {
    "id": "1",
    "name": "Dan",
    "friends": [ "2", "3", "4" ],
    "hobby": "Knitting",
  },
  {
    "id": "2",
    "name": "Lee",
    "friends": ["1", "3"],
    "hobby": "Stamp collecting",
  },
  {
    "id": "3",
    "name": "Nick",
    "friends": ["1", "3"],
    "hobby": "Jogging",
  },
  {
    "id": "4",
    "name": "Simon",
    "friends": [ "1" ],
    "hobby": "Netflix 'n Chill",
  }
].map((obj, index) => {
  return new User(obj.id, obj.name, obj.hobby, obj.friends);
});

var getUser = (userId) => { return data.find(d => d.userId === userId) };

module.exports = {
  User,
  getUser: getUser,
  getUsers: () => { return data },
  getFriends: (userId) => { return getUser(userId).friends.map( friendId => getUser(friendId) ); },
  userHasFriend: (userId, friendId) => { return getUser(userId).friends.indexOf(friendId) !== -1; },
  setUserName: (userId, newUserName) => { getUser(userId).name = newUserName },
};