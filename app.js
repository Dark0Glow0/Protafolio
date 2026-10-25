function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id){
  document.getElementById(id).querySelectorAll('video').forEach(function(v){ v.pause(); });
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function closeOnBackdrop(evt, id){
  if(evt.target.id === id) closeModal(id);
}
document.addEventListener('keydown', function(evt){
  if(evt.key === 'Escape'){
    document.querySelectorAll('.modal-overlay.open').forEach(function(m){
      closeModal(m.id);
    });
  }
});

// Skills: clic para ver la barra de nivel
function levelLabel(n){
  if(n < 40) return 'Básico';
  if(n < 70) return 'Intermedio';
  if(n < 90) return 'Avanzado';
  return 'Experto';
}
document.querySelectorAll('.skill-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var group = btn.closest('.skill-group');
    var meter = group.querySelector('.skill-meter');
    var wasActive = btn.classList.contains('active');

    group.querySelectorAll('.skill-btn').forEach(function(b){ b.classList.remove('active'); });

    if(wasActive){
      meter.classList.remove('open');
      meter.innerHTML = '';
      return;
    }

    var level = parseInt(btn.dataset.level, 10) || 0;
    btn.classList.add('active');
    meter.innerHTML =
      '<div class="meter-top"><span class="meter-name">' + btn.textContent + '</span>' +
      '<span class="meter-level">' + levelLabel(level) + ' · ' + level + '%</span></div>' +
      '<div class="meter-track"><div class="meter-fill"></div></div>' +
      '<div class="meter-scale"><span>básico</span><span>experto</span></div>';
    meter.classList.add('open');
    var fill = meter.querySelector('.meter-fill');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ fill.style.width = level + '%'; });
    });
  });
});
