Hooks.once("init", () => {
  Settings.register();
});

function isGM() {
  return game.user.isGM && game.users.activeGM === game.user;
}

console.log("Pf2e-reaction | --- Hooks are added");
