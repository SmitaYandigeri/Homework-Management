var emptyClassRow = "<tr class='trNewRow'>"; 
emptyClassRow = emptyClassRow + "    <td class='tdSlNo'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdClassName'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdClassCode'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdInvitation'>";
emptyClassRow = emptyClassRow + "        <input type='text' class='form-control invitationCode' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Enter Invitation Code' />";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdAction'>";
emptyClassRow = emptyClassRow + "        <a title='Save' class='btn border-shadow save'><span class='text-gradient'><i class='fas fa-save'></i></span></a>";
emptyClassRow = emptyClassRow + "        <a title='Cancel' class='btn border-shadow cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "</tr>";

var actionForEdit = "<a title='Join' class='btn border-shadow update'><span class='text-gradient'><i class='fas fa-solid fa-right-to-bracket'></i></i></span></a>"
actionForEdit = actionForEdit + "<a title='Cancel' class='btn border-shadow edit-cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>"

$(document).ready(function () {

    //AddClasses For Teacher
    $("#btnAdd").click(function () { 
        $("#tblData tbody").append(emptyClassRow); // appending dynamic string to table tbody
    });

    //Cancel Add Class before saving for Teacher    
    $('#tblData').on('click', '.cancel', function () { 
        $(this).parent().parent().remove();
    });

    //Save newly Added Class
    $('#tblData').on('click', '.save', async function () { 
        $(this).parent().parent().remove();
        const invitationCode =  $(this).parent().parent().find(".invitationCode").val();
        console.log("Class Invitation Code :: "+invitationCode);

        const result = fetch('/api/student-joinclass', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({invitationCode})
        })
        .then(res => res.json());
        
        location.reload();
    }); 

    //View Homwork Class
    $('#tblData').on('click', '.view', async function () { 
        console.log("View Homeworks")
        const invitationCode = $(this).parent().parent().find(".tdInvitation").html();
        const className = $(this).parent().parent().find(".tdClassName").html();
        console.log(className)
        console.log(invitationCode)

        console.log("Calling with Query params")

        $(location).attr('href','/api/student-homework?className='+encodeURIComponent(className)+'&invitationCode='+encodeURIComponent(invitationCode));
    });
    

    //Drop Class
    $('#tblData').on('click', '.drop', async function () { 
        console.log("Dropping the Class")
        const invitationCode =$(this).parent().parent().find(".tdInvitation").html();

        fetch('/api/student-dropclass', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({invitationCode})
        })
        .then(res => res.json());
        
        location.reload();
    });
    

});