import Settings from "./settings.js";
import reactionHooks from "./hooks.js";

Hooks.once("init", () => {
  Settings.register();
});

reactionHooks()
