function updateStudent(id){
    $.ajax({
        url: '/sudents/' + id,
        type: 'PUT',
        data: $('#update-student').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};