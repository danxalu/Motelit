<?php
// motelit.ml/add_quest.php?name=&type=&date=&info=
header ('Access-Control-Allow-Origin: *');//Разрешили кроссдоменные запросы

define('TIMEZONE', 'Europe/Moscow');
date_default_timezone_set(TIMEZONE);

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$name = $_GET['name'];
$type = $_GET['type'];
$date = $_GET['date'];
$info = $_GET['info'];
$idq = $_GET['id'];

if(isset($name) && isset($type) && isset($date) && isset($info))
		{
		if(isset($idq))
		{	
		$q1 = mysqli_query($link, "SELECT Quests FROM DataPets WHERE id=".$idq);
		foreach(mysqli_fetch_row($q1) as $q2)
{
  $quests = $q2;
}	
		$quests2 = explode("/", $quests);
	if ($type == 0) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0].$name."#".$date."#".$info."$"."/".$quests2[1]."/".$quests2[2]."' WHERE id=".$idq);
	}
	if ($type == 1) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0]."/".$quests2[1].$name."#".$date."#".$info."$"."/".$quests2[2]."' WHERE id=".$idq);
	}
	if ($type == 2) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0]."/".$quests2[1]."/".$quests2[2].$name."#".$date."#".$info."$"."' WHERE id=".$idq);
	}
		
		} else {
		$q1 = mysqli_query($link, "SELECT * FROM DataPets");
		while ($ans = mysqli_fetch_assoc($q1)) {
		$id = $ans['id'];
		$quests = $ans['Quests'];
		$quests2 = explode("/", $quests);
	if ($type == 0) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0].$name."#".$date."#".$info."$"."/".$quests2[1]."/".$quests2[2]."' WHERE id=".$id);
	}
	if ($type == 1) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0]."/".$quests2[1].$name."#".$date."#".$info."$"."/".$quests2[2]."' WHERE id=".$id);
	}
	if ($type == 2) {
		mysqli_query($link, "UPDATE DataPets SET Quests='".$quests2[0]."/".$quests2[1]."/".$quests2[2].$name."#".$date."#".$info."$"."' WHERE id=".$id);
	}
		}
		}
	if ($type <> 0 && $type <> 1 && $type <> 2) {
	echo "Введен неправильный номер типа квеста!";
	}
	if ($type == 0) {
	echo "Добавлен новый основной квест „".$name."“!";
	}
	if ($type == 1) {
	echo "Добавлен новый дополнительный квест „".$name."“!";
	}
	if ($type == 2) {
	echo "Добавлен новый мини-квест „".$name."“!";
		}
		}

echo mysqli_error($link);
?>