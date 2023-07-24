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
	
if(isset($login) && isset($coins) && isset($emeralds))
		{
		$c = mysqli_query($link, "SELECT Coins FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($c) as $cc)
{
  $my_coins = $cc;
}		
		$d = mysqli_query($link, "SELECT Emeralds FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($d) as $dd)
{
  $my_emeralds = $dd;
}		
	if (($coins > 0) && ($my_coins < $coins)) {
		if (($emeralds > 0) && ($my_emeralds < $emeralds)) {
	if ((bcmod('".$coins."', '10') == 1) && (bcmod('".$coins."', '100') <> 11))  {
	echo "Недостаточно средств:"."\n"."для покупки не хватает"."\n".round($coins - $my_coins)." монеты и ";
	} else {
	echo "Недостаточно средств:"."\n"."для покупки не хватает"."\n".round($coins - $my_coins)." монет и ";
	}
	if ((bcmod('".$emeralds."', '10') == 1) && (bcmod('".$emeralds."', '100') <> 11))  {
	echo round($emeralds - $my_emeralds)." изумруда!";
	} else {
	echo round($emeralds - $my_emeralds)." изумрудов!";
	}
		} else {
	if ((bcmod('".$coins."', '10') == 1) && (bcmod('".$coins."', '100') <> 11))  {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($coins - $my_coins)." монеты!";
	} else {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($coins - $my_coins)." монет!";
	}
		}
	} else {
	if (($emeralds > 0) && ($my_emeralds < $emeralds)){
	if ((bcmod('".$emeralds."', '10') == 1) && (bcmod('".$emeralds."', '100') <> 11))  {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($emeralds - $my_emeralds)." изумруда!";
	} else {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($emeralds - $my_emeralds)." изумрудов!";
	}

	}
		}
		}
echo mysqli_error($link);
?>