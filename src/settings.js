class BuiltinReactionSettings extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2,
) {

    static namespace = "builtinReactionSettings";
    static tabIds = ["actions", "feats", "spells", "other"];

    static DEFAULT_OPTIONS = {
        tag: "form",
        id: `${BuiltinReactionSettings.namespace}-settings`,
        classes: ["settings-menu"],
        window: {
            title: "Built-in reactions",
            resizable: true,
        },
        position: {
            width: 720,
            height: 520,
        },
        form: {
            handler: BuiltinReactionSettings.formHandler,
            closeOnSubmit: true,
        },
    };

    static PARTS = {
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        actions: {
            template: "modules/pf2e-reaction/templates/builtin-reactions-tab.hbs",
        },
        feats: {
            template: "modules/pf2e-reaction/templates/builtin-reactions-tab.hbs",
        },
        spells: {
            template: "modules/pf2e-reaction/templates/builtin-reactions-tab.hbs",
        },
        other: {
            template: "modules/pf2e-reaction/templates/builtin-reactions-tab.hbs",
        },
        footer: {
            template: "modules/pf2e-reaction/templates/builtin-reactions-footer.hbs",
        }
    };

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.DEFAULT_OPTIONS ?? super.defaultOptions, {
            id: `${this.namespace}-settings`,
            window: {
                title: game.i18n.localize("pf2e-reaction.SETTINGS.builtinReactions.name"),
                resizable: true,
            },
        });
    }

    static init() {
        game.settings.registerMenu("pf2e-reaction", this.namespace, {
            name: game.i18n.localize("pf2e-reaction.SETTINGS.builtinReactions.name"),
            label: game.i18n.localize("pf2e-reaction.SETTINGS.builtinReactions.label"),
            hint: game.i18n.localize("pf2e-reaction.SETTINGS.builtinReactions.hint"),
            icon: "fas fa-shield-alt",
            type: this,
            restricted: true,
        });
    }

    static async formHandler(_event, _form, formData) {
        const data = formData.object ?? {};
        const enabledReactionIds = getBuiltinReactionCatalog()
            .map(({id}) => id)
            .filter((id) => data[`builtinReaction.${id}`]);

        await game.settings.set("pf2e-reaction", "builtinReactionsEnabled", enabledReactionIds);
    }

    getTabData(partId) {
        return getBuiltinReactionSettingsGroups().find((group) => group.id === partId) ?? null;
    }

    _getTabs() {
        const tabGroup = "primary";
        if (!this.tabGroups[tabGroup]) {
            this.tabGroups[tabGroup] = BuiltinReactionSettings.tabIds[0];
        }

        return BuiltinReactionSettings.tabIds.reduce((tabs, partId) => {
            const group = this.getTabData(partId);
            tabs[partId] = {
                id: partId,
                group: tabGroup,
                label: `${game.i18n.localize(group?.labelKey ?? `pf2e-reaction.SETTINGS.builtinReactions.categories.${partId}`)} (${group?.reactions?.length ?? 0})`,
                cssClass: this.tabGroups[tabGroup] === partId ? "active" : "",
            };
            return tabs;
        }, {});
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context = foundry.utils.mergeObject(context, {
            tabs: this._getTabs(),
        });
        return context;
    }

    changeTab(tab, group, options) {
        super.changeTab(tab, group, options);
    }

    async _preparePartContext(partId, context) {
        if (BuiltinReactionSettings.tabIds.includes(partId)) {
            context.tab = context.tabs[partId];
            context.group = this.getTabData(partId);
            context.reactions = context.group?.reactions ?? [];
        }

        return context;
    }
}

class Settings {
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
    static get hideUiNotifications() {
        return game.settings.get("pf2e-reaction", "hide_ui_notifications");
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
    static get allReactionEffect() {
        return game.settings.get("pf2e-reaction", "allReactionEffect");
    }
    static get homebrewReactions() {
        return game.settings.get("pf2e-reaction", "homebrewReactions");
    }
    static get builtinReactionsEnabled() {
        return game.settings.get("pf2e-reaction", "builtinReactionsEnabled");
    }
    static get postMessage() {
        return game.settings.get("pf2e-reaction", "postMessage");
    }
    static register() {

        ReactionHomebrewSettings.init();
        BuiltinReactionSettings.init();

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
            name: game.i18n.localize("pf2e-reaction.hide"),
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
        game.settings.register("pf2e-reaction", "hide_ui_notifications", {
            name: game.i18n.localize("pf2e-reaction.hide-ui-notifications.name"),
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
        game.settings.register("pf2e-reaction", "allReactionEffect", {
            name: game.i18n.localize("pf2e-reaction.allReactionEffect.name"),
            hint: game.i18n.localize("pf2e-reaction.allReactionEffect.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "postMessage", {
            name: game.i18n.localize("pf2e-reaction.post"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register("pf2e-reaction", "timeoutDelete", {
            name: game.i18n.localize("pf2e-reaction.delete.name"),
            hint: game.i18n.localize("pf2e-reaction.delete.hint"),
            scope: "world",
            config: true,
            default: 0,
            type: Number,
        });

        game.settings.register("pf2e-reaction", "builtinReactionsEnabled", {
            name: "Built-in reactions enabled",
            hint: "Internal storage for enabled built-in reactions",
            scope: "world",
            config: false,
            default: getBuiltinReactionCatalog().map(({id}) => id),
            type: Array,
        });

        game.keybindings.register("pf2e-reaction", "skipTriggerReaction", {
            name: game.i18n.localize("pf2e-reaction.hotkey-v.name"),
            hint: game.i18n.localize("pf2e-reaction.hotkey-v.hint"),
            editable: [{   key: "KeyV" }],
            onDown: () => {
                game.skipMoveTrigger = foundry.utils.mergeObject(game.skipMoveTrigger ?? {}, {[game.userId]:true});
                return true;
            },
            onUp: () => {
                game.skipMoveTrigger = foundry.utils.mergeObject(game.skipMoveTrigger ?? {}, {[game.userId]:false});
                return true;
            },
        });

        game.settings.register("pf2e-reaction", "timeoutDelete", {
            name: game.i18n.localize("pf2e-reaction.delete.name"),
            hint: game.i18n.localize("pf2e-reaction.delete.hint"),
            scope: "world",
            config: true,
            default: 0,
            type: Number,
        });


        game.settings.register(moduleName, "customReactionIcon", {
            name: game.i18n.localize("pf2e-reaction.customReactionIcon.name"),
            hint: game.i18n.localize("pf2e-reaction.customReactionIcon.hint"),
            scope: "world",
            config: true,
            default: "",
            filePicker: "file",
            type: String,
        });
    }

}
