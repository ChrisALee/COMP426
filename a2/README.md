Assignment 2

JavaScript Game

Due: November 3rd, 11:59:59 pm

Game of Hearts

In this assignment, you'll create a standalone JavaScript game that runs in a browser. This assignment will exercise various aspects of client-side programming including CSS, HTML, JavaScript, and jQuery using event-based programming and dynamically updating the DOM.

Set Up

Create a directory in your course web space called "a2".

Copy all of the file from this directory into your a2 directory: http://www.cs.unc.edu/Courses/comp426-f17/hearts

The Game Of Hearts

As explained in class, hearts is a cardgame played with 4 people. Your version of hearts will allow a user to play against 3 AI players. You don't really need to have played hearts in order to do the assignment, but it may help you understand how the description of the game that follows and the interface that you need to build so if you've never played hearts go here, read the rules and play a few games:

https://cardgames.io/hearts/

A Hearts Match

A "hearts match" is played between 4 players sitting around a card table. You can think of these four positions as north, east, south, and west. A match is played as a series of hearts games. Each game will result in a score for the four players and scores from the games are added together until one player reaches 100 points. At this point the match is over and the player with the lowest score wins.

Each game of hearts involves potentially passing cards to another player. In a hearts match, the first game is played with cards passed to the left (i.e., north to east, east to south, south to west, and west to north). The second game is played with cards passed to the right. The third game is played with cards passed across. The fourth game is played with no passing. Any subsequent games repeat this pattern.

A Hearts Game

A single game of hearts is played by first dealing each player a "hand" of 13 cards. The first action of the game is to pass cards to another player if necessary (every fourth game will be a "no pass" game) as described above. Each player chooses 3 cards to pass. Once all 4 players have chosen, the cards are passed simultaneously.

Once cards have been passed, play begins with the player that has the 2 of clubs. This card leads the first trick (i.e., round). In clockwise order, each player must then play a card. A player must play the same suit as led (so, for example, clubs on the first trick) if possible. If the player does not have that suit, they may play any card they wish. The player that plays the highest (2 is low, Ace is high) ranked card of the leading suit wins that trick (i.e., round), collects any points in that trick (see scoring below), and leads off the next trick.

When leading, a player may not lead with a heart unless a heart has already been played in some prior trick unless the player has nothing but hearts and is forced to lead with a heart. If a heart has already been played on a prior trick, then there is no restriction and a player may lead with a heart if they want.

Play continues until all 13 cards have been played (i.e., 13 tricks).

Scoring

Each heart is worth 1 point and the queen of spades is worth 13 points for a total of 26 possible points in one game of hearts. If a player collects all 26 points, this is known as "shooting the moon" and in that case, that player is given 0 points and every other player is given 26 points. Remember, the object of the game is to avoid points, so lower scores are better.

Writing The Software

Your version of hearts should be accessed via a single HTML file in your a2 directory called "hearts.html". You should include via <script> elements the following JavaScript source files (in this order):

jquery-3.2.1.js
This just loads jQuery which is required by some of the other scripts and will be generally useful for your game.
Card.js
This file contains class definitions for the Card object that is used to represent a specific card and the Hand object that is used to represent a particular player's hand.
Hearts.js
This file contains the class definition for GameOfHearts which represents a single game of hearts.
HeartsMatch.js
This file contains the class defintions for HeartsMatch which creates and runs a series of hearts games.
DumbAI.js
This file contains the class definition for a "dumb" AI player that will simply pass the first 3 cards of its hand when necessary and play the first playable card from its hand at any given time.
You should include subsequent <script> elements for your code. You are free to put all of your code in a single file or to organize it into multiple files as you see fit.

The "main" program that your code runs should create three instances of a DumbAI and one instance of a player object that connects your game's interface with the actions of one of the player's in the match. Your code should register the three DumbAI's and your player object with a new HeartsMatch object and then run the match by calling the HeartsMatch object's run() method. See the file TextPlayerVsThreeDumbAI.js for an example.

The HeartsMatch object expects your player object to have the following methods:

