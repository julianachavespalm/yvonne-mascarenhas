function increaseFont() {
    var mainElement = document.getElementById('content');
    var mainStyle = window.getComputedStyle(mainElement);
    var currentFontSize = parseInt(mainStyle.fontSize);
  
    if (currentFontSize < 30) {
        var newSize = currentFontSize + 2;
        mainElement.style.fontSize = newSize + "px";
    }
  }
  
    const highContrastToggle = document.getElementById('highContrastToggle');
    const body = document.body;
  

highContrastToggle.addEventListener('click', function() {
    body.classList.toggle('high-contrast-theme');
  });
  
function decreaseFont() {
    var mainElement = document.getElementById("content");
    var mainStyle = window.getComputedStyle(mainElement);
    var currentFontSize = parseInt(mainStyle.fontSize);
  
    if (currentFontSize > 12) {
        var newSize = currentFontSize - 2;
        mainElement.style.fontSize = newSize + "px";
    }
  }
  
document.getElementById('increaseFont').addEventListener('click', function () {
    increaseFont();
  });
  
document.getElementById('decreaseFont').addEventListener('click', function () {
    decreaseFont();
  });
  
  
function resetAccessibility() {
    var mainElement = document.getElementById("content");
    mainElement.style.fontSize = '16px';
  
    body.classList.remove("high-contrast-theme");
  }
  
document.getElementById('reset').addEventListener("click", resetAccessibility);



const accessibilityToggle = document.getElementById('accessibilities-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const accessibilityDropdown = document.querySelector('.banner__acessibilities-dropdown');
  const menuDropdown = document.querySelector('.banner__menu-dropdown');

  accessibilityToggle.addEventListener('change', function() {
    if (this.checked) {
      menuToggle.checked = false;
    }
  });

  menuToggle.addEventListener('change', function() {
    if (this.checked) {
      accessibilityToggle.checked = false;
    }
  });


    
// Função para fechar dropdown ao clicar fora
document.addEventListener('click', function(event) {
  const awards = document.querySelectorAll('.content__award-toggle');
  const awardDropdowns = document.querySelectorAll('.content__award-text');

  if (!event.target.closest('.content__award')) {
    awards.forEach(award => (award.checked = false));
    awardDropdowns.forEach(dropdown => (dropdown.style.maxHeight = 0));
  }
});

// Função para permitir seleção única de prêmios
const awardToggles = document.querySelectorAll('.content__award-toggle');
awardToggles.forEach(toggle => {
  toggle.addEventListener('click', function() {
    const clickedCheckbox = this;
    const allCheckboxes = document.querySelectorAll('.content__award-toggle');

    allCheckboxes.forEach(checkbox => {
      if (checkbox !== clickedCheckbox) {
        checkbox.checked = false;
      }
    });

    const clickedDropdown = this.nextElementSibling;
    if (clickedCheckbox.checked) {
      clickedDropdown.style.maxHeight = '25rem'; // Ou a altura desejada
    } else {
      clickedDropdown.style.maxHeight = 0;
    }
  });
});

  