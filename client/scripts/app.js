// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friends: [],
  messages: [],
  rooms: [],
  lastMessageID: 0,
  init: () => {

  },
  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        // console.log(data);
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: (url) => {
    $.ajax({
      url: app.server + '?order=-createdAt', //grab the last 1000 and serve in reverse chron order
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        if (!data.results || data.results.length === 0) {
          return;
        }

        app.messages = data.results;

        if (app.lastMessageID === 0) {
          app.lastMessageID = app.messages[app.messages.length - 1].objectId;
          // app.renderMessages(app.messages);
        }

        let mostRecentMessage = app.messages[0];

        for (var i = 0; i < app.messages.length; i++) {
          if (app.messages[i].objectId === app.lastMessageID) {
            //slice the array
            //send that array into rendermessages
            app.renderMessages(app.messages.slice(0, i));
            //break from the for loop
            app.lastMessageID = mostRecentMessage.objectId;
            break;
          }
        }
      },
      error: (data) => {
        console.error('chatterbox: Failed to find message', data);
      }
    });
  },
  renderMessages: (messages) => {
    // app.clearMessages();
    for (var i = messages.length - 1; i >= 0; i--) {
      app.renderMessage(messages[i]);
    }
  },
  clearMessages: () => {
    $('#chats').children().remove();
  },
  renderMessage: (message) => {
    let $newMessage = $('<div id="message" class="chat"></div>').text(message.text); //make sure to set most recent message with an id of "message"
    let $username = $('<div class="username"></div>').text(message.username);

    if (app.rooms.indexOf(message.roomname) === -1) {
      app.rooms.push(message.roomname);
      app.renderRoom(message.roomname);
    }
    
    $newMessage.addClass(message.roomname);
    $newMessage.prepend($username);
    $('#chats').append($newMessage);//add class of roomname to hide later
  },
  renderRoom: (roomName) => {
    let $newRoom = $('<option></option>').text(roomName);
    $newRoom.addClass(roomName);
    $('#roomSelect').append($newRoom);
  },
  handleUsernameClick: () => {
    $('.username').on('click', () => {
      return true;
    });
  },
  handleSubmit: () => {
    () => {
      return true;
    };
  }
};

$(document).ready(function() {
  var urlToParse = window.location.search;
  var username = urlToParse.split('=')[1];
  $('.chatButton').on('click', (event) => {
    var message = $('#send').val();
    var roomname = $('#roomSelect > .selected').val();
    var jSONMessage = {
      username: username,  
      text: message,
      roomname: roomname,
    };
    app.send(jSONMessage);
    app.renderMessage(jSONMessage);
  });

  setInterval( () => {
    app.fetch(app.server); 
  }, 500);

});