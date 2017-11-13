$(document).ready(function () {
    var north = new TextPlayer("Alice", $("#north_player")[0]);
    var east = new TextPlayer("Bob", $("#east_player")[0]);
    var south = new TextPlayer("Carol", $("#south_player")[0]);
    var west = new TextPlayer("David", $("#west_player")[0]);

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});

