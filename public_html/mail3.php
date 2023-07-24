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
	
if($_POST['msg'] == "")
		echo 'Неизвестно сообщение! ';
	else
		$msg = $_POST['msg'];

if(isset($mailer) and isset($msg))
	{
	mysqli_query($link, "UPDATE DataPets SET Mail=REPLACE(Mail, '".$msg."', '') WHERE login='".$mailer."'");
	echo mysqli_error($link);
	echo 'Сообщение удалено!';
	}
?>