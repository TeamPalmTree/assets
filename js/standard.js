// component model
function Component_Model() {

    // members
    this.id = ko.observable();

};

// refresh
Component_Model.prototype.refresh = function() {

};

// initialize
Component_Model.prototype.initialize = function() {

    // self
    var self = this;
    // get element
    var element = document.getElementById(self.id());
    // transfer element data tags to self
    $.each($(element).data(), function(index, value) {
        if (ko.isObservable(self[index]))
            self[index](value);
        else
            self[index] = value;
    });

    // refresh
    this.refresh();
    // apply knockout bindings
    ko.applyBindings(self, element);

};


// modal model
function Modal_Model() {

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

};

// navigation model
function Navigation_Model() {

    // inherit component model
    Component_Model.call(this);
    // members
    this.section_name = ko.observable();

};

// navigation model prototype
Navigation_Model.prototype = Object.create(Component_Model.prototype);
Navigation_Model.prototype.constructor = Navigation_Model;

// standard model
function Standard_Model() {

    // self
    var self = this;

    // local navigation
    this.navigate = function(url, replace) {

        // verify we aren't going to ourselves
        if (url == window.location.pathname)
            return;
        // update browser url
        if (replace)
            window.history.pushState({}, '', url);
        // generate body url
        var section_url = url + '?section_only=1';
        // load html into section body
        $('div.standard-section').load(section_url, function() {
            // update newly loaded links with navigate function
            $('div.standard-section a.local').click(self.click_link);
        });

    };

    // local link click
    this.click_link = function(event) {

        // prevent default link action
        event.preventDefault();
        // get url
        var url = $(this).attr('href');
        // navigate
        self.navigate(url, true);

    };

    // add standard component interface
    this.add_component = function(id, model) {

        // get the model
        if (window[model] === undefined)
            return;
        // verify model exists
        if (typeof(window[model]) !== 'function')
            return;

        var component;
        // if we already have the component model, rebind
        if (!self.hasOwnProperty(id)) {
            // create component
            component = new window[model]();
            // set component id
            component.id(id);
            // add component to components for global access
            self[id] = component;
        } else {
            // hydrate component
            component = self[id];
        }

        // initialize component
        component.initialize();

    };

};

// links
$(function() {

    // create new standard model
    window.standard = new Standard_Model();
    // set up all a local links to navigate function
    $('a.local').click(window.standard.click_link);
    // back button listener
    window.addEventListener("popstate", function() {
        window.standard.navigate(location.pathname);
    });

});
