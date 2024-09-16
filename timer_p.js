
//fetch('https://raw.githubusercontent.com/00life/javascripts/master/timer_c.js').then(r=>r.text()).then(r=>eval(r))
const waitTime = 15; //min

Array.from(document.querySelectorAll('.pssc-studentMaskDiv')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('class','myBtn');
    btn.setAttribute("style", "background-color: white");
    btn.addEventListener('click',e=>{
        let date = new Date().toLocaleTimeString('en-US', {hour:"2-digit", minute:"2-digit", hour12:false});
        if(e2.currentTarget.value =='TIME'){
            e2.currentTarget.value = date;
        }else{
            e2.currentTarget.value = 'TIME'};
    });

    let btn2 = document.createElement('input');
    btn2.setAttribute('type','button');
    btn2.setAttribute('value','✎');
    btn2.setAttribute('class','myBtn2');
    btn2.addEventListener('click',e2=>{
        let note = prompt("Please enter note");
        let timestamp = new Date().toLocaleString();
        let name = e2.currentTarget.parentNode.parentNode.parentNode.querySelector('.pssc-studentNameSpan').innerHTML;
        console.log(e2.currentTarget.parentNode.parentNode.parentNode.querySelector('.pssc-studentNameSpan'));
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
