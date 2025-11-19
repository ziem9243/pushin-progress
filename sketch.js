// tables for various decisions
let people;
let activities;
let jobs;
let education;
let homes;
let healthcare;
let events;
let result = "";

// lists for various decisions
let actList = [];
let jobList = [];
let eduList = [];
let homeList = [];
let healthcareList = [];
let lastNames = [];
let gender = "";
let mNames = [];
let fNames = [];
let relationShips = [];// peopleList
let eventList = [];

let age; // your health will start to drop when you get too old.
let money; // money will rarely be used
let health; // game ends if health reaches 0. Visit the hospital to maintain your health
let looks; //
let intelligence; // intelligence can affect job opportunities 
let mentalHealth;
let name = "";
let buttons = [];
let menuOn = -1;
let moves = 3;
let currentPrompt = -1;
let currentResult = -1;

// player variables specific to items they have chosen
let skills = [];
let home;
let spouse;
let children = [];
let job;

//helper for mouse click
let mouseWasPressedLastFrame = false;

// chaos and peace meters
let chaos;
let peace;

function preload() {
  people = loadTable("assets/people.csv", "csv", "header");
  activities  = loadTable("assets/activities.csv", "csv", "header");
  education = loadTable("assets/education.csv", "csv", "header");
  jobs = loadTable("assets/jobs.csv", "csv", "header");
  homes = loadTable("assets/homes.csv", "csv", "header");
  healthcare = loadTable("assets/healthcare.csv", "csv", "header");
  events = loadTable("assets/events.csv", "csv", "header");
  iconImgs = [
    loadImage("icons/Education.png"),
    loadImage("icons/Jobs.png"),
    loadImage("icons/Activities.png"),
    loadImage("icons/Relationships.png"),
    loadImage("icons/Homes.png"),
    loadImage("icons/Healthcare.png")
  ];
  
}

function setup() {
  createCanvas(600, 840);
  textFont("Helvetica");
  peace = 100;
  chaos = 40;
  //generate family name
  for (let r = 0; r < people.getRowCount(); r++) {
    append(lastNames, people.getString(r, "lastNames"));
    if (people.getString(r, "gender") == "Male") {
      append(mNames, people.getString(r, "firstNames") );
    }
    if (people.getString(r, "gender") == "Female") {
      append(fNames, people.getString(r, "firstNames") );
    }
  }
  // randomizes the players gender, gives them a random last name, and a random number of siblings.
  gender = random(["Male","Female"]);
  let siblings = random(0,3);
  let lastName = random(lastNames);
  if (gender == "Male") {
    name += random(mNames) + " " + lastName;
  }
  if (gender == "Female") {
    name += random(fNames) + " " + lastName;
  }
  //make dad with random first name
  append(relationShips, makePerson(int(random(25,40)), int(random(1000,100000)), int(random(10,100)), int(random(10, 100)), int(random(10, 100)), int(random(10, 100)), "Dad", random(mNames) + " " + lastName, "alive"));
  //make mom with random first name
  append(relationShips, makePerson(int(random(25,40)), int(random(1000,100000)), int(random(10,100)), int(random(10, 100)), int(random(10, 100)), int(random(10, 100)), "Mom", random(fNames) + " " + lastName, "alive"));
  //make siblings with random genders
  for (let i = 0; i < siblings; i++) {
    let gen;
    let rel;
    if (int(random(0,2)) == 0){
      gen = random(fNames);
      rel = "Sister";
    } else {
      gen = random(mNames);
      rel = "Brother";
    }
    append(relationShips, makePerson(int(random(0,5)), 0, int(random(10,100)), int(random(10, 100)), int(random(10, 100)), int(random(10, 100)), rel, gen + " " + lastName, "alive"));
  }
  // set all other decisions
  setDecisions();
  
  age = 0;
  money = 0;
  health = int(random(10, 100));
  intelligence = int(random(10, 100));
  looks = int(random(10, 100));
  mentalHealth = int(random(10, 100));
  
  buttons = [
  { name: "Education(5+)", x: 0, y: 0, w: 0, h: 0 },   // index 0
  { name: "Jobs(16+)",      x: 0, y: 0, w: 0, h: 0 },   // index 1
  { name: "Activities",     x: 0, y: 0, w: 0, h: 0 },   // index 2
  { name: "Relationships",  x: 0, y: 0, w: 0, h: 0 },   // index 3
  { name: "Homes(18+)",     x: 0, y: 0, w: 0, h: 0 },   // index 4
  { name: "Healthcare",     x: 0, y: 0, w: 0, h: 0 }    // index 5
  ];
}


