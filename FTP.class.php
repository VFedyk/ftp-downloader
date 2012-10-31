<?php

class FTP
{
    private $connection;
    private $host;
    private $user;
    private $password;
    private $port;
    private $ssl;
    
    private $connected;
    private $lastError;
    
    private $currentDir;
    
    public function __construct($host='localhost', $user='anonymous', $password='', $port=21, $ssl=false)
    {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->port = $port;
        $this->ssl = $ssl;
    }
    
    public function connect()
    {
        if ($this->ssl) {
            $this->connection = ftp_ssl_connect($this->host, $this->port);
        } else {
            $this->connection = ftp_connect($this->host, $this->port);
        }
        
        if (!$this->connection) {
            throw new Exception('Cannot connect to this host and port pair.');
        }
        $this->connected = ftp_login($this->connection, $this->user, $this->password);
        if (!$this->connected) {
            throw new Exception('Cannot connect to FTP-server');
        }
        
        $this->currentDir = $this->pwd();
    }
    
    public function close()
    {
        ftp_close($this->connection);
        $this->connected = false;
        
        return $this;
    }
    
    public function testConnection()
    {
        try {
            $this->connect();
        } catch (Exception $e) {
            $this->lastError = $e->getMessage();
            
            return false;
        }
        
        
        return true;
    }
    
    public function setHost ($host)
    {
        $this->host = $host;
        
        return $this;
    }
    
    public function setPort ($port)
    {
        $this->port = $port;
        
        return $this;
    }
    
    public function setSSL ($ssl)
    {
        $this->ssl = $ssl;
        
        return $this;
    }
    
    public function setUser ($user)
    {
        $this->user = $user;
        
        return $this;
    }
    
    public function setPassword ($password)
    {
        $this->password = $password;
        
        return $this;
    }
    
    public function isConnected()
    {
        return $this->connected;
    }
    
    public function getLastError()
    {
        return $this->lastError;
    }
    
    public function pwd()
    {
        $this->currentDir = ftp_pwd($this->connection);
        
        return $this->currentDir;
    }
    
    public function ls($path = ".")
    {
        if ($path !== '.') {
            $this->chdir($path);
        }
        $list = ftp_nlist($this->connection, ".");
        
        if (empty($list)) {
            return $list;
        }
        
        $detailedList = array();
        foreach ($list as $item) {
            if ($this->chdir(basename($item))) {
                $this->chdir('..');
                $detailedList[$item] = 'directory';
            } else {
                $detailedList[$item] = 'file';
            }
        }
        
        
        return $detailedList;
    }
    
    public function pasv($bool)
    {
        return ftp_pasv($this->connection, $bool);
    }
    
    public function chdir($directory)
    {
        return ftp_chdir($this->connection, $directory);
    }
    
    public function systype()
    {
        return ftp_systype($this->connection);
    }
}
