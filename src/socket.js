var socketlibSocket = undefined;

async function deleteItem(id) {
    (await fromUuid(id)).delete()
}

async function updateItem(id, data) {
    (await fromUuid(id)).update(data);
}

var setupSocket = () => {
  if (globalThis.socketlib) {
      socketlibSocket = globalThis.socketlib.registerModule("pf2e-reaction");
      socketlibSocket.register("deleteItem", deleteItem);
      socketlibSocket.register("updateItem", updateItem);
  }
  return !!globalThis.socketlib
}

Hooks.once('setup', function () {
    if (!setupSocket()) console.error('Error: Unable to set up socket lib for PF2e Reaction Checker')
});