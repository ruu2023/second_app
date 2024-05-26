const buildHTML = (item) => {
  const html = `
  

    <div class="post bg-amber-100 shadow-xl rounded-md px-3 py-3 my-7" id="post-${item.id}" data-post-id="${item.id}">
      <div class="flex justify-between md:text-lg">
        <div>
          No.<span class="post-id">${item.id}</span>
        </div>
        <div>
          記入日：<span class="posted-at">${item.posted_at}</span>
        </div>
      </div>
      <div class="text-2xl md:text-3xl">
        「<span class="post-title">${item.title}</span>」
      </div>
      <div class="flex justify-between md:text-lg">
        <div>
          担当者：<span class="post-pic">${item.pic}</span>
        </div>
        <div>
          ステータス：<span class="post-status">${item.status}</span>
        </div>
      </div>
      <div class="text-lg py-1 md:text-2xl">
        <span class="post-content">${item.content}</span>
      </div>
      <div class="flex justify-end">
        <button class="edit-button block mx-3 px-3 py-2 bg-gray-300 rounded-md text-white hover:bg-green-700 cursor-pointer transition-all duration-300" data-room-id="${item.room_id}" data-post-id="${item.id}">編集</button>
      <button class="delete-button block px-3 py-2 bg-gray-300 rounded-md text-white hover:bg-red-700 cursor-pointer transition-all duration-300" data-room-id="${item.room_id}" data-post-id="${item.id}">削除</button>
      </div>
    </div>`;
  return html;
};

function selectRoom() {
  const select = document.getElementById("room-select");
  select.addEventListener("change", (e) => {
    const roomId = e.target.value;
    if (roomId) {
      window.location.href = `/rooms/${roomId}/posts`;
    }
  });
}

function post() {
  // 投稿の作成
  const form = document.getElementById("form");
  const roomId = form.dataset.roomId;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleText = document.getElementById("title");
    const contentText = document.getElementById("content");
    if (titleText.value.trim() === "" || contentText.value.trim() === "") {
      alert("validates error 1 タイトル・詳細は必須項目です。");
      return null;
    }
    const formData = new FormData(form);
    const XHR = new XMLHttpRequest();
    XHR.open("POST", `/rooms/${roomId}/posts`, true);
    XHR.responseType = "json";
    XHR.send(formData);
    XHR.onload = () => {
      if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      }
      const list = document.getElementById("list");
      list.insertAdjacentHTML("afterend", buildHTML(XHR.response.post));
      titleText.value = "";
      contentText.value = "";
      attachEventListeners();
    };
  });
  attachEventListeners();
}


function editPost(event) {
  // 投稿の編集
  event.preventDefault();
  
  const postId = this.getAttribute("data-post-id");
  const roomId = this.getAttribute("data-room-id");
  const modalShadow = document.querySelector(".modal-window-shadow");
  const modalEdit = document.querySelector(".modal-window-edit");
  const editSubmit = document.querySelector("#edit-submit");
  const closeModal = document.querySelector("#close-modal");
  const postElement = document.getElementById(`post-${postId}`);
  
  function modalOpen() {
    // 編集モーダルを開く
    document.body.style.overflow = "hidden";
    modalShadow.classList.add("active");
    modalEdit.classList.add("active");
  }
  function modalClose() {
    modalShadow.classList.remove("active");
    modalEdit.classList.remove("active");
    // スクロールを有効にする
    document.body.style.overflow = "auto";
  }

  modalOpen();

  closeModal.addEventListener("click", () => {
    modalClose();
  });
  // modalShadow.addEventListener("click", (e) => {
  //   if (e.target === modalShadow) {
  //     modalClose();
  //   }
  // });
  editSubmit.addEventListener("click", () => {
    modalClose();
  });

  const queryTitle = postElement.querySelector(".post-title");
  const queryPic = postElement.querySelector(".post-pic");
  const queryStatus = postElement.querySelector(".post-status");
  const queryContent = postElement.querySelector(".post-content");

  const title = queryTitle.textContent.trim();
  const pic = queryPic.textContent.trim();
  const status = queryStatus.textContent.trim();
  const content = queryContent.textContent.trim();

  document.getElementById("edit-title").value = title;
  document.getElementById("edit-pic").value = pic;
  document.getElementById("edit-status").value = status;
  document.getElementById("edit-content").value = content;

  // ajax
  const form = document.getElementById("edit-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleText = document.getElementById("edit-title");
    const contentText = document.getElementById("edit-content");
    if (titleText.value.trim() === "" || contentText.value.trim() === "") {
      alert("validates error 1 タイトル・詳細は必須項目です。");
      return null;
    }
    const formData = new FormData(form);
    const XHR = new XMLHttpRequest();
    XHR.open("PATCH", `/rooms/${roomId}/posts/${postId}`, true);
    XHR.responseType = "json";
    XHR.setRequestHeader(
      "X-CSRF-Token",
      document.querySelector('meta[name="csrf-token"]').getAttribute("content")
    );
    XHR.send(formData);
    XHR.onload = () => {
      if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      }
      const post = XHR.response.post;
      queryTitle.textContent = post.title;
      queryPic.textContent = post.pic;
      queryStatus.textContent = post.status;
      queryContent.textContent = post.content;
      attachEventListeners();
    };
  });
  attachEventListeners();
}

