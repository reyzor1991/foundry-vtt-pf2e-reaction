import Settings from "./settings.js";
import socketlibSocket from "./socket.js";

//const empty = "@UUID[]"
const unexpected_shift = "@UUID[Compendium.pf2e.feats-srd.Item.AgR1OPBHDvwV5wKD]"
const squawk = "@UUID[Compendium.pf2e.feats-srd.Item.CCmiEmS7ZgyQUfhn]"
const orc_ferocity = "@UUID[Compendium.pf2e.feats-srd.Item.PlhPpdwIV0rIAJ8K]"
const final_spite = "@UUID[Compendium.pf2e.actionspf2e.Item.jbmXxq56swDYw8hy]"
const entitys_resurgence = "@UUID[Compendium.pf2e.actionspf2e.Item.5bCZGpp9yFHXDz1j]"
const stand_still = "@UUID[Compendium.pf2e.feats-srd.Item.Mj1KTiAwwovm7K9f]"
const impossible_technique = "@UUID[Compendium.pf2e.feats-srd.Item.srWsvDDdz77yieY1]"
const rippling_spin = "@UUID[Compendium.pf2e.feats-srd.Item.9MiK0Lyro5dQgHij]"
const electric_counter = "@UUID[Compendium.pf2e.feats-srd.Item.zfnZki2CxmZXdNBO]"
const deflect_arrow = "@UUID[Compendium.pf2e.feats-srd.Item.sgaqlDFTVC7Ryurt]"
const crane_flutter = "@UUID[Compendium.pf2e.feats-srd.Item.S14S52HjszTgIy4l]"
const align_ki = "@UUID[Compendium.pf2e.feats-srd.Item.6iDd7CTzxkvMp6lB]"
const suspect_of_opportunity = "@UUID[Compendium.pf2e.feats-srd.Item.Sc9clbAXe97vlzxM]"
const foresee_danger = "@UUID[Compendium.pf2e.feats-srd.Item.pVDgiaqu1RbCOhuv]"
const you_failed_to_account_for_this = "@UUID[Compendium.pf2e.feats-srd.Item.zBS1qFyIpFuCGhWW]"
const negate_damage = "@UUID[Compendium.pf2e.feats-srd.Item.J8HLcsOkAcXfTxYy]"
const everdistant_defense = "@UUID[Compendium.pf2e.feats-srd.Item.EP8kaXNmrMfxOFAf]"
const reverberate = "@UUID[Compendium.pf2e.feats-srd.Item.ecV3Nljvs4FOBS27]"
const resounding_finale = "@UUID[Compendium.pf2e.feats-srd.Item.lhSqWHXK1JShUabF]"
const all_in_my_head = "@UUID[Compendium.pf2e.feats-srd.Item.wqAdzjRUOvTpKFKq]"
const wounded_rage = "@UUID[Compendium.pf2e.feats-srd.Item.CLKlavik0540j5bl]"
const cleave = "@UUID[Compendium.pf2e.feats-srd.Item.GE96a0UGPYM74qjI]"
const shield_block = "@UUID[Compendium.pf2e.feats-srd.Item.jM72TjJ965jocBV8]"
const schadenfreude = "@UUID[Compendium.pf2e.spells-srd.Item.8E97SA9KAWCNdXfO]"
const clever_gambit = "@UUID[Compendium.pf2e.feats-srd.Item.D1o7GUraoFFzjaub]"
const implements_interruption = "@UUID[Compendium.pf2e.actionspf2e.Item.dnaPJfA0CDLNrWcW]"
const ring_bell = "@UUID[Compendium.pf2e.actionspf2e.Item.ublVm5gmCIm3eRdQ]"
const amulets_abeyance = "@UUID[Compendium.pf2e.actionspf2e.Item.Or6RLXeoZkN8CLdi]"
const convincing_illusion = "@UUID[Compendium.pf2e.feats-srd.Item.bSXcyu7ExWq9qUzG]"
const scapegoat_parallel_self = "@UUID[Compendium.pf2e.feats-srd.Item.tBWSxVxrojRcEzJt]"
const ruby_resurrection = "@UUID[Compendium.pf2e.feats-srd.Item.9Slu8lSOYnDtKsIb]"
const spell_relay = "@UUID[Compendium.pf2e.feats-srd.Item.zwEaXGKqnlBTllfE]"
const cheat_death = "@UUID[Compendium.pf2e.feats-srd.Item.D2KSVHPRlBEibrV8]"
const twin_riposte = "@UUID[Compendium.pf2e.feats-srd.Item.GJIAecRq1bD2r8O0]"
const guardians_deflection_swashbuckler = "@UUID[Compendium.pf2e.feats-srd.Item.YJIzE2RhGRGfbt9j]"
const guardians_deflection_fighter = "@UUID[Compendium.pf2e.feats-srd.Item.JdCRxwgtdQkJ1Ha6]"
const farabellus_flip = "@UUID[Compendium.pf2e.feats-srd.Item.PH5b61x3iJSKP3Xi]"
const dueling_riposte = "@UUID[Compendium.pf2e.feats-srd.Item.mf2cdCRV8uowOMOm]"
const verdant_presence = "@UUID[Compendium.pf2e.feats-srd.Item.Lbpm0OrQb4u2LVtj]"
const storm_retribution = "@UUID[Compendium.pf2e.feats-srd.Item.F1DVDJRARfdb1Kjz]"
const reactive_transformation = "@UUID[Compendium.pf2e.feats-srd.Item.4Q9Q41KLPYJMdV4b]"
const fiery_retort = "@UUID[Compendium.pf2e.feats-srd.Item.6biVVoaqqUdQmQ37]"
const courageous_opportunity = "@UUID[Compendium.pf2e.feats-srd.Item.nEmaHLsZEBru1Jjv]"
const premonition_of_clarity = "@UUID[Compendium.pf2e.feats-srd.Item.2h8a6pKhXTXwpJjP]"
const rapid_response = "@UUID[Compendium.pf2e.feats-srd.Item.OcBaEnGdDm6CuSnr]"
const denier_of_destruction = "@UUID[Compendium.pf2e.feats-srd.Item.siegOEdEpevAJNFw]"
const shield_wall = "@UUID[Compendium.pf2e.feats-srd.Item.QpRzvfWdj6YH9TyE]"
const sacrifice_armor = "@UUID[Compendium.pf2e.feats-srd.Item.bYijGvCvCmJnW6aA]"
const ringmasters_introduction = "@UUID[Compendium.pf2e.feats-srd.Item.OliKxFIqzky2o6vk]"
const pirouette = "@UUID[Compendium.pf2e.feats-srd.Item.RlKGaxQWWLa7xJSc]"
const accompany = "@UUID[Compendium.pf2e.feats-srd.Item.oTTddwzF9TPNkMyd]"
const counter_thought = "@UUID[Compendium.pf2e.feats-srd.Item.QKC9iiR4Epj1Lyc7]"
const spiritual_guides = "@UUID[Compendium.pf2e.feats-srd.Item.cEu8BUS41dlPyPGW]"
const tangle_of_battle = "@UUID[Compendium.pf2e.feats-srd.Item.GLbl3qoWCvvjJr4S]"
const mage_hunter = "@UUID[Compendium.pf2e.feats-srd.Item.mqLPCNdCSNyY7gyI]"
const furious_vengeance = "@UUID[Compendium.pf2e.feats-srd.Item.Oyml3OGNy468z3XI]"
const embrace_the_pain = "@UUID[Compendium.pf2e.feats-srd.Item.j20djiiuVwUf8MqL]"
const opportune_riposte = "@UUID[Compendium.pf2e.actionspf2e.EfjoIuDmtUn4yiow]"
const perfect_clarity = "@UUID[Compendium.pf2e.feats-srd.Item.JkQjKyzfhMWLr9Gs]"
const opportune_riposte_action = "@UUID[Compendium.pf2e.actionspf2e.EfjoIuDmtUn4yiow]"
const airy_step_action = "@UUID[Compendium.pf2e.actionspf2e.akmQzZoNhyfCKFpL]"
const retaliatory_cleansing = "@UUID[Compendium.pf2e.feats-srd.Item.y7SYHv0DWkkwjT95]"
const airy_step_feat = "@UUID[Compendium.pf2e.feats-srd.Item.hOD9de1ftfYRSEKn]"
const nimble_dodge_action = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.wCnsRCHvtZkZTmO0]"
const nimble_dodge_feat = "@UUID[Compendium.pf2e.feats-srd.Item.dNH8OHEvx3vI9NBQ]"
const fast_swallow = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.IQtb58p4EaeUzTN1]"
const retributive_strike_npc = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.IQtb58p4EaeUzTN1]"
const retributive_strike = "@UUID[Compendium.pf2e.actionspf2e.Item.EAP98XaChJEbgKcK]"
const ferocity = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.N1kstYbHScxgUQtN]"
const attack_of_opportunity = "@UUID[Compendium.pf2e.actionspf2e.KAVf7AmRnbCAHrkT]"
const no_escape = "@UUID[Compendium.pf2e.feats-srd.Item.lT8XlX1Ig900BblS]"
const glimpse_of_redemption = "@UUID[Compendium.pf2e.actionspf2e.tuZnRWHixLArvaIf]"
const wicked_thorns = "@UUID[Compendium.pf2e.actionspf2e.ncdryKskPwHMgHFh]"
const iron_command = "@UUID[Compendium.pf2e.actionspf2e.M8RCbthRhB4bxO9t]"
const selfish_shield = "@UUID[Compendium.pf2e.actionspf2e.enQieRrITuEQZxx2]"
const destructive_vengeance = "@UUID[Compendium.pf2e.actionspf2e.r5Uth6yvCoE4tr9z]"
const liberating_step = "@UUID[Compendium.pf2e.actionspf2e.IX1VlVCL5sFTptEE]"
const knights_retaliation = "@UUID[Compendium.pf2e.feats-srd.Item.jZy91ekcS9ZqmdEH]"
const mirror_shield = "@UUID[Compendium.pf2e.feats-srd.Item.kQEIPYoKTt69yXxV]"
const reactive_shield = "@UUID[Compendium.pf2e.feats-srd.Item.w8Ycgeq2zfyshtoS]"
const charmed_life = "@UUID[Compendium.pf2e.feats-srd.Item.DkoxNw9tsFFXrfJY]"
const hit_the_dirt = "@UUID[Compendium.pf2e.feats-srd.Item.6LFBPpPPJjDq07fg]"
const grit_and_tenacity = "@UUID[Compendium.pf2e.feats-srd.Item.94PGauGdzrVARMLc]"
const distracting_explosion = "@UUID[Compendium.pf2e.feats-srd.Item.XPTSCUoA8c4o9RgQ]"
const emergency_targe = "@UUID[Compendium.pf2e.feats-srd.Item.uY03kVQBA81gbTj9]"

