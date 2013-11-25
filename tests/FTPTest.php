<?php

$DS = DIRECTORY_SEPARATOR;
require_once __DIR__ . $DS . ".." . $DS . "FTP.class.php";


class FTPTest extends PHPUnit_Framework_TestCase
{
	private $host = 'ftp.kernel.org';
	

	/**
	 *1
	 */
	public function testConnect()
	{
		$ftp = new FTP($this->host);
		$ftp->connect();
		$this->assertTrue($ftp->isConnected());
	}
}
