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
	
if($_POST['receiver'] == "")
		echo 'Введите имя получателя! ';
	else
	{
		if($_POST['receiver'] == $mailer)
			echo 'Отправлять самому себе письма нельзя! ';
		else
		$receiver = $_POST['receiver'];
	}
	
if($_POST['msg'] == "")
		echo 'Введите сообщение!';
	else
		$msg = $_POST['msg'];

if(isset($mailer) && isset($receiver) && isset($msg))
	{
	$q1 = mysqli_query($link, "SELECT * FROM DataPets WHERE login='".$receiver."'");
	if(mysqli_num_rows($q1) == 1)
		{
	$text = $mailer."|".$msg."|";
	mysqli_query($link, "UPDATE DataPets SET Mail=CONCAT(IFNULL(Mail, ''), '".$text."') WHERE login='".$receiver."'");
	echo mysqli_error($link);
	echo 'Сообщение отправлено!';
		}
		else
			echo 'Такого питомца нет!';
	}
	
?>