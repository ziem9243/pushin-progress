const GameLogic = {
  ageUp() {
    if (GameState.currentPrompt !== -1 || PlayerState.health <= 0) return;
    
    GameState.moves = 3;
    
    if (PlayerState.home != null) {
      PlayerState.money -= PlayerState.home.cost;
    }
    if (PlayerState.job != null) {
      PlayerState.money += PlayerState.job.pay;
    }
    
    PlayerState.age += 1;
    
    if (PlayerState.skills.length > 10) {
      PlayerState.skills.shift();
    }
    
    this.applyAgingEffects(PlayerState);
    
    GameData.lists.relationShips.forEach(person => {
      if (person.status === "alive") {
        if (person.health <= 0) {
          person.status = "dead";
        }
        person.age += 1;
        this.applyAgingEffects(person);
      }
    });
    
    if (PlayerState.age > 5) {
      if (floor(random(0, 2)) == 1) {
        GameState.result = "";
        GameState.currentPrompt = floor(random(0, GameData.lists.eventList.length));
      } else {
        GameState.currentPrompt = -1;
      }
    }
    
    print(PlayerState.skills);
  },
  
  applyAgingEffects(entity) {
    if (entity.age > 30) {
      entity.health -= 1;
      entity.mentalHealth -= 1;
    }
    if (entity.age > 60) {
      entity.health -= 1;
      entity.mentalHealth -= 1;
    }
    if (entity.mentalHealth < 50) {
      entity.health -= 1;
    }
  },
  
  checkSkills(skill) {
    let count = 0;
    for (let i = 0; i < PlayerState.skills.length; i++) {
      if (PlayerState.skills[i] === skill) count++;
    }
    return count;
  },
  
  impactSociety(c, p) {
    if ((GameState.peace + p) + (GameState.chaos + c) == 140) {
      GameState.peace += p;
      GameState.chaos += c;
      GameState.peace = constrain(GameState.peace, 0, 140);
      GameState.chaos = constrain(GameState.chaos, 0, 140);
      print(GameState.peace + GameState.chaos);
    } else if ((GameState.peace + p) + (GameState.chaos + c) > 140) {
      if (p > 0) {
        this.impactSociety(c, p - 1);
      } else if (c > 0) {
        this.impactSociety(c - 1, p);
      }
    } else if ((GameState.peace + p) + (GameState.chaos + c) < 140) {
      if (p < 0) {
        this.impactSociety(c, p + 1);
      } else if (c < 0) {
        this.impactSociety(c + 1, p);
      }
    }
  }
};