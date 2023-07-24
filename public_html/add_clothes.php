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
$wr_num = $_POST['wr_num'];
$clothes = $_POST['clothes'];
$coins = $_POST['coins'];
$emeralds = $_POST['emeralds'];
$card_need = $_POST['card_need'];
$level = $_POST['level'];
$card = $_POST['card'];
	
if(isset($login) && isset($wr_num) && isset($clothes) && isset($coins) && isset($emeralds) && isset($card_need) && isset($level) && isset($card))
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
	$a = mysqli_query($link, "SELECT Wardrobe FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($a) as $aa)
{
  $answer = $aa;
}		
$echo2 = explode("/", $answer);
$echo = $echo2[$wr_num];
$pos = strpos($echo, $clothes);
if($pos === false){
$echo00 = "";
$echo01 = "";
if ($wr_num == 0) {
	for ($i = 1; $i <= 8; $i++) {
    $echo01 = $echo01."/".$echo2[$i];
	}
}
if (($wr_num > 0) && ($wr_num < 8)) {
	for ($i = 0; $i < $wr_num; $i++) {
    $echo00 = $echo00.$echo2[$i]."/";
	}
	for ($i = $wr_num+1; $i <= 8; $i++) {
    $echo01 = $echo01."/".$echo2[$i];
	}
}
if ($wr_num == 8) {
	for ($i = 0; $i < 8; $i++) {
    $echo00 = $echo00.$echo2[$i]."/";
	}
}
mysqli_query($link, "UPDATE DataPets SET Wardrobe='".$echo00.$echo.$clothes."#".$echo01."' WHERE login='".$login."'");
}
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