const deflect_arrow = "Compendium.pf2e.feats-srd.Item.sgaqlDFTVC7Ryurt"
const crane_flutter = "Compendium.pf2e.feats-srd.Item.S14S52HjszTgIy4l"
const hit_the_dirt = "Compendium.pf2e.feats-srd.Item.6LFBPpPPJjDq07fg"

const reactionWasUsedEffect = "Compendium.pf2e-reaction.reaction-effects.Item.Dvi4ewimR9t5723U"
const moduleName = 'pf2e-reaction';

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
            cc.setFlag(moduleName, 'inexhaustible-countermoves', val);
        }
    })
}

async function updateCombatantReactionState(combatant, newState, actionName=undefined) {
    if (!newState) {
        if (!hasReaction(combatant, actionName) && game.user.isGM) {
            ui.notifications.warn(`${combatant.name} does not have reaction anymore`);
            return;
        }
        if (actionName === "attack-of-opportunity") {
            if (combatant.getFlag(moduleName, 'triple-opportunity')) {
                await combatant.setFlag(moduleName, 'triple-opportunity', combatant.getFlag(moduleName, 'triple-opportunity') - 1);
                return;
            }
            if (combatant.getFlag(moduleName, 'combat-reflexes')) {
                await combatant.setFlag(moduleName, 'combat-reflexes', combatant.getFlag(moduleName, 'combat-reflexes') - 1);

                return;
            }
            if (combatant.getFlag(moduleName, 'inexhaustible-countermoves')) {
                await combatant.setFlag(moduleName, 'inexhaustible-countermoves', combatant.getFlag(moduleName, 'inexhaustible-countermoves') - 1);
                return;
            }
        } else if (actionName === "opportune-riposte") {
            if (combatant.getFlag(moduleName, 'reflexive-riposte')) {
                await combatant.setFlag(moduleName, 'reflexive-riposte', combatant.getFlag(moduleName, 'reflexive-riposte') - 1);
                return;
            }
            if (combatant.getFlag(moduleName, 'inexhaustible-countermoves')) {
                await combatant.setFlag(moduleName, 'inexhaustible-countermoves', combatant.getFlag(moduleName, 'inexhaustible-countermoves') - 1);
                return;
            }
        } else if (actionName === "shield-block") {
            if (combatant.getFlag(moduleName, 'quick-shield-block')) {
                await combatant.setFlag(moduleName, 'quick-shield-block', combatant.getFlag(moduleName, 'quick-shield-block') - 1);
                return;
            }
        }
        if (combatant.getFlag(moduleName, 'state')) {
            await combatant.setFlag(moduleName, 'state', false);
        }
    } else {
        if (isNPC(combatant.actor)) {
            if (actorAction(combatant.actor, "triple-opportunity")) {
                await combatant.setFlag(moduleName, 'triple-opportunity', 1);
            }
        } else {
            if (actorFeat(combatant.actor, "combat-reflexes")) {
                await combatant.setFlag(moduleName, 'combat-reflexes', 1);
            }
            if (actorFeat(combatant.actor, "reflexive-riposte")) {
                await combatant.setFlag(moduleName, 'reflexive-riposte', 1);
            }
            if (actorFeat(combatant.actor, "quick-shield-block")) {
                await combatant.setFlag(moduleName, 'quick-shield-block', 1);
            }
        }

        if (!combatant.getFlag(moduleName, 'state')) {
            await combatant.setFlag(moduleName, 'state', true);
        }
    }
}

function countAllReaction(combatant) {
    let count = 0;
    if (combatant) {
        if (combatant.getFlag(moduleName, 'state')) {
            count += 1;
        }

        count += combatant.getFlag(moduleName, 'triple-opportunity') ?? 0;
        count += combatant.getFlag(moduleName, 'combat-reflexes') ?? 0;
        count += combatant.getFlag(moduleName, 'inexhaustible-countermoves') ?? 0;

        count += combatant.getFlag(moduleName, 'reflexive-riposte') ?? 0;

        count += combatant.getFlag(moduleName, 'quick-shield-block') ?? 0;
    }
    return count;
}

function countReaction(combatant, actionName=undefined) {
    let count = 0;
    if (combatant) {
        if (combatant.getFlag(moduleName, 'state')) {
            count += 1;
        }
        if (actionName === "attack-of-opportunity") {
            count += combatant.getFlag(moduleName, 'triple-opportunity') ?? 0;
            count += combatant.getFlag(moduleName, 'combat-reflexes') ?? 0;
            count += combatant.getFlag(moduleName, 'inexhaustible-countermoves') ?? 0;
        } else if (actionName === "opportune-riposte") {
            count += combatant.getFlag(moduleName, 'reflexive-riposte') ?? 0;
            count += combatant.getFlag(moduleName, 'inexhaustible-countermoves') ?? 0;
        } else if (actionName === "shield-block") {
            count += combatant.getFlag(moduleName, 'quick-shield-block') ?? 0;
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
    return actor && actor?.itemTypes?.condition?.find((c => c.type === "condition" && con === c.slug))
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

async function reactionWasUsedChat(uuid, combatant) {
    const content = await renderTemplate("./modules/pf2e-reaction/templates/used.hbs", {
        uuid: uuid,
        combatant: combatant
    });

    let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
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

    let text = game.i18n.format("pf2e-reaction.ask", {uuid: uuid, name: combatant.token.name});
    let content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text: text, target: needTarget});
    const check = {
        cId: combatant._id,
        uuid: uuid,
        actionName: actionName
    };

    let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    if (combatant.players) {
        whispers = whispers.concat(combatant.players.map((u) => u.id));
    }

    if (game.messages.size > 0 && content === game.messages.contents[game.messages.size-1].content) {
        check['count'] = 2
        check['content'] = content
        check['reactions'] = countReaction(combatant, actionName)
        check['needTarget'] = needTarget

        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: 2});
        content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});

        await game.messages.contents[game.messages.size-1].update({
            'content': content,
            'flags.pf2e-reaction': check
        }, { noHook: true})
    } else if (game.messages.size > 0 && content === game.messages.contents[game.messages.size-1]?.getFlag(moduleName, 'content')) {
        const count = game.messages.contents[game.messages.size - 1]?.getFlag(moduleName, "count") + 1;
        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: count});
        content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {text:text, target: needTarget});

        await game.messages.contents[game.messages.size-1].update({
            'content': content,
            'flags.pf2e-reaction.count': count,
            'flags.pf2e-reaction.reactions': countReaction(combatant, actionName)
        }, { noHook: true})
    } else {
        await ChatMessage.create({
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
            flags: {'pf2e-reaction': check}
        });
    }
}

