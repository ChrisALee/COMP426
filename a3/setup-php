<?php

date_default_timezone_set('America/New_York');

$connectionObject = new mysqli("classroom.cs.unc.edu", 
                   "clee5", 
                   "Please51!", 
                   "clee5db");
                   
$handle = fopen("a3-data.txt", "r");

if ($handle) {
   while (($line = fgets($handle)) !== false) {
      // remove whitespaces
      $dataInfo = array_map('trim', explode(' ', $line));
      if (count($dataInfo)==6) {
         $connectionObject->query('INSERT INTO Players
            (pfname, plname) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[0]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[1]) . '")'
         );
         $connectionObject->query('INSERT INTO Events
            (td, pfname, plname) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[5]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[0]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[1]) . '")'
         );
         $connectionObject->query('INSERT INTO Games
            (tname, otname, date) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[2]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[3]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[4]) . '")'
            
         );
      } elseif (count($dataInfo)==8) {
         $connectionObject->query('INSERT INTO Players
            (pfname, plname) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[0]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[1]) . '")'
         );
         $connectionObject->query('INSERT INTO Events
            (td, pfname, plname, qbfname, qblname) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[5]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[0]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[1]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[0]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[1]) . '")'
         );
         $connectionObject->query('INSERT INTO Games
            (tname, otname, date) VALUES (
            "' . $connectionObject->real_escape_string($dataInfo[2]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[3]) . '",
            "' . $connectionObject->real_escape_string($dataInfo[4]) . '")'
            
         );
      } else {
      print("reading entry error!");
      break;
      }
   }
   fclose($handle);
} else {
   print("reading error!");
}

?>
<html>
 <head>
   <title>A3 Database Setup</title>
 <head>
 <body>
   <h1>A3 Database Setup Complete</h1>
 </body>
</html>
