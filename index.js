const mainContainer = document.querySelector(".mainContainer");
const resultsContainer = document.querySelector(".resultsContainer");

const fooiInput = document.querySelector(".fooiInput");

const addMember = document.querySelector(".addMember");
const clearAll = document.querySelector(".clearAll");
const back = document.querySelector(".backButton");

const membersContainer = document.querySelector(".members");
const firstMember = document.getElementById("member1");
const members = [firstMember];

const calculate = document.querySelector(".calculate");

addMember.addEventListener("click", ()=>{
  const nextMember = firstMember.cloneNode(true);
  nextMember.id = `member${members.length+1}`;
  
  nextMember.querySelector(".naamInput").value = "";
  nextMember.querySelector(".startInput").value = "";
  nextMember.querySelector(".stopInput").value = "";
  nextMember.querySelector(".pauzeInput").checked =false;
  nextMember.querySelector(".urenInput").value = "";
  membersContainer.insertBefore(nextMember, document.querySelector(".bottom"));
  members.push(nextMember);
});

clearAll.addEventListener("click", ()=>{
  for(let i = members.length-1;i>0;i--){
    membersContainer.removeChild(members[i]);
    members.pop();
  }
  fooiInput.value = "";
  firstMember.querySelector(".naamInput").value = "";
  firstMember.querySelector(".startInput").value = "";
  firstMember.querySelector(".stopInput").value = "";
  firstMember.querySelector(".pauzeInput").checked =false;
  firstMember.querySelector(".urenInput").value = "";
});

membersContainer.addEventListener("click", ()=>{
  members.forEach(member =>{
    const startTime = member.querySelector(".startInput").valueAsDate;
    const stopTime = member.querySelector(".stopInput").valueAsDate;
    const pauze = member.querySelector(".pauzeInput");
    const uren = member.querySelector(".urenInput");
    if(startTime != null && stopTime != null){
      const startHour = startTime.getHours() -1;
      const startMinute = startTime.getMinutes();
      const stopHour = stopTime.getHours()-1;
      const stopMinute = stopTime.getMinutes();
      const difHours = stopHour-startHour;
      const difMinutes = stopMinute - startMinute;
      let allMinutes = difHours*60 + difMinutes;
      if(pauze.checked){
        allMinutes -= 30;
      }
      let hours = Math.floor(allMinutes/60);
      let minutes = allMinutes-hours*60;
      if(hours<10){
        hours = `0${hours}`;
      }
      if(minutes<10){
        minutes = `0${minutes}`;
      }
      console.log(hours+":"+minutes);
      uren.value = `${hours}:${minutes}`;
    }
  })
})

calculate.addEventListener("click", ()=>{
  let names = [];
  let uren = [];
  let totaleUren = 0;
  let fooi = [];
  let totaleFooi;
  let fooiPerUur = 0;

  let acces = true;
  
  if(fooiInput.value === ""){
    acces = false;
    fooiInput.style.backgroundColor = "red";
  }else{
    fooiInput.style.backgroundColor = "rgb(241, 218, 141)";
    totaleFooi = fooiInput.valueAsNumber;
  }

  members.forEach(member => { // get data from each member
    const currMember = membersContainer.querySelector(`#${member.id}`);
    currNaam = member.querySelector(".naamInput").value;
    if(currNaam === ""){
      const m = currMember.querySelector(".naamInput");
      m.style.backgroundColor = "red";
      acces = false;
    }else{
      const m = currMember.querySelector(".naamInput");
      m.style.backgroundColor = "rgb(144, 175, 204)";

      names.push(currNaam);
    }

    const d = member.querySelector(".urenInput").valueAsDate;
    if(d === null){
      const ureninperror = currMember.querySelector(".urenInput");
      ureninperror.style.backgroundColor = "red";
      acces = false;
    }else{
      const ureninperror = currMember.querySelector(".urenInput");
      ureninperror.style.backgroundColor = "rgb(144, 175, 204)";
      const us = d.getHours()-1;
      const ms = d.getMinutes();
      const u = us+(ms/60);
      uren.push(u);
    }
  });

  if(acces){ // checks for acces
    uren.forEach(i =>{ // counts up all the hours
      totaleUren +=i;
    });

    fooiPerUur = totaleFooi/totaleUren; // calculates the fooi per hour
  
    fooi = calculateFooi(uren, fooiPerUur);

    moveToResults(names, uren, fooi);
  }
})

function calculateFooi(uren, fooiPerUur){
  const innerFooi = [];
  let change = 0;
  for(let i = 0; i<uren.length;i++){ // gives each member its equivelant fooi
    let f = uren[i] * fooiPerUur;
    f = Math.floor(f*20)/20;
    innerFooi.push(f);
    change += (uren[i]*fooiPerUur)-f;
  }
  console.log(change);
  change = Math.round(change*100)/100;
  console.log(change);
  return innerFooi;
}

function moveToResults(names, uren, fooi){
  mainContainer.style.display = "none"; // switch from the calculator to the results
  resultsContainer.style.display = "flex";

  const results = resultsContainer.querySelector(".results");
  const example = results.querySelector(".example");
  for(let i = 0; i<names.length;i++){
    const newText = example.cloneNode(true); //clone the example
    newText.classList.remove("example"); //change the class name of the example
    newText.classList.add("resultsText");
    newText.id = `${i}`;

    newText.querySelector(".naamHere").innerHTML = `${names[i]} `;
    newText.querySelector(".urenHere").innerHTML = `${Math.floor(uren[i]*100)/100} `;
    newText.querySelector(".fooiHere").innerHTML = `${fooi[i]} `;

    results.appendChild(newText);
  }
}

back.addEventListener('click', ()=>{
  const results = resultsContainer.querySelector(".results");
  const example = results.querySelector(".example");
  console.log(results.children);
  results.innerHTML = "";
  results.append(example);
  console.log(results.children);
  resultsContainer.style.display = "none";
  mainContainer.style.display = "flex";
})

