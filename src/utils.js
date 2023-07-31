export function hasEffect(actor, eff) {
    return actor && actor?.itemTypes?.effect?.find((c => eff === c.slug))
}

export function heldItems(actor, item, trait=undefined) {
    if (!actor) return []
    let items = Object.values(actor?.itemTypes).flat(1).filter(a => a.handsHeld > 0).filter(a => a.slug === item || a.category === item);
    if (trait && items.length>0) {
        items = items.filter(a=>a.traits.has(trait))
    }
    return items;
}

export function messageType(message, type) {
    return type === message?.flags?.pf2e?.context?.type;
}

export function failureMessageOutcome(message) {
    return "failure" === message?.flags?.pf2e?.context?.outcome;
}

export function criticalFailureMessageOutcome(message) {
    return "criticalFailure" === message?.flags?.pf2e?.context?.outcome;
}

export function successMessageOutcome(message) {
    return "success" === message?.flags?.pf2e?.context?.outcome;
}

export function criticalSuccessMessageOutcome(message) {
    return "criticalSuccess" === message?.flags?.pf2e?.context?.outcome;
}

export function anyFailureMessageOutcome(message) {
    return failureMessageOutcome(message) || criticalFailureMessageOutcome(message);
}

export function anySuccessMessageOutcome(message) {
    return successMessageOutcome(message) || criticalSuccessMessageOutcome(message);
}
export function hasOption(message, opt) {
    return message?.flags?.pf2e?.context?.options?.includes(opt);
}

function actorActionBySource(actor, action) {
    return actor?.itemTypes?.action?.find((c => action === c.sourceId))
}

function actorSpellBySource(actor, spell) {
    return actor?.itemTypes?.spell?.find((c => spell === c.sourceId))
}

function actorFeatBySource(actor, feat) {
    return actor?.itemTypes?.feat?.find((c => feat === c.sourceId))
}

export function canReachEnemy(attackerToken, defendToken, defendActor, specificWeapon=undefined) {
    const distance = getEnemyDistance(attackerToken, defendToken);
    if (isNPC(defendActor)) {
        let baseWeapons = defendActor?.system?.actions
            .filter(a => a.ready);

        if (specificWeapon) {
            specificWeapon = specificWeapon.toLowerCase()
            baseWeapons = baseWeapons
                .filter(a=>a.label.toLowerCase() === specificWeapon || a?.weapon?.slug?.toLowerCase() === specificWeapon)
        }

        const reachWs = baseWeapons
            .map(a => a.traits).flat()
            .map(c => c.name)
            .filter(b => b.startsWith("reach"))
            .map(c => c.split('-').slice(-1)[0]);

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

export function adjacentEnemy(attackerToken, defendToken) {
    return getEnemyDistance(attackerToken, defendToken) <= 5
}

export function getEnemyDistance(token, target) {
    return token.object.distanceTo(target.object);
}

export function nonReach(arr) {
    return !arr.find(b=>b.startsWith("reach"))
}

export function actorHeldWeapon(actor) {
    return actor?.system?.actions?.filter(a=>a.ready)
}

export function hasReachWeapon(actor) {
    return actor?.system?.actions
        ?.filter(a=>a.ready)
        ?.filter(a=>a?.weaponTraits?.find(b=>b.name==="reach"))
        ?.length !== 0
}

export function isTargetCharacter(message) {
    return isActorCharacter(message?.target?.actor);
}

export function isActorCharacter(actor) {
    return "character" === actor?.type || (actor?.type === "npc" && actor?.alliance === "party");
}

export function isNPC(actor) {
    return "npc" === actor?.type;
}

export function _uuid(obj) {
    return obj.uuid;
}