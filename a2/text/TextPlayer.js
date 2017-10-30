var TextPlayer = function (name, ui_div) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var ui_message_log = $("<div class='text_player_message_log'></div>");
    var ui_input_form = $("<form class='text_player_input_form'><input type='text' class='text_player_input'></form>");

    $(ui_div).append(ui_message_log).append(ui_input_form);

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

	game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
	    message_log_append($("<div class='text_player_message'>"+e.toString()+"</div>"));
	});
    }

    var message_log_append = function (msg) {
	ui_message_log.append($(msg));
	ui_message_log.scrollTop(ui_message_log.prop("scrollHeight")-ui_message_log.height());
    }
    
    ui_input_form.on('submit', function (e) {
	e.preventDefault();
	var cmd = $(this).find('.text_player_input').val().split(" ");
	action = cmd[0];
	if (action == "pass") {
	    var cards = [new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2])),
			 new Card(Card.parseRank(cmd[3]), Card.parseSuit(cmd[4])),
			 new Card(Card.parseRank(cmd[5]), Card.parseSuit(cmd[6]))];
	    if (!current_game.passCards(cards, player_key)) {
		message_log_append($("<div class='text_player_message error'>Card pass failed!</div>"));
	    } else {
		message_log_append($("<div class='text_player_message'>Cards passed. Waiting for first trick to start.</div>"));
	    }
	} else if (action == "showPlayable") {
	    var playable = current_game.getHand(player_key).getPlayableCards(player_key);
	    var playable_message = $("<div class='text_player_message'>Playable cards:</div>");
	    var playable_list = $("<ul></ul>");
	    playable.forEach(function (c) {
		playable_list.append($("<li>"+c.toString()+"</li>"));
	    });
	    playable_message.append(playable_list);
	    message_log_append(playable_message);
	} else if (action == "showDealt") {
	    var dealt = current_game.getHand(player_key).getDealtCards(player_key);
	    var dealt_message = $("<div class='text_player_message'>Dealt cards:</div>");
	    var dealt_list = $("<ul></ul>");
	    dealt.forEach(function (c) {
		dealt_list.append($("<li>"+c.toString()+"</li>"));
	    });
	    dealt_message.append(dealt_list);
	    message_log_append(dealt_message);
	} else if (action == "play") {
	    var card_to_play = new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2]));
	    if (!current_game.playCard(card_to_play, player_key)) {
		message_log_append($("<div class='text_player_message error'>Attempt to play " +
					card_to_play.toString() + " failed!</div>"));
	    }
	} else if (action == "autoplay") {
	    var autoplay_handler = function (e) {
		if (current_game.getNextToPlay() == position) {
		    current_game.playCard(current_game.getHand(player_key).getPlayableCards(player_key)[0],
					  player_key);
		}
	    }
	    
	    current_game.registerEventHandler(Hearts.TRICK_START_EVENT, autoplay_handler);
	    current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, autoplay_handler);
	    autoplay_handler();
	} else if (action == "scoreboard") {
	    var sb = match.getScoreboard();
	    message_log_append($("<div class='text_player_message'>Scoreboard:<ul>"+
				    "<li>"+match.getPlayerName(Hearts.NORTH)+": " +
				    sb[Hearts.NORTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.EAST)+": " +
				    sb[Hearts.EAST] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.SOUTH)+": " +
				    sb[Hearts.SOUTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.WEST)+": " +
				    sb[Hearts.WEST] + "</li>" +
				    "</ul></div>"));
	}else {
	    message_log_append($("<div class='text_player_message error'>Unknown action: " + action + "</div>"));
	}
	// Clear text input
	$(this).find('.text_player_input').val("")
    });
}
    
