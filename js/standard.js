// component model
function Component_Model() {

    // members
    this.id = ko.observable();

};

// refresh
Component_Model.prototype.refresh = function() {};
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

    // self
    var self = this;
    // inherit
    Component_Model.call(this);
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
        self.hide();
    };

    // keypress
    this.keypress = function(data, e) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') self.ok();
        return true;
    };

    // hide
    this.hide = function() {
        self.visible(false);
    };

    // show
    this.show = function() {
        self.visible(true);
    };

    // reset
    this.reset = function() {
        self.type('text');
        self.title(null);
        self.text(null);
        self.visible(false);
        self.template(null);
        self.object(null);
        self.visible(false);
        self.ok_text('OK');
        self.cancel_text('CANCEL');
        self.original_object = null;
    };

    // initialize
    this.initialize = function() {
        // base call
        Component_Model.prototype.initialize.call(self);
        // reset us
        self.reset();
    };

};

// navigation model prototype
Modal_Model.prototype = Object.create(Component_Model.prototype);
Modal_Model.prototype.constructor = Modal_Model;

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
    this.initialize_component = function(id, model) {

        // see if we were given a model
        if (model === undefined)
            model = Helper.ucfirst(id) + '_Model';
        // get the model
        if (window[model] === undefined)
            return;
        // verify model exists
        if (typeof(window[model]) !== 'function')
            return;

        // convert id
        var component_id = id.replace('-', '_');

        var component;
        // if we already have the component model, rebind
        if (!self.hasOwnProperty(component_id)) {
            // create component
            component = new window[model]();
            // set component id
            component.id(id);
            // add component to components for global access
            self[component_id] = component;
        } else {
            // hydrate component
            component = self[component_id];
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
