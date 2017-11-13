var DumbAI = function (name) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }

    this.getName = function () {
	return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts;
	player_key = pkey;

	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
	    if (e.getPassType() != Hearts.PASS_NONE) {
		var cards = current_game.getHand(player_key).getDealtCards(player_key);
		
		current_game.passCards(cards.splice(0,3), player_key);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
	    if (e.getStartPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
	    if (e.getNextPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
	    }
	});
    }
}