const reactionWasUsedEffect = "Compendium.pf2e-reaction.reaction-effects.Item.Dvi4ewimR9t5723U"

const identifySkills = new Map([
    ["aberration", ["occultism"]],
    ["animal", ["nature"]],
    ["astral", ["occultism"]],
    ["beast", ["arcana", "nature"]],
    ["celestial", ["religion"]],
    ["construct", ["arcana", "crafting"]],
    ["dragon", ["arcana"]],
    ["elemental", ["arcana", "nature"]],
    ["ethereal", ["occultism"]],
    ["fey", ["nature"]],
    ["fiend", ["religion"]],
    ["fungus", ["nature"]],
    ["humanoid", ["society"]],
    ["monitor", ["religion"]],
    ["ooze", ["occultism"]],
    ["plant", ["nature"]],
    ["spirit", ["occultism"]],
    ["undead", ["religion"]],
]);

const filteredTraits = ["evil", "chaotic", "neutral", "lawful", "good"]

function adjustDegreeByDieValue(dieResult, degree) {
        if (dieResult === 20) {
            return degree + 1;
        } else if (dieResult === 1) {
            return degree - 1;
        }
        return degree;
}

function calculateDegreeOfSuccess(dc, rollTotal, dieResult) {
        if (rollTotal - dc >= 10) {
            return adjustDegreeByDieValue(dieResult, 3);
        } else if (dc - rollTotal >= 10) {
            return adjustDegreeByDieValue(dieResult, 0);
        } else if (rollTotal >= dc) {
            return adjustDegreeByDieValue(dieResult, 2);
        }
        return adjustDegreeByDieValue(dieResult, 1);
}

function updateInexhaustibleCountermoves(combatant) {
    if (!combatant) {
        return
    }
    if (isNPC(combatant.actor)) {
        setInexhaustibleCountermoves(game.combat.combatants.filter(a=>isActorCharacter(a.actor)), 1)
    } else {
        setInexhaustibleCountermoves(game.combat.combatants.filter(a=>isActorCharacter(a.actor)), 0)
    }
}

function setInexhaustibleCountermoves(combatants, val) {
    combatants.forEach(cc=> {
        if (actorFeat(cc.actor, "inexhaustible-countermoves")) {
            cc.update({
                "flags.reaction-check.inexhaustible-countermoves": val
            });
        }
    })
}

function updateCombatantReactionState(combatant, newState, actionName=undefined) {
    if (!combatant) {return}
    if (!newState) {
        if (!hasReaction(combatant, actionName) && game.user.isGM) {
            ui.notifications.warn(`${combatant.name} does not have reaction anymore`);
            return;
        }
        if (actionName == "attack-of-opportunity") {
            if (combatant?.flags?.['reaction-check']?.['triple-opportunity']) {
                combatant.update({
                    "flags.reaction-check.triple-opportunity": combatant['flags']['reaction-check']['triple-opportunity'] - 1
                });
                return;
            }
            if (combatant?.flags?.['reaction-check']?.['combat-reflexes']) {
                combatant.update({
                    "flags.reaction-check.combat-reflexes": combatant['flags']['reaction-check']['combat-reflexes'] - 1
                });
                return;
            }
            if (combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves']) {
                combatant.update({
                    "flags.reaction-check.inexhaustible-countermoves": combatant['flags']['reaction-check']['inexhaustible-countermoves'] - 1
                });
                return;
            }
        } else if (actionName == "opportune-riposte") {
            if (combatant?.flags?.['reaction-check']?.['reflexive-riposte']) {
                combatant.update({
                    "flags.reaction-check.reflexive-riposte": combatant['flags']['reaction-check']['reflexive-riposte'] - 1
                });
                return;
            }
            if (combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves']) {
                combatant.update({
                    "flags.reaction-check.inexhaustible-countermoves": combatant['flags']['reaction-check']['inexhaustible-countermoves'] - 1
                });
                return;
            }
        } else if (actionName == "shield-block") {
            if (combatant?.flags?.['reaction-check']?.['quick-shield-block']) {
                combatant.update({
                    "flags.reaction-check.quick-shield-block": combatant['flags']['reaction-check']['quick-shield-block'] - 1
                });
                return;
            }
        }
        combatant.update({
            "flags.reaction-check.state": false
        });
    } else {
        if (isNPC(combatant.actor)) {
            if (actorAction(combatant.actor, "triple-opportunity")) {
                combatant.update({
                    "flags.reaction-check.triple-opportunity": 2
                });
            }
        } else {
            if (actorFeat(combatant.actor, "combat-reflexes")) {
                combatant.update({
                    "flags.reaction-check.combat-reflexes": 1
                });
            }
            if (actorFeat(combatant.actor, "reflexive-riposte")) {
                combatant.update({
                    "flags.reaction-check.reflexive-riposte": 1
                });
            }
            if (actorFeat(combatant.actor, "quick-shield-block")) {
                combatant.update({
                    "flags.reaction-check.quick-shield-block": 1
                });
            }
        }

        combatant.update({
            "flags.reaction-check.state": true
        });
    }
}

function getEnemyDistance(token, target) {
    return token.object.distanceTo(target.object);
}

function nonReach(arr) {
    return !arr.find(b=>b.startsWith("reach"))
}

function actorHeldWeapon(actor) {
    return actor?.system?.actions?.filter(a=>a.ready)
}

function hasReachWeapon(actor) {
    return actor?.system?.actions
        ?.filter(a=>a.ready)
        ?.filter(a=>a?.weaponTraits?.find(b=>b.name=="reach"))
        ?.length != 0
}

function isTargetCharacter(message) {
    return isActorCharacter(message?.target?.actor);
}

function isActorCharacter(actor) {
    return "character" == actor?.type || (actor?.type == "npc" && actor?.alliance == "party");
}

function isNPC(actor) {
    return "npc" == actor?.type;
}

function _uuid(obj) {
    return "@UUID["+obj.uuid+"]";
}

function countAllReaction(combatant) {
    var count = 0;
    if (combatant) {
        if (combatant?.flags?.["reaction-check"]?.state) {
            count += 1;
        }

        count += combatant?.flags?.['reaction-check']?.['triple-opportunity'] ?? 0;
        count += combatant?.flags?.['reaction-check']?.['combat-reflexes'] ?? 0;
        count += combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves'] ?? 0;

        count += combatant?.flags?.['reaction-check']?.['reflexive-riposte'] ?? 0;

        count += combatant?.flags?.['reaction-check']?.['quick-shield-block'] ?? 0;
    }
    return count;
}

function countReaction(combatant, actionName=undefined) {
    var count = 0;
    if (combatant) {
        if (combatant?.flags?.["reaction-check"]?.state) {
            count += 1;
        }
        if (actionName == "attack-of-opportunity") {
            count += combatant?.flags?.['reaction-check']?.['triple-opportunity'] ?? 0;
            count += combatant?.flags?.['reaction-check']?.['combat-reflexes'] ?? 0;
            count += combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves'] ?? 0;
        } else if (actionName == "opportune-riposte") {
            count += combatant?.flags?.['reaction-check']?.['reflexive-riposte'] ?? 0;
            count += combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves'] ?? 0;
        } else if (actionName == "shield-block") {
            count += combatant?.flags?.['reaction-check']?.['quick-shield-block'] ?? 0;
        }
    }
    return count;
}

function hasReaction(combatant, actionName=undefined) {
    return countReaction(combatant, actionName) > 0;
}

