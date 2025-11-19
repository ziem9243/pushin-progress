const menuMinAges = [5, 16, 0, 0, 18, 0]; // matches Education, Jobs, Activities, Relationships, Homes, Healthcare

/**
 * renderer object that draws all the menu stuff.
 * mostly responsible for scrolling, clipping, and buttons.
 */
const MenuRenderer = {
  
  /**
   * draws the whole menu panel with scrolling n stuff
   * @param {Object} info - data about the menu (mostly the name)
   */
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
    let panelH = headerHeight + contentHeight + bottomPadding * 1.2;

    // don't let it run off the screen lol
    const maxPanelH = height - panelY - 40;
    if (panelH > maxPanelH) panelH = maxPanelH;
    
    if (GameState.moves <= 0) {
      GameState.menuOn = -1;
      pop();
      return;
    }
    
    if (PlayerState.age < menuMinAges[GameState.menuOn]) {
        // Player is too young to open this menu
        print("You are not old enough to access this menu.");
        GameState.menuOn = -1;
        return;
    }


    stroke(10);
    fill(220);
    rect(panelX, panelY, panelW, panelH, 20);
    
    // header text
    fill(0);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(18);
    text(info.name, panelX + panelW / 2, panelY + 18);
    
    textStyle(NORMAL);
    textSize(13);
    textAlign(LEFT, TOP);
    
    // clipping area for scrolling
    const scrollbarWidth = 12;
    const clipX = panelX;
    const clipY = panelY + headerHeight;
    const clipW = panelW - scrollbarWidth - 4;
    const clipH = panelH - headerHeight - bottomPadding;

    // mask out everything outside the scroll region
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(clipX, clipY, clipW, clipH);
    drawingContext.clip();
    
    const startY = clipY + 10 - GameState.scrollOffset;
    this.drawMenuItems(panelX, panelW, startY, rowGap);
    
    drawingContext.restore();
    
    // lil scroll bar
    this.drawScrollbar(
      clipX + clipW + 4, 
      clipY,
      scrollbarWidth,
      clipH,
      listLength * rowGap
    );

    // where UI checks clicks
    UIConfig.scrollbarX = clipX + clipW - 12;
    UIConfig.scrollbarY = clipY;
    UIConfig.scrollbarW = 8;
    UIConfig.scrollbarH = clipH;

    // close button thing
    this.drawCloseButton(panelX, panelY, panelW);
    
    pop();
    print("contentHeight:", contentHeight, "clipH:", clipH);
  },
  

  /**
   * figures out how long the active menu list is
   * @returns {number} how many rows to show
   */
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
  

  /**
   * picks the right menu drawer based on what menu is open
   * @param {number} panelX - x pos of the panel
   * @param {number} panelW - width of the panel
   * @param {number} startY - where to start drawing rows
   * @param {number} rowGap - vertical spacing for rows
   */
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
  
  /**
   * draws the school list + study buttons
   * @param {number} baseX
   * @param {number} buttonX
   * @param {number} startY
   * @param {number} rowGap
   */
  drawEducationItems(baseX, buttonX, startY, rowGap) {
    const minAge = 5;
    let rowY = startY;
    for (let r of GameData.lists.eduList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Study", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          if (PlayerState.mentalHealth > 0) {
            PlayerState.mentalHealth -= r.difficulty;
            PlayerState.intelligence += r.difficulty;
          }
          PlayerState.skills.push(r.type);
          GameState.moves -= 1;
          break;
        } else {
          print("You are not old enough to study " + r.name);
        }
      }
      rowY += rowGap;
    }
  },


  /**
   * draws job list + apply buttons
   */
  drawJobItems(baseX, buttonX, startY, rowGap) {
    const minAge = 16;
    let rowY = startY;
    for (let r of GameData.lists.jobList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 60, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Apply", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          if (GameLogic.checkSkills(r.type) >= r.difficulty) {
            PlayerState.job = r;
            print("You're hired for " + r.name);
          }
          GameState.moves -= 1;
        } else {
          print("You are not old enough for this job");
        }
      }
      rowY += rowGap;
    }
  },

  /**
   * draws activities ("join" buttons)
   */
  drawActivityItems(baseX, buttonX, startY, rowGap) {
    const minAge = 0;
    let rowY = startY;
    for (let r of GameData.lists.actList) {
      text(r.name + " ; " + r.type, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Join", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          PlayerState.skills.push(r.type);
          GameState.moves -= 1;
          break;
        } else {
          print("You are not old enough for this activity");
        }
      }
      rowY += rowGap;
    }
  },


  /**
   * draws the relationships list
   */
  drawRelationshipItems(baseX, buttonX, startY, rowGap) {
    const minAge = 0;
    let rowY = startY;
    for (let r of GameData.lists.relationShips) {
      text(r.name + " ; " + r.relation + " ; " + r.age + " ; " + r.status, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX - 20, rowY - 4, 80, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX - 20, rowY - 4, 80, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Hang out", buttonX+20, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          if (PlayerState.mentalHealth < 100) PlayerState.mentalHealth += 1;
          GameState.moves -= 1;
        } else {
          print("You are not old enough to hang out");
        }
      }
      rowY += rowGap;
    }
  },

  /**
   * draws the homes list
   */
  drawHomeItems(baseX, buttonX, startY, rowGap) {
    const minAge = 18;
    let rowY = startY;
    for (let r of GameData.lists.homeList) {
      text(r.type + " ; " + r.properties + " ; " + r.cost, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 50, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Rent", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          if (PlayerState.money >= r.cost) {
            PlayerState.home = r;
            print("Got home");
          }
          GameState.moves -= 1;
        } else {
          print("You are not old enough to rent this home");
        }
      }
      rowY += rowGap;
    }
  },


  /**
   * draws healthcare options
   */
  drawHealthcareItems(baseX, buttonX, startY, rowGap) {
    const minAge = 0;
    let rowY = startY;
    for (let r of GameData.lists.healthcareList) {
      text(r.name + " ; Cost: " + r.cost + " ; HP: +" + r.healthBoost, baseX, rowY);

      let hovered = UIHelper.inside(mouseX, mouseY, buttonX, rowY - 4, 60, 16);
      if (hovered && mouseIsPressed) fill(150);
      else if (hovered) fill(180);
      else fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);

      fill(0);
      textAlign(CENTER, TOP);
      text("Select", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);

      if (UIHelper.mouseJustClicked() && hovered) {
        if (PlayerState.age >= minAge) {
          if (PlayerState.money >= r.cost) {
            PlayerState.money -= r.cost;
            PlayerState.health = min(100, PlayerState.health + r.healthBoost);
            print("Selected " + r.name + " - Health: " + PlayerState.health);
          }
          GameState.moves -= 1;
        } else {
          print("You are not old enough to select this healthcare option");
        }
      }
      rowY += rowGap;
    }
  },


  /**
   * draws the scroll bar and handles drag logic
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {number} contentHeight
   */
  drawScrollbar(x, y, w, h, contentHeight) {
    const overflow = contentHeight > h;

    if (!overflow) {
      GameState.scrollOffset = 0;
      return;
    }

    // clamp scrolling
    GameState.scrollOffset = constrain(
      GameState.scrollOffset,
      0,
      contentHeight - h
    );

    // track background
    fill(200);
    rect(x, y, w, h, 4);

    // thumb height based on how much content is visible
    const ratioView = h / contentHeight;
    const thumbH = max(30, h * ratioView);
    const ratioScroll = GameState.scrollOffset / (contentHeight - h);
    const thumbY = y + (h - thumbH) * ratioScroll;

    // actual thumb
    fill(120);
    rect(x, thumbY, w, thumbH, 4);

    // dragging logic
    if (GameState.draggingScrollbar) {
      let newRatio =
        (mouseY - y - thumbH / 2) / (h - thumbH);
      newRatio = constrain(newRatio, 0, 1);
      GameState.scrollOffset = newRatio * (contentHeight - h);
    }
  },


  /**
   * draws the little X button to close the menu
   * @param {number} panelX
   * @param {number} panelY
   * @param {number} panelW
   */
  drawCloseButton(panelX, panelY, panelW) {
    const closeSize = 22;
    const closeX = panelX + panelW - closeSize - 10;
    const closeY = panelY + 10;

    let hovered = UIHelper.inside(mouseX, mouseY, closeX, closeY, closeSize, closeSize);
    if (hovered && mouseIsPressed) fill(150);
    else if (hovered) fill(180);
    else fill(220);
    
    ellipse(closeX + closeSize / 2, closeY + closeSize / 2, closeSize, closeSize);
    fill(0);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("X", closeX + closeSize / 2, closeY + closeSize / 2 + 1);
    
    if (mouseIsPressed && hovered) {
      GameState.menuOn = -1;
      GameState.scrollOffset = 0;
    }
  }
};
