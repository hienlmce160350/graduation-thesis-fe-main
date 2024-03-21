export function parseJwt(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

// format Date
export function convertDateStringToFormattedDate(dateString) {
  const inputDate = new Date(dateString);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function hideElementsWithStyle() {
  // Lặp qua tất cả các phần tử trên trang
  const elements = document.querySelectorAll("*");
  for (let child of elements) {
    // Kiểm tra xem phần tử có style nhất định không
    if (
      child.style.position === "fixed" &&
      (child.style.top === "10px" || child.style.top === "0")
    ) {
      // Ẩn phần tử nếu có style nhất định
      console.log("Test");
      child.style.display = "none";
      return; // Kết thúc vòng lặp ngay khi tìm thấy điều kiện
    }
  }
}

export function hideElementsFreeWithStyle() {
  // Lặp qua tất cả các phần tử trên trang
  const elements = document.querySelectorAll("*");
  for (let child of elements) {
    // Kiểm tra xem phần tử có nội dung là "Claim your FREE account and get a key in less than a minute" không
    if (
      child.textContent &&
      child.style.position === "fixed" &&
      child.textContent.includes(
        "Claim your FREE account and get a key in less than a minute"
      )
    ) {
      // Ẩn phần tử nếu có nội dung thỏa mãn điều kiện
      child.style.display = "none";
      return;
      // Không cần return ở đây để tiếp tục duyệt các phần tử khác
    }
  }
}

// Format Currency
export function formatCurrency(value) {
  // Kiểm tra nếu giá trị là null hoặc undefined
  if (value == null) {
    return "";
  }

  // Kiểm tra nếu giá trị không phải là số
  if (typeof value !== "number") {
    return value;
  }

  // Chuyển đổi giá trị thành chuỗi và định dạng
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
