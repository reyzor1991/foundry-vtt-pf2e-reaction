async function bansheeCry(message) {
    if (message?.item?.type != 'spell') {return}
    if (!message.item.components.verbal) {return}

    (isActorCharacter(message.actor) ? npcWithReaction() : characterWithReaction())
    .forEach(cc => {
        if (getEnemyDistance(message.token, cc.token) <= 30) {
            const bc = actorAction(cc.actor, "banshee-cry");
            if (bc) {
                postInChatTemplate(_uuid(bc), cc);
            }
        }
    })
}

async function opportuneBackstab(message) {
    if (!messageType(message, 'damage-roll')) {return}
    if (isTargetCharacter(message)) {return}
    if (!message.item?.isMelee) {return}

    characterWithReaction()
        .filter(a=>a.actorId !== message?.actor?._id)
        .forEach(cc => {
            const opportune_backstab = actorFeat(cc.actor, "opportune-backstab");
            if (opportune_backstab && canReachEnemy(message.target.token, cc.token, cc.actor)) {
                postInChatTemplate(_uuid(opportune_backstab), cc);
            }
        })
}

async function convincingIllusion(message) {
    if (messageType(message, 'perception-check') || messageType(message, "saving-throw")) {
        if (message?.flags?.pf2e?.origin?.uuid) {
            const origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            if (hasReaction(origin?.actor?.combatant)) {
                if (successMessageOutcome(message)) {
                    const convincing_illusion = actorFeat(origin?.actor, "convincing-illusion");
                    if (convincing_illusion && origin?.traits?.has("illusion")) {
                        await postInChatTemplate(_uuid(convincing_illusion), origin?.actor?.combatant);
                    }
                }
            }
        }
    }
};

async function mentalStatic(message) {
    if (messageType(message, "saving-throw") && hasReaction(message?.token?.combatant)) {
        if (criticalSuccessMessageOutcome(message)) {
            const mStatic = actorFeat(message.actor, "mental-static")
            if (mStatic && hasOption(message, "check:statistic:will") && hasOption(message, "item:trait:mental")) {
                await postTargetInChatTemplate(_uuid(mStatic), message?.actor?.combatant);
            }
        }
    }
};

async function premonitionOfClarity(message) {
    if (messageType(message, "saving-throw")) {
        if (hasReaction(message?.token?.combatant) && anyFailureMessageOutcome(message)) {
            const origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            const poc = actorFeat(message.actor, "premonition-of-clarity");
            if (poc && origin?.traits?.has("mental")) {
                await postInChatTemplate(_uuid(poc), message.token.combatant);
            }
        }
    }
};

async function gritAndTenacity(message) {
    if (messageType(message, "saving-throw")) {
        if (hasReaction(message?.token?.combatant) && anyFailureMessageOutcome(message)) {
            const gat = actorFeat(message.actor, "grit-and-tenacity");
            if (gat) {
                await postInChatTemplate(_uuid(gat), message.token.combatant);
            }
        }
    }
};

async function orcFerocity(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0 && hasReaction(message?.token?.combatant)) {
            const orc_ferocity = actorFeat(message?.actor, "orc-ferocity");
            if (orc_ferocity) {
                await postInChatTemplate(_uuid(orc_ferocity), message?.token?.combatant, undefined, true);
            }
        }
    }
};

async function cheatDeath(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0 && hasReaction(message?.token?.combatant)) {
            const cheat_death = actorFeat(message?.actor, "cheat-death");
            if (cheat_death) {
                await postInChatTemplate(_uuid(cheat_death), message?.token?.combatant, undefined, true);
            }
        }
    }
};

async function cleave(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.actor?.combatant)) {
            const cleave = actorFeat(message.actor, "cleave");
            if (cleave && message?.item?.isMelee) {
                if (message.target.actor.system.attributes.hp.value <= parseInt(message.content)) {

                    const adjEnemies = game.combat?.turns?.filter(a => !isActorCharacter(a.actor))
                        .filter(a => a.actorId !== message?.target?.actor._id)
                        .filter(a => adjacentEnemy(message.target.token, a.token))
                        .filter(a => a.actor.system.attributes.hp.value > 0);

                    if (adjEnemies.length > 0) {
                        await postInChatTemplate(_uuid(cleave), message.actor.combatant);
                    }
                }
            }
        }
    }
};