// setUp decisions
function setDecisions() {
  for (let r = 0; r < jobs.getRowCount(); r++) {
    append(jobList, makeJob(jobs.getString(r, "Name"),int(jobs.getString(r, "Difficulty")), jobs.getString(r, "Type"),int(jobs.getString(r, "Pay"))));
  }
  for (let r = 0; r < activities.getRowCount(); r++) {
    append(actList, makeActivity(activities.getString(r, "Name"),activities.getString(r, "Type")));
  }
  for (let r = 0; r < education.getRowCount(); r++) {
    append(eduList, makeEducation(education.getString(r, "Name"),int(education.getString(r, "Difficulty")), education.getString(r, "Type")));
  }
  for (let r = 0; r < homes.getRowCount(); r++) {
    append(homeList, makeHome(homes.getString(r, "Type"),homes.getString(r, "Properties"),int(homes.getString(r, "Cost")), int(homes.getString(r, "Quality")), false ));
  }
  for (let r = 0; r < healthcare.getRowCount(); r++) {
    append(healthcareList, makeHealthcare(healthcare.getString(r, "Name"),int(healthcare.getString(r, "Cost")), int(healthcare.getString(r, "HealthBoost"))));
  }
  for (let r = 0; r < events.getRowCount(); r++) {
    append(eventList, makeEvents(events.getString(r, "Event"),events.getString(r, "Good"),events.getString(r, "Evil"),events.getString(r, "Neutral"),int(events.getString(r, "Impact")), int(events.getString(r, "Self_Impact")), events.getString(r, "Stat"),events.getString(r, "Good1"),events.getString(r, "Good2"),events.getString(r, "Evil1"),events.getString(r, "Skill")));
  }
}


function draw() {
  background("#121212");
  textSize(345)
  if (gender == "Male") {
    text("🧍", 300, 125);
  } else {
    text("🧍‍♀️", 300, 125);
  }
  fill("#1B253A");
  rect(0,465,width,375);  
  drawTopBar();
  drawButtons();
  drawStatsPanel();
  
  
  if ((menuOn > -1) && currentPrompt == -1) { //draws menu if there no active events
    drawMenu(buttons[menuOn]);
  }
  if (currentPrompt != -1) { //draws active prompts
    drawEvent(eventList[currentPrompt]);
  }
  mouseWasPressedLastFrame = mouseIsPressed;
}

function drawTopBar() {
  noStroke();
  fill("#1B253A");
  rect(0, 0, width, 84);
  
  // player name
  fill(255);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(20);
  text(name, 24, 20);
  
  // age + occupation
  fill("#A2A2A2");
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(16);
  text("Age: " + age + ", Unemployed", 24, 44);
  
  // money
  fill(255);
  textAlign(RIGHT, TOP);
  textStyle(BOLD);
  textSize(20);
  text("$" + money,width - 24, 20);
  
  fill("#A2A2A2");
  textAlign(RIGHT, TOP);
  textStyle(NORMAL);
  textSize(16);
  text("Bank Balance", width - 24, 44);
}


function drawButtons() {
  fill("#104672");
  rect(0,465 - 113,width,113);
  drawIconButtons();
}

