function navigation_model() {

    this.section_name = ko.observable();

};

$(function() {

    // create navigation
    window.navigation = new navigation_model();
    // bind navigation
    ko.applyBindings(window.navigation, document.getElementById('navigation'));

});