<?php
header ('Access-Control-Allow-Origin: *');//Разрешили кроссдоменные запросы
header("Content-type: UTF-8");

define('TIMEZONE', 'Europe/Moscow');
date_default_timezone_set(TIMEZONE);

$txt = $_GET['txt'];

if(isset($txt)){
	
$file = file_get_contents('./dict.txt', FILE_USE_INCLUDE_PATH);

$txt = str_replace('ё', 'е', $txt);
$txt = str_replace(array(',', ';', ':', '.', '!', '-', '—', '?', "\t", "\n", "\r", '(', ')', '+', '№', '^', '_', '*', '%', '=', '"', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), '', $txt);

$txt2 = explode(' ', $txt);

foreach ($txt2 as $text) {
	
$pos = strpos($file, $text);

if ($pos === false) {
    echo '∂';
} else {
	echo '+';
}
}
}
?>