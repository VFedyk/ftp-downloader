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
    //$('#fsTree').html("<ul><li id=\"phtml_1\"><a href=\"#\">Root node 1</a><ul><li id=\"phtml_2\"><a href=\"#\">Child node 1</a></li><li id=\"phtml_3\"><a href=\"#\">Child node 2</a></li></ul></li><li id=\"phtml_4\"><a href=\"#\">Root node 2</a></li></ul>");

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
            // I set both options to -2, as I do not need depth and children count checking
            // Those two checks may slow jstree a lot, so use only when needed
            "max_depth" : -2,
            "max_children" : -2,
            // I want only `drive` nodes to be root nodes
            // This will prevent moving or creating any other type as a root node
            "valid_children" : [ "drive" ],
            "types" : {
                // The default type
                "default" : {
                    // I want this type to have no children (so only leaf nodes)
                    // In my case - those are files
                    "valid_children" : "none",
                    // If we specify an icon for the default type it WILL OVERRIDE the theme icons
                    "icon" : {
                        "image" : "img/file.png"
                    }
                },
                // The `folder` type
                "folder" : {
                    // can have files and other folders inside of it, but NOT `drive` nodes
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