function characterWithReaction() {
    return game.combat.turns.filter(a => isActorCharacter(a.actor)).filter(a=>hasReaction(a));
}

function npcWithReaction() {
    return game.combat.turns.filter(a => !isActorCharacter(a.actor)).filter(a=>hasReaction(a));
}

function hasCondition(actor, con) {
    return actor && actor?.itemTypes?.condition?.find((c => c.type == "condition" && con === c.slug))
}

function hasEffect(actor, eff) {
    return actor && actor?.itemTypes?.effect?.find((c => eff === c.slug))
}

function hasEffectBySource(actor, eff) {
    return actor?.itemTypes?.effect?.find((c => eff === c.sourceId))
}

function actorAction(actor, action) {
    return actor?.itemTypes?.action?.find((c => action === c.slug))
}

function actorSpell(actor, spell) {
    return actor?.itemTypes?.spell?.find((c => spell === c.slug))
}

function actorFeat(actor, feat) {
    return actor?.itemTypes?.feat?.find((c => feat === c.slug))
}

function actorFeats(actor, feats) {
    return actor?.itemTypes?.feat?.filter((c => feats.includes(c.slug)))
}

function heldItems(actor, item, trait=undefined) {
    if (!actor) return []
    let items = Object.values(actor?.itemTypes).flat(1).filter(a=>a.handsHeld > 0).filter(a=>a.slug == item || a.category == item);
    if (trait && items.length>0) {
        items = items.filter(a=>a.traits.has(trait))
    }
    return items;
}

function canReachEnemy(attackerToken, defendToken, defendActor, specificWeapon=undefined) {
    var distance = getEnemyDistance(attackerToken, defendToken);
    if (isNPC(defendActor)) {
        let baseWeapons = defendActor?.system?.actions
            .filter(a=>a.ready);

        if (specificWeapon) {
            specificWeapon = specificWeapon.toLowerCase()
            baseWeapons = baseWeapons
                .filter(a=>a.label.toLowerCase() == specificWeapon || a?.weapon?.slug?.toLowerCase() == specificWeapon)
        }

        let reachWs = baseWeapons
            .map(a=>a.traits).flat()
            .map(c=>c.name)
            .filter(b=>b.startsWith("reach"))
            .map(c=>c.split('-').slice(-1)[0]);

        if (reachWs.length) {
            return distance <= Math.max(...reachWs)
        } else {
            return distance <= defendActor.attributes.reach.base
        }
    } else {
        return distance <= defendActor.attributes.reach.base
            || (distance <= (defendActor.attributes.reach.base + 5) && hasReachWeapon(defendActor))
    }
}

function adjacentEnemy(attackerToken, defendToken) {
    return getEnemyDistance(attackerToken, defendToken) <= 5
}

async function reactionWasUsedChat(uuid, combatant) {
    var content = await renderTemplate("./modules/pf2e-reaction/templates/used.hbs", {uuid:uuid,combatant:combatant});

    var whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    if (combatant.players) {
        whispers = whispers.concat(combatant.players.map((u) => u.id));
    }

    ChatMessage.create({
        flavor: '',
        user: null,
        speaker: {
            scene: null,
            actor: null,
            token: null,
            alias: "System"
        },
        type: CONST.CHAT_MESSAGE_TYPES.OOC,
        content: content,
        whisper: whispers
    });
}

async function postTargetInChatTemplate(uuid, combatant) {
    postInChatTemplate(uuid, combatant, undefined, false, true)
}

async function postInChatTemplate(uuid, combatant, actionName=undefined, skipDeath=false, needTarget=false) {
    if (!skipDeath) {
        if((combatant?.actor?.system?.attributes?.hp?.value <= 0 && combatant?.actor?.system?.attributes?.hp?.temp <= 0 )
            || hasCondition(combatant?.actor, "unconscious")
            || hasCondition(combatant?.actor, "dying")
        ) {
            return
        }
    }

    var text = game.i18n.format("pf2e-reaction.ask", {uuid:uuid, name:combatant.token.name});
    var content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});
    var check = {
        cId: combatant._id,
        uuid: uuid,
        actionName: actionName
    }

    var whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    if (combatant.players) {
        whispers = whispers.concat(combatant.players.map((u) => u.id));
    }

    if (game.messages.size > 0 && content == game.messages.contents[game.messages.size-1].content) {
        check['count'] = 2
        check['content'] = content
        check['reactions'] = countReaction(combatant, actionName)
        check['needTarget'] = needTarget

        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: 2});
        content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});

        game.messages.contents[game.messages.size-1].update({
            'content': content,
            "flags.reaction-check": check
        })
    } else if (game.messages.size > 0 && content == game.messages.contents[game.messages.size-1]?.flags?.["reaction-check"]?.content) {
        var count = game.messages.contents[game.messages.size-1]?.flags?.["reaction-check"]?.count + 1;
        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: count});
        content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});

        game.messages.contents[game.messages.size-1].update({
            'content': content,
            "flags.reaction-check.count": count,
            "flags.reaction-check.reactions": countReaction(combatant, actionName)
        })
    } else {
        ChatMessage.create({
            flavor: '',
            user: null,
            speaker: {
                scene: null,
                actor: null,
                token: null,
                alias: "System"
            },
            type: CONST.CHAT_MESSAGE_TYPES.OOC,
            content: content,
            whisper: whispers,
            flags: {"reaction-check": check}
        });
    }
}

function checkCombatantTriggerAttackOfOpportunity(actor, actorId, token) {
    (isActorCharacter(actor) ? npcWithReaction() : characterWithReaction())
        .filter(c=>c.actorId != actorId)
        .filter(c=> hasReaction(c, "attack-of-opportunity"))
        .filter((cc=>actorAction(cc.actor, "attack-of-opportunity") || actorFeat(cc.actor, "attack-of-opportunity")))
        .forEach(cc => {
            let specificWeapon=undefined
            if (isNPC(cc.actor)) {
                let aoo = actorAction(cc.actor, "attack-of-opportunity");
                if (aoo) {
                    let match = aoo.name.match('\(([A-Za-z]{1,}) Only\)')
                    if (match && match.length == 3) {
                        specificWeapon=match[2]
                    }
                }
            }
            if (canReachEnemy(token, cc.token, cc.actor, specificWeapon)) {
                postInChatTemplate(attack_of_opportunity, cc, "attack-of-opportunity");
            }
        })
}

function checkRingmasterIntroduction(combatant) {
    if (isActorCharacter(combatant?.actor)) {
        characterWithReaction()
            .filter(a=>a.tokenId != combatant.tokenId)
            .filter(a=>hasReaction(a))
            .forEach(cc => {
                if (actorFeat(cc.actor, "ringmasters-introduction")) {
                    postInChatTemplate(ringmasters_introduction, cc);
                }
            })
    }
}

function messageType(message, type) {
    return type == message?.flags?.pf2e?.context?.type;
}

function failureMessageOutcome(message) {
    return "failure" == message?.flags?.pf2e?.context?.outcome;
}

function criticalFailureMessageOutcome(message) {
    return "criticalFailure" == message?.flags?.pf2e?.context?.outcome;
}

function successMessageOutcome(message) {
    return "success" == message?.flags?.pf2e?.context?.outcome;
}

function criticalSuccessMessageOutcome(message) {
    return "criticalSuccess" == message?.flags?.pf2e?.context?.outcome;
}

function anyFailureMessageOutcome(message) {
    return failureMessageOutcome(message) || criticalFailureMessageOutcome(message);
}

function anySuccessMessageOutcome(message) {
    return successMessageOutcome(message) || criticalSuccessMessageOutcome(message);
}
function hasOption(message, opt) {
    return message?.flags?.pf2e?.context?.options?.includes(opt);
}

function checkCourageousOpportunity(message) {
    (isActorCharacter(message.actor) ? npcWithReaction() : characterWithReaction())
        .filter(a=>actorFeat(a.actor, "courageous-opportunity"))
        .filter(cc=>canReachEnemy(message.token, cc.token, cc.actor))
        .filter(a=>hasEffect(a.actor, "spell-effect-inspire-courage"))
        .forEach(cc => {
            postInChatTemplate(courageous_opportunity, cc);
        });
}

function spellWithTrait(spell, trait) {
    return spell?.traits?.has(trait) || spell?.castingTraits?.includes(trait)
}

function messageWithTrait(message, trait) {
    return message?.item?.system?.traits?.value?.includes(trait) || message?.item?.castingTraits?.includes(trait)
}

function messageWithAnyTrait(message, traits) {
    return traits.some(a=>messageWithTrait(message, a))
}

function checkImplementsInterruption(message) {
    if (!isActorCharacter(message.actor) && hasEffect(message.actor, "effect-exploit-vulnerability")) {
        characterWithReaction()
        .filter(a=>actorAction(a.actor, "implements-interruption"))
        .filter(cc=>canReachEnemy(message.token, cc.token, cc.actor))
        .forEach(cc => {
            postInChatTemplate(implements_interruption, cc);
        });
    }
}

