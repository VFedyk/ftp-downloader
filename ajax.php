<?php

include_once "FTP.class.php";

$ftp = new FTP();

if (isset($_GET['operation']) && $_GET['operation'] == 'get_filelist') {
    
    if (empty($_GET['host'])) {
        $_GET['host'] = 'localhost';
    }
    
    if (empty($_GET['login'])) {
        $_GET['login'] = 'anonymous';
    }
    
    if (empty($_GET['path'])){
        $_GET['path'] = "/";
    }
    
    if (empty($_GET['title'])){
        $_GET['title'] = "/";
    }
    
    $ftp->setHost($_GET['host'])
        ->setUser($_GET['login'])
        ->setPassword($_GET['password'])
        ->connect();
    $list = $ftp->ls($_GET['path']); 
    
    //var_dump($list);die();
    
    $filelist = array();
    foreach ($list as $file => $type) {
        $tempArr = array();
        $tempArr['data'] = $file;
        $tempArr['attr']['id'] = str_replace("/", ".", $_GET['path'] . $file);
        
        if ($type == 'directory') {
            $tempArr['icon'] = 'folder';
            $tempArr['attr']['path'] = $_GET['path'] . $file . "/";
            $tempArr['attr']['rel'] = 'folder';
            $tempArr['state'] = 'closed';
        } else {
            $tempArr['attr']['rel'] = 'default';
            $tempArr['attr']['path'] = $_GET['path'] . $file;
        }
       
        $filelist[] = $tempArr;
    }
    
    
    
    if ($ftp->isConnected() !== false) {
        echo json_encode($filelist);
        $ftp->close();
    } else {
        echo json_encode(array('status' => 'failed'));
    }
    
    exit;
}


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
