let dobFormatted = new Date(document.querySelector("#dateV").value);
console.log(document.querySelector("#dateV").value)

document.querySelector("#date").value = dobFormatted.getFullYear() + "-" + String((dobFormatted.getMonth() + 1)).padStart(2, '0')  + "-" + String(dobFormatted.getDate()).padStart(2, '0');
document.querySelector("#addAuthor").addEventListener("submit", function (event){
    let date = document.querySelector("input[name=date]").value;
    let time = document.querySelector("input[name=time]").value;
    let meal = document.querySelector("input[name=meal]").value;


    let isValid = true;

    if(date.length < 3){
        alert('must be longer than 3');
        isValid = false;
    }
    
    if (!isValid){
        event.preventDefault();
    }

    if(meal.length < 3){
        alert('must be longer than 3');
        isValid = false;
    }
    
    if (!isValid){
        event.preventDefault();
    }

    if(time.length < 3){
        alert('must be longer than 3');
        isValid = false;
    }
    
    if (!isValid){
        event.preventDefault();
    }
});