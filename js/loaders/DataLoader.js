const DataLoader = {
  loadPeopleData() {
    const people = GameData.tables.people;
    for (let r = 0; r < people.getRowCount(); r++) {
      GameData.lists.lastNames.push(people.getString(r, "lastNames"));
      
      if (people.getString(r, "gender") == "Male") {
        GameData.lists.mNames.push(people.getString(r, "firstNames"));
      }
      if (people.getString(r, "gender") == "Female") {
        GameData.lists.fNames.push(people.getString(r, "firstNames"));
      }
    }
  },
  
  initializePlayer() {
    PlayerState.gender = random(["Male", "Female"]);
    const siblings = int(random(0, 3));
    const lastName = random(GameData.lists.lastNames);
    
    if (PlayerState.gender == "Male") {
      PlayerState.name = random(GameData.lists.mNames) + " " + lastName;
    } else {
      PlayerState.name = random(GameData.lists.fNames) + " " + lastName;
    }
    
    this.createFamily(lastName, siblings);
    
    PlayerState.age = 0;
    PlayerState.money = 0;
    PlayerState.health = int(random(10, 100));
    PlayerState.intelligence = int(random(10, 100));
    PlayerState.looks = int(random(10, 100));
    PlayerState.mentalHealth = int(random(10, 100));
  },
  
  createFamily(lastName, siblings) {
    // Dad
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
    
    // Mom
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
    
    // Siblings
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
          0,
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
  
  setDecisions() {
    const { jobs, activities, education, homes, healthcare, events } = GameData.tables;
    
    // Load jobs
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
    
    // Load activities
    for (let r = 0; r < activities.getRowCount(); r++) {
      GameData.lists.actList.push(
        EntityFactory.createActivity(
          activities.getString(r, "Name"),
          activities.getString(r, "Type")
        )
      );
    }
    
    // Load education
    for (let r = 0; r < education.getRowCount(); r++) {
      GameData.lists.eduList.push(
        EntityFactory.createEducation(
          education.getString(r, "Name"),
          int(education.getString(r, "Difficulty")),
          education.getString(r, "Type")
        )
      );
    }
    
    // Load homes
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
    
    // Load healthcare
    for (let r = 0; r < healthcare.getRowCount(); r++) {
      GameData.lists.healthcareList.push(
        EntityFactory.createHealthcare(
          healthcare.getString(r, "Name"),
          int(healthcare.getString(r, "Cost")),
          int(healthcare.getString(r, "HealthBoost"))
        )
      );
    }
    
    // Load events
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