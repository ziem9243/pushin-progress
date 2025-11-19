const MenuRenderer = {
  drawMenu(info) {
    push();
    
    const panelW = 340;
    const panelX = (width - panelW) / 2;
    const panelY = 80;
    const rowGap = 18;
    const headerHeight = 60;
    const bottomPadding = 30;
    
    let listLength = this.getListLength();
    let contentHeight = listLength * rowGap;
    let panelH = headerHeight + contentHeight + bottomPadding;
    
    const maxPanelH = height - panelY - 40;
    if (panelH > maxPanelH) panelH = maxPanelH;
    
    if (GameState.moves <= 0) {
      GameState.menuOn = -1;
      pop();
      return;
    }
    
    stroke(10);
    fill(220);
    rect(panelX, panelY, panelW, panelH, 20);
    
    fill(0);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(18);
    text(info.name, panelX + panelW / 2, panelY + 18);
    
    textStyle(NORMAL);
    textSize(13);
    textAlign(LEFT, TOP);
    
    const clipX = panelX;
    const clipY = panelY + headerHeight;
    const clipW = panelW;
    const clipH = panelH - headerHeight - bottomPadding;
    
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(clipX, clipY, clipW, clipH);
    drawingContext.clip();
    
    const startY = clipY + 10 - GameState.scrollOffset;
    this.drawMenuItems(panelX, panelW, startY, rowGap);
    
    drawingContext.restore();
    
    this.drawScrollbar(clipH, listLength * rowGap);
    this.drawCloseButton(panelX, panelY, panelW);
    
    pop();
  },
  
  getListLength() {
    const menuTypes = [
      GameData.lists.eduList,
      GameData.lists.jobList,
      GameData.lists.actList,
      GameData.lists.relationShips,
      GameData.lists.homeList,
      GameData.lists.healthcareList
    ];
    return menuTypes[GameState.menuOn]?.length || 0;
  },
  
  drawMenuItems(panelX, panelW, startY, rowGap) {
    const baseX = panelX + 10;
    const buttonX = panelX + panelW - 80;
    
    const menuActions = [
      () => this.drawEducationItems(baseX, buttonX, startY, rowGap),
      () => this.drawJobItems(baseX, buttonX, startY, rowGap),
      () => this.drawActivityItems(baseX, buttonX, startY, rowGap),
      () => this.drawRelationshipItems(baseX, buttonX, startY, rowGap),
      () => this.drawHomeItems(baseX, buttonX, startY, rowGap),
      () => this.drawHealthcareItems(baseX, buttonX, startY, rowGap)
    ];
    
    if (menuActions[GameState.menuOn]) {
      menuActions[GameState.menuOn]();
    }
  },
  
  drawEducationItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.eduList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Study", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (PlayerState.age > 4 && UIHelper.mouseJustClicked() && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16)) {
        if (PlayerState.mentalHealth > 0) {
          PlayerState.mentalHealth -= r.difficulty;
          PlayerState.intelligence += r.difficulty;
        }
        PlayerState.skills.push(r.type);
        GameState.moves -= 1;
        break;
      }
      rowY += rowGap;
    }
  },
  
  drawJobItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.jobList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Apply", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (PlayerState.age > 15 && UIHelper.mouseJustClicked() && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 60, 16)) {
        if (GameLogic.checkSkills(r.type) >= r.difficulty) {
          PlayerState.job = r;
          print("You're hired for " + r.name);
        }
        GameState.moves -= 1;
      }
      rowY += rowGap;
    }
  },
  
  drawActivityItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.actList) {
      text(r.name + " ; " + r.type, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Join", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (UIHelper.mouseJustClicked() && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16)) {
        PlayerState.skills.push(r.type);
        GameState.moves -= 1;
        break;
      }
      rowY += rowGap;
    }
  },
  
  drawRelationshipItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.relationShips) {
      text(r.name + " ; " + r.relation + " ; " + r.age + " ; " + r.status, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 80, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Hang out", buttonX + 40, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (UIHelper.mouseJustClicked() && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 80, 16)) {
        if (PlayerState.mentalHealth < 100) {
          PlayerState.mentalHealth += 1;
        }
        GameState.moves -= 1;
      }
      rowY += rowGap;
    }
  },
  
  drawHomeItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.homeList) {
      text(r.type + " ; " + r.properties + " ; " + r.cost, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Rent", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (PlayerState.age > 17 && mouseIsPressed && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16)) {
        if (PlayerState.money >= r.cost) {
          PlayerState.home = r;
          print("Got home");
        }
        GameState.moves -= 1;
      }
      rowY += rowGap;
    }
  },
  
  drawHealthcareItems(baseX, buttonX, startY, rowGap) {
    let rowY = startY;
    for (let r of GameData.lists.healthcareList) {
      text(r.name + " ; Cost: " + r.cost + " ; HP: +" + r.healthBoost, baseX, rowY);
      
      fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Select", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);
      
      if (UIHelper.mouseJustClicked() && 
          UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 60, 16)) {
        if (PlayerState.money >= r.cost) {
          PlayerState.money -= r.cost;
          if (PlayerState.health < 100) {
            PlayerState.health += r.healthBoost;
            if (PlayerState.health > 100) PlayerState.health = 100;
          }
          print("Selected " + r.name + " - Health: " + PlayerState.health);
        }
        GameState.moves -= 1;
      }
      rowY += rowGap;
    }
  },
  
  drawScrollbar(visibleHeight, totalContent) {
    const overflow = totalContent > visibleHeight;
    
    if (overflow) {
      GameState.scrollOffset = constrain(GameState.scrollOffset, 0, totalContent - visibleHeight);
      
      const scrollRatio = GameState.scrollOffset / (totalContent - visibleHeight);
      const viewRatio = visibleHeight / totalContent;
      const thumbH = max(30, UIConfig.scrollbarH * viewRatio);
      const thumbY = UIConfig.scrollbarY + (UIConfig.scrollbarH - thumbH) * scrollRatio;
      
      fill(200);
      rect(UIConfig.scrollbarX, UIConfig.scrollbarY, UIConfig.scrollbarW, UIConfig.scrollbarH, 5);
      
      fill(120);
      rect(UIConfig.scrollbarX, thumbY, UIConfig.scrollbarW, thumbH, 5);
      
      if (GameState.draggingScrollbar) {
        let newRatio = (mouseY - UIConfig.scrollbarY - thumbH / 2) / (UIConfig.scrollbarH - thumbH);
        newRatio = constrain(newRatio, 0, 1);
        GameState.scrollOffset = newRatio * (totalContent - visibleHeight);
      }
    } else {
      GameState.scrollOffset = 0;
    }
  },
  
  drawCloseButton(panelX, panelY, panelW) {
    const closeSize = 22;
    const closeX = panelX + panelW - closeSize - 10;
    const closeY = panelY + 10;
    
    fill(220);
    ellipse(closeX + closeSize / 2, closeY + closeSize / 2, closeSize, closeSize);
    fill(0);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("X", closeX + closeSize / 2, closeY + closeSize / 2 + 1);
    
    if (mouseIsPressed && UIHelper.inside(mouseX, mouseY, closeX, closeY, closeSize, closeSize)) {
      GameState.menuOn = -1;
      GameState.scrollOffset = 0;
    }
  }
};