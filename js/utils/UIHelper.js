const UIHelper = {
  inside(mx, my, x, y, w, h) {
    return mx > x && mx < x + w && my > y && my < y + h;
  },
  
  mouseJustClicked() {
    return mouseIsPressed && !GameState.mouseWasPressedLastFrame;
  }
};