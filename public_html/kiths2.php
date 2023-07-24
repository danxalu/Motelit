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
$kith = $_POST['kith'];

if(isset($login) && isset($kith))
	{
	$str = mysqli_query($link, "SELECT Kiths FROM DataPets WHERE login='".$login."'");
	foreach(mysqli_fetch_row($str) as &$str2)
{
  $g2 = $str2;
}
	$g0 = explode("$", $g2);
	$g1 = $g0[0];
	$p = $g0[1];
	$g3 = explode("/", $g1);
	$kith_ok = "";
	$count = 1;
	$countall = substr_count($g1, "/");
foreach ($g3 as &$gg) {
if($count <= $countall){
if ($gg == $kith) {
} else {
$kith_ok = $kith_ok.$gg."/";
}
}
$count = $count + 1;
}
unset($gg);
	mysqli_query($link, "UPDATE DataPets SET Kiths='".$kith_ok."$".$p."' WHERE login='".$login."'");
	echo mysqli_error($link);
	}
?>