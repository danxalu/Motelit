<?php
header ('Access-Control-Allow-Origin: *');//Разрешили кроссдоменные запросы

define('TIMEZONE', 'Europe/Moscow');
date_default_timezone_set(TIMEZONE);

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$login = $_POST['login'];
$house = $_POST['house'];
	
if(isset($login) && isset($house))
		{
		$b = mysqli_query($link, "SELECT Home FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($b) as $bb)
{
  $answer = $bb;
}		
$d = explode("/", $answer);
$dd = $d[0];
mysqli_query($link, "UPDATE DataPets SET Home='".$dd."/".$house."' WHERE login='".$login."'");
}
echo mysqli_error($link);
?>