function drawMenu(info) {
  push();   

  const panelW = 340;
  const panelX = (width - panelW) / 2;
  const panelY = 80;
  const rowGap = 18;
  const headerHeight = 60;    // title area
  const bottomPadding = 30;

  // how many rows this menu will show
  let listLength = 0;
  if (menuOn === 0) listLength = eduList.length;          // Education
  if (menuOn === 1) listLength = jobList.length;          // Jobs
  if (menuOn === 2) listLength = actList.length;          // Activities
  if (menuOn === 3) listLength = relationShips.length;    // Relationships
  if (menuOn === 4) listLength = homeList.length;         // Homes
  if (menuOn === 5) listLength = healthcareList.length;   // Healthcare

  let contentHeight = listLength * rowGap;
  let panelH = headerHeight + contentHeight + bottomPadding;

  // keep panel on screen
  const maxPanelH = height - panelY - 40;
  if (panelH > maxPanelH) {
    panelH = maxPanelH;
  }

  // do not show menu if out of moves
  if (moves <= 0) {
    menuOn = -1;
    pop();
    return;
  }

  // panel bg
  stroke(10);
  fill(220);
  rect(panelX, panelY, panelW, panelH, 20);

  // title
  fill(0);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(18);
  text(info.name, panelX + panelW / 2, panelY + 18);

  // reset style for list rows so nothing is bold
  textStyle(NORMAL);
  textSize(13);
  textAlign(LEFT, TOP);

  let baseX = panelX + 10;
  let buttonX = panelX + panelW - 80;
  let rowY = panelY + headerHeight;

  // education
  if (menuOn === 0) {
    for (let r of eduList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);

      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Study", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        age > 4 &&
        (mouseIsPressed && !mouseWasPressedLastFrame) &&
        mouseX > buttonX && mouseX < buttonX + 50 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        if (mentalHealth > 0) {
          mentalHealth -= r.difficulty;
          intelligence += r.difficulty;
        }
        append(skills, r.type);
        moves -= 1;
        break;
      }
      rowY += rowGap;
    }
  }

  // jobs
  else if (menuOn === 1) {
    for (let r of jobList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty, baseX, rowY);

      fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Apply", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        age > 15 &&
        (mouseIsPressed && !mouseWasPressedLastFrame) &&
        mouseX > buttonX && mouseX < buttonX + 60 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        if (checkSkills(r.type) >= r.difficulty) {
          job = r;
          print("youre hired for " + r.name);
        }
        moves -= 1;
      }
      rowY += rowGap;
    }
  }

  // activities
  else if (menuOn === 2) {
    for (let r of actList) {
      text(r.name + " ; " + r.type, baseX, rowY);

      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Join", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        (mouseIsPressed && !mouseWasPressedLastFrame) &&
        mouseX > buttonX && mouseX < buttonX + 50 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        append(skills, r.type);
        moves -= 1;
        break;
      }
      rowY += rowGap;
    }
  }

  // relationships
  else if (menuOn === 3) {
    for (let r of relationShips) {
      text(
        r.name + " ; " + r.relation + " ; " + r.age + " ; " + r.status,
        baseX,
        rowY
      );

      fill(220);
      rect(buttonX, rowY - 4, 80, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Hang out", buttonX + 40, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        (mouseIsPressed && !mouseWasPressedLastFrame) &&
        mouseX > buttonX && mouseX < buttonX + 80 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        if (mentalHealth < 100) {
          mentalHealth += 1;
        }
        moves -= 1;
      }
      rowY += rowGap;
    }
  }

  // homes
  else if (menuOn === 4) {
    for (let r of homeList) {
      text(r.type + " ; " + r.properties + " ; " + r.cost, baseX, rowY);

      fill(220);
      rect(buttonX, rowY - 4, 50, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Rent", buttonX + 25, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        age > 17 &&
        mouseIsPressed &&
        mouseX > buttonX && mouseX < buttonX + 50 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        if (money >= r.cost) {
          home = r;
          print("got home");
        }
        moves -= 1;
      }
      rowY += rowGap;
    }
  }

  // healthcare
  else if (menuOn === 5) {
    for (let r of healthcareList) {
      text(
        r.name + " ; Cost: " + r.cost + " ; HP: +" + r.healthBoost,
        baseX,
        rowY
      );

      fill(220);
      rect(buttonX, rowY - 4, 60, 16, 20);
      fill(0);
      textAlign(CENTER, TOP);
      text("Select", buttonX + 30, rowY - 2);
      textAlign(LEFT, TOP);

      if (
        (mouseIsPressed && !mouseWasPressedLastFrame) &&
        mouseX > buttonX && mouseX < buttonX + 60 &&
        mouseY > rowY - 4 && mouseY < rowY + 12
      ) {
        if (money >= r.cost) {
          money -= r.cost;
          if (health < 100) {
            health += r.healthBoost;
            if (health > 100) health = 100;
          }
          print("Selected " + r.name + " - Health: " + health);
        }
        moves -= 1;
      }
      rowY += rowGap;
    }
  }

  // close
  if (menuOn !== -1) {
    const closeSize = 22;
    const closeX = panelX + panelW - closeSize - 10;
    const closeY = panelY + 10;

    fill(220);
    ellipse(closeX + closeSize / 2, closeY + closeSize / 2, closeSize, closeSize);
    fill(0);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("X", closeX + closeSize / 2, closeY + closeSize / 2 + 1);

    if (
      mouseIsPressed &&
      mouseX > closeX && mouseX < closeX + closeSize &&
      mouseY > closeY && mouseY < closeY + closeSize
    ) {
      menuOn = -1;
    }
  }

  pop();
}

