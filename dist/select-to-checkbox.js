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
import $ from 'jquery';
import SelectToCheckbox from './SelectToCheckbox';
// define the plugin function on the jQuery extension point.
$.fn.selectToCheckbox = function (args) {
    var target = this;
    // merge the global options with the per-call options.
    args = $.extend({}, $.fn.selectToCheckbox.args, args);
    // factory defaults
    if (typeof args.allowEnablingAndDisabling === 'undefined')
        args.allowEnablingAndDisabling = true;
    if (typeof args.items === 'undefined')
        args.items = new Array();
    var selectToCheckbox = new SelectToCheckbox(target, args);
    var stc = $(selectToCheckbox.getRootElement());
    target.replaceWith(stc);
    var methods = {
        hasOption: function (value) {
            return selectToCheckbox.hasOption(value);
        },
        selectOption: function (value) {
            selectToCheckbox.selectOption(value);
        },
        deselectOption: function (value) {
            selectToCheckbox.deselectOption(value);
        },
        isOptionSelected: function (value) {
            return selectToCheckbox.isOptionSelected(value);
        },
        enableOption: function (value) {
            selectToCheckbox.enableOption(value);
        },
        disableOption: function (value) {
            selectToCheckbox.disableOption(value);
        },
        isOptionDisabled: function (value) {
            return selectToCheckbox.isOptionDisabled(value);
        },
        enable: function () {
            selectToCheckbox.enable();
        },
        disable: function () {
            selectToCheckbox.disable();
        },
        getSelectedOptionsAsJson: function (includeDisabled) {
            if (includeDisabled === void 0) { includeDisabled = true; }
            return selectToCheckbox.getSelectedOptionsAsJson(includeDisabled);
        }
    };
    // store applied element
    $.fn.selectToCheckbox.applied.push(methods);
    return methods;
};
// activate plugin by targeting selector
$(function () {
    // factory defaults
    var selector = typeof $.fn.selectToCheckbox.selector === 'undefined' ? 'select.stc' : $.fn.selectToCheckbox.selector;
    // target
    var s = $(selector);
    s.each(function (i, e) {
        $(e).selectToCheckbox();
    });
});
// store collection of applied elements
$.fn.selectToCheckbox.applied = new Array();
// define the plugin's global default selector.
$.fn.selectToCheckbox.selector = undefined;
// define the plugin's global default options.
$.fn.selectToCheckbox.args = {};
//# sourceMappingURL=select-to-checkbox.js.map