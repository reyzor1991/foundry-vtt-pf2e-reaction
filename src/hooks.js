const deflect_arrow = "Compendium.pf2e.feats-srd.Item.sgaqlDFTVC7Ryurt"
const crane_flutter = "Compendium.pf2e.feats-srd.Item.S14S52HjszTgIy4l"
const hit_the_dirt = "Compendium.pf2e.feats-srd.Item.6LFBPpPPJjDq07fg"

const reactionWasUsedEffect = "Compendium.pf2e-reaction.reaction-effects.Item.Dvi4ewimR9t5723U"
const reactionsEffect = "Compendium.pf2e-reaction.reaction-effects.Item.Bq05rfSWsBjNzjwq"
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

async function updateInexhaustibleCountermoves(combatant) {
    if (!combatant) {
        return
    }
    if (isNPC(combatant.actor)) {
        await setInexhaustibleCountermoves(game.combat.combatants.filter(a => isActorCharacter(a.actor)), 1)
    } else {
        await setInexhaustibleCountermoves(game.combat.combatants.filter(a => isActorCharacter(a.actor)), 0)
    }
}

async function setInexhaustibleCountermoves(combatants, val) {
    combatants.forEach(cc => {
        if (actorFeat(cc.actor, "inexhaustible-countermoves")) {
            cc.setFlag(moduleName, 'inexhaustible-countermoves', val);
        }
    })
}

