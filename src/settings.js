export default class Settings {
    static get weaponRange() {
        return game.settings.get("pf2e-reaction", "weaponRange");
    }
    static get recallKnowledge() {
        return game.settings.get("pf2e-reaction", "recall-knowledge");
    }
    static get recallKnowledgeHideDef() {
        return game.settings.get("pf2e-reaction", "recall-knowledge-hide-def");
    }
    static get recallKnowledgeEasyLore() {
        return game.settings.get("pf2e-reaction", "recall-knowledge-easyLore");
    }
    static get recallKnowledgeVeryEasyLore() {
        return game.settings.get("pf2e-reaction", "recall-knowledge-veryEasyLore");
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
    static get postMessage() {
        return game.settings.get("pf2e-reaction", "postMessage");
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
        game.settings.register("pf2e-reaction", "recall-knowledge", {
            name: game.i18n.localize("pf2e-reaction.recall-knowledge.name"),
            hint: game.i18n.localize("pf2e-reaction.recall-knowledge.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "recall-knowledge-hide-def", {
            name: 'Hide default recall knowledge labels',
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "recall-knowledge-easyLore", {
            name: game.i18n.localize("pf2e-reaction.recall-knowledge-easyLore.name"),
            hint: game.i18n.localize("pf2e-reaction.recall-knowledge-easyLore.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "recall-knowledge-veryEasyLore", {
            name: game.i18n.localize("pf2e-reaction.recall-knowledge-veryEasyLore.name"),
            hint: game.i18n.localize("pf2e-reaction.recall-knowledge-veryEasyLore.hint"),
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
        game.settings.register("pf2e-reaction", "postMessage", {
            name: "Post message to chat when press 'Yes'",
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
    }

}