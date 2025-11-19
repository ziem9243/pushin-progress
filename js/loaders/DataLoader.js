/**
 * yeah this just loads all the csv/table data into the game's lists.
 * kinda the "boot up all the data" module. nothing too wild.
 * everything here is basically reading rows and stuffing them into lists.
 */
const DataLoader = {

  /**
   * loads the people table and splits names into different lists.
   * basically prepping name pools for random generation later.
   * @returns {void}
   */
  loadPeopleData() {
    const people = GameData.tables.people; // table handle, makes loop cleaner

    for (let r = 0; r < people.getRowCount(); r++) {
      // last names are shared regardless of gender
      GameData.lists.lastNames.push(people.getString(r, "lastNames"));
      
      // splitting first names by gender so the player gets gender-appropriate names
      // (yeah it's basic, but good enough for a simple sim)
      if (people.getString(r, "gender") == "Male") {
        GameData.lists.mNames.push(people.getString(r, "firstNames"));
      }
      if (people.getString(r, "gender") == "Female") {
        GameData.lists.fNames.push(people.getString(r, "firstNames"));
      }
    }
  },
  
  /**
   * sets up the player with random starting values
   * and creates the whole family tree (parents + siblings).
   * @returns {void}
   */
  initializePlayer() {
    // gender is randomized because why not — adds variety
    PlayerState.gender = random(["Male", "Female"]);

    // siblings count between 0–2 because a full sitcom cast is too much
    const siblings = int(random(0, 3));

    // last name shared across family
    const lastName = random(GameData.lists.lastNames);
    
    // builds the actual name depending on gender
    if (PlayerState.gender == "Male") {
      PlayerState.name = random(GameData.lists.mNames) + " " + lastName;
    } else {
      PlayerState.name = random(GameData.lists.fNames) + " " + lastName;
    }
    
    // throws parents + siblings into the relationship list
    this.createFamily(lastName, siblings);
    
    // basic stats — fully random cuz it's kinda fun not knowing what you’ll get
    PlayerState.age = 0;
    PlayerState.money = 0;
    PlayerState.health = int(random(10, 100));
    PlayerState.intelligence = int(random(10, 100));
    PlayerState.looks = int(random(10, 100));
    PlayerState.mentalHealth = int(random(10, 100));
  },
  
  /**
   * creates the starting family: dad, mom, siblings.
   * mostly just random stats to make them feel different.
   * @param {string} lastName - shared family name
   * @param {number} siblings - how many siblings to generate
   * @returns {void}
   */
  createFamily(lastName, siblings) {
    // dad stats are randomized but within adult ranges
    GameData.lists.relationShips.push(
      EntityFactory.createPerson(
        int(random(25, 40)),
        int(random(1000, 100000)),
        int(random(10, 100)),
        int(random(10, 100)),
        int(random(10, 100)),
        int(random(10, 100)),
        "Dad",
        random(GameData.lists.mNames) + " " + lastName,
        "alive"
      )
    );
    
    // same thing for mom — mirror approach but using female name pool
    GameData.lists.relationShips.push(
      EntityFactory.createPerson(
        int(random(25, 40)),
        int(random(1000, 100000)),
        int(random(10, 100)),
        int(random(10, 100)),
        int(random(10, 100)),
        int(random(10, 100)),
        "Mom",
        random(GameData.lists.fNames) + " " + lastName,
        "alive"
      )
    );
    
    // siblings loop — random gender and slightly younger
    // stats are toned down since they're kids
    for (let i = 0; i < siblings; i++) {
      let gen, rel;
      if (int(random(0, 2)) == 0) {
        gen = random(GameData.lists.fNames);
        rel = "Sister";
      } else {
        gen = random(GameData.lists.mNames);
        rel = "Brother";
      }
      
      GameData.lists.relationShips.push(
        EntityFactory.createPerson(
          int(random(0, 5)),
          0, // kids don't really have money (usually)
          int(random(10, 100)),
          int(random(10, 100)),
          int(random(10, 100)),
          int(random(10, 100)),
          rel,
          gen + " " + lastName,
          "alive"
        )
      );
    }
  },
  
  /**
   * loads all the decision-related tables
   * (jobs, activities, education, homes, healthcare, events).
   * all of these populate menus that show up later.
   * @returns {void}
   */
  setDecisions() {
    // destructuring so i don’t have to type GameData.tables.blah over and over
    const { jobs, activities, education, homes, healthcare, events } = GameData.tables;
    
    // jobs go into jobList — difficulty, type, pay all come from csv
    for (let r = 0; r < jobs.getRowCount(); r++) {
      GameData.lists.jobList.push(
        EntityFactory.createJob(
          jobs.getString(r, "Name"),
          int(jobs.getString(r, "Difficulty")),
          jobs.getString(r, "Type"),
          int(jobs.getString(r, "Pay"))
        )
      );
    }
    
    // activities — super simple, just name + type
    for (let r = 0; r < activities.getRowCount(); r++) {
      GameData.lists.actList.push(
        EntityFactory.createActivity(
          activities.getString(r, "Name"),
          activities.getString(r, "Type")
        )
      );
    }
    
    // education entries (class name + difficulty + subject category)
    for (let r = 0; r < education.getRowCount(); r++) {
      GameData.lists.eduList.push(
        EntityFactory.createEducation(
          education.getString(r, "Name"),
          int(education.getString(r, "Difficulty")),
          education.getString(r, "Type")
        )
      );
    }
    
    // house options — each home has type, features, cost, and quality rating
    // owned always starts false cuz you haven't bought anything yet
    for (let r = 0; r < homes.getRowCount(); r++) {
      GameData.lists.homeList.push(
        EntityFactory.createHome(
          homes.getString(r, "Type"),
          homes.getString(r, "Properties"),
          int(homes.getString(r, "Cost")),
          int(homes.getString(r, "Quality")),
          false
        )
      );
    }
    
    // healthcare menu (cost + hp boost)
    for (let r = 0; r < healthcare.getRowCount(); r++) {
      GameData.lists.healthcareList.push(
        EntityFactory.createHealthcare(
          healthcare.getString(r, "Name"),
          int(healthcare.getString(r, "Cost")),
          int(healthcare.getString(r, "HealthBoost"))
        )
      );
    }
    
    // events are kinda huge layers of text and effects
    // they get processed later by whatever event system you're using
    for (let r = 0; r < events.getRowCount(); r++) {
      GameData.lists.eventList.push(
        EntityFactory.createEvent(
          events.getString(r, "Event"),
          events.getString(r, "Good"),
          events.getString(r, "Evil"),
          events.getString(r, "Neutral"),
          int(events.getString(r, "Impact")),
          int(events.getString(r, "Self_Impact")),
          events.getString(r, "Stat"),
          events.getString(r, "Good1"),
          events.getString(r, "Good2"),
          events.getString(r, "Evil1"),
          events.getString(r, "Skill")
        )
      );
    }
  }
};
