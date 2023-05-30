export default class FlipFormApplication extends FormApplication {
  constructor(obj) {
    super();
    this.object = obj;
    this.paths = this.object.object.flags?.['reaction-check']?.['tokens']?.['values'] ?? [this.object.token.texture.src];
    this.values = this.getPathObjs();
  }

  getPathObjs() {
    return this.paths.map((ce, index) => {
      return {
        'idx': index,
        'target': 'flipIcon-' + index,
        'path': ce
      };
    });
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      template: `modules/pf2e-reaction/templates/menu.hbs`,
      id: 'flip-form-application',
      width: '400',
      height: '300',
      title: "Flip Config",
    });
  }

    getData() {
        return { values: this.values };
    }

    close() {
        super.close();
        this.object.object.update({
                "flags.reaction-check.tokens.values": this.paths
        });
        this.object.object.update({
                "flags.reaction-check.tokens.idx": 0
        });
        if (this.paths.length > 0) {
            this.object.token.actor.update({"img": this.paths[0]});
        }
    }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.flip-save').click(async (event) => {
        this._updateObject('addRow', '');
    });
    html.find('.flip-delete').click(async (event) => {
        this._updateObject('deleteRow', null, $(event.currentTarget).data().idx);
    });
    html.find('input.image').change(async (event) => {
        this._updateObject('updateRow', event.target.value, $(event.currentTarget).data().idx);
    });
  }

  async _updateObject(event, val, idx) {
    if (event == 'addRow') {
        this.paths.push(val)
        this.values = this.getPathObjs();
        super.render()
    } else if (event == 'deleteRow') {
        this.paths.splice(idx, 1);
        this.values = this.getPathObjs();
        super.render()
    } else if (event == 'updateRow') {
        this.paths[idx] = val;
        this.values = this.getPathObjs();
    }
  }
}

