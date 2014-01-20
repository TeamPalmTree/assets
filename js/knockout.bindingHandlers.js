// validate
ko.bindingHandlers['validate'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        // get values
        var errors = valueAccessor()();
        var allBindings = allBindings();
        var validateFor = allBindings.validateFor;
        var validateAlert = allBindings.validateAlert;

        // make sure the root has errors
        if (!errors)
            return;

        // get the element's field name
        var fieldName = validateFor ? validateFor : $(element).attr('name');
        // see if our field is in the errors list
        var has_error = errors.hasOwnProperty(fieldName);

        // standard validation
        if (!validateFor) {

            // get ascendant form group
            var group = $(element).closest('.form-group');
            // verify we have
            if (!group)
                return;

            // clear out help blocks
            group.find('.help-block').remove();
            // do we have an error
            if (has_error) {

                // highlight control group
                if (!group.hasClass('has-error'))
                    group.addClass('has-error');
                // generate help block
                var helpBlockHTML = '<span class="help-block">' + errors[fieldName] + '</span>';
                // add help block
                $(element).after(helpBlockHTML);

            } else {

                // remove all has-errors
                group.removeClass('has-error');

            }

        } else {

            // do we have an error
            if (has_error) {

                // alert or text
                if (validateAlert)
                    $(element).addClass('alert').addClass('alert-danger');
                else
                    $(element).addClass('text-danger');
                // set message
                $(element).html(errors[fieldName]);

            } else {

                // alert or text
                if (validateAlert)
                    $(element).removeClass('alert').removeClass('alert-danger');
                else
                    $(element).removeClass('text-danger');

                // set message
                $(element).html('');
            }

        }
    }
};

// typeahead
ko.bindingHandlers['numChecked'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        // get value
        var value = valueAccessor();
        // update value to normal
        if (value() == '1')
            value(true);
        else
            value(false);

        // forward to standard checked
        ko.bindingHandlers.checked.init(element, valueAccessor, allBindings, viewModel, bindingContext);

    }
};


// now value
ko.bindingHandlers['immediate'] = {
    inject: function(allBindings) {
        return {
            has: function (bindingKey) {
                return (bindingKey == 'valueUpdate') || allBindings.has(bindingKey);
            },
            get: function (bindingKey) {
                var binding = allBindings.get(bindingKey);
                if (bindingKey == 'valueUpdate') {
                    binding = binding ? [].concat(binding, 'afterkeydown') : 'afterkeydown';
                }
                return binding;
            }
        }
    },
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // set up value binding
        ko.bindingHandlers.value.init(element, valueAccessor, ko.bindingHandlers['immediate'].inject(allBindings), viewModel, bindingContext);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // set up value binding
        ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
};

// date time picker
ko.bindingHandlers['datetimepicker'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // get options
        var options = allBindings.get('datetimepickerOptions');
        // extend options with defaults
        options = jQuery.extend(
            {
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true
            },
            options);
        // call bootstrap datetimepicker
        $(element).datetimepicker(options);
        // set up value binding
        ko.bindingHandlers.value.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // set up value binding
        ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
};

// tablesorter
ko.bindingHandlers['tablesorter'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // get options
        var options = allBindings.tablesorterOptions;
        // call jquery tablesorter
        $(element).tablesorter(options);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // create the dependency
        var data = ko.utils.unwrapObservable(valueAccessor());
        var resort = true;
        $(element).trigger('destroy');
        $(element).tablesorter();
    }
};

ko.bindingHandlers.scrollTo = {
    update: function(element, valueAccessor) {
        if (ko.utils.unwrapObservable(valueAccessor())) {
            element.scrollIntoView();
            valueAccessor(false);
        }
    }
};

// typeahead
ko.bindingHandlers['typeaheadJS'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // get options
        var options = allBindings.get('typeaheadJSOptions');
        // call bootstrap typeahead
        $(element).typeahead(options).on('typeahead:selected', function(obj, datum){
            valueAccessor()(datum.value);
        });
        // set up value binding
        ko.bindingHandlers.value.init(element, valueAccessor, allBindings, viewModel, bindingContext);

    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // set up value binding
        ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
};

// show modal
ko.bindingHandlers.modal = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.unwrap(value)) {
            $(element).modal('show');
            // find input
            var input = $(element).find('input').first();
            if (!input) return;
            // focus and go to end of input
            input.focus();
            input.val(input.val());
        } else
            $(element).modal('hide');
    }
};