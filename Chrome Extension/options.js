
/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/

window.addEventListener('load', function() {
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
  options.file.value = localStorage.file;


  options.isActivated.onchange = function() {
    localStorage.isActivated = options.isActivated.checked;
  };

  options.file.onchange = function() {
    localStorage.file = options.file.value;
  };
});