async function shieldBlock(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant, "shield-block")) {
            const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a?.damageType);
            if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length > 0) {
                const sblock = actorFeat(message?.target?.actor, "shield-block");
                if (sblock && hasEffect(message.target.actor, "effect-raise-a-shield")) {
                    await postInChatTemplate(_uuid(sblock), message.target.token.combatant, "shield-block");
                }
            }
        }
    }
};

async function electricCounter(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const electric_counter = actorFeat(message?.target?.actor, "electric-counter");
            if (electric_counter && hasEffect(message?.target?.actor, "stance-wild-winds-stance")) {
                await postInChatTemplate(_uuid(electric_counter), message?.target?.token?.combatant);
            }
        }
    }
};

async function allInMyHead(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const all_in = actorFeat(message?.target?.actor, "all-in-my-head");
            if (all_in && !message?.item?.traits.has("death")) {
                await postInChatTemplate(_uuid(all_in), message.target.token.combatant);
            }
        }
    }
};

async function unexpectedShift(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const unexpecteds = actorFeat(message?.target?.actor, "unexpected-shift");
            if (unexpecteds) {
                await postInChatTemplate(_uuid(unexpecteds), message.target.token.combatant);
            }
        }
    }
};

async function resoundingFinale(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);
            if (dTypes.filter(a=> a=== "sonic").length > 0) {
                const resounding = actorFeat(message?.target?.actor, "resounding-finale");
                if (resounding) {
                    await postInChatTemplate(_uuid(resounding), message.target.token.combatant);
                }
            }
        }
    }
};

async function reverberate(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);
            if (dTypes.filter(a=> a=== "sonic").length > 0) {
                const reverberate = actorFeat(message?.target?.actor, "reverberate");
                if (reverberate && message.item.type === "spell") {
                    await postInChatTemplate(_uuid(reverberate), message.target.token.combatant);
                }
            }
        }
    }
};

async function verdantPresence(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const verdantp = actorFeat(message?.target?.actor, "verdant-presence");
            if (verdantp) {
                await postInChatTemplate(_uuid(verdantp), message.target.token.combatant);
            }
        }
    }
    if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
        if (message?.item && isActorCharacter(message?.actor)) {
            if (hasReaction(message?.token?.combatant)) {
                const verdant_presence = actorFeat(message?.actor, "verdant-presence");
                if (verdant_presence && message?.item?.system?.traditions.value.includes("primal")) {
                    await postInChatTemplate(_uuid(verdant_presence), message?.token?.combatant);
                }
            }
        }
    }
};

async function alignKi(message) {
    if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
        if (message?.item && isActorCharacter(message?.actor)) {
            if (hasReaction(message?.token?.combatant)) {
                const align_ki = actorFeat(message?.actor, "align-ki");
                if (align_ki && messageWithTrait(message, "monk")) {
                    await postInChatTemplate(_uuid(align_ki), message?.token?.combatant);
                }
            }
        }
    }
};

async function mageHunter(message) {
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
    }
};

async function accompany(message) {
    if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
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
        }
    }
};

async function spellRelay(message) {
    if (message?.flags?.pf2e?.casting || messageType(message, 'spell-cast')) {
        if (message?.item && isActorCharacter(message?.actor)) {
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
    }
};

async function youFailedToAccountForThis(message) {
    if (messageType(message, "spell-attack-roll") || messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const you_failed_to = actorFeat(message?.target?.actor, "you-failed-to-account-for-this");
            if (you_failed_to) {
                await postInChatTemplate(_uuid(you_failed_to), message.target.token.combatant);
            }
        }
    }
};

async function suspectOfOpportunity(message) {
    if (messageType(message, "spell-attack-roll") || messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const suspect_of_opportunity = actorFeat(message?.target?.actor, "suspect-of-opportunity");
            if (suspect_of_opportunity) {
                await postInChatTemplate(_uuid(suspect_of_opportunity), message.target.token.combatant);
            }
        }
    }
};

