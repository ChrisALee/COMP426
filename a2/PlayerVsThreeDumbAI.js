$(document).ready(function () {
    var south = new Player("Chris", $("#north_player")[0]);
    var east = new DumbAI("Bob")
    var north = new DumbAI("Carol");
    var west = new DumbAI("David");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});

