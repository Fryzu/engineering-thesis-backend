const users = {};

/**
 * Adds a new user to server temporary state
 * @param {string} socketID
 * @param {string} userName
 */
const addUser = (socketID, userName) => {
  if (socketID in users) throw "User already exists";
  if (!userName) throw "Incorrect name";

  users[socketID] = {
    userName
  };
};

/**
 * Deletes the user from server temporary state
 * @param {string} socketID
 */
const deleteUser = socketID => {
  if (!(socketID in users)) throw "No such user";

  delete users[socketID];
};

/**
 * Returns socket for a user
 * @param {string} userName
 */
const getUserSocket = userName => {
  return Object.keys(users).find(user => {
    return users[user].userName === userName;
  });
};

const getUsersList = () => {
  return Object.keys(users).map(user => {
    return users[user].userName;
  });
};

const getUserName = socketID => {
  if (!(socketID in users)) throw "No such user";

  return users[socketID].userName;
};

module.exports = {
  addUser,
  deleteUser,
  getUserSocket,
  getUsersList,
  getUserName
};