async function foreseeDanger(message) {
    if (messageType(message, "spell-attack-roll") || messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const foresee_danger = actorFeat(message?.target?.actor, "foresee-danger");
            if (foresee_danger) {
                await postInChatTemplate(_uuid(foresee_danger), message.target.token.combatant);
            }
        }
    }
};

async function mirrorShield(message) {
    if (messageType(message, "spell-attack-roll") || messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant) && criticalFailureMessageOutcome(message)) {
            const mirror_shield = actorFeat(message?.target?.actor, "mirror-shield");
            if (mirror_shield) {
                await postInChatTemplate(_uuid(mirror_shield), message?.target?.token?.combatant);
            }
        }
    }
};

async function spiritualGuides(message) {
    if (messageType(message, 'perception-check') || messageType(message, 'skill-check')) {
        if (failureMessageOutcome(message) && hasReaction(message?.token?.combatant)) {
            const spiritual_guides = actorFeat(message?.actor, "spiritual-guides")
            if (spiritual_guides) {
                await postInChatTemplate(_uuid(spiritual_guides), message.token.combatant);
            }
        }
    }
};

async function squawk(message) {
    if (messageType(message, 'skill-check')) {
        if (hasReaction(message?.token?.combatant)) {
            if (criticalFailureMessageOutcome(message)) {
                const squawk = actorFeat(message?.actor, "squawk");
                if (squawk && !message?.target?.actor?.system?.traits?.value?.includes("tengu")
                    && ["deception","diplomacy","intimidation"].some(a=>message.flags?.pf2e?.context?.domains?.includes(a))
                ) {
                    await postInChatTemplate(_uuid(squawk), message.token.combatant);
                }
            }
        }
    }
};

async function sacrificeArmor(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);

            if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length > 0) {
                const sarmor = actorFeat(message?.target?.actor, "sacrifice-armor");
                if (sarmor) {
                    await postInChatTemplate(_uuid(sarmor), message.target.token.combatant);
                }
            }
        }
    }
};

async function reactiveTransformation(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a.damageType);

            if (dTypes.filter(a=> ["acid", "cold", "electricity", "fire", 'poison'].includes(a)).length > 0) {
                const reactivet = actorFeat(message?.target?.actor, "reactive-transformation");
                if (reactivet) {
                    await postInChatTemplate(_uuid(reactivet), message.target.token.combatant);
                }
            }
        }
    }
};

async function fakeOut(message) {
    if ((messageType(message, 'skill-check') && isActorCharacter(message?.actor) && messageWithTrait(message, "attack"))
        || (messageType(message, 'attack-roll') && isActorCharacter(message?.actor))
    ) {
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
};

async function rubyResurrection(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0) {
            if (hasReaction(message?.token?.combatant)) {
                const ruby_resurrection = actorFeat(message?.actor, "ruby-resurrection");
                if (ruby_resurrection) {
                    await postInChatTemplate(_uuid(ruby_resurrection), message?.token?.combatant, undefined, true);
                }
            }
        }
    }
};

async function rapidResponse(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0) {
            // ally
            if (isActorCharacter(message?.actor)) {
                characterWithReaction()
                .filter(a=>a.actorId !== message?.actor?._id)
                .forEach(cc => {
                    const rapid_response = actorFeat(cc.actor, "rapid-response");
                    if (rapid_response) {
                        postInChatTemplate(_uuid(rapid_response), cc);
                    }
                });
            }
        }
    }
};

async function no(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value === 0) {
            // ally
            if (isActorCharacter(message?.actor)) {
                characterWithReaction()
                .filter(a=>a.actorId !== message?.actor?._id)
                .forEach(cc => {
                    const no = actorFeat(cc.actor, "no");
                    if (no && message?.actor?.combatant && getEnemyDistance(message.token, cc.token) <= 60) {
                        postInChatTemplate(_uuid(no), cc);
                    }
                });
            }
        }
    }
};

async function woundedRage(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value != 0 && hasReaction(message?.token?.combatant)) {
            const wounded_rage = actorFeat(message?.actor, "wounded-rage");
            if (wounded_rage && !hasCondition(message?.actor,"encumbered") && !hasEffect(message.actor, "effect-rage")) {
                await postInChatTemplate(_uuid(wounded_rage), message?.token?.combatant);
            }
        }
    }
};

