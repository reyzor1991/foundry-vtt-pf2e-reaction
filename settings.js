export default class Settings {
    static get squareSize() {
        return game.settings.get("pf2e-reaction", "squareSize");
    }
    static register() {
        game.settings.register("pf2e-reaction", "squareSize", {
            name: game.i18n.localize("pf2e-reaction.squareSize.name"),
            hint: game.i18n.localize("pf2e-reaction.squareSize.hint"),
            scope: "world",
            config: true,
            default: 100,
            type: Number,
        });
    }

}