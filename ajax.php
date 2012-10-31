<?php

include_once "FTP.class.php";

$ftp = new FTP();

if (isset($_GET['server']) && ($_GET['server'] == 'source' || $_GET['server'] == 'destination')) {
    
    if (empty($_GET['host'])) {
        $_GET['host'] = 'localhost';
    }
    
    if (empty($_GET['login'])) {
        $_GET['login'] = 'anonymous';
    }
    
    $test = $ftp->setHost($_GET['host'])
                ->setUser($_GET['login'])
                ->setPassword($_GET['password'])
                ->testConnection();
    
    if ($test !== false) {
        echo json_encode(array('status' => 'success'));
        $ftp->close();
    } else {
        echo json_encode(array('status' => 'failed'));
    }
    
    exit;
}