async function negateDamage(message) {
    if (message?.flags?.pf2e?.appliedDamage && !message?.flags?.pf2e?.appliedDamage?.isHealing) {
        if (message.actor.system?.attributes?.hp?.value != 0 && hasReaction(message?.token?.combatant)) {
            const negate_damage = actorFeat(message?.actor, "negate-damage");
            if (negate_damage) {
                await postInChatTemplate(_uuid(negate_damage), message?.token?.combatant);
            }
        }
    }
};

async function distractingExplosion(message) {
    if (!isActorCharacter(message?.actor) && messageWithTrait(message, "concentrate")) {
        characterWithReaction()
            .filter(cc => canReachEnemy(message.token, cc.token, cc.actor))
            .forEach(cc => {
                const distracting_explosion = actorFeat(cc.actor, "distracting-explosion");
                if (distracting_explosion) {
                    postInChatTemplate(_uuid(distracting_explosion), cc);
                }
            });
    }
};

async function embraceThePain(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const embracethepain = actorFeat(message?.target?.actor, "embrace-the-pain");
            if (message?.item?.isMelee && embracethepain) {
                await postInChatTemplate(_uuid(embracethepain), message.target.token.combatant);
            }
        }
    }
};

async function retaliatoryCleansing(message) {
    if (messageType(message, 'damage-roll')) {
        if (hasReaction(message?.target?.token?.combatant) && adjacentEnemy(message.target.token, message.token)) {
            const rc = actorFeat(message?.target?.actor, "retaliatory-cleansing");
            if (rc) {
                if (actorHeldWeapon(message?.target?.actor).filter(a=>a.slug==="holy-water" || (a.weaponTraits.filter(b=>b.name === "bomb").length > 0 && a.weaponTraits.filter(b=>b.name === "positive").length > 0)).length > 0) {
                    await postInChatTemplate(_uuid(rc), message.target.token.combatant);
                }
            }
        }
    }
};

async function nimbleDodge(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const nimble_dodge = actorFeat(message?.target?.actor, "nimble-dodge") ?? actorAction(message?.target?.actor, "nimble-dodge");
            if (nimble_dodge && !hasCondition(message?.target?.actor,"encumbered")) {
                await postInChatTemplate(_uuid(nimble_dodge), message.target.token.combatant);
            }
        }
    }
};

async function airyStep(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const airy_step = actorFeat(message?.target?.actor, "airy-step") ?? actorAction(message?.target?.actor, "airy-step");
            if (airy_step) {
                await postInChatTemplate(_uuid(nimble_dodge), message.target.token.combatant);
            }
        }
    }
};

async function farabellusFlip(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const farabellus_flip = actorFeat(message?.target?.actor, "farabellus-flip");
            if (farabellus_flip) {
                await postInChatTemplate(_uuid(farabellus_flip), message.target.token.combatant);
            }
        }
    }
};

async function reactiveShield(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const reactive_shield = actorFeat(message?.target?.actor, "reactive-shield");
            if (reactive_shield && !hasEffect(message?.target?.actor, "effect-raise-a-shield") && message?.item?.isMelee) {
                await postInChatTemplate(_uuid(reactive_shield), message.target.token.combatant);
            }
        }
    }
};

async function pirouette(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const pirouette = actorFeat(message?.target?.actor, "pirouette");
            if (pirouette && hasEffect(message?.target?.actor, "stance-masquerade-of-seasons-stance")) {
                await postInChatTemplate(_uuid(pirouette), message.target.token.combatant);
            }
        }
    }
};

async function fieryRetort(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const fiery_retort = actorFeat(message?.target?.actor, "fiery-retort");
            if (fiery_retort && adjacentEnemy(message.token, message.target.token)
                && (message?.item?.isMelee|| message?.item?.traits?.has("unarmed"))) {
                await postInChatTemplate(_uuid(fiery_retort), message.target.token.combatant);
            }
        }
    }
};

