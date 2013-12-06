// Set up a collection to contain combatant information. On the server,
// it is backed by a MongoDB collection named "combatants".

Combatants = new Meteor.Collection("combatants");
Turn = new Meteor.Collection("turn");

  Template.initiative.combatants = function () {
    return Combatants.find({}, {sort: {position: 1, initiative: -1, dex: -1}});
  };

  Template.combatant.selected = function () {
    return Session.equals("selected_combatant", this._id) ? "selected" : '';
  };

  Template.combatant.monster = function () {
    return Combatants.findOne(this._id).isMonster ? "monster" : "";
  };

  Template.combatant.turn = function () {
    return Turn.findOne().combatantId === this._id ? "glyphicon-arrow-right" : "";
  };

  Template.initiative.events({
    'click input#addCombatantShow': function () {
      if( $("#addCombatantDiv").is(":visible")) {
        $("#addCombatantDiv").hide();
      } else {
        $("#newName").val("");
        $("#newInit").val("");
        $("#newDex").val("");
        $("#isMonster").prop("checked", true);
        $("#addCombatantAdd").show();
        $("#addCombatantUpdate").hide();
        $("#addCombatantDiv").show();
      }
    },
    'click input#addCombatantAdd': function () {
      currCombatant = Combatants.find({},{sort:{position: -1, initiative: -1, dex: -1}}).fetch()[0];
      if( typeof currCombatant == 'undefined' ){
        nextPos = 0;
      } else {
        nextPos = currCombatant.position+1;
      }
      Combatants.insert({name:$("#newName").val(),initiative:Number($("#newInit").val()),dex:Number($("#newDex").val()),isMonster:$("#isMonster").is(":checked"),position:nextPos});
      $("#addCombatantDiv").hide();
    },
    'click input#addCombatantUpdate': function () {
      pos = Combatants.find({_id:Session.get("selected_combatant")}).fetch()[0].position;
      Combatants.update({_id:Session.get("selected_combatant")},{$set:{initiative:Number($("#newInit").val()),dex:Number($("#newDex").val()),name:$("#newName").val(),isMonster:$("#isMonster").is(":checked"),position:pos}});
      $("#addCombatantDiv").hide();
    },
    'click input#deleteCombatant': function () {
      Combatants.remove(Session.get("selected_combatant"));
    },
    'click input#nextPlayer': function() {
      currTurn = Turn.findOne();
      nextCombatant= Combatants.find({position:{$gt:currTurn.position}},{sort:{position: 1, initiative: -1, dex: -1}}).fetch()[0];
      if( typeof nextCombatant == 'undefined') {
        nextCombatant = Combatants.find({},{sort:{position: 1, initiative: -1, dex: -1}}).fetch()[0];
      }
      Turn.update({_id:currTurn._id},{position:nextCombatant.position,combatantId:nextCombatant._id});
    }
  });

  Template.combatant.events({
    'click': function () {
      Session.set("selected_combatant", this._id);
    },
    'dblclick': function () {
      Session.set("edit_combatant", this._id);
      var player = Combatants.findOne(Session.get("selected_combatant"));
      $("#newName").val( player.name);
      $("#newInit").val( player.initiative);
      $("#newDex").val( player.dex);
      $("#isMonster").prop("checked", player.isMonster);
      $("#addCombatantUpdate").show();
      $("#addCombatantAdd").hide();
      $("#addCombatantDiv").show();
    }/*,
    'dragstart' : function () {
      console.log("start drag: "+this._id);
    },
    'dragstop' : function () {
      console.log("stop drag: "+this._id);
    },
    'mouseover' : function () {
      console.log(this);
    },
    'mouseout' : function () {
      console.log("mouse exit: "+this._id);
    }*/
  });
