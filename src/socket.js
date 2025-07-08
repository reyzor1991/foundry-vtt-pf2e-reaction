let socketlibSocket = undefined;

async function deleteItem(id) {
    await (await fromUuid(id)).delete()
}

async function updateItem(id, data) {
    (await fromUuid(id)).update(data);
}

function createMessage(data, isOwner) {
    if (!isOwner) {
        socketlibSocket._sendRequest("createMessage", [data, true], 0)
        return
    }

    ChatMessage.create(data).then(m => {
        const tt = game.settings.get("pf2e-reaction", "timeoutDelete")
        if (tt > 0) {
            setTimeout(function () {
                m.delete()
            }, tt * 1000)
        }
    });
};

function updateMessageById(id, data) {
    updateMessage(game.messages.get(id), data)
};

function updateMessage(message, data) {
    if (!message) {
        return;
    }
    if (!message.isOwner) {
        socketlibSocket._sendRequest("updateMessageById", [message.id, data], 0)
        return;
    }

    message.update(data, {noHook: true});
};

const setupSocket = () => {
    if (globalThis.socketlib) {
        socketlibSocket = globalThis.socketlib.registerModule("pf2e-reaction");
        socketlibSocket.register("deleteItem", deleteItem);
        socketlibSocket.register("updateItem", updateItem);
        socketlibSocket.register("createMessage", createMessage);
        socketlibSocket.register("updateMessageById", updateMessageById);
    }
    return !!globalThis.socketlib
};

Hooks.once('setup', function () {
    if (!setupSocket()) console.error('Error: Unable to set up socket lib for PF2e Reaction Checker')
});