function step1checkingCallback (params) {
    if (params.result) {
        changeProgress(0, 'Checking connection to destination server...');
        testConnection('dst', step2checkingCallback, {});
    } else {
        showError('Connection failed');
    }
}

function step2checkingCallback (params) {
    if (params.result) {
        changeProgress(0, 'Trying to download file...');
        getDownloadProgress();
    } else {
        showError('Connection failed');
    }
}

function getDownloadProgress()
{
    var srcHost = $('#srcHost').val();
    var srcLogin = $('#srcLogin').val();
    var srcPassword = $('#srcPassword').val();
    var srcFile = $('#srcDir').val();
        
    var dstHost = $('#dstHost').val();
    var dstLogin = $('#dstLogin').val();
    var dstPassword = $('#dstPassword').val();
    var dstDir = $('#dstDir').val();
    
    var today = new Date();
    var id = today.getTime();
    
    $('#progressData').load('ajax.php',
                            'operation=downloadfile' +
                            '&srcHost=' + srcHost +
                            '&srcLogin=' + srcLogin +
                            '&srcPassword=' + srcPassword +
                            '&srcFile=' + srcFile +
                            '&dstHost=' + dstHost +
                            '&dstLogin=' + dstLogin +
                            '&dstPassword=' + dstPassword +
                            '&dstDir=' + dstDir +
                            '&id=' + id
                        );
    
    var appInterval = setInterval(function() { 
            var jqxr = $.getJSON('ajax.php?operation=get_progress&id=' + id);
            
            jqxr.done(function(data) {
                if (data.downloaded == data.filesize) {
                    showSuccess('File is downloaded');
                    clearTimeout(appInterval);
                    
                    return;
                }
                
                if (data.id !== id) {
                    clearTimeout(appInterval);
                    showError('Error when downloading');
                    
                    return;
                }
                
                changeProgress(data.progress, 'Downloading file...');
            })
        }, 1000);
}

function testingCallback (params) 
{
    $('#' + params.serverType + 'Test .preloader').hide();
    if (params.result) {
        showSuccess('Connection succesful');
    } else {
        showError('Connection failed');
    }
}

function browsingCallback (params) 
{
    $('#' + params.serverType + 'Browse .preloader').hide();
    if (params.result) {
        showTreeDialog(params.serverType);
    } else {
        showError('Connection failed');
    }
}

function testConnection (serverType, callback, params) 
{
        var host = $('#' + serverType + 'Host').val();
        var login =  $('#' + serverType + 'Login').val();
        var password = $('#' + serverType + 'Password').val();
        var srvType = (serverType == 'src') ? 'source' : 'destination';
        
        var jqxr = $.ajax({
                        url: "ajax.php",
                        dataType: 'json',
                        data: { 'server': srvType,
                                'host': host,
                                'login': login,
                                'password': password },
                    });
        
        params.serverType = serverType;
        params.result = false;
        
        jqxr.done(function(data){
            if (data.status === 'success') {
                params.result = true;
                callback(params);
            } else {
                params.result = false;
                callback(params);
            }
        });
}

function showError(message)
{
    $('#popupWindow .modal-header h3').html('Error');
    var content = "<p class=\"error-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow .modal-footer').html("<a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Close</a>");
    $('#popupWindow').modal();
}

function showInfo(message)
{
    $('#popupWindow .modal-header h3').html('Information');
    var content = "<p class=\"info-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow .modal-footer').html("<a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Ok</a>");
    $('#popupWindow').modal();
}

function showSuccess(message)
{
    $('#popupWindow .modal-header h3').html('Information');
    var content = "<p class=\"success-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow .modal-footer').html("<a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Ok</a>");
    $('#popupWindow').modal();
}

