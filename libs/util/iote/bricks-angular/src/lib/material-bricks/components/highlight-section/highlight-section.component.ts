import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-highlight-section',
  templateUrl: './highlight-section.component.html',
  styleUrls: ['./highlight-section.component.scss']
})
export class AppHighlightComponent
{
  @Input() color: string;
  @Input() bgColor: string;

  headerStyle()
  {
    let colorSt = {};
    let bgColorSt = {};

    if (this.color)
      colorSt = { 'color': this.color };

    if (this.bgColor)
      bgColorSt = { 'background-color': this.bgColor };

    return {... colorSt, ... bgColorSt };
  }

  bodyStyle()
  {
    let bgColorSt = {};

    if (this.bgColor)
      bgColorSt = { 'background-color': this._shadeColor(this.bgColor, 0.6) };

    return {... bgColorSt };
  }

  // src: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  private _shadeColor(color: any, percent: any)
  {
    const f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255,
                    // tslint:disable-next-line:no-bitwise
                    p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
  }

}