getName()
Retrieves the name of your player. This can be hardcoded or be something that your game provides an interface for setting/changing.
setupMatch(match_object, position)
This method will be called by the HeartsMatch object once in order to provide to your player object a reference to the match object (the first parameter) and the position associated with your player (one of "North", "East", "South", or "West").
setupNextGame(next_game, player_key)
This method will be called by the HeartsMatch object just before each hearts game is played. The first parameter will be a reference to the GameOfHearts object that models the hearts game that is about to be played and the second parameter will be your player's "key" which is necessary to retrieve and interact with your player's hand and to execute certain methods on the game object.
Game Events

For each game of hearts that is set up and run by the HeartsMatch object, your player object should set up one or more "game event handlers" in order to respond to game events. To do this, use the registerEventHandler method of the GameOfHearts game object in order to register a callback function. This method has the following signature: registerEventHandler(event_type, handler)

The registerEventHandler method expects a first parameter, event_type, that indicates which event type the handler should be called for. The available event types are defined as constants on a global Hearts object as follows:

Hearts.ALL_EVENTS
Hearts.GAME_OVER_EVENT
Hearts.GAME_STARTED_EVENT
Hearts.TRICK_START_EVENT
Hearts.TRICK_CONTINUE_EVENT
Hearts.TRICK_COMPLETE_EVENT
Hearts.CARD_PLAYED_EVENT
Hearts.PASSING_COMPLETE_EVENT
Registering a handler with ALL_EVENTS will deliver all events of every type to the handler. Otherwise, the handler will be called for just the event type that it was registered for.

The second parameter to registerEventHandler (i.e., handler) should be the function object that you are trying to register as a callback. The registered callback function will be executed whenever a relevant game event occurs. The callback will be provided with a single parameter that will be a game event object that describes which event has occured.

There is a separate game event object type for each of the game events listed above. All game event objects regardless of type will have the properties event_type and game. The event_type property will be one of the event type constants listed above. The game property will be a reference to the hearts game object that generated the event. Depending on the event type, the game event object may have additional methods for retrieving information about the event as follows:

Event Type	Event object method names	Description
GAME_STARTED_EVENT	getPassType()	Reports what kind of passing is required. One of Hearts.PASS_LEFT, Hearts.PASS_RIGHT, Hearts.PASS_ACROSS, or Hearts.PASS_NONE
TRICK_START_EVENT	getStartPos()	Reports which position is expected to play a card in order to start the next trick.
TRICK_CONTINUE_EVENT	getNextPos()	Reports which position is expected to play a card in order to continue the current trick.
TRICK_COMPLETE_EVENT	getTrick()	Returns a Trick object that represents the just completed trick.
CARD_PLAYED_EVENT	getPosition()	Returns the position of the player that played the card.
getCard()	Returns the Card object of the card that was played.
Event Order / Player Interactions

Each game of hearts will produce events and expect actions to be taken by your player as follows.

The first event produced by a game will be a GAME_STARTED_EVENT. If the game requires passing (i.e., the value of getPassType() on the game started event object is one of Hearts.PASS_LEFT, Hearts.PASS_RIGHT, or Hearts.PASS_ACROSS), then the game will expect you to call the passCards() method on the game object in order to indicate which cards to pass. See Passing and Playing Cards below.

After the GAME_STARTED_EVENT, once all cards have been passed or immediately in the case of a no pass game, a PASSING_COMPLETE_EVENT will be generated.

After the PASSING_COMPLETE_EVENT, a TRICK_START_EVENT will be generated to signal the start of the first trick. Use the getStartPos() method of the game event object in order to find out which player is expected to lead this trick. You can compare this value to your player's position in order to detect when your player is expected to play a card to lead the trick (see Passing and Playing Cards below for more). Your player's position was originally reported back to you by the HeartsMatch object when it called your player object's setupMatch() method.

After a card is played to lead the trick, a CARD_PLAYED_EVENT is generated to report which card was played.

After a card has been played to lead the trick, a TRICK_CONTINUE_EVENT will be generated once for each of the next three players in order to signal that a card should be played into the current trick. Each TRICK_CONTINUE_EVENT is followed by a CARD_PLAYED_EVENT to report which card was played. As with TRICK_START_EVENT, if the next position to play is your player, then the game will be waiting on your player to play a card next.

After all four players have played a card into the trick, a TRICK_COMPLETE_EVENT is generated. The getTrick() method of the trick complete game event object can be used to retrieve a Trick object that encapsulates all of the relevant information about the trick that was completed. See the Trick object reference page for details.

