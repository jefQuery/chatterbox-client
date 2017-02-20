// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  friends: {},
  messages: [],
  lastMessageID: 0,
  rooms: {},
  currentRoom: 'lobby',
  init: () => {
    app.startSpinner();
    app.fetch();

    var urlToParse = window.location.search;
    if (_.contains(urlToParse, '&')) {
      urlToParse = urlToParse.split('&')[1];
    }
    app.username = urlToParse.split('=')[1];
  
    $('.chatButton').on('click', app.handleSubmit);
    $('#roomSelect').on('change', app.handleRoomChange);
    $('#chats').on('click', '.username', app.handleUsernameClick);

    setInterval( () => {
      app.fetch(app.server); 
    }, 2000);
  },
  send: (message) => {
    app.startSpinner();
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        $('#send').val('');
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
      data: {count: 1000},
      success: (data) => {
        if (!data.results || data.results.length === 0) {
          return;
        }

        app.messages = data.results;

        let lastRenderedMessage = app.messages[app.messages.length - 1];
        
        if (lastRenderedMessage.objectId !== app.lastMessageID) {
          app.clearMessages();
          app.renderMessages(app.messages);
          app.lastMessageID = lastRenderedMessage.objectId;
        }
      },
      error: (data) => {
        console.error('chatterbox: Failed to find message', data);
      }
    });
  },
  renderMessages: (messages) => {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].text === undefined || 
          messages[i].username === undefined //|| messages[i].roomname !== app.roomname
          ) {
        continue; //clean up, don't show the empty chatboxes
      } else if (messages[i].roomname === app.currentRoom ||
                  app.currentRoom === 'lobby') {
        app.renderMessage(messages[i]);
      }
    }
    app.stopSpinner();
  },
  clearMessages: () => {
    $('#chats').children().remove();
  },
  renderMessage: (message) => {
    let $newMessage = $('<div id="message" class="chat"></div>').text(message.text); //make sure to set most recent message with an id of "message"
    let $username = $('<span class="username"></span><br>').text(message.username);

    if (!app.rooms[message.roomname] && 
          message.roomname !== ' ' && 
          message.roomname !== undefined) {
      app.rooms[message.roomname] = true;
      app.renderRoomList(message.roomname);
    }
    if (app.friends[message.username] === true) {
      $username.toggleClass('friend');
    }
    $newMessage.prepend($username);
    $('#chats').append($newMessage);//add class of roomname to hide later
  },
  renderRoomList: (roomName) => {
    let $newRoom = $('<option></option>').text(roomName);
    $newRoom.addClass('roomname');
    $('#roomSelect').append($newRoom);
  },
  handleUsernameClick: (event) => {
    var username = event.target.innerText;
    app.friends[username] = app.friends[username] === true ? false : true;

    $('.username').each(function() {
      if (this.innerText === username) {
        $(this).toggleClass('friend');
      }
    });
  },
  handleRoomChange: (event) => {
    var selectRoomIdx = $('#roomSelect').prop('selectedIndex');
    if (selectRoomIdx === 0) {
      var roomname = prompt('Enter new room name');

      if (roomname) {
        app.currentRoom = roomname;
        app.renderRoom(roomname);
        $('#roomSelect').val(roomname);
      }
    } else {
      app.currentRoom = $('#roomSelect').val();
    }
    app.clearMessages();
    app.renderMessages(app.messages);
  },
  handleSubmit: (event) => {
    event.preventDefault();
    var message = $('#send').val();
    var roomname = $('#roomSelect').val();
    var jSONMessage = {
      username: app.username,  
      text: message,
      roomname: roomname || 'lobby',
    };
    app.send(jSONMessage);
    //app.renderMessage(jSONMessage);
  },
  startSpinner: () => {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', true);
  },
  stopSpinner: () => {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', false);
  }
};