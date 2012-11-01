<?php

include_once "FTP.class.php";

function downloadCallback ($downloaded, $allSize, $params)
{
    $progress = $downloaded/$allSize*100;
    $progress = round($progress, 2);
    
    $params['progress'] = $progress;
    $params['downloaded'] = $downloaded;
    $params['filesize'] = $allSize;
    
    file_put_contents('temp.tmp', serialize($params));
}

function extractFilenameFromPath ($filename)
{
    return
}

$ftp = new FTP();

if (isset($_GET['operation']) && $_GET['operation'] == 'downloadfile') {
    $ftp->setHost($_GET['srcHost'])
        ->setLogin($_GET['srcLogin']
        ->setPassword($_GET['srcPassword']
        ->connect();
    $ftp->pasv(true);

    if (!file_exists('temp')) {
        mkdir('temp');
    }
    
    $params = array();
    $params['id'] = $_GET['id'];
    
    $filename = substr(strpos($_;
    $path = realpath('temp') . DIRECTORY_SEPARATOR . $filename;
    file_put_contents('temp.tmp', '');

    $ftp->downloadFile("/test50MB.dat", $path, 'downloadCallback', $params);
    
    exit;
}

if (isset($_GET['operation']) && $_GET['operation'] == 'get_progress') {
    $rawData = file_get_contents('temp.tmp');
    $params = unserialize($rawData);
    
    echo json_encode($params);
    
    exit;
}

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
    
    $filelist = array();
    foreach ($list as $file => $type) {
        $tempArr = array();
        $tempArr['data'] = $file;
        
        $id = str_replace("/", "_", $_GET['path'] . $file);
        
        if ($id[0] == "_") {
            $id = substr($id, 1, strlen($id) - 1);
        }
        
        $tempArr['attr']['id'] = $id;
        
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
