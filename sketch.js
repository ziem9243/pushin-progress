// tables for various decisions
let people;
let activities;
let jobs;
let education;
let homes;
let healthcare;

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

// player variables specific to items they have chosen
let skills = [];
let home;
let spouse;
let children = [];
let job;

//helper for mouse click
let mouseWasPressedLastFrame = false;

function preload() {
  people = loadTable("assets/people.csv", "csv", "header");
  activities  = loadTable("assets/activities.csv", "csv", "header");
  education = loadTable("assets/education.csv", "csv", "header");
  jobs = loadTable("assets/jobs.csv", "csv", "header");
  homes = loadTable("assets/homes.csv", "csv", "header");
  healthcare = loadTable("assets/healthcare.csv", "csv", "header");
  
}

function setup() {
  createCanvas(600, 600);
  
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
  buttons = [{name:"Jobs 16+",x:(width - width/3)+55, y:(height-height/5)-10},{name:"Relationships",x:(width - width/3)+40, y:(height-height/5)+15}, {name:"Activities",x:(width - width/3)+50, y:(height-height/5)+40}, {name:"Education 5+",x:(width - width/3)+45, y:(height-height/5)+65}, {name:"Homes 18+",x:(width - width/3)+55, y:(height-height/5)+90}, {name:"Healthcare",x:(width - width/3)+50, y:(height-height/5)+115}];
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
}


function draw() {
  background(255);
  fill(220);
  rect(0,height-height/4,width,height/4);
  fill(0);
  stroke(0);
  //players stats which change troughout the game. The game ends if thhe players health reaches 0
  if (job != null){
    text("Job: " + job.name, 10, height-height/5 - 60);
  } else {
    text("Unemployed", 10, height-height/5 - 60);
  }
  if (home != null){
    text("Home: " + home.type, 10, height-height/5 - 45);
  } else {
    text("Home: " + "with parents", 10, height-height/5 - 45);
  }
  text("Skills: " + skills, 10, height-height/5 - 30);
  text("Name: " + name, 10, height-height/5 - 15);
  text("Age: " + age, 10, height-height/5);
  text("Money: " + money, 10, (height-height/5)+15);
  text("Health: " + health, 10, (height-height/5)+30);
  text("Intelligence: " + intelligence, 10, (height-height/5)+45);
  text("Looks: " + looks, 10, (height-height/5)+60);
  text("Mental Health: " + mentalHealth, 10, (height-height/5)+75);
  text("Moves Left: " + moves, 10, (height-height/5)+90);
  text("Click Space to age up!", 10, (height-height/5)+105);
  
  stroke(10);
  fill(220);
  // Makes buttons where the player can make decisions
  rect(width - width/3, height-height/5 -25, 150, 20, 20);
  rect(width - width/3, height-height/5, 150, 20, 20);
  rect(width - width/3, (height-height/5)+25,150, 20, 20);
  rect(width - width/3, (height-height/5)+50, 150, 20, 20);
  rect(width - width/3, (height-height/5)+75, 150, 20, 20);
  rect(width - width/3, (height-height/5)+100, 150, 20, 20);
  fill(0);
  for (let b of buttons) {
    text(b.name,b.x,b.y);
  }

  
  //This wont be in the final game but can help find precise coordinates
  line(0,mouseY,width,mouseY);
  line(mouseX,0,mouseX,height);
  text(mouseX + "," + mouseY,10,10);
  if (menuOn > -1) {
    drawMenu(buttons[menuOn]);
  }
  mouseWasPressedLastFrame = mouseIsPressed;

}

function keyPressed() {
  // The player will age and a new random event will happen to them at that year
  if ((key === ' ' || keyCode === 65) && health > 0) {
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
      mentalhealth -= 1;
    }
    if (age > 60) {
      health -= 1;
      mentalhealth -= 1;
    }
    if (mentalHealth < 50) {
      health -= 1;
    }
    for (let r of relationShips) {

      if (r.status == "alive") {
        if (r.health == 0) {
          r.status = "dead";
        }
        r.age += 1;
    
        if (r.age > 30) {
          r.health -= 1;
          r.mentalhealth -= 1;
        }
        if (r.age > 60) {
          r.health -= 1;
          r.mentalhealth -= 1;
        }
        if (r.mentalHealth < 50) {
          r.health -= 1;
        }
      }
      
    }
    //print(health);
    print(skills);
  }
  
}

function mouseClicked() {
  print(mouseX,mouseY);
  let cX = width - width/3;
  if (mouseX > cX && mouseX < cX + 150) { 
    
    if (mouseY > height-height/5 -25 && mouseY < (height-height/5 -25)+20){menuOn = 0}
    if (mouseY > height-height/5 && mouseY < (height-height/5)+20){menuOn = 1 }
    if (mouseY > height-height/5 +25 && mouseY < (height-height/5 +25)+20) {menuOn = 2 }
    if (mouseY > height-height/5 +50 && mouseY < (height-height/5 +50)+20) {menuOn = 3 }
    if (mouseY > height-height/5 +75&& mouseY < (height-height/5 +75)+20) {menuOn = 4}
    if (mouseY > height-height/5 +100&& mouseY < (height-height/5 +100)+20) {menuOn = 5}
  }
}

