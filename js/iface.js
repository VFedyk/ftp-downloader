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
        var host = $('#srcHost').val();
        var login =  $('#srcLogin').val();
        var password = $('#srcPassword').val();
        console.log(host + " " + login + " " + password);
        var jqxr = $.getJSON('ajax.php?server=source' 
            + '&host=' + host
            + '&login=' + login 
            + '&password=' + password
        );
        
        jqxr.done(function(data){
            $('#popupWindow .modal-body').html(data.status);
            $('#popupWindow').modal();
        });
    });
    
    $('#browseDst').click(function(e){
        e.preventDefault();
        var jqxr = $.getJSON('ajax.php?server=destination');
        jqxr.done(function(data){
            $('#popupWindow .modal-body').html(data.status);
            $('#popupWindow').modal();
        });
    });
});
