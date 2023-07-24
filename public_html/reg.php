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

if($_POST['login'] == "")
		echo 'Введите имя пользователя! ';
	else
		$login = $_POST['login'];
if($_POST['password'] == "")
		echo 'Введите пароль! ';
	else
		$password = md5($_POST['password']);
if($_POST['email'] == "")
		echo 'Введите E-mail!';
	else
		$email = $_POST['email'];

$date_reg = date('j.m.Y');
	
if(isset($login) && isset($password) && isset($email))//Тут я всё-таки использоват isset :)
		{
			$find1 = substr_count($login, "|");
			$find2 = substr_count($login, "/");
			$find3 = substr_count($login, "$");
			$find4 = substr_count($login, "%");
			if ($find1 > 0 || $find2 > 0 || $find3 > 0 || $find4 > 0)
			{
			echo "Недопустимое имя!";
			}
			else
			{
			$q1 = mysqli_query($link, "SELECT * FROM DataPets WHERE login='".$login."'");
			$q2 = mysqli_query($link, "SELECT * FROM DataPets WHERE email='".$email."'");
			if(mysqli_num_rows($q1) == 0)//Если количество строк с таким именем пользователя = 0 ,то добавляем юзера и отвечаем спасибо за регистрацию
					{
						if(mysqli_num_rows($q2) == 0)
						{
						mysqli_query($link, "INSERT INTO DataPets (login, password, email, date_reg, time) VALUES ('".$login."', '".$password."', '".$email."', '".$date_reg."', '".$date_reg."$')");
						echo 'Перенаправление...';
						echo mysqli_error($link);
						}
						else
						{
							echo 'E-mail уже используется!';
						}
					}
				else
					{
						echo 'Имя уже занято!';
					}
			}
		}
?>