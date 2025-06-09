async function youreNext(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0) {
            const youreNext = actorFeat(game.combat.combatant?.actor, "youre-next");
            if (youreNext) {
                if (game.combat.combatant?.actor?.skills?.intimidation?.rank === 4) {
                    let text = game.i18n.format("pf2e-reaction.ask", {
                        uuid: _uuid(youreNext),
                        name: game.combat.combatant?.token.name
                    });

                    let content = await foundry.applications.handlebars.renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", {
                        text: text,
                        target: false
                    });

                    let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
                    if (game.combat.combatant.players) {
                        whispers = whispers.concat(game.combat.combatant.players.map((u) => u.id));
                    }

                    const check = {
                        cId: game.combat.combatant._id,
                        uuid: _uuid(youreNext),
                        skipReaction: true,
                    };

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

                    if (foundry.utils.isNewerVersion(game.version, 12)) {
                        data.style = CONST.CHAT_MESSAGE_STYLES.OOC;
                    } else {
                        data.type = CONST.CHAT_MESSAGE_TYPES.OOC;
                    }

                    ChatMessage.create(data).then(m => {
                        const tt = game.settings.get("pf2e-reaction", "timeoutDelete")
                        if (tt > 0) {
                            setTimeout(function () {
                                m.delete()
                            }, tt * 1000)
                        }
                    });
                } else {
                    await postInChatTemplate(_uuid(youreNext), game.combat.combatant);
                }
            }
        }
    }
}

async function ringBell(message) {
    if (messageType(message, "spell-attack-roll") || messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const ring_bell = actorAction(message?.target?.actor, "ring-bell");
            if (ring_bell
                && getEnemyDistance(message.token, message.target?.token) <= 30
                && hasExploitVulnerabilityEffect(message.actor, message?.target?.actor)) {
                await postInChatTemplate(_uuid(ring_bell), message.target?.token.combatant);
            }
        }
        if (isTargetCharacter(message)) {
            characterWithReaction()
                .forEach(cc => {
                    if (!hasExploitVulnerabilityEffect(message.actor, cc.actor)) {
                        return;
                    }
                    const ring_bell_ = actorAction(cc?.actor, "ring-bell");
                    if (ring_bell_ && getEnemyDistance(cc?.token, message.token) <= 30) {
                        postInChatTemplate(_uuid(ring_bell_), cc);
                    }
                })
        }
    } else if (messageType(message, "saving-throw")) {
        const origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
        if (origin && hasReaction(message?.token?.combatant)) {
            const rb__ = actorAction(message?.actor, "ring-bell");
            if (rb__
                && getEnemyDistance(message.token, origin?.actor?.token) <= 30
                && hasExploitVulnerabilityEffect(origin?.actor, message.actor)
            ) {
                await postInChatTemplate(_uuid(rb__), message?.actor?.combatant);
            }
        }
        if (isActorCharacter(message?.actor)) {
            characterWithReaction()
                .filter(a => a.actorId !== message?.actor._id)
                .forEach(cc => {
                    const rb = actorAction(cc?.actor, "ring-bell");
                    if (rb
                        && getEnemyDistance(cc?.token, origin?.actor?.token) <= 30
                        && hasExploitVulnerabilityEffect(origin?.actor, cc.actor)
                    ) {
                        postTargetInChatTemplate(_uuid(rb), cc);
                    }
                })
        }
    }
}

async function ferocity(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0 && hasReaction(message?.token?.combatant)) {
            const ferocity = actorAction(message?.actor, "ferocity");
            if (ferocity) {
                await postInChatTemplate(_uuid(ferocity), message?.token?.combatant, undefined, true);
            }
        }
    }
}

async function entitysResurgence(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0 && hasReaction(message?.token?.combatant)) {
            const entitys_resurgence = actorAction(message?.actor, "entitys-resurgence");
            if (entitys_resurgence) {
                await postInChatTemplate(_uuid(entitys_resurgence), message?.token?.combatant, undefined, true);
            }
        }
    }
}

async function finalSpite(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0 && hasReaction(message?.token?.combatant)) {
            const final_spite = actorAction(message?.actor, "final-spite");
            if (final_spite) {
                await postInChatTemplate(_uuid(final_spite), message?.token?.combatant, undefined, true);
            }
        }
    }
}

