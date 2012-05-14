<?php

require("../nbt.class.php");

$a=array();

if(!isset($_GET['player'])) {
  $a['error'] = 'to less arguments';
}
elseif(!ctype_alnum($_GET['player'])) {
  $a['error'] = 'invalid playername';
}
else {

  $playername = $_GET['player'];

  $nbt = new nbt();

  // change to point to your world's level.dat file
  $nbt->loadFile('/home/customer/minecraft/world/players/' . $playername . '.dat');

  foreach($nbt->root[0]['value'] as $dat) {
    if ($dat['name'] === "XpLevel") { 
      $a['XpLevel'] = $dat['value'];
    }  
    if ($dat['name'] === "Health") { 
      $a['Health'] = $dat['value'];
    }
    /*
    if ($dat['name'] === "thundering") { 
        $a['thundering'] = $dat['value'] == 0 ? false : true;
    }
    */
    if ($dat['name'] === "foodLevel") { 
      $a['foodLevel'] = $dat['value'];
    }   
    if ($dat['name'] === 'Dimension') {
      $a['Dimension'] = $dat['value'] ;
    }
    /*
    if ($dat['name'] === 'version') {
        $a['debug'] = $dat['value'];
    }
    */
    //print_r($dat); 
  }
}

echo json_encode($a);

?>
