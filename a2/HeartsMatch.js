var HeartsMatch = function (player_north, player_east, player_south, player_west, options) {

    var game_setup_handlers = [];
    
    var match_options = {
	matchScoreLimit : 100
    }

    if (options != null) {
	for (var key in options) {
	    match_options[key] = options[key];
	}
    }
    
    var scoreboard = {};

    scoreboard[Hearts.NORTH] = 0;
    scoreboard[Hearts.EAST] = 0;
    scoreboard[Hearts.SOUTH] = 0;
    scoreboard[Hearts.WEST] = 0;

    this.getScoreboard = function() {
	return scoreboard;
    }

    this.getPlayerName = function(pos) {
	if (pos == Hearts.NORTH) {
	    return player_north.getName();
	} else if (pos == Hearts.EAST) {
	    return player_east.getName();
	} else if (pos == Hearts.WEST) {
	    return player_west.getName();
	} else if (pos == Hearts.SOUTH) {
	    return player_south.getName();
	}
    }

    this.getPlayerByPosition = function(pos) {
	if (pos == Hearts.NORTH) {
	    return player_north;
	} else if (pos == Hearts.EAST) {
	    return player_east;
	} else if (pos == Hearts.WEST) {
	    return player_west;
	} else if (pos == Hearts.SOUTH) {
	    return player_south;
	}
    }

    
    var next_pass = Hearts.PASS_LEFT;

    var game_end_handler = function (e) {
	scoreboard[Hearts.NORTH] += e.game.getScore(Hearts.NORTH);
	scoreboard[Hearts.EAST] += e.game.getScore(Hearts.EAST);
	scoreboard[Hearts.SOUTH] += e.game.getScore(Hearts.SOUTH);
	scoreboard[Hearts.WEST] += e.game.getScore(Hearts.WEST);

	if (scoreboard[Hearts.NORTH] >= match_options.matchScoreLimit ||
	    scoreboard[Hearts.EAST] >= match_options.matchScoreLimit ||
	    scoreboard[Hearts.WEST] >= match_options.matchScoreLimit ||
	    scoreboard[Hearts.SOUTH] >= match_options.matchScoreLimit) {
	    // Match over.
	    return;
	}

	setTimeout(function() {setup_next_game();}, 1500);
    }

    var setup_next_game = function (e) {
	var next_game = new GameOfHearts(next_pass);

	if (next_pass == Hearts.PASS_LEFT) {
	    next_pass = Hearts.PASS_RIGHT;
	} else if (next_pass == Hearts.PASS_RIGHT) {
	    next_pass = Hearts.PASS_ACROSS;
	} else if (next_pass == Hearts.PASS_ACROSS) {
	    next_pass = Hearts.PASS_NONE;
	} else {
	    next_pass = Hearts.PASS_LEFT;
	}

	game_setup_handlers.forEach(function (callback) {
	    callback(next_game);
	});
	
	next_game.registerEventHandler(Hearts.GAME_OVER_EVENT, game_end_handler);

	north_key = next_game.registerPlayer(Hearts.NORTH);
	player_north.setupNextGame(next_game, north_key);

	east_key = next_game.registerPlayer(Hearts.EAST);
	player_east.setupNextGame(next_game, east_key);

	south_key = next_game.registerPlayer(Hearts.SOUTH);
	player_south.setupNextGame(next_game, south_key);

	west_key = next_game.registerPlayer(Hearts.WEST);
	player_west.setupNextGame(next_game, west_key);

	next_game.startGame();
    }
	
    this.run = function() {
	setup_next_game();
    }

    player_north.setupMatch(this, Hearts.NORTH);
    player_east.setupMatch(this, Hearts.EAST);
    player_south.setupMatch(this, Hearts.SOUTH);
    player_west.setupMatch(this, Hearts.WEST);

    this.registerGameSetupHandler = function(callback) {
	game_setup_handlers.push(callback);
    }
}	    
	