function checkCombatantTriggerAttackOfOpportunity(actor, actorId, token) {
    (isActorCharacter(actor) ? npcWithReaction() : characterWithReaction())
        .filter(c=>c.actorId !== actorId)
        .filter(c=> hasReaction(c, "attack-of-opportunity"))
        .forEach(cc => {
            const aoo = actorAction(cc.actor, "attack-of-opportunity") ?? actorFeat(cc.actor, "attack-of-opportunity");
            if (aoo) {
                let specificWeapon = undefined;
                if (isNPC(cc.actor)) {
                    const match = aoo.name.match('\(([A-Za-z]{1,}) Only\)');
                    if (match && match.length === 3) {
                        specificWeapon=match[2]
                    }
                }
                if (canReachEnemy(token, cc.token, cc.actor, specificWeapon)) {
                    postInChatTemplate(_uuid(aoo), cc, "attack-of-opportunity");
                }
            }
        })
}

function checkRingmasterIntroduction(combatant) {
    if (isActorCharacter(combatant?.actor)) {
        characterWithReaction()
            .filter(a=>a.tokenId !== combatant.tokenId)
            .filter(a=>hasReaction(a))
            .forEach(cc => {
                const ringmasters_introduction = actorFeat(cc.actor, "ringmasters-introduction");
                if (ringmasters_introduction) {
                    postInChatTemplate(_uuid(ringmasters_introduction), cc);
                }
            })
    }
}

function checkCourageousOpportunity(message) {
    (isActorCharacter(message.actor) ? npcWithReaction() : characterWithReaction())
        .filter(cc=>canReachEnemy(message.token, cc.token, cc.actor))
        .filter(a=>hasEffect(a.actor, "spell-effect-inspire-courage"))
        .forEach(cc => {
            const courageous_opportunity = actorFeat(cc.actor, "courageous-opportunity");
            if (aa) {
                postInChatTemplate(_uuid(courageous_opportunity), cc);
            }
        });
}

function hasLoadedFirearmOrCrossbow(actor) {
    return actor.system?.actions?.filter(a=>a.ready).filter(a=>a?.item?.baseType?.includes("crossbow") || a?.item?.group === "firearm").filter(a=>a.item.ammo)
}

function spellWithTrait(spell, trait) {
    return spell?.traits?.has(trait) || spell?.castingTraits?.includes(trait)
}

function messageWithTrait(message, trait) {
    return message?.item?.system?.traits?.value?.includes(trait)
            || message?.item?.castingTraits?.includes(trait)
            || message?.flags?.pf2e?.context?.traits?.find(a=>a.name===trait)
}

function messageWithAnyTrait(message, traits) {
    return traits.some(a=>messageWithTrait(message, a))
}

function checkImplementsInterruption(message) {
    if (!isActorCharacter(message.actor) && hasEffect(message.actor, "effect-exploit-vulnerability")) {
        characterWithReaction()
        .forEach(cc => {
            const implements_interruption = actorAction(cc.actor, "implements-interruption");
            if (implements_interruption
                && (canReachEnemy(message.token, cc.token, cc.actor)
                    || (getEnemyDistance(message.token, cc.token) <=10 && actorHeldWeapon(cc.actor).filter(a=>a?.item?.isRanged).length >= 1)
                )
            ) {
                postInChatTemplate(_uuid(implements_interruption), cc);
            }
        });
    }
}

async function decreaseReaction(combatant, actionName=undefined) {
    updateCombatantReactionState(combatant, false, actionName);
    if (Settings.addReactionEffect && countAllReaction(combatant) <= 1) {
        setEffectToActor(combatant.actor, combatant.token, reactionWasUsedEffect);
    }
}

async function setEffectToActor(actor, token, eff) {
    const source = (await fromUuid(eff)).toObject();
    source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: eff } });
    source.system.context = mergeObject(source.system.context ?? {}, {
        "origin": {
            "actor": actor.uuid,
            "token": token.uuid
        },
        "roll": null,
        "target": null
    });
    source.system.start.initiative = null;

    await actor.createEmbeddedDocuments("Item", [source]);
}

$(document).on('click', '.reaction-check', async function () {
    const mid = $(this).parent().parent().parent().data('message-id');
    if (mid) {
        const mes = game.messages.get(mid);
        const t = mes.getFlag(moduleName, "cId");
        const reactions = mes.getFlag(moduleName, "reactions");
        const count = mes.getFlag(moduleName, "count");
        const uuid = mes.getFlag(moduleName, "uuid");
        const actionName = mes.getFlag(moduleName, "actionName");
        const needTarget = mes.getFlag(moduleName, "needTarget") ?? false;
        if (t) {
            const combatant = game.combat.turns.find(a => a._id === t);
            if (combatant) {
                decreaseReaction(combatant, actionName);
                if (reactions > 1 && count > 1) {
                    let text = game.i18n.format("pf2e-reaction.ask", {uuid: uuid, name: combatant.token.name});
                    if (count-1 > 1) {
                        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid:uuid, name:combatant.token.name, count: count -1});
                    }
                    const content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {
                        text: text,
                        target: needTarget
                    });

                    const data = {
                        'content': content,
                        'flags.pf2e-reaction.count': count - 1,
                        'flags.pf2e-reaction.reactions': reactions - 1
                    };

                    if (mes.permission === 3) {
                        await mes.update(data, { noHook: true})
                    } else {
                        socket.socketlibSocket._sendRequest("updateItem", [mes.uuid, data], 0)
                    }
                } else {
                    if (mes.permission === 3) {
                        mes.delete()
                    } else {
                        socket.socketlibSocket._sendRequest("deleteItem", [mes.uuid], 0)
                    }
                }
                if (Settings.postMessage && uuid) {
                    (await fromUuid(uuid))?.toMessage()
                }
            }
        }
    }
});