//draws the menus for 
function drawMenu(info) {
  
  stroke(10);
  fill(220);
  rect(150, 50, 300, 300, 20);
  fill(0);
  text(info.name,250,75);
  if (moves <= 0){ //dont draw the menu if the player runs out of moves
    menuOn = -1;
  }
  if (menuOn == 0) { //draws menu for jobs
    let space = 0;
    for (let r of jobList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty,160,100 + space);
      fill(220);
      rect(370,89 + space,60,12,20);
      fill(0);
      text("Apply", 380, 100 + space);
      if(age > 15 && (mouseIsPressed && !mouseWasPressedLastFrame) && (mouseX > 370 && mouseX < 370+60 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.name);// stuff will happen here latter
        if (checkSkills(r.type) >= r.difficulty) {
          job = r;
          print("youre hired for " + r.name);
        }
        moves -= 1;
      }
      space+=15;
    }
  }
  if (menuOn == 1) { //draws menu for relationships
    let space = 0;
    for (let r of relationShips) {
      text(r.name + " ; " + r.relation + " ; " + r.age + " ; " + r.status,160,100 + space);
      fill(220);
      rect(370,89 + space,70,12,20);
      fill(0);
      text("Hang out", 380, 100 + space);
      if((mouseIsPressed && !mouseWasPressedLastFrame) && (mouseX > 370 && mouseX < 370+70 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.name);// stuff will happen here latter
        if (mentalHealth < 100) {
          mentalHealth += 1;
        }
        moves -= 1;
        print(moves);
      }
      space+=15;
    }
  }
  let space = 0;
  if (menuOn == 2) { //draws menu for activities
    for (let r of actList) {
      text(r.name + " ; " + r.type,160,100 + space);
      fill(220);
      rect(370,89 + space,40,12,20);
      fill(0);
      text("Join", 380, 100 + space);
      if((mouseIsPressed && !mouseWasPressedLastFrame) && (mouseX > 370 && mouseX < 370+40 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.name);
        append(skills, r.type);
        moves -= 1;
        break;
      }
      space+=15;
    }
  }
  if (menuOn == 3) { //draws menu for education
    for (let r of eduList) {
      text(r.name + " ; " + r.type + " ; " + r.difficulty,160,100 + space);
      fill(220);
      rect(370,89 + space,40,12,20);
      fill(0);
      text("Study", 380, 100 + space);
      if(age > 4 && (mouseIsPressed && !mouseWasPressedLastFrame) && (mouseX > 370 && mouseX < 370+40 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.name);// stuff will happen here latter
        if (mentalHealth > 0) {
          mentalHealth -= r.difficulty;
          
          intelligence += r.difficulty;
        }
        append(skills, r.type);
        moves -= 1;
        break;
      }
      space+=15;
    }
    
  }
  if (menuOn == 4) { //draws menu for homes
    for (let r of homeList) {
      text(r.type + " ; " + r.properties + " ; " + r.cost,160,100 + space);
      fill(220);
      rect(370,89 + space,40,12,20);
      fill(0);
      text("Rent", 380, 100 + space);
      if(age > 17 && mouseIsPressed && (mouseX > 370 && mouseX < 370+40 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.type);// stuff will happen here latter
        if (money >= r.cost) {
          home = r;
          print("got home");
        }
        moves -= 1;
      }
      space+=15;
    }
  }
  if (menuOn == 5) { //draws menu for healthcare
    for (let r of healthcareList) {
      text(r.name + " ; Cost: " + r.cost + " ; HP: +" + r.healthBoost,160,100 + space);
      fill(220);
      rect(370,89 + space,50,12,20);
      fill(0);
      text("Select", 380, 100 + space);
      if((mouseIsPressed && !mouseWasPressedLastFrame) && (mouseX > 370 && mouseX < 370+50 && mouseY > 89 + space && mouseY < 89 + space + 12)) {
        print(r.name);
        if (money >= r.cost) {
          money -= r.cost;
          if (health < 100) {
            health += r.healthBoost;
            if (health > 100) {
              health = 100;
            }
          }
          print("Selected " + r.name + " - Health: " + health);
        }
        moves -= 1;
      }
      space+=15;
    }
  }
  if (menuOn != -1) {
    fill(220);
    rect(415,60,20,20,20);
    fill(0);
    text("X", 420, 75);
    if(mouseIsPressed && (mouseX > 415 && mouseX < 415+20 && mouseY > 60 && mouseY < 60+12)) {
        menuOn = -1;
      }
  }
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
  return count
}
