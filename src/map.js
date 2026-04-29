const BUILTIN_REACTION_SETTING_KEY = "builtinReactionsEnabled";
const BUILTIN_REACTION_CATEGORIES = [
    {id: "actions", labelKey: "pf2e-reaction.SETTINGS.builtinReactions.categories.actions"},
    {id: "feats", labelKey: "pf2e-reaction.SETTINGS.builtinReactions.categories.feats"},
    {id: "spells", labelKey: "pf2e-reaction.SETTINGS.builtinReactions.categories.spells"},
    {id: "other", labelKey: "pf2e-reaction.SETTINGS.builtinReactions.categories.other"},
];

const actionBuiltinReactionIds = [
    "youre-next",
    "ring-bell",
    "ferocity",
    "entitys-resurgence",
    "final-spite",
    "amulets-abeyance",
    "retributive-strike",
    "denier-of-destruction",
    "glimpse-of-redemption",
    "flash-of-grandeur",
    "liberating-step",
    "vengeful-spite",
    "reactive-gnaw",
    "iron-command",
    "selfish-shield",
    "destructive-vengeance",
    "avenging-bite",
    "implements-interruption",
    "fast-swallow",
    "wicked-thorns",
];

const spellBuiltinReactionIds = [
    "schadenfreude",
];

const featBuiltinReactionIds = [
    "opportune-backstab",
    "disarming-block",
    "convincing-illusion",
    "mental-static",
    "premonition-of-clarity",
    "grit-and-tenacity",
    "emergency-targe",
    "orc-ferocity",
    "cheat-death",
    "cleave",
    "shield-block",
    "banshee-cry",
    "electric-counter",
    "all-in-my-head",
    "unexpected-shift",
    "resounding-finale",
    "reverberate",
    "verdant-presence",
    "align-ki",
    "mage-hunter",
    "counter-thought",
    "accompany",
    "spell-relay",
    "you-failed-to-account-for-this",
    "suspect-of-opportunity",
    "foresee-danger",
    "mirror-shield",
    "spiritual-guides",
    "squawk",
    "sacrifice-armor",
    "reactive-transformation",
    "fake-out",
    "ruby-resurrection",
    "rapid-response",
    "no",
    "wounded-rage",
    "negate-damage",
    "distracting-explosion",
    "embrace-the-pain",
    "retaliatory-cleansing",
    "nimble-dodge",
    "ectoplasmic-shield",
    "airy-step",
    "farabellus-flip",
    "reactive-shield",
    "pirouette",
    "fiery-retort",
    "knights-retaliation",
    "tangle-of-battle",
    "clever-gambit",
    "opportune-riposte",
    "dueling-riposte",
    "twin-riposte",
    "perfect-clarity",
    "furious-vengeance",
    "cringe",
    "storm-retribution",
    "courageous-opportunity",
    "attack-of-opportunity",
    "reactive-strike",
    "impossible-technique",
    "rippling-spin",
    "guardians-deflection-fighter",
    "guardians-deflection-swashbuckler",
    "stand-still",
    "no-escape",
    "verdistant-defense",
    "shield-warden-fighter",
    "shield-warden-champion",
    "eerie-flicker",
    "scars-of-steel",
    "sense-the-unseen",
    "shoving-sweep",
    "intercept-attack",
    "flashy-dodge",
    "hit-the-dirt",
    "deflect-arrow",
    "nights-warning",
    "blood-rising",
    "inked-panoply",
    "hunters-defense",
    "lucky-escape",
    "wood-ward",
    "deflecting-cloud",
    "reactive-charm",
    "instinctive-obfuscation",
    "reflective-defense",
    "disarming-smile",
    "crane-flutter",
    "everdistant-defense",
];

const movementTriggerBuiltinReactionIds = [
    "courageous-opportunity",
    "implements-interruption",
    "attack-of-opportunity",
    "reactive-strike",
    "shoving-sweep",
    "stand-still",
    "no-escape",
    "verdistant-defense",
];

const targetNotificationBuiltinReactionIds = [
    "nimble-dodge",
    "flashy-dodge",
    "airy-step",
    "farabellus-flip",
    "hit-the-dirt",
    "you-failed-to-account-for-this",
    "foresee-danger",
    "deflect-arrow",
    "nights-warning",
    "blood-rising",
    "inked-panoply",
    "hunters-defense",
    "lucky-escape",
    "wood-ward",
    "deflecting-cloud",
    "reactive-charm",
    "instinctive-obfuscation",
    "reflective-defense",
    "disarming-smile",
    "pirouette",
    "reactive-shield",
    "crane-flutter",
    "everdistant-defense",
    "ectoplasmic-shield",
];

const movementTriggerBuiltinReactionIdSet = new Set(movementTriggerBuiltinReactionIds);
const targetNotificationBuiltinReactionIdSet = new Set(targetNotificationBuiltinReactionIds);
const actionBuiltinReactionIdSet = new Set(actionBuiltinReactionIds);
const featBuiltinReactionIdSet = new Set(featBuiltinReactionIds);
const spellBuiltinReactionIdSet = new Set(spellBuiltinReactionIds);

function reactionNameFromId(id) {
    return id
        .split("-")
        .map((part) => {
            if (part === "youre") return "You're";
            if (part === "entitys") return "Entity's";
            if (part === "amulets") return "Amulet's";
            if (part === "guardians") return "Guardian's";
            if (part === "knights") return "Knight's";
            if (part === "orc") return "Orc";
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ");
}

const builtinReactionEntries = [
    ["opportune-backstab", opportuneBackstab],
    ["disarming-block", disarmingBlock],
    ["convincing-illusion", convincingIllusion],
    ["ring-bell", ringBell],
    ["youre-next", youreNext],
    ["mental-static", mentalStatic],
    ["premonition-of-clarity", premonitionOfClarity],
    ["grit-and-tenacity", gritAndTenacity],
    ["emergency-targe", emergencyTarge],
    ["schadenfreude", schadenfreude],
    ["ferocity", ferocity],
    ["orc-ferocity", orcFerocity],
    ["entitys-resurgence", entitysResurgence],
    ["final-spite", finalSpite],
    ["cheat-death", cheatDeath],
    ["cleave", cleave],
    ["shield-block", shieldBlock],
    ["banshee-cry", bansheeCry],
    ["electric-counter", electricCounter],
    ["all-in-my-head", allInMyHead],
    ["unexpected-shift", unexpectedShift],
    ["resounding-finale", resoundingFinale],
    ["reverberate", reverberate],
    ["verdant-presence", verdantPresence],
    ["align-ki", alignKi],
    ["mage-hunter", mageHunter],
    ["counter-thought", counterThought],
    ["accompany", accompany],
    ["spell-relay", spellRelay],
    ["you-failed-to-account-for-this", youFailedToAccountForThis],
    ["suspect-of-opportunity", suspectOfOpportunity],
    ["foresee-danger", foreseeDanger],
    ["mirror-shield", mirrorShield],
    ["spiritual-guides", spiritualGuides],
    ["squawk", squawk],
    ["sacrifice-armor", sacrificeArmor],
    ["reactive-transformation", reactiveTransformation],
    ["amulets-abeyance", amuletsAbeyance],
    ["retributive-strike", retributiveStrike],
    ["denier-of-destruction", denierOfDestruction],
    ["glimpse-of-redemption", glimpseOfRedemption],
    ["flash-of-grandeur", flashOfGrandeur],
    ["liberating-step", liberatingStep],
    ["fake-out", fakeOut],
    ["ruby-resurrection", rubyResurrection],
    ["rapid-response", rapidResponse],
    ["no", no],
    ["wounded-rage", woundedRage],
    ["negate-damage", negateDamage],
    ["distracting-explosion", distractingExplosion],
    ["embrace-the-pain", embraceThePain],
    ["reactive-gnaw", reactiveGnaw],
    ["retaliatory-cleansing", retaliatoryCleansing],
    ["iron-command", ironCommand],
    ["selfish-shield", selfishShield],
    ["destructive-vengeance", destructiveVengeance],
    ["nimble-dodge", nimbleDodge],
    ["ectoplasmic-shield", ectoplasmicShield],
    ["airy-step", airyStep],
    ["farabellus-flip", farabellusFlip],
    ["reactive-shield", reactiveShield],
    ["pirouette", pirouette],
    ["fiery-retort", fieryRetort],
    ["knights-retaliation", knightsRetaliation],
    ["tangle-of-battle", tangleOfBattle],
    ["clever-gambit", cleverGambit],
    ["opportune-riposte", opportuneRiposte],
    ["dueling-riposte", duelingRiposte],
    ["twin-riposte", twinRiposte],
    ["perfect-clarity", perfectClarity],
    ["avenging-bite", avengingBite],
    ["vengeful-spite", vengefulSpite],
    ["furious-vengeance", furiousVengeance],
    ["cringe", cringe],
    ["storm-retribution", stormRetribution],
    ["courageous-opportunity", courageousOpportunity],
    ["implements-interruption", implementsInterruption],
    ["attack-of-opportunity", attackOfOpportunity],
    ["reactive-strike", reactiveStrike],
    ["fast-swallow", fastSwallow],
    ["wicked-thorns", wickedThorns],
    ["impossible-technique", impossibleTechnique],
    ["rippling-spin", ripplingSpin],
    ["guardians-deflection-fighter", guardiansDeflectionFighter],
    ["guardians-deflection-swashbuckler", guardiansDeflectionSwashbuckler],
    ["stand-still", standStill],
    ["no-escape", noEscape],
    ["verdistant-defense", verdistantDefense],
    ["shield-warden-fighter", shieldWardenFighter],
    ["shield-warden-champion", shieldWardenChampion],
    ["eerie-flicker", eerieFlicker],
    ["scars-of-steel", scarsOfSteel],
    ["sense-the-unseen", senseTheUnseen],
    ["shoving-sweep", shovingSweep],
    ["intercept-attack", interceptAttack],
];

function getBuiltinReactionCategory(id) {
    if (actionBuiltinReactionIdSet.has(id)) {
        return "actions";
    }
    if (featBuiltinReactionIdSet.has(id)) {
        return "feats";
    }
    if (spellBuiltinReactionIdSet.has(id)) {
        return "spells";
    }
    return "other";
}

var allReactionsMap = Object.fromEntries(builtinReactionEntries);

const builtinReactionCatalog = Array.from(new Set([
    ...builtinReactionEntries.map(([id]) => id),
    ...targetNotificationBuiltinReactionIds,
])).map((id) => ({
    id,
    name: reactionNameFromId(id),
    category: getBuiltinReactionCategory(id),
    categoryLabelKey: BUILTIN_REACTION_CATEGORIES.find((category) => category.id === getBuiltinReactionCategory(id))?.labelKey,
    handler: allReactionsMap[id] ?? null,
    enabledByDefault: true,
}));

const builtinDirectReactionIds = builtinReactionCatalog
    .filter(({handler}) => !handler)
    .map(({id}) => id);

function getBuiltinReactionCatalog() {
    return builtinReactionCatalog.map((reaction) => ({...reaction}));
}

function getDefaultBuiltinReactionIds() {
    return builtinReactionCatalog.map(({id}) => id);
}

function getEnabledBuiltinReactionIds() {
    if (typeof game === "undefined" || !game?.settings?.get) {
        return getDefaultBuiltinReactionIds();
    }

    const enabledIds = game.settings.get("pf2e-reaction", BUILTIN_REACTION_SETTING_KEY);
    if (!Array.isArray(enabledIds)) {
        return getDefaultBuiltinReactionIds();
    }

    const enabledSet = new Set(enabledIds);
    return builtinReactionCatalog
        .filter(({id}) => enabledSet.has(id))
        .map(({id}) => id);
}

function isBuiltinReactionEnabled(id) {
    return new Set(getEnabledBuiltinReactionIds()).has(id);
}

function getEnabledBuiltinReactionMap() {
    const enabledSet = new Set(getEnabledBuiltinReactionIds());
    return Object.fromEntries(
        builtinReactionEntries.filter(([id]) => enabledSet.has(id)),
    );
}

function getBuiltinReactionSettingsGroups() {
    const enabledSet = new Set(getEnabledBuiltinReactionIds());

    return BUILTIN_REACTION_CATEGORIES
        .map((category) => ({
            ...category,
            reactions: builtinReactionCatalog
                .filter((reaction) => reaction.category === category.id)
                .map((reaction) => ({
                    ...reaction,
                    enabled: enabledSet.has(reaction.id),
                }))
                .sort((left, right) => left.name.localeCompare(right.name)),
        }))
        .map((category) => ({
            ...category,
            reactions: category.reactions.map((reaction) => ({...reaction})),
        }));
}

function syncBuiltinReactionsEnabledSetting() {
    if (typeof game === "undefined" || !game?.settings?.get || !game?.settings?.set) {
        return;
    }

    const enabledIds = game.settings.get("pf2e-reaction", BUILTIN_REACTION_SETTING_KEY);
    if (!Array.isArray(enabledIds)) {
        return;
    }

    const missingDirectIds = builtinDirectReactionIds.filter((id) => !enabledIds.includes(id));
    if (missingDirectIds.length === 0) {
        return;
    }

    game.settings.set("pf2e-reaction", BUILTIN_REACTION_SETTING_KEY, [...enabledIds, ...missingDirectIds]);
}
