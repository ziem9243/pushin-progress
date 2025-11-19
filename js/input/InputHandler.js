const InputHandler = {
  handleKeyPress() {
    if (key === ' ' || keyCode === 65) {
      GameLogic.ageUp();
    }
  },
  
  handleMouseClick() {
    if (GameState.currentPrompt !== -1) return;
    if (GameState.moves <= 0) return;
    
    for (let i = 0; i < UIConfig.buttons.length; i++) {
      const b = UIConfig.buttons[i];
      if (UIHelper.inside(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
        GameState.menuOn = i;
        GameState.scrollOffset = 0;
        break;
      }
    }
  },
  
  handleMouseWheel(event) {
    if (GameState.menuOn === -1) return;
    
    const listLengths = [
      GameData.lists.eduList.length,
      GameData.lists.jobList.length,
      GameData.lists.actList.length,
      GameData.lists.relationShips.length,
      GameData.lists.homeList.length,
      GameData.lists.healthcareList.length
    ];
    
    const space = listLengths[GameState.menuOn] * 18;
    const clipH = UIConfig.menuHeight - 50;
    const overflow = space > (clipH - 30);
    
    if (overflow) {
      GameState.scrollOffset += event.delta;
      GameState.scrollOffset = constrain(GameState.scrollOffset, 0, space - (clipH - 30));
    }
  },
  
  handleMousePressed() {
    if (UIHelper.inside(mouseX, mouseY, UIConfig.scrollbarX, UIConfig.scrollbarY, 
                        UIConfig.scrollbarW, UIConfig.scrollbarH)) {
      GameState.draggingScrollbar = true;
    }
  },
  
  handleMouseReleased() {
    GameState.draggingScrollbar = false;
  }
};