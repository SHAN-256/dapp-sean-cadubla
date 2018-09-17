window.pressed = function(){
    var a = document.getElementById('uploadPhoto');
    var label = document.getElementById('colorLabel')
    if(a.value == "")
    {
        label.innerHTML = "Choose file";
    }
    else
    {
        var theSplit = a.value.split('\\');
        label.innerHTML = theSplit[theSplit.length-1];
    }
};