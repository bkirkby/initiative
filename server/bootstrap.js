// On server startup, create some players if the database is empty.
Meteor.startup(function () { 
  if (Combatants.find().count() === 0) {
    Combatants.insert({name: "baer bardryn", initiative: Math.floor(Random.fraction()*23)+1, dex: 12, place: 0});
    Combatants.insert({name: "stabz", initiative: Math.floor(Random.fraction()*23)+1, dex: 17, place: 0});
  }
});