async function knightsRetaliation(message) {
    if (messageType(message, 'attack-roll')) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const knights_retaliation = actorFeat(message?.target?.actor, "knights-retaliation");
            if (knights_retaliation
                && message?.actor?.system.traits.value.includes("undead")
                && criticalFailureMessageOutcome(message)
            ) {
                await postInChatTemplate(_uuid(knights_retaliation), message.target.token.combatant);
            }
        }
    }
};

async function tangleOfBattle(message) {
    if (messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
        if (hasReaction(message?.token?.combatant)) {
            const tob = actorFeat(message?.actor, "tangle-of-battle");
            if (tob && adjacentEnemy(message.target.token, message?.token)) {
                await postInChatTemplate(_uuid(tob), message.token.combatant);
            }
        }
    }
};

async function cleverGambit(message) {
    if (messageType(message, 'attack-roll') && criticalSuccessMessageOutcome(message)) {
        if (hasReaction(message?.token?.combatant)) {
            const clever_gambit = actorFeat(message?.actor, "clever-gambit");
            if (clever_gambit && hasEffect(message?.target?.actor, "effect-recall-knowledge-identified")) {
                await postInChatTemplate(_uuid(clever_gambit), message.token.combatant);
            }
        }
    }
};

async function opportuneRiposte(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant, "opportune-riposte")) {
            const opportune_riposte = actorFeat(message?.target?.actor, "opportune-riposte") ?? actorAction(message?.target?.actor, "opportune-riposte");
            if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && opportune_riposte) {
                await postInChatTemplate(_uuid(opportune_riposte), message.target.token.combatant, "opportune-riposte");
            }
        }
    }
};

async function duelingRiposte(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant)) {
            const dueling_riposte = actorFeat(message?.target?.actor, "dueling-riposte");
            if (dueling_riposte && hasEffect(message.target.actor, "effect-dueling-parry")) {
                await postInChatTemplate(_uuid(dueling_riposte), message.target.token.combatant);
            }
        }
    }
};

async function twinRiposte(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalFailureMessageOutcome(message) && hasReaction(message?.target?.token?.combatant)) {
            const twin_riposte = actorFeat(message?.target?.actor, "twin-riposte");
            if (twin_riposte && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                && (hasEffect(message.target.actor, "effect-twin-parry")||hasEffect(message.target.actor, "effect-twin-parry-parry-trait"))) {
                await postInChatTemplate(_uuid(twin_riposte), message.target.token.combatant);
            }
        }
    }
};

async function perfectClarity(message) {
    if (messageType(message, 'attack-roll')) {
        if (anyFailureMessageOutcome(message)) {
            if (hasReaction(message?.token?.combatant)) {
                const perfect_clarity = actorFeat(message?.actor, "perfect-clarity");
                if (perfect_clarity) {
                    await postInChatTemplate(_uuid(perfect_clarity), message?.token?.combatant);
                }
            }
        }
    }
};

async function furiousVengeance(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalSuccessMessageOutcome(message)) {
            if (hasReaction(message?.target?.token?.combatant)) {
                const fv = actorFeat(message?.target?.actor, "furious-vengeance")
                if (canReachEnemy(message.token, message?.target?.token, message?.target?.actor) && fv) {
                    await postInChatTemplate(_uuid(fv), message.target.token.combatant);
                }
            }
        }
    }
};

async function cringe(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalSuccessMessageOutcome(message)) {
            if (hasReaction(message?.target?.token?.combatant)) {
                const cringe = actorFeat(message?.target?.actor, "cringe");
                if (cringe) {
                    await postInChatTemplate(_uuid(cringe), message.target.token.combatant);
                }
            }
        }
    }
};

async function stormRetribution(message) {
    if (messageType(message, 'attack-roll')) {
        if (criticalSuccessMessageOutcome(message)) {
            if (adjacentEnemy(message.token, message?.target?.token, message?.target?.actor)) {
                if (message?.item?.isMelee || message?.item?.traits?.has("unarmed")) {
                    if (message?.target?.actor?.system?.resources?.focus?.value > 0) {
                        const sr = actorFeat(message?.target?.actor, "storm-retribution")
                        if (sr) {
                            await postInChatTemplate(_uuid(sr), message.target.token.combatant);
                        }
                    }
                }
            }
        }
    }
};

