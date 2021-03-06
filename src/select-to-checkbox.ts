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
($.fn as any).selectToCheckbox = function (this: JQuery, args: Args): any {
    let target = this;
    // merge the global options with the per-call options.
    args = $.extend({}, ($.fn as any).selectToCheckbox.args, args);

    // factory defaults
    if (typeof args.allowEnablingAndDisabling === 'undefined') args.allowEnablingAndDisabling = true;
    if (typeof args.items === 'undefined') args.items = new Array();

    let selectToCheckbox = new SelectToCheckbox(target, args);
  
    const stc = $(selectToCheckbox.getRootElement());
    target.replaceWith(stc);
    
    var methods = {
        hasOption: function(value: string):boolean {
            return selectToCheckbox.hasOption(value);
        },
        selectOption: function(value: string):void {
            selectToCheckbox.selectOption(value);
        },
        deselectOption: function(value: string):void {
            selectToCheckbox.deselectOption(value);
        },
        isOptionSelected: function(value: string):boolean {
            return selectToCheckbox.isOptionSelected(value);
        },
        enableOption: function(value: string):void {
            selectToCheckbox.enableOption(value);
        },
        disableOption: function(value: string):void {
            selectToCheckbox.disableOption(value);
        },
        isOptionDisabled: function(value: string):boolean {
            return selectToCheckbox.isOptionDisabled(value);
        },
        enable: function():void {
            selectToCheckbox.enable();
        },
        disable: function():void {
            selectToCheckbox.disable();
        },
        getSelectedOptionsAsJson: function(includeDisabled = true):string {
            return selectToCheckbox.getSelectedOptionsAsJson(includeDisabled);
        }
    };
    return methods;
};

// define the plugin's global default options.
($.fn as any).selectToCheckbox.args = {};