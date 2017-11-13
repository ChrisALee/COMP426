/* Game of Hearts model object. */

var Hearts = {
    // Pass constants
    PASS_LEFT : 1,
    PASS_RIGHT : 2,
    PASS_ACROSS : 3,
    PASS_NONE : 4,

    // Player positions
    NORTH : "North",
    EAST : "East",
    SOUTH : "South",
    WEST : "West",

    // Game status constants
    FINISHED : -1,
    REGISTERING_PLAYERS : 0,
    PASSING : 1,
    TRICK_IN_PROGRESS : 2,

    // Game event types
    ALL_EVENTS : -1,
    GAME_OVER_EVENT : 0,
    GAME_STARTED_EVENT : 1,
    TRICK_START_EVENT : 2,
    TRICK_CONTINUE_EVENT : 3,
    TRICK_COMPLETE_EVENT : 4,
    CARD_PLAYED_EVENT : 5,
    PASSING_COMPLETE_EVENT : 6,
};

Hearts.allPositions = [Hearts.NORTH, Hearts.EAST, Hearts.SOUTH, Hearts.WEST];

Hearts.nextByPosition = {};
Hearts.nextByPosition[Hearts.NORTH] = Hearts.EAST;
Hearts.nextByPosition[Hearts.EAST] = Hearts.SOUTH;
Hearts.nextByPosition[Hearts.SOUTH] = Hearts.WEST;
Hearts.nextByPosition[Hearts.WEST] = Hearts.NORTH;

Hearts.passMap = {};
Hearts.passMap[Hearts.NORTH] = {}
Hearts.passMap[Hearts.NORTH][Hearts.PASS_NONE] = Hearts.NORTH;
Hearts.passMap[Hearts.NORTH][Hearts.PASS_LEFT] =  Hearts.EAST;
Hearts.passMap[Hearts.NORTH][Hearts.PASS_RIGHT] = Hearts.WEST;
Hearts.passMap[Hearts.NORTH][Hearts.PASS_ACROSS] = Hearts.SOUTH;
Hearts.passMap[Hearts.EAST] = {}
Hearts.passMap[Hearts.EAST][Hearts.PASS_NONE] = Hearts.EAST;
Hearts.passMap[Hearts.EAST][Hearts.PASS_LEFT] =  Hearts.SOUTH;
Hearts.passMap[Hearts.EAST][Hearts.PASS_RIGHT] = Hearts.NORTH;
Hearts.passMap[Hearts.EAST][Hearts.PASS_ACROSS] = Hearts.WEST;
Hearts.passMap[Hearts.SOUTH] = {}
Hearts.passMap[Hearts.SOUTH][Hearts.PASS_NONE] = Hearts.SOUTH;
Hearts.passMap[Hearts.SOUTH][Hearts.PASS_LEFT] =  Hearts.WEST;
Hearts.passMap[Hearts.SOUTH][Hearts.PASS_RIGHT] = Hearts.EAST;
Hearts.passMap[Hearts.SOUTH][Hearts.PASS_ACROSS] = Hearts.NORTH;
Hearts.passMap[Hearts.WEST] = {}
Hearts.passMap[Hearts.WEST][Hearts.PASS_NONE] = Hearts.WEST;
Hearts.passMap[Hearts.WEST][Hearts.PASS_LEFT] =  Hearts.NORTH;
Hearts.passMap[Hearts.WEST][Hearts.PASS_RIGHT] = Hearts.SOUTH;
Hearts.passMap[Hearts.WEST][Hearts.PASS_ACROSS] = Hearts.EAST;


