const identifySkills = new Map([
    ["aberration", ["occultism"]],
    ["animal", ["nature"]],
    ["astral", ["occultism"]],
    ["beast", ["arcana", "nature"]],
    ["celestial", ["religion"]],
    ["construct", ["arcana", "crafting"]],
    ["dragon", ["arcana"]],
    ["elemental", ["arcana", "nature"]],
    ["ethereal", ["occultism"]],
    ["fey", ["nature"]],
    ["fiend", ["religion"]],
    ["fungus", ["nature"]],
    ["humanoid", ["society"]],
    ["monitor", ["religion"]],
    ["ooze", ["occultism"]],
    ["plant", ["nature"]],
    ["spirit", ["occultism"]],
    ["undead", ["religion"]],
]);

const filteredTraits = ["evil", "chaotic", "neutral", "lawful", "good"]

function addRecallButton(html, sheet, skill, dc, isLore=false) {
    var loc_skill= isLore? skill.replaceAll("-", " ").replaceAll(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) :game.i18n.localize("PF2E.Skill"+skill.replace(/^\w/, (c) => c.toUpperCase()))
    var rec=game.i18n.localize("PF2E.RecallKnowledge.Label")
    var but = document.createElement('div');
    but.className = 'recall-knowledge tag-legacy tooltipstered gm-recall-knowledge-'+skill

    var a = document.createElement('a');
    a.textContent = rec+': '+loc_skill
    a.onclick = function () {
        var content = 'To Recall Knowledge, roll:';
        content += '<br>@Check[type:'+skill+'|dc:'+dc+'|traits:secret,action:recall-knowledge]';
        ChatMessage.create({
            content: TextEditor.enrichHTML(content, { async: false }),
            flavor: '',
            user: null,
            speaker: {
                scene: null,
                actor: null,
                token: null,
                alias: "System"
            },
            type: CONST.CHAT_MESSAGE_TYPES.OOC
        }).then();
    };
    but.append(a);

    html.find(".recall-knowledge > .section-body").append(but);
}

function easyLore(html, sheet, dc) {
    if (!Settings.recallKnowledgeEasyLore) {
        return
    }

    sheet.object.traits.forEach(a=>{
        if (filteredTraits.includes(a)) {
            return
        }
        addRecallButton(html, sheet, `${a}-lore`, dc, true)
    })
}

function veryEasyLore(html, sheet, dc) {
    if (!Settings.recallKnowledgeVeryEasyLore) {
        return
    }
    addRecallButton(html, sheet, `${sheet.actor.name.toLowerCase().replaceAll(" ", "-")}-lore`, dc, true)
}

Hooks.on("renderActorSheet", (sheet, html, data)=>{
    if (game.user?.isGM && isNPC(sheet.actor) && sheet.token && Settings.recallKnowledge) {
        var recalls = html.find(".recall-knowledge .section-body .identification-skills")
        if (recalls.length == 0) {
            return;
        }
        if (Settings.recallKnowledgeHideDef){recalls.addClass('hidden')}

        var skills = Array.from(new Set(sheet.object.system.traits.value.flatMap((t) => identifySkills.get(t) ?? [])));

        if (recalls.length == 1) {
            var dcs = recalls.eq(0).text().trim().match(/\d+/g);
            if (dcs.length == 2) {
                var [easyLoreDc, veryEasyLoreDc] = dcs;
                easyLore(html, sheet, easyLoreDc)
                veryEasyLore(html, sheet, veryEasyLoreDc);
            } else {
                var dc = dcs[0];
                 skills.forEach(skill => {
                    addRecallButton(html, sheet, skill, dc)
                })
            }
        } else if (recalls.length == 2) {
            var dc = recalls.eq(0).text().trim().match(/\d+/g)[0];
            var [easyLoreDc, veryEasyLoreDc] = recalls.eq(1).text().trim().match(/\d+/g);

            skills.forEach(skill => {
                addRecallButton(html, sheet, skill, dc)
            })
            easyLore(html, sheet, easyLoreDc)
            veryEasyLore(html, sheet, veryEasyLoreDc);
        } else {
            console.warn(game.i18n.localize("pf2e-reaction.recall-knowledge.need-fix"));
        }
    }
});