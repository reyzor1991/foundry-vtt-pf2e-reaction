const Trigger = {
  None: "pf2e-reaction.SETTINGS.trigger.None",
  FailSavingThrow: "pf2e-reaction.SETTINGS.trigger.FailSavingThrow",
  CriticallyHitCreature: "pf2e-reaction.SETTINGS.trigger.CriticallyHitCreature",
  EnemyUseManipulateAction: "pf2e-reaction.SETTINGS.trigger.EnemyUseManipulateAction",
  EnemyUseMoveAction: "pf2e-reaction.SETTINGS.trigger.EnemyUseMoveAction",
  EnemyUseRangedAttack: "pf2e-reaction.SETTINGS.trigger.EnemyUseRangedAttack",
  AllyTakeDamage: "pf2e-reaction.SETTINGS.trigger.AllyTakeDamage"
}

class HomebrewReactionTrigger {
  constructor(idx) {
    this.idx = idx;
    this.name = Trigger.None;
    this.reachValue = 0;
    this.reach = false;
    this.adjacent = false;
    this.choices = Trigger
  }

  static fromObj(obj) {
    var h = new HomebrewReactionTrigger();
    Object.assign(h, obj);
    h.choices = Trigger;
    return h;
  }
}

class HomebrewReaction {
  constructor(idx) {
    this.idx = idx;
    this.slug = "";
    this.uuid = "";
    this.triggers = [new HomebrewReactionTrigger(0)]
  }

  static fromObj(obj) {
    var h = new HomebrewReaction();
    Object.assign(h, obj);
    h.triggers = h.triggers.map(a=>HomebrewReactionTrigger.fromObj(a));
    return h;
  }
}

export default class ReactionHomebrewSettings extends FormApplication {

    static namespace = "homebrewSettings";

    homebrewReactions = []

    constructor(obj) {

        super();
        var _e = game.settings.get("pf2e-reaction", "homebrewReactions");
        if (_e) {
            this.homebrewReactions = _e.map(a=>HomebrewReaction.fromObj(a));
            this.updateIndexes();
        }
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize(`pf2e-reaction.SETTINGS.${this.namespace}.name`),
            id: `${this.namespace}-settings`,
            classes: ['settings-menu'],
            template: `modules/pf2e-reaction/templates/homebrew.hbs`,
            width: 750,
            height: "auto",
            closeOnSubmit: true,
            resizable: true,
        });
    }

    static get settings() {
        return {
            useHomebrew: {
                name: game.i18n.localize(`pf2e-reaction.SETTINGS.useHomebrew.name`),
                scope: "world",
                default: false,
                type: Boolean
            },
            homebrewReactions: {
                name: game.i18n.localize(`pf2e-reaction.SETTINGS.homebrewReactions.name`),
                scope: "world",
                default: [],
                type: Array
            },
        }
    }

    static registerSettings() {
        for (const setting of Object.keys(this.settings)) {
            game.settings.register("pf2e-reaction", setting, {
                ...this.settings[setting],
                config: false,
            });
        }
    }

    static init() {
        game.settings.registerMenu("pf2e-reaction", this.namespace, {
            name: game.i18n.localize(`pf2e-reaction.SETTINGS.${this.namespace}.name`),
            label: game.i18n.localize(`pf2e-reaction.SETTINGS.${this.namespace}.label`),
            hint: game.i18n.localize(`pf2e-reaction.SETTINGS.${this.namespace}.hint`),
            icon: "fas fa-hand",
            type: this,
            restricted: true,
        });
        this.registerSettings();
    }

    getData() {
        const templateData = Object.entries(ReactionHomebrewSettings.settings).filter(([key, setting])=>{
            return key != "homebrewReactions"
        }).map(([key, setting]) => {
            const value = game.settings.get("pf2e-reaction", key);
            return {
                ...setting,
                key,
                value,
                isCheckbox: setting.type === Boolean,
            };
        });
        return mergeObject(super.getData(), {
            settings: templateData,
            homebrewReactions: this.homebrewReactions
        });
    }

    async updateHomebrewReactions(key, value) {
        if (!key.startsWith("homebrewReaction."))return;

        var hr_key = key.replace("homebrewReaction.", "");
        var hr_key_parts = hr_key.split(".");
        var hIdx = hr_key_parts[0];
        var keyPart = hr_key_parts[1];

        if (keyPart == "triggers") {
            var trigIdx = hr_key_parts[2];
            var trigField = hr_key_parts[3];

            this.homebrewReactions[hIdx][keyPart][trigIdx][trigField] = value;
        } else {
            this.homebrewReactions[hIdx][keyPart] = value
        }
    }

    async _updateObject(_event, data) {
        for (const key of Object.keys(data)) {
            if (key.startsWith("homebrewReaction."))continue;
            var _v = data[key];
            if (_v === null || _v === "null") {
                _v = "";
            }
            await game.settings.set("pf2e-reaction", key, _v);
        }
        for (const key of Object.keys(data)) {
            if (!key.startsWith("homebrewReaction."))continue;
            var _v = data[key];
            this.updateHomebrewReactions(key, _v)
        }
        await game.settings.set("pf2e-reaction", "homebrewReactions", this.rawValue());
    }

    updateIndexes() {
        for (var i=0; i < this.homebrewReactions.length; i++) {
            this.homebrewReactions[i].idx = i;

            for (var j=0; j < this.homebrewReactions[i].triggers.length; j++) {
                this.homebrewReactions[i].triggers[j].idx = j;
            }
        }
    }

    rawValue() {
        var res = [];
        for (var i=0; i < this.homebrewReactions.length; i++) {
            res.push(
                {
                    slug: this.homebrewReactions[i].slug,
                    uuid: this.homebrewReactions[i].uuid,
                    triggers: this.homebrewReactions[i].triggers.map(a=>{
                        return {"name":a.name,"reachValue":a.reachValue,"reach":a.reach,"adjacent":a.adjacent};
                    })
                }
            );
        }
        return res;
    }

    updateForm(event) {
        $(event.currentTarget).closest('form').serializeArray().forEach(e=>{
            this.updateHomebrewReactions(e.name,e.value)
        })
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.add-reaction').click(async (event) => {
            this.updateForm(event);

            this.homebrewReactions.push(new HomebrewReaction(this.homebrewReactions.length));
            super.render()
        });
        html.find('.homebrew-reaction-delete').click(async (event) => {
            this.updateForm(event);

            this.homebrewReactions.splice($(event.currentTarget).data().idx, 1);
            this.updateIndexes();
            super.render()
        });
        html.find('.trigger-reaction-delete').click(async (event) => {
            this.updateForm(event);

            this.homebrewReactions[$(event.currentTarget).data().parent].triggers.splice($(event.currentTarget).data().idx, 1);
            this.updateIndexes();
            super.render()
        });
        html.find('.add-reaction-trigger').click(async (event) => {
            this.updateForm(event);

            var i = $(event.currentTarget).data().idx;
            this.homebrewReactions[i].triggers.push(new HomebrewReactionTrigger(this.homebrewReactions[i].triggers.length));
            super.render()
        });
    }

}