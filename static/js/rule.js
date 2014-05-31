function load_tasklist(){
    $.ajax({
        url: '/tasklist',
        type: 'GET',
        cache: false,
        success: function(data){
            $("#tasklist").html(data);
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    });
}

function load_task(id){
    $.ajax({
        url: '/task',
        type: 'GET',
        cache: false,
        data: "id=" + id,
        success: function(data){
            $("#task").html(data);
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    });
}

function save_task(data){
    $.ajax({
        url: '/save_task',
        type: 'post',
        cache: false,
        data: data,
        success: function(data){
            $("#task").html(data);
            load_tasklist();
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    });
}

function finish_task(id){
    $.ajax({
        url: '/finish_task',
        type: 'GET',
        cache: false,
        data: "id=" + id,
        success: function(data){
            $("#task").html(data);
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }
    });
}

$().ready(load_tasklist);