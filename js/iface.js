function testConnection (serverType) {
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
        
        jqxr.done(function(data){
            $('#popupWindow .modal-body').html(data.status);
            $('#popupWindow').modal();
        });
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
