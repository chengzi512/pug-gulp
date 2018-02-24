//折叠面板
let Bars=document.getElementsByClassName('_title');
for(var i=Bars.length-1;i>=0;i--){
    if(window.addEventListener){
        Bars[i].addEventListener('click', (r)=> {
            const target=document.querySelector('.'+r.currentTarget.dataset.collapse);
            if(target.style.display==''||target.style.display=='block'){
                target.style.height=0;
                target.style.display='none';
            }else{
                target.style.height='auto';
                target.style.display='block';
            }
        }, false);
    } else {
        Bars[i].attachEvent('onclick',  function(r){
            const target=document.querySelector('.'+r.currentTarget.dataset.collapse);
            if(target.style.display==''||target.style.display=='block'){
                target.style.height=0;
                target.style.display='none';
            }else{
                target.style.height='auto';
                target.style.display='block';
            }
        });
    }
}
//删除帐号
document.querySelector('#deleteAccount').onclick=()=>{
    document.querySelector('.modal').classList.add('modal-active');
};
document.querySelector('.modal-close').onclick=()=>{
    document.querySelector('.modal').classList.remove('modal-active');
};
document.querySelector('.modal-cancel').onclick=()=>{
    document.querySelector('.modal').classList.remove('modal-active');
};
document.querySelector('._top').onclick=()=>{
    scrollTo(0,0);
};
