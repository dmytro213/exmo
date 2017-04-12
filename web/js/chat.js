var websocket = WS.connect("ws://127.0.0.1:8080");
websocket.on("socket/connect", function (session) {
    session.subscribe("acme/channel", function (uri, payload) {
        if (payload.msg.msg) {
            var $cloneThis = $('#cloneThis');
            cloneMsg(payload.msg, $cloneThis);
        }
    });
    $('form#chat').on('submit', function () {
        submitFormChat(session);
        return false;
    });
    // session.unsubscribe("acme/channel");
});
// websocket.on("socket/disconnect", function (error) {
//     console.log("Disconnected for " + error.reason + " with code " + error.code);
// });
function submitFormChat(session) {
    var dateNow = new Date();
    var formatted = dateNow.toLocaleString();
    var $msg = $('#msg');
    var msg = $msg.val();
    $msg.val('');
    var name = $('#name').val();
    name = (name) ? name : 'unknown user';
    if (msg && formatted) {
        session.publish("acme/channel", {msg: msg, name: name, datetime: formatted});
    }
}
function cloneMsg(msg, $cloneThis) {
    var $cloneElem = $cloneThis.clone().removeAttr('id');
    $cloneElem.find('p').text(msg.msg);
    $cloneElem.find('footer').text(msg.name);
    $cloneElem.find('.datetime').text(msg.datetime);
    $cloneElem.prependTo('#cloneTo');
}