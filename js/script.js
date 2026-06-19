// GREETING

function updateGreeting(){

let hour = new Date().getHours();

let text;


if(hour < 12){

text="Good Morning";

}
else if(hour <18){

text="Good Afternoon";

}
else{

text="Good Evening";

}


let name =
localStorage.getItem("name")
|| "User";


document.getElementById("greeting")
.innerHTML =
text+", "+name;


document.getElementById("date")
.innerHTML =
new Date().toLocaleString();


}


updateGreeting();




// TIMER


let time = 1500;

let timer;


function startTimer(){


timer=setInterval(()=>{


let min=Math.floor(time/60);
let sec=time%60;


document.getElementById("timer")
.innerHTML=
`${min}:${sec}`;


time--;


},1000)


}




function stopTimer(){

clearInterval(timer);

}




function resetTimer(){

clearInterval(timer);

time=1500;

document.getElementById("timer")
.innerHTML="25:00";

}




// TODO


let tasks =
JSON.parse(localStorage.getItem("tasks"))
|| [];


function showTask(){


let list=
document.getElementById("taskList");


list.innerHTML="";


tasks.forEach((task,index)=>{


list.innerHTML += `

<li>

<input type="checkbox"
onclick="doneTask(${index})"
${task.done?"checked":""}>


${task.text}


<button onclick="deleteTask(${index})">
X
</button>


</li>


`;


})


}


showTask();




function addTask(){


let input=
document.getElementById("taskInput");


let value=input.value;



if(value=="")
return;



let duplicate =
tasks.find(
t=>t.text==value
);



if(duplicate){

alert("Task sudah ada");

return;

}




tasks.push({

text:value,
done:false

});


save();


input.value="";


}




function deleteTask(i){

tasks.splice(i,1);

save();

}




function doneTask(i){

tasks[i].done =
!tasks[i].done;

save();

}




function save(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);


showTask();

}




// DARK MODE


function darkMode(){

document.body.classList.toggle("dark");


}