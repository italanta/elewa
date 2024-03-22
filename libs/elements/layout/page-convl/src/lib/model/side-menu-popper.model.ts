import { createPopper } from '@popperjs/core';

class PopperObject {
  instance: any;
  reference: any;
  popperTarget: any;

  constructor(reference: any, popperTarget: any) {
    this.init(reference, popperTarget);
  }

  init(reference: any, popperTarget: any) {
    this.reference = reference;
    this.popperTarget = popperTarget;
    this.instance = createPopper(this.reference, this.popperTarget, {
      placement: "right",
      strategy: "fixed",
      modifiers: [
        {
          name: "computeStyles",
          options: {
            adaptive: false
          }
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["left", "right"]
          }
        }
      ]
    });

    document.addEventListener(
      "click",
      (e) => this.clicker(e, this.popperTarget, this.reference),
      false
    );

    const ro = new ResizeObserver(() => {
      this.instance.update();
    });

    ro.observe(this.popperTarget);
    ro.observe(this.reference);
  }

  clicker(event: any, popperTarget: any, reference: any) {
    const SIDEBAR_EL = document.getElementById("sidebar");

    if (
      SIDEBAR_EL?.classList.contains("collapsed") &&
      !popperTarget.contains(event.target) &&
      !reference.contains(event.target)
    ) {
      this.hide();
    }
  }

  hide() {
    this.instance.state.elements.popper.style.visibility = "hidden";
  }
}

export class Poppers {

  subMenuPoppers: any = [];
  constructor() {
    this.init();
  }

  init() {

    const SUB_MENU_ELS = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu"
    );

    SUB_MENU_ELS.forEach((element) => {
      this.subMenuPoppers.push(
        new PopperObject(element, element.lastElementChild)
      );
      this.closePoppers();
    });
  }

  togglePopper(target: any) {
    if (window.getComputedStyle(target).visibility === "hidden")
      target.style.visibility = "visible";
    else target.style.visibility = "hidden";
  }

  updatePoppers() {
    this.subMenuPoppers.forEach((element: any) => {
      element.instance.state.elements.popper.style.display = "none";
      element.instance.update();
    });
  }

  closePoppers() {
    this.subMenuPoppers.forEach((element: any) => {
      element.hide();
    });
  }
}