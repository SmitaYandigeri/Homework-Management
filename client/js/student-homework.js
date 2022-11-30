var actionForEdit = "<a title='Save' class='btn border-shadow save-submit'><span class='text-gradient'><i class='fas fa-save'></i></span></a>"
actionForEdit = actionForEdit + "<a title='Cancel' class='btn border-shadow submit-cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>"

$(document).ready(function () {

    var fileData;
    var fileName;

    //Return To Class Page
    $("#btnback").click(function () { 
        console.log("Rediricting To Classes")
        $(location).attr('href','/api/student-class');
    });

    $('#tblData').on('click', '.submit', async function () { 
        console.log("Editing the Homework");
        const hwName =$(this).parent().parent().find(".tdHWStatus").html();
        $(this).parent().parent().find(".tdHWStatus")
        .html("<input type='file' id='hwSubmission' class='form-control hwSubmission' style='padding-top:5px; height:30px; width:140px; font-family: monsterrat;'/>"); 

        $(this).parent().parent().find(".tdHwAction").html(actionForEdit);

        var uploadFile = document.getElementById("hwSubmission");
        uploadFile.addEventListener('change',function(event){
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                fileName = event.target.files[0].name;
                fileData = reader.result;
            };  
        })
    }); 
    
    //Cancel Submission    
    $('#tblData').on('click', '.submit-cancel', function () { 
        location.reload();
    });

    //Save Submission    
    $('#tblData').on('click', '.save-submit', function () { 
        console.log(fileName)

        const hwID =$(this).parent().parent().find(".tdHWId").html();
        const hwName =$(this).parent().parent().find(".tdHWName").html();
        let code = document.getElementById("invitationCode").innerHTML;
        let invitationCode = code.substring(1, code.length-1);

        const result = fetch('/api/student-submission', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({fileName, fileData, hwID, invitationCode, hwName})
        })
        .then(res => res.json());

        $(location).attr('href','/api/student-homework?hwID='+encodeURIComponent(hwID)+'&invitationCode='+encodeURIComponent(invitationCode));    
    
    });

});