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



Hooks.on('preCreateChatMessage',async (message, user, _options, userId)=>{
    if (!game?.combats?.active) {return}

    if (messageType(message, 'attack-roll')) {

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

    } else if (messageType(message, "saving-throw")) {
        const charmedlife = actorFeat(message.actor, "charmed-life");
        if (charmedlife) {
            if (message?.flags?.pf2e?.modifiers?.find(a=>a.slug==="charmed-life" && a.enabled)) {
                decreaseReaction(message.token.combatant)
                reactionWasUsedChat(_uuid(charmedlife), message.token.combatant);
            }
        }
    }

});