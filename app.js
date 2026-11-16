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

// Galería de proyectos: miniaturas + imagen/video grande (sin carrusel automático)
function initGallery(gallery){
  var stage = gallery.querySelector('.gallery-stage');
  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.g-thumb'));
  var count = gallery.querySelector('.g-count');
  var current = 0;

  if(thumbs.length <= 1) gallery.classList.add('single');

  function show(i){
    current = (i + thumbs.length) % thumbs.length;
    thumbs.forEach(function(t, k){ t.classList.toggle('active', k === current); });

    var old = stage.querySelector('.stage-media');
    if(old) old.remove();

    var t = thumbs[current];
    var el;
    if(t.dataset.type === 'video'){
      el = document.createElement('video');
      el.controls = true;
      el.preload = 'metadata';
      el.setAttribute('playsinline', '');
      el.src = t.dataset.src + '#t=0.5';
    } else {
      el = document.createElement('img');
      el.src = t.dataset.src;
      el.alt = t.dataset.alt || '';
    }
    el.className = 'stage-media';
    stage.insertBefore(el, stage.firstChild);
    count.textContent = (current + 1) + ' / ' + thumbs.length;
  }

  thumbs.forEach(function(t, k){ t.addEventListener('click', function(){ show(k); }); });
  gallery.querySelector('.g-prev').addEventListener('click', function(){ show(current - 1); });
  gallery.querySelector('.g-next').addEventListener('click', function(){ show(current + 1); });

  gallery.step = function(d){ show(current + d); };
  show(0);
}
document.querySelectorAll('.gallery').forEach(initGallery);

// Flechas del teclado dentro del modal abierto
document.addEventListener('keydown', function(evt){
  if(evt.key !== 'ArrowLeft' && evt.key !== 'ArrowRight') return;
  var g = document.querySelector('.modal-overlay.open .gallery');
  if(g && g.step) g.step(evt.key === 'ArrowLeft' ? -1 : 1);
});

// Tarjetas de proyecto: abrir también con Enter o Espacio
document.querySelectorAll('.project-card').forEach(function(card){
  card.addEventListener('keydown', function(evt){
    if(evt.key === 'Enter' || evt.key === ' '){
      evt.preventDefault();
      card.click();
    }
  });
});