$(document).on('click', '.reaction-cancel', function () {
    const mid = $(this).parent().parent().parent().data('message-id');
    if (mid) {
        const mes = game.messages.get(mid);
        if (mes.permission === 3) {
            mes.delete()
        } else {
            socket.socketlibSocket._sendRequest("deleteItem", [game.messages.get(mid)?.uuid], 0)
        }
    }
});

Hooks.on('combatTurn', async (combat, updateData, updateOptions) => {
    const _combatant = combat.nextCombatant;
    updateCombatantReactionState(_combatant, true);
    updateInexhaustibleCountermoves(_combatant);
    if (isActorCharacter(_combatant?.actor)) {
        npcWithReaction()
            .forEach(cc => {
                const pg = actorAction(cc.actor, "petrifying-glance");
                if (pg && getEnemyDistance(_combatant.token, cc.token <= 30)) {
                    postInChatTemplate(_uuid(pg), cc);
                }
            })
    }
    const sps = actorFeat(_combatant?.actor, "scapegoat-parallel-self");
    if (sps) {
        postInChatTemplate(_uuid(sps), _combatant);
    }
    if (combat.round === 1) {
        checkRingmasterIntroduction(_combatant)
    }
});

Hooks.on('combatRound', async (combat, updateData, updateOptions) => {
    if (combat.turns.length >= 1) {
        const _combatant = combat.turns[0];
        updateCombatantReactionState(_combatant, true);
        updateInexhaustibleCountermoves(_combatant);
        if (isActorCharacter(_combatant?.actor)) {
            npcWithReaction()
                .forEach(cc => {
                    const pg = actorAction(cc.actor, "petrifying-glance");
                    if (pg && getEnemyDistance(_combatant.token, cc.token <= 30)) {
                        postInChatTemplate(_uuid(pg), cc);
                    }
                })
        }
        const sps = actorFeat(_combatant?.actor, "scapegoat-parallel-self");
        if (sps) {
            postInChatTemplate(_uuid(sps), _combatant);
        }
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

Hooks.on('createItem', (effect, data, id) => {
    if ("effect-raise-a-shield" === effect.slug && isActorCharacter(effect.actor)) {
        const currCom = game.combat.turns.find(a => a.actorId === effect.actor.id);
        const withShield = game.combat.turns.filter(a => isActorCharacter(a.actor))
            .filter(a => hasEffect(a.actor, "effect-raise-a-shield"));
        const shield_wall = actorFeat(currCom.actor, "shield-wall");
        if (hasReaction(currCom) && shield_wall) {
            const adjacent = withShield
                .filter(a => adjacentEnemy(a.token, currCom.token));
            if (adjacent.length > 1) {
                postInChatTemplate(_uuid(shield_wall), currCom);
            }
        }
        withShield.filter(a=>hasReaction(a))
        .filter(a=>a.id !== currCom.id)
        .filter(a=>adjacentEnemy(a.token, currCom.token))
        .forEach(cc => {
            const shield_wall_ = actorFeat(a.actor, "shield-wall");
            if (shield_wall_) {
                postInChatTemplate(_uuid(shield_wall_), cc);
            }
        });
    }
});

Hooks.on('preUpdateToken', (tokenDoc, data, deep, id) => {
    if (game?.combats?.active && (data.x > 0 || data.y > 0)) {
        checkCombatantTriggerAttackOfOpportunity(tokenDoc.actor, tokenDoc.actorId, tokenDoc);
        if (!isActorCharacter(tokenDoc.actor)) {
            characterWithReaction()
                .filter(a=>a.tokenId !== tokenDoc._id)
                .forEach(cc => {
                    const no_escape = actorFeat(cc.actor, "no-escape");
                    if (no_escape && canReachEnemy(tokenDoc, cc.token, cc.actor)) {
                        postInChatTemplate(_uuid(no_escape), cc);
                    }
                });
            characterWithReaction()
                .filter(a=>a.tokenId !== tokenDoc._id)
                .forEach(cc => {
                    const stand_still = actorFeat(cc.actor, "stand-still");
                    if (stand_still && canReachEnemy(tokenDoc, cc.token, cc.actor)) {
                        postInChatTemplate(_uuid(stand_still), cc);
                    }
                });

            characterWithReaction()
                .filter(a=>a.actor.auras.size > 0)
                .forEach(cc => {
                    const everdistant_defense = actorFeat(cc.actor, "everdistant-defense");
                    if (everdistant_defense) {
                        const radius = Math.max(...Array.from(cc.actor.auras.values()).map(a => a.radius));
                        if (getEnemyDistance(tokenDoc, cc.token) <= radius) {
                            postInChatTemplate(_uuid(everdistant_defense), cc);
                        }
                    }
                })
        }

        checkCourageousOpportunity({"actor" : tokenDoc.actor, "token": tokenDoc})
        checkImplementsInterruption({"actor" : tokenDoc.actor, "token": tokenDoc})
    }
});

Hooks.on('preCreateChatMessage',async (message, user, _options, userId)=>{
    if (!game?.combats?.active) {return}
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0) {
            if (hasReaction(message?.token?.combatant)) {
                const ferocity = actorAction(message?.actor, "ferocity");
                if (ferocity) {
                    postInChatTemplate(_uuid(ferocity), message?.token?.combatant, undefined, true);
                }
                const orc_ferocity = actorFeat(message?.actor, "orc-ferocity");
                if (orc_ferocity) {
                    postInChatTemplate(_uuid(orc_ferocity), message?.token?.combatant, undefined, true);
                }
                const entitys_resurgence = actorAction(message?.actor, "entitys-resurgence");
                if (entitys_resurgence) {
                    postInChatTemplate(_uuid(entitys_resurgence), message?.token?.combatant, undefined, true);
                }
                const final_spite = actorAction(message?.actor, "final-spite");
                if (final_spite) {
                    postInChatTemplate(_uuid(final_spite), message?.token?.combatant, undefined, true);
                }
                const cheat_death = actorFeat(message?.actor, "cheat-death");
                if (cheat_death) {
                    postInChatTemplate(_uuid(cheat_death), message?.token?.combatant, undefined, true);
                }
                const ruby_resurrection = actorFeat(message?.actor, "ruby-resurrection");
                if (ruby_resurrection) {
                    postInChatTemplate(_uuid(ruby_resurrection), message?.token?.combatant, undefined, true);
                }
            }
            // ally
            if (isActorCharacter(message?.actor)) {
                characterWithReaction()
                .filter(a=>a.actorId !== message?.actor?._id)
                .forEach(cc => {
                    const rapid_response = actorFeat(a.actor, "rapid-response");
                    if (rapid_response) {
                        postInChatTemplate(_uuid(rapid_response), cc);
                    }
                });
            }
        } else {
            if (hasReaction(message?.token?.combatant)) {
                const wounded_rage = actorFeat(message?.actor, "wounded-rage");
                if (aa && !hasCondition(message?.actor,"encumbered") && !hasEffect(message.actor, "effect-rage")) {
                    postInChatTemplate(_uuid(wounded_rage), message?.token?.combatant);
                }
                const negate_damage = actorFeat(message?.actor, "negate-damage");
                if (negate_damage) {
                    postInChatTemplate(_uuid(negate_damage), message?.token?.combatant);
                }
            }
        }
    }

    if (!isActorCharacter(message?.actor) && messageWithTrait(message, "concentrate")) {
        characterWithReaction()
            .forEach(cc => {
                const distracting_explosion = actorFeat(cc.actor, "distracting-explosion");
                if (distracting_explosion && canReachEnemy(message.token, cc.token, cc.actor)) {
                    postInChatTemplate(_uuid(distracting_explosion), cc);
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
        || (message?.item?.type === 'action' && messageWithAnyTrait(message, ["manipulate","move"]))
    ) {
        checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
        checkCourageousOpportunity(message);

        if (message?.item?.type === 'action' && messageWithAnyTrait(message, ["manipulate","move"])) {
            checkImplementsInterruption(message);
        }
        if (message?.item?.type === 'action' && messageWithTrait(message, "move")) {
            characterWithReaction()
                .filter(a=>a.actorId !== message?.actor?._id)
                .forEach(cc => {
                    const stand_still = actorFeat(cc.actor, "stand-still");
                    if (stand_still && canReachEnemy(message?.token, cc.token, cc.actor)) {
                        postInChatTemplate(_uuid(stand_still), cc);
                    }
                });
        }
    } else if (message?.flags?.pf2e?.origin?.type === 'spell' && !messageType(message, "saving-throw")) {
        var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
        if (spellWithTrait(origin, "manipulate")) {
            checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
            checkImplementsInterruption(message);
        }
    } else if (message?.flags?.pf2e?.origin?.type === 'action') {
        const actId = message.flags?.pf2e?.origin?.uuid.split('.').slice(-1)[0];
        if (game?.packs?.get("pf2e.actionspf2e")._source.find(a=>a._id===actId)?.system?.traits?.value.includes("manipulate")) {
            checkCombatantTriggerAttackOfOpportunity(message.actor, message.actor._id, message.token);
            checkImplementsInterruption(message);
        }
    }

    if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
        (isActorCharacter(message?.actor) ? npcWithReaction() : characterWithReaction())
            .forEach(cc => {
                if (canReachEnemy(message.token, cc.token, cc.actor)) {
                    const mage_hunter = actorFeat(cc.actor, "mage-hunter");
                    if (mage_hunter) {
                        postInChatTemplate(_uuid(mage_hunter), cc);
                    }
                }

                if (getEnemyDistance(message.token, cc.token) <= 30) {
                    const counter_thought = actorFeat(cc.actor, "counter-thought");
                    if (counter_thought && spellWithTrait(message?.item, "mental")) {
                        postInChatTemplate(_uuid(counter_thought), cc);
                    }
                }
            })
        if (message?.item && isActorCharacter(message?.actor)) {
            if (!message?.item?.isCantrip) {
                characterWithReaction()
                    .filter(a=>a.actorId !== message?.actor?._id)
                    .filter(a=>getEnemyDistance(message.token, a.token) <= 30)
                    .forEach(cc => {
                        const accompany = actorFeat(cc.actor, "accompany");
                        if (accompany) {
                            postInChatTemplate(_uuid(accompany), cc);
                        }
                    })
            }

            if (hasReaction(message?.token?.combatant)) {
                const verdant_presence = actorFeat(message?.actor, "verdant-presence");
                if (verdant_presence && message?.item?.system?.traditions.value.includes("primal")) {
                    postInChatTemplate(_uuid(verdant_presence), message?.token?.combatant);
                }

                const align_ki = actorFeat(message?.actor, "align-ki");
                if (align_ki && messageWithTrait(message, "monk")) {
                    postInChatTemplate(_uuid(align_ki), message?.token?.combatant);
                }
            }

            let spellRange = message?.item?.system?.range?.value?.match(/\d+/g);
            spellRange = spellRange ? spellRange[0] : 0;

            characterWithReaction()
                .filter(a=>a.actorId !== message?.actor?._id)
                .filter(a=>getEnemyDistance(message.token, a.token) <= spellRange)
                .forEach(cc => {
                    const spell_relay = actorFeat(cc.actor, "spell-relay");
                    if (spell_relay) {
                        postInChatTemplate(_uuid(spell_relay), cc);
                    }
                })

        }

    } else if (messageType(message, "spell-attack-roll")) {
        if (hasReaction(message?.target?.token?.combatant)) {
            var ring_bell = actorAction(message?.target?.actor, "ring-bell");
            if (ring_bell
                    && getEnemyDistance(message.token, message.target.token)<=30
                    && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(_uuid(ring_bell), message.target.token.combatant);
            }
            const you_failed_to = actorFeat(message?.target?.actor, "you-failed-to-account-for-this");
            if (you_failed_to) {
                postInChatTemplate(_uuid(you_failed_to), message.target.token.combatant);
            }
            var foresee_danger = actorFeat(message?.target?.actor, "foresee-danger");
            if (foresee_danger) {
                postInChatTemplate(_uuid(foresee_danger), message.target.token.combatant);
            }
            var suspect_of_opportunity = actorFeat(message?.target?.actor, "suspect-of-opportunity");
            if (suspect_of_opportunity) {
                postInChatTemplate(_uuid(suspect_of_opportunity), message.target.token.combatant);
            }
            if (criticalFailureMessageOutcome(message)) {
                const mirror_shield = actorFeat(message?.target?.actor, "mirror-shield");
                if (mirror_shield) {
                    postInChatTemplate(_uuid(mirror_shield), message?.target?.token?.combatant);
                }
            }
        }
        if (isTargetCharacter(message)) {
            characterWithReaction()
            .filter(a=>a.actorId !== message?.target?.actor._id)
            .forEach(cc => {
                const ring_bell_ = actorAction(cc?.actor, "ring-bell");
                if (ring_bell_
                    && getEnemyDistance(cc?.token, message.token)<=30
                    && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(_uuid(ring_bell_), cc);
                }
            })
        }
    } else if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            if (isTargetCharacter(message)) {
                const ou_failed_to_account = actorFeat(message?.target?.actor, "you-failed-to-account-for-this");
                if (ou_failed_to_account) {
                    postInChatTemplate(_uuid(ou_failed_to_account), message.target.token.combatant);
                }
                var suspect_of_opportunity = actorFeat(message?.target?.actor, "suspect-of-opportunity");
                if (suspect_of_opportunity) {
                    postInChatTemplate(_uuid(suspect_of_opportunity), message.target.token.combatant);
                }
                var foresee_danger = actorFeat(message?.target?.actor, "foresee-danger")
                if (foresee_danger) {
                    postInChatTemplate(_uuid(foresee_danger), message.target.token.combatant);
                }
                const nimble_dodge = actorFeat(message?.target?.actor, "nimble-dodge");
                if (nimble_dodge && !hasCondition(message?.target?.actor,"encumbered")) {
                    postInChatTemplate(_uuid(nimble_dodge), message.target.token.combatant);
                }
                const airy_step = actorFeat(message?.target?.actor, "airy-step");
                if (airy_step) {
                    postInChatTemplate(_uuid(airy_step), message.target.token.combatant);
                }
                const farabellus_flip = actorFeat(message?.target?.actor, "farabellus-flip");
                if (farabellus_flip) {
                    postInChatTemplate(_uuid(farabellus_flip), message.target.token.combatant);
                }
                const reactive_shield = actorFeat(message?.target?.actor, "reactive-shield");
                if (reactive_shield && !hasEffect(message?.target?.actor, "effect-raise-a-shield") && message?.item?.isMelee) {
                    postInChatTemplate(_uuid(reactive_shield), message.target.token.combatant);
                }
                const pirouette = actorFeat(message?.target?.actor, "pirouette");
                if (pirouette && hasEffect(message?.target?.actor, "stance-masquerade-of-seasons-stance")) {
                    postInChatTemplate(_uuid(pirouette), message.target.token.combatant);
                }
                const fiery_retort = actorFeat(message?.target?.actor, "fiery-retort");
                if (fiery_retort && adjacentEnemy(message.token, message.target.token)
                    && (message?.item?.isMelee|| message?.item?.traits?.has("unarmed"))) {
                    postInChatTemplate(_uuid(fiery_retort), message.target.token.combatant);
                }
                const knights_retaliation = actorFeat(message?.target?.actor, "knights-retaliation");
                if (knights_retaliation
                    && message?.actor?.system.traits.value.includes("undead")
                    && criticalFailureMessageOutcome(message)
                ) {
                    postInChatTemplate(_uuid(knights_retaliation), message.target.token.combatant);
                }
                var ring_bell = actorAction(message?.target?.actor, "ring-bell")
                if (ring_bell
                    && getEnemyDistance(message.token, message.target.token)<=30
                    && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(_uuid(ring_bell), message.target.token.combatant);
                }
                if (hasOption(message, "hit-the-dirt") && hasOption(message, "item:ranged")) {
                    decreaseReaction(message.target.token.combatant);
                    reactionWasUsedChat(hit_the_dirt, message.target.token.combatant);
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
                const nimble_dodge_ = actorAction(message?.target?.actor, "nimble-dodge");
                if (nimble_dodge_ && !hasCondition(message?.target?.actor,"encumbered")) {
                    postInChatTemplate(_uuid(nimble_dodge_), message.target.token.combatant);
                }
                const airy_step_ = actorAction(message?.target?.actor, "airy-step");
                if (airy_step_) {
                    postInChatTemplate(_uuid(airy_step_), message.target.token.combatant);
                }
            }
        }
        if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant, "opportune-riposte")) {
            if (isNPC(message.actor)) {
                var opportune_riposte = actorFeat(message?.target?.actor, "opportune-riposte");
                if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && opportune_riposte) {
                    postInChatTemplate(_uuid(opportune_riposte), message.target.token.combatant, "opportune-riposte");
                }
            } else {
                var opportune_riposte = actorAction(message?.target?.actor, "opportune-riposte");
                if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && opportune_riposte) {
                    postInChatTemplate(_uuid(opportune_riposte), message.target.token.combatant, "opportune-riposte");
                }
            }
        }
        if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant)) {
            const dueling_riposte = actorFeat(message?.target?.actor, "dueling-riposte");
            if (dueling_riposte && hasEffect(message.target.actor, "effect-dueling-parry")) {
                postInChatTemplate(_uuid(dueling_riposte), message.target.token.combatant);
            }
            const twin_riposte = actorFeat(message?.target?.actor, "twin-riposte");
            if (twin_riposte && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                && (hasEffect(message.target.actor, "effect-twin-parry")||hasEffect(message.target.actor, "effect-twin-parry-parry-trait"))) {
                postInChatTemplate(_uuid(twin_riposte), message.target.token.combatant);
            }
        }
        if (anyFailureMessageOutcome(message)) {
            if (hasReaction(message?.token?.combatant)) {
                const perfect_clarity = actorFeat(message?.actor, "perfect-clarity");
                if (perfect_clarity) {
                    postInChatTemplate(_uuid(perfect_clarity), message?.token?.combatant);
                }
            }
        }

        if (!isTargetCharacter(message)) {
            npcWithReaction()
            .filter(a=>a.actorId !== message?.target?.actor._id)
            .forEach(cc => {
                if (adjacentEnemy(message.token, cc.token)) {
                    const ab = actorAction(cc.actor, "avenging-bite");
                    if (ab) {
                        postInChatTemplate(_uuid(ab), cc?.token?.combatant);
                    }
                }
            })

            characterWithReaction()
            .filter(a=>a.actorId !== message?.actor?._id)
            .forEach(cc => {
                const fake_out = actorFeat(cc?.actor, "fake-out");
                if (fake_out) {
                    const weapon = hasLoadedFirearmOrCrossbow(cc.actor);
                    if (weapon.length > 0) {
                        const range = Math.max(...weapon.map(a => a.item.rangeIncrement));
                        if (getEnemyDistance(cc?.token, message.target.token) <= range) {
                            postInChatTemplate(_uuid(fake_out), cc);
                        }
                    }
                }
            })
        } else {
            characterWithReaction()
            .filter(a=>a.actorId !== message?.target?.actor._id)
            .forEach(cc => {
                const ring_bell = actorAction(cc?.actor, "ring-bell");
                if (ring_bell
                    && getEnemyDistance(cc?.token, message.token)<=30
                    && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(_uuid(ring_bell), cc);
                }
            })
        }

        //Hit by
        if (anySuccessMessageOutcome(message)) {
            if (hasReaction(message?.token?.combatant)) {
                if (message?.item?.system?.attackEffects?.value.includes("improved-grab")) {
                    const fs = actorAction(message?.actor, "fast-swallow");
                    if (fs) {
                        postInChatTemplate(_uuid(fs), message?.token?.combatant);
                    }
                }
            }
            if (hasReaction(message?.target?.token?.combatant)) {
                const wicked_thorns = actorAction(message?.target?.actor, "wicked-thorns");
                if (wicked_thorns) {
                    if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                        postInChatTemplate(_uuid(wicked_thorns), message.target.token.combatant);
                    }
                }
                var emergency_targe = actorFeat(message?.target?.actor, "emergency-targe");
                if (emergency_targe && message?.item?.isMelee) {
                    postInChatTemplate(_uuid(emergency_targe), message.target.token.combatant);
                }
                const impossible_technique = actorFeat(message?.target?.actor, "impossible-technique");
                if (impossible_technique
                    && !hasCondition(message?.target?.actor, "fatigued")
                    && message?.target?.actor?.armorClass?.parent?.item?.type !== "armor"
                ) {
                    postInChatTemplate(_uuid(impossible_technique), message.target.token.combatant);
                }
                const rippling_spin = actorFeat(message?.target?.actor, "rippling-spin");
                if (rippling_spin && message?.item?.isMelee
                    && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                    && hasEffect(message?.target?.actor, "stance-reflective-ripple-stance")
                ) {
                    postInChatTemplate(_uuid(rippling_spin), message.target.token.combatant);
                }
            }

            if (isTargetCharacter(message)) {
                const rr = message.rolls.at(0);
                const newR = calculateDegreeOfSuccess(message?.flags?.pf2e?.context?.dc?.value, rr._total - 2, rr.dice.at(0).total);

                if (rr.degreeOfSuccess !== newR) {
                    characterWithReaction()
                        .filter(a=>a.actorId !== message?.target?.actor._id)
                        .filter(cc=>canReachEnemy(message?.target?.token, cc.token, cc.actor))
                        .forEach(cc => {
                            const guardiansd = actorFeat(cc.actor, "guardians-deflection-fighter");
                            if (guardiansd) {
                                postInChatTemplate(_uuid(guardiansd), cc);
                            }
                            const guardians_def = actorFeat(cc.actor, "guardians-deflection-swashbuckler");
                            if (guardians_def) {
                                postInChatTemplate(_uuid(guardians_def), cc);
                            }
                        })
                }
            }
        }

        //Hit by crit
        if (criticalSuccessMessageOutcome(message)) {
            if (hasReaction(message?.target?.token?.combatant)) {
                let vs = actorAction(message?.target?.actor, "vengeful-spite");
                if (vs) {
                    postInChatTemplate(_uuid(vs), message.target?.token?.combatant);
                }
                vs = actorFeat(message?.target?.actor, "furious-vengeance")
                if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && vs) {
                    postInChatTemplate(_uuid(vs), message.target.token.combatant);
                }
                const cringe = actorFeat(message?.target?.actor, "cringe");
                if (cringe) {
                    postInChatTemplate(_uuid(cringe), message.target.token.combatant);
                }
                if (adjacentEnemy(message.token, message?.target?.token, message?.target?.actor)) {
                    if (message?.item?.isMelee || message?.item?.traits?.has("unarmed")) {
                        if (message?.target?.actor?.system?.resources?.focus?.value > 0) {
                            vs = actorFeat(message?.target?.actor, "storm-retribution")
                            if (vs) {
                                postInChatTemplate(_uuid(vs), message.target.token.combatant);
                            }
                        }
                    }
                }
            }
            if (hasReaction(message?.token?.combatant)) {
                const tob = actorFeat(message?.actor, "tangle-of-battle");
                if (tob && adjacentEnemy(message.target.token, message?.token)) {
                    postInChatTemplate(_uuid(tob), message.token.combatant);
                }
                const clever_gambit = actorFeat(message?.actor, "clever-gambit");
                if (clever_gambit && hasEffect(message?.target?.actor, "effect-recall-knowledge-identified")) {
                    postInChatTemplate(_uuid(clever_gambit), message.token.combatant);
                }
            }
        }
    } else if (messageType(message, 'perception-check')) {
        if (failureMessageOutcome(message)) {
            if (hasReaction(message?.token?.combatant)) {
                var spiritual_guides = actorFeat(message?.actor, "spiritual-guides")
                if (spiritual_guides) {
                    postInChatTemplate(_uuid(spiritual_guides), message.token.combatant);
                }
            }
        }
        if (message?.flags?.pf2e?.origin?.uuid) {
            var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            if (hasReaction(origin?.actor?.combatant)) {
                if (successMessageOutcome(message)) {
                    var convincing_illusion = actorFeat(origin?.actor, "convincing-illusion");
                    if (convincing_illusion && origin?.traits?.has("illusion")) {
                        postInChatTemplate(_uuid(convincing_illusion), origin?.actor?.combatant);
                    }
                }
            }
        }
    } else if (messageType(message, 'skill-check')) {
        if (isTargetCharacter(message)) {
            if (anySuccessMessageOutcome(message)) {
                characterWithReaction()
                .filter(a=>a.actorId !== message?.target?.actor._id)
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb=>bb==="action:grapple")) {
                        if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15){
                            const liberating_step = actorAction(cc.actor, "liberating-step");
                            if (liberating_step) {
                                postTargetInChatTemplate(_uuid(liberating_step), cc);
                            }
                        }
                    }
                })
            }
        } else {
            if (messageWithTrait(message, "attack")) {
                characterWithReaction()
                    .filter(a=>a.actorId !== message?.actor?._id)
                    .forEach(cc => {
                        const fake_out = actorFeat(cc?.actor, "fake-out");
                        if (fake_out) {
                            const weapon = hasLoadedFirearmOrCrossbow(cc.actor);
                            if (weapon.length > 0) {
                                const range = Math.max(...weapon.map(a => a.item.rangeIncrement));
                                if (getEnemyDistance(cc?.token, message.target.token) <= range) {
                                    postInChatTemplate(_uuid(fake_out), cc);
                                }
                            }
                        }
                    })
            }
        }

        if (hasReaction(message?.token?.combatant)) {
            if (failureMessageOutcome(message)) {
                var spiritual_guides = actorFeat(message?.actor, "spiritual-guides");
                if (spiritual_guides) {
                    postInChatTemplate(_uuid(spiritual_guides), message.token.combatant);
                }
            }
            if (criticalFailureMessageOutcome(message)) {
                const squawk = actorFeat(message?.actor, "squawk");
                if (squawk
                    && ["deception","diplomacy","intimidation"].some(a=>message.flags?.pf2e?.context?.domains?.includes(a))
                    && !message?.target?.actor?.system?.traits?.value?.includes("tengu")
                ) {
                    postInChatTemplate(_uuid(squawk), message.token.combatant);
                }
            }
        }

    } else if (messageType(message, 'damage-roll')) {
        if (hasReaction(message.actor.combatant)) {
            const cleave = actorFeat(message.actor, "cleave");
            if (cleave && message?.item?.isMelee) {
                if (message.target.actor.system.attributes.hp.value <= parseInt(message.content)) {

                    const adjEnemies = game.combat.turns.filter(a => !isActorCharacter(a.actor))
                        .filter(a => a.actorId !== message?.target?.actor._id)
                        .filter(a => adjacentEnemy(message.target.token, a.token))
                        .filter(a => a.actor.system.attributes.hp.value > 0);

                    if (adjEnemies.length > 0) {
                        postInChatTemplate(_uuid(cleave), message.actor.combatant);
                    }
                }
            }
        }

        if(hasReaction(message?.target?.token?.combatant, "shield-block")) {
            var dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);
            if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length > 0) {
                const sblock = actorFeat(message?.target?.actor, "shield-block");
                if (sblock && hasEffect(message.target.actor, "effect-raise-a-shield")) {
                    postInChatTemplate(_uuid(sblock), message.target.token.combatant, "shield-block");
                }
            }
        }
        if(hasReaction(message?.target?.token?.combatant)) {
            const electric_counter = actorFeat(message?.target?.actor, "electric-counter");
            if (electric_counter && hasEffect(message?.target?.actor, "stance-wild-winds-stance")) {
                postInChatTemplate(_uuid(electric_counter), message?.target?.token?.combatant);
            }
            const all_in = actorFeat(message?.target?.actor, "all-in-my-head");
            if (all_in && !message?.item?.traits.has("death")) {
                postInChatTemplate(_uuid(all_in), message.target.token.combatant);
            }
            const unexpecteds = actorFeat(message?.target?.actor, "unexpected-shift");
            if (unexpecteds) {
                postInChatTemplate(_uuid(unexpecteds), message.target.token.combatant);
            }

            var dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);
            if (dTypes.filter(a=> a=== "sonic").length > 0) {
                const resounding = actorFeat(message?.target?.actor, "resounding-finale");
                if (resounding) {
                    postInChatTemplate(_uuid(resounding), message.target.token.combatant);
                }
                const reverberate = actorFeat(message?.target?.actor, "reverberate");
                if (reverberate && message.item.type === "spell") {
                    postInChatTemplate(_uuid(reverberate), message.target.token.combatant);
                }
            }

            const verdantp = actorFeat(message?.target?.actor, "verdant-presence");
            if (verdantp) {
                postInChatTemplate(_uuid(verdantp), message.target.token.combatant);
            }
            const amulets_abeyance = actorAction(message?.target?.actor, "amulets-abeyance");
            if (amulets_abeyance && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                postInChatTemplate(_uuid(amulets_abeyance), message?.target?.token?.combatant);
            }

            if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length > 0) {
                const sarmor = actorFeat(message?.target?.actor, "sacrifice-armor");
                if (sarmor) {
                    postInChatTemplate(_uuid(sarmor), message.target.token.combatant);
                }
            }

            if (dTypes.filter(a=> ["acid", "cold", "electricity", "fire", 'poison'].includes(a)).length > 0) {
                const reactivet = actorFeat(message?.target?.actor, "reactive-transformation");
                if (reactivet) {
                    postInChatTemplate(_uuid(reactivet), message.target.token.combatant);
                }
            }
            const embracethepain = actorFeat(message?.target?.actor, "embrace-the-pain");
            if (message?.item?.isMelee && embracethepain) {
                postInChatTemplate(_uuid(embracethepain), message.target.token.combatant);
            }
            if (adjacentEnemy(message.target.token, message.token)) {
                const rg = actorAction(message?.target?.actor, "reactive-gnaw");
                if (rg && message?.item?.system?.damage?.damageType === "slashing") {
                    postInChatTemplate(_uuid(rg), message.target.token.combatant);
                }
                const rc = actorFeat(message?.target?.actor, "retaliatory-cleansing");
                if (rc) {
                    if (actorHeldWeapon(message?.target?.actor).filter(a=>a.slug==="holy-water" || (a.weaponTraits.filter(b=>b.name === "bomb").length > 0 && a.weaponTraits.filter(b=>b.name === "positive").length > 0)).length > 0) {
                        postInChatTemplate(_uuid(rc), message.target.token.combatant);
                    }
                }
            //15 ft damage you
            } else if (getEnemyDistance(message?.target.token, message.token) <= 15) {
                const iron_command = actorAction(message?.target?.actor, "iron-command");
                if (iron_command) {
                    postInChatTemplate(_uuid(iron_command), message.target.token.combatant);
                }
                const selfish_shield = actorAction(message?.target?.actor, "selfish-shield");
                if (selfish_shield) {
                    postInChatTemplate(_uuid(selfish_shield), message.target.token.combatant);
                }
                const destructive_vengeance = actorAction(message?.target?.actor, "destructive-vengeance");
                if (destructive_vengeance) {
                    postInChatTemplate(_uuid(destructive_vengeance), message.target.token.combatant);
                }
            }
        }
        //ally damaged
        (isActorCharacter(message?.target?.actor) ? characterWithReaction() : npcWithReaction())
        .filter(a=>a.actorId !== message?.target?.actor._id)
        .forEach(cc => {
            if (getEnemyDistance(message.target.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                const gor = actorAction(cc.actor, "glimpse-of-redemption");
                if (gor) {
                    postTargetInChatTemplate(_uuid(gor), cc);
                }
                const liberatingstep = actorAction(cc.actor, "liberating-step");
                if (liberatingstep) {
                    postTargetInChatTemplate(_uuid(liberatingstep), cc);
                }
                const retributivestrike = actorAction(cc.actor, "retributive-strike");
                if (retributivestrike) {
                    postTargetInChatTemplate(_uuid(retributivestrike), cc);
                }
            }
            if (getEnemyDistance(message.target.token, cc.token) <= 15 && hasEffect(message.actor, "effect-exploit-vulnerability")) {
                const aab = actorAction(cc.actor, "amulets-abeyance");
                if (aab) {
                    postTargetInChatTemplate(_uuid(aab), cc);
                }
            }
            if (getEnemyDistance(message.target.token, cc.token) <= 30) {
                const dod = actorAction(cc.actor, "denier-of-destruction");
                if (dod) {
                    postTargetInChatTemplate(_uuid(dod), cc);
                }
            }
        })
    } else if (messageType(message, "saving-throw")) {
        var origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
        if (hasReaction(message?.token?.combatant)) {
            const charmedlife = actorFeat(message.actor, "charmed-life");
            if (charmedlife) {
                if (message?.flags?.pf2e?.modifiers?.find(a=>a.slug==="charmed-life" && a.enabled)) {
                    decreaseReaction(message.token.combatant)
                    reactionWasUsedChat(_uuid(charmedlife), message.token.combatant);
                }
            }
            if (anyFailureMessageOutcome(message)) {
                const poc = actorFeat(message.actor, "premonition-of-clarity");
                if (poc && origin?.traits?.has("mental")) {
                    postInChatTemplate(_uuid(poc), message.token.combatant);
                }
                const gat = actorFeat(message.actor, "grit-and-tenacity");
                if (gat) {
                    postInChatTemplate(_uuid(gat), message.token.combatant);
                }
                var emergency_targe = actorFeat(message?.actor, "emergency-targe")
                if (emergency_targe && message?.flags?.pf2e?.origin?.type  === 'spell') {
                    postInChatTemplate(_uuid(emergency_targe), message.token.combatant);
                }
            }
            if (criticalFailureMessageOutcome(message)) {
                const schadenfreude = actorSpell(message.actor, "schadenfreude");
                if (schadenfreude) {
                    postInChatTemplate(_uuid(schadenfreude), message.token.combatant)
                }
            }

            const rb__ = actorAction(message?.actor, "ring-bell");
            if (rb__
                    && getEnemyDistance(message.token, origin?.actor?.token)<=30
                    && hasEffect(origin?.actor, "effect-exploit-vulnerability")) {
                    postInChatTemplate(_uuid(rb__), message?.actor?.combatant);
            }

        }
        if (isActorCharacter(message?.actor)) {
            characterWithReaction()
            .filter(a=>a.actorId !== message?.actor._id)
            .forEach(cc => {
                const rb = actorAction(cc?.actor, "ring-bell");
                if (rb
                    && getEnemyDistance(cc?.token, origin?.actor?.token)<=30
                    && hasEffect(origin?.actor, "effect-exploit-vulnerability")
                ) {
                    postTargetInChatTemplate(_uuid(rb), cc);
                }
            })
        }
        if (hasReaction(origin?.actor?.combatant)) {
            if (successMessageOutcome(message)) {
                var convincing_illusion = actorFeat(origin?.actor, "convincing-illusion");
                if (convincing_illusion && origin?.traits?.has("illusion")) {
                    postInChatTemplate(_uuid(convincing_illusion), origin?.actor?.combatant);
                }
            }
        }
    }
});




