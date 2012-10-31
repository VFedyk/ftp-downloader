function testConnection (serverType) 
{
        var host = $('#' + serverType + 'Host').val();
        var login =  $('#' + serverType + 'Login').val();
        var password = $('#' + serverType + 'Password').val();
        console.log(host + " " + login + " " + password);
        var srvType = (serverType == 'src') ? 'source' : 'destination';
        var jqxr = $.getJSON('ajax.php?server=' + srvType
            + '&host=' + host
            + '&login=' + login 
            + '&password=' + password
        );
        
        $('#' + serverType + 'Test .preloader').show();
        
        jqxr.done(function(data){
            $('#' + serverType + 'Test .preloader').hide();
            if (data.status === 'success') {
                showSuccess('Connection succesful');
            } else {
                showError('Connection failed');
            }
        });
}

function showError(message)
{
    $('#popupWindow .modal-header h3').html('Error');
    var content = "<p class=\"error-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow').modal();
}

function showInfo(message)
{
    $('#popupWindow .modal-header h3').html('Information');
    var content = "<p class=\"info-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow').modal();
}

function showSuccess(message)
{
    $('#popupWindow .modal-header h3').html('Information');
    var content = "<p class=\"success-message\">" + message + "</p>";
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow').modal();
}

function showTreeDialog(serverType)
{
    var host = $('#' + serverType + 'Host').val();
    var login =  $('#' + serverType + 'Login').val();
    var password = $('#' + serverType + 'Password').val();

    var srvType = (serverType == 'src') ? 'source' : 'destination';
    $('#popupWindow .modal-header h3').html('Choosing files on ' + srvType + ' server');
    $('#popupWindow .modal-body').html("<div id=\"fsTree\"></div>");
    $('#popupWindow').modal();

    $('#fsTree').jstree({
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
    
    var content = "<p>" + message + " <span id=\"progressLabel\" class=\"pull-right\">" + progress + "%<\/span></p>";
    content += "<div class=\"progress progress-success progress-striped active\"><div id=\"progressBar\" class=\"bar\" style=\"width: " + progress + "%\"></div><\/div>";
    
    $('#popupWindow .modal-body').html(content);
    $('#popupWindow').modal();
}

function changeProgress (progress)
{
    $('#progressLabel').html(progress + '%');
    $('#progressBar').width(progress + '%');
}

$(function() {
    $('#srcTest').click(function(e){
        e.preventDefault();
        testConnection('src');
    });
    
    $('#dstTest').click(function(e){
        e.preventDefault();
        testConnection('dst');
    });
    
    $('#browseSrc').click(function(e){
        e.preventDefault();
        showTreeDialog('src');
    });
    
    $('#browseDst').click(function(e){
        e.preventDefault();
        showTreeDialog('dst');
    });
});
