export default var socketlibSocket = undefined;

async function deleteItem(id) {
    let target = await fromUuid(id);
    target.delete()
}

async function updateItem(id, data) {
    var _obj = await fromUuid(id);
    _obj.update(data);
}

let setupSocket = () => {
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