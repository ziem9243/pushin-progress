let age;
let money;
let health;
let looks;
let intelligence;
let happiness;

function setup() {
  createCanvas(400, 400);
  age = 0;
  money = 0;
  health = int(random(10, 100));
  intelligence = int(random(10, 100));
  looks = int(random(10, 100));
}

function draw() {
  background(255);
  fill(220);
  rect(0,height-height/4,width,height/4);
  rect(0,0,20, 20);
  fill(0);
  text("Age: " + age, 10, height-height/5);
  text("Money: " + money, 10, (height-height/5)+15);
  text("Health: " + health, 10, (height-height/5)+30);
  text("Intelligence: " + intelligence, 10, (height-height/5)+45);
  text("Looks: " + looks, 10, (height-height/5)+60);
  text("Click Space to age up", 10, (height-height/5)+75);
}

function keyPressed() {
  if (key === ' ' || keyCode === 65) {
    age += 1;
    print(age);
  }
}