var GameOfHearts = function (pass, options) {

    /* The makeKey function is used to create
     * keys for each player as they register
     * in order to authenticate player actions */
    
    var makeKey = function(len) {
	var key = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (var i=0; i<len; i++) {
	    key += possible.charAt(Math.floor(Math.random()*possible.length));
	}
	return key;
    };

    // Private fields

    var game_key = makeKey(10);
    
    var deck = new Deck();
    deck.shuffle();

    var hands = {};
    var cards_to_pass = {};

    var completed_tricks = [];
    var points_broken = false;
    var current_trick = null;

    var score = {};
    
    var game_options = {
	bloodOnFirstTrick : false,
	jackOfDiamondsBonus : false
    }

    if (options != null) {
	for (var key in options) {
	    game_options[key] = options[key];
	}
    }
    
    var status = Hearts.REGISTERING_PLAYERS;
    var player_keys = {};
    Hearts.allPositions.forEach(function(pos) {
	player_keys[pos] = null;
    });
    
    var registeredEventHandlers = {};

    // Private methods

    // The following line captures the value of this (i.e.,
    // a reference to the game object) as the local
    // variable that. Makes it possible for private
    // methods which may be called in a way where "this" is
    // not defined as the game object to have access to the
    // game object via the closure.
    
    var that = this;

    var dispatch_queue = [];
    var dispatching = false;
    
    var dispatchEvent = function (e) {
	if (dispatching) {
	    dispatch_queue.push(e);
	} else {
	    dispatching = true;
	    
	    // If the game is over, don't generate events.
	    if (that.status == Hearts.FINISHED) {
		return;
	    }

	    // If this is the game over event, update the
	    // game status to be FINISHED and calculate
	    // final scores
	    if (e.event_type == Hearts.GAME_OVER_EVENT) {
		that.status = Hearts.FINISHED;

		score[Hearts.NORTH] = 0;
		score[Hearts.SOUTH] = 0;
		score[Hearts.EAST] = 0;
		score[Hearts.WEST] = 0;
		
		completed_tricks.forEach(function (t) {
		    score[t.getWinner()] += t.getPoints();
		});
		// Check for shooting the moon.
		if (score[Hearts.NORTH] == 26) {
		    score[Hearts.NORTH] = 0;
		    score[Hearts.SOUTH] = 26;
		    score[Hearts.EAST] = 26;
		    score[Hearts.WEST] = 26;
		} else if (score[Hearts.SOUTH] == 26) {
		    score[Hearts.SOUTH] = 0;
		    score[Hearts.NORTH] = 26;
		    score[Hearts.EAST] = 26;
		    score[Hearts.WEST] = 26;
		} else if (score[Hearts.EAST] == 26) {
		    score[Hearts.EAST] = 0;
		    score[Hearts.NORTH] = 26;
		    score[Hearts.SOUTH] = 26;
		    score[Hearts.WEST] = 26;
		} else if (score[Hearts.WEST] == 26) {
		    score[Hearts.WEST] = 0;
		    score[Hearts.NORTH] = 26;
		    score[Hearts.EAST] = 26;
		    score[Hearts.SOUTH] = 26;
		}
	    }
	
	    // A bit of a hack to add a game property
	    // to every event that is fired without having to
	    // remember to build it into the definition of each event type.
	    e.game = that;

	    // Call all registered handlers for the event type if any.
	    var handlers = registeredEventHandlers[e.event_type];
	    if (handlers != null) {
		handlers.forEach(function (h) {
		    var e_clone = $.extend(true, {}, e);
		    h(e_clone);
		});
	    }

	    // Call all handlers registered for ALL_EVENTS
	    handlers = registeredEventHandlers[Hearts.ALL_EVENTS];
	    if (handlers != null) {
		handlers.forEach(function (h) {
		    var e_clone = $.extend(true, {}, e);
		    h(e_clone);
		});
	    }

	    dispatching = false;
	    if (dispatch_queue.length > 0) {
		var next_to_dispatch = (dispatch_queue.splice(0, 1))[0];
		dispatchEvent(next_to_dispatch);
	    }
	}
    }


    var startFirstTrick = function() {

	// Find the hand with the unplayed 2 of clubs
	var two_of_clubs = new Card(2, Card.Suit.CLUB);
	
	var start_pos = Hearts.NORTH;
	var found = false;
	while (!found) {
	    var unplayed_cards = hands[start_pos].getUnplayedCards(game_key);
	    var found_two = unplayed_cards.find(function (c) {return c.equals(two_of_clubs);});
	    if (found_two != undefined) {
		found = true;
	    } else {
		start_pos = Hearts.nextByPosition[start_pos];
	    }
	}

	current_trick = new Trick(start_pos, game_key);
	
	status = Hearts.TRICK_IN_PROGRESS;
	dispatchEvent(new PassingCompleteEvent());
	dispatchEvent(new TrickStartEvent(that.getNextToPlay()));
    }

    var findPositionByKey = function(player_key) {
	if (player_key == player_keys[Hearts.NORTH]) {
	    return Hearts.NORTH;
	} else if (player_key == player_keys[Hearts.EAST]) {
	    return Hearts.EAST;
	} else if (player_key == player_keys[Hearts.SOUTH]) {
	    return Hearts.SOUTH;
	} else if (player_key == player_keys[Hearts.WEST]) {
	    return Hearts.WEST;
	}
	return null;
    }

    // Public methods that require
    // access to private fields and methods

    this.isKey = function(k) {return k == game_key;};

    this.getStatus = function () {return status;}

    this.registerPlayer = function(position) {
	if (player_keys[position] != null) {
	    return false; // Already have a player at that position
	}

	player_keys[position] = makeKey(10);
	return player_keys[position];
    }

    this.registerEventHandler = function(type, handler) {
	if (registeredEventHandlers[type] == null) {
	    registeredEventHandlers[type] = [];
	}
	registeredEventHandlers[type].push(handler);
    };

    this.unregisterEventHandler = function(type, handler) {
	if (registeredEventHandlers[type] == null) {
	    return false;
	}

	var idx = registeredEventHandlers[type].indexOf(handler);

	if (idx == -1) {
	    return false;
	}

	registeredEventHandlers[type].splice(idx, 1);
	return true;
    };
    
    
    this.startGame = function() {
	if (status != Hearts.REGISTERING_PLAYERS ||
	    player_keys[Hearts.NORTH] == null ||
	    player_keys[Hearts.EAST] == null ||
	    player_keys[Hearts.SOUTH] == null ||
	    player_keys[Hearts.WEST] == null) {
	    return false;
	}

	hands[Hearts.NORTH] = new Hand(deck.deal(13), player_keys[Hearts.NORTH], this);
	hands[Hearts.EAST] = new Hand(deck.deal(13), player_keys[Hearts.EAST], this);
	hands[Hearts.SOUTH] = new Hand(deck.deal(13), player_keys[Hearts.SOUTH], this);
	hands[Hearts.WEST] = new Hand(deck.deal(13), player_keys[Hearts.WEST], this);

	status = Hearts.PASSING;
	cards_to_pass = {};
	dispatchEvent(new GameStartedEvent(pass));

	if (pass == Hearts.PASS_NONE) {
	    startFirstTrick();
	}
    }

    this.getNextToPlay = function() {
	if (current_trick == null) {
	    return null;
	}
	return current_trick.getNextToPlay();
    }

    this.checkKeyForNextToPlay = function(player_key) {
	return player_keys[this.getNextToPlay()] == player_key;
    }
    
    this.pointsBroken = function () {
	return points_broken;
    }

    this.getCurrentTrick = function () {
	return current_trick;
    }

    this.onFirstTrick = function () {
	return (completed_tricks.length == 0);
    }
    
    this.passCards = function(cards, player_key) {
	if (status != Hearts.PASSING) {
	    return false;
	}

	if (pass == Hearts.PASS_NONE) {
	    return false;
	}
	
	if (!Array.isArray(cards)) {
	    return false;
	}
	if (cards.length != 3) {
	    return false;
	}
	if (!((cards[0] instanceof Card) &&
	      (cards[1] instanceof Card) &&
	      (cards[2] instanceof Card))) {
	    return false;
	}
	
	var player_pos = findPositionByKey(player_key);
	if (player_pos == null) {
	    return false;
	}

	for (var i=0; i<3; i++) {
	    if (!hands[player_pos].contains(cards[i], player_key)) {
		return false;
	    }
	}

	cards_to_pass[player_pos] = cards;

	if (cards_to_pass[Hearts.NORTH] != null &&
	    cards_to_pass[Hearts.EAST] != null &&
	    cards_to_pass[Hearts.SOUTH] != null &&
	    cards_to_pass[Hearts.WEST] != null) {

	    Hearts.allPositions.forEach(function (pos) {
		var pass_to = Hearts.passMap[pos][pass];
		cards_to_pass[pos].forEach(function (card) {
		    hands[pos].removePassedCard(card, game_key);
		    hands[pass_to].addPassedCard(card, game_key);
		});
	    });
	    startFirstTrick();
	}
	return true;
    }

    this.playCard = function (card, player_key) {
	if (status != Hearts.TRICK_IN_PROGRESS) {
	    return false;
	}

	if (card == null) {
	    return false;
	}

	if (!(card instanceof Card)) {
	    return false;
	}
	
	var player_pos = findPositionByKey(player_key);
	if (player_pos == null) {
	    return false;
	}
	
	if (current_trick.getNextToPlay() != player_pos) {
	    return false;
	}

	var actual_card_played =
	    hands[player_pos].getPlayableCards(game_key).find(function (c) {
		return c.equals(card);
	    });

	if (!actual_card_played) {
	    return false;
	}

	hands[player_pos].markCardPlayed(actual_card_played, game_key);
	current_trick.addCardPlayed(actual_card_played, game_key);
	dispatchEvent(new CardPlayedEvent(player_pos, actual_card_played));
	
	if (current_trick.isComplete()) {
	    points_broken = points_broken || current_trick.hasPoints();
	    completed_tricks.push(current_trick);

	    dispatchEvent(new TrickCompleteEvent(current_trick));

	    if (completed_tricks.length == 13) {
		current_trick = null;
		dispatchEvent(new GameOverEvent());
	    } else {
		current_trick = new Trick(current_trick.getWinner(), game_key);
		dispatchEvent(new TrickStartEvent(this.getNextToPlay()));
	    }
	} else {
	    dispatchEvent(new TrickContinueEvent(this.getNextToPlay()));
	}
	return true;
    }
	
    this.getHand = function (player_key) {
	return hands[findPositionByKey(player_key)];
    }

    this.getScore = function (pos) {
	return score[pos];
    }
}

	
var TrickStartEvent = function (start_pos) {
    this.event_type = Hearts.TRICK_START_EVENT;
    this.getStartPos = function () {
	return start_pos;
    }
}

