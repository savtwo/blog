$(document).ready(function() {
  init()

  function init() {
    getYear();
  }

  function getYear() {
    let date = new Date();
    let year = date.getFullYear();

    console.log('year', year);
    document.getElementById('getYear').innerHTML = year;
  }
});