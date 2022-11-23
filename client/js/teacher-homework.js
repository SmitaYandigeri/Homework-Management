var emptyClassRow = "<tr class='trNewRow'>"; 
emptyClassRow = emptyClassRow + "    <td class='tdSlNo'>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdHWName'>";
emptyClassRow = emptyClassRow + "        <input type='text' class='form-control hwName' style='height:40px; width:120px; font-family: monsterrat;' placeholder='Homework Name'/>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdHWDueDate'>";
emptyClassRow = emptyClassRow + "        <input type='date' class='form-control hwDueDate' style='height:40px; width:120px; font-family: monsterrat;' placeholder='Homework Name'/>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdHWDescription'>";
emptyClassRow = emptyClassRow + "        <input type='text' class='form-control hwDescription' style='height:40px; width:120px; font-family: monsterrat;' placeholder='Homework Short Description'/>";
emptyClassRow = emptyClassRow + "    </td>";
emptyClassRow = emptyClassRow + "    <td class='tdHwAction'>";
emptyClassRow = emptyClassRow + "        <a title='Save' class='btn border-shadow save'><span class='text-gradient'><i class='fas fa fa-floppy-o'></i></span></a>";
emptyClassRow = emptyClassRow + "        <a title='Cancel' class='btn border-shadow cancel'><span class='text-gradient'><i class='fas fa-times'></i></span></a>";
emptyClassRow = emptyClassRow + "    </td>";


$(document).ready(function () {

    //Return To Class Page
    $("#btnback").click(function () { 
        console.log("Rediricting To Classes")
        $(location).attr('href','/api/class');
    });

    //AddHomework For Teacher
    $("#btnAddHW").click(function () { 
        $("#tblData tbody").append(emptyClassRow); // appending dynamic string to table tbody
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
        console.log("HW Name :: "+hwName);
        console.log("HW Code :: "+hwDueDate);
        console.log("Class Code :: "+hwDescription);

        
        
        //location.reload();
        
    }); 

    
});