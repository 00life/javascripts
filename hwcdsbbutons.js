Array.from(document.querySelectorAll('td.seat-cellName')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('class','myBtn');
    btn.setAttribute('data-min', 0);
    btn.addEventListener('click',e2=>{
        let date = new Date().toLocaleTimeString().slice(0,-6);
        if(e2.currentTarget.value =='TIME'){
            e2.currentTarget.value = date;
            btn.setAttribute('data-min', Math.round(new Date().getTime() / 1000 / 60));
        }else{
            e2.currentTarget.value = 'TIME'};
            btn.setAttribute('data-min',0);
      
    });

    let ele_div = document.createElement('div');
    ele_div.appendChild(btn);
    e1.appendChild(ele_div);
});

setInterval(()=>{
    Array.from(document.querySelectorAll('.myBtn')).forEach(e3=>{
        let current =  Math.round(new Date().getTime() / 1000 / 60);
        (current > e3.currentTarget.dataset.min + 1)? e3.currentTarget.style['background-color'] = 'red' : null;
    });
}, 10000);

//PASTE CODE BELOW
//fetch('https://raw.githubusercontent.com/00life/javascripts/master/hwcdsbbutons.js').then(r=>r.text()).then(r=>eval(r))
