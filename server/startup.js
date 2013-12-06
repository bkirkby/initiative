// On server startup, create some players if the database is empty.
Meteor.startup(function () { 
  if (Combatants.find().count() === 0) {
    Combatants.insert({name: "baer bardryn", initiative: Math.floor(Random.fraction()*23)+1, dex: 12, position: 0, isMonster: false});
    Combatants.insert({name: "stabz", initiative: Math.floor(Random.fraction()*23)+1, dex: 17, position: 1});
  }

  if( Turn.find().count() === 0) {
    Turn.insert({position:0,combatantId:Combatants.find({},{sort:{position: 1}}).fetch()[0]._id});
  }
});

