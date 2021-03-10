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

const NULL_OPTION = new class implements Option {
    public select(): void {}
    public deselect(): void {}
    public enable(): void {}
    public disable(): void {}
    public isSelected(): boolean {return false;}
    public isDisabled(): boolean {return false;}
    public getListItem(): HTMLElement {return document.createElement('div');}
    public getLabel(): string {return 'NULL_OPTION'}
    public getValue(): string {return 'NULL_OPTION'}
}

interface Option {
    select(): void;
    deselect(): void;
    enable(): void;
    disable(): void;
    isSelected(): boolean;
    isDisabled(): boolean;
    getListItem(): HTMLElement
    getLabel(): string;
    getValue(): string;
}

export default class SelectToCheckbox {

    private static createOptions(stc: SelectToCheckbox, name: string, type: string, htmlOptions: Array<HTMLOptionElement>, jsOptions: Array<[label:string, value:string, selected?:boolean, disabled?:boolean]>): Array<Option> {
        let htmloptions =  htmlOptions.map((o, i) => {
            SelectToCheckbox.checkValue(o.value, o.label);
            return new SelectToCheckbox.SingleOption(stc, i, name, o.label, o.value, type, o.defaultSelected, o.disabled);
        });
        let j = htmlOptions.length;
        let jsoptions = jsOptions.map((o, i) => {
            let label: string = o[0];
            let value: string = o[1];
            let selected: boolean = o[2];
            let disabled: boolean = o[3];
            SelectToCheckbox.checkValue(value, label);
            return new SelectToCheckbox.SingleOption(stc, j+i, name, label, value, type, selected, disabled);

        });
        let opts = htmloptions.concat(jsoptions);
        let counts: any = {};
        opts.forEach((o) => {
            let v: string = o.getValue();
            if (counts[v] === undefined) {
                counts[v] = 1;
            } else {
                throw new Error("Duplicate value: " + o.getValue() + " (" + o.getLabel() + ")");
            }
        });
        return opts;
    }

    private static checkValue(value:string, label:string):void {
        if (value === "") {
            throw new Error("Option " + label + " does not have an associated value.");
        }
    }

    private static SingleOption = class implements Option {
        protected div: HTMLDivElement;
        protected inputElement: HTMLInputElement;
        protected labelFor: HTMLLabelElement;
        protected stc: SelectToCheckbox;
    
        constructor(stc: SelectToCheckbox, row: number, name:string, label: string, value: string, type: string, checked: boolean, disabled: boolean) {
            this.stc = stc;
            this.div = document.createElement('div');
            this.inputElement = document.createElement('input');
            this.inputElement.type = type;
            let id: string = name + '-' + row.toString();
            let nchbx: string = id + '-i';
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
    
        public select(): void {
            this.inputElement.checked = true;
        }
    
        public deselect(): void {
            this.inputElement.checked = false;
        }
    
        public enable(): void {
            this.inputElement.disabled = false;
        }
    
        public disable(): void {
            this.inputElement.disabled = true;
        }
    
        public isSelected(): boolean {
            return this.inputElement.checked;
        }
    
        public isDisabled(): boolean {
            return this.inputElement.disabled;
        }
    
        public getListItem(): HTMLElement {
            return this.div;
        }

        public getLabel(): string {
            return this.labelFor.textContent;
        }
    
        public getValue(): string {
            return this.inputElement.value;
        }
    }

    private div: HTMLElement;
    private options: Array<Option>;
    private previouslyEnabledOptions: Array<Option>;
    private allowEnablingAndDisabling: boolean;
    private disabled: boolean;
    private name: string;

    constructor (selectTarget: JQuery<HTMLElement>, args: Args) {
        let t = selectTarget.get(0);
        if (!(t instanceof HTMLSelectElement)) {
            throw new Error("JQuery target must be a select element.");
        }
        let select: HTMLSelectElement = t;
        this.name = select.name;
        if (!this.name) {
            throw new Error("Select element must have a name attribute.");
        }
        let type: string = select.multiple ? "checkbox" : "radio";
        this.disabled = select.disabled;
        this.allowEnablingAndDisabling = args.allowEnablingAndDisabling;
        this.div = document.createElement('div');
        this.div.className = select.className;
        if (!this.div.classList.contains('stc') )
            this.div.classList.add('stc');
        this.div.id = select.id;

        // items
        let array: Array<HTMLOptionElement> = selectTarget.find('option').toArray();
        this.options = SelectToCheckbox.createOptions(this, this.name, type, array, args.items);
        this.options.forEach((o: Option) => this.div.append(o.getListItem()));

        if (this.isDisabled()) {
            this.disableNoPermissionCheck();
        }
    }

    private isEnablingAndDisablingPermitted(): boolean {
        return this.allowEnablingAndDisabling;
    }

    public getRootElement(): HTMLElement {
        return this.div;
    }

    public hasOption(value: string): boolean {
        return this.getOption(value) !== NULL_OPTION;
    }

    private getOption(value: string): Option {
        for (const o of this.options) {
            if (o.getValue() == value) {
                return o;
            }
        }
        return NULL_OPTION;
    }

    public selectOption(value: string): void {
        if (this.isDisabled()) return;
        this.getOption(value).select();
    }

    public deselectOption(value: string): void {
        if (this.isDisabled()) return;
        this.getOption(value).deselect();
    }

    public isOptionSelected(value: string): boolean {
        return this.getOption(value).isSelected();
    }

    public enableOption(value: string): void {
        if (this.isDisabled()) return;
        this.getOption(value).enable();
    }

    public disableOption(value: string): void {
        if (this.isDisabled()) return;
        this.getOption(value).disable();
    }

    public isOptionDisabled(value: string): boolean {
        return this.getOption(value).isDisabled();
    }

    public disable(): void {
        if (!this.isEnablingAndDisablingPermitted()) return;
        if (this.isDisabled()) return;
        this.disableNoPermissionCheck();
    }

    private disableNoPermissionCheck(): void {
        this.previouslyEnabledOptions = this.options.filter((o) => !o.isDisabled());
        this.options.forEach((o) => o.disable());
        this.disabled = true;
        this.div.classList.add('disabled');
    }

    public enable(): void {
        if (!this.isEnablingAndDisablingPermitted()) return;
        if (!this.isDisabled()) return;
        this.disabled = false;
        this.div.classList.remove('disabled');
        this.previouslyEnabledOptions.forEach((o) => o.enable());
    }

    public isDisabled(): boolean {
        return this.disabled;
    }

    public selectAll(): void {
        if (this.isDisabled()) return;
        this.options.forEach((o) => o.select())
    }

    public deselectAll(): void {
        if (this.isDisabled()) return;
        this.options.forEach((o) => o.deselect())
    }

    private getSelectedOptions(includeDisabled = true): Array<Option> {
        let a = this.options;
        if (!includeDisabled) {
            if (this.isDisabled()) {
                return new Array();
            }
            a = a.filter((o) => !o.isDisabled());
        }
        a = a.filter((o) => o.isSelected());
        return a;
    }

    public getSelectedOptionsAsJson(includeDisabled = true): string {
        const data: any = {};
        let a: Array<string> = this.getSelectedOptions(includeDisabled).map((o) => o.getValue());
        data[this.name] = a;
        let c = JSON.stringify(data, null, "  ");
        return c;
    }
}