var emptyHomeworkRow = "<tr class='trNewRow'>"; 
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdSlNo'>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdHWName'>";
emptyHomeworkRow = emptyHomeworkRow + "        <input type='text' class='form-control hwName' style='height:30px; width:140px; font-family: monsterrat;' placeholder='Homework Name'/>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdHWDueDate'>";
emptyHomeworkRow = emptyHomeworkRow + "        <input type='datetime-local' class='form-control hwDueDate' style='height:30px; width:140px; font-family: monsterrat;'/>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdHWDescription'>";
emptyHomeworkRow = emptyHomeworkRow + "        <input type='text' class='form-control hwDescription' style='height:30px; width:140px; font-family: monsterrat;' placeholder='Homework Short Description'/>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdHWDocuments'>";
emptyHomeworkRow = emptyHomeworkRow + "        <input type='file' id='hwDocuments' class='form-control hwDocuments' style='padding-top:7px; height:30px; width:140px; font-family: monsterrat;'/>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";
emptyHomeworkRow = emptyHomeworkRow + "    <td class='tdHwAction'>";
emptyHomeworkRow = emptyHomeworkRow + "        <a title='Save' class='btn border-shadow save'><span class='text-gradient'><i class='fas fa-save'></i></span></a>";
emptyHomeworkRow = emptyHomeworkRow + "        <a title='Cancel' class='btn border-shadow cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>";
emptyHomeworkRow = emptyHomeworkRow + "    </td>";

var actionForEdit = "<a title='Save' class='btn border-shadow update'><span class='text-gradient'><i class='fas fa-save'></i></span></a>"
actionForEdit = actionForEdit + "<a title='Cancel' class='btn border-shadow edit-cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>"

var fileData;
var fileName;

$(document).ready(function () {

    //Return To Class Page
    $("#btnback").click(function () { 
        console.log("Rediricting To Classes")
        $(location).attr('href','/api/class');
    });

    //AddHomework For Teacher
    $("#btnAddHW").click(function () { 
        $("#tblData tbody").append(emptyHomeworkRow);

        var uploadFile = document.getElementById("hwDocuments");
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

    //Cancel Add Homework before saving for Teacher    
    $('#tblData').on('click', '.cancel', function () { 
        $(this).parent().parent().remove();
    });

    //Save newly Added Homework
    $('#tblData').on('click', '.save', async function () {
        $(this).parent().parent().remove();
        const hwName =  $(this).parent().parent().find(".hwName").val();
        const hwDueDate =  $(this).parent().parent().find(".hwDueDate").val();
        const hwDescription =  $(this).parent().parent().find(".hwDescription").val();

        let code = document.getElementById("invitationCode").innerHTML;
        let invitationCode = code.substring(1, code.length-1);
        let className = document.getElementById("className").innerHTML;

        console.log(fileData);

        const result = fetch('/api/addhomework', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({hwName, hwDueDate, hwDescription, invitationCode, fileData, fileName})
        })
        .then(res => res.json());
        
        $(location).attr('href','/api/homework?className='+encodeURIComponent(className)+'&invitationCode='+encodeURIComponent(invitationCode));
        
    }); 

    //Edit Homework Action
    $('#tblData').on('click', '.edit', async function () { 
        console.log("Editing the Homework");
        const hwName =$(this).parent().parent().find(".tdHWName").html();
        $(this).parent().parent().find(".tdHWName")
        .html("<input type='text' value='"+hwName+"' class='form-control hwName' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Homework Name'/>"); 

        const hwDueDate =$(this).parent().parent().find(".tdHWDueDate").html();
        console.log(hwDueDate)
        $(this).parent().parent().find(".tdHWDueDate")
        .html("<input type='datetime-local' value='"+hwDueDate+"' class='form-control hwDueDate' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Homework Name'/>"); 

        const hwDescription =$(this).parent().parent().find(".tdHWDescription").html();
        $(this).parent().parent().find(".tdHWDescription")
        .html("<input type='text'  value='"+hwDescription+"'  class='form-control hwDescription' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Homework Short Description'/>"); 

        $(this).parent().parent().find(".tdHWDocuments")
        .html("<input type='file' id='hwDocuments' class='form-control hwDocuments' style='padding-top:5px; height:30px; width:140px; font-family: monsterrat;'/>"); 

        $(this).parent().parent().find(".tdHwAction").html(actionForEdit);

        var uploadFile = document.getElementById("hwDocuments");
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


    //Cancel Edit Action
    $('#tblData').on('click', '.edit-cancel', function () { 
        location.reload();
    });

    //Save Edit Action

    $('#tblData').on('click', '.update', async function () { 
        $(this).parent().parent().remove();
        const newHwName =  $(this).parent().parent().find(".hwName").val();
        const newHwDueDate =  $(this).parent().parent().find(".hwDueDate").val();
        const newHwDescription =$(this).parent().parent().find(".hwDescription").val();
        const hwID =$(this).parent().parent().find(".tdHWId").html();
        let code = document.getElementById("invitationCode").innerHTML;
        let invitationCode = code.substring(1, code.length-1);

        console.log(newHwName)

        const result = fetch('/api/updatehomework', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({newHwName, newHwDueDate, newHwDescription, hwID, invitationCode, fileName, fileData})
        })
        .then(res => res.json());

        location.reload();
    });     


    //Upload Homework Action

    //Delete Homework Action 
    $('#tblData').on('click', '.delete', async function () { 
        console.log("Deleting the Homework")
        let code = document.getElementById("invitationCode").innerHTML;
        let invitationCode = code.substring(1, code.length-1);


        const hwName =$(this).parent().parent().find(".tdHWName").html();

        fetch('/api/deleteHomework', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({invitationCode, hwName})
        })
        .then(res => res.json());
        
        location.reload();
    });
  
    
});