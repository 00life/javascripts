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
        let current_convert = Number(current.slice(0,1)) + Number(current.slice(-2,-1));
        let date_convert = Number(e3.value.slice(0,1)) + Number(e3.value.slice(-2,-1));
        (date_convert + 15 > current_convert) ? e3.style.color='red' : e3.style.color='none';
        console.log('current:', current_convert,'...date:',date_convert);
    });
}, 5000);
