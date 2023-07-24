<?php
header ('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Moscow');

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$id = $_POST['id'];
	
if(isset($id))
		{
						$time_card1 = mysqli_query($link, "SELECT Card FROM DataPets WHERE login=".$login);
						foreach(mysqli_fetch_row($time_card1) as $time_card2)
{
  $time_card = $time_card2;
}
						if ((strtotime($time_card) - strtotime(date('j.m.Y'))) > 0) {
						$card = 1;
						} else {
						$card = 0;
						}
						$a = mysqli_query($link, "SELECT GROUP_CONCAT(login, '|', date_reg, '|', Level, '|', Prestige, '|', Awards, '|', Clothes) FROM DataPets WHERE id=".$id);
						foreach(mysqli_fetch_row($a) as $aa)
{
  echo $aa;
}
						echo "|".$card;
		}
echo mysqli_error($link);
?>