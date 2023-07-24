<?php
header ('Access-Control-Allow-Origin: *');

define('TIMEZONE', 'Europe/Moscow');
date_default_timezone_set(TIMEZONE);

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$login = $_POST['login'];
$score = $_POST['score'];

if($score == "")
{
mysqli_query($link, "UPDATE DataPets SET Extra='' WHERE login='".$login."'");
} else {
if($score == 0)
{
mysqli_query($link, "UPDATE DataPets SET Extra=0 WHERE login='".$login."'");
} else {
mysqli_query($link, "UPDATE DataPets SET Extra=Extra+".$score." WHERE login='".$login."'");
}
}
echo mysqli_error($link);	
?>