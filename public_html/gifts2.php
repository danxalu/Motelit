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
$gift = $_POST['gift'];
$num = $_POST['num'];

if(isset($login) && isset($gift))
	{
	$a = mysqli_query($link, "SELECT Time FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($a) as $aa)
{
  $time = $aa;
}		
$gift_done1 = explode("$", $time);
$gift_done = $gift_done1[1];
$gift_info = explode("$", $gift);
$receiver = $gift_info[1];
$mygift = $gift_info[2];
if(stristr($gift_done, $receiver."/") === false) 
{
	$g1 = mysqli_query($link, "SELECT Gifts FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($g1) as &$g22)
{
  $g2 = $g22;
}
	$g3 = explode("/", $g2);
	$gift_ok = "";
	$count = 1;
	$countall = substr_count($g2, "/");
foreach ($g3 as &$gg) {
if($count <= $countall){
if ($gg == $gift && $count == $num) {
} else {
$gift_ok = $gift_ok.$gg."/";
}
}
$count = $count + 1;
}
unset($gg);
	mysqli_query($link, "UPDATE DataPets SET Gifts=CONCAT(IFNULL(Gifts, ''), '0$".$login."$".$mygift."/') WHERE login='".$receiver."'");
	mysqli_query($link, "UPDATE DataPets SET Time=CONCAT(Time, '".$receiver."/') WHERE login='".$login."'");
	mysqli_query($link, "UPDATE DataPets SET Gifts='".$gift_ok."' WHERE login='".$login."'");
	echo "Ты подарил подарок питомцу ".$receiver."!";
} else {
	echo "Ты уже подарил сегодня подарок питомцу ".$receiver."! Приходи завтра!";
}
echo mysqli_error($link);
	}
?>