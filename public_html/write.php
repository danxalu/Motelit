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

$login = "'".$_POST['login']."'";
$Level = $_POST['Level'];
$Score = $_POST['Score'];
$Energy = $_POST['Energy'];
$Coins = $_POST['Coins'];
$Emeralds = $_POST['Emeralds'];
$Prestige = $_POST['Prestige'];
$Awards = "'".$_POST['Awards']."'";
$Clothes = "'".$_POST['Clothes']."'";
$Wardrobe = "'".$_POST['Wardrobe']."'";
$Stickers = "'".$_POST['Stickers']."'";
$Home = "'".$_POST['Home']."'";
$Inventory = "'".$_POST['Inventory']."'";

mysqli_query($link, "UPDATE DataPets SET Clothes=".$Clothes.", Home=".$Home.", Inventory=".$Inventory." WHERE login=".$login);
echo mysqli_error($link);	
?>