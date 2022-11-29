var emptyClassRow = "<tr class='trNewRow'>"; 
emptyClassRow = emptyClassRow + "    <td class='tdSlNo'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdClassName'>";
emptyClassRow = emptyClassRow + "        <input type='text' class='form-control className' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Enter Class Name'/>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdClassCode'>";
emptyClassRow = emptyClassRow + "        <input type='text' class='form-control classCode' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Enter Class Code' />";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdInvitation'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdAction'>";
emptyClassRow = emptyClassRow + "        <a title='Save' class='btn border-shadow save'><span class='text-gradient'><i class='fas fa-save'></i></span></a>";
emptyClassRow = emptyClassRow + "        <a title='Cancel' class='btn border-shadow cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "</tr>";

var actionForEdit = "<a title='Save' class='btn border-shadow update'><span class='text-gradient'><i class='fas fa-save'></i></span></a>"
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
        const className =  $(this).parent().parent().find(".className").val();
        const classCode =  $(this).parent().parent().find(".classCode").val();
        console.log("Class Name :: "+className);
        console.log("Class Code :: "+classCode);
    
        const result = fetch('/api/addclass', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({className, classCode})
        })
        .then(res => res.json());
        
        location.reload();        
    }); 

    //Edit Class Inline
    $('#tblData').on('click', '.edit', async function () { 
        console.log("Editing the page");
        const className =$(this).parent().parent().find(".tdClassName").html();
        $(this).parent().parent().find(".tdClassName")
        .html("<input type='text' value='"+className+"' class='form-control className' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Enter Name'/>"); 

        const classCode =$(this).parent().parent().find(".tdClassCode").html();
        $(this).parent().parent().find(".tdClassCode")
        .html("<input type='text' value='"+classCode+"' class='form-control classCode' style='height:30px; width:120px; font-family: monsterrat;' placeholder='Enter City'/>"); 

        $(this).parent().parent().find(".tdAction").html(actionForEdit);
    
    }); 

    //Update Edit Class
    $('#tblData').on('click', '.update', async function () { 
        $(this).parent().parent().remove();
        const className =  $(this).parent().parent().find(".className").val();
        const classCode =  $(this).parent().parent().find(".classCode").val();
        const invitationCode =$(this).parent().parent().find(".tdInvitation").html();

        const result = fetch('/api/updateclass', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({className, classCode, invitationCode})
        })
        .then(res => res.json());
        
        location.reload();
    }); 

    //Cancel Edit Action
    $('#tblData').on('click', '.edit-cancel', function () { 
        location.reload();
    });

    //Delete Class
    $('#tblData').on('click', '.delete', async function () { 
        console.log("Deleting the Class")
        const invitationCode =$(this).parent().parent().find(".tdInvitation").html();

        fetch('/api/deleteclass', {
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

        $(location).attr('href','/api/homework?className='+encodeURIComponent(className)+'&invitationCode='+encodeURIComponent(invitationCode));
    });
    

});