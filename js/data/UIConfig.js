/**
 * holds all the ui-related constants and layout settings.
 * these don't change during gameplay - they're just the
 * design rules for how menus, scrollbars, and buttons look.
 */
const UIConfig = {
  /**
   * how fast the menu scrolls when using the mouse wheel.
   * higher number = faster movement.
   * @type {number}
   */
  scrollSpeed: 15,

  /**
   * default height for the menu panel.
   * this helps keep the layout consistent even if content changes.
   * @type {number}
   */
  menuHeight: 300,

  /**
   * x-position of the scrollbar.
   * fixed so the scrollbar always sits beside the menu.
   * @type {number}
   */
  scrollbarX: 440,

  /**
   * y-position of the scrollbar.
   * lines up with the top of the menu area.
   * @type {number}
   */
  scrollbarY: 90,

  /**
   * width of the scrollbar track.
   * usually pretty small since it doesn't need much space.
   * @type {number}
   */
  scrollbarW: 10,

  /**
   * height of the scrollbar track.
   * should match the visible menu area so it scrolls correctly.
   * @type {number}
   */
  scrollbarH: 250,

  /**
   * the clickable buttons along the sidebar or top menu.
   * x/y/w/h get filled in during layout, so they start at 0.
   * @type {{name: string, x: number, y: number, w: number, h: number}[]}
   */
  buttons: [
    { name: "Education (5+)", x: 0, y: 0, w: 0, h: 0 },
    { name: "Jobs (16+)", x: 0, y: 0, w: 0, h: 0 },
    { name: "Activities", x: 0, y: 0, w: 0, h: 0 },
    { name: "Relationships", x: 0, y: 0, w: 0, h: 0 },
    { name: "Homes (18+)", x: 0, y: 0, w: 0, h: 0 },
    { name: "Healthcare", x: 0, y: 0, w: 0, h: 0 }
  ]
};
