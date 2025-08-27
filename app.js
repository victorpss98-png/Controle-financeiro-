let financeData = JSON.parse(localStorage.getItem('finance')||'[]');
let runsData = JSON.parse(localStorage.getItem('runs')||'[]');

function openTab(tab){
  document.querySelectorAll('.tab').forEach(el=>el.style.display='none');
  document.getElementById(tab).style.display='block';
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('.tabs button[onclick="openTab(\''+tab+'\')"]').classList.add('active');
}

function renderFinance(){
  const tbody=document.getElementById('f_tbody');
  tbody.innerHTML='';
  financeData.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.date}</td><td>${r.type}</td><td>${r.category}</td><td>${r.amount.toFixed(2)}</td><td><button onclick="delFinance(${i})">X</button></td>`;
    tbody.appendChild(tr);
  });
  localStorage.setItem('finance',JSON.stringify(financeData));
  renderFinanceChart();
}
function delFinance(i){financeData.splice(i,1);renderFinance();}
document.getElementById('f_add').onclick=()=>{
  financeData.push({date:f_date.value,type:f_type.value,category:f_category.value,amount:parseFloat(f_amount.value||0)});
  renderFinance();
};
document.getElementById('f_clear_all').onclick=()=>{if(confirm('Limpar todos?')){financeData=[];renderFinance();}};

document.getElementById('backupFinance').onclick=()=>{
  const blob=new Blob([JSON.stringify(financeData)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='finance.json';a.click();
};
document.getElementById('restoreFinance').onclick=()=>restoreFinanceFile.click();
restoreFinanceFile.onchange=e=>{const r=new FileReader();r.onload=()=>{financeData=JSON.parse(r.result);renderFinance();};r.readAsText(e.target.files[0]);};

// Corridas
document.getElementById('r_add').onclick=()=>{
  runsData.push({date:r_date.value,category:r_category.value,amount:parseFloat(r_amount.value||0)});
  renderRuns();
};
document.getElementById('r_clear_all').onclick=()=>{if(confirm('Limpar corridas?')){runsData=[];renderRuns();}};
function renderRuns(){
  const tbody=document.getElementById('r_tbody');tbody.innerHTML='';
  runsData.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.date}</td><td>${r.category}</td><td>${r.amount.toFixed(2)}</td><td><button onclick="delRun(${i})">X</button></td>`;
    tbody.appendChild(tr);
  });
  localStorage.setItem('runs',JSON.stringify(runsData));
  renderRunsChart();
}
function delRun(i){runsData.splice(i,1);renderRuns();}

document.getElementById('backupRuns').onclick=()=>{
  const blob=new Blob([JSON.stringify(runsData)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='runs.json';a.click();
};
document.getElementById('restoreRuns').onclick=()=>restoreRunsFile.click();
restoreRunsFile.onchange=e=>{const r=new FileReader();r.onload=()=>{runsData=JSON.parse(r.result);renderRuns();};r.readAsText(e.target.files[0]);};

// Gráficos
let f_chart, r_chart;
function renderFinanceChart(){
  const ctx=document.getElementById('f_pie').getContext('2d');
  const totals={};financeData.forEach(r=>{totals[r.category]=(totals[r.category]||0)+r.amount;});
  if(f_chart) f_chart.destroy();
  f_chart=new Chart(ctx,{type:'pie',data:{labels:Object.keys(totals),datasets:[{data:Object.values(totals)}]}});
}
function renderRunsChart(){
  const ctx=document.getElementById('r_pie').getContext('2d');
  const totals={};runsData.forEach(r=>{totals[r.category]=(totals[r.category]||0)+r.amount;});
  if(r_chart) r_chart.destroy();
  r_chart=new Chart(ctx,{type:'pie',data:{labels:Object.keys(totals),datasets:[{data:Object.values(totals)}]}});
}

renderFinance();renderRuns();
