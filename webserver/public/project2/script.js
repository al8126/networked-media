window.onload = () => {
  console.log("page has loaded");

  let newSpan = document.createElement("span");
  newSpan.classList.add("alpha");
  newSpan.innerHTML = "loading...";
  document.body.appendChild(newSpan);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const words = ["broth", "pasta", "stock", "spoon", "gumbo"];
  const links = {
    "broth": "broth.html",
    "pasta": "pasta.html",
    "stock": "stock.html",
    "spoon": "spoon.html",
    "gumbo": "gumbo.html"
  };

  function randomLetter() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  let s2 = randomLetter();
  let s1 = randomLetter();
  let m2 = randomLetter();
  let m1 = randomLetter();
  let h1 = randomLetter();

  let showingWord = false;
  let activeWord = null;
  let lastWordHour = -1; 

  let oneSpan = document.getElementsByClassName("alpha");

  oneSpan[0].addEventListener("click", () => {
    console.log("clicked");
    if (showingWord && activeWord) {
      window.location.href = links[activeWord];
    }
  });

  setInterval(() => {
    let date = new Date();
    let hours   = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hours % 2 === 0 && minutes === 0 && seconds === 0 && hours !== lastWordHour) {
      lastWordHour = hours;
      activeWord = words[Math.floor(Math.random() * words.length)];
      h1 = activeWord[0].toUpperCase();
      m1 = activeWord[1].toUpperCase();
      m2 = activeWord[2].toUpperCase();
      s1 = activeWord[3].toUpperCase();
      s2 = activeWord[4].toUpperCase();
      showingWord = true;
      oneSpan[0].style.cursor = "pointer";
      
    } else if (showingWord && seconds === 1) {
      h1 = randomLetter();
      m1 = randomLetter();
      m2 = randomLetter();
      s1 = randomLetter();
      s2 = randomLetter();
      showingWord = false;
      activeWord = null;
      oneSpan[0].style.cursor = "default";
    } else if (!showingWord) {
      s2 = randomLetter();
      if (seconds % 10 === 0)  s1 = randomLetter();
      if (seconds === 0)       m2 = randomLetter();
      if (minutes % 10 === 0 && seconds === 0) m1 = randomLetter();
      if (minutes === 0 && seconds === 0)      h1 = randomLetter();
    }

    oneSpan[0].innerHTML = h1 + ":" + m1+m2 + ":" + s1+s2;
  }, 1000);
};
