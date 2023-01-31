const toggleCheck = document.querySelector(".toggleClick");
const selButtons = document.getElementById("select-button");
const selectImportantText = document.querySelector(".select-important-text");
const menuListAddBtn = document.getElementById("menu-list-add-btn");
const buttonWrap = document.querySelector(".button-wrap");
const menuTitle = document.querySelector(".menu-list-title");
const menuAddress = document.querySelector(".menu-list-address");
const addListOpen = document.getElementById("add-list-open");
const menuListWrap = document.querySelector(".menu-list-wrap");
const resultWrap = document.querySelector(".result-wrap");
const chooseNumber = document.querySelector(".chooseNumber");
const addListUl = document.querySelector(".add-list-ul");
const startBtn = document.getElementById("menu-list-add-btn-start");
const addList = document.querySelector(".add-list");
const reset = document.querySelector(".reset");

let end = 5;
let start = 0;
let countListNum = 0;
let globalFrame;

// let startNum = 0;
// let lastNum = 3;

let listDataResult = [];
let newArray;

let checkState = false;

toggleCheck.checked = false;

toggleCheck.addEventListener("click", () => {
  if (toggleCheck.checked) {
    document.querySelector(".menu-list-li.pp").style.display = "block";
  } else {
    document.querySelector(".menu-list-li.pp").style.display = "none";
  }
});
menuListAddBtn.addEventListener("click", (event) => {
  let valueTitle = document.getElementById("name");
  let valueAddress = document.getElementById("address");
  var blank_pattern = /^\s+|\s+$/g;
  if (!valueTitle.value) {
    alert("음식 이름을 입력하세요");
    valueTitle.focus();
  } else if (valueTitle.value.replace(blank_pattern, "") == "") {
    alert("음식 공백 입력은 불가능 합니다.");
    valueTitle.focus();
  } else if (!valueAddress.value && toggleCheck.checked) {
    alert("주문할 사람을 입력하세요");
    valueAddress.focus();
  } else if (
    valueAddress.value.replace(blank_pattern, "") == "" &&
    toggleCheck.checked
  ) {
    alert("주문할 사람에 공백 입력은 불가능 합니다.");
    valueAddress.focus();
  } else {
    addList.style.display = "block";

    newArray = {
      title: valueTitle.value,
      address: valueAddress.value,
    };
    listDataResult.push(newArray);

    addListUl.insertAdjacentHTML(
      "beforebegin",
      `<li class='list-li'><span class='list-li-num'>${
        listDataResult.length
      }.</span>
                <span class='text-box'><b>${newArray.title}</b></span>${
        toggleCheck.checked
          ? `<span>를 주문 할 사람은 <b>${newArray.address}</b> 입니다.</span>`
          : ""
      }
      <img class='x-del-image' onclick='listDel(this,${countListNum})' src='./image/xicon.png' />          
      </li>`
    );
    valueTitle.value = "";
    valueAddress.value = "";
    countListNum++;
  }
});

let selectList;
let selectListTargetText;

startBtn.addEventListener("click", () => {
  if (listDataResult.length < 2) {
    alert("음식을 1개 이상 등록해주세요");
  } else {
    resultWrap.style.display = "block";
    menuListWrap.classList.remove("active");
    selButtons.classList.add("active");
    addList.style.display = "none";
    requestAnimationFrame(callback);
  }
});

let callback = function () {
  start++;
  if (end == start) {
    selectList =
      listDataResult[Math.floor(Math.random() * listDataResult.length)];
    selectListTargetText = menuTitle.innerText = selectList.title;
    start = 0;
    globalFrame = requestAnimationFrame(callback);
  } else {
    globalFrame = requestAnimationFrame(callback);
  }
};

selButtons.addEventListener("click", (event) => {
  const targets = event.target;
  const buttonValueText = targets.innerHTML;

  if (buttonValueText == "추첨") {
    selectImportantText.style.display = "none";
    targets.innerHTML = "재추첨";
    cancelAnimationFrame(globalFrame);

    menuTitle.innerHTML = `<p>${selectListTargetText}</p><p style='font-size:15px;'>입니다!</p>`;
    reset.style.display = "block";

    if (toggleCheck.checked && selectList?.address) {
      menuAddress.innerHTML = `<p style='margin-bottom: 20px;'>주문할 사람은 <b>${selectList.address}</b> 입니다.</p>`;
    }
  } else {
    globalFrame = requestAnimationFrame(callback);
    targets.innerHTML = "추첨";
    menuAddress.innerText = "";
  }
});

addListOpen.addEventListener("click", (event) => {
  menuListWrap.classList.toggle("active");
  buttonWrap.style.display = "none";
});

// 초기화
reset.addEventListener("click", function () {
  window.location.reload(true);
});

// 리스트 삭제
/**
 *
 * @param {dom} targetList
 * @param {dataSet} idx
 */
function listDel(targetList, idx) {
  listDataResult.splice(idx);
  targetList.closest("li").remove();
  const listlinum = document.querySelectorAll(".list-li-num");
  for (let i = 0; i < listlinum.length; i++) {
    listlinum[i].innerHTML = `${i + 1}. `;
  }
  countListNum--;
}
