//fetch('https://raw.githubusercontent.com/00life/javascripts/master/timer_c.js').then(r=>r.text()).then(r=>eval(r))

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
        let date_convert = parseInt(e3.value.slice(0,2))*60 + parseInt(e3.value.slice(-2,));

        if(e3.value == 'TIME'){e3.style.color='none'; return};
        console.log('test');
        //(!isNaN(date_convert) && date_convert + 2 > current_convert) ? e3.style.color='red' : e3.style.color='none';
        //(e3.value == 'TIME') ? e3.style.color='none':null;
    });
}, 5000);