function sendNotification(_user, token, feat) {
    const text = game.i18n.format("pf2e-reaction.notify", {uuid: feat.name, name: token.name});
    ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
}

function checkSendNotification(_user, token, featNames) {
    actorFeats(token.actor, featNames).forEach(feat => {
        sendNotification(_user, token, feat);
    })
}

Hooks.on("targetToken", (_user, token, isTargeted, opts) => {
    if (Settings.notification && game?.combats?.active && isTargeted && hasReaction(token?.combatant)) {
        if (game.user.isGM || token.combatant.players.find(a=>a.id===game.user.id)) {
            if (isActorCharacter(token?.actor)) {
                var nd = actorFeat(token.actor, "nimble-dodge");
                if (nd && !hasCondition(token.actor, "encumbered")) {
                    sendNotification(_user, token, nd);
                }
                checkSendNotification(_user, token,
                ["airy-step", "farabellus-flip", "hit-the-dirt",
                 "you-failed-to-account-for-this", "foresee-danger", "deflect-arrow"]);

                const pir = actorFeat(token.actor, "pirouette");
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
                .filter(a=>a.tokenId !== token.id)
                .filter(a=>a.actor.auras.size > 0)
                .forEach(cc => {
                    const radius = Math.max(...Array.from(cc.actor.auras.values()).map(a => a.radius));
                    if (getEnemyDistance(token.document, cc.token) <= radius) {
                        const ed = actorFeat(cc.actor, "everdistant-defense");
                        const text = game.i18n.format("pf2e-reaction.notify", {uuid: ed.name, name: cc.name});
                        ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
                    }
                })
            } else {
                var nd = actorAction(token.actor, "nimble-dodge");
                if (nd && !hasCondition(token.actor, "encumbered")) {
                    sendNotification(_user, token, nd);
                }
                const as = actorAction(token.actor, "airy-step");
                if (as) {
                    sendNotification(_user, token, as);
                }
            }
        }
    }
});
