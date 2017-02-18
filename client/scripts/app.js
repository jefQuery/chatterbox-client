// YOUR CODE HERE:
var app = {
  init: () => {

  },
  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: (url = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages') => {
    $.ajax({
      //deleted URL.
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        // do stuff with data object
      },
      error: (data) => {
        console.error('chatterbox: Failed to find message', data);
      }
    });
  },
  clearMessages: () => {
    $('#chats').children().remove();
  },
  renderMessage: (message) => {
    let $newMessage = $('<div class="chat"></div>').text(message.text);
    $newMessage.prepend('<span class="username"></span>').text(message.username);
    $('#chats').prepend($newMessage);//add class of roomname to hide later
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
  }
};

$(document).ready(function() {
  $('.chatButton').on('click', (event) => {
    var message = $('#chatInputText').text();
    // var message = $('.chatInputText').val(); 
    console.log(message);
    // Add username and roomname? turn to JSON
    // app.send(message);
    // app.renderMessage(message);
  });
});