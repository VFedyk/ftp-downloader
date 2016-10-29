<!DOCTYPE html>
<html lang="en">
    <head>
        <title>FTP-downloader</title>
        <link rel="stylesheet" href="css/bootstrap.min.css" />
        <link rel="stylesheet" href="css/style.css" />
    </head>
  <body>
    <div class="container">
        <div class="navbar">
            <div class="navbar-inner">
                <a class="brand" href="#">FTP-synchronization script</a>
            </div>
        </div>

        <div class="row">
            <div class="well well-mini span7 offset2">
                <form class="form-horizontal">
                    <legend>Source Server Details</legend>

                    <div class="control-group">
                        <label class="control-label" for="srcHost">Host:</label>
                        <div class="controls">
                            <input class="span4" type="text" id="srcHost" placeholder="Host">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label">FTP-user details</label>
                        <div class="controls">
                            <div class="control-group">
                                <label for="srcLogin">Login:</label>
                                <input class="span4" type="text" id="srcLogin" placeholder="Login">
                            </div>

                            <div class="control-group">
                                <label for="srcPassword">Password:</label>
                                <input class="span4" type="password" id="srcPassword" placeholder="Password">
                            </div>

                            <button class="btn" id="srcTest">Test connection<div class="preloader"></div></button>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="srcDir">Source path:</label>
                        <div class="controls">
                            <input type="text" id="srcDir" placeholder="Path">
                            <button class="btn" id="srcBrowse">Browse<div class="preloader"></div></button>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-inverse btn-large" id="startProcess">Start sync</button>
                    </div>

                </form>
            </div>

    </div>

    <div class="modal hide fade" id="popupWindow">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3>Modal header</h3>
        </div>
        <div class="modal-body">
            <p>One fine body…</p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Close</a>
            <a href="#" class="btn btn-primary">Save changes</a>
        </div>
    </div>

    <div class="row">
        <p>2012 - 2016 &copy; Copyright <a href="http://fedyk.in">Volodymyr Fedyk</a></p>
    </div>

	<script src="js/jquery-1.8.2.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/jquery.jstree.js"></script>
	<script src="js/iface.js"></script>

  </body>
</html>