async function updateCombatantReactionState(combatant, newState, actionName = undefined) {
    if (!combatant) {
        return
    }
    if (!newState) {
        if (!hasReaction(combatant, actionName) && isGM()) {
            ui.notifications.warn(`${combatant?.actor?.name} does not have reaction anymore`);
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
            if (combatant.getFlag(moduleName, 'tactical-reflexes')) {
                await combatant.setFlag(moduleName, 'tactical-reflexes', combatant.getFlag(moduleName, 'tactical-reflexes') - 1);
                return;
            }
            if (combatant.getFlag(moduleName, 'inexhaustible-countermoves')) {
                await combatant.setFlag(moduleName, 'inexhaustible-countermoves', combatant.getFlag(moduleName, 'inexhaustible-countermoves') - 1);
                return;
            }
        } else if (actionName === "reactive-strike") {
            if (combatant.getFlag(moduleName, 'triple-opportunity')) {
                await combatant.setFlag(moduleName, 'triple-opportunity', combatant.getFlag(moduleName, 'triple-opportunity') - 1);
                return;
            }
            if (combatant.getFlag(moduleName, 'combat-reflexes')) {
                await combatant.setFlag(moduleName, 'combat-reflexes', combatant.getFlag(moduleName, 'combat-reflexes') - 1);
                return;
            }
            if (combatant.getFlag(moduleName, 'tactical-reflexes')) {
                await combatant.setFlag(moduleName, 'tactical-reflexes', combatant.getFlag(moduleName, 'tactical-reflexes') - 1);
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

        if (combatant.getFlag(moduleName, 'hydra-heads')) {
            await combatant.setFlag(moduleName, 'hydra-heads', combatant.getFlag(moduleName, 'hydra-heads') - 1);
        } else if (combatant.getFlag(moduleName, 'state')) {
            await combatant.setFlag(moduleName, 'state', false);
        }
    } else {
        if (isNPC(combatant.actor)) {
            if (actorAction(combatant.actor, "triple-opportunity")) {
                await combatant.setFlag(moduleName, 'triple-opportunity', 1);
            }
            let heads = hasEffect(combatant.actor, "effect-hydra-heads")
            if (heads) {
                if (heads?.system?.badge?.value > 1) {
                    await combatant.setFlag(moduleName, 'hydra-heads', (heads?.system?.badge?.value - 1));
                } else {
                    await combatant.setFlag(moduleName, 'hydra-heads', 0);
                }
            }
        } else {
            if (actorFeat(combatant.actor, "combat-reflexes")) {
                await combatant.setFlag(moduleName, 'combat-reflexes', 1);
            }
            if (actorFeat(combatant.actor, "tactical-reflexes")) {
                await combatant.setFlag(moduleName, 'tactical-reflexes', 1);
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
        count += combatant.getFlag(moduleName, 'tactical-reflexes') ?? 0;
        count += combatant.getFlag(moduleName, 'inexhaustible-countermoves') ?? 0;

        count += combatant.getFlag(moduleName, 'reflexive-riposte') ?? 0;

        count += combatant.getFlag(moduleName, 'quick-shield-block') ?? 0;
        count += combatant.getFlag(moduleName, 'hydra-heads') ?? 0;
    }
    return count;
}

function countReaction(combatant, actionName = undefined) {
    let count = 0;
    if (combatant) {
        if (combatant.getFlag(moduleName, 'state')) {
            count += 1;
        }

        count += combatant.getFlag(moduleName, 'hydra-heads') ?? 0;

        if (actionName === "attack-of-opportunity") {
            count += combatant.getFlag(moduleName, 'triple-opportunity') ?? 0;
            count += combatant.getFlag(moduleName, 'combat-reflexes') ?? 0;
            count += combatant.getFlag(moduleName, 'tactical-reflexes') ?? 0;
            count += combatant.getFlag(moduleName, 'inexhaustible-countermoves') ?? 0;
        } else if (actionName === "reactive-strike") {
            count += combatant.getFlag(moduleName, 'triple-opportunity') ?? 0;
            count += combatant.getFlag(moduleName, 'combat-reflexes') ?? 0;
            count += combatant.getFlag(moduleName, 'tactical-reflexes') ?? 0;
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

function hasReaction(combatant, actionName = undefined) {
    return countReaction(combatant, actionName) > 0
        && !hasCondition(combatant.actor, "confused")
        && !hasCondition(combatant.actor, "petrified")
        && !hasCondition(combatant.actor, "unconscious")
        && !hasCondition(combatant.actor, "stunned");
}

function characterWithReaction(actionName = undefined) {
    return game.combat.turns.filter(a => isActorCharacter(a.actor)).filter(a => hasReaction(a, actionName));
}

function npcWithReaction(actionName = undefined) {
    return game.combat.turns.filter(a => !isActorCharacter(a.actor)).filter(a => hasReaction(a, actionName));
}

function hasCondition(actor, con) {
    return actor && actor?.itemTypes?.condition?.find((c => c.type === "condition" && con === c.slug))
}

function hasEffectBySource(actor, eff) {
    return actor?.itemTypes?.effect?.find((c => eff === c.sourceId))
}

function hasEffectStart(actor, eff) {
    return actor?.itemTypes?.effect?.find((c => c?.slug?.startsWith(eff)))
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

async function postTargetInChatTemplate(uuid, combatant) {
    await postInChatTemplate(uuid, combatant, undefined, false, true)
}

async function postInChatTemplate(uuid, combatant, actionName = undefined, skipDeath = false, needTarget = false) {
    if (!skipDeath) {
        if ((combatant?.actor?.system?.attributes?.hp?.value <= 0 && combatant?.actor?.system?.attributes?.hp?.temp <= 0)
            || hasCondition(combatant?.actor, "unconscious")
            || hasCondition(combatant?.actor, "dying")
        ) {
            return
        }
    }

    let text = game.i18n.format("pf2e-reaction.ask", {uuid: uuid, name: combatant.token.name});
    let content = await foundry.applications.handlebars.renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {
        text: text,
        target: needTarget
    });
    const check = {
        cId: combatant._id,
        uuid: uuid,
        actionName: actionName
    };

    let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    if (combatant.players) {
        whispers = whispers.concat(combatant.players.map((u) => u.id));
    }

    if (game.messages.size > 0 && content === game.messages.contents[game.messages.size - 1].content) {
        check['count'] = 2
        check['content'] = content
        check['reactions'] = countReaction(combatant, actionName)
        check['needTarget'] = needTarget

        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid: uuid, name: combatant.token.name, count: 2});
        content = await foundry.applications.handlebars.renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {
            text: text,
            target: needTarget
        });

        updateMessage(game.messages.contents[game.messages.size - 1], {
            'content': content,
            'flags.pf2e-reaction': check
        })
    } else if (game.messages.size > 0 && content === game.messages.contents[game.messages.size - 1]?.getFlag(moduleName, 'content')) {
        const count = game.messages.contents[game.messages.size - 1]?.getFlag(moduleName, "count") + 1;
        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid: uuid, name: combatant.token.name, count: count});
        content = await foundry.applications.handlebars.renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {
            text: text,
            target: needTarget
        });

        updateMessage(game.messages.contents[game.messages.size - 1], {
            'content': content,
            'flags.pf2e-reaction.count': count,
            'flags.pf2e-reaction.reactions': countReaction(combatant, actionName)
        })
    } else {
        let data = {
            flavor: '',
            user: null,
            speaker: {
                scene: null,
                actor: null,
                token: null,
                alias: "System"
            },
            style: CONST.CHAT_MESSAGE_STYLES.OOC,
            content: content,
            whisper: whispers,
            flags: {'pf2e-reaction': check}
        };

        createMessage(data, combatant?.isOwner)
    }
}

async function checkRingmasterIntroduction(combatant) {
    if (isActorCharacter(combatant?.actor)) {
        characterWithReaction()
            .filter(a => a.tokenId !== combatant.tokenId)
            .filter(a => hasReaction(a))
            .forEach(cc => {
                const ringmasters_introduction = actorFeat(cc.actor, "ringmasters-introduction");
                if (ringmasters_introduction) {
                    postInChatTemplate(_uuid(ringmasters_introduction), cc);
                }
            })
    }
}

function hasLoadedFirearmOrCrossbow(actor) {
    return actor.system?.actions?.filter(a => a.ready).filter(a => a?.item?.baseType?.includes("crossbow") || a?.item?.group === "firearm").filter(a => a.item.ammo)
}

function spellWithTrait(spell, trait) {
    return spell?.traits?.has(trait) || spell?.castingTraits?.includes(trait)
}

function messageWithTrait(message, trait) {
    return message?.item?.system?.traits?.value?.includes(trait)
        || message?.item?.castingTraits?.includes(trait)
        || message?.flags?.pf2e?.context?.traits?.find(a => a.name === trait)
}

function messageWithAnyTrait(message, traits) {
    if (messageType(message, "saving-throw")) {
        return false
    }
    if (messageType(message, "damage-roll")) {
        return false
    }
    if (messageType(message, "damage-taken")) {
        return false
    }
    return traits.some(a => messageWithTrait(message, a))
}

function hasExploitVulnerabilityEffect(actor, thaum) {
    if (hasEffect(actor, "effect-exploit-vulnerability")) {
        return true;
    }

    const mwtEff = hasEffectStart(actor, "mortal-weakness-target")
    if (mwtEff && mwtEff?.flags['pf2e-thaum-vuln']?.['EffectOrigin'] === thaum.uuid) {
        if (thaum.flags['pf2e-thaum-vuln']?.['primaryEVTarget'] === actor.uuid) {
            return true;
        }
    }
    const patEff = hasEffectStart(actor, "personal-antithesis-target")
    if (patEff && patEff?.flags['pf2e-thaum-vuln']?.['EffectOrigin'] === thaum.uuid) {
        if (thaum.flags['pf2e-thaum-vuln']?.['primaryEVTarget'] === actor.uuid) {
            return true;
        }
    }
    return false;
}

async function decreaseReaction(combatant, actionName = undefined) {
    if (!combatant) {
        return
    }
    await updateCombatantReactionState(combatant, false, actionName);
    if (Settings.addReactionEffect && countAllReaction(combatant) <= 1) {
        await setReactionEffectToActor(combatant.actor, combatant.token, reactionWasUsedEffect);
    }
    if (Settings.allReactionEffect) {
        let curr = hasEffectBySource(combatant.actor, reactionsEffect)
        if (curr) {
            curr.update({"system.badge.value": countAllReaction(combatant)})
        }
    }
}

async function setReactionEffectToActor(actor, token, eff) {
    let curr = hasEffectBySource(actor, reactionWasUsedEffect)
    if (curr) {
        await curr.increase();
        return
    }

    const source = (await fromUuid(eff)).toObject();
    if (game.settings.get(moduleName, "customReactionIcon")) {
        source.img = game.settings.get(moduleName, "customReactionIcon")
    }

    if (game.combat.combatant.initiative <= actor.combatant.initiative) {
        source.system.duration.value = 1;
    } else {
        source.system.duration.value = 0;
    }

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
        const skipReaction = mes.getFlag(moduleName, "skipReaction");
        const needTarget = mes.getFlag(moduleName, "needTarget") ?? false;
        if (t) {
            const combatant = game.combat?.turns?.find(a => a._id === t);
            if (combatant) {
                if (!skipReaction) {
                    await decreaseReaction(combatant, actionName);
                }
                if (reactions > 1 && count > 1) {
                    let text = game.i18n.format("pf2e-reaction.ask", {uuid: uuid, name: combatant.token.name});
                    if (count - 1 > 1) {
                        text = game.i18n.format("pf2e-reaction.askMultiple", {uuid: uuid, name: combatant.token.name, count: count - 1});
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

                    if (mes.permission === 3 || game.user?.isGM) {
                        await mes.update(data, {noHook: true})
                    } else {
                        socketlibSocket._sendRequest("updateItem", [mes.uuid, data], 0)
                    }
                } else {
                    if (mes.permission === 3 || game.user?.isGM) {
                        await mes.delete()
                    } else {
                        socketlibSocket._sendRequest("deleteItem", [mes.uuid], 0)
                    }
                }
                if (Settings.postMessage && uuid) {
                    await (await fromUuid(uuid))?.toMessage({}, {rollMode: 'blindroll'})
                }
            }
        }
    }
});

