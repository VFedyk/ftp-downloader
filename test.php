<?php

include_once "FTP.class.php";

$ftp = new FTP();

$ftp->setHost('ftp.mirror.yandex.ru')
    ->connect();
    
$currentDir = $ftp->pwd();

echo $currentDir;