async function decreaseReaction(combatant, actionName=undefined) {
    updateCombatantReactionState(combatant, false, actionName);
    if (Settings.addReactionEffect && countAllReaction(combatant) <= 1
        && !hasEffectBySource(combatant?.actor, "Compendium.pf2e-reaction.reaction-effects.Item.Dvi4ewimR9t5723U")
    ) {
        setEffectToActor(combatant.actor, reactionWasUsedEffect);
    }
}

async function setEffectToActor(actor, eff) {
    const source = (await fromUuid(eff)).toObject();
    source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: eff } });

    await actor.createEmbeddedDocuments("Item", [source]);
}

function addRecallButton(html, sheet, skill, dc, isLore=false) {
    var loc_skill= isLore? skill.replaceAll("-", " ").replaceAll(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) :game.i18n.localize("PF2E.Skill"+skill.replace(/^\w/, (c) => c.toUpperCase()))
    var rec=game.i18n.localize("PF2E.RecallKnowledge.Label")
    var but = document.createElement('div');
    but.className = 'recall-knowledge tag-legacy tooltipstered gm-recall-knowledge-'+skill

    var a = document.createElement('a');
    a.textContent = rec+': '+loc_skill
    a.onclick = function () {
        let content = 'To Recall Knowledge, roll:';
        content += '<br>@Check[type:'+skill+'|dc:'+dc+'|traits:secret,action:recall-knowledge]';
        ChatMessage.create({
            content: TextEditor.enrichHTML(content, { async: false }),
            flavor: '',
            user: null,
            speaker: {
                scene: null,
                actor: null,
                token: null,
                alias: "System"
            },
            type: CONST.CHAT_MESSAGE_TYPES.OOC
        }).then();
    };
    but.append(a);

    html.find(".recall-knowledge > .section-body").append(but);
}

function easyLore(html, sheet, dc) {
    if (!Settings.recallKnowledgeEasyLore) {
        return
    }

    sheet.object.traits.forEach(a=>{
        if (filteredTraits.includes(a)) {
            return
        }
        addRecallButton(html, sheet, `${a}-lore`, dc, true)
    })
}

function veryEasyLore(html, sheet, dc) {
    if (!Settings.recallKnowledgeVeryEasyLore) {
        return
    }
    addRecallButton(html, sheet, `${sheet.actor.name.toLowerCase().replaceAll(" ", "-")}-lore`, dc, true)
}

