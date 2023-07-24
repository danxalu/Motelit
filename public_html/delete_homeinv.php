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
$furniture = $_POST['furniture'];
	
if(isset($login) && isset($furniture))
		{
		$a = mysqli_query($link, "SELECT Inventory FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($a) as $aa)
{
  $answer = $aa;
}		
}		
$echo3 = explode("%", $answer);
$echo4 = $echo3[1];
$echo = explode("/", $echo4);
foreach ($echo as $b) {
	$b2 = explode("#", $b);
	$b3 = $b2[0];
	$b4 = $b2[1];
	$b5 = $b4 - 1;
	if ($b3 == $furniture && $b4 > 0) {
		$answer = str_replace($b, $b3."#".$b5, $answer);
	}
mysqli_query($link, "UPDATE DataPets SET Inventory='".$answer."' WHERE login='".$login."'");
}
echo mysqli_error($link);
?>