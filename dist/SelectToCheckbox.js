/*!
 *  Convert select element to checkboxes or radio buttons jQuery plugin.
 *  Copyright (C) 2021  Andrew Wagner  github.com/andreww1011
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
 *  USA
 */
var NULL_OPTION = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.select = function () { };
    class_1.prototype.deselect = function () { };
    class_1.prototype.enable = function () { };
    class_1.prototype.disable = function () { };
    class_1.prototype.isSelected = function () { return false; };
    class_1.prototype.isDisabled = function () { return false; };
    class_1.prototype.getListItem = function () { return document.createElement('div'); };
    class_1.prototype.getLabel = function () { return 'NULL_OPTION'; };
    class_1.prototype.getValue = function () { return 'NULL_OPTION'; };
    return class_1;
}());
var SelectToCheckbox = /** @class */ (function () {
    function SelectToCheckbox(selectTarget, args) {
        var _this = this;
        var t = selectTarget.get(0);
        if (!(t instanceof HTMLSelectElement)) {
            throw new Error("JQuery target must be a select element.");
        }
        var select = t;
        this.name = select.name;
        if (!this.name) {
            throw new Error("Select element must have a name attribute.");
        }
        var type = select.multiple ? "checkbox" : "radio";
        this.disabled = select.disabled;
        this.allowEnablingAndDisabling = args.allowEnablingAndDisabling;
        this.div = document.createElement('div');
        this.div.className = select.className + " stc";
        this.div.id = select.id;
        // items
        var array = selectTarget.find('option').toArray();
        this.options = SelectToCheckbox.createOptions(this, this.name, type, array, args.items);
        this.options.forEach(function (o) { return _this.div.append(o.getListItem()); });
        if (this.isDisabled()) {
            this.disableNoPermissionCheck();
        }
    }
    SelectToCheckbox.createOptions = function (stc, name, type, htmlOptions, jsOptions) {
        var htmloptions = htmlOptions.map(function (o, i) {
            SelectToCheckbox.checkValue(o.value, o.label);
            return new SelectToCheckbox.SingleOption(stc, i, name, o.label, o.value, type, o.defaultSelected, o.disabled);
        });
        var j = htmlOptions.length;
        var jsoptions = jsOptions.map(function (o, i) {
            var label = o[0];
            var value = o[1];
            var selected = o[2];
            var disabled = o[3];
            SelectToCheckbox.checkValue(value, label);
            return new SelectToCheckbox.SingleOption(stc, j + i, name, label, value, type, selected, disabled);
        });
        var opts = htmloptions.concat(jsoptions);
        var counts = {};
        opts.forEach(function (o) {
            var v = o.getValue();
            if (counts[v] === undefined) {
                counts[v] = 1;
            }
            else {
                throw new Error("Duplicate value: " + o.getValue() + " (" + o.getLabel() + ")");
            }
        });
        return opts;
    };
    SelectToCheckbox.checkValue = function (value, label) {
        if (value === "") {
            throw new Error("Option " + label + " does not have an associated value.");
        }
    };
    SelectToCheckbox.prototype.isEnablingAndDisablingPermitted = function () {
        return this.allowEnablingAndDisabling;
    };
    SelectToCheckbox.prototype.getRootElement = function () {
        return this.div;
    };
    SelectToCheckbox.prototype.hasOption = function (value) {
        return this.getOption(value) !== NULL_OPTION;
    };
    SelectToCheckbox.prototype.getOption = function (value) {
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o.getValue() == value) {
                return o;
            }
        }
        return NULL_OPTION;
    };
    SelectToCheckbox.prototype.selectOption = function (value) {
        if (this.isDisabled())
            return;
        this.getOption(value).select();
    };
    SelectToCheckbox.prototype.deselectOption = function (value) {
        if (this.isDisabled())
            return;
        this.getOption(value).deselect();
    };
    SelectToCheckbox.prototype.isOptionSelected = function (value) {
        return this.getOption(value).isSelected();
    };
    SelectToCheckbox.prototype.enableOption = function (value) {
        if (this.isDisabled())
            return;
        this.getOption(value).enable();
    };
    SelectToCheckbox.prototype.disableOption = function (value) {
        if (this.isDisabled())
            return;
        this.getOption(value).disable();
    };
    SelectToCheckbox.prototype.isOptionDisabled = function (value) {
        return this.getOption(value).isDisabled();
    };
    SelectToCheckbox.prototype.disable = function () {
        if (!this.isEnablingAndDisablingPermitted())
            return;
        if (this.isDisabled())
            return;
        this.disableNoPermissionCheck();
    };
    SelectToCheckbox.prototype.disableNoPermissionCheck = function () {
        this.previouslyEnabledOptions = this.options.filter(function (o) { return !o.isDisabled(); });
        this.options.forEach(function (o) { return o.disable(); });
        this.disabled = true;
        this.div.classList.add('disabled');
    };
    SelectToCheckbox.prototype.enable = function () {
        if (!this.isEnablingAndDisablingPermitted())
            return;
        if (!this.isDisabled())
            return;
        this.disabled = false;
        this.div.classList.remove('disabled');
        this.previouslyEnabledOptions.forEach(function (o) { return o.enable(); });
    };
    SelectToCheckbox.prototype.isDisabled = function () {
        return this.disabled;
    };
    SelectToCheckbox.prototype.selectAll = function () {
        if (this.isDisabled())
            return;
        this.options.forEach(function (o) { return o.select(); });
    };
    SelectToCheckbox.prototype.deselectAll = function () {
        if (this.isDisabled())
            return;
        this.options.forEach(function (o) { return o.deselect(); });
    };
    SelectToCheckbox.prototype.getSelectedOptions = function (includeDisabled) {
        if (includeDisabled === void 0) { includeDisabled = true; }
        var a = this.options;
        if (!includeDisabled) {
            if (this.isDisabled()) {
                return new Array();
            }
            a = a.filter(function (o) { return !o.isDisabled(); });
        }
        a = a.filter(function (o) { return o.isSelected(); });
        return a;
    };
    SelectToCheckbox.prototype.getSelectedOptionsAsJson = function (includeDisabled) {
        if (includeDisabled === void 0) { includeDisabled = true; }
        var data = {};
        var a = this.getSelectedOptions(includeDisabled).map(function (o) { return o.getValue(); });
        data[this.name] = a;
        var c = JSON.stringify(data, null, "  ");
        return c;
    };
    SelectToCheckbox.SingleOption = /** @class */ (function () {
        function class_2(stc, row, name, label, value, type, checked, disabled) {
            this.stc = stc;
            this.div = document.createElement('div');
            this.inputElement = document.createElement('input');
            this.inputElement.type = type;
            var id = name + '-' + row.toString();
            var nchbx = id + '-i';
            this.inputElement.id = nchbx;
            this.inputElement.name = name;
            this.inputElement.value = value;
            this.inputElement.checked = checked;
            this.inputElement.disabled = disabled;
            this.labelFor = document.createElement('label');
            this.labelFor.htmlFor = nchbx;
            this.labelFor.textContent = label;
            this.div.className = 'custom-control';
            this.inputElement.className = 'custom-control-input custom-' + type;
            this.labelFor.className = 'custom-control-label';
            this.div.append(this.inputElement, this.labelFor);
        }
        class_2.prototype.select = function () {
            this.inputElement.checked = true;
        };
        class_2.prototype.deselect = function () {
            this.inputElement.checked = false;
        };
        class_2.prototype.enable = function () {
            this.inputElement.disabled = false;
        };
        class_2.prototype.disable = function () {
            this.inputElement.disabled = true;
        };
        class_2.prototype.isSelected = function () {
            return this.inputElement.checked;
        };
        class_2.prototype.isDisabled = function () {
            return this.inputElement.disabled;
        };
        class_2.prototype.getListItem = function () {
            return this.div;
        };
        class_2.prototype.getLabel = function () {
            return this.labelFor.textContent;
        };
        class_2.prototype.getValue = function () {
            return this.inputElement.value;
        };
        return class_2;
    }());
    return SelectToCheckbox;
}());
export default SelectToCheckbox;
//# sourceMappingURL=SelectToCheckbox.js.map