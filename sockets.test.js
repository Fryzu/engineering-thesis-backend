const io = require("socket.io-client");

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
    await expect(fetch("test", { testMessage })).resolves.toBe(testMessage);
  });
});
