function campground_filter() {
  let inputValue = document.getElementById("searchBar").value;
  inputValue = inputValue.toLowerCase();
  let selectCampground = document.getElementsByClassName("card-title");
  let notShowCampground = document.getElementsByClassName("searchShowCard");

  for (let i = 0; i < selectCampground.length; i++) {
    if (!selectCampground[i].innerHTML.toLowerCase().includes(inputValue)) {
      notShowCampground[i].style.display = "none";
    } else {
      notShowCampground[i].style.display = "inline-block";
    }
  }
}
