/**
 * Developed By : Yandigeri, Smita 
 * This file has scripts and API to view submissions for homework  
 */

$(document).ready(function () {

    //Return To Class Page
    $("#btnback").click(function () { 
        console.log("Rediricting To Classes")

        let codeElement = document.getElementById("invitationCode");
        let classNameElement = document.getElementById("className");

        if (codeElement && classNameElement) {
            let code = codeElement.innerHTML;
            let className = classNameElement.innerHTML;
            let invitationCode = code.substring(1, code.length-1);
            $(location).attr('href','/api/homework?className='+encodeURIComponent(className)+'&invitationCode='+encodeURIComponent(invitationCode));
        } else {
            $(location).attr('href','/api/homework');
        }
    });

});