import ReactionHomebrewSettings from "./homebrew.js";

export default class Settings {
    static get weaponRange() {
        return game.settings.get("pf2e-reaction", "weaponRange");
    }
    static get weaponReachRange() {
        return game.settings.get("pf2e-reaction", "weaponReachRange");
    }
    static get recallKnowledge() {
        return game.settings.get("pf2e-reaction", "recall-knowledge");
    }
    static get notification() {
        return game.settings.get("pf2e-reaction", "on_notification");
    }
    static get showToPlayers() {
        return game.settings.get("pf2e-reaction", "show-to-players");
    }
    static get useHomebrew() {
        return game.settings.get("pf2e-reaction", "useHomebrew");
    }
    static get addReactionEffect() {
        return game.settings.get("pf2e-reaction", "addReactionEffect");
    }
    static get homebrewReactions() {
        return game.settings.get("pf2e-reaction", "homebrewReactions");
    }
    static register() {

        ReactionHomebrewSettings.init();

        game.settings.register("pf2e-reaction", "weaponRange", {
            name: game.i18n.localize("pf2e-reaction.weaponRange.name"),
            hint: game.i18n.localize("pf2e-reaction.weaponRange.hint"),
            scope: "world",
            config: true,
            default: 5,
            type: Number,
        });
        game.settings.register("pf2e-reaction", "weaponReachRange", {
            name: game.i18n.localize("pf2e-reaction.weaponReachRange.name"),
            hint: game.i18n.localize("pf2e-reaction.weaponReachRange.hint"),
            scope: "world",
            config: true,
            default: 10,
            type: Number,
        });
        game.settings.register("pf2e-reaction", "recall-knowledge", {
            name: game.i18n.localize("pf2e-reaction.recall-knowledge.name"),
            hint: game.i18n.localize("pf2e-reaction.recall-knowledge.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "on_notification", {
            name: game.i18n.localize("pf2e-reaction.show-notification.name"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "show-to-players", {
            name: game.i18n.localize("pf2e-reaction.show-to-players.name"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "addReactionEffect", {
            name: game.i18n.localize("pf2e-reaction.addReactionEffect.name"),
            hint: game.i18n.localize("pf2e-reaction.addReactionEffect.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
    }

}