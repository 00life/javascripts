let btn = document.createElement('input');

btn.setAttribute('type','button');
btn.setAttribute('value','time');
btn.addEventListener('click',e=>{
    let date = new Date().toLocaleTimeString().slice(0,-6);
    console.log(e.currentTarget.value = date);
});

document.querySelector('td.seat-cellName').appendChild(btn)
