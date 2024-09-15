//fetch('https://raw.githubusercontent.com/00life/javascripts/master/timer_c.js').then(r=>r.text()).then(r=>eval(r))
const waitTime = 15; //min

Array.from(document.querySelectorAll('td.seat-cellName')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('class','myBtn');
    btn.addEventListener('click',e2=>{
        let date = new Date().toLocaleTimeString('en-US', {hour:"2-digit", minute:"2-digit", hour12:false});
        if(e2.currentTarget.value =='TIME'){
            e2.currentTarget.value = date;
        }else{
            e2.currentTarget.value = 'TIME'};
    });

    let ele_div = document.createElement('div');
    ele_div.appendChild(btn);
    e1.appendChild(ele_div);
});

setInterval(()=>{
    Array.from(document.querySelectorAll('.myBtn')).forEach(e3=>{
        let current = new Date().toLocaleTimeString('en-US', {hour:"2-digit", minute:"2-digit", hour12:false});
        let current_convert = parseInt(current.slice(0,2))*60 + parseInt(current.slice(-2,));
        let date_convert = parseInt(e3.value.slice(0,2))*60 + parseInt(e3.value.slice(-2,)) +  waitTime;

        if(e3.value == 'TIME'){e3.style.color='black'; return};
        if(date_convert <= current_convert){e3.style.color='red'};
    });
}, 5000);

// let formData = new FormData();
// formData.append('Timestamp','Today');
// formData.append('Student','Me');
// formData.append('Class','math');
// formData.append('Note','test');
// console.log(formData);

// let URL = "https://script.google.com/macros/s/AKfycbxXDkvra5txNoQuUvIMrhLLUOP8CFQh1m05Ur_Qq2mHF1RG6iMrs6QATF9HdtyWP6sITg/exec";

// fetch(URL,{
//     method:"POST",
//     body:formData
// });

////Supply Teach Notes (Script)////
// const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1KESlFACtONHfxKReHbYAlwIV7e4tEO1FHt-tU77Uups/edit?resourcekey=&gid=1020634359#gid=1020634359");

// const sheet = sheets.getSheetByName("notes");

// function doPost(e){
//   let data = e.parameter;
//   sheet.appendRow([data.Timestamp,data.Student,data.Class,data.Note]);
//   return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet database!");
// };

