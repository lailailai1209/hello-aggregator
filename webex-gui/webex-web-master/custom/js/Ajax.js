/**
 * Created by roye on 2016/6/22.
 */
function callServerGet(url, params, successCall, failCall){
    $.ajax({
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        type: 'GET',
        url: url+params,
        success: function(response){
            successCall(response)
        },
        error: function(jqXHR, textStatus, errorThrown){
                toastr["error"]("网络请求失败, 错误代码: "+ jqXHR.status);
                // console.error(jqXHR);
                if(failCall != undefined)
                    failCall();
        },
        dataType: 'json',
        timeout: 2000
    });
}

function callServerPost(url, params, payload, successCall, failCall){
    var postData = JSON.stringify(payload);

    $.ajax({
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        type: 'POST',
        url: url + params,
        data: postData,
        success: function(response, textStatus){
            successCall(response)
        },
        error: function(jqXHR, textStatus, errorThrown){
                toastr["error"]("网络请求失败, 错误代码:  "+ jqXHR.status);
                if(failCall != undefined)
                    failCall();
        },
        dataType: 'json'
    });
}