export default function reactionHooks() {
    $(document).on('click', '.reaction-check', async function () {
        var mid = $(this).parent().parent().parent().data('message-id');
        if (mid) {
            var mes = game.messages.get(mid);
            var t = mes.flags['reaction-check'].cId;
            var reactions = mes.flags['reaction-check'].reactions;
            var count = mes.flags['reaction-check'].count;
            var uuid = mes.flags['reaction-check'].uuid;
            var needTarget = mes.flags['reaction-check']?.needTarget ?? false;
            if (t) {
                var combatant = game.combat.turns.find(a=>a._id === t);
                if (combatant) {
                    decreaseReaction(combatant, mes?.flags['reaction-check']?.actionName);
                    if (reactions > 1 && count > 1) {
                        var text = game.i18n.format("pf2e-reaction.ask", {uuid:uuid, name:combatant.token.name});
                        if (count-1 > 1) {
                            text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: count -1});
                        }
                        var content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});

                        var data = {
                            'content': content,
                            "flags.reaction-check.count": count - 1,
                            "flags.reaction-check.reactions": reactions - 1
                        };

                        if (mes.permission == 3) {
                            mes.update(data)
                        } else {
                            socketlibSocket._sendRequest("updateItem", [mes.uuid, data], 0)
                        }
                    } else {
                        if (mes.permission == 3) {
                            mes.delete()
                        } else {
                            socketlibSocket._sendRequest("deleteItem", [mes.uuid], 0)
                        }
                    }
                    if (Settings.postMessage && uuid) {
                        let ii = uuid.replace("@UUID[", "").replace("]", "")

                        combatant.actor.itemTypes.action.concat(combatant.actor.itemTypes.feat)
                        .find(a=>a.sourceId == ii)
                        ?.toMessage()
                    }
                }
            }
        }
    });

    $(document).on('click', '.reaction-cancel', function () {
        var mid = $(this).parent().parent().parent().data('message-id');
        if (mid) {
            var mes = game.messages.get(mid);
            if (mes.permission == 3) {
                mes.delete()
            } else {
                socketlibSocket._sendRequest("deleteItem", [game.messages.get(mid)?.uuid], 0)
            }
        }
    });

    Hooks.on('combatTurn', async (combat, updateData, updateOptions) => {
        updateCombatantReactionState(combat.nextCombatant, true);
        updateInexhaustibleCountermoves(combat.nextCombatant);
        if (isActorCharacter(combat.nextCombatant?.actor)) {
            npcWithReaction()
                .forEach(cc => {
                    var pg = actorAction(cc.actor, "petrifying-glance")
                    if (pg && getEnemyDistance(combat.nextCombatant.token, cc.token) <= 30) {
                        postInChatTemplate(_uuid(pg), cc);
                    }
                })
        }
        if (combat.round == 1) {
            checkRingmasterIntroduction(combat.nextCombatant)
        }
        if (actorFeat(combat.nextCombatant?.actor, "scapegoat-parallel-self")) {
            postInChatTemplate(scapegoat_parallel_self, combat.nextCombatant);
        }
    });

    Hooks.on('combatRound', async (combat, updateData, updateOptions) => {
        let _combatant = combat.turns[0];
        updateCombatantReactionState(_combatant, true);
        updateInexhaustibleCountermoves(_combatant);
        if (isActorCharacter(_combatant?.actor)) {
            npcWithReaction()
                .forEach(cc => {
                    var pg = actorAction(cc.actor, "petrifying-glance")
                    if (pg && getEnemyDistance(_combatant.token, cc.token <= 30)) {
                        postInChatTemplate(_uuid(pg), cc);
                    }
                })
        }
        if (actorFeat(_combatant?.actor, "scapegoat-parallel-self")) {
            postInChatTemplate(scapegoat_parallel_self, _combatant);
        }
    });

    Hooks.on('combatStart', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, true)
        });
        updateInexhaustibleCountermoves(combat.turns[0]);
        checkRingmasterIntroduction(combat.turns[0]);
    });

    Hooks.on('createCombatant', async combatant => {
        if (game.user?.isGM) {
            updateCombatantReactionState(combatant, true)
        }
    });

    Hooks.on('renderChatMessage', (app, html, msg) => {
        if (msg.user.isGM || Settings.showToPlayers) {
            return
        }
        if (app?.flags?.["reaction-check"]) {
    		html.addClass('hide-reaction-check');
		    html.hide();
        }
    });

    Hooks.on("renderActorSheet", (sheet, html, data)=>{
        if (game.user?.isGM && isNPC(sheet.actor) && sheet.token && Settings.recallKnowledge) {
            var recalls = html.find(".recall-knowledge .section-body .identification-skills")
            if (recalls.length == 0) {
                return;
            }
            if (Settings.recallKnowledgeHideDef){recalls.addClass('hidden')}

            var skills = Array.from(new Set(sheet.object.system.traits.value.flatMap((t) => identifySkills.get(t) ?? [])));

            if (recalls.length == 1) {
                var dcs = recalls.eq(0).text().trim().match(/\d+/g);
                if (dcs.length == 2) {
                    var [easyLoreDc, veryEasyLoreDc] = dcs;
                    easyLore(html, sheet, easyLoreDc)
                    veryEasyLore(html, sheet, veryEasyLoreDc);
                } else {
                    var dc = dcs[0];
                     skills.forEach(skill => {
                        addRecallButton(html, sheet, skill, dc)
                    })
                }
            } else if (recalls.length == 2) {
                var dc = recalls.eq(0).text().trim().match(/\d+/g)[0];
                var [easyLoreDc, veryEasyLoreDc] = recalls.eq(1).text().trim().match(/\d+/g);

                skills.forEach(skill => {
                    addRecallButton(html, sheet, skill, dc)
                })
                easyLore(html, sheet, easyLoreDc)
                veryEasyLore(html, sheet, veryEasyLoreDc);
            } else {
                console.warn(game.i18n.localize("pf2e-reaction.recall-knowledge.need-fix"));
            }
        }
    });

    Hooks.on('createItem', (effect, data, id) => {
        if ("effect-raise-a-shield" == effect.slug && isActorCharacter(effect.actor)) {
            var currCom = game.combat.turns.find(a=>a.actorId == effect.actor.id);
            var withShield = game.combat.turns.filter(a => isActorCharacter(a.actor))
                .filter(a=>hasEffect(a.actor, "effect-raise-a-shield"));
            if (hasReaction(currCom) && actorFeat(currCom.actor, "shield-wall")) {
                var adjacent = withShield
                .filter(a=>adjacentEnemy(a.token, currCom.token));
                if (adjacent.length > 1) {
                    postInChatTemplate(shield_wall, currCom);
                }
            }
            withShield.filter(a=>hasReaction(a) && actorFeat(a.actor, "shield-wall"))
            .filter(a=>a.id != currCom.id)
            .filter(a=>adjacentEnemy(a.token, currCom.token))
            .forEach(cc => {
                postInChatTemplate(shield_wall, cc);
            });
        }
    });

    Hooks.on('preUpdateToken', (tokenDoc, data, deep, id) => {
        if (game?.combats?.active && (data.x > 0 || data.y > 0)) {
            checkCombatantTriggerAttackOfOpportunity(tokenDoc.actor, tokenDoc.actorId, tokenDoc);
            if (!isActorCharacter(tokenDoc.actor)) {
                characterWithReaction()
                    .filter(a=>a.tokenId != tokenDoc._id)
                    .filter(a=>actorFeat(a.actor, "no-escape"))
                    .forEach(cc => {
                        if (canReachEnemy(tokenDoc, cc.token, cc.actor)) {
                            postInChatTemplate(no_escape, cc);
                        }
                    });
                characterWithReaction()
                    .filter(a=>a.tokenId != tokenDoc._id)
                    .filter(a=>actorFeat(a.actor, "stand-still"))
                    .forEach(cc => {
                        if (canReachEnemy(tokenDoc, cc.token, cc.actor)) {
                            postInChatTemplate(stand_still, cc);
                        }
                    });

                characterWithReaction()
                    .filter(a=>actorFeat(a.actor, "everdistant-defense"))
                    .filter(a=>a.actor.auras.size > 0)
                    .forEach(cc => {
                        let radius = Math.max(...Array.from(cc.actor.auras.values()).map(a=>a.radius));
                        if (getEnemyDistance(tokenDoc, cc.token) <= radius) {
                            postInChatTemplate(everdistant_defense, cc);
                        }
                    })
            }

            checkCourageousOpportunity({"actor" : tokenDoc.actor, "token": tokenDoc})
            checkImplementsInterruption({"actor" : tokenDoc.actor, "token": tokenDoc})

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
        if (!game?.combats?.active) {return}
        if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
            if (message.actor.system?.attributes?.hp?.value == 0) {
                if (hasReaction(message?.token?.combatant)) {
                    if (actorAction(message?.actor, "ferocity")) {
                        postInChatTemplate(ferocity, message?.token?.combatant, undefined, true);
                    }
                    if (actorFeat(message?.actor, "orc-ferocity")) {
                        postInChatTemplate(orc_ferocity, message?.token?.combatant, undefined, true);
                    }
                    if (actorAction(message?.actor, "entitys-resurgence")) {
                        postInChatTemplate(entitys_resurgence, message?.token?.combatant, undefined, true);
                    }
                    if (actorAction(message?.actor, "final-spite")) {
                        postInChatTemplate(final_spite, message?.token?.combatant, undefined, true);
                    }
                    if (actorFeat(message?.actor, "cheat-death")) {
                        postInChatTemplate(cheat_death, message?.token?.combatant, undefined, true);
                    }
                    if (actorFeat(message?.actor, "ruby-resurrection")) {
                        postInChatTemplate(ruby_resurrection, message?.token?.combatant, undefined, true);
                    }
                }
                // ally
                if (isActorCharacter(message?.actor)) {
                    characterWithReaction()
                    .filter(a=>a.actorId != message?.actor?._id)
                    .filter(a=>actorFeat(a.actor, "rapid-response"))
                    .forEach(cc => {
                        postInChatTemplate(rapid_response, cc);
                    });
                }
            } else {
                if (hasReaction(message?.token?.combatant)) {
                    if (actorFeat(message?.actor, "wounded-rage") && !hasCondition(message?.actor,"encumbered") && !hasEffect(message.actor, "effect-rage")) {
                        postInChatTemplate(wounded_rage, message?.token?.combatant);
                    }
                    if (actorFeat(message?.actor, "negate-damage")) {
                        postInChatTemplate(negate_damage, message?.token?.combatant);
                    }
                }
            }
        }

        if (!isActorCharacter(message?.actor) && messageWithTrait(message, "concentrate")) {
            characterWithReaction()
                .filter(a=>actorFeat(a.actor, "distracting-explosion"))
                .forEach(cc => {
                    if (canReachEnemy(message.token, cc.token, cc.actor)) {
                        postInChatTemplate(distracting_explosion, cc);
                    }
                });
        }

        if (messageWithTrait(message, "auditory")) {
            checkCourageousOpportunity(message);
        }
        if (messageWithAnyTrait(message, ["concentrate", "manipulate"])) {
            checkImplementsInterruption(message);
        }

        if (
            (messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
            || (message?.item?.type == 'action' && messageWithAnyTrait(message, ["manipulate","move"]))
        ) {
            checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
            checkCourageousOpportunity(message);

            if (message?.item?.type == 'action' && messageWithAnyTrait(message, ["manipulate","move"])) {
                checkImplementsInterruption(message);
            }
            if (message?.item?.type == 'action' && messageWithTrait(message, "move")) {
                characterWithReaction()
                    .filter(a=>a.actorId != message?.actor?._id)
                    .filter(a=>actorFeat(a.actor, "stand-still"))
                    .forEach(cc => {
                        if (canReachEnemy(message?.token, cc.token, cc.actor)) {
                            postInChatTemplate(stand_still, cc);
                        }
                    });
            }
        } else if (message?.flags?.pf2e?.origin?.type == 'spell' && !messageType(message, "saving-throw")) {
            var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            if (spellWithTrait(origin, "manipulate")) {
                checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
                checkImplementsInterruption(message);
            }
        } else if (message?.flags?.pf2e?.origin?.type == 'action') {
            var actId = message.flags?.pf2e?.origin?.uuid.split('.').slice(-1)[0]
            if (game?.packs?.get("pf2e.actionspf2e")._source.find(a=>a._id==actId)?.system?.traits?.value.includes("manipulate")) {
                checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
                checkImplementsInterruption(message);
            }
        }

        if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
            (isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction())
                .forEach(cc => {
                    if (canReachEnemy(message.token, cc.token, cc.actor)) {
                        if (actorFeat(cc.actor, "mage-hunter")) {
                            postInChatTemplate(mage_hunter, cc);
                        }
                    }

                    if (getEnemyDistance(message.token, cc.token) <= 30) {
                        if (actorFeat(cc.actor, "counter-thought") && spellWithTrait(message?.item, "mental")) {
                            postInChatTemplate(counter_thought, cc);
                        }
                    }
                })
            if (message?.item && isActorCharacter(message?.actor)) {
                if (!message?.item?.isCantrip) {
                    characterWithReaction()
                        .filter(a=>a.actorId != message?.actor?._id)
                        .filter(a=>getEnemyDistance(message.token, a.token) <= 30)
                        .forEach(cc => {
                            if (actorFeat(cc.actor, "accompany")) {
                                postInChatTemplate(accompany, cc);
                            }
                        })
                }

                if (hasReaction(message?.token?.combatant)) {
                    if ( actorFeat(message?.actor, "verdant-presence") && message?.item?.system?.traditions.value.includes("primal")) {
                        postInChatTemplate(verdant_presence, message?.token?.combatant);
                    }

                    if (actorFeat(message?.actor, "align-ki") && messageWithTrait(message, "monk")) {
                        postInChatTemplate(align_ki, message?.token?.combatant);
                    }
                }

                let spellRange = message?.item?.system?.range?.value?.match(/\d+/g);
                spellRange = spellRange ? spellRange[0] : 0;

                characterWithReaction()
                    .filter(a=>a.actorId != message?.actor?._id)
                    .filter(a=>getEnemyDistance(message.token, a.token) <= spellRange)
                    .filter(a=>actorFeat(a.actor, "spell-relay"))
                    .forEach(cc => {
                        postInChatTemplate(spell_relay, cc);
                    })

            }

        } else if (messageType(message, "spell-attack-roll")) {
            if (hasReaction(message?.target?.token?.combatant)) {
                if (criticalFailureMessageOutcome(message)) {
                    if (actorFeat(message?.target?.actor, "mirror-shield")) {
                        postInChatTemplate(mirror_shield, message?.target?.token?.combatant);
                    }
                }
                if (actorAction(message?.target?.actor, "ring-bell")
                        && getEnemyDistance(message.token, message.target.token)<=30
                        && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                        postInChatTemplate(ring_bell, message.target.token.combatant);
                }
                if (actorFeat(message?.target?.actor, "you-failed-to-account-for-this")) {
                    postInChatTemplate(you_failed_to_account_for_this, message.target.token.combatant);
                }
                if (actorFeat(message?.target?.actor, "foresee-danger")) {
                    postInChatTemplate(foresee_danger, message.target.token.combatant);
                }
                if (actorFeat(message?.target?.actor, "suspect-of-opportunity")) {
                    postInChatTemplate(suspect_of_opportunity, message.target.token.combatant);
                }
            }
            if (isTargetCharacter(message)) {
                characterWithReaction()
                .filter(a=>a.actorId != message?.target?.actor._id)
                .forEach(cc => {
                    if (actorAction(cc?.actor, "ring-bell")
                        && getEnemyDistance(cc?.token, message.token)<=30
                        && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                        postInChatTemplate(ring_bell, cc);
                    }
                })
            }
        } else if (messageType(message, 'attack-roll')) {
            if (hasReaction(message?.target?.token?.combatant)) {
                if (isTargetCharacter(message)) {
                    if (actorFeat(message?.target?.actor, "you-failed-to-account-for-this")) {
                        postInChatTemplate(you_failed_to_account_for_this, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "suspect-of-opportunity")) {
                        postInChatTemplate(suspect_of_opportunity, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "foresee-danger")) {
                        postInChatTemplate(foresee_danger, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "nimble-dodge") && !hasCondition(message?.target?.actor,"encumbered")) {
                        postInChatTemplate(nimble_dodge_feat, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "airy-step")) {
                        postInChatTemplate(airy_step_feat, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "farabellus-flip")) {
                        postInChatTemplate(farabellus_flip, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "reactive-shield") && !hasEffect(message?.target?.actor, "effect-raise-a-shield") && message?.item?.isMelee) {
                        postInChatTemplate(reactive_shield, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "pirouette") && hasEffect(message?.target?.actor, "stance-masquerade-of-seasons-stance")) {
                        postInChatTemplate(pirouette, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "fiery-retort") && adjacentEnemy(message.token, message.target.token)
                        && (message?.item?.isMelee|| message?.item?.traits?.has("unarmed"))) {
                        postInChatTemplate(fiery_retort, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "knights-retaliation")
                        && message?.actor?.system.traits.value.includes("undead")
                        && criticalFailureMessageOutcome(message)
                    ) {
                        postInChatTemplate(knights_retaliation, message.target.token.combatant);
                    }
                    if (actorAction(message?.target?.actor, "ring-bell")
                        && getEnemyDistance(message.token, message.target.token)<=30
                        && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                        postInChatTemplate(ring_bell, message.target.token.combatant);
                    }
                    if (message?.target?.actor?.flags?.pf2e?.rollOptions?.ac?.['hit-the-dirt'] && hasOption(message, "ranged")) {
                        postInChatTemplate(hit_the_dirt, message.target.token.combatant);
                    }
                    if (message?.item?.isMelee && message?.target?.actor?.flags?.pf2e?.rollOptions?.all?.['crane-flutter']) {
                        decreaseReaction(message.target.token.combatant);
                        reactionWasUsedChat(crane_flutter, message.target.token.combatant);
                    }
                    if (message?.item?.isRanged && message?.target?.actor?.flags?.pf2e?.rollOptions?.ac?.['deflect-arrow']) {
                        decreaseReaction(message.target.token.combatant);
                        reactionWasUsedChat(deflect_arrow, message.target.token.combatant);
                    }
                } else {
                    if (actorAction(message?.target?.actor, "nimble-dodge") && !hasCondition(message?.target?.actor,"encumbered")) {
                        postInChatTemplate(nimble_dodge_action, message.target.token.combatant);
                    }
                    if (actorAction(message?.target?.actor, "airy-step")) {
                        postInChatTemplate(airy_step_action, message.target.token.combatant);
                    }
                }
            }
            if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant, "opportune-riposte")) {
                if (isNPC(message.actor)) {
                    if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && actorFeat(message?.target?.actor, "opportune-riposte")) {
                        postInChatTemplate(opportune_riposte, message.target.token.combatant, "opportune-riposte");
                    }
                } else {
                    if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && actorAction(message?.target?.actor, "opportune-riposte")) {
                        postInChatTemplate(opportune_riposte_action, message.target.token.combatant, "opportune-riposte");
                    }
                }
            }
            if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant)) {
                if (actorFeat(message?.target?.actor, "dueling-riposte") && hasEffect(message.target.actor, "effect-dueling-parry")) {
                    postInChatTemplate(dueling_riposte, message.target.token.combatant);
                }
                if (actorFeat(message?.target?.actor, "twin-riposte") && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                    && (hasEffect(message.target.actor, "effect-twin-parry")||hasEffect(message.target.actor, "effect-twin-parry-parry-trait"))) {
                    postInChatTemplate(twin_riposte, message.target.token.combatant);
                }
            }
            if (anyFailureMessageOutcome(message)) {
                if (hasReaction(message?.token?.combatant)) {
                    if (actorFeat(message?.actor, "perfect-clarity")) {
                        postInChatTemplate(perfect_clarity, message?.token?.combatant);
                    }
                }
            }

            if (!isTargetCharacter(message)) {
                npcWithReaction()
                .filter(a=>a.actorId != message?.target?.actor._id)
                .forEach(cc => {
                    if (adjacentEnemy(message.token, cc.token)) {
                        var ab = actorAction(cc.actor, "avenging-bite");
                        if (ab) {
                            postInChatTemplate(_uuid(ab), cc?.token?.combatant);
                        }
                    }
                })
            } else {
                characterWithReaction()
                .filter(a=>a.actorId != message?.target?.actor._id)
                .forEach(cc => {
                    if (actorAction(cc?.actor, "ring-bell")
                        && getEnemyDistance(cc?.token, message.token)<=30
                        && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                        postInChatTemplate(ring_bell, cc);
                    }
                })
            }

            //Hit by
            if (anySuccessMessageOutcome(message)) {
                if (hasReaction(message?.token?.combatant)) {
                    if (message?.item?.system?.attackEffects?.value.includes("improved-grab")) {
                        var fs = actorAction(message?.actor, "fast-swallow");
                        if (fs) {
                            postInChatTemplate(_uuid(fs), message?.token?.combatant);
                        }
                    }
                }
                if (hasReaction(message?.target?.token?.combatant)) {
                    if (actorAction(message?.target?.actor, "wicked-thorns")) {
                        if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                            postInChatTemplate(wicked_thorns, message.target.token.combatant);
                        }
                    }
                    if (actorFeat(message?.target?.actor, "emergency-targe") && message?.item?.isMelee) {
                        postInChatTemplate(emergency_targe, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "impossible-technique")
                        && !hasCondition(message?.target?.actor, "fatigued")
                        && message?.target?.actor?.armorClass?.parent?.item?.type != "armor"
                    ) {
                        postInChatTemplate(impossible_technique, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "rippling-spin") && message?.item?.isMelee
                        && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                        && hasEffect(message?.target?.actor, "stance-reflective-ripple-stance")
                    ) {
                        postInChatTemplate(rippling_spin, message.target.token.combatant);
                    }
                }

                if (isTargetCharacter(message)) {
                    const rr = message.rolls.at(0);
                    let newR = calculateDegreeOfSuccess(message?.flags?.pf2e?.context?.dc?.value, rr._total - 2, rr.dice.at(0).total)

                    if (rr.degreeOfSuccess != newR) {
                        characterWithReaction()
                            .filter(a=>a.actorId != message?.target?.actor._id)
                            .filter(cc=>canReachEnemy(message?.target?.token, cc.token, cc.actor))
                            .forEach(cc => {
                                if (actorFeat(cc.actor, "guardians-deflection-fighter")) {
                                    postInChatTemplate(guardians_deflection_fighter, cc);
                                }
                                if (actorFeat(cc.actor, "guardians-deflection-swashbuckler")) {
                                    postInChatTemplate(guardians_deflection_swashbuckler, cc);
                                }
                            })
                    }
                }
            }

            //Hit by crit
            if (criticalSuccessMessageOutcome(message)) {
                if (hasReaction(message?.target?.token?.combatant)) {
                    var vs = actorAction(message?.target?.actor, "vengeful-spite");
                    if (vs) {
                        postInChatTemplate(_uuid(vs), message.target?.token?.combatant);
                    }
                    if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && actorFeat(message?.target?.actor, "furious-vengeance")) {
                        postInChatTemplate(furious_vengeance, message.target.token.combatant);
                    }
                    var cringe = actorFeat(message?.target?.actor, "cringe")
                    if (cringe) {
                        postInChatTemplate(_uuid(cringe), message.target.token.combatant);
                    }
                    if (adjacentEnemy(message.token, message?.target?.token, message?.target?.actor)) {
                        if (message?.item?.isMelee || message?.item?.traits?.has("unarmed")) {
                            if (message?.target?.actor?.system?.resources?.focus?.value > 0) {
                                if (actorFeat(message?.target?.actor, "storm-retribution")) {
                                    postInChatTemplate(storm_retribution, message.target.token.combatant);
                                }
                            }
                        }
                    }
                }
                if (hasReaction(message?.token?.combatant)) {
                    if (actorFeat(message?.actor, "tangle-of-battle") && adjacentEnemy(message.target.token, message?.token)) {
                        postInChatTemplate(tangle_of_battle, message.token.combatant);
                    }
                    if (actorFeat(message?.actor, "clever-gambit") && hasEffect(message?.target?.actor, "effect-recall-knowledge-identified")) {
                        postInChatTemplate(clever_gambit, message.token.combatant);
                    }
                }
            }
        } else if (messageType(message, 'perception-check')) {
            if (failureMessageOutcome(message)) {
                if (hasReaction(message?.token?.combatant)) {
                    if (actorFeat(message?.actor, "spiritual-guides")) {
                        postInChatTemplate(spiritual_guides, message.token.combatant);
                    }
                }
            }
            if (message?.flags?.pf2e?.origin?.uuid) {
                var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
                if (hasReaction(origin?.actor?.combatant)) {
                    if (successMessageOutcome(message)) {
                        if (actorFeat(origin?.actor, "convincing-illusion") && origin?.traits?.has("illusion")) {
                            postInChatTemplate(convincing_illusion, origin?.actor?.combatant);
                        }
                    }
                }
            }
        } else if (messageType(message, 'skill-check')) {
            if (isTargetCharacter(message) && anySuccessMessageOutcome(message)) {
                characterWithReaction()
                .filter(a=>a.actorId != message?.target?.actor._id)
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb=>bb=="action:grapple")) {
                        if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15){
                            if (actorAction(cc.actor, "liberating-step")) {
                                postTargetInChatTemplate(liberating_step, cc);
                            }
                        }
                    }
                })
            }

            if (hasReaction(message?.token?.combatant)) {
                if (failureMessageOutcome(message)) {
                    if (actorFeat(message?.actor, "spiritual-guides")) {
                        postInChatTemplate(spiritual_guides, message.token.combatant);
                    }
                }
                if (criticalFailureMessageOutcome(message)) {
                    if (actorFeat(message?.actor, "squawk")
                        && ["deception","diplomacy","intimidation"].some(a=>message.flags?.pf2e?.context?.domains?.includes(a))
                        && !message?.target?.actor?.system?.traits?.value?.includes("tengu")
                    ) {
                        postInChatTemplate(squawk, message.token.combatant);
                    }
                }
            }

        } else if (messageType(message, 'damage-roll')) {
            if (hasReaction(message.actor.combatant)) {
                if (actorFeat(message.actor, "cleave") && message?.item?.isMelee) {
                    if (message.target.actor.system.attributes.hp.value <= parseInt(message.content)) {

                        var adjEnemies = game.combat.turns.filter(a => !isActorCharacter(a.actor))
                        .filter(a=>a.actorId != message?.target?.actor._id)
                        .filter(a=>adjacentEnemy(message.target.token, a.token))
                        .filter(a=>a.actor.system.attributes.hp.value>0);

                        if (adjEnemies.length > 0) {
                            postInChatTemplate(cleave, message.actor.combatant);
                        }
                    }
                }
            }

            if(hasReaction(message?.target?.token?.combatant, "shield-block")) {
                var dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);
                if (dTypes.filter(a=> a== "bludgeoning" || a == "piercing" || a== "slashing").length > 0) {
                    if (actorFeat(message?.target?.actor, "shield-block") && hasEffect(message.target.actor, "effect-raise-a-shield")) {
                        postInChatTemplate(shield_block, message.target.token.combatant, "shield-block");
                    }
                }
            }
            if(hasReaction(message?.target?.token?.combatant)) {
                if (actorFeat(message?.target?.actor, "electric-counter") && hasEffect(message?.target?.actor, "stance-wild-winds-stance")) {
                    postInChatTemplate(electric_counter, message?.target?.token?.combatant);
                }
                if (actorFeat(message?.target?.actor, "all-in-my-head") && !message?.item?.traits.has("death")) {
                    postInChatTemplate(all_in_my_head, message.target.token.combatant);
                }
                if (actorFeat(message?.target?.actor,  "unexpected-shift")) {
                    postInChatTemplate(unexpected_shift, message.target.token.combatant);
                }

                var dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);


                if (dTypes.filter(a=> a== "sonic").length > 0) {
                    if (actorFeat(message?.target?.actor, "resounding-finale")) {
                        postInChatTemplate(resounding_finale, message.target.token.combatant);
                    }
                    if (actorFeat(message?.target?.actor, "reverberate") && message.item.type == "spell") {
                        postInChatTemplate(reverberate, message.target.token.combatant);
                    }
                }

                if (actorFeat(message?.target?.actor, "verdant-presence")) {
                    postInChatTemplate(verdant_presence, message.target.token.combatant);
                }
                if (actorAction(message?.target?.actor, "amulets-abeyance") && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(amulets_abeyance, message?.target?.token?.combatant);
                }

                if (dTypes.filter(a=> a== "bludgeoning" || a == "piercing" || a== "slashing").length > 0) {
                    if (actorFeat(message?.target?.actor, "sacrifice-armor")) {
                        postInChatTemplate(sacrifice_armor, message.target.token.combatant);
                    }
                }

                if (dTypes.filter(a=> ["acid", "cold", "electricity", "fire", 'poison'].includes(a)).length > 0) {
                    if (actorFeat(message?.target?.actor, "reactive-transformation")) {
                        postInChatTemplate(reactive_transformation, message.target.token.combatant);
                    }
                }

                if (message?.item?.isMelee && actorFeat(message?.target?.actor, "embrace-the-pain")) {
                    postInChatTemplate(embrace_the_pain, message.target.token.combatant);
                }
                if (adjacentEnemy(message.target.token, message.token)) {
                    var rg = actorAction(message?.target?.actor, "reactive-gnaw");
                    if (rg && message?.item?.system?.damage?.damageType == "slashing") {
                        postInChatTemplate(_uuid(rg), message.target.token.combatant);
                    }
                    var rc = actorFeat(message?.target?.actor, "retaliatory-cleansing");
                    if (rc) {
                        if (actorHeldWeapon(message?.target?.actor).filter(a=>a.slug=="holy-water" || (a.weaponTraits.filter(b=>b.name == "bomb").length > 0 && a.weaponTraits.filter(b=>b.name == "positive").length > 0)).length > 0) {
                            postInChatTemplate(retaliatory_cleansing, message.target.token.combatant);
                        }
                    }
                //15 ft damage you
                } else if (getEnemyDistance(message?.target.token, message.token) <= 15) {
                    if (actorAction(message?.target?.actor, "iron-command")) {
                        postInChatTemplate(iron_command, message.target.token.combatant);
                    }
                    if (actorAction(message?.target?.actor, "selfish-shield")) {
                        postInChatTemplate(selfish_shield, message.target.token.combatant);
                    }
                    if (actorAction(message?.target?.actor, "destructive-vengeance")) {
                        postInChatTemplate(destructive_vengeance, message.target.token.combatant);
                    }
                }
            }
            //ally damaged
            (isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
            .filter(a=>a.actorId != message?.target?.actor._id)
            .forEach(cc => {
                if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                    if (actorAction(cc.actor, "glimpse-of-redemption")) {
                        postTargetInChatTemplate(glimpse_of_redemption, cc);
                    }
                    if (actorAction(cc.actor, "liberating-step")) {
                        postTargetInChatTemplate(liberating_step, cc);
                    }
                    if (actorAction(cc.actor, "retributive-strike")) {
                        postTargetInChatTemplate(cc.actor.type == "npc" ? retributive_strike_npc: retributive_strike, cc);
                    }
                }
                if (getEnemyDistance(message.target.token, cc.token) <= 15 && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    if (actorAction(cc.actor, "amulets-abeyance")) {
                        postTargetInChatTemplate(amulets_abeyance, cc);
                    }
                }
                if (getEnemyDistance(message.target.token, cc.token) <= 30) {
                    if (actorFeat(cc.actor, "denier-of-destruction")) {
                        postTargetInChatTemplate(denier_of_destruction, cc);
                    }
                }
            })
        } else if (messageType(message, "saving-throw")) {
            var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            if (hasReaction(message?.token?.combatant)) {
                if (actorFeat(message.actor, "charmed-life")) {
                    if (message?.flags?.pf2e?.modifiers?.find(a=>a.slug=="charmed-life" && a.enabled)) {
                        decreaseReaction(message.token.combatant)
                        reactionWasUsedChat(charmed_life, message.token.combatant);
                    }
                }
                if (anyFailureMessageOutcome(message)) {
                    if (actorFeat(message.actor, "premonition-of-clarity") && origin?.traits?.has("mental")) {
                        postInChatTemplate(premonition_of_clarity, message.token.combatant);
                    }
                    if (actorFeat(message.actor, "grit-and-tenacity")) {
                        postInChatTemplate(grit_and_tenacity, message.token.combatant);
                    }
                    if (actorFeat(message?.actor, "emergency-targe") && message?.flags?.pf2e?.origin?.type  == 'spell') {
                        postInChatTemplate(emergency_targe, message.token.combatant);
                    }
                }
                if (criticalFailureMessageOutcome(message)) {
                    if (actorSpell(message.actor, "schadenfreude")) {
                        postInChatTemplate(schadenfreude, message.token.combatant)
                    }
                }

                if (actorAction(message?.actor, "ring-bell")
                        && getEnemyDistance(message.token, origin?.actor?.token)<=30
                        && hasEffect(origin?.actor, "effect-exploit-vulnerability")) {
                        postInChatTemplate(ring_bell, message?.actor?.combatant);
                }

            }
            if (isActorCharacter(message?.actor)) {
                characterWithReaction()
                .filter(a=>a.actorId != message?.actor._id)
                .forEach(cc => {
                    if (actorAction(cc?.actor, "ring-bell")
                        && getEnemyDistance(cc?.token, origin?.actor?.token)<=30
                        && hasEffect(origin?.actor, "effect-exploit-vulnerability")) {
                        postTargetInChatTemplate(ring_bell, cc);
                    }
                })
            }
            if (hasReaction(origin?.actor?.combatant)) {
                if (successMessageOutcome(message)) {
                    if (actorFeat(origin?.actor, "convincing-illusion") && origin?.traits?.has("illusion")) {
                        postInChatTemplate(convincing_illusion, origin?.actor?.combatant);
                    }
                }
            }
        }

        handleHomebrewMessages(message)
    });

    function handleHomebrewTrigger(tr, message) {
        if (tr.name == 'EnemyUseRangedAttack' && messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll")) {
            return true;
        }
        if (tr.name == 'EnemyUseManipulateAction' && message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("manipulate")) {
            return true;
        }
        if (tr.name == 'EnemyUseMoveAction' && message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("move")) {
            return true;
        }
        if (tr.name == 'FailSavingThrow' && messageType(message, 'saving-throw') && anyFailureMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'CriticalFailSavingThrow' && messageType(message, 'saving-throw') && criticalFailureMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'CriticalHitCreature' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'AllyTakeDamage' && messageType(message, 'damage-roll')) {
            return true;
        }
        if (tr.name == 'ActorTakeDamage' && messageType(message, 'damage-roll')) {
            return true;
        }
        if ((tr.name == 'YouHPZero' || tr.name == "AllyHPZero")
            && message?.flags?.pf2e?.appliedDamage
            && !message?.flags?.pf2e?.appliedDamage?.isHealing
            && message.actor.system?.attributes?.hp?.value == 0) {
            return true;
        }
        if (tr.name == 'EnemyUsesTrait'
            && message?.item?.system?.traits?.value?.includes(tr.trait)) {
            return true;
        }
        if (tr.name == 'EnemyCastSpell' && (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast'))) {
            return true;
        }
        if (tr.name == 'EnemyHitsActor' && messageType(message, 'attack-roll')) {
            return true;
        }
        if (tr.name == 'EnemyCriticalFailHitsActor' && messageType(message, 'attack-roll') && criticalFailureMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'EnemyCriticalHitsActor' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'EnemyFailHitsActor' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'ActorFailsHit' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
            return true;
        }
        if (tr.name == 'CreatureAttacksAlly' && messageType(message, 'attack-roll')) {
            return true;
        }
        if (tr.name == 'ActorFailsSkillCheck' && messageType(message, 'skill-check') && anyFailureMessageOutcome(message)) {
            return true;
        }
        return false;
    }

    function filterByDistance(t, tr, message) {
        var r = t;
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
            if (a.name == 'TargetHasEffect' && hasEffect(message?.target?.actor, a.effect)) {
                return true;
            }
            if (a.name == 'ActorHasEffect' && hasEffect(message?.actor, a.effect)) {
                return true;
            }
            if (a.name == 'ActorHoldsItem' && heldItems(message?.actor, a.item, a.trait).length > 0) {
                return true;
            }
            if (a.name == 'TargetHoldsItem' && heldItems(message?.target?.actor, a.item, a.trait).length > 0) {
                return true;
            }
            return false;
        })
    }

    function combatantsForTriggers(tt, message) {
        var res = [];

        tt.forEach(tr => {
            if (tr.name == 'EnemyUseRangedAttack' && messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll")) {
                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyUseManipulateAction' && message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("manipulate")) {
                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyUseMoveAction' && message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("move")) {
                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'FailSavingThrow' && messageType(message, 'saving-throw') && anyFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'CriticalFailSavingThrow' && messageType(message, 'saving-throw') && criticalFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'CriticalHitCreature' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'AllyTakeDamage' && messageType(message, 'damage-roll')) {
                var t = filterByDistance((isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
                .filter(a=>a.actorId != message?.target?.actor._id), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'ActorTakeDamage' && messageType(message, 'damage-roll')) {
                var t = filterByDistance([message?.target?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if ((tr.name == 'YouHPZero')
                && message?.flags?.pf2e?.appliedDamage
                && !message?.flags?.pf2e?.appliedDamage?.isHealing
                && message.actor.system?.attributes?.hp?.value == 0) {

                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if ((tr.name == "AllyHPZero")
                && message?.flags?.pf2e?.appliedDamage
                && !message?.flags?.pf2e?.appliedDamage?.isHealing
                && message.actor.system?.attributes?.hp?.value == 0) {

                var t = filterByDistance((isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
                    .filter(a=>a.actorId != message?.actor?._id), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyUsesTrait'
                && message?.item?.system?.traits?.value?.includes(tr.trait)) {

                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyCastSpell' && (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast'))) {
                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction()), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyHitsActor' && messageType(message, 'attack-roll')) {
                var t = filterByDistance([message?.target?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyCriticalFailHitsActor' && messageType(message, 'attack-roll') && criticalFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.target?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyCriticalHitsActor' && messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
                var t = filterByDistance([message?.target?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'EnemyFailHitsActor' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.target?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'ActorFailsHit' && messageType(message, 'attack-roll') && anyFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'CreatureAttacksAlly' && messageType(message, 'attack-roll')) {
                var t = filterByDistance((isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction())
                    .filter(a=>a.actorId != message?.target?.actor._id), tr, message);
                res = res.concat(t);
            }
            if (tr.name == 'ActorFailsSkillCheck' && messageType(message, 'skill-check') && anyFailureMessageOutcome(message)) {
                var t = filterByDistance([message?.token?.combatant], tr, message);
                res = res.concat(t);
            }
        });
        res = res.filter(a=>a!==null)
        res = [...new Map(res.map(item =>[item['actorId'], item])).values()];

        return res;
    }

    async function handleHomebrewMessages(message) {
        if (Settings.useHomebrew) {
            Settings.homebrewReactions
                .filter(a=>a.slug.length > 0 && a.uuid.length > 0 && a.triggers.length > 0)
                .filter(a=>a.triggers.filter(a=> a.name != "None").length > 0)
                .forEach(hr => {
                    var tt = hr.triggers.filter(a=> a.name != "None");
                    var requirements = hr.requirements.filter(a=> a.name != "None");
                    if (!messageRequirements(message, requirements)) {
                        return;
                    }
                    if (tt.some(a=>handleHomebrewTrigger(a, message))) {
                        combatantsForTriggers(tt, message)
                            .filter(a=>actorFeat(a.actor, hr.slug) || actorAction(a.actor, hr.slug) || actorSpell(a.actor, hr.slug))
                            .forEach(cc => {
                                postInChatTemplate(_uuid(hr), cc, undefined, tt.find(a=>a.name=="YouHPZero") != undefined);
                            })
                    }
                })
        }
    }

    function sendNotification(_user, token, feat) {
        var text = game.i18n.format("pf2e-reaction.notify", {uuid:feat.name, name:token.name});
        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
    }

    function checkSendNotification(_user, token, featNames) {
        actorFeats(token.actor, featNames).forEach(feat => {
            sendNotification(_user, token, feat);
        })
    }

    Hooks.on("targetToken", (_user, token, isTargeted, opts) => {
        if (Settings.notification && game?.combats?.active && isTargeted && hasReaction(token?.combatant)) {
            if (game.user.isGM || token.combatant.players.find(a=>a.id==game.user.id)) {
                if (isActorCharacter(token?.actor)) {
                    var nd = actorFeat(token.actor, "nimble-dodge");
                    if (nd && !hasCondition(token.actor, "encumbered")) {
                        sendNotification(_user, token, nd);
                    }
                    checkSendNotification(_user, token,
                    ["airy-step", "farabellus-flip", "hit-the-dirt",
                     "you-failed-to-account-for-this", "foresee-danger", "deflect-arrow"]);

                    var pir = actorFeat(token.actor, "pirouette");
                    if (pir && hasEffect(token.actor, "stance-masquerade-of-seasons-stance")) {
                        sendNotification(_user, token, pir);
                    }
                    var rs = actorFeat(token.actor, "reactive-shield");
                    if (rs && !hasEffect(token.actor, "effect-raise-a-shield")) {
                        sendNotification(_user, token, rs);
                    }
                    var rs = actorFeat(token.actor, "crane-flutter");
                    if (rs && hasEffect(token.actor, "stance-crane-stance")) {
                        sendNotification(_user, token, rs);
                    }

                    characterWithReaction()
                    .filter(a=>a.tokenId != token.id)
                    .filter(a=>actorFeat(a.actor, "everdistant-defense"))
                    .filter(a=>a.actor.auras.size > 0)
                    .forEach(cc => {
                        let radius = Math.max(...Array.from(cc.actor.auras.values()).map(a=>a.radius));
                        if (getEnemyDistance(token.document, cc.token) <= radius) {
                            var ed = actorFeat(cc.actor, "everdistant-defense");
                            var text = game.i18n.format("pf2e-reaction.notify", {uuid:ed.name, name:cc.name});
                            ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                        }
                    })
                } else {
                    var nd = actorAction(token.actor, "nimble-dodge");
                    if (nd && !hasCondition(token.actor, "encumbered")) {
                        sendNotification(_user, token, nd);
                    }
                    var as = actorAction(token.actor, "airy-step");
                    if (as) {
                        sendNotification(_user, token, as);
                    }
                }
            }
        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}