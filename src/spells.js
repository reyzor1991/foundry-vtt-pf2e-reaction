async function schadenfreude(message) {
    if (messageType(message, "saving-throw")) {
        if (hasReaction(message?.token?.combatant) && criticalFailureMessageOutcome(message)) {
            const _s = actorSpell(message.actor, "schadenfreude");
            if (_s) {
                postInChatTemplate(_uuid(_s), message.token.combatant)
            }
        }
    }
};