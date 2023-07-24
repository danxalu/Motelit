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
$coins = $_POST['coins'];
$emeralds = $_POST['emeralds'];
$score = $_POST['score'];
$prestige = $_POST['prestige'];
	
if(isset($login))
		{
		if(isset($coins)){
		mysqli_query($link, "UPDATE DataPets SET Coins=Coins+".$coins." WHERE login='".$login."'");
		}
		if(isset($emeralds)){
		mysqli_query($link, "UPDATE DataPets SET Emeralds=Emeralds+".$emeralds." WHERE login='".$login."'");
		}
		if(isset($score)){
		mysqli_query($link, "UPDATE DataPets SET Score=Score+".$score." WHERE login='".$login."'");
		}
		if(isset($prestige)){
		mysqli_query($link, "UPDATE DataPets SET Prestige=Prestige+".$prestige." WHERE login='".$login."'");
		}
		}
echo mysqli_error($link);
?>