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
const getUser = () => {};
const getUsersList = () => {
  return Object.keys(users).map(user => {
    return users[user].userName;
  });
};

module.exports = { addUser, deleteUser, getUser, getUsersList };
