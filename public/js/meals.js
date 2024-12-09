let dobFormatted = new Date(document.querySelector("#dateV").value);
console.log(document.querySelector("#date").value);
document.querySelector("#date").innerText = (dobFormatted.getMonth() + 1)  + "/" + dobFormatted.getDate() + "/" + dobFormatted.getFullYear();