function drawIconButtons() {
  const btnW = 60;
  const btnH = 60;
  const spacing = 20;

  const labels = [
    "Education(5+)",
    "Jobs(16+)",
    "Activities",
    "Relationships",
    "Homes(18+)",
    "Healthcare"
  ];
  // center all icons
  const totalWidth = 6 * btnW + 5 * spacing;
  const startX = (width - totalWidth) / 2;
  const y = (465 - 113) + 20;  // icon top Y

  textAlign(CENTER, TOP);
  textSize(12);
  fill(255);

  for (let i = 0; i < 6; i++) {
    const x = startX + i * (btnW + spacing);

    // draw icon
    image(iconImgs[i], x, y, btnW, btnH);

    // draw label 8px below icon
    text(labels[i], x + btnW / 2, y + btnH + 8);

    // update hitbox
    buttons[i].x = x;
    buttons[i].y = y;
    buttons[i].w = btnW;
    buttons[i].h = btnH;
  }
}



function drawStatsPanel() {
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(16);
  fill(255);
  textStyle(BOLD);
  text("📊 Your Stats", width / 2, 480);
  
  textStyle(NORMAL);

  textAlign(CENTER, TOP);
  textSize(14);
  fill(255);
  text("Moves left: " + moves, width / 2, 500);
  
  let clampVal = function(v) {
    return constrain(v, 0, 100);
  };
  
  let chaosPercent = clampVal((chaos / 140) * 100);
  
  // define stats objects
  
  let stats = [
    { label: "Mental Health", value: clampVal(mentalHealth), icon: "🧠", color: "#00D6A0" },
    { label: "Intelligence", value: clampVal(intelligence), icon: "🧬", color: "#FF9F1C" },
    { label: "Health", value: clampVal(health), icon: "💪", color: "#FF4FBF" },
    { label: "Looks", value: clampVal(looks), icon: "✨", color: "#FBE142" },
    { label: "Chaos", value: chaosPercent, icon: "🔥", color: "#E60000" }
  ];
  
  let firstRowY = 535;
  let rowGap = 47;
  let labelX = 25;
  let barX = 25;
  let barMaxWidth = width - 50;
  let barHeight = 8;
  let percentX = width - 32;

  // draw progress bar
  for (let i = 0; i < stats.length; i++) {
    let s = stats[i];
    let y = firstRowY + i * rowGap;

    textAlign(LEFT, CENTER);
    textSize(14);
    fill(255);
    text(s.icon + " " + s.label, labelX, y);

    textAlign(RIGHT, CENTER);
    fill("#D0D0D0");
    text(Math.round(s.value) + "%", percentX, y);

    let barY = y + 15;
    noStroke();
    fill("#24324B");
    rect(barX, barY, barMaxWidth, barHeight, 4);

    fill(s.color);
    let w = (barMaxWidth * s.value) / 100;
    rect(barX, barY, w, barHeight, 4);
  }
  
  // draw text
  textAlign(LEFT, CENTER);
  textSize(14);
  fill(255);
  text("Skills: " + skills, 25, 775);

  textAlign(CENTER, TOP);
  textSize(13);
  fill("#CCCCCC");
  text("Press Space to Age Up", width / 2, 800);
  
}


