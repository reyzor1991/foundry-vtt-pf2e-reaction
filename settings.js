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
    static register() {
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
            default: Boolean,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "on_notification", {
            name: game.i18n.localize("pf2e-reaction.show-notification.name"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
    }

}