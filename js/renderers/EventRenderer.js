const EventRenderer = {
  drawEvent(info) {
    push();
    
    const panelW = 340;
    const panelX = (width - panelW) / 2;
    const panelY = 80;
    const headerHeight = 60;
    const panelH = 230;
    
    const optionX = panelX + 10;
    const optionW = panelW - 20;
    const optionH = 20;
    const optionGap = 6;
    const firstOptionY = panelY + headerHeight + 20;
    
    stroke(10);
    fill(220);
    rect(panelX, panelY, panelW, panelH, 20);
    
    rect(optionX, firstOptionY, optionW, optionH, 8);
    rect(optionX, firstOptionY + optionH + optionGap, optionW, optionH, 8);
    rect(optionX, firstOptionY + 2 * (optionH + optionGap), optionW, optionH, 8);
    
    fill(0);
    textFont("Helvetica");
    
    textAlign(CENTER, TOP);
    textSize(18);
    text("Event!", panelX + panelW / 2, panelY + 16);
    
    textAlign(LEFT, TOP);
    textSize(13);
    const textMarginX = optionX + 10;
    
    text(info.event, textMarginX, panelY + headerHeight - 10, panelW - 20, 40);
    text(info.good, textMarginX, firstOptionY + 3);
    text(info.evil, textMarginX, firstOptionY + optionH + optionGap + 3);
    text(info.neutral, textMarginX, firstOptionY + 2 * (optionH + optionGap) + 3);
    
    const resultLabelY = firstOptionY + 3 * (optionH + optionGap) + 20;
    text("Result: ", textMarginX, resultLabelY);
    
    this.handleEventClicks(info, optionX, optionW, optionH, firstOptionY, optionGap);
    
    text(GameState.result, textMarginX, resultLabelY + 15, panelW - 20, 60);
    
    if (GameState.result != "") {
      text("press 'Q' to close", textMarginX, resultLabelY + 40);
      if (keyIsDown(81)) {
        GameState.currentPrompt = -1;
        GameState.result = "";
      }
    }
    
    pop();
  },
  
  handleEventClicks(info, optionX, optionW, optionH, firstOptionY, optionGap) {
    if (!UIHelper.mouseJustClicked() || GameState.result != "") return;
    
    if (UIHelper.inside(mouseX, mouseY, optionX, firstOptionY, optionW, optionH)) {
      this.handleGoodChoice(info);
    }
    
    const secondY = firstOptionY + optionH + optionGap;
    if (UIHelper.inside(mouseX, mouseY, optionX, secondY, optionW, optionH)) {
      this.handleEvilChoice(info);
    }
    
    const thirdY = firstOptionY + 2 * (optionH + optionGap);
    if (UIHelper.inside(mouseX, mouseY, optionX, thirdY, optionW, optionH)) {
      GameState.result = "nothing happened";
      print(GameState.result);
    }
  },
  
  handleGoodChoice(info) {
    let statChange;
    if (PlayerState.skills.includes(info.skill)) {
      GameState.result = info.good1;
      statChange = info.self_impact;
    } else {
      GameState.result = info.good2;
      statChange = -info.self_impact;
    }
    
    this.applyStatChange(info.stat, statChange);
    GameLogic.impactSociety(-info.impact, info.impact);
    print(GameState.result);
  },
  
  handleEvilChoice(info) {
    GameState.result = info.evil1;
    GameLogic.impactSociety(info.impact, -info.impact);
    print(GameState.result);
  },
  
  applyStatChange(stat, change) {
    switch (stat) {
      case "Health":
        PlayerState.health += change;
        break;
      case "Intelligence":
        PlayerState.intelligence += change;
        break;
      case "Money":
        PlayerState.money += change;
        break;
      case "Looks":
        PlayerState.looks += change;
        break;
      case "Mental Health":
        PlayerState.mentalHealth += change;
        break;
    }
  }
};