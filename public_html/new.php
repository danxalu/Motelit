<?php 
$to  = "<danyakyd@mail.ru>" ; 

$subject = "Восстановление пароля"; 

$message = '<p>Измените пароль, перейдя по ссылке.</p>';

$headers  = "Content-type: text/html; charset=utf-8 \r\n"; 
$headers .= "From: Мотэлит <support@motelit.ml>\r\n"; 

mail($to, $subject, $message, $headers); 
?>