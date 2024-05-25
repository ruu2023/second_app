const buildHTML = (item) => {
  const html = `
    <div class="post bg-amber-100 shadow-xl rounded-md px-3 py-3 my-7" data-post-id="${item.id}">
      <div class="flex justify-between md:text-lg">
        <div>
          No.${item.id}
        </div>
        <div>
          記入日：${item.posted_at}
        </div>
      </div>
      <div class="text-2xl md:text-3xl">
        「${item.title}」
      </div>
      <div class="flex justify-between md:text-lg">
        <div>
          担当者：${item.pic}
        </div>
        <div>
          ステータス：${item.status}
        </div>
      </div>
      <div class="text-lg py-1 md:text-2xl">
        ${item.content}
      </div>
      <div class="flex justify-end">
        <button class="delete-button block px-3 py-2 bg-gray-300 rounded-md text-white hover:bg-red-700 cursor-pointer transition-all duration-300" data-post-id="${item.id}">削除</button>
      </div>
      
    </div>`;
  return html;
};

function selectRoom() {
  const select = document.getElementById('room-select');
  select.addEventListener('change', (e) => {
    const roomId = e.target.value;
    if (roomId) {
      window.location.href = `/rooms/${roomId}/posts`;
    }
  });
};

function post() {
  // 投稿の作成
  const form = document.getElementById("form");
  const roomId = form.dataset.roomId;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleText = document.getElementById("title");
    const contentText = document.getElementById("content");
    if (titleText.value.trim() === "" || contentText.value.trim() === "" ) {
      alert("すべてご記入お願いします。");
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
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("現在のプロジェクトが削除されます。本当に削除しますか？")) {
      const roomId = deleteButton.getAttribute("data-room-id");
      const XHR = new XMLHttpRequest();
      XHR.open("DELETE", `/rooms/${roomId}`, true);
      XHR.setRequestHeader(
        "X-CSRF-Token",
        document.querySelector('meta[name="csrf-token"]').getAttribute("content")
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
  })
}

window.addEventListener("turbo:load", function () {
  selectRoom();
  post();
  ongoingIndex();
  deleteRoom();
});

function attachEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", deletePost); // 既存のイベントリスナーを削除
    button.addEventListener("click", deletePost); // 新しくイベントリスナーを追加
  });
}
