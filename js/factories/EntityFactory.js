const EntityFactory = {
  createPerson(age, money, health, intelligence, looks, mentalHealth, relation, name, status) {
    return { age, money, health, intelligence, looks, mentalHealth, relation, name, status };
  },
  
  createHome(type, properties, cost, quality, owned) {
    return { type, properties, cost, quality, owned };
  },
  
  createActivity(name, type) {
    return { name, type };
  },
  
  createEducation(name, difficulty, type) {
    return { name, difficulty, type };
  },
  
  createJob(name, difficulty, type, pay) {
    return { name, difficulty, type, pay };
  },
  
  createHealthcare(name, cost, healthBoost) {
    return { name, cost, healthBoost };
  },
  
  createEvent(event, good, evil, neutral, impact, self_impact, stat, good1, good2, evil1, skill) {
    return { event, good, evil, neutral, impact, self_impact, stat, good1, good2, evil1, skill };
  }
};