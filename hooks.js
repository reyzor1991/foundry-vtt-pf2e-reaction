import Settings from "./settings.js";

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

function getEnemyDistance(tcenter, dcenter) {
    var distance = canvas.grid.measureDistance(tcenter, dcenter);
    return Math.round(distance / 5) * 5
}

function getCenterObj(x, y) {
    var a = canvas.grid.getCenter(x, y)
    return {"x": a[0],"y": a[1]}
}

function nonReach(arr) {
    return !arr.find(b=>b.startsWith("reach"))
}

function getCenters(x, y, width) {
    var startY = y;
    var arr = [];

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            arr.push(getCenterObj(x,y));
            y += 100;
        }
        y = startY;
        x += 100;
    }
    return arr
}

async function postInChatTemplate(uuid, combatant) {
    const content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", { uuid:uuid, name: combatant.token.name });
    ChatMessage.create({
        content: content,
        whisper: game.users.filter(u => u.isGM).map(u => u._id),
        flags: {
            "reaction-check": {
                cId: combatant._id
            }
        }
    });
}

function checkCombatantTriggerAttackOfOpportunity(actorType, actorId, x, y, width) {
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
                var canAttack = getCenters(x, y, width)
                    .map(a=>getEnemyDistance(cc.token.center, a))
                    .filter(a=> (a <= (isReach.length>0?Settings.weaponReachRange:Settings.weaponRange)))
                if (canAttack.length>0) {
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
                    ui.chat.deleteMessage(mid, {})
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

    Hooks.on('deleteCombat', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, false)
        })
    });

    Hooks.on('combatStart', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, true)
        })
    });

    Hooks.on('createCombatant', async combatant => {
        updateCombatantReactionState(combatant, true)
    });

    Hooks.on('preCreateChatMessage',(message, user, _options, userId)=>{
        if (game?.combats?.active) {
            if (
                ('attack-roll' == message?.flags?.pf2e?.context?.type && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
                || (message?.item?.type == 'action' && message?.item?.system?.traits?.value.includes("manipulate"))
            ) {
                checkCombatantTriggerAttackOfOpportunity(message.actor?.type, message.actor._id, message.token.x, message.token.y, message.token.width);
            } else if (user?.flags?.pf2e?.origin?.type == 'action') {
                var actId = user.flags?.pf2e?.origin?.uuid.split('.').slice(-1)
                if (game?.packs?.get("pf2e.actionspf2e")._source.find(a=>a._id==actId).system?.traits?.value.includes("manipulate")) {
                    checkCombatantTriggerAttackOfOpportunity(message.actor?.type, message.actor._id, message.token.x, message.token.y, message.token.width);
                }
            }
            //Hit by
            if ('attack-roll' == message?.flags?.pf2e?.context?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)
            ) {
                if (message.target.token.combatant.flags?.["reaction-check"]?.state) {
                    //wicked-thorns
                    if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                        postInChatTemplate(wicked_thorns, message.target.token.combatant);
                    }
                }
            }
            //Skill check
            if ("skill-check" == message?.flags?.pf2e?.context?.type && "character" == message.target.actor?.type
                && ("success" == message?.flags?.pf2e?.context?.outcome || "criticalSuccess" == message?.flags?.pf2e?.context?.outcome)) {
                game.combat.turns.filter(a=>a.actorId != message.target.actor._id && a.actor.type == "character")
                .filter(cc=>cc.flags?.["reaction-check"]?.state)
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb=>bb=="action:grapple")) {
                        var dists = Math.min.apply(null, getCenters(cc.token.x, cc.token.y, cc.token.width)
                        .map(a=>
                            getCenters(message.target.token.x, message.target.token.y, message.target.token.width)
                            .map(b=>getEnemyDistance(b, a))
                        ).flat())
                        var dists2 = Math.min.apply(null, getCenters(cc.token.x, cc.token.y, cc.token.width)
                        .map(a=>
                            getCenters(message.token.x, message.token.y, message.token.width)
                            .map(b=>getEnemyDistance(b, a))
                        ).flat())
                        //glimpse-of-redemption
                        if (dists <= 15 && dists2 <= 15 && cc.actor.itemTypes.action.find((feat => "liberating-step" === feat.slug))) {
                            postInChatTemplate(liberating_step, cc);
                        }
                    }
                })
            }
            //Damage by
            if ("damage-roll" == message?.flags?.pf2e?.context?.type && "character" == message.target.actor?.type) {
                //15 ft damage you
                if(message.target.token.combatant.flags?.["reaction-check"]?.state) {
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

                game.combat.turns.filter(a=>a.actorId != message.target.actor._id && a.actor.type == "character")
                .filter(cc=>cc.flags?.["reaction-check"]?.state)
                .forEach(cc => {
                    var dists = Math.min.apply(null, getCenters(cc.token.x, cc.token.y, cc.token.width)
                    .map(a=>
                        getCenters(message.target.token.x, message.target.token.y, message.target.token.width)
                        .map(b=>getEnemyDistance(b, a))
                    ).flat())
                    var dists2 = Math.min.apply(null, getCenters(cc.token.x, cc.token.y, cc.token.width)
                    .map(a=>
                        getCenters(message.token.x, message.token.y, message.token.width)
                        .map(b=>getEnemyDistance(b, a))
                    ).flat())
                    //glimpse-of-redemption
                    if (dists <= 15 && dists2 <= 15 && cc.actor.itemTypes.action.find((feat => "glimpse-of-redemption" === feat.slug))) {
                        postInChatTemplate(glimpse_of_redemption, cc);
                    }
                    if (dists <= 15 && dists2 <= 15 && cc.actor.itemTypes.action.find((feat => "liberating-step" === feat.slug))) {
                        postInChatTemplate(liberating_step, cc);
                    }
                })
            }
        }
    });

    Hooks.on('preUpdateToken',(_document, update, options, ..._args)=>{
        if (game?.combats?.active && (update.x > 0 || update.y > 0)) {
            checkCombatantTriggerAttackOfOpportunity(_document.actor?.type, _document.actorId, _document.x,_document.y,_document.width);
        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}