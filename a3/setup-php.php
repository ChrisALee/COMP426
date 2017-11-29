<?php

date_default_timezone_set('America/New_York');

$connectionObject = new mysqli("classroom.cs.unc.edu", "clee5", "Please61!", "clee5db"); 
                   
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
         $pid = $connectionObject->query('SELECT p.pid FROM Players p
         WHERE p.pfname =  "' . $connectionObject->real_escape_string($dataInfo[0]) . '"
         AND p.plname = "' . $connectionObject->real_escape_string($dataInfo[1]) . '"
         '
         );
         print($pid);
          $connectionObject->query('INSERT INTO Events
             (td, pid) VALUES (
             "' . $connectionObject->real_escape_string($dataInfo[5]) . '",
             "' . $connectionObject->real_escape_string((string)$pid) . '")'
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
          $pid = $connectionObject->query('SELECT p.pid FROM Players p
          WHERE p.pfname =  "' . $connectionObject->real_escape_string($dataInfo[0]) . '"
          AND p.plname = "' . $connectionObject->real_escape_string($dataInfo[1]) . '"
          '
          );
           $connectionObject->query('INSERT INTO Events
              (td, pid, qbfname, qblname) VALUES (
              "' . $connectionObject->real_escape_string($dataInfo[5]) . '",
              "' . $connectionObject->real_escape_string((string)$pid) . '",
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
