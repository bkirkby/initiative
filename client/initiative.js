// Set up a collection to contain combatant information. On the server,
// it is backed by a MongoDB collection named "combatants".

Combatants = new Meteor.Collection("combatants");
Turn = new Meteor.Collection("turn");

  $(function() {
    $( "#sortable" ).sortable({
      revert: false
      , stop: function( event, ui ) {
        sort();
      }
    });
  });

  function sort() {
    var domCombatants = $.find(".combatant");
    var position = 0;

    $(domCombatants).each(function(index, domCombatant) {
      id = $(domCombatant).attr("_id");
      Combatants.find().forEach(
        function(combatant) {
          if(id == combatant._id) {
            Combatants.update({_id:id}, {$set:{position:position}});
            position++;
          }
        }
      );
    });
  }

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
    return Turn.findOne().combatantId === this._id ? "yes" : "";
  };

  Template.combatant.opacity = function () {
    var combatant = Combatants.findOne(this._id);
    return Math.max(combatant.currHp/combatant.maxHp, .15);
  };

  function gotoNextCombatant() {
    var currTurn = Turn.findOne();
    var nextCombatant= Combatants.find({position:{$gt:currTurn.position}},{sort:{position: 1, initiative: -1, dex: -1}}).fetch()[0];
    if( typeof nextCombatant == 'undefined') {
      nextCombatant = Combatants.find({},{sort:{position: 1, initiative: -1, dex: -1}}).fetch()[0];
    }
    Turn.update({_id:currTurn._id},{position:nextCombatant.position,combatantId:nextCombatant._id});
  }

  Template.initiative.events({
    'click input#closeAddCombatantDiv': function () {
      $("#addCombatantDiv").appendTo("#topCombatantDiv");
      $("#addCombatantDiv").hide();
    },
    'click input#addCombatantShow': function () {
      $("#addCombatantDiv").appendTo("#topCombatantDiv");
      $("#newName").val("");
      $("#newInit").val("");
      $("#newDex").val("");
      $("#isMonster").prop("checked", true);
      $("#newMaxHp").val("");
      $("#newCurrHp").val("");
      $("#addCombatantAdd").show();
      $("#updateCombatant").hide();
      $("#addCombatantDiv").show();
    },
    'click input#addCombatantAdd': function () {
      var currCombatant = Combatants.find({},{sort:{position: -1, initiative: -1, dex: -1}}).fetch()[0];
      if( typeof currCombatant == 'undefined' ){
        nextPos = 0;
      } else {
        nextPos = currCombatant.position+1;
      }
      Combatants.insert({name:$("#newName").val(),
        initiative:Number($("#newInit").val()),
        dex:Number($("#newDex").val()),
        isMonster:$("#isMonster").is(":checked"),
        position:nextPos,
        maxHp:$("#newMaxHp").val(),
        currHp:$("#newCurrHp").val()
      });
      $("#addCombatantDiv").hide();
    },
    'click input#updateCombatant': function () {
      var combatant = Combatants.find({_id:Session.get("selected_combatant")}).fetch()[0];
      Combatants.update({_id:Session.get("selected_combatant")},{$set:{
        initiative:Number($("#newInit").val()),
        dex:Number($("#newDex").val()),
        name:$("#newName").val(),
        isMonster:$("#isMonster").is(":checked"),
        position:combatant.position,
        maxHp:Number($("#newMaxHp").val()),
        currHp:Number($("#newCurrHp").val()) }
      });
      $("#addCombatantDiv").hide();
    },
    'click input#deleteCombatant': function () {
      Combatants.remove(Session.get("selected_combatant"));
    },
    'click #turnArrow': function() {
      gotoNextCombatant();
    },
    'click input#nextPlayer': function() {
      gotoNextCombatant();
    },
    'click #recalcInitiatives': function() {
      var combatants=Combatants.find({},{sort:{initiative: -1, dex: -1}});
      var i=0;
      var firstCId;
      combatants.forEach( function(combatant) {
        if( i==0) {
          firstCId = combatant._id;
        }
        Combatants.update({_id:combatant._id},{$set:{position:i++}});
      });
      var turn = Turn.findOne();
      Turn.update({_id:turn._id},{$set:{position:0,combatantId:firstCId}});
    }
  });

  function editCombatant( combatantId) {
    $("#addCombatantDiv").appendTo("#"+combatantId);
    Session.set("edit_combatant", combatantId);
    var player = Combatants.findOne(combatantId);
    $("#newName").val( player.name);
    $("#newInit").val( player.initiative);
    $("#newDex").val( player.dex);
    $("#isMonster").prop("checked", player.isMonster);
    $("#newMaxHp").val( player.maxHp);
    $("#newCurrHp").val( player.currHp);
    $("#updateCombatant").show();
    $("#addCombatantAdd").hide();
    $("#addCombatantDiv").show();
  }

  Template.combatant.events({
    'click': function () {
      Session.set("selected_combatant", this._id);
    },
    'dblclick': function () {
      editCombatant( this._id);
    }
  });
