const mainContainer = document.querySelector(".mainContainer");
const resultsContainer = document.querySelector(".resultsContainer");

const fooiInput = document.querySelector(".fooiInput");

const addMember = document.querySelector(".addMember"); //button to add a member
const clearAll = document.querySelector(".clearAll");   //button to delete all data
const back = document.querySelector(".backButton");     //button to go back to to the calculator from the results

const membersContainer = document.querySelector(".membersContainer"); //containers for all members
const exampleMember = document.querySelector(".exampleMember"); //example member wich wont be visible and is only used to make new members

const firstMember = cloneMemberFromExample();

const members = membersContainer.children;

const calculate = document.querySelector(".calculate");

function cloneMemberFromExample(){
  let newMember = exampleMember.cloneNode(true);
  newMember.classList.remove("exampleMember");
  newMember.classList.add("memberStyle");
  newMember.style.display = "flex";
  membersContainer.append(newMember);
  return newMember;
}

addMember.addEventListener("click", ()=>{
  const nextMember = cloneMemberFromExample();
});

clearAll.addEventListener("click", ()=>{
  membersContainer.innerHTML ="";
  const firstMember = cloneMemberFromExample();
  fooiInput.value = "";
});

membersContainer.addEventListener("click", ()=>{
  for(let i =0;i<membersContainer.children.length;i++){
    const member = membersContainer.children[i];
    calculateUren(member);
    removeMember(member);
  }
})

function calculateUren(member){
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
    uren.value = `${hours}:${minutes}`;
  }
}

function removeMember(member){
  const deleteButton = member.querySelector(".delete");
  deleteButton.addEventListener('click', ()=>{
    console.log(member);
    member.remove();
  })
}

calculate.addEventListener("click", ()=>{
  let names = [];
  let uren = [];
  let totaleUren = 0;
  let fooi = [];
  let totaleFooi;
  let fooiPerUur = 0;

  let acces = true;
  
  //checks if the totale fooi has been filled in     if not then the fooi input will be colored red
  if(fooiInput.value === ""){
    acces = false;
    fooiInput.style.backgroundColor = "red";
  }else{
    fooiInput.style.backgroundColor = "rgb(241, 218, 141)";
    totaleFooi = fooiInput.valueAsNumber;
  }

  for(let i =0;i<membersContainer.children.length;i++){ // get data from each member
    const member = membersContainer.children[i];

    //check if the name has been filled in    if not then color the naam input red
    const naamInput = member.querySelector(".naamInput");
    if(naamInput.value === ""){ 
      naamInput.style.backgroundColor = "red";
      acces = false;
    }else{
      naamInput.style.backgroundColor = "rgb(144, 175, 204)";

      names.push(naamInput.value);
    }

    // checks if the uren has been filled in    if not then color the uren input red
    const urenInput = member.querySelector(".urenInput")
    const urenDate = urenInput.valueAsDate;
    if(urenDate === null){
      urenInput.style.backgroundColor = "red";
      acces = false;
    }else{
      urenInput.style.backgroundColor = "rgb(144, 175, 204)";
      const onlyHours = urenDate.getHours()-1;
      const onlyMinutes = urenDate.getMinutes();
      const allHours = onlyHours+(onlyMinutes/60);
      uren.push(allHours);
    }
  }

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
  change = Math.round(change*100)/100;
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
    newText.querySelector(".fooiHere").innerHTML = `&euro;${fooi[i]} `;

    results.appendChild(newText);
  }
}

back.addEventListener('click', ()=>{
  const results = resultsContainer.querySelector(".results");
  const example = results.querySelector(".example");
  results.innerHTML = "";
  results.append(example);
  resultsContainer.style.display = "none";
  mainContainer.style.display = "flex";
})

