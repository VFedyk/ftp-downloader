<?php
include_once "FTP.class.php";

$ftp = new FTP();

$ftp->setHost('ftp.kernel.org')
    ->connect();
    
$currentDir = $ftp->pwd();
$ftp->pasv(true);
$fileList = $ftp->ls("/pub");

echo $currentDir;

if (false !== $fileList) {
    var_dump($fileList);
} else {
    echo "Something wrong";
}
