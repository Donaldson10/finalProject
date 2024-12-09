let dobFormatted = new Date(document.querySelector("#dateV").value);
console.log(document.querySelector("#date").value);
document.querySelector("#date").innerText = (dobFormatted.getMonth() + 1)  + "/" + dobFormatted.getDate() + "/" + dobFormatted.getFullYear();

document.querySelector("#editMeals").addEventListener("submit", function (event){
    let fName = document.querySelector("input[name=date]").value;

    let isValid = true;

    if(fName.length < 3){
        alert('must be longer than 3');
        isValid = false;
    }
    
    if (!isValid){
        event.preventDefault();
    }
});
