(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
 // Show rules when no country is selected
  if (!id) {
    document.querySelector("#movie-title").innerText = "How to Play";
    document.querySelector(
      "#movie-description"
    ).innerText =
      "1) Click 'Play Now' to start to guess.\n" +
      "2) Each click reveals one new clue.\n" +
      "3) After 3 clues, click 'Reveal Answer' to see the country.\n" +
      "4) Use the cards on the homepage to browse countries if you want.\n"+
      "5) The less clues you use, the higher your score!"
      "\n\n6)Good luck and have fun playing!";
    document.querySelector("#release-date").innerText = "";
    document.querySelector("#genres").innerHTML = "";

    const playBtn = document.querySelector("#watch-now-btn");
    playBtn.href = "./index.html";
    playBtn.querySelector("span").innerText = "Back to Home";

    document.querySelector(".casts-container").style.display = "none";
    document.querySelector("#similar").innerHTML = "";
    document.querySelector(".background-img").style.backgroundImage = `url(./assets/2.png)`;
    document.querySelector(".backdrop").classList.add("backdrop-hidden");
  }

  const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}?fields=name,capital,currencies,flags,cca3,borders,region,subregion,population`);// Fetch country data by code //id theo field
  const country = (await response.json())[0];

  if (!country) {
    // Handle not found
    return;
  }

  document.querySelector("#preview-img").src = country.flags.png; //
  document.querySelector("#movie-title").innerText = country.name.common;
  document.querySelector("#movie-description").innerText = `Capital: ${country.capital ? country.capital[0] : 'N/A'}\nRegion: ${country.region}\nSubregion: ${country.subregion}\nPopulation: ${country.population.toLocaleString()}\nCurrencies: ${country.currencies ? Object.keys(country.currencies).join(', ') : 'N/A'}`;
  document.querySelector("#release-date").innerText = `Country Code: ${country.cca3}`;// 
  document.querySelector("#genres").innerHTML = `<span>Region: ${country.region}</span>`; //

  // For casts, perhaps bordering countries
  if (country.borders) {
    const bordersResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}&fields=name,flags,cca3`);
    const borders = await bordersResponse.json();
    document.querySelector(".casts-grid").innerHTML = borders.map(border => `
      <a href="./info.html?id=${border.cca3}" class="cast-card">
        <img src="${border.flags.png}" alt="${border.name.common}" />
        <p>${border.name.common}</p>
      </a>
    `).join('');
  }

  // For similar, perhaps countries in same region
  const similarResponse = await fetch(`https://restcountries.com/v3.1/region/${country.region}?fields=name,flags,cca3`);
  const similar = (await similarResponse.json()).filter(c => c.cca3 !== country.cca3).slice(0, 10);
  document.querySelector("#similar").innerHTML = `
    <h1>Similar Countries</h1>
    <div class="swiper similar-swiper">
      <div class="swiper-wrapper">
        ${similar.map(item => `
          <a href="./info.html?id=${item.cca3}" class="swiper-slide">
            <div class="movie-card">
              <img src="${item.flags.png}" alt="${item.name.common}" />
              <p>${item.name.common}</p>
            </div>
          </a>
        `).join('')}
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  `;

  new Swiper('.similar-swiper', {
    spaceBetween: 30,
    slidesPerView: "auto",
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
  });

  document.querySelector("#watch-now-btn").href = `./watch.html?id=${country.cca3}`;

  document.querySelector(".backdrop").classList.add("backdrop-hidden");
})();