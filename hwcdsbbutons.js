Array.from(document.querySelectorAll('td.seat-cellName')).forEach(e1=>{

    let btn = document.createElement('input');
    btn.setAttribute('type','button');
    btn.setAttribute('value','TIME');
    btn.setAttribute('data-min', new Date().getTime() / 1000 / 60)
    btn.addEventListener('click',e2=>{
        let date = new Date().toLocaleTimeString().slice(0,-6);
        (e2.currentTarget.value =='TIME') ? e2.currentTarget.value = date : e2.currentTarget.value = 'TIME';
    });

    let ele_div = document.createElement('div');
    ele_div.appendChild(btn);
    e1.appendChild(ele_div);
});

console.log(btn);

//PASTE CODE BELOW
//fetch('https://raw.githubusercontent.com/00life/javascripts/master/hwcdsbbutons.js').then(r=>r.text()).then(r=>eval(r))
