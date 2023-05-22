import Settings from "./settings.js";

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

function updateCombatantReactionState(combatant, newState) {
    combatant.update({
        "flags.reaction-check.state": newState
    });
}

function getEnemyDistance(token, target) {
    return new CONFIG.Token.objectClass(token).distanceTo(new CONFIG.Token.objectClass(target))
}

function nonReach(arr) {
    return !arr.find(b=>b.startsWith("reach"))
}

function _uuid(obj) {
    return "@UUID["+obj.uuid+"]";
}

function hasReaction(combatant) {
    return combatant && combatant?.flags?.["reaction-check"]?.state
}

async function postInChatTemplate(uuid, combatant) {
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
                cId: combatant._id
            }
        }
    });
}

function checkCombatantTriggerAttackOfOpportunity(actorType, actorId, token) {
    var filteredType = ((actorType  == "npc") ? 'character' : 'npc')
    game?.combats?.active?.combatants
        .filter((c=>c.actorId != actorId && c.actor.type == filteredType && hasReaction(c)))
        .filter((cc=>cc.actor.itemTypes.action.find((feat => "attack-of-opportunity" === feat.slug))))
        .forEach(cc => {
            var hasStrike = cc.token.actor.system.actions?.filter((e=>"strike"===e.type && e.ready));
            if (hasStrike.length>0) {
                var isReach = actorType  == "npc"
                    ? hasStrike.filter((e=>e.weaponTraits.find(b=>b.name==="reach")))
                    : hasStrike.filter((e=>e.traits.find(b=>b.name.startsWith("reach"))));

                var reachValue = Settings.weaponRange;
                if (isReach.length>0) {
                    reachValue = Settings.weaponReachRange;
                    if (filteredType  == "npc") {
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
                    postInChatTemplate(attack_of_opportunity, cc);
                }
            }
        })
}

export default function reactionHooks() {

    console.log("Pf2e-reaction | --- Add hooks");

    $(document).on('click', '.reaction-check', function () {
        var mid = $(this).parent().parent().data('message-id');
        if (mid) {
            var mes = game.messages.get(mid);
            var t = mes.flags['reaction-check'].cId;
            if (t) {
                var combatant = game.combat.turns.find(a=>a._id === t);
                if (combatant) {
                    updateCombatantReactionState(combatant, false);
                    mes.delete()
                }
            }
        }

    });

    Hooks.on('combatTurn', async (combat, updateData, updateOptions) => {
        updateCombatantReactionState(combat.nextCombatant, true);
    });

    Hooks.on('combatRound', async (combat, updateData, updateOptions) => {
        updateCombatantReactionState(combat.nextCombatant, true);
    });

    Hooks.on('combatStart', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, true)
        })
    });

    Hooks.on('createCombatant', async combatant => {
        updateCombatantReactionState(combatant, true)
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
            if (tokenDoc?.actor?.itemTypes.action.find((feat => "ferocity" === feat.slug))) {
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
            //Nimble Dodge
            if ('attack-roll' == message?.flags?.pf2e?.context?.type) {
                if (hasReaction(message?.target?.token?.combatant)) {
                    if (message?.target?.actor?.type == "character") {
                        if (message?.target?.actor.itemTypes.feat.find((feat => "nimble-dodge" === feat.slug))) {
                            postInChatTemplate(nimble_dodge_feat, message.target.token.combatant);
                        }
                    } else {
                        if (message?.target?.actor.itemTypes.action.find((feat => "nimble-dodge" === feat.slug))) {
                            postInChatTemplate(nimble_dodge_action, message.target.token.combatant);
                        }
                    }
                }
            }


            //Avenging Bite
            if ('attack-roll' == message?.flags?.pf2e?.context?.type && "npc" == message?.target?.actor?.type) {
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == "npc")
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (getEnemyDistance(message.token, cc.token) <= 5) {
                        var ab = cc.actor.itemTypes.action.find((feat => "avenging-bite" === feat.slug));
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
                        var fs = message?.actor?.itemTypes?.action.find((feat => "fast-swallow" === feat.slug));
                        if (fs) {
                            postInChatTemplate(_uuid(fs), message?.token?.combatant);
                        }
                    }
                }
                if (hasReaction(message?.target?.token?.combatant)) {
                    //wicked-thorns
                    if (message?.target?.actor.itemTypes.action.find((feat => "wicked-thorns" === feat.slug))) {
                        if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                            postInChatTemplate(wicked_thorns, message.target.token.combatant);
                        }
                    }
                }
            }
            //Hit by crit
            if ('attack-roll' == message?.flags?.pf2e?.context?.type &&  "criticalSuccess" == message?.flags?.pf2e?.context?.outcome) {
                if (hasReaction(message?.target?.token?.combatant)) {
                    var vs = message?.target?.actor.itemTypes.action.find((feat => "vengeful-spite" === feat.slug));
                    if (vs) {
                        postInChatTemplate(_uuid(vs), message.target?.token?.combatant);
                    }
                }
            }
            //Skill check
            if ("skill-check" == message?.flags?.pf2e?.context?.type && "character" == message?.target?.actor?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)) {
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == "character")
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb=>bb=="action:grapple")) {
                        //glimpse-of-redemption
                        if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15){
                            if (cc.actor.itemTypes.action.find((feat => "liberating-step" === feat.slug))) {
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
                        var rg = message?.target?.actor.itemTypes.action.find((feat => "reactive-gnaw" === feat.slug));
                        if (rg && message?.item?.system?.damage?.damageType == "slashing") {
                            postInChatTemplate(_uuid(rg), message.target.token.combatant);
                        }
                    } else if (getEnemyDistance(message?.target.token, message.token) <= 15) {
                        if (message?.target?.actor.itemTypes.action.find((feat => "iron-command" === feat.slug))) {
                            postInChatTemplate(iron_command, message.target.token.combatant);
                        }
                        if (message?.target?.actor.itemTypes.action.find((feat => "selfish-shield" === feat.slug))) {
                            postInChatTemplate(selfish_shield, message.target.token.combatant);
                        }
                        if (message?.target?.actor.itemTypes.action.find((feat => "destructive-vengeance" === feat.slug))) {
                            postInChatTemplate(destructive_vengeance, message.target.token.combatant);
                        }
                    }
                }
                //15 ft damage ally
                game.combat.turns.filter(a=>a.actorId != message?.target?.actor._id && a.actor.type == message?.target?.actor?.type)
                .filter(cc=>hasReaction(cc))
                .forEach(cc => {
                    if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                        if (cc.actor.itemTypes.action.find((feat => "glimpse-of-redemption" === feat.slug))) {
                            postInChatTemplate(glimpse_of_redemption, cc);
                        }
                        if (cc.actor.itemTypes.action.find((feat => "liberating-step" === feat.slug))) {
                            postInChatTemplate(liberating_step, cc);
                        }
                        if (cc.actor.itemTypes.action.find((feat => "retributive-strike" === feat.slug))) {
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
            if (game.user.isGM) {
                if (token?.actor?.type == "character") {
                    var nd = token.actor.itemTypes.feat.find((feat => "nimble-dodge" === feat.slug));
                    if (nd) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:nd.name, name:token.name});
                        ui.notifications.info(`${_user.name} used target. ${text}`);
                    }
                } else {
                    var nd = token.actor.itemTypes.action.find((feat => "nimble-dodge" === feat.slug));
                    if (nd) {
                        var text = game.i18n.format("pf2e-reaction.notify", {uuid:nd.name, name:token.name});
                        ui.notifications.info(`${_user.name} used target. ${text}`);
                    }
                }
            }
        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}