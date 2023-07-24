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
  $string = $str2;
  $g2 = $str2;
}		
	$find = substr_count($string, $kith);
	if($find > 0)
	{
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
	mysqli_query($link, "UPDATE DataPets SET Kiths=CONCAT(IFNULL(Kiths, ''), '".$login."/') WHERE login='".$kith."'");
	mysqli_query($link, "UPDATE DataPets SET Kiths='".$kith_ok."$".$p."' WHERE login='".$login."'");
	mysqli_query($link, "UPDATE DataPets SET Kiths=CONCAT(IFNULL(Kiths, ''), '".$kith."/') WHERE login='".$login."'");
	echo "Теперь ты и ".$kith." - знакомые!";
	} else {
		$str = mysqli_query($link, "SELECT Kiths FROM DataPets WHERE login='".$kith."'");
		foreach(mysqli_fetch_row($str) as $str2)
{
  $string = $str2;
}		
		$find = substr_count($string, $login);
		if($find > 0)
	{
		echo "Ты уже предложил питомцу ".$kith." познакомиться с тобой.";
	}
	else
	{
	$a = mysqli_query($link, "SELECT Kiths FROM DataPets WHERE login='".$kith."'");
	foreach(mysqli_fetch_row($a) as $b)
{
  $bb = $b;
}		
	$aa = explode("$", $bb);
	$a1 = $aa[0];
	$a2 = $aa[1];
	mysqli_query($link, "UPDATE DataPets SET Kiths='".$a1.$login."/$".$a2."' WHERE login='".$kith."'");
	echo mysqli_error($link);
	echo "Ты предложил питомцу ".$kith." познакомиться с тобой.";
	}
	}
	}
?>