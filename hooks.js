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
        whisper: game.users.filter(u => u.isGM).map(u => u._id),
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
        if (game?.combats?.active && (update.x >0 || update.y > 0)) {
            var filteredType = ((_document.actor?.type  == "npc") ? 'character' : 'npc')
            game?.combats?.active?.combatants
                .filter((c=>c.actorId != _document.actorId && c.actor.type == filteredType && c.token.flags?.["reaction-check"]?.state))
                .filter((cc=>cc.actor.itemTypes.action.find((feat => "attack-of-opportunity" === feat.slug))))
                .forEach(cc => {
                    var isReach = cc.token.actor.system.actions?.filter((e=>"strike"===e.type && e.ready))
                    .filter((e=>e.weaponTraits.find(b=>b.name==="reach")));
                    var distance = canvas.grid.measureDistance(cc.token.center, _document.center)
                    distance = Math.floor(distance / 5) * 5
                    if (distance <= (isReach.length>0?Settings.weaponReachRange:Settings.weaponRange)) {
                        postInChat(cc);
                    }
                })
        }
    });

    console.log("Pf2e-reaction | --- Hooks are added");
}