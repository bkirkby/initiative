// Set up a collection to contain combatant information. On the server,
// it is backed by a MongoDB collection named "combatants".

Combatants = new Meteor.Collection("combatants");

  Template.initiative.combatants = function () {
    return Combatants.find({}, {sort: {initiative: -1, dex: -1}});
  };

  Template.initiative.selected_name = function () {
    var combatant = Combatants.findOne(Session.get("selected_combatant"));
    return combatant && combatant.name;
  };

  Template.initiative.selected_init = function () {
    var combatant = Combatants.findOne(Session.get("selected_combatant"));
    return combatant && combatant.initiative;
  };

  Template.initiative.selected_dex = function () {
    var combatant = Combatants.findOne(Session.get("selected_combatant"));
    return combatant && combatant.dex;
  };

  Template.combatant.selected = function () {
    return Session.equals("selected_combatant", this._id) ? "selected" : '';
  };

  Template.initiative.events({
    'click input#addCombatantShow': function () {
      if( $("#addCombatantDiv").is(":visible")) {
        $("#addCombatantDiv").hide();
      } else {
        $("#newName").val("");
        $("#newInit").val("");
        $("#newDex").val("");
        $("#addCombatantAdd").show();
        $("#addCombatantUpdate").hide();
        $("#addCombatantDiv").show();
      }
    },
    'click input#addCombatantAdd': function () {
      Combatants.insert({name:$("#newName").val(),initiative:Number($("#newInit").val()),dex:Number($("#newDex").val())});
      $("#addCombatantDiv").hide();
    },
    'click input#addCombatantUpdate': function () {
      Combatants.update({_id:Session.get("selected_combatant")},{$set:{initiative:$("#newInit").val()}});
      $("#addCombatantDiv").hide();
    },
    'click input#deleteCombatant': function () {
      Combatants.remove(Session.get("selected_combatant"));
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
      $("#addCombatantUpdate").show();
      $("#addCombatantAdd").hide();
      $("#addCombatantDiv").show();
    },
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
    }
  });