function showTreeDialog(serverType)
{
    var host = $('#' + serverType + 'Host').val();
    var login =  $('#' + serverType + 'Login').val();
    var password = $('#' + serverType + 'Password').val();

    var srvType = (serverType == 'src') ? 'source' : 'destination';
    $('#popupWindow .modal-header h3').html('Choosing files on ' + srvType + ' server');
    $('#popupWindow .modal-body').html("<div id=\"fsTree\"></div><div id=\"fsFileinfo\"></div>");
    var footerContent = "<a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Cancel</a>";
    footerContent += "<a id=\"selectBtn\" href=\"#\" class=\"btn btn-primary disabled\">Select</a>";
    $('#popupWindow .modal-footer').html(footerContent);
    $('#fsFileinfo').data('servertype', serverType);
    $('#popupWindow').modal();

    $('#selectBtn').on('click', function(e) {
        if ($(this).hasClass('disabled')) {
            return;
        }
        
        $('#' + serverType + 'Dir').val($('#fsFileinfo').data('path'));
        $('#popupWindow').modal('hide');
    });
    
    $('#fsTree')
    .bind('select_node.jstree', function(event, data) {
        var path = data.rslt.obj.attr('path');
        var type = data.rslt.obj.attr('rel');
        
        if ((type == 'default' && serverType == 'src') || (type == 'folder' && serverType == 'dst')) {
            $('#selectBtn').removeClass('disabled');
            $('#fsFileinfo').data('path', path);
        } else {
            if (!$('#selectBtn').hasClass('disabled')) {
                $('#selectBtn').addClass('disabled');
            }
            $('#fsFileinfo').data('path', '');
        }
    })
    
    .jstree({
        plugins: ["themes","json_data","ui","types"],
        "json_data" : {
            "ajax" : {
                "url" : "ajax.php",
                "data" : function (n) {
                    var id = '';
                    var path = '';
                    if (n.attr) {
                        id = n.attr("id").replace("node_","");
                        path = n.attr("path");
                    } else {
                        id = 1;
                        path = "/";
                    }
                    
                    return {
                        "server" : srvType,
                        "host" : host,
                        "login" : login,
                        "password" : password,
                        "operation" : "get_filelist",
                        "id" : id,
                        "path" : path
                    };
                }
            }
        },
        
        "types" : {
            "max_depth" : -2,
            "max_children" : -2,
            "valid_children" : [ "drive" ],
            "types" : {
                "default" : {
                    "valid_children" : "none",
                    "icon" : {
                        "image" : "img/file.png"
                    }
                },
                "folder" : {
                    "valid_children" : [ "default", "folder" ],
                    "icon" : {
                        "image" : "img/folder.png"
                    }
                }
            }
        },
    });
}

function showProgress (title, message, progress)
{
    $('#popupWindow .modal-header h3').html(title);
    
    var content = "<p><span id=\"progressMessage\">" + message + "</span> <span id=\"progressLabel\" class=\"pull-right\">" + progress + "%<\/span></p>";
    content += "<div class=\"progress progress-success progress-striped active\"><div id=\"progressBar\" class=\"bar\" style=\"width: " + progress + "%\"></div><\/div>";
    content += "<div id=\"progressData\"></div>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow .modal-footer').html("<a href=\"#\" class=\"btn\" data-dismiss=\"modal\">Cancel</a>");
    $('#popupWindow').modal();
}

function changeProgress (progress, message)
{
    $('#progressMessage').html(message);
    $('#progressLabel').html(progress + '%');
    $('#progressBar').width(progress + '%');
}

$(function() {
    $('#srcTest').click(function(e){
        e.preventDefault();
        $('#srcTest .preloader').show();
        testConnection('src', testingCallback, {});
    });
    
    $('#dstTest').click(function(e){
        e.preventDefault();
        $('#dstTest .preloader').show();
        testConnection('dst', testingCallback, {});
    });
    
    $('#srcBrowse').click(function(e){
        e.preventDefault();
        $('#srcBrowse .preloader').show();
        testConnection('src', browsingCallback, {});
    });
    
    $('#dstBrowse').click(function(e){
        e.preventDefault();
        $('#dstBrowse .preloader').show();
        testConnection('dst', browsingCallback, {});
    });
    
    $('#startProcess').click(function(e) {
        var srcHost = $('#srcHost').val();
        var srcLogin = $('#srcLogin').val();
        var srcPassword = $('#srcPassword').val();
        var srcFile = $('#srcDir').val();
        
        var dstHost = $('#dstHost').val();
        var dstLogin = $('#dstLogin').val();
        var dstPassword = $('#dstPassword').val();
        var dstDir = $('#dstDir').val();
        
        if (srcHost == '' || srcLogin == '' || srcFile == '' 
            || dstHost == '' || dstLogin == '' || dstDir == '') {
            showError('You need to fill all fields!');
            
            return;
        }
        
        showProgress('Please wait', 'Checking connection to source server...', 0);
        testConnection('src', step1checkingCallback, {});
        
        return;
    });
});
