async function schadenfreude(message) {
    if (messageType(message, "saving-throw")) {
        if (hasReaction(message?.token?.combatant) && criticalFailureMessageOutcome(message)) {
            const _s = actorSpell(message.actor, "schadenfreude");
            if (_s) {
                let prepared = Object.values(_s.spellcasting.system.slots).map(i=>i.prepared).flat()
                if (prepared.find(p=>p.id === _s.id && !p.expended)) {
                    await postInChatTemplate(_uuid(_s), message.token.combatant)
                }
            }
        }
    }
};