function keyPressed() {
  // The player will age and a new random event will happen to them at that year
  if (currentPrompt == -1 && (key === ' ' || keyCode === 65) && health > 0) {
    moves = 3;
    if(home != null) {
      money -= home.cost;
    }
    if(job != null) {
      money += job.pay;
    }
    age += 1;
    // You can have a maximum of 10 skill points. Older skills will be lost. Spec into specific skills to get job opportunities.
    if (skills.length > 10) {
      skills.shift();
    }
    if (age > 30) {
      health -= 1;
      mentalHealth -= 1;
    }
    if (age > 60) {
      health -= 1;
      mentalHealth -= 1; //ages people to death
    }
    if (mentalHealth < 50) {
      health -= 1; // poor mental health may harm physical health
    }
    for (let r of relationShips) {
      if (r.status == "alive") {
        if (r.health == 0) {
          r.status = "dead";
        }
        r.age += 1;
    
        if (r.age > 30) {
          r.health -= 1;
          r.mentalHealth -= 1;
        }
        if (r.age > 60) {
          r.health -= 1;
          r.mentalHealth -= 1;
        }
        if (r.mentalHealth < 50) {
          r.health -= 1;
        }
      }
      
    }
    if (age > 5) { //once youre older than 5 you recieve events
      if (floor(random(0,2)) == 1){
        result = "";
        answered = false;
        currentPrompt = floor(random(0,eventList.length));
      } else {
        currentPrompt = -1; //50% chance nothing happens for a year
      }
    }
    print(skills);
  } 
}

// updated mouse click to support new menus
function mouseClicked() {
  if (currentPrompt !== -1) return;
  if (moves <= 0) return;

  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];
    if (
      mouseX > b.x && mouseX < b.x + b.w &&
      mouseY > b.y && mouseY < b.y + b.h
    ) {
      menuOn = i;
      scrollOffset = 0;
      break;
    }
  }
}


//draws the prompts
function drawEvent(info) {
  push();

  // panel layout 
  const panelW = 340;
  const panelX = (width - panelW) / 2;
  const panelY = 80;
  const headerHeight = 60;
  const panelH = 230; 

  // option layout
  const optionX = panelX + 10;
  const optionW = panelW - 20;
  const optionH = 20;
  const optionGap = 6;
  const firstOptionY = panelY + headerHeight + 20;

  //buttons for events
  stroke(10);
  fill(220);
  rect(panelX, panelY, panelW, panelH, 20);

  // option hit areas
  rect(optionX, firstOptionY, optionW, optionH, 8);
  rect(optionX, firstOptionY + optionH + optionGap, optionW, optionH, 8);
  rect(optionX, firstOptionY + 2 * (optionH + optionGap), optionW, optionH, 8);

  fill(0);
  textFont("Helvetica");

  // title
  textAlign(CENTER, TOP);
  textSize(18);
  text("Event!", panelX + panelW / 2, panelY + 16);

  //good evil and neutral option for events
  textAlign(LEFT, TOP);
  textSize(13);

  const textMarginX = optionX + 10;

  // event description (wrapped inside panel)
  text(info.event, textMarginX, panelY + headerHeight - 10, panelW - 20, 40);

  // options text
  text(info.good, textMarginX, firstOptionY + 3);
  text(info.evil, textMarginX, firstOptionY + optionH + optionGap + 3);
  text(info.neutral, textMarginX, firstOptionY + 2 * (optionH + optionGap) + 3);

  const resultLabelY = firstOptionY + 3 * (optionH + optionGap) + 20;
  text("Result: ", textMarginX, resultLabelY);

  // click handling 
  if ((mouseIsPressed && !mouseWasPressedLastFrame) && result == "") {

    // GOOD OPTION
    if (
      mouseX > optionX && mouseX < optionX + optionW &&
      mouseY > firstOptionY && mouseY < firstOptionY + optionH
    ) {
      let statChange;
      if (skills.includes(info.skill)) {
        result = info.good1; //you passed the skill check
        statChange = info.self_impact;
      } else {
        result = info.good2; //you failed the skill check
        statChange = -info.self_impact;
      }

      switch (info.stat) { //certain stat changes based on ow you scored
        case "Health":
          health += statChange;
          break;
        case "Intelligence":
          intelligence += statChange;
          break;
        case "Money":
          money += statChange;
          break;
        case "Looks":
          looks += statChange;
          break;
        case "Mental Health":
          mentalHealth += statChange; 
          break;
      }
      print(result);
      impactSociety(-info.impact, info.impact); //good options decrease chaos and increase peace
    }

    // EVIL OPTION
    const secondY = firstOptionY + optionH + optionGap;
    if (
      mouseX > optionX && mouseX < optionX + optionW &&
      mouseY > secondY && mouseY < secondY + optionH
    ) {
      result = info.evil1;
      impactSociety(info.impact, -info.impact); //evil options increase chaos and decrease peace
      print(result);
    }

    // NEUTRAL OPTION
    const thirdY = firstOptionY + 2 * (optionH + optionGap);
    if (
      mouseX > optionX && mouseX < optionX + optionW &&
      mouseY > thirdY && mouseY < thirdY + optionH
    ) {
      result = "nothing happened"; //neutral option basically skips an event
      print(result);
    }
  }

  // result body
  text(result, textMarginX, resultLabelY + 15, panelW - 20, 60);

  if (result != "") { //you can only close an event after answering
    text("press 'Q' to close", textMarginX, resultLabelY + 40);
    if (keyIsDown(81)) {
      currentPrompt = -1;
      result = "";
    }
  }

  pop();
}


