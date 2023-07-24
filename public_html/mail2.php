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

if($_POST['mailer'] == "")
		echo 'Неизвестно имя отправителя! ';
	else
		$mailer = $_POST['mailer'];

if(isset($mailer))
	{
	$a = mysqli_query($link, "SELECT Mail FROM DataPets WHERE login='".$mailer."'");
	foreach(mysqli_fetch_row($a) as $aa)
{
  echo $aa;
}		
	echo mysqli_error($link);
	}
?>