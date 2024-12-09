let dodFormatted = new Date(document.querySelector("#dateV").value);
console.log(document.querySelector("#dateV").value)

document.querySelector("#date").value = dobFormatted.getFullYear() + "-" + String((dobFormatted.getMonth() + 1)).padStart(2, '0')  + "-" + String(dobFormatted.getDate()).padStart(2, '0');