TrickStartEvent.prototype.toString = function () {
    return "TrickStartEvent: " + this.getStartPos() + " to lead."
}


var TrickContinueEvent = function (next_pos) {
    this.event_type = Hearts.TRICK_CONTINUE_EVENT;
    this.getNextPos = function () {
	return next_pos;
    }
}

TrickContinueEvent.prototype.toString = function () {
    return "TrickContinueEvent: " + this.getNextPos() + " to play.";
}


var TrickCompleteEvent = function (trick) {
    this.event_type = Hearts.TRICK_COMPLETE_EVENT;
    this.getTrick = function() {return trick;}
}

TrickCompleteEvent.prototype.toString = function () {
    return "TrickCompleteEvent: " + this.getTrick().getWinner() + " won trick with " +
	(this.getTrick().hasPoints() ? "points" : "no points") + ".";
}

var GameStartedEvent = function (pass) {
    this.event_type = Hearts.GAME_STARTED_EVENT;
    this.getPassType = function () {
	return pass;
    }
}

GameStartedEvent.prototype.toString = function () {
    var str = "GameStartedEvent: ";
    switch (this.getPassType()) {
    case Hearts.PASS_LEFT: str += "passing left."; break;
    case Hearts.PASS_RIGHT: str += "passing right."; break;
    case Hearts.PASS_ACROSS: str += "passing across."; break;
    case Hearts.PASS_NONE: str += "no pass."; break;
    }
    return str;
}

var GameOverEvent = function () {
    this.event_type = Hearts.GAME_OVER_EVENT;
}

GameOverEvent.prototype.toString = function () {
    return "GameOverEvent";
}

var CardPlayedEvent = function (position, card) {
    this.event_type = Hearts.CARD_PLAYED_EVENT;

    this.getPosition = function() {
	return position;
    }

    this.getCard = function () {
	return card;
    }
}

CardPlayedEvent.prototype.toString = function() {
    return "CardPlayedEvent: " + this.getPosition() + " played " + this.getCard();
}

var PassingCompleteEvent = function () {
    this.event_type = Hearts.PASSING_COMPLETE_EVENT;
}

PassingCompleteEvent.prototype.toString = function() {
    return "PassingCompleteEvent";
}
