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
let globalFrame;

let listDataResult = [];
let newObj;

toggleCheck.checked = false; //기본 체크상태 설정

// 시작버튼 클릭시
addListOpen.addEventListener("click", (event) => {
  menuListWrap.classList.add("active");
  buttonWrap.style.display = "none";
});

// 빵셔틀 버튼 활성화
toggleCheck.addEventListener("click", () => {
  if (toggleCheck.checked) {
    document.querySelector(".menu-list-li.pp").style.display = "block";
  } else {
    document.querySelector(".menu-list-li.pp").style.display = "none";
  }
});

// 추가버튼
menuListAddBtn.addEventListener("click", (event) => {
  let valueTitle = document.getElementById("name");
  let valueAddress = document.getElementById("address");
  var blank_pattern = /^\s+|\s+$/g; //공백포함여부
  if (!valueTitle.value) {
    alert("음식 이름을 입력하세요");
    valueTitle.focus();
  } else if (valueTitle.value.replace(blank_pattern, "") == "") {
    alert("음식 공백 입력은 불가능 .");
    valueTitle.focus();
  } else if (!valueAddress.value && toggleCheck.checked) {
    alert("주문할 사람을 입력하세요");
    valueAddress.focus();
  } else if (
    valueAddress.value.replace(blank_pattern, "") == "" &&
    toggleCheck.checked
  ) {
    alert("주문할 사람에 공백 입력은 불가능 .");
    valueAddress.focus();
  } else {
    addList.style.display = "block";

    newObj = {
      title: valueTitle.value,
      address: valueAddress.value,
    };

    listDataResult.push(newObj);
    resultDatas(listDataResult);

    valueTitle.value = "";
    valueAddress.value = "";
  }
});

// 추첨 시작 버튼 누를시
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

// 렌덤 추천 기능
let selectList;
let selectListTargetText;

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

// 추첨버튼
selButtons.addEventListener("click", (event) => {
  const targets = event.target;
  const buttonValueText = targets.innerHTML;

  if (buttonValueText == "추첨") {
    // 추첨버튼 클릭시
    document.body.classList.add("active");
    selectImportantText.style.display = "none";
    targets.innerHTML = "재추첨";

    cancelAnimationFrame(globalFrame);

    menuTitle.innerHTML = `<p>${selectListTargetText}</p><p style='font-size:15px;'>입니다!</p>`;
    reset.style.display = "block";

    if (toggleCheck.checked && selectList?.address) {
      menuAddress.innerHTML = `<p style='margin-bottom: 20px;'>주문할 사람은 <b>${selectList.address}</b> .</p>`;
    }
    document.querySelector(".map-wrap").style.display = "block";

    getCurrentPosBtn(); // map 생성
  } else {
    // 재추첨 버튼 클릭시
    document.body.classList.remove("active");
    document.querySelector(".map-wrap").style.display = "none";

    selectImportantText.style.display = "block";
    reset.style.display = "none";

    globalFrame = requestAnimationFrame(callback);
    targets.innerHTML = "추첨";
    menuAddress.innerText = "";

    // 마커 초기화
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];

    // 인포창 초기화
    infowindow.close();
  }
});

/**
 * 리스트 삭제
 * @param {Number} targetIndex
 */
function listDel(targetIndex) {
  listDataResult.splice(targetIndex, 1);
  resultDatas(listDataResult);
}

/**
 * 셋팅 어레이
 * @param {Array} arrs
 */
function resultDatas(arrs) {
  let div = "";
  for (const dataList in arrs) {
    div += `<li class='list-li'>
    <span class='list-li-num'>${Number(dataList) + 1}.</span>
    <span class='text-box'><b>${arrs[dataList].title}</b></span>
    ${
      toggleCheck.checked
        ? `<span>를 주문 할 사람은 <b>${arrs[dataList].address}</b> .</span>`
        : ""
    }
    <img class='x-del-image' onclick='listDel(${Number(
      dataList
    )})' src='./image/xicon.png' />
    </li>`;
  }
  addListUl.innerHTML = div;
}

// 홈버튼
reset.addEventListener("click", function () {
  window.location.reload(true);
});
markers = [];

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.56646, 126.98121), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨 디폴트 셋팅
    mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
  };

// 지도를 생성한다
var map = new kakao.maps.Map(mapContainer, mapOption);
// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성

var infowindow = new kakao.maps.InfoWindow({
  zIndex: 1,
});

var currentPos; // 현재 위치를 담을 변수

function locationLoadSuccess(pos) {
  // 현재 위치 받아오기
  currentPos = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

  // 지도 이동(기존 위치와 가깝다면 부드럽게 이동)
  map.panTo(currentPos);

  // 마커 생성
  var marker = new kakao.maps.Marker({
    position: currentPos,
  });

  marker.setMap(null);
  // 기존에 현재위치 마커가 있다면 제거
  marker.setMap(map);
  keywordSearch(selectListTargetText);
}

function locationLoadError(pos) {
  alert("위치 정보를 가져오는데 실패했습니다.");
}

// 위치 가져오기 버튼 클릭시
function getCurrentPosBtn() {
  navigator.geolocation.getCurrentPosition(
    locationLoadSuccess,
    locationLoadError
  );
}

function keywordSearch(keyword) {
  // 장소 검색 객체를 생성
  var ps = new kakao.maps.services.Places(map);

  // 검색 옵션 객체
  var searchOption = {
    location: currentPos,
    radius: 1000,
    size: 5,
  };

  // 장소검색 객체를 통해 키워드로 장소검색을 요청
  ps.keywordSearch(keyword, placesSearchCB, searchOption);

  /**
   * 장소검색이 완료됐을 때 호출되는 콜백함수
   * @param {Array} data 검색된 데이터
   * @param {String} status 검색 완료 상태
   * @param {Number} pagination 페이지 번호
   * @returns
   */
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출

      displayPlacesOnSidebar(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("추첨 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("추첨 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  // 사이드바에 결과 출력 + 마커 생성
  function displayPlacesOnSidebar(places) {
    var bounds = new kakao.maps.LatLngBounds();

    // 지도에 표시되고 있는 마커를 제거
    removeMarker();

    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
      var marker = addMarker(placePosition, i);

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시
      // mouseout 했을 때는 인포윈도우를 닫습니다
      (function (marker, places) {
        kakao.maps.event.addListener(marker, "click", function () {
          displayInfowindow(marker, places);
        });

        // kakao.maps.event.addListener(marker, "mouseout", function () {
        //   infowindow.close();
        // });
      })(marker, places[i]);
    }

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정
    map.setBounds(bounds);
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수
  function addMarker(position, idx, title) {
    var imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(map); // 지도 위에 마커를 표출
    markers.push(marker); // 배열에 생성된 마커를 추가

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
  // 인포윈도우에 장소명을 표시
  function displayInfowindow(marker, places) {
    var content =
      '<div class="info-windows" style="padding:5px;z-index:1;">' +
      places.place_name +
      "</div>";

    infowindow.setContent(content);
    infowindow.open(map, marker);
  }
}