async function amuletsAbeyance(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const amulets_abeyance = actorAction(message?.target?.actor, "amulets-abeyance");
            if (amulets_abeyance && hasExploitVulnerabilityEffect(message.actor, message?.target?.actor)) {
                await postInChatTemplate(_uuid(amulets_abeyance), message?.target?.token?.combatant);
            }
        }

        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    if (getEnemyDistance(message.target?.token, cc.token) <= 15 && hasExploitVulnerabilityEffect(message.actor, cc.actor)) {
                        const aab = actorAction(cc.actor, "amulets-abeyance");
                        if (aab) {
                            postTargetInChatTemplate(_uuid(aab), cc);
                        }
                    }
                })
        }
    }
}

async function retributiveStrike(message) {
    if (messageType(message, 'damage-roll')) {
        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
            .filter(a=>a?.actor?.id !== message?.target?.actor._id)
            .forEach(cc => {
                if (getEnemyDistance(message.target?.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                    const retributivestrike = actorAction(cc.actor, "retributive-strike");
                    if (retributivestrike) {
                        postTargetInChatTemplate(_uuid(retributivestrike), cc);
                    }
                }
            })
        }
    }
}

async function denierOfDestruction(message) {
    if (messageType(message, 'damage-roll')) {
        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    if (getEnemyDistance(message.target?.token, cc.token) <= 30) {
                        const dod = actorAction(cc.actor, "denier-of-destruction");
                        if (dod) {
                            postTargetInChatTemplate(_uuid(dod), cc);
                        }
                    }
                })
        }
    }
}

async function glimpseOfRedemption(message) {
    if (messageType(message, 'damage-roll')) {
        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    let radius = 15;
                    if (foundry.utils.isNewerVersion(game.version, 12)) {
                        radius = cc.token.auras.get("champions-aura")?.radius
                    }
                    if (!radius) {
                        return
                    }
                    if (getEnemyDistance(message.target?.token, cc.token) <= radius && getEnemyDistance(message.token, cc.token) <= radius) {
                        const gor = actorAction(cc.actor, "glimpse-of-redemption");
                        if (gor) {
                            postTargetInChatTemplate(_uuid(gor), cc);
                        }
                    }
                })
        }
    }
}

async function flashOfGrandeur(message) {
    if (messageType(message, 'damage-roll')) {
        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    let radius = 15;
                    if (foundry.utils.isNewerVersion(game.version, 12)) {
                        radius = cc.token.auras.get("champions-aura")?.radius
                    }
                    if (!radius) {
                        return
                    }
                    if (getEnemyDistance(message.target?.token, cc.token) <= radius && getEnemyDistance(message.token, cc.token) <= radius) {
                        const gor = actorAction(cc.actor, "flash-of-grandeur");
                        if (gor) {
                            postTargetInChatTemplate(_uuid(gor), cc);
                        }
                    }
                })
        }
    }
}

async function liberatingStep(message) {
    if (messageType(message, 'damage-roll')) {
        //ally damaged
        if (message?.target) {
            (isTargetCharacter(message) ? characterWithReaction() : npcWithReaction())
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    if (getEnemyDistance(message.target?.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                        const liberatingstep = actorAction(cc.actor, "liberating-step");
                        if (liberatingstep) {
                            postTargetInChatTemplate(_uuid(liberatingstep), cc);
                        }
                    }
                })
        }
    } else if (messageType(message, 'skill-check')) {
        if (isTargetCharacter(message) && anySuccessMessageOutcome(message)) {
            characterWithReaction()
                .filter(a => a?.actor?.id !== message?.target?.actor._id)
                .forEach(cc => {
                    if (message?.flags?.pf2e?.context?.options.find(bb => bb === "action:grapple")) {
                        if (getEnemyDistance(message.target?.token, cc.token) <= 15 && getEnemyDistance(message.token, cc.token) <= 15) {
                            const liberating_step = actorAction(cc.actor, "liberating-step");
                            if (liberating_step) {
                                postTargetInChatTemplate(_uuid(liberating_step), cc);
                            }
                        }
                    }
                })
        }
    }
}

async function vengefulSpite(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalSuccessMessageOutcome(message)) {
            if (hasReaction(message?.target?.token?.combatant)) {
                const vs = actorAction(message?.target?.actor, "vengeful-spite");
                if (vs) {
                    await postInChatTemplate(_uuid(vs), message.target?.token?.combatant);
                }
            }
        }
    }
}

