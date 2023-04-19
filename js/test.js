const insertUl = document.querySelector(".uls");
const changeTargetButton = document.querySelector(".target-btn");

/**
 *
 * @param {Object} dataSets
 * @param {CallBack} callbackErrorText // Not type of Object error message
 */

function listEl(dataSets, callbackErrorText) {
      let div = "";
      if (typeof dataSets !== "object") {
            if(callbackErrorText) {
                  callbackErrorText("올바른 데이터가 아닙니다..");
                  return false;
            } 
      }
      
      if (!dataSets) div = "<li>데이터가 없습니다.</li>";
      else {
            dataSets = {...dataSets};

            let {name,contentText,show = false} = dataSets;

            div = `
                <li>
                      <p>${name || ''}</p>
                      <p>${contentText || ''}</p>
                      <p>${show || ''}</p>
                </li>
                  `;
      }

      insertUl.innerHTML = div;
}

changeTargetButton.addEventListener("click", changeDataClick);

function changeDataClick() {
      const newDatas = 'xcv';
      listEl(newDatas, (error) => {
            alert(error);
      });
}

listEl();