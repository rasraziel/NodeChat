//Random number to select random style for chat
let min = 1;
let max = 6;
let random = Math.floor(Math.random() * (max - min)) + min;

// Setting style based on the random number generated
let alertClass;
switch (random) {
    case 1:
        alertClass = 'secondary';
        break;
    case 2:
        alertClass = 'danger';
        break;
    case 3:
        alertClass = 'success';
        break;
    case 4:
        alertClass = 'warning';
        break;
    case 5:
        alertClass = 'info';
        break;
    case 6:
        alertClass = 'light';
        break;
}

$(() => {
    // Connecting socket.io
    let socket = io.connect();
    // Getting the html elements
    let $form = $("#messForm"); // Message form
    let $name = $("#name"); // Name field
    let $textarea = $("#message"); // Message field
    let $all_messages = $("#all_mess"); // Message tree

    // Submit button listener
    $form.submit(event => {
        event.preventDefault();
        socket.emit('sendMessage', { mess: $textarea.val(), name: $name.val(), className: alertClass });
        $textarea.val('');
    });

    socket.on('addMessage', data => {
        $all_messages.append("<div class='alert alert-" + data.className + "'><b>" + data.name + "</b>: " + data.mess + "</div>");
    });
});