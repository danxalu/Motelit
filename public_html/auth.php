<?php
header ('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Moscow');

$mysql_host = "localhost";
$mysql_database = "u476231205_motelit";
$mysql_user = "u476231205_exalugames";
$mysql_password = "EN>a>;rwuQ";

$link = mysqli_connect($mysql_host, $mysql_user, $mysql_password) or die("Ошибочка вышла...");
mysqli_select_db($link, $mysql_database) or die ("Ой...");//Подключились к базе

if($_POST['login'] == "")
		echo 'Введите имя пользователя! ';
	else
		$login = $_POST['login'];
if($_POST['password'] == "")
		echo 'Введите пароль!';
	else
		$password = md5($_POST['password']);
	
if(isset($login) && isset($password))
		{
			$q1 = mysqli_query($link, "SELECT * FROM DataPets WHERE login='".$login."'");
			if(mysqli_num_rows($q1) == 1)
					{
						$q2 = mysqli_query($link, "SELECT * FROM DataPets WHERE login='".$login."' and password='".$password."'");
						if(mysqli_num_rows($q2) == 1)
						{
						$sscore = mysqli_query($link, "SELECT Score FROM DataPets WHERE login='".$login."' and password='".$password."'");
						foreach(mysqli_fetch_row($sscore) as $ssscore)
{
  $score = $ssscore;
}		
						$llevel = mysqli_query($link, "SELECT Level FROM DataPets WHERE login='".$login."' and password='".$password."'");
						foreach(mysqli_fetch_row($llevel) as $lllevel)
{
  $level = $lllevel;
}		
						if($score >= ceil(10*(2+($level-1))/2*$level)){
							mysqli_query($link, "UPDATE DataPets SET Level=Level+1 WHERE login='".$login."' and password='".$password."'");
							mysqli_query($link, "UPDATE DataPets SET Score=Score-".ceil(10*(2+($level-1))/2*$level)." WHERE login='".$login."' and password='".$password."'");
						}
						$time = mysqli_query($link, "SELECT Time FROM DataPets WHERE login='".$login."' and password='".$password."'");
						foreach(mysqli_fetch_row($time) as $time_help)
{
  $time1 = $time_help;
}
						$card1 = mysqli_query($link, "SELECT Card FROM DataPets WHERE login='".$login."' and password='".$password."'");
						foreach(mysqli_fetch_row($card1) as $card2)
{
  $card = $card2;
}
						$time2 = explode("$", $time1);
						$lastest_date = $time2[0];
						if (strtotime(date('j.m.Y')) > strtotime($lastest_date))
						{
						mysqli_query($link, "UPDATE DataPets SET Time='".date('j.m.Y')."$' WHERE login='".$login."'");
						}
						$c = (strtotime($card) - strtotime(date('j.m.Y')))/86400;
						$a = mysqli_query($link, "SELECT GROUP_CONCAT(id, '|', login, '|', date_reg, '|', Level, '|', Score, '|', Energy, '|', Coins, '|', Emeralds, '|', Prestige, '|', Awards, '|', Clothes, '|', Wardrobe, '|', Stickers, '|', Home, '|', Kiths, '|', Inventory, '|', Gifts, '|', Time, '|', Quests) FROM DataPets WHERE login='".$login."' and password='".$password."'");
						foreach(mysqli_fetch_row($a) as $aa)
{
  echo $aa;
}
						if ($c > 0) { // ДАТА ИСТЕЧЕНИЯ СРОКА ДЕЙСТВИЯ КАРТЫ ПОСЛЕДНЯЯ В СПИСКЕ!
						echo "|".$c;
						} else {
						echo "|0";
						}
						}
						else
						{
							echo 'Пароль введен неверно!';
						}
					}
				else
					{
						echo 'Имя введено неверно!';
					}
		}
echo mysqli_error($link);
?>