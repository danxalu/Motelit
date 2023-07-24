<?php
header ('Access-Control-Allow-Origin: *');

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

$login = $_POST['login'];
	
if(isset($login))
		{
		$a = mysqli_query($link, "SELECT Inventory FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($a) as $aa)
{
  $answer = $aa;
}		
		$b = mysqli_query($link, "SELECT Home FROM DataPets WHERE login='".$login."'");
		foreach(mysqli_fetch_row($b) as $bb)
{
  $answer2 = $bb;
}		
$echo3 = explode("%", $answer);
$echo4 = $echo3[0];
$echo = explode("$", $echo4);
$echo2 = explode("/", $answer2);
$num = $echo2[1];
echo $echo2[0]."/".$echo[$num];
echo mysqli_error($link);
		}
?>