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
$email = $_POST['email'];
	
if(isset($login))
		{
			
	$ch = curl_init('https://motelit.ml/mat.php');
	curl_setopt($ch, CURLOPT_POSTFIELDS, "txt=".$login);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$mat = curl_exec($ch);
	curl_close($ch);
	
	$matpos = strpos($mat, '∂');
	
	if ($matpos !== false || !preg_match_all('/^([А-Яа-я\d]{1}[-А-Яа-я_ \d\.]{2,}[А-Яа-я\d]{1})$/u', $login)) {
    echo 'Недопустимое имя!';
	} else {
			$q1 = mysqli_query($link, "SELECT * FROM DataPets WHERE login='".$login."'");
			if(mysqli_num_rows($q1) != 0){
				echo 'Имя уже занято!';
				} else {
				echo 'Имя подходит!';
				} 
			}
			}		
		
if(isset($email))
		{
	if (!preg_match_all('/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@((([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})|(([-А-Яа-я]{1,}\.){1,2}[-А-Яа-я]{2,})))$/u', $email)){
		echo 'Недопустимый E-mail!';
		} else {
			$q2 = mysqli_query($link, "SELECT * FROM DataPets WHERE email='".$email."'");
			if(mysqli_num_rows($q2) != 0){
				echo 'E-mail уже используется!';
				} else {
				echo 'E-mail подходит!';
				} 
		}
		}
?>