// creates people to interact with the player
function makePerson(age, money, health, intelligence, looks, mentalHealth, relation, name, status) {
  return {
    age:age,
    money:money,
    health:health,
    intelligence:intelligence,
    looks:looks,
    mentalHealth:mentalHealth,
    relation:relation,
    name:name,
    status:status
  }
}

// makes homes. Some homes are free and others are rented monthly. Better homes contribute to more happiness.
function makeHome(type, properties,cost, quality, owned) {
  return {
    properties:properties,
    cost:cost,
    type:type,
    quality:quality,
    owned:owned
  }
}

// extra curricular activities. Player can gain skills ffor free to open up ob opportunities later
function makeActivity(name, type) {
  return {
    name:name,
    type:type
  }
}

// schools and training programs. Higher difffficulty can increase your intelligence and decrease your happiness.
function makeEducation(name, difficulty, type) {
  return {
    name:name,
    difficulty:difficulty,
    type:type
  }
}

// when the player gains a skill through education or activities, they can get a job corresponding to it. Stats like intelligence, looks, and health, also matter.
function makeJob(name, difficulty, type, pay) {
  return {
    name:name,
    difficulty:difficulty,
    type:type,
    pay:pay
  }
}

// healthcare options. Free healthcare is normal, expensive healthcare gives more HP for paying.
function makeHealthcare(name, cost, healthBoost) {
  return {
    name:name,
    cost:cost,
    healthBoost:healthBoost
  }
}
  
// checks how many skill points the player has
function checkSkills(skill){
  let count = 0;

  for (let i = 0; i < skills.length; i++) {
    if (skills[i] === skill) {
      count++;
    }
  }
  return count;
}

// makes events for the player to respond to
function makeEvents(event, good, evil, neutral, impact, self_impact, stat, good1, good2, evil1, skill){
  return {
    event:event, good:good, evil:evil, neutral:neutral, impact:impact, self_impact:self_impact, stat:stat, good1:good1, good2:good2, evil1:evil1, skill:skill
  }
}
// this changes the peace and chaos levels in society
function impactSociety(c,p) {
  if (((peace+p) + (chaos+c) == 140)) {
    peace += p;
    chaos += c;
    if(peace <= 0) { peace = 0;}
    if(peace >= 140) { peace = 140;}
    if(chaos <= 0) { chaos = 0;}
    if(chaos >= 140) { chaos = 140;}
    print(peace + chaos);
  }
  else if ((peace+p) + (chaos+c) > 140) { //this recursive call should insure that peace + chaos always equals 140
    if (p > 0) {
      impactSociety(c,p-1);
    } else if (c > 0) {
      impactSociety(c - 1,p);
    }
  }
  else if ((peace+p) + (chaos+c) < 140) { //this recursive call should insure that peace + chaos always equals 140
    if (p < 0) {
      impactSociety(c,p+1);
    } else if (c < 0) {
      impactSociety(c+1,p);
    }
  }
}