After each trick is complete, the sequence begins again with a TRICK_START_EVENT until all 13 tricks have been completed. After the 13th trick is completed, the game will generate a GAME_OVER_EVENT.

The HeartsMatch object will then setup the next game, calling your player object's setupNextGame method to provide a reference to the next game object and a new player key for the next game thus allowing your player to register an event callback handler for this next game and the sequence starts all over again.

Passing and Playing Cards

At various points in a game, your player will be expected to pass or play cards and in general, you will need to know which cards are in your player's hand in order to display some representation of them in your interface.

A player's hand is represented by a Hand object. You can retrieve your player's hand from the game object using the getHand(player_key) method. This method requires you to pass your player's key. If you do not (or if the player key is incorrect), the method will fail.

Given a Hand object, you can retrieve an array of the 13 cards originally dealt to the hand before any passing has occured using the method getDealtCards(player_key).

After passing is complete, you can retrieve the current remaining unplayed cards in a hand using the getUnplayedCards(player_key) method.

Any cards already played can be retrieved with the getPlayedCards(player_key) method.

All of these Hand methods require as a parameter the appropriate player key associated with the hand in order to succeeed.

When your player is expected to pass cards, your interface should provide some way for the player to select three cards to pass. Once selected, you should call the passCards(cards, player_key) method of the game object.

The first parameter, cards, should be an array of three Card objects that represent the cards your player would like to pass. The second parameter, player_key, should be the player key provided to your player when the game was setup. On success, the method will return true. If something goes wrong (i.e., too few or too many cards, you passed cards that aren't actually in your hand, wrong player key, etc.), the method will return false.

When your player is expected to play a card during a trick, your interface should provide some way for the player to select a card to play and then once selected you should call the playCard(card, player_key) method of the game object.

The first parameter should be a Card object for the card to be played. The second parameter should by your player key. The method returns true on success and false on failure.

Once all players have passed cards, the game object will do the work of updating the Hand objects of each player by removing the cards passed and adding the cards that were passed to the hand. This will be reflected in the result of the getUnplayedCards method of the hand. Note, however, the method getDealtCards always returns the original 13 cards dealt to the hand before passing.

Because there are restrictions in the game of hearts about what card can be played at what time (e.g., first trick must start with 2 of clubs, can't lead hearts unless hearts already played, must follow suit, etc.), not every unplayed card in your player's hand will be eligible to be played at the time your player needs to play a card.

You can retrieve an array of playable cards from your Hand object using the Hand object method getPlayableCards(player_key). The result will be a subset of unplayed cards that are legal to play at this point in the game. Like the other Hand methods, you need to supply your correct player key for it to work. The getPlayableCards method will return an empty array if it is called when it is not your turn to play a card.

Required Game Features

The following features are required for full credit:

Other than providing a value for your player's name, the entire game should be operable via mouse operations.
There should be some sort of indication of when it is the user's turn.
There should be some sort of visual representation of all of the remaining unplayed cards in your user's hand.
When it is your user's turn, there should be some sort of visual indication of which cards in your user's hand are eligible to be played and which are not.
While a trick is played, there should be some sort of visual representation of which cards have been played by which player.
When a trick is over, there should be some sort of indication of which player won the trick.
There should be a way to see what the current overall hearts match scoreboard totals are. The scoreboard can be retrieved from the HeartsMatch object using the getScoreboard() method. It will return an associative array indexed by the direction constants (i.e., Hearts.NORTH, Hearts.EAST, Hearts.SOUTH, and Hearts.WEST).
Object Reference

Reference documentation for all of the classes is available at this page: Object Reference Page

Miscellaneous Notes

The HeartsMatch object does not ever end the match and will continue to set up hearts games and run them indefinitely.
Some people play hearts with the rule that you are allowed to lead hearts as soon as points have been broken (i.e., either a heart or the queen of spades has been played on some prior trick). Others interpret the the rule about leading hearts more strictly such that even if the queen of spades which is worth 13 points has already been played, you still can not lead hearts if a heart has not been played yet. Our version allows hearts does the former and is not strict about the rule, allowing hearts to be led as soon as points are broken.
