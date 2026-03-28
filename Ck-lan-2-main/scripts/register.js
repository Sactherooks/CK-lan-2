// Phần này kiểm tra nếu đã đăng nhập, chuyển hướng về trang chủ
if (localStorage.getItem("currentUser")) {
  location.href = "./index.html";
}

// Lấy form đăng ký và thêm sự kiện submit
let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  // Ngăn chặn hành vi mặc định của form
  e.preventDefault();

  // Lấy giá trị từ các trường nhập liệu
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  // Định nghĩa các biểu thức chính quy để kiểm tra mật khẩu
  let lowerCaseLetter = /[a-z]/g;
  let upperCaseLetter = /[A-Z]/g;
  let numbers = /[0-9]/g;

  // Kiểm tra độ dài tên người dùng
  if (username.length < 6) {
    alert("Username must be at least 6 characters");
  // Kiểm tra độ dài mật khẩu
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters");
  // Kiểm tra có chữ thường
  } else if (!password.match(lowerCaseLetter)) {
    alert("Password must  contain a lowercase letter");
  // Kiểm tra có chữ hoa
  } else if (!password.match(upperCaseLetter)) {
    alert("Password must  contain a uppercase letter");
  // Kiểm tra có số hoặc ký tự đặc biệt
  } else if (!password.match(numbers)) {
    alert("Password must  contain a number or special character");
  } else {
    // Nếu tất cả hợp lệ, lưu người dùng mới vào localStorage
    if (localStorage.getItem("users")) {
      let users = JSON.parse(localStorage.getItem("users"));

      users.push({
        email,
        password,
        username,
      });

      localStorage.setItem("users", JSON.stringify(users));
    } else {
      localStorage.setItem(
        "users",
        JSON.stringify([
          {
            email,
            password,
            username,
          },
        ])
      );
    }

    // Thông báo thành công và chuyển hướng đến trang đăng nhập
    alert("User created successfully, please login");
    location.href = "./login.html";
  }
});
