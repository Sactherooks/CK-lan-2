(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    document.querySelector("#movie-description").innerText = "No country selected.";
    document.querySelector(".backdrop").classList.add("backdrop-hidden");
    return;
  }

  const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}?fields=name,capital,region,subregion,population,currencies,flags,cca3`);
  const country = (await response.json())[0];

  if (!country) {
    document.querySelector("#movie-description").innerText = "Country not found."; // Handle not found
    document.querySelector(".backdrop").classList.add("backdrop-hidden");
    return;
  }

  // Prepare clues
  const clues = [
    `This country is in the ${country.region} region.`,
    `The capital city is ${country.capital ? country.capital[0] : 'N/A'}.`,
    `The population is approximately ${country.population.toLocaleString()}.`
  ];

  let currentClue = 0;

  // Set up the game UI
  document.querySelector("#movie-title").innerText = "Guess the Country!";
  document.querySelector("#movie-description").innerText = "Click 'Reveal Clue' to start.";

  // Add reveal button
  const revealBtn = document.createElement("button");
  revealBtn.className = "btn";
  revealBtn.innerText = "Reveal Clue 1";
  revealBtn.onclick = () => {
    if (currentClue < clues.length) {
      document.querySelector("#movie-description").innerText = clues[currentClue];
      currentClue++;
      if (currentClue < clues.length) {
        revealBtn.innerText = `Reveal Clue ${currentClue + 1}`;
      } else {
        revealBtn.innerText = "Reveal Answer";
        revealBtn.onclick = () => {
          document.querySelector("#movie-title").innerText = country.name.common;
          document.querySelector("#movie-description").innerText = `Flag: `;
          const flagImg = document.createElement("img");
          flagImg.src = country.flags.png;
          flagImg.style.width = "100px";
          document.querySelector("#movie-description").appendChild(flagImg);
          revealBtn.style.display = "none";
        };
      }
    }
  };

  document.querySelector(".movie-info").appendChild(revealBtn);

  document.querySelector(".backdrop").classList.add("backdrop-hidden");
})();