<?php
header ('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Moscow');

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$login = $_POST['login'];
	
if(isset($login))
		{
		 $score = mysqli_query($link, "SELECT Extra FROM DataPets WHERE login='".$login."'");
		 foreach(mysqli_fetch_row($score) as $sscore)
{
  echo $sscore;
}		
		}
echo mysqli_error($link);
?>