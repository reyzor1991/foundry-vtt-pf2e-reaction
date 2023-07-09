const Requirement = {
  None: "pf2e-reaction.SETTINGS.requirement.None",
  ActorHasEffect: "pf2e-reaction.SETTINGS.requirement.ActorHasEffect",
  TargetHasEffect: "pf2e-reaction.SETTINGS.requirement.TargetHasEffect",
  ActorHoldsItem: "pf2e-reaction.SETTINGS.requirement.ActorHoldsItem",
  TargetHoldsItem: "pf2e-reaction.SETTINGS.requirement.TargetHoldsItem",
}
const Trigger = {
  None: "pf2e-reaction.SETTINGS.trigger.None",
  CriticalFailSavingThrow: "pf2e-reaction.SETTINGS.trigger.CriticalFailSavingThrow",
  FailSavingThrow: "pf2e-reaction.SETTINGS.trigger.FailSavingThrow",
  CriticalHitCreature: "pf2e-reaction.SETTINGS.trigger.CriticalHitCreature",
  EnemyUseManipulateAction: "pf2e-reaction.SETTINGS.trigger.EnemyUseManipulateAction",
  EnemyUseMoveAction: "pf2e-reaction.SETTINGS.trigger.EnemyUseMoveAction",
  EnemyUseRangedAttack: "pf2e-reaction.SETTINGS.trigger.EnemyUseRangedAttack",
  AllyTakeDamage: "pf2e-reaction.SETTINGS.trigger.AllyTakeDamage",
  ActorTakeDamage: "pf2e-reaction.SETTINGS.trigger.ActorTakeDamage",
  CreatureAttacksAlly: "pf2e-reaction.SETTINGS.trigger.CreatureAttacksAlly",
  YouHPZero: "pf2e-reaction.SETTINGS.trigger.YouHPZero",
  AllyHPZero: "pf2e-reaction.SETTINGS.trigger.AllyHPZero",
  EnemyUsesTrait: "pf2e-reaction.SETTINGS.trigger.EnemyUsesTrait",
  EnemyCastSpell: "pf2e-reaction.SETTINGS.trigger.EnemyCastSpell",
  EnemyHitsActor: "pf2e-reaction.SETTINGS.trigger.EnemyHitsActor",
  EnemyCriticalFailHitsActor: "pf2e-reaction.SETTINGS.trigger.EnemyCriticalFailHitsActor",
  EnemyCriticalHitsActor: "pf2e-reaction.SETTINGS.trigger.EnemyCriticalHitsActor",
  EnemyFailHitsActor: "pf2e-reaction.SETTINGS.trigger.EnemyFailHitsActor",
  ActorFailsHit: "pf2e-reaction.SETTINGS.trigger.ActorFailsHit",
  ActorFailsSkillCheck: "pf2e-reaction.SETTINGS.trigger.ActorFailsSkillCheck",
}

class HomebrewReactionRequirement {
  constructor(idx) {
    this.idx = idx;
    this.name = Requirement.None;
    this.effect = "";
    this.item = "";
    this.trait = "";
    this.choices = Requirement
  }

  static fromObj(obj) {
    var h = new HomebrewReactionRequirement();
    Object.assign(h, obj);
    h.choices = Requirement;
    return h;
  }
}

class HomebrewReactionTrigger {
  constructor(idx) {
    this.idx = idx;
    this.name = Trigger.None;
    this.reachValue = 0;
    this.reach = false;
    this.adjacent = false;
    this.trait = "";
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
    this.requirements = []
  }

  static fromObj(obj) {
    var h = new HomebrewReaction();
    Object.assign(h, obj);
    h.triggers = h.triggers.map(a=>HomebrewReactionTrigger.fromObj(a));
    h.requirements = h.requirements.map(a=>HomebrewReactionRequirement.fromObj(a));
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
            width: 1050,
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

        if (keyPart == "triggers" || keyPart == "requirements") {
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
            for (var l=0; l < this.homebrewReactions[i].requirements.length; l++) {
                this.homebrewReactions[i].requirements[l].idx = l;
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
                        return {"name":a.name,"reachValue":a.reachValue,"reach":a.reach,"adjacent":a.adjacent,"trait":a.trait};
                    }),
                    requirements: this.homebrewReactions[i].requirements.map(a=>{
                        return {"name":a.name,"effect":a.effect,"item":a.item,"trait":a.trait};
                    }),
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
        html.find('.requirement-reaction-delete').click(async (event) => {
            this.updateForm(event);

            this.homebrewReactions[$(event.currentTarget).data().parent].requirements.splice($(event.currentTarget).data().idx, 1);
            this.updateIndexes();
            super.render()
        });
        html.find('.add-reaction-trigger').click(async (event) => {
            this.updateForm(event);

            var i = $(event.currentTarget).data().idx;
            this.homebrewReactions[i].triggers.push(new HomebrewReactionTrigger(this.homebrewReactions[i].triggers.length));
            super.render()
        });
        html.find('.add-reaction-requirement').click(async (event) => {
            this.updateForm(event);

            var i = $(event.currentTarget).data().idx;
            this.homebrewReactions[i].requirements.push(new HomebrewReactionRequirement(this.homebrewReactions[i].requirements.length));
            super.render()
        });
        html.find('.homebrew-reaction-trigger').change(async (event) => {
            this.updateForm(event);
            this.homebrewReactions[$(event.currentTarget).data().parent].triggers[$(event.currentTarget).data().idx].name = $(event.currentTarget).val();
            if ("EnemyUsesTrait" != $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].triggers[$(event.currentTarget).data().idx].trait = "";
            }
            super.render()
        });
        html.find('.homebrew-reaction-requirement').change(async (event) => {
            this.updateForm(event);
            this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].name = $(event.currentTarget).val();
            if ("ActorHasEffect" != $(event.currentTarget).val() && "TargetHasEffect" != $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].effect = "";
            }
            if ("ActorHoldsItem" != $(event.currentTarget).val() && "TargetHoldsItem" != $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].item = "";
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].trait = "";
            }
            super.render()
        });
    }

}