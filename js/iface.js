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
    $('#fsTree').html("<ul><li id=\"phtml_1\"><a href=\"#\">Root node 1</a><ul><li id=\"phtml_2\"><a href=\"#\">Child node 1</a></li><li id=\"phtml_3\"><a href=\"#\">Child node 2</a></li></ul></li><li id=\"phtml_4\"><a href=\"#\">Root node 2</a></li></ul>");

    $('#fsTree').jstree();
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
