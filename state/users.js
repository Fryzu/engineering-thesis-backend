const users = {};

/**
 * Adds a new user to server temporary state
 * @param {string} socketID
 * @param {string} userName
 */
const addUser = (socketID, userName) => {
  if (socketID in users) throw "User already exists";

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
const getUsersList = () => {};

module.exports = { addUser, deleteUser, getUser, getUsersList };
