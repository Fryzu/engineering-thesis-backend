const { addUser, getUsersList, getUserSocket } = require("../state/users");
const io = require("socket.io-client");
const { eventTypes } = require("./sockets");

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

const ENDPOINT = "http://localhost:5000";
jest.setTimeout(30000);

describe("Signaling server websockets API tests", function() {
  var socket;
  var fetch;

  /**
   * Sets up the connection
   */
  beforeEach(function() {
    socket = io.connect(ENDPOINT, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      transports: ["websocket"]
    });
    fetch = (eventName, params) => {
      return new Promise((resolve, _) => {
        socket.emit(eventName, params, response => {
          resolve(response);
        });
      });
    };
  });

  afterEach(() => {
    socket.close();
  });

  it("Should reponse to test onHandler", async () => {
    const testMessage = "oneToThree";
    await expect(fetch(eventTypes.TEST, { testMessage })).resolves.toBe(
      testMessage
    );
  });

  it("Should should add new users", async () => {
    const userName = "testUser";
    await expect(
      fetch(eventTypes.NEW_USER, { userName })
    ).resolves.toMatchObject({
      status: HTTP_OK
    });
    await expect(
      fetch(eventTypes.NEW_USER, { userName })
    ).resolves.toMatchObject({
      status: HTTP_BAD_REQUEST
    });
    await expect(
      fetch(eventTypes.NEW_USER, { userName: "" })
    ).resolves.toMatchObject({
      status: HTTP_BAD_REQUEST
    });
  });

  it("Should provide user list", async () => {
    const userName = "testUser";

    await expect(fetch(eventTypes.GET_USER_LIST)).resolves.toMatchObject({
      payload: {
        users: []
      }
    });
    await fetch(eventTypes.NEW_USER, { userName });
    await expect(fetch(eventTypes.GET_USER_LIST)).resolves.toMatchObject({
      payload: {
        users: [userName]
      }
    });
  });
});

describe("Signaling server auxiliary functions", function() {
  it("Should send messages to users", () => {
    const userName1 = "testUser1";
    const socketId1 = "111";
    const userName2 = "testUser2";
    const socketId2 = "222";
    addUser(socketId1, userName1);
    addUser(socketId2, userName2);

    expect(getUsersList()).toMatchObject([userName1, userName2]);
    expect(getUserSocket(userName1)).toBe(socketId1);
    expect(getUserSocket(userName2)).toBe(socketId2);
  });
});