function deletePost(event) {
  // 投稿の削除
  event.preventDefault();
  if (confirm("本当に削除しますか？")) {
    const postId = this.getAttribute("data-post-id");
    const roomId = this.getAttribute("data-room-id");
    const XHR = new XMLHttpRequest();
    XHR.open("DELETE", `/rooms/${roomId}/posts/${postId}`, true);
    XHR.setRequestHeader(
      "X-CSRF-Token",
      document.querySelector('meta[name="csrf-token"]').getAttribute("content")
    );
    XHR.onload = () => {
      if (XHR.status == 204) {
        // 204 No Content
        const postItem = document.querySelector(
          `.post[data-post-id="${postId}"]`
        );
        postItem.remove();
      } else {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
      }
    };

    XHR.onerror = () => {
      alert("Request failed");
    };

    XHR.send();
    alert("削除しました。"); // 削除が完了したことをユーザーに通知するためのアラート
  } else {
    alert("削除がキャンセルされました。"); // キャンセルされたことをユーザーに通知するためのアラート
  }
}

function ongoingIndex() {
  // 継続のみ表示
  const ongoingButton = document.getElementById("ongoing-button");
  const roomId = ongoingButton.getAttribute("data-room-id");
  ongoingButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Ajaxリクエストの送信
    const XHR = new XMLHttpRequest();
    XHR.open("GET", `/rooms/${roomId}/posts/ongoing_index.json`, true);
    XHR.responseType = "json";
    XHR.send();

    // レスポンスの処理
    XHR.onload = function () {
      if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      } else {
        const posts = XHR.response;
        // existing要素を一括で削除
        const existing = document.querySelectorAll(".post");
        existing.forEach((post) => post.remove());
        // レスポンスからHTMLを生成
        posts.forEach(function (post) {
          const list = document.getElementById("list");
          list.insertAdjacentHTML("afterend", buildHTML(post));
        });
      }
    };
  });
}

function deleteRoom() {
  const deleteButton = document.getElementById("delete-room");
  // ルームの削除
  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("現在のプロジェクトが削除されます。本当に削除しますか？")) {
      const roomId = deleteButton.getAttribute("data-room-id");
      const XHR = new XMLHttpRequest();
      XHR.open("DELETE", `/rooms/${roomId}`, true);
      XHR.setRequestHeader(
        "X-CSRF-Token",
        document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content")
      );
      XHR.onload = () => {
        if (XHR.status == 204) {
          // 204 No Content
          window.location.href = `/rooms`;
        } else {
          alert(`Error ${XHR.status}: ${XHR.statusText}`);
        }
      };

      XHR.onerror = () => {
        alert("Request failed");
      };

      XHR.send();
      alert("削除しました。"); // 削除が完了したことをユーザーに通知するためのアラート
    } else {
      alert("削除がキャンセルされました。"); // キャンセルされたことをユーザーに通知するためのアラート
    }
  });
}

window.addEventListener("turbo:load", function () {
  selectRoom();
  post();
  ongoingIndex();
  deleteRoom();
});

function attachEventListeners() {
  const editButtons = document.querySelectorAll(".edit-button");
  const deleteButtons = document.querySelectorAll(".delete-button");
  editButtons.forEach((button) => {
    button.removeEventListener("click", editPost); // 既存のイベントリスナーを削除
    button.addEventListener("click", editPost); // 新しくイベントリスナーを追加
  });
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", deletePost); // 既存のイベントリスナーを削除
    button.addEventListener("click", deletePost); // 新しくイベントリスナーを追加
  });
}
