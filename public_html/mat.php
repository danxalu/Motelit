<?php
header ('Access-Control-Allow-Origin: *');//Разрешили кроссдоменные запросы

define('TIMEZONE', 'Europe/Moscow');
date_default_timezone_set(TIMEZONE);

//$txt = $_POST['txt'];
//$txt = str_replace('ё', 'е', $txt);
//$txt = str_replace(array(',', ';', ':', '.', '!', '-', '—', '?', "\t", "\n", "\r", '(', ')', '+', '№', '_', '*', '%', '=', '"'), '', $txt);

$text = $_POST['txt'];
$text = str_replace('ё', 'е', $text);
$text = str_replace(array(',', ';', ':', '.', '!', '-', '—', '?', "\t", "\n", "\r", '(', ')', '+', '_', '№', '*', '%', '=', '"'), '', $text);

$textik = preg_split('//u',$text,-1,PREG_SPLIT_NO_EMPTY);

foreach ($textik as $symbol) {
	
	if(!preg_match_all("/[^а-я \d]+\r*\n*/u", $symbol))
    {
        $lowS .= $symbol;
    }
	
	if(!preg_match_all("/[^А-Я \d]+\r*\n*/u", $symbol))
    {
       $upS .= $symbol;
    }

}

//if(isset($txt)) Учти, что в условии (if) нужно всё также поменять!
if(isset($text) && ($text != ''))
	{ // Ниже в условии, помимо $text, не забывай и про $upS и $lowS!
if (preg_match_all("/[^а-я \d]+\r*\n*/iu", $text) || preg_match('/\b\d*\w*(?: т|Т)+\s*(?: в|В)+\s*(?: о|О|а|А)+\s*(?: ю|Ю)+\s*(?: (?: ж|Ж)+|(?: ш|Ш|111)+|\w{0,5}\s*(?: м|М)+\s*(?: а|А)+\s*(?: т|Т)+)\w*\b/xu', $text) || preg_match('/\b\d*\w*(?: б|Б)+\s*(?: а|А)*\s*(?: л|Л)+\s*(?: я|Я|)+\s*(?: х|Х)+\s*(?: а|А)+\s*\w{0,5}\s*(?: м|М)+\s*(?: у|У|)+\s*(?: х|Х)+\w*\b/xu', $text) || preg_match('/\b\d*\w*(?: т|Т)+\s*(?: в|В)+\s*(?: о|О|а|А)+\s*(?: ю|Ю)+\s*(?: (?: ж|Ж)+|(?: ш|Ш|111)+|\w{0,5}\s*(?: м|М)+\s*(?: а|А)+\s*(?: т|Т)+)\w*\b/xu', $upS) || preg_match('/\b\d*\w*(?: б|Б)+\s*(?: а|А)*\s*(?: л|Л)+\s*(?: я|Я|)+\s*(?: х|Х)+\s*(?: а|А)+\s*\w{0,5}\s*(?: м|М)+\s*(?: у|У|)+\s*(?: х|Х)+\w*\b/xu', $upS) || preg_match('/\b\d*\w*(?: т|Т)+\s*(?: в|В)+\s*(?: о|О|а|А)+\s*(?: ю|Ю)+\s*(?: (?: ж|Ж)+|(?: ш|Ш|111)+|\w{0,5}\s*(?: м|М)+\s*(?: а|А)+\s*(?: т|Т)+)\w*\b/xu', $lowS) || preg_match('/\b\d*\w*(?: б|Б)+\s*(?: а|А)*\s*(?: л|Л)+\s*(?: я|Я|)+\s*(?: х|Х)+\s*(?: а|А)+\s*\w{0,5}\s*(?: м|М)+\s*(?: у|У|)+\s*(?: х|Х)+\w*\b/xu', $lowS)) {
    $text = '∂';
	echo $text;
} else {
//$txt2 = explode(' ', $txt);
//foreach ($txt2 as $text) {

ObsceneCensorRus::filterText($text);
echo $text."\n";
ObsceneCensorRus::filterText($upS);
echo $upS."\n";
ObsceneCensorRus::filterText($lowS);
echo $lowS."\n";
//}
}
	}

class ObsceneCensorRus {
    private static $LT_P = 'пПnPp';
    private static $LT_I = 'иИiI1u';
    private static $LT_E = 'еЕeE';
    private static $LT_D = 'дДdD';
    private static $LT_Z = 'зЗ3zZ';
    private static $LT_M = 'мМmM';
    private static $LT_U = 'уУyYuU';
    private static $LT_O = 'оОoO0';
    private static $LT_L = 'лЛlIL1';
    private static $LT_S = 'сСcCsS';
    private static $LT_A = 'аАaA@';
    private static $LT_N = 'нНhH';
    private static $LT_G = 'гГgG';
    private static $LT_CH = 'чЧ4';
    private static $LT_K = 'кКkK';
    private static $LT_C = 'цЦcC';
    private static $LT_R = 'рРpPrR';
    private static $LT_H = 'хХxXhH';
    private static $LT_YI = 'йЙy';
    private static $LT_YA = 'яЯ';
    private static $LT_YO = 'ёЁ';
    private static $LT_YU = 'юЮ';
    private static $LT_B = 'бБ6bB';
    private static $LT_T = 'тТtT';
    private static $LT_HS = 'ъЪb';
    private static $LT_SS = 'ьЬb';
    private static $LT_Y = 'ыЫ';
	private static $LT_V = 'вВbBvVwW';
	private static $LT_F = 'фФfF';
	
	private static $LT_ZH = 'жЖ';

    public static $exceptions = array(
        'команд', 'каманд', 
		'мандар', 'мондар',
        'рубл',
        'премь',
        'оскорб',
        'краснояр',
        'бояр',
        'ноябр',
        'карьер',
        'мандамандат',
        'плох',
        'интер',
        'веер',
        'фаер',
        'феер',
        'hyundai',
        'тату',
        'браконь',
        'roup',
        'сараф',
        'держ',
        'слаб',
        'ридер',
        'истреб', 'изтреб', 'истриб', 'изтриб',
        'потреб', 'потриб', 'патреб', 'патриб',
        'коридор',
        'sound',
        'дерг',
        'подоб',
        'коррид',
        'дубл',
        'курьер',
        'экст',
        'try',
        'enter',
        'oun',
        'aube',
        'ibarg',
        '16',
        'kres',
        'глуб',
        'ebay',
        'eeb',
        'shuy',
        'ансам',
        'cayenne',
		'барсук',
		'борсук',
        'ain',
        'oin',
        'тряс',
        'ubu',
        'uen',
        'uip',
        'oup',
        'кораб',
		'ебой', 'е-бой', 'е бой',
        'боеподг', 'баеподг', 'боепадг', 'баепадг', 'боепол', 'баепол', 'боепитан', 'баепитан', 'боепетан', 'баепетан', 'боепр', 'баепр',
        'деепр',
        'хульс',
        'een',
        'ee6',
        'ein',
        'сугуб',
        'карб',
        'гроб',
        'лить',
        'рсук',
        'влюб',
        'хулио',
        'ляп',
        'граб',
        'ибог',
        'вело',
		'вило',
        'ебэ',
        'перв',
        'eep',
        'ying',
        'laun',
        'чаепитие',
		'илюх',
		'плюх',
		'валюх',
		'саговни',
		'пуговни',
		'шухер',
		'махер',
		'цехер',
		'фигур', 'фегур',
		'хлеб',
		'епони',
		'дуров',
		'лох-не', 'лохне',
		'беремен', 'биремен', 'беремин', 'биремин', 'камене', 'комене', 'камине', 'комине',
		'хиро', 'хирд', 'хирт', 'хирш',
		'фикс', 'эфик', 'кафик', 'фикат', 'фикц', 'фикац',
		'хулига', 'хулега',
    );

    public static function getFiltered($text, $charset = 'UTF-8') {
        self::filterText($text, $charset);
        return $text;
    }

    public static function isAllowed($text, $charset = 'UTF-8') {
        $original = $text;
        self::filterText($text, $charset);
        return $original === $text;
    }

    public static function filterText(&$text, $charset = 'UTF-8')
    {
        $utf8 = 'UTF-8';

        if ($charset !== $utf8) {
            $text = iconv($charset, $utf8, $text);
        }
		
        preg_match_all('/
\b\d*(
	\w*[' . self::$LT_P . ']+\s*[' . self::$LT_I . self::$LT_E . ']*\s*[' . self::$LT_Z . ']+\s*[' . self::$LT_D . ']+\w* # пизда
|
	\w*(?:[' . self::$LT_E . ']+|[' . self::$LT_YI . ']+[' . self::$LT_O . '])+\s*[' . self::$LT_M . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*(?:[' . self::$LT_E . ']+|[' . self::$LT_YI . ']+[' . self::$LT_O . '])+\w* # ёмаё
|
	\w*[' . self::$LT_Z . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_D . self::$LT_T . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_I . self::$LT_E .']+\s*[' . self::$LT_C . ']+\w* # з-адниц-а
|
	\w*[' . self::$LT_V . ']+\s*[' . self::$LT_Y . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_E . self::$LT_I . ']+\s*[' . self::$LT_R . ']+\s*(?!еб|иб)\w* # высер
|
	(?:
	\w*[' . self::$LT_S . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_T . ']+\s*[' . self::$LT_SS . ']+\w* # сра-ть
	|
	\w*[' . self::$LT_S . ']+\s*[' . self::$LT_R . ']+\s*([' . self::$LT_U . ']+|[' . self::$LT_E . self::$LT_I . ']+\s*(?: ш|Ш|w|W|sh|Sh|sH|SH|iii|III|\\\|111)+\s*[' . self::$LT_SS . ']+|[' . self::$LT_E . ']+\s*[' . self::$LT_M . ']+|[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_T . ']+\s*[' . self::$LT_E . ']+|[' . self::$LT_U . self::$LT_YA . self::$LT_E . ']+\s*[' . self::$LT_T . ']+|[' . self::$LT_A . ']+\s*[' . self::$LT_L . ']+|[' . self::$LT_I . ']+)+ # сра-ть
	)
|
	\w*[' . self::$LT_G . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_N . ']+\w* # гондон
|
	\w*[' . self::$LT_G . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_M . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_K . ']+\w* # гомик
|
	\w*[' . self::$LT_S . ']+\s*[' . self::$LT_V . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_L . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_CH . ']+\w* # сволочь
|
	\w*(?:[' . self::$LT_I . self::$LT_U . '\s]+|' . self::$LT_N . self::$LT_I . ')?(?<!стра|стра|штри|штре)[' . self::$LT_H . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_YI . self::$LT_E . self::$LT_YA . self::$LT_YO . self::$LT_I . self::$LT_L . self::$LT_YU . ']+\s*(?!иг|ег)\w* # хуй; не пускает "подстрахуй", "хулиган"
|
	[' . self::$LT_B . ']+[' . self::$LT_L . ']+ # бл
|
	\w*[' . self::$LT_B . ']+\s*[' . self::$LT_L . ']+\s*(?:
		[' . self::$LT_YA . ']+\s*[' . self::$LT_D . self::$LT_T . ']?
		|
		[' . self::$LT_I . ']+\s*[' . self::$LT_D . self::$LT_T . ']+
		|
		[' . self::$LT_I . ']+\s*[' . self::$LT_A . ']+
	)(?!х)\w* # бля, блядь
|
	(?:
		\w*[' . self::$LT_YI . self::$LT_U . self::$LT_E . self::$LT_A . self::$LT_O . self::$LT_HS . self::$LT_SS . self::$LT_Y . self::$LT_YA . '][' . self::$LT_E . self::$LT_YO . self::$LT_YA . self::$LT_I . '][' . self::$LT_B . self::$LT_P . '](?!ы\b|ол)\w* # не пускает "еёбы", "наиболее", "наибольшее"...
		|
		\w*(?<!л|р|т)[' . self::$LT_E . self::$LT_YO . ']+\s*[' . self::$LT_B . ']+\w*
		|
		[' . self::$LT_I . ']+\s*[' . self::$LT_P . ']+\s*[' . self::$LT_A . ']+\w*
		|
		[' . self::$LT_I . ']+\s*[' . self::$LT_B . ']+\s*[' . self::$LT_A . ']+\w+
		|
		[' . self::$LT_YI . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_B . self::$LT_P . ']+\w*
	) # ебать
|
	\w*(?<!тря|тре|три)[' . self::$LT_S . ']+\s*[' . self::$LT_C . ']?[' . self::$LT_U . ']+\s*(?:
		[' . self::$LT_CH . ']*[' . self::$LT_K . ']+
		|
		[' . self::$LT_CH . ']+\s*[' . self::$LT_K . ']*
	)(?:[' . self::$LT_A . self::$LT_O . self::$LT_I . ']|[' . self::$LT_I . self::$LT_E . '][' . self::$LT_N . '])+\w* # сука
|
	\w*[' . self::$LT_F . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_K . ']+\s*(?!т)\w* # фак
|
	\w*[' . self::$LT_ZH . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_P . ']+\w* # жоп-а
|
	[' . self::$LT_L . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_H . ']+\w* # лох
|
	[' . self::$LT_L . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*(?: ш|Ш|w|W|sh|Sh|sH|SH|iii|III|111|\\\)+(?!а)\w+ # лош-ок
|
	\w*(?<!о|у|с|ш)[' . self::$LT_P . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_N . ']+\w* # порн-о
|
	\w*(?<!о)[' . self::$LT_K . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_E . self::$LT_I . ']+\s*(?!й|ц|а|з|c)\w* # куни
|
	\w*(?<!о)[' . self::$LT_K . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_E . ']+\w* # куне
|
	\w*(?<!ц|ст|л|р|щ|совд|савд|лч|шн|в|к|сл|ч|н|п|ш|г|ли|с|(?<!по|па)д|(?<!по|па)т)[' . self::$LT_E . self::$LT_YO . ']+[' . self::$LT_P . ']+\w* # еп
|
	\w*(?<!ло|ла|ок|ак|ле|ли)[' . self::$LT_S . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_I . ']+\s*(?!с)\w* # соси
|
	[' . self::$LT_S . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_I . ']+\w* # сосни
|
	\w*[' . self::$LT_P . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_S . ']+\w* # писос
|
	[' . self::$LT_N . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_H . ']+\s*[' . self::$LT_U . ']*(?!лиг|лег|улиг|улег) # нах
|
	[' . self::$LT_N . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_H . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_YI . ']+ # нахой
|
	[' . self::$LT_T . ']+\s*[' . self::$LT_V . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_R . ']+\s*(?: [' . self::$LT_SS . ']+\s*|([' . self::$LT_I . ']+\s*[' . self::$LT_N . ']+))+\w* # тварь
|
	\w*[' . self::$LT_P . ']+\s*[' . self::$LT_I . ']+\s*[' . self::$LT_S . self::$LT_Z . ']+\s*[' . self::$LT_SS . ']+\s*[' . self::$LT_K . ']+\w* # письк-а
|
	\w*[' . self::$LT_V . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_G . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_N . ']+\w* # вагин-а
|
	\w*[' . self::$LT_E . self::$LT_YO . ']+\s*[' . self::$LT_P . self::$LT_B . ']+\s*(?:[' . self::$LT_T . ']+\w*|([' . self::$LT_S . ']+\s*[' . self::$LT_T . ']+)\w*)\w* #ёпсть
|
	\w*[' . self::$LT_E . self::$LT_YO . ']+\s*[' . self::$LT_P . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_T . ']+\w* # епрст
|
	\w*[' . self::$LT_E . self::$LT_YO . ']+\s*[' . self::$LT_K . ']+\s*[' . self::$LT_L . ']+\s*[' . self::$LT_M . ']+\s*[' . self::$LT_N . ']+\w* # еклмн
|
	\w*[' . self::$LT_I . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_I . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_T . ']+\w* # идиот
|
	\w*[' . self::$LT_G . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_V . ']+\s*[' . self::$LT_N . ']+\w* # говн-о
|
	\w*(?: ш|Ш|w|W|sh|Sh|sH|SH|iii|III|\\\|111)+\s*[' . self::$LT_A .  self::$LT_O . ']+\s*[' . self::$LT_L . ']+\s*[' . self::$LT_A . ']+\s*[' . self::$LT_V . ']+\w* # ш-алав-а
|
	\w*(?: ш|Ш|w|W|sh|Sh|sH|SH|iii|III|\\\|111)+\s*[' . self::$LT_L . ']+\s*[' . self::$LT_YU . ']+\s*[' . self::$LT_H . ']+\w* # ш-люх-а
|
	\w*(?<!меж|миж|бан|бон|це|ци|гон)[' . self::$LT_D . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_A . self::$LT_O . self::$LT_E . ']+\w* # дура
|
	\w*[' . self::$LT_H . ']+\s*[' . self::$LT_E . self::$LT_I . ']+\s*[' . self::$LT_R . ']+(?!цберг|цбирг|сон|амант|омант|ург|уг)\w* # хер
|
	\w*(?<!ш|апа|апо|бель|биль|ка|ко|воль|валь|пель|пиль|ос|ас)[' . self::$LT_F . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_G . self::$LT_K . ']+(?!ей|ий|да|езак|изак|ани|опт|апт|ур|м)\w* # фиг
|
	\w+(?<!ви|ве)[' . self::$LT_H . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_E . self::$LT_I .']+\s*[' . self::$LT_N . ']+\w* # хрен
|
	\w*[' . self::$LT_D . ']+\s*[' . self::$LT_R . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_CH . ']+\w* # дроч-ка
|
	\w*[' . self::$LT_M . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\w* # муда-к
|
	\w*(?:
		[' . self::$LT_P . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_A . self::$LT_O . self::$LT_E . ']?[' . self::$LT_R . ']+\s*(?!о)\w* # не пускает "Педро"
		|
		[' . self::$LT_P . ']+\s*[' . self::$LT_E . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_E . self::$LT_I . ']?[' . self::$LT_G . self::$LT_K . ']+
	) # пидарас
|
	\w*[' . self::$LT_Z . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_L . ']+\s*[' . self::$LT_U . ']+\s*[' . self::$LT_P . ']+\w* # залупа
|
	\w*[' . self::$LT_M . ']+\s*[' . self::$LT_I . self::$LT_E . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_E . ']+\s*[' . self::$LT_T . ']+\w* # минет
|
	\w*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_T . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_O . ']+\s*[' . self::$LT_S . ']+ # отсос
|
	\w*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_T . ']+\s*[' . self::$LT_S . ']+\s*[' . self::$LT_O . self::$LT_A . ']+\s*[' . self::$LT_S . ']+\w+ # отсос-ать
|
	\w*[' . self::$LT_M . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\s*[' . self::$LT_N . ']+\s*[' . self::$LT_D . ']+\s*[' . self::$LT_A . self::$LT_O . ']+\w* # манда
)\b
/xu', $text, $m);

        $c = count($m[1]);

        if ($c > 0) {
            for ($i = 0; $i < $c; $i++) {
				$z = 0;
                $word = str_replace(array(' ', ',', ';', '.', '!', '-', '—', '?', '\t', '\n', ':', '(', ')', '+', '*', '/', '"'), '', $m[1][$i]);
                $word = mb_strtolower($word, $utf8);
                foreach (self::$exceptions as $x) {
                    if (mb_strpos($word, $x) !== false) {
						$z = 1;
					}
                }
				if ($z == 0){
				$asterisks = str_repeat('∂', mb_strlen($word, $utf8));
				$text = preg_replace('/'.$m[1][$i].'/', $asterisks, $text);
				}
				unset($m[1][$i]);
				unset($word);
            }
				

            if ($charset !== $utf8) {
                $text = iconv($utf8, $charset, $text);
            }

            return true;
        } else {
            if ($charset !== $utf8) {
                $text = iconv($utf8, $charset, $text);
            }

            return false;
        }
    }
	
    }
?>