async function courageousOpportunity(message) {
    if (isActorCharacter(message.actor)) {return}
    if (
        messageWithAnyTrait(message, ["manipulate","move", "auditory"])
        || (messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
    ) {
        characterWithReaction()
            .filter(cc=>canReachEnemy(message.token, cc.token, cc.actor))
            .filter(a=>hasEffect(a.actor, "spell-effect-inspire-courage"))
            .forEach(cc => {
                const courageous_opportunity = actorFeat(cc.actor, "courageous-opportunity");
                if (courageous_opportunity) {
                    postInChatTemplate(_uuid(courageous_opportunity), cc);
                }
            });
    }
};

async function attackOfOpportunity(message) {
    if (
        (messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
        || messageWithAnyTrait(message, ["manipulate","move"])
    ) {
        (isActorCharacter(message.actor) ? npcWithReaction() : characterWithReaction())
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
                    if (canReachEnemy(message.token, cc.token, cc.actor, specificWeapon)) {
                        postInChatTemplate(_uuid(aoo), cc, "attack-of-opportunity");
                    }
                }
            })
    }
};

async function reactiveStrike(message) {
    if (
        (messageType(message, 'attack-roll') && message?.flags?.pf2e?.context?.domains.includes("ranged-attack-roll"))
        || messageWithAnyTrait(message, ["manipulate","move"])
    ) {
        (isActorCharacter(message.actor) ? npcWithReaction() : characterWithReaction())
            .filter(c=> hasReaction(c, "reactive-strike"))
            .forEach(cc => {
                const aoo = actorAction(cc.actor, "reactive-strike") ?? actorFeat(cc.actor, "reactive-strike");
                if (aoo) {
                    let specificWeapon = undefined;
                    if (isNPC(cc.actor)) {
                        const match = aoo.name.match('\(([A-Za-z]{1,}) Only\)');
                        if (match && match.length === 3) {
                            specificWeapon=match[2]
                        }
                    }
                    if (canReachEnemy(message.token, cc.token, cc.actor, specificWeapon)) {
                        postInChatTemplate(_uuid(aoo), cc, "reactive-strike");
                    }
                }
            })
    }
};

async function emergencyTarge(message) {
    if (messageType(message, "saving-throw")) {
        if (hasReaction(message?.token?.combatant) && anyFailureMessageOutcome(message)) {
            const origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
            const emergency_targe = actorFeat(message?.actor, "emergency-targe")
            if (emergency_targe && message?.flags?.pf2e?.origin?.type  === 'spell') {
                await postInChatTemplate(_uuid(emergency_targe), message.token.combatant);
            }
        }
    } else if (messageType(message, 'attack-roll') && anySuccessMessageOutcome(message)) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const emergency_targe = actorFeat(message?.target?.actor, "emergency-targe");
            if (emergency_targe && message?.item?.isMelee) {
                await postInChatTemplate(_uuid(emergency_targe), message.target.token.combatant);
            }
        }
    }
};

async function impossibleTechnique(message) {
    if (messageType(message, 'attack-roll') && anySuccessMessageOutcome(message)) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const impossible_technique = actorFeat(message?.target?.actor, "impossible-technique");
            if (impossible_technique
                && !hasCondition(message?.target?.actor, "fatigued")
                && message?.target?.actor?.armorClass?.parent?.item?.type !== "armor"
            ) {
                await postInChatTemplate(_uuid(impossible_technique), message.target.token.combatant);
            }
        }
    }
};

async function ripplingSpin(message) {
    if (messageType(message, 'attack-roll') && anySuccessMessageOutcome(message)) {
        if (hasReaction(message?.target?.token?.combatant)) {
            const rippling_spin = actorFeat(message?.target?.actor, "rippling-spin");
            if (rippling_spin && message?.item?.isMelee
                && canReachEnemy(message.token, message?.target?.token, message?.target?.actor)
                && hasEffect(message?.target?.actor, "stance-reflective-ripple-stance")
            ) {
                await postInChatTemplate(_uuid(rippling_spin), message.target.token.combatant);
            }
        }
    }
};

async function guardiansDeflectionFighter(message) {
    if (messageType(message, 'attack-roll') && anySuccessMessageOutcome(message)) {
        if (isTargetCharacter(message)) {
            const rr = message.rolls.at(0);
            const newR = calculateDegreeOfSuccess(message?.flags?.pf2e?.context?.dc?.value, rr._total - 2, rr.dice.at(0).total);

            if (rr.degreeOfSuccess !== newR) {
                characterWithReaction()
                    .filter(a=>a?.actor?.id != message?.target?.actor._id)
                    .filter(cc=>canReachEnemy(message?.target?.token, cc.token, cc.actor))
                    .forEach(cc => {
                        const guardians_def = actorFeat(cc.actor, "guardians-deflection-fighter");
                        if (guardians_def) {
                            postInChatTemplate(_uuid(guardians_def), cc);
                        }
                    })
            }
        }
    }
};

async function guardiansDeflectionSwashbuckler(message) {
    if (messageType(message, 'attack-roll') && anySuccessMessageOutcome(message)) {
        if (isTargetCharacter(message)) {
            const rr = message.rolls.at(0);
            const newR = calculateDegreeOfSuccess(message?.flags?.pf2e?.context?.dc?.value, rr._total - 2, rr.dice.at(0).total);

            if (rr.degreeOfSuccess !== newR) {
                characterWithReaction()
                    .filter(a=>a?.actor?.id != message?.target?.actor._id)
                    .filter(cc=>canReachEnemy(message?.target?.token, cc.token, cc.actor))
                    .forEach(cc => {
                        const guardians_def = actorFeat(cc.actor, "guardians-deflection-swashbuckler");
                        if (guardians_def) {
                            postInChatTemplate(_uuid(guardians_def), cc);
                        }
                    })
            }
        }
    }
};

async function shieldWardenFighter(message) {
    if (!messageType(message, 'damage-roll')) {return}
    if (!isTargetCharacter(message)) {return}
    const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a?.damageType);
    if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length === 0) {return;}

    characterWithReaction()
        .filter(a=>a.actorId !== message?.actor?._id)
        .filter(a=>hasEffect(a.actor, "effect-raise-a-shield"))
        .filter(a=>adjacentEnemy(message.target.token, a.token))
        .forEach(cc => {
            const shield_warden = actorFeat(cc.actor, "shield-warden-fighter");
            if (shield_warden) {
                postTargetInChatTemplate(_uuid(shield_warden), cc, undefined);
            }
        })
};

async function shieldWardenChampion(message) {
    if (!messageType(message, 'damage-roll')) {return}
    if (!isTargetCharacter(message)) {return}
    const dTypes = Object.values(message?.item?.system?.damageRolls ?? {a: message?.item?.system?.damage}).map(a=>a?.damageType);
    if (dTypes.filter(a=> a=== "bludgeoning" || a === "piercing" || a=== "slashing").length === 0) {return;}

    characterWithReaction()
        .filter(a=>a.actorId !== message?.actor?._id)
        .filter(a=>hasEffect(a.actor, "effect-raise-a-shield"))
        .filter(a=>adjacentEnemy(message.target.token, a.token))
        .forEach(cc => {
            const shield_warden = actorFeat(cc.actor, "shield-warden-champion");
            if (shield_warden) {
                postTargetInChatTemplate(_uuid(shield_warden), cc);
            }
        })
};

async function standStill(message) {
    if (!isActorCharacter(message.actor) && messageWithTrait(message, "move")) {
        characterWithReaction()
            .forEach(cc => {
                const stand_still = actorFeat(cc.actor, "stand-still");
                if (stand_still && canReachEnemy(message?.token, cc.token, cc.actor)) {
                    postInChatTemplate(_uuid(stand_still), cc);
                }
            });
    }
};

async function noEscape(message) {
    if (!isActorCharacter(message.actor) && messageWithTrait(message, "move")) {
        characterWithReaction()
            .forEach(cc => {
                const no_escape = actorFeat(cc.actor, "no-escape");
                if (no_escape && canReachEnemy(message?.token, cc.token, cc.actor)) {
                    postInChatTemplate(_uuid(no_escape), cc);
                }
            });
    }
};

async function verdistantDefense(message) {
    if (!isActorCharacter(message.actor) && messageWithTrait(message, "move")) {
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
};