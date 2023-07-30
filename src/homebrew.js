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
      const h = new HomebrewReactionRequirement();
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
      const h = new HomebrewReactionTrigger();
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
      const h = new HomebrewReaction();
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
        const _e = game.settings.get("pf2e-reaction", "homebrewReactions");
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
            return key !== "homebrewReactions"
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

        const hr_key = key.replace("homebrewReaction.", "");
        const hr_key_parts = hr_key.split(".");
        const hIdx = hr_key_parts[0];
        const keyPart = hr_key_parts[1];

        if (keyPart === "triggers" || keyPart === "requirements") {
            const trigIdx = hr_key_parts[2];
            const trigField = hr_key_parts[3];

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
        for (let i=0; i < this.homebrewReactions.length; i++) {
            this.homebrewReactions[i].idx = i;

            for (let j=0; j < this.homebrewReactions[i].triggers.length; j++) {
                this.homebrewReactions[i].triggers[j].idx = j;
            }
            for (let l=0; l < this.homebrewReactions[i].requirements.length; l++) {
                this.homebrewReactions[i].requirements[l].idx = l;
            }
        }
    }

    rawValue() {
        const res = [];
        for (let i=0; i < this.homebrewReactions.length; i++) {
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

            const i = $(event.currentTarget).data().idx;
            this.homebrewReactions[i].triggers.push(new HomebrewReactionTrigger(this.homebrewReactions[i].triggers.length));
            super.render()
        });
        html.find('.add-reaction-requirement').click(async (event) => {
            this.updateForm(event);

            const i = $(event.currentTarget).data().idx;
            this.homebrewReactions[i].requirements.push(new HomebrewReactionRequirement(this.homebrewReactions[i].requirements.length));
            super.render()
        });
        html.find('.homebrew-reaction-trigger').change(async (event) => {
            this.updateForm(event);
            this.homebrewReactions[$(event.currentTarget).data().parent].triggers[$(event.currentTarget).data().idx].name = $(event.currentTarget).val();
            if ("EnemyUsesTrait" !== $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].triggers[$(event.currentTarget).data().idx].trait = "";
            }
            super.render()
        });
        html.find('.homebrew-reaction-requirement').change(async (event) => {
            this.updateForm(event);
            this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].name = $(event.currentTarget).val();
            if ("ActorHasEffect" !== $(event.currentTarget).val() && "TargetHasEffect" !== $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].effect = "";
            }
            if ("ActorHoldsItem" !== $(event.currentTarget).val() && "TargetHoldsItem" !== $(event.currentTarget).val()) {
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].item = "";
                this.homebrewReactions[$(event.currentTarget).data().parent].requirements[$(event.currentTarget).data().idx].trait = "";
            }
            super.render()
        });
    }

}


async function handleHomebrewMessages(message) {
    if (Settings.useHomebrew) {
        Settings.homebrewReactions
            .filter(a=>a.slug.length > 0 && a.uuid.length > 0 && a.triggers.length > 0)
            .filter(a=>a.triggers.filter(a=> a.name !== "None").length > 0)
            .forEach(hr => {
                const tt = hr.triggers.filter(a => a.name !== "None");
                const requirements = hr.requirements.filter(a => a.name !== "None");
                if (!messageRequirements(message, requirements)) {
                    return;
                }
                if (tt.some(a=>handleHomebrewTrigger(a, message))) {
                    combatantsForTriggers(tt, message)
                        .filter(a=>actorFeat(a.actor, hr.slug) || actorAction(a.actor, hr.slug) || actorSpell(a.actor, hr.slug))
                        .forEach(cc => {
                            postInChatTemplate(_uuid(hr), cc, undefined, tt.find(a=>a.name==="YouHPZero") !== undefined);
                        })
                }
            })
    }
}

function handleHomebrewTrigger(tr, message) {
    if (tr.name === 'EnemyUseRangedAttack' && messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll")) {
        return true;
    }
    if (tr.name === 'EnemyUseManipulateAction' && message?.item?.type === 'action' && message?.item?.system?.traits?.value.includes("manipulate")) {
        return true;
    }
    if (tr.name === 'EnemyUseMoveAction' && message?.item?.type === 'action' && message?.item?.system?.traits?.value.includes("move")) {
        return true;
    }
    if (tr.name === 'FailSavingThrow' && messageType(message, 'saving-throw') && anyFailureMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'CriticalFailSavingThrow' && messageType(message, 'saving-throw') && criticalFailureMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'CriticalHitCreature' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'AllyTakeDamage' && messageType(message, 'damage-roll')) {
        return true;
    }
    if (tr.name === 'ActorTakeDamage' && messageType(message, 'damage-roll')) {
        return true;
    }
    if ((tr.name === 'YouHPZero' || tr.name === "AllyHPZero")
        && message?.flags?.pf2e?.appliedDamage
        && !message?.flags?.pf2e?.appliedDamage?.isHealing
        && message.actor.system?.attributes?.hp?.value === 0) {
        return true;
    }
    if (tr.name === 'EnemyUsesTrait'
        && message?.item?.system?.traits?.value?.includes(tr.trait)) {
        return true;
    }
    if (tr.name === 'EnemyCastSpell' && (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast'))) {
        return true;
    }
    if (tr.name === 'EnemyHitsActor' && messageType(message, 'attack-roll')) {
        return true;
    }
    if (tr.name === 'EnemyCriticalFailHitsActor' && messageType(message, 'attack-roll') && criticalFailureMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'EnemyCriticalHitsActor' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'EnemyFailHitsActor' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'ActorFailsHit' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
        return true;
    }
    if (tr.name === 'CreatureAttacksAlly' && messageType(message, 'attack-roll')) {
        return true;
    }
    if (tr.name === 'ActorFailsSkillCheck' && messageType(message, 'skill-check') && anyFailureMessageOutcome(message)) {
        return true;
    }
    return false;
}

function filterByDistance(t, tr, message) {
    let r = t;
    if (tr.reach) {
        r = r.filter(cc=>canReachEnemy(message.token, cc.token, cc.actor));
    } else if (tr.adjacent) {
        r = r.filter(a=>adjacentEnemy(message.token, a.token));
    } else if (tr.reachValue > 0) {
        r = r.filter(a=>getEnemyDistance(message.token, a.token) <= tr.reachValue);
    }
    return r;
}

function messageRequirements(message, requirements) {
    return requirements.every(a=>{
        if (a.name === 'TargetHasEffect' && hasEffect(message?.target?.actor, a.effect)) {
            return true;
        }
        if (a.name === 'ActorHasEffect' && hasEffect(message?.actor, a.effect)) {
            return true;
        }
        if (a.name === 'ActorHoldsItem' && heldItems(message?.actor, a.item, a.trait).length > 0) {
            return true;
        }
        if (a.name === 'TargetHoldsItem' && heldItems(message?.target?.actor, a.item, a.trait).length > 0) {
            return true;
        }
        return false;
    })
}

function combatantsForTriggers(tt, message) {
    let res = [];

    tt.forEach(tr => {
        if (tr.name === 'EnemyUseRangedAttack' && messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll")) {
            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyUseManipulateAction' && message?.item?.type === 'action' && message?.item?.system?.traits?.value.includes("manipulate")) {
            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyUseMoveAction' && message?.item?.type === 'action' && message?.item?.system?.traits?.value.includes("move")) {
            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'FailSavingThrow' && messageType(message, 'saving-throw') && anyFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'CriticalFailSavingThrow' && messageType(message, 'saving-throw') && criticalFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'CriticalHitCreature' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'AllyTakeDamage' && messageType(message, 'damage-roll')) {
            var t = filterByDistance((isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
            .filter(a=>a.actorId !== message?.target?.actor._id), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'ActorTakeDamage' && messageType(message, 'damage-roll')) {
            var t = filterByDistance([message?.target?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if ((tr.name === 'YouHPZero')
            && message?.flags?.pf2e?.appliedDamage
            && !message?.flags?.pf2e?.appliedDamage?.isHealing
            && message.actor.system?.attributes?.hp?.value === 0) {

            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if ((tr.name === "AllyHPZero")
            && message?.flags?.pf2e?.appliedDamage
            && !message?.flags?.pf2e?.appliedDamage?.isHealing
            && message.actor.system?.attributes?.hp?.value === 0) {

            var t = filterByDistance((isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
                .filter(a=>a.actorId !== message?.actor?._id), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyUsesTrait'
            && message?.item?.system?.traits?.value?.includes(tr.trait)) {

            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyCastSpell' && (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast'))) {
            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyHitsActor' && messageType(message, 'attack-roll')) {
            var t = filterByDistance([message?.target?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyCriticalFailHitsActor' && messageType(message, 'attack-roll') && criticalFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.target?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyCriticalHitsActor' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
            var t = filterByDistance([message?.target?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'EnemyFailHitsActor' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.target?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'ActorFailsHit' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'CreatureAttacksAlly' && messageType(message, 'attack-roll')) {
            var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction())
                .filter(a=>a.actorId !== message?.target?.actor._id), tr, message);
            res = res.concat(t);
        }
        if (tr.name === 'ActorFailsSkillCheck' && messageType(message, 'skill-check') && anyFailureMessageOutcome(message)) {
            var t = filterByDistance([message?.token?.combatant], tr, message);
            res = res.concat(t);
        }
    });
    res = res.filter(a=>a!==null)
    res = [...new Map(res.map(item =>[item['actorId'], item])).values()];

    return res;
}


Hooks.on('preUpdateToken', (tokenDoc, data, deep, id) => {
    if (game?.combats?.active && (data.x > 0 || data.y > 0)) {
        handleHomebrewMessages({
            'token': tokenDoc,
            'item': {
                'type': 'action',
                'system': {
                    'traits': {
                        'value': ['move']
                    }
                }
            },
            'actor': {
                'type': tokenDoc.actor?.type
            }
        })
    }
});

Hooks.on('preCreateChatMessage',async (message, user, _options, userId)=>{
    handleHomebrewMessages(message)
});