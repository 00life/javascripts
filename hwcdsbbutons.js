Array.from(document.querySelectorAll('td.seat-cellName')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('class','myBtn');
    btn.addEventListener('click',e2=>{
        let date = new Date().toLocaleTimeString().slice(0,-6);
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
        let current = new Date().toLocaleTimeString().slice(0,-6);
        console.log('test ', e3.value);    
        //console.log(e3.style.color='red');
        
    });
}, 5000);

//PASTE CODE BELOW
//fetch('https://raw.githubusercontent.com/00life/javascripts/master/hwcdsbbutons.js').then(r=>r.text()).then(r=>eval(r))