$(document).on('click', '.reaction-cancel', async function () {
    const mid = $(this).parent().parent().parent().data('message-id');
    if (mid) {
        const mes = game.messages.get(mid);
        if (mes.permission === 3 || game.user?.isGM) {
            await mes.delete()
        } else {
            socketlibSocket._sendRequest("deleteItem", [game.messages.get(mid)?.uuid], 0)
        }
    }
});

Hooks.on('pf2e.startTurn', async (_combatant) => {
    await updateCombatantReactionState(_combatant, true);
    await updateInexhaustibleCountermoves(_combatant);
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
        await postInChatTemplate(_uuid(sps), _combatant);
    }
    if (combat.round === 1) {
        await checkRingmasterIntroduction(_combatant)
    }

    if (Settings.allReactionEffect) {
        setTimeout(async function () {
            let eff = hasEffectBySource(_combatant.actor, reactionsEffect)
            if (!game.settings.get("pf2e", "automation.removeExpiredEffects") && eff) {
                await eff.update({"system.start.value": game.time.worldTime})
            } else {
                const source = (await fromUuid(reactionsEffect)).toObject();
                source.system.badge.value = countAllReaction(_combatant)
                if (game.settings.get(moduleName, "customReactionIcon")) {
                    source.img = game.settings.get(moduleName, "customReactionIcon")
                }

                await _combatant.actor.createEmbeddedDocuments("Item", [source]);
            }

        }, 300)
    }
});

Hooks.on('deleteCombat', async (combat, a, b, c) => {
    if (!isGM()) {
        return;
    }
    combat?.turns?.flatMap((combatant) => {
        return combatant?.actor?.itemTypes?.effect
            ?.filter(i => i.sourceId === reactionsEffect || i.sourceId === reactionWasUsedEffect)
    }).forEach((eff) => {
        eff.delete()
    })
});

Hooks.on('combatStart', async combat => {
    const availableReactions = [];

    const keys = Object.keys(allReactionsMap)

    combat.turns.forEach(cc => {
        updateCombatantReactionState(cc, true)

        availableReactions.push(...keys.filter(k => actorAction(cc.actor, k) || actorFeat(cc.actor, k) || actorSpell(cc.actor, k)));
    });

    await updateInexhaustibleCountermoves(combat.turns[0]);
    await checkRingmasterIntroduction(combat.turns[0]);

    await combat.setFlag(moduleName, "availableReactions", availableReactions)
});

Hooks.on('createCombatant', async (combatant, test) => {
    if (game.user?.isGM) {
        updateCombatantReactionState(combatant, true)
    }
    if (game.combat?.started) {
        const availableReactions = game.combat.getFlag(moduleName, "availableReactions") ?? [];
        availableReactions.push(...Object.keys(allReactionsMap).filter(k => actorAction(combatant.actor, k) || actorFeat(combatant.actor, k) || actorSpell(combatant.actor, k)));

        await game.combat.setFlag(moduleName, "availableReactions", availableReactions)
    }
});

Hooks.on('createItem', async (effect, data, id) => {
    if (id !== game.userId) {
        return
    }
    const currCom = game.combat?.turns?.find(a => a?.actorId === effect?.actor?.id);
    if (!currCom) {
        return
    }
    if ("effect-raise-a-shield" === effect.slug && isActorCharacter(effect.actor)) {
        const withShield = game.combat?.turns?.filter(a => isActorCharacter(a.actor))
            .filter(a => hasEffect(a.actor, "effect-raise-a-shield"));
        const shield_wall = actorFeat(currCom.actor, "shield-wall");
        if (hasReaction(currCom) && shield_wall) {
            const adjacent = withShield
                .filter(a => adjacentEnemy(a.token, currCom.token));
            if (adjacent.length > 1) {
                await postInChatTemplate(_uuid(shield_wall), currCom);
            }
        }
        withShield.filter(a => hasReaction(a))
            .filter(a => a.id !== currCom.id)
            .filter(a => adjacentEnemy(a.token, currCom.token))
            .forEach(cc => {
                const shield_wall_ = actorFeat(a.actor, "shield-wall");
                if (shield_wall_) {
                    postInChatTemplate(_uuid(shield_wall_), cc);
                }
            });
    } else if ('frightened' === effect.slug) {
        game.combat?.turns
            .filter(c => c !== currCom)
            .filter(c => getEnemyDistance(c.token, effect.actor.getActiveTokens(true, true)[0]) <= 60)
            .forEach(cc => {
                const invigorating = actorActionBySource(cc.actor, 'Compendium.pf2e.actionspf2e.Item.Ul4I0ER6pj3U5eAk')
                if (invigorating) {
                    postInChatTemplate(_uuid(invigorating), cc);
                }
            });
    }
});

Hooks.on('preUpdateToken', (tokenDoc, data, id) => {
    if (tokenDoc?.actor?.isDead || !game?.combats?.active) {
        return
    }
    if (!data.x && !data.y) {
        return;
    }
    if (data.x === tokenDoc.x && data.y === tokenDoc.y) {
        return
    }
    const message = {
        "actor": tokenDoc.actor,
        "token": tokenDoc,
        "item": createTrait("move")
    };

    if (game.combat) {
        if (game?.skipMoveTrigger?.[game.userId]) {
            return
        }

        const availableReactions = game.combat.getFlag(moduleName, 'availableReactions') ?? []

        if (availableReactions.includes('courageous-opportunity')) {
            courageousOpportunity(message);
        }
        if (availableReactions.includes('implements-interruption')) {
            implementsInterruption(message);
        }
        if (availableReactions.includes('attack-of-opportunity')) {
            attackOfOpportunity(message);
        }
        if (availableReactions.includes('reactive-strike')) {
            reactiveStrike(message);
        }
        if (availableReactions.includes('shoving-sweep')) {
            shovingSweep(message);
        }
        if (availableReactions.includes('stand-still')) {
            standStill(message);
        }
        if (availableReactions.includes('no-escape')) {
            noEscape(message);
        }
        if (availableReactions.includes('verdistant-defense')) {
            verdistantDefense(message);
        }
    }

    handleHomebrewMessages(message)
});

function createTrait(t) {
    return {"system": {"traits": {"value": [t]}}};
}

Hooks.on('preCreateChatMessage', async (message, user, _options) => {
    if (!game?.combats?.active) {
        return
    }
    if (message?.flags?.pf2e?.context?.options?.includes('ignore-reaction')) {
        return
    }

    if (messageType(message, 'damage-roll') && hasReaction(message?.target?.token?.combatant)) {
        if (Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage})
            .map(a => a?.damageType).find(a => a === "slashing")
        ) {
            const ImNotCrying = actorActionBySource(message?.target?.actor, "Item.ncKVztM6EL4i98dL");
            if (ImNotCrying && adjacentEnemy(message.target?.token, message.token)) {
                await postInChatTemplate(_uuid(ImNotCrying), message.target?.token.combatant);
            }
        }
    }

    if (game.combat) {
        new Set(Object.values(game.combat.getFlag(moduleName, 'availableReactions') ?? [])).forEach(func => {
            if (allReactionsMap[func]) {
                allReactionsMap[func].call(this, message);
            }
        })
    }
});

function sendNotification(_user, token, feat) {
    const text = game.i18n.format("pf2e-reaction.notify", {uuid: feat.name, name: token.name});
    ui.notifications.info(`${_user.name} targets ${token.name}. ${text}`);
}

function checkSendNotification(_user, token, featNames) {
    actorFeats(token.actor, featNames).forEach(feat => {
        sendNotification(_user, token, feat);
        postInChatTemplate(_uuid(feat), token?.combatant);
    })
}

Hooks.on("targetToken", (_user, token, isTargeted) => {
    if (Settings.notification && game?.combats?.active && isTargeted && hasReaction(token?.combatant)) {
        if (isGM() || token.combatant.players.find(a => a.id === game.user.id)) {
            if (isActorCharacter(token?.actor)) {
                const nd = actorFeat(token.actor, "nimble-dodge");
                if (nd && !hasCondition(token.actor, "encumbered")) {
                    sendNotification(_user, token, nd);
                    postInChatTemplate(_uuid(nd), token?.combatant);
                }
                const fd = actorFeat(token.actor, "flashy-dodge");
                if (fd && !hasCondition(token.actor, "encumbered")) {
                    sendNotification(_user, token, fd);
                    postInChatTemplate(_uuid(fd), token?.combatant);
                }

                checkSendNotification(_user, token,
                    ["airy-step", "farabellus-flip", "hit-the-dirt",
                        "you-failed-to-account-for-this", "foresee-danger", "deflect-arrow",
                        "nights-warning", "blood-rising", "inked-panoply", "foresee-danger",
                        "hunters-defense", "you-failed-to-account-for-this", "lucky-escape",
                        "wood-ward", "deflecting-cloud", "reactive-charm", "instinctive-obfuscation"]);

                const rd = actorFeat(token.actor, "reflective-defense");
                if (rd) {
                    sendNotification(_user, token, rd);
                    postTargetInChatTemplate(_uuid(rd), token?.combatant);
                }

                const ds = actorFeat(token.actor, "disarming-smile");
                if (ds) {
                    sendNotification(_user, token, ds);
                    postTargetInChatTemplate(_uuid(ds), token?.combatant);
                }

                const pir = actorFeat(token.actor, "pirouette");
                if (pir && hasEffect(token.actor, "stance-masquerade-of-seasons-stance")) {
                    sendNotification(_user, token, pir);
                    postInChatTemplate(_uuid(pir), token?.combatant);
                }
                const rs = actorFeat(token.actor, "reactive-shield");
                if (rs && !hasEffect(token.actor, "effect-raise-a-shield")) {
                    sendNotification(_user, token, rs);
                    postInChatTemplate(_uuid(rs), token?.combatant);
                }
                const cf = actorFeat(token.actor, "crane-flutter");
                if (cf && hasEffect(token.actor, "stance-crane-stance")) {
                    sendNotification(_user, token, cf);
                    postInChatTemplate(_uuid(cf), token?.combatant);
                }

                characterWithReaction()
                    .filter(a => a.tokenId !== token.id)
                    .filter(a => a.actor.auras.size > 0)
                    .forEach(cc => {
                        const radius = Math.max(...Array.from(cc.actor.auras.values()).map(a => a.radius));
                        if (getEnemyDistance(token.document, cc.token) <= radius) {
                            const ed = actorFeat(cc.actor, "everdistant-defense");
                            if (ed) {
                                sendNotification(_user, token, ed)
                                postInChatTemplate(_uuid(ed), token?.combatant);
                            }
                        }
                    })
            } else {
                const nd = actorAction(token.actor, "nimble-dodge");
                if (nd && !hasCondition(token.actor, "encumbered")) {
                    sendNotification(_user, token, nd);
                    postInChatTemplate(_uuid(nd), token?.combatant);
                }
                const as = actorAction(token.actor, "airy-step");
                if (as) {
                    sendNotification(_user, token, as);
                    postInChatTemplate(_uuid(as), token?.combatant);
                }
                const es = actorAction(token.actor, "ectoplasmic-shield");
                if (es) {
                    sendNotification(_user, token, es);
                    postInChatTemplate(_uuid(es), token?.combatant);
                }
            }
        }
    }
});
