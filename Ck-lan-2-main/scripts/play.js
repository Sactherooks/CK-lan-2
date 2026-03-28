// Phần này là một hàm bất đồng bộ tự thực thi, dùng để khởi tạo trò chơi đoán quốc gia
(async () => {
  // Lấy tham số 'id' từ URL để xác định quốc gia cần đoán
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // Nếu không có 'id', hiển thị thông báo lỗi và ẩn nền
  if (!id) {
    document.querySelector("#movie-description").innerText = "No country selected.";
    document.querySelector(".backdrop").classList.add("backdrop-hidden");
    return;
  }

  // Gửi yêu cầu API để lấy thông tin quốc gia dựa trên mã 'id'
  const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}?fields=name,capital,region,subregion,population,currencies,flags,cca3`);
  const country = (await response.json())[0];

  // Nếu không tìm thấy quốc gia, hiển thị thông báo lỗi và ẩn nền
  if (!country) {
    document.querySelector("#movie-description").innerText = "Country not found.";
    document.querySelector(".backdrop").classList.add("backdrop-hidden");
    return;
  }

  // Chuẩn bị danh sách gợi ý (clues) dựa trên thông tin quốc gia
  const clues = [
    `This country is in the ${country.region} region.`,
    `The capital city is ${country.capital ? country.capital[0] : 'N/A'}.`,
    `The population is approximately ${country.population.toLocaleString()}.`,
    `The subregion is ${country.subregion}.`,
    `The currency is ${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}.`
  ];

  // Khởi tạo biến cho gợi ý hiện tại và điểm số
  let currentClue = 0;
  let score = 100; // Bắt đầu với 100 điểm

  // Thiết lập giao diện người dùng ban đầu cho trò chơi
  document.querySelector("#movie-title").innerText = "Guess the Country!";
  document.querySelector("#movie-description").innerText = "Click 'Reveal Clue' to start. You have 100 points. Each clue costs 20 points.";

  // Tạo nút để tiết lộ gợi ý
  const revealBtn = document.createElement("button");
  revealBtn.className = "btn";
  revealBtn.innerText = "Reveal Clue 1";
  revealBtn.onclick = () => {
    // Nếu còn gợi ý, hiển thị gợi ý hiện tại và giảm điểm
    if (currentClue < clues.length) {
      document.querySelector("#movie-description").innerText = clues[currentClue];
      currentClue++;
      score -= 20;
      if (currentClue < clues.length) {
        revealBtn.innerText = `Reveal Clue ${currentClue + 1}`;
      } else {
        // Nếu hết gợi ý, thay đổi nút để cho phép đoán
        revealBtn.innerText = "Guess Now";
        revealBtn.onclick = showGuessInput;
      }
    }
  };

  // Hàm hiển thị ô nhập liệu để người dùng đoán quốc gia
  function showGuessInput() {
    document.querySelector("#movie-description").innerText += "\n\nEnter your guess:";
    const guessInput = document.createElement("input");
    guessInput.type = "text";
    guessInput.placeholder = "Country name";
    guessInput.style.marginTop = "10px";
    guessInput.style.padding = "5px";
    document.querySelector(".movie-info").appendChild(guessInput);

    // Tạo nút để gửi đoán
    const guessBtn = document.createElement("button");
    guessBtn.className = "btn";
    guessBtn.innerText = "Submit Guess";
    guessBtn.style.marginTop = "10px";
    guessBtn.onclick = () => {
      // Lấy giá trị đoán và so sánh với tên quốc gia chính xác
      const guess = guessInput.value.trim().toLowerCase();
      const correct = country.name.common.toLowerCase();
      if (guess === correct) {
        // Nếu đoán đúng, hiển thị thông báo thắng và cờ quốc gia
        document.querySelector("#movie-title").innerText = `Correct! You scored ${score} points.`;
        document.querySelector("#movie-description").innerText = `It's ${country.name.common}!`;
        const flagImg = document.createElement("img");
        flagImg.src = country.flags.png;
        flagImg.style.width = "100px";
        document.querySelector("#movie-description").appendChild(flagImg);
        revealBtn.style.display = "none";
        guessInput.style.display = "none";
        guessBtn.style.display = "none";
      } else {
        // Nếu đoán sai, hiển thị thông báo thua và cờ quốc gia
        document.querySelector("#movie-title").innerText = `Wrong! The answer is ${country.name.common}.`;
        document.querySelector("#movie-description").innerText = `You scored 0 points.`;
        const flagImg = document.createElement("img");
        flagImg.src = country.flags.png;
        flagImg.style.width = "100px";
        document.querySelector("#movie-description").appendChild(flagImg);
        revealBtn.style.display = "none";
        guessInput.style.display = "none";
        guessBtn.style.display = "none";
      }
    };
    document.querySelector(".movie-info").appendChild(guessBtn);
  }

  // Thêm nút tiết lộ vào giao diện
  document.querySelector(".movie-info").appendChild(revealBtn);

  // Ẩn nền sau khi thiết lập xong
  document.querySelector(".backdrop").classList.add("backdrop-hidden");
})();