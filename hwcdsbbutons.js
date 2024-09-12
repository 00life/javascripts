let btn = document.createElement('input');

btn.setAttribute('type','button');
btn.setAttribute('value','time');
btn.addEventListener('click',e=>{
    let date = new Date().toLocaleTimeString();
    console.log(e.currentTarget.value = date);
});

document.querySelector('td.seat-cellName').appendChild(btn)
