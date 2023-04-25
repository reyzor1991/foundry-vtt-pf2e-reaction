import Settings from "./settings.js";

function updateCombatantReactionState(combatant, newState) {
    combatant.token.update({
        "flags.reaction-check.state": newState
    });
}

async function postInChat(combatant) {
    const content = await renderTemplate("./modules/pf2e-reaction/templates/ask.hbs", { combatant: combatant });
    ChatMessage.create({
        content: content,
        flags: {
            "reaction-check": {
                tokenId: combatant.token.id
            }
        }
    });
}

export default function reactionHooks() {

    console.log("Pf2e-reaction | --- Add hooks");

    $(document).on('click', '.reaction-check', function () {
        var mid = $(this).parent().parent().data('message-id');
        if (mid) {
            var mes = game.messages.get(mid);
            var t = mes.flags['reaction-check'].tokenId;
            if (t) {
                var combatant = game.combat.turns.find(a=>a.tokenId === t);
                if (combatant) {
                    updateCombatantReactionState(combatant, false);
                    ui.chat.deleteMessage(mid, {})
                }
            }
        }

    });

    Hooks.on('combatRound', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, true)
        })
    });

    Hooks.on('deleteCombat', async combat => {
        combat.turns.forEach(cc =>{
            updateCombatantReactionState(cc, false)
        })
    });

    Hooks.on('createCombatant', async combatant => {
        updateCombatantReactionState(combatant, true)
    });

    Hooks.on('preUpdateToken',(_document, update, options, ..._args)=>{
        var square = Settings.squareSize;
        if (game?.combats?.active && (update.x >0 || update.y > 0)) {
            var prevX = _document.x;
            var prevY = _document.y;

            var all_coo_enemy = [
                [prevX, prevY],
                [prevX, prevY-square],
                [prevX, prevY+square],
                [prevX+square, prevY-square],
                [prevX+square, prevY],
                [prevX+square, prevY+square],
                [prevX-square, prevY-square],
                [prevX-square, prevY],
                [prevX-square, prevY+square],
            ]

            var filteredType = 'npc'
            if (_document.actor?.type  == "npc") {
                filteredType = 'character'
            }

            game?.combats?.active?.combatants
                .filter((c=>c.actorId != _document.actorId && c.actor.type == filteredType && c.token.flags?.["reaction-check"]?.state))
                .forEach(cc =>{
                    if (cc.actor.itemTypes.action.find((feat => "attack-of-opportunity" === feat.slug))) {
                        if (all_coo_enemy.find(it => JSON.stringify(it) == JSON.stringify([cc.token.x, cc.token.y]))) {
                            postInChat(cc);
                        }
                    }
                })


        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}