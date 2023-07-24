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
$coins = $_POST['coins'];
$emeralds = $_POST['emeralds'];
$card_need = $_POST['card_need'];
$level = $_POST['level'];
$card = $_POST['card'];
	
if(isset($login) && isset($house) && isset($coins) && isset($emeralds) && isset($card_need) && isset($level) && isset($card))
		{
	if (($card_need == 1) && ($card == 0)) {
	echo "Для покупки необходимо иметь"."\n"."активированную Дективард!";
	} else {
	$b = mysqli_query($link, "SELECT Level FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($b) as $bb)
{
  $my_level = $bb;
}		
	if ($my_level < $level) {
	echo "Для покупки необходимо иметь ".$level." уровень!"."\n"."Чтобы его поднять, максимально развивай своего питомца.";
	} else {
	$c = mysqli_query($link, "SELECT Coins FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($c) as $cc)
{
  $my_coins = $cc;
}		
	if (($coins > 0) && ($my_coins < $coins)) {
	if ((bcmod('".$coins."', '10') == 1) && (bcmod('".$coins."', '100') <> 11))  {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($coins - $my_coins)." монеты!";
	} else {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($coins - $my_coins)." монет!";
	}
	} else {
	$d = mysqli_query($link, "SELECT Emeralds FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($d) as $dd)
{
  $my_emeralds = $dd;
}		
	if (($emeralds > 0) && ($my_emeralds < $emeralds)) {
	if ((bcmod('".$emeralds."', '10') == 1) && (bcmod('".$emeralds."', '100') <> 11))  {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($emeralds - $my_emeralds)." изумруда!";
	} else {
	echo "Недостаточно средств:"."\n"."для покупки не хватает ".round($emeralds - $my_emeralds)." изумрудов!";
	}
	} else {
		$a = mysqli_query($link, "SELECT Inventory FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($a) as $aa)
{
  $answer = $aa;
}		
$echo3 = explode("%", $answer);
$echo4 = $echo3[0];
$echo5 = $echo3[1];
$num = substr_count($echo4, "$");
$answer = $echo4.$num."/".$house."/$%".$echo5;
mysqli_query($link, "UPDATE DataPets SET Inventory='".$answer."' WHERE login='".$login."'");
mysqli_query($link, "UPDATE DataPets SET Coins=Coins-".$coins." WHERE login='".$login."'");
mysqli_query($link, "UPDATE DataPets SET Emeralds=Emeralds-".$emeralds." WHERE login='".$login."'");
if($card > 0) {
mysqli_query($link, "UPDATE DataPets SET Score=Score+".ceil($coins/25+$emeralds/4)." WHERE login='".$login."'");
mysqli_query($link, "UPDATE DataPets SET Prestige=Prestige+".ceil($coins/100+$emeralds/5*2)." WHERE login='".$login."'");
} else {
mysqli_query($link, "UPDATE DataPets SET Score=Score+".ceil($coins/30+$emeralds/5)." WHERE login='".$login."'");
mysqli_query($link, "UPDATE DataPets SET Prestige=Prestige+".ceil($coins/125+$emeralds/25*8)." WHERE login='".$login."'");
}
echo "Покупка прошла успешно!";
	}
	}
	}
	}
}
echo mysqli_error($link);
?>