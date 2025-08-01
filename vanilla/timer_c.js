//fetch('https://raw.githubusercontent.com/00life/javascripts/master/timer_c.js').then(r=>r.text()).then(r=>eval(r))

const waitTime = 15; //min

Array.from(document.querySelectorAll('td.seat-cellName')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('class','myBtn');
    btn.addEventListener('click', e2 => {

        let timestamp = new Date().toLocaleString();
        let student = e2.currentTarget.parentNode.parentNode.innerText;
        let school = document.querySelector('#topTitleBar > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > span').innerText;
        let myclass = document.querySelector('#bodytop > h1 > a:nth-child(2)').innerText;
        var note;
        
        if(e2.currentTarget.value =='TIME'){
            e2.currentTarget.value = new Date().toLocaleTimeString('en-US', {hour:"2-digit", minute:"2-digit", hour12:false});
            note = "Hall-Pass (Out)";
        }else{
            let current = new Date().toLocaleTimeString('en-US', {hour:"2-digit", minute:"2-digit", hour12:false});
            let current_convert = parseInt(current.slice(0,2))*60 + parseInt(current.slice(-2,));
            let date_convert = parseInt(e2.currentTarget.value.slice(0,2))*60 + parseInt(e2.currentTarget.value.slice(-2,));
            let minDiff = current_convert - date_convert;
            note = `Hall-Pass (Return in ${minDiff} min)`;
            e2.currentTarget.value = 'TIME';
        };

        let formData = new FormData();
        formData.append("Timestamp", timestamp);
        formData.append("Student", student);
        formData.append("School", school);
        formData.append("Class", myclass);
        formData.append("Note", note);
        
        let URL = localStorage.getItem("googleSheetSupplyURL");
        fetch(URL, {method:"POST", body:formData});
        
    });

    let btn2 = document.createElement('input');
    btn2.setAttribute('type','button');
    btn2.setAttribute('value','✎');
    btn2.setAttribute('class','myBtn2');
    btn2.addEventListener('click',e2 => {

        let timestamp = new Date().toLocaleString();
        let student = e2.currentTarget.parentNode.parentNode.innerText;
        let school = document.querySelector('#topTitleBar > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > span').innerText;
        let myclass = document.querySelector('#bodytop > h1 > a:nth-child(2)').innerText;
        let note = prompt("Please enter note");
        if(note == null){return};

        let formData = new FormData();
        formData.append("Timestamp", timestamp);
        formData.append("Student", student);
        formData.append("School", school);
        formData.append("Class", myclass);
        formData.append("Note", note);

        let URL = localStorage.getItem("googleSheetSupplyURL");
        fetch(URL, {method:"POST", body:formData});
        
    });
        
    let ele_div = document.createElement('div');
    ele_div.appendChild(btn);
    ele_div.appendChild(btn2);
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

/*

//// Instructions on Google's Apps Script ////

const sheets = SpreadsheetApp.openByUrl(" <GOOGLESHEET_URL> ");
const sheet = sheets.getSheetByName(" <SHEET_NAME> ");

function doPost(e){
  let data = e.parameter;
  sheet.appendRow([data.Timestamp, data.Student, data.School, data.Class, data.Note]);
  return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet database!");
}; 

*/

