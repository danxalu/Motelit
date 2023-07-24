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
$name = $_POST['name'];
$date = $_POST['date'];
$delete = $_POST['delete'];
$next_quest = $_POST['next_quest'];

if(isset($login) && isset($name) && isset($delete))
		{
		$q1 = mysqli_query($link, "SELECT Quests FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($q1) as $q2)
{
  $q3 = $q2;
}	
		if ($delete == 1) {
			mysqli_query($link, "UPDATE DataPets SET Quests='".$name."' WHERE login='".$login."'");
			if(isset($next_quest)) {
				mysqli_query($link, "UPDATE DataPets SET Quests='".$name.$next_quest."$"."' WHERE login='".$login."'");
				}
			}		
		if ($delete == 0) {
			$days = (strtotime($date) - strtotime(date('j.m.Y')))/86400;
			if ($days < 0) {
				mysqli_query($link, "UPDATE DataPets SET Quests='".$name."' WHERE login='".$login."'");
				if(isset($next_quest)) {
					mysqli_query($link, "UPDATE DataPets SET Quests='".$name.$next_quest."$"."' WHERE login='".$login."'");
				}
			}
		}
		if ($delete == -1) {
			$days = (strtotime($date) - strtotime(date('j.m.Y')))/86400;
			if ($days >= 0) {
				echo $name."#".$days;
			}
		}
		}
		
echo mysqli_error($link);
?>