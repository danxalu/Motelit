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

$login = "'".$_POST['login']."'";
$mygift = $_POST['mygift'];
$receiver = "'".$_POST['receiver']."'";

if(isset($login) && isset($mygift) && isset($receiver))
	{
	mysqli_query($link, "UPDATE DataPets SET Gifts=CONCAT(IFNULL(Gifts, ''), '1$".$login."$".$mygift."/') WHERE login=".$receiver);
	echo mysqli_error($link);
	echo "Просьба отправлена!";
	}
?>