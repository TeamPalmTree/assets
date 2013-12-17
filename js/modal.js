//////////////////
// MODAL MODELS //
//////////////////

function modal_model() {

    // members
    this.type = ko.observable();
    this.value = ko.observable();
    this.title = ko.observable();
    this.text = ko.observable();
    this.placeholder = ko.observable();
    this.visible = ko.observable();
    this.ok_text = ko.observable();
    this.cancel_text = ko.observable();

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
        this.value(null);
        this.title(null);
        this.text(null);
        this.visible(false);
        this.placeholder(false);
        this.ok_text('OK');
        this.cancel_text('CANCEL');
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