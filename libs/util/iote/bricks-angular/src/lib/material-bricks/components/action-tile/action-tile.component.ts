import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * An Action Tile is a custom component used to display rich media about a certain object
 */
@Component({
    selector: "app-action-tile",
    templateUrl: "./action-tile.component.html",
    styleUrls: ["./action-tile.component.scss"]
})
export class ActionTileComponent {
    // Override block with better typing
    @Input() label: string;

    @Input() iconUrl: string;
    @Input() icon: string; // Use for when using font awesome
    @Input() text: string;

    @Input() slug: string;
    @Input() color: string;

    @Input() type = "normal"; // Used as a css class. E.g. short

    @Output() action = new EventEmitter();

    @Input() disabled = false;

    private _showHoverClass = false;

    doAction() {
        if (!this.disabled) {
            this.action.emit();
        }
    }

    getClasses() {
        // Type of tile is always added as class
        let classes = this.type;

        if (this.slug != null) {
            classes += " " + this.slug + "-background";
        }

        // No hover elevation    Hover elevation
        classes += !this._showHoverClass
            ? " mat-elevation-z2"
            : " mat-elevation-z10";

        return classes;
    }

    // src: https://stackoverflow.com/questions/40514642/how-to-pass-object-to-ngstyle-directive-in-angular-2
    getStyles() {
        const styles = {} as any;

        if (this.color != null)
            styles['background-color'] = this.color;

        return styles;
    }

    toggleHoverStyle($event: any) {
        this._showHoverClass = $event.type === "mouseover";
    }
}
