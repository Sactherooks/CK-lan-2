// Phần này là một hàm bất đồng bộ tự thực thi, dùng để tải dữ liệu và thiết lập trang chủ
(async () => {
  // Định nghĩa các tuyến đường API cho các khu vực khác nhau
  const Routes = {
    "All Countries": { url: "/all" },
    "Asia": { url: "/region/Asia" },
    "Europe": { url: "/region/Europe" },
    "Americas": { url: "/region/Americas" },
    "Africa": { url: "/region/Africa" },
    "Oceania": { url: "/region/Oceania" },
  };

  // Gửi yêu cầu API đồng thời cho tất cả các tuyến đường và chờ kết quả
  const promises = await Promise.all(
    Object.keys(Routes).map(
      async (item) =>
        await (
          await fetch(
            `https://restcountries.com/v3.1${Routes[item].url}?fields=name,capital,currencies,flags,cca3`
          )
        ).json()
    )
  );

  // Chuyển đổi mảng promises thành một đối tượng dữ liệu với khóa là tên khu vực
  const data = promises.reduce((final, current, index) => {
    final[Object.keys(Routes)[index]] = current;
    return final;
  }, {});

  // Lấy danh sách tất cả quốc gia để chọn quốc gia xu hướng
  const trending = data["All Countries"];

  // Chọn một quốc gia xu hướng dựa trên ngày hiện tại
  const main = trending[new Date().getDate() % trending.length];

  // Thiết lập hình ảnh chính và hình ảnh xem trước cho phần hero
  document.querySelector(
    "#hero-image"
  ).src = `./assets/2.png`;
  document.querySelector(
    "#hero-preview-image"
  ).src = ""; 
  document.querySelector("#hero-title").innerText = "Guess the Country!";
  document.querySelector("#hero-description").innerText = "Can you identify this mystery country from clues?";
  document.querySelector("#watch-now-btn").href = `./watch.html?id=${main.cca3}`;
  document.querySelector("#view-info-btn").href = `./info.html`;

  // Tạo các phần HTML cho mỗi khu vực với swiper carousel
  Object.keys(data).map((key, index) => {
    document.querySelector("main").innerHTML += /*html*/ `
    <div class="section">
      <h2>${key}</h2>

      <div class="swiper-${index} swiper">
        <div class="swiper-wrapper">
          ${data[key]
            .map(
              (item) => /*html*/ `
          <a href="./info.html?id=${
            item.cca3
          }" class="swiper-slide" style="width: 200px !important">
            <div class="movie-card">
              <img
                class="fade-in"
                onload="this.style.opacity = '1'"
                src="${item.flags.png}"
                alt=""
              />
              <p class="multiline-ellipsis-2">
                ${item.name.common}
              </p>
            </div>
          </a>
        `
            )
            .join("\n")} 
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
    `;
  });

  // Ẩn nền sau khi tải xong
  document.querySelector(".backdrop").classList.add("backdrop-hidden");

  // Khởi tạo các swiper carousel cho mỗi khu vực
  Object.keys(data).map((key, index) => {
    new Swiper(`.swiper-${index}`, {
      spaceBetween: 30,
      autoplay: { delay: 5000, disableOnInteraction: true },
      slidesPerView: "auto",
      loop: true,
      slidesPerGroupAuto: true,
      navigation: {
        prevEl: `.swiper-button-prev`,
        nextEl: `.swiper-button-next`,
      },
    });
  });
})();
