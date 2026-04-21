
let phases = [];
let current = 0;
let seconds = 0;
let interval;

function startInterview(){
  phases = [
    { name:'Présentation entreprise', time: +tCompany.value },
    { name:'Présentation candidat', time: +tCandidate.value },
    { name:'Questions', time: +tQuestions.value }
  ];
  current = 0;
  launchPhase();
}

function launchPhase(){
  if(current >= phases.length){
    stage.innerText = 'Entretien terminé';
    return;
  }
  stage.innerText = phases[current].name;
  seconds = phases[current].time;
  update();
  interval = setInterval(tick,1000);
}

function tick(){
  seconds--;
  update();
  if(seconds<=0){
    clearInterval(interval);
    current++;
    launchPhase();
  }
}

function update(){
  timer.innerText = '00:' + String(seconds).padStart(2,'0');
}
