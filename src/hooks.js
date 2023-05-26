import Settings from "./settings.js";

const opportune_riposte = "@UUID[Compendium.pf2e.actionspf2e.EfjoIuDmtUn4yiow]"
const airy_step_action = "@UUID[Compendium.pf2e.actionspf2e.akmQzZoNhyfCKFpL]"
const airy_step_feat = "@UUID[Compendium.pf2e.feats-srd.hOD9de1ftfYRSEKn]"
const nimble_dodge_action = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.wCnsRCHvtZkZTmO0]"
const nimble_dodge_feat = "@UUID[Compendium.pf2e.feats-srd.dNH8OHEvx3vI9NBQ]"
const fast_swallow = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.IQtb58p4EaeUzTN1]"
const retributive_strike = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.IQtb58p4EaeUzTN1]"
const ferocity = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.N1kstYbHScxgUQtN]"
const attack_of_opportunity = "@UUID[Compendium.pf2e.actionspf2e.KAVf7AmRnbCAHrkT]"
const glimpse_of_redemption = "@UUID[Compendium.pf2e.actionspf2e.tuZnRWHixLArvaIf]"
const wicked_thorns = "@UUID[Compendium.pf2e.actionspf2e.ncdryKskPwHMgHFh]"
const iron_command = "@UUID[Compendium.pf2e.actionspf2e.M8RCbthRhB4bxO9t]"
const selfish_shield = "@UUID[Compendium.pf2e.actionspf2e.enQieRrITuEQZxx2]"
const destructive_vengeance = "@UUID[Compendium.pf2e.actionspf2e.r5Uth6yvCoE4tr9z]"
const liberating_step = "@UUID[Compendium.pf2e.actionspf2e.IX1VlVCL5sFTptEE]"

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

function updateInexhaustibleCountermoves(combatant) {
    if (combatant.actor.type == "npc") {
        setInexhaustibleCountermoves(game.combat.combatants.filter(a=>a.actor.type=="character"), 1)
    } else {
        setInexhaustibleCountermoves(game.combat.combatants.filter(a=>a.actor.type=="character"), 0)
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
        }
        combatant.update({
            "flags.reaction-check.state": false
        });
    } else {
        if (combatant.actor.type == "npc") {
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
        }

        combatant.update({
            "flags.reaction-check.state": true
        });
    }
}

function getEnemyDistance(token, target) {
    return new CONFIG.Token.objectClass(token).distanceTo(new CONFIG.Token.objectClass(target))
}

function nonReach(arr) {
    return !arr.find(b=>b.startsWith("reach"))
}

function hasReachWeapon(actor) {
    return actor?.system?.actions?.filter(a=>a.ready).filter(a=>a.weaponTraits.find(b=>b.name=="reach")).length != 0
}

function isTargetCharacter(message) {
    return "character" == message?.target?.actor?.type;
}

function _uuid(obj) {
    return "@UUID["+obj.uuid+"]";
}

function hasReaction(combatant, actionName=undefined) {
    return combatant
        && (combatant?.flags?.["reaction-check"]?.state
            || (actionName == "attack-of-opportunity"
                && (combatant?.flags?.['reaction-check']?.['triple-opportunity'] || combatant?.flags?.['reaction-check']?.['combat-reflexes'] || combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves'])
            )
            || (actionName == "opportune-riposte"
                && (combatant?.flags?.['reaction-check']?.['reflexive-riposte'] || combatant?.flags?.['reaction-check']?.['inexhaustible-countermoves'])
            )
        )
}

function hasCondition(actor, con) {
    return actor && actor?.itemTypes?.condition?.find((c => c.type == "condition" && con === c.slug))
}

function actorAction(actor, action) {
    return actor?.itemTypes?.action?.find((c => action === c.slug))
}

function actorFeat(actor, feat) {
    return actor?.itemTypes?.feat?.find((c => feat === c.slug))
}

async function postInChatTemplate(uuid, combatant, actionName=undefined) {
    var text = game.i18n.format("pf2e-reaction.ask", {uuid:uuid, name:combatant.token.name});
    const content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text});
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
        whisper: ChatMessage.getWhisperRecipients("GM").map((u) => u.id),
        flags: {
            "reaction-check": {
                cId: combatant._id,
                actionName: actionName
            }
        }
    });
}

function checkCombatantTriggerAttackOfOpportunity(actorType, actorId, token) {
    var filteredType = ((actorType  == "npc") ? 'character' : 'npc')
    game?.combats?.active?.combatants
        .filter((c=>c.actorId != actorId && c.actor.type == filteredType && hasReaction(c, "attack-of-opportunity")))
        .filter((cc=>actorAction(cc.actor, "attack-of-opportunity")))
        .forEach(cc => {
            var hasStrike = cc.token.actor.system.actions?.filter((e=>"strike"===e.type && e.ready));
            if (hasStrike.length>0) {
                var isReach = actorType  == "npc"
                    ? hasStrike.filter((e=>e.weaponTraits.find(b=>b.name==="reach")))
                    : hasStrike.filter((e=>e.traits.find(b=>b.name.startsWith("reach"))));

                var reachValue = Settings.weaponRange;
                if (isReach.length>0) {
                    reachValue = Settings.weaponReachRange;
                    if (filteredType == "npc") {
                        var rV = Math.min.apply(null, isReach.map(a=>a.traits).flat()
                            .filter(b=>b.name.startsWith("reach"))
                            .map(c=>c.name)
                            .map(c=>c.split('-').slice(-1)[0])
                        );
                        if (!isNaN(rV)) {
                            reachValue = rV
                        }
                    }
                }

                if (getEnemyDistance(token, cc.token)<= reachValue) {
                    postInChatTemplate(attack_of_opportunity, cc, "attack-of-opportunity");
                }
            }
        })
}

export default function reactionHooks() {
    $(document).on('click', '.reaction-check', function () {
        var mid = $(this).parent().parent().parent().data('message-id');
        if (mid) {
            var mes = game.messages.get(mid);
            var t = mes.flags['reaction-check'].cId;
            if (t) {
                var combatant = game.combat.turns.find(a=>a._id === t);
                if (combatant) {
                    updateCombatantReactionState(combatant, false, mes?.flags['reaction-check']?.actionName);
                    mes.delete()
                }
            }
        }
    });

    $(document).on('click', '.reaction-cancel', function () {
        var mid = $(this).parent().parent().parent().data('message-id');
        if (mid) {
            game.messages.get(mid)?.delete()
        }
    });

    Hooks.on('combatTurn', async (combat, updateData, updateOptions) => {
        updateCombatantReactionState(combat.nextCombatant, true);
        updateInexhaustibleCountermoves(combat.nextCombatant);
        if (combat.nextCombatant?.actor?.type == "character") {
            game.combat.turns.filter(a => a.actor.type == "npc").filter(a=>hasReaction(a))
                .forEach(cc => {
                    var pg = actorAction(cc.actor, "petrifying-glance")
                    if (pg && getEnemyDistance(combat.nextCombatant.token, cc.token) <= 30) {
                        postInChatTemplate(_uuid(pg), cc);
                    }
                })
        }
    });

    Hooks.on('combatRound', async (combat, updateData, updateOptions) => {
        updateCombatantReactionState(combat.nextCombatant, true);
        updateInexhaustibleCountermoves(combat.nextCombatant);
        if (combat.nextCombatant?.actor?.type == "character") {
            game.combat.turns.filter(a => a.actor.type == "npc").filter(a=>hasReaction(a))
                .forEach(cc => {
                    var pg = actorAction(cc.actor, "petrifying-glance")
                    if (pg && getEnemyDistance(combat.nextCombatant.token, cc.token <= 30)) {
                        postInChatTemplate(_uuid(pg), cc);
                    }
                })
        }
    });

    Hooks.on('combatStart', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, true)
        });
        updateInexhaustibleCountermoves(combat.turns[0]);
    });

    Hooks.on('createCombatant', async combatant => {
        if (game.user?.isGM) {
            updateCombatantReactionState(combatant, true)
        }
    });

    Hooks.on('renderChatMessage', (app, html, msg) => {
        if (app?.flags?.["reaction-check"] && !msg.user.isGM) {
    		html.addClass('hide-reaction-check');
		    html.hide();
        }
    });

    Hooks.on("renderActorSheet", (sheet, html, data)=>{
        if (game.user?.isGM && sheet.actor?.type === "npc" && sheet.token && Settings.recallKnowledge) {
            var skills = Array.from(new Set(sheet.object.system.traits.value.flatMap((t) => identifySkills.get(t) ?? [])));
            var dc = html.find(".recall-knowledge .section-body .identification-skills").eq(0).text().trim().match(/\d+/g)[0];
            skills.forEach(skill => {
                var loc_skill=game.i18n.localize("PF2E.Skill"+skill.replace(/^\w/, (c) => c.toUpperCase()))
                var rec=game.i18n.localize("PF2E.RecallKnowledge.Label")
                var but = document.createElement('button');
                but.className = 'gm-recall-knowledge-'+skill
                but.textContent = rec+': '+loc_skill
                but.onclick = function () {
                    let content = 'To Recall Knowledge '+(sheet?.token?.name?sheet?.token?.name:'') +', roll:';
                    content += '<br>@Check[type:'+skill+'|dc:'+dc+'|traits:secret,action:recall-knowledge]';
                    ChatMessage.create({
                        content: TextEditor.enrichHTML(content, { async: false }),
                        speaker: ChatMessage.getSpeaker({ token: sheet.token }),
                    }).then();
                };
                html.find(".recall-knowledge").append(but);
            });
        }
    });

    Hooks.on('preUpdateToken', (tokenDoc, data, deep, id) => {
        if (data?.actorData?.system?.attributes?.hp?.value == 0
            && hasReaction(tokenDoc?.combatant)) {
            if (actorAction(tokenDoc?.actor, "ferocity")) {
                postInChatTemplate(ferocity, tokenDoc.combatant);
            }
        }
    });

    Hooks.on('preCreateChatMessage',(message, user, _options, userId)=>{
        if (game?.combats?.active) {
            if (
                ('attack-roll' == message?.flags?.pf2e?.context?.type && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
                || (message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("manipulate"))
            ) {
                checkCombatantTriggerAttackOfOpportunity(message.actor?.type, message.actor._id, message.token);
            } else if (user?.flags?.pf2e?.origin?.type == 'action') {
                var actId = user.flags?.pf2e?.origin?.uuid.split('.').slice(-1)[0]
                if (game?.packs?.get("pf2e.actionspf2e")._source.find(a=>a._id==actId)?.system?.traits?.value.includes("manipulate")) {
                    checkCombatantTriggerAttackOfOpportunity(message.actor?.type, message.actor._id, message.token);
                }
            }
            if ('attack-roll' == message?.flags?.pf2e?.context?.type) {
                if (hasReaction(message?.target?.token?.combatant)) {
                    if (isTargetCharacter(message)) {
                        if (actorFeat(message?.target?.actor, "nimble-dodge") && !hasCondition(message?.target?.actor,"encumbered")) {
                            postInChatTemplate(nimble_dodge_feat, message.target.token.combatant);
                        }
                        if (actorFeat(message?.target?.actor, "airy-step")) {
                            postInChatTemplate(airy_step_feat, message.target.token.combatant);
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
                if ("criticalFailure" == message?.flags?.pf2e?.context?.outcome && hasReaction(message?.target?.token?.combatant, "opportune-riposte")) {
                    var distance = getEnemyDistance(message.token, message?.target?.token);
                    if (distance <= 5 || (distance <= 10 && hasReachWeapon(message?.target?.actor))) {
                        postInChatTemplate(opportune_riposte, message.target.token.combatant, "opportune-riposte");
                    }
                }
            }

            if ('attack-roll' == message?.flags?.pf2e?.context?.type && !isTargetCharacter(message)) {
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == "npc")
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (getEnemyDistance(message.token, cc.token) <= 5) {
                        var ab = actorAction(cc.actor, "avenging-bite");
                        if (ab) {
                            postInChatTemplate(_uuid(ab), cc?.token?.combatant);
                        }
                    }
                })
            }
            //Hit by
            if ('attack-roll' == message?.flags?.pf2e?.context?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)
            ) {
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
                }
            }
            //Hit by crit
            if ('attack-roll' == message?.flags?.pf2e?.context?.type &&  "criticalSuccess" == message?.flags?.pf2e?.context?.outcome) {
                if (hasReaction(message?.target?.token?.combatant)) {
                    var vs = actorAction(message?.target?.actor, "vengeful-spite");
                    if (vs) {
                        postInChatTemplate(_uuid(vs), message.target?.token?.combatant);
                    }
                }
            }
            //Skill check
            if ("skill-check" == message?.flags?.pf2e?.context?.type && isTargetCharacter(message)
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)) {
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == "character")
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb=>bb=="action:grapple")) {
                        if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15){
                            if (actorAction(cc.actor, "liberating-step")) {
                                postInChatTemplate(liberating_step, cc);
                            }
                        }
                    }
                })
            }
            //Damage by
            if ("damage-roll" == message?.flags?.pf2e?.context?.type) {
                //15 ft damage you
                if(hasReaction(message?.target?.token?.combatant)) {
                    if (getEnemyDistance(message.target.token, message.token) <= 5) {
                        var rg = actorAction(message?.target?.actor, "reactive-gnaw");
                        if (rg && message?.item?.system?.damage?.damageType == "slashing") {
                            postInChatTemplate(_uuid(rg), message.target.token.combatant);
                        }
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
                //15 ft damage ally
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == message?.target?.actor?.type)
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                        if (actorAction(cc.actor, "glimpse-of-redemption")) {
                            postInChatTemplate(glimpse_of_redemption, cc);
                        }
                        if (actorAction(cc.actor, "liberating-step")) {
                            postInChatTemplate(liberating_step, cc);
                        }
                        if (actorAction(cc.actor, "retributive-strike")) {
                            postInChatTemplate(retributive_strike, cc);
                        }
                    }
                })
            }
        }
    });

    Hooks.on('preUpdateToken',(_document, update, options, ..._args)=>{
        if (game?.combats?.active && (update.x > 0 || update.y > 0)) {
            checkCombatantTriggerAttackOfOpportunity(_document.actor?.type, _document.actorId, _document);
        }
    });

    Hooks.on("targetToken", (_user, token, isTargeted, opts) => {
        if (Settings.notification && game?.combats?.active && isTargeted && hasReaction(token?.combatant)) {
            if (game.user.isGM || token.combatant.players.find(a=>a.id==game.user.id)) {
                if (token?.actor?.type == "character") {
                    var nd = actorFeat(token.actor, "nimble-dodge");
                    if (nd && !hasCondition(token.actor, "encumbered")) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:nd.name, name:token.name});
                        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                    }
                    var as = actorFeat(token.actor, "airy-step");
                    if (as) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:as.name, name:token.name});
                        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                    }
                } else {
                    var nd = actorAction(token.actor, "nimble-dodge");
                    if (nd && !hasCondition(token.actor, "encumbered")) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:nd.name, name:token.name});
                        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                    }
                    var as = actorAction(token.actor, "airy-step");
                    if (as) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:as.name, name:token.name});
                        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                    }
                }
            }
        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}