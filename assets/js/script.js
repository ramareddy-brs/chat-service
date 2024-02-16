function loadScript() {
  let user = prompt("Please enter your name", "");
  if (!user) {
    document.getElementsByTagName('main')[0].innerHTML = 'Please Enter Your Name';
  }

  var pubnub = new PubNub({
      publishKey: 'demo',
      subscribeKey: 'demo',
      userId: user
  })

  pubnub.subscribe({
      channels: ['ws-channel']
  })

  pubnub.addListener({
    message: payload => {
      let messageString = '';
      const isCurrentUserPublisher = user === payload.publisher;
      const msg_cls = isCurrentUserPublisher ? 'justify-content-md-end' : 'justify-content-md-start';
      if(isCurrentUserPublisher) {
        messageString =
        `
          <div class='row w-100 ${msg_cls} mb-2'>
            <div class="col-5 text-start sender-msg p-0">
              <div class='d-inline'>${payload.message}</div>
            </div>
            <div class="col-1 p-0">
              <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
            </div>
          </div>
        `
      } else {
        messageString =
        `
          <div class='row w-100 ${msg_cls} mb-2'>
            <div class="col-1 p-0">
              <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
            </div>
            <div class="col-5 text-start receiver-msg p-0">
              <div class='d-inline'>${payload.message}</div>
            </div>
          </div>
        `
      }
      document.getElementById('messages').innerHTML += messageString;
    }
  })

  function sendMessage(event) {
    var inputMessage = document.getElementById('message');
    var fileInput = document.getElementById('file-input');

    if (inputMessage.value || fileInput.files.length > 0) {
        var messageToSend = inputMessage.value;

        // If a file is selected, append its name to the message
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            messageToSend += ' [File: ' + file.value + ']';
        }

        pubnub.publish({
            channel: 'ws-channel',
            message: messageToSend
        });

        // Reset input fields
        inputMessage.value = '';
        fileInput.value = '';

        event.preventDefault();
    }
}
  document.getElementById('input-form').addEventListener('submit', sendMessage);
}

const emojiBtn = document.querySelector('#emoji-btn');
const picker = new EmojiButton();
// Emoji selection  
window.addEventListener('DOMContentLoaded', () => {

  picker.on('emoji', emoji => {
    document.querySelector('input').value += emoji;
  });

  emojiBtn.addEventListener('click', () => {
    picker.togglePicker(emojiBtn);
  });
});

window.onload = loadScript;