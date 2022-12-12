const fooiInput = document.querySelector(".fooiInput");

const addMember = document.querySelector(".addMember");

const clearAll = document.querySelector(".clearAll");

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
  let totaleFooi = fooiInput.valueAsNumber;
  let fooiPerUur = 0;

  members.forEach(member => {
    names.push(member.querySelector(".naamInput").value);
    const d = member.querySelector(".urenInput").valueAsDate;
    const us = d.getHours()-1;
    const ms = d.getMinutes();
    const u = us+(ms/60);
    uren.push(u);
  });

  uren.forEach(i =>{
    totaleUren +=i;
  });

  fooiPerUur = totaleFooi/totaleUren;
  console.log(`totale uren: ${totaleUren} totale fooi: ${totaleFooi}`);
  console.log(`fooi per uur = ${fooiPerUur}`);

  for(let i = 0; i<names.length;i++){
    let f = uren[i] * fooiPerUur;
    fooi.push(f);
    console.log(`${names[i]} heeft ${uren[i]} gewerk en verdient ${f} euro`);
  }
})