async function reactiveGnaw(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant) && adjacentEnemy(message.target?.token, message.token)) {
            const rg = actorAction(message?.target?.actor, "reactive-gnaw");
            if (rg && message?.item?.system?.damage?.damageType === "slashing") {
                await postInChatTemplate(_uuid(rg), message.target?.token.combatant);
            }
        }
    }
}

async function ironCommand(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            let radius = 15;
            if (foundry.utils.isNewerVersion(game.version, 12)) {
                radius = message?.target?.token.auras.get("champions-aura")?.radius
            }
            if (!radius) {
                return
            }

            if (!(getEnemyDistance(message?.target?.token, message.token) <= radius)) {return}

            const iron_command = actorAction(message?.target?.actor, "iron-command");
            if (iron_command) {
                await postInChatTemplate(_uuid(iron_command), message.target?.token.combatant);
            }
        }
    }
}

async function selfishShield(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            let radius = 15;
            if (foundry.utils.isNewerVersion(game.version, 12)) {
                radius = message?.target?.token.auras.get("champions-aura")?.radius
            }
            if (!radius) {
                return
            }

            if (!(getEnemyDistance(message?.target?.token, message.token) <= radius)) {return}

            const selfish_shield = actorAction(message?.target?.actor, "selfish-shield");
            if (selfish_shield) {
                await postInChatTemplate(_uuid(selfish_shield), message.target?.token.combatant);
            }
        }
    }
}

async function destructiveVengeance(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            let radius = 15;
            if (foundry.utils.isNewerVersion(game.version, 12)) {
                radius = message?.target?.token.auras.get("champions-aura")?.radius
            }
            if (!radius) {
                return
            }

            if (!(getEnemyDistance(message?.target?.token, message.token) <= radius)) {return}

            const destructive_vengeance = actorAction(message?.target?.actor, "destructive-vengeance");
            if (destructive_vengeance) {
                await postInChatTemplate(_uuid(destructive_vengeance), message.target?.token.combatant);
            }
        }
    }
}

async function avengingBite(message) {
    if (messageType(message, 'attack-roll')) {
        if (isActorCharacter(message.actor)) {
            npcWithReaction()
                .forEach(cc => {
                    if (adjacentEnemy(message.token, cc.token)) {
                        const ab = actorAction(cc.actor, "avenging-bite");
                        if (ab) {
                            postInChatTemplate(_uuid(ab), cc?.token?.combatant);
                        }
                    }
                })
        }
    }
}

function implementsInterruption(message) {
    if (!isActorCharacter(message.actor)
        && messageWithAnyTrait(message, ["concentrate", "manipulate", "move"])
    ) {
        characterWithReaction()
            .forEach(cc => {
                const implements_interruption = actorAction(cc.actor, "implements-interruption");
                if (implements_interruption) {
                    if (hasExploitVulnerabilityEffect(message.actor, cc.actor)) {
                        if (canReachEnemy(message.token, cc.token, cc.actor)
                            || (getEnemyDistance(message.token, cc.token) <= 10 && actorHeldWeapon(cc.actor).filter(a => a?.item?.isRanged).length >= 1)
                        ) {
                            postInChatTemplate(_uuid(implements_interruption), cc);
                        }
                    }
                }
            });
    }
}

function fastSwallow(message) {
    if (messageType(message, 'attack-roll')) {
        if (anySuccessMessageOutcome(message)) {
            if (hasReaction(message?.token?.combatant)) {
                if (message?.item?.system?.attackEffects?.value.includes("improved-grab")) {
                    const fs = actorAction(message?.actor, "fast-swallow");
                    if (fs) {
                        postInChatTemplate(_uuid(fs), message?.token?.combatant);
                    }
                }
            }
        }
    }
}

async function wickedThorns(message) {
    if (messageType(message, 'attack-roll')) {
        if (anySuccessMessageOutcome(message)) {
            if (hasReaction(message?.target?.token?.combatant)) {
                const wicked_thorns = actorAction(message?.target?.actor, "wicked-thorns");
                if (wicked_thorns) {
                    if (message?.item?.traits.has("unarmed") || (message?.item?.isMelee && nonReach(message?.item?.traits))) {
                        await postInChatTemplate(_uuid(wicked_thorns), message.target?.token.combatant);
                    }
                }
            }
        }
    }
}
