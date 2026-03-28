// Phần này kiểm tra nếu đã đăng nhập, chuyển hướng về trang chủ
if (localStorage.getItem("currentUser")) {
  location.href = "./index.html";
}

// Lấy form đăng nhập và thêm sự kiện submit
let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  // Ngăn chặn hành vi mặc định của form
  e.preventDefault();

  // Kiểm tra nếu không có người dùng nào trong localStorage
  if (!localStorage.getItem("users")) {
    alert("No user found");
  } else {
    // Lấy danh sách người dùng từ localStorage
    let users = JSON.parse(localStorage.getItem("users"));

    // Lấy giá trị email và mật khẩu từ form
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    // Tìm người dùng khớp với email và mật khẩu
    let existingUser = users.find(
      (index) =>
        index.email === email.value.trim() &&
        index.password === password.value.trim()
    );

    // Nếu tìm thấy, lưu người dùng hiện tại và chuyển hướng
    if (existingUser) {
      localStorage.setItem("currentUser", JSON.stringify(existingUser));

      location.href = "/index.html";
    } else {
      // Nếu không, hiển thị thông báo lỗi
      alert("Email or password is incorrect");
    }
  }
});
