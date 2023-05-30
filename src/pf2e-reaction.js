import Settings from "./settings.js";
import reactionHooks from "./hooks.js";
import FlipFormApplication from "./flipForm.js";

Hooks.once("init", () => {
  Settings.register();
});

reactionHooks()

console.log("Pf2e-reaction | --- Module loaded");