<?php
    echo "You have to wait 10 seconds to see this.<br>";
    register_shutdown_function('shutdown');
    exit;
    function shutdown(){
        sleep(10);
        echo "Because exit() doesn't terminate php-fpm calls immediately.<br>";
    }

die();


include_once "FTP.class.php";

function downloadCallback ($downloaded, $allSize)
{
    echo "Downloaded {$downloaded} of {$allSize} <br />";
}

$ftp = new FTP();

$ftp->setHost('ftp.iinet.net.au')
    ->connect();
    
$currentDir = $ftp->pwd();
$ftp->pasv(true);

if (!file_exists('temp')) {
    mkdir('temp');
}

$filename = "test";
$path = realpath('temp') . DIRECTORY_SEPARATOR . $filename;

$ftp->downloadFile("/test100MB.dat", $path, 'downloadCallback');

die();
echo $ftp->systype();

die();

$fileList = $ftp->ls("/pub");

echo $currentDir;

if (false !== $fileList) {
    var_dump($fileList);
} else {
    echo "Something wrong";
}
