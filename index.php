<?php

include_once 'FTP.class.php';

$ftp = new FTP();
$connected = $ftp -> setUser('volodymyr')
                  -> setPassword('')
                  //->setPort(25)
                  -> testConnection();
                  
if ($connected) {
    echo 'Yahoo!<br>';
} else {
    echo '<strong>Error:</strong> ' . $ftp->getLastError() . '<br>';
}

echo 'Finite';
