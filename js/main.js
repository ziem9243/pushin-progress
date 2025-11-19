// Main P5.js entry point

function preload() {
  GameData.tables.people = loadTable("assets/people.csv", "csv", "header");
  GameData.tables.activities = loadTable("assets/activities.csv", "csv", "header");
  GameData.tables.education = loadTable("assets/education.csv", "csv", "header");
  GameData.tables.jobs = loadTable("assets/jobs.csv", "csv", "header");
  GameData.tables.homes = loadTable("assets/homes.csv", "csv", "header");
  GameData.tables.healthcare = loadTable("assets/healthcare.csv", "csv", "header");
  GameData.tables.events = loadTable("assets/events.csv", "csv", "header");
  
  GameData.iconImgs = [
    loadImage("assets/icons/Education.png"),
    loadImage("assets/icons/Jobs.png"),
    loadImage("assets/icons/Activities.png"),
    loadImage("assets/icons/Relationships.png"),
    loadImage("assets/icons/Homes.png"),
    loadImage("assets/icons/Healthcare.png")
  ];
}

function setup() {
  createCanvas(600, 840);
  textFont("Helvetica");
  
  DataLoader.loadPeopleData();
  DataLoader.initializePlayer();
  DataLoader.setDecisions();
}

function draw() {
  Renderer.drawBackground();
  Renderer.drawTopBar();
  Renderer.drawButtons();
  Renderer.drawStatsPanel();
  
  if (GameState.menuOn > -1 && GameState.currentPrompt === -1) {
    MenuRenderer.drawMenu(UIConfig.buttons[GameState.menuOn]);
  }
  
  if (GameState.currentPrompt !== -1) {
    EventRenderer.drawEvent(GameData.lists.eventList[GameState.currentPrompt]);
  }
  
  GameState.mouseWasPressedLastFrame = mouseIsPressed;
}

function keyPressed() {
  InputHandler.handleKeyPress();
}

function mouseClicked() {
  InputHandler.handleMouseClick();
}

function mouseWheel(event) {
  InputHandler.handleMouseWheel(event);
}

function mousePressed() {
  InputHandler.handleMousePressed();
}

function mouseReleased() {
  InputHandler.handleMouseReleased();
}