//////////////////
// MODAL MODELS //
//////////////////

function modal_model() {

    // members
    this.type = ko.observable();
    this.title = ko.observable();
    this.text = ko.observable();
    this.visible = ko.observable();
    this.template = ko.observable();
    this.object = ko.observable();
    this.ok_text = ko.observable();
    this.cancel_text = ko.observable();
    var original_object;

    // ok
    this.ok = function() {};

    // cancel
    this.cancel = function() {
        this.hide();
    };

    // keypress
    this.keypress = function(data, e) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') this.ok();
        return true;
    }.bind(this);

    // hide
    this.hide = function() {
        this.visible(false);
    }.bind(this);

    // show
    this.show = function() {
        this.visible(true);
    }.bind(this);

    // reset
    this.reset = function() {
        this.type('text');
        this.title(null);
        this.text(null);
        this.visible(false);
        this.template(null);
        this.object(null);
        this.visible(false);
        this.ok_text('OK');
        this.cancel_text('CANCEL');
        this.original_object = null;
    }.bind(this);

    // initialize
    this.reset();

}

///////////
// READY //
///////////

$(function() {

    // create modal
    window.modal = new modal_model();
    // bind modal
    ko.applyBindings(window.modal, document.getElementById('modal'));

});