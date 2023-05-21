import Settings from "./settings.js";

const retributive_strike = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.IQtb58p4EaeUzTN1]"
const ferocity = "@UUID[Compendium.pf2e.bestiary-ability-glossary-srd.N1kstYbHScxgUQtN]"
const attack_of_opportunity = "@UUID[Compendium.pf2e.actionspf2e.KAVf7AmRnbCAHrkT]"
const glimpse_of_redemption = "@UUID[Compendium.pf2e.actionspf2e.tuZnRWHixLArvaIf]"
const wicked_thorns = "@UUID[Compendium.pf2e.actionspf2e.ncdryKskPwHMgHFh]"
const iron_command = "@UUID[Compendium.pf2e.actionspf2e.M8RCbthRhB4bxO9t]"
const selfish_shield = "@UUID[Compendium.pf2e.actionspf2e.enQieRrITuEQZxx2]"
const destructive_vengeance = "@UUID[Compendium.pf2e.actionspf2e.r5Uth6yvCoE4tr9z]"
const liberating_step = "@UUID[Compendium.pf2e.actionspf2e.IX1VlVCL5sFTptEE]"

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

async function postInChatTemplate(uuid, combatant) {
    const content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", { uuid:uuid, name: combatant.token.name });
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
        .filter((c=>c.actorId != actorId && c.actor.type == filteredType && c.flags?.["reaction-check"]?.state))
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

    Hooks.on('preUpdateToken', (tokenDoc, data, deep, id) => {
        if (data?.actorData?.system?.attributes?.hp?.value == 0
            && tokenDoc?.combatant?.flags?.["reaction-check"]?.state) {
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
            //Hit by
            if ('attack-roll' == message?.flags?.pf2e?.context?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)
            ) {
                if (message.target.token.combatant.flags?.["reaction-check"]?.state) {
                    //wicked-thorns
                    if (message.target.actor.itemTypes.action.find((feat => "wicked-thorns" === feat.slug))) {
                        if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                            postInChatTemplate(wicked_thorns, message.target.token.combatant);
                        }
                    }
                }
            }
            //Skill check
            if ("skill-check" == message?.flags?.pf2e?.context?.type && "character" == message?.target?.actor?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)) {
                game.combat.turns.filter(a=>a.actorId != message.target.actor._id && a.actor.type == "character")
                .filter(cc=>cc.flags?.["reaction-check"]?.state)
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
                if(message?.target?.token.combatant.flags?.["reaction-check"]?.state) {
                    if (message.target.actor.itemTypes.action.find((feat => "iron-command" === feat.slug))) {
                        postInChatTemplate(iron_command, message.target.token.combatant);
                    }
                    if (message.target.actor.itemTypes.action.find((feat => "selfish-shield" === feat.slug))) {
                        postInChatTemplate(selfish_shield, message.target.token.combatant);
                    }
                    if (message.target.actor.itemTypes.action.find((feat => "destructive-vengeance" === feat.slug))) {
                        postInChatTemplate(destructive_vengeance, message.target.token.combatant);
                    }
                }
                //15 ft damage ally
                game.combat.turns.filter(a=>a.actorId != message.target.actor._id && a.actor.type == message.target.actor?.type)
                .filter(cc=>cc.flags?.["reaction-check"]?.state)
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

    console.log("Pf2e-reaction | --- Hooks are added");
}