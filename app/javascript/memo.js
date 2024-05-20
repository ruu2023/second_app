const buildHTML = (XHR) => {
  const item = XHR.response.post;
  const html = `
    <div class="post" data-post-id="${item.id}">
      <div class="post-date">
        ID：${item.id}
      </div>
      <div class="post-date">
        記入日：${item.posted_at}
      </div>
      <div class="post-date">
        タイトル：${item.title}
      </div>
      <div class="post-content">
        担当者：${item.pic}
      </div>
      <div class="post-content">
        ステータス：${item.status}
      </div>
      <div class="post-content">
        詳細：${item.content}
      </div>
      <button class="delete-button" data-post-id="${item.id}">削除</button>
    </div>`;
  return html;
};

function post() {
  // 投稿の作成
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const XHR = new XMLHttpRequest();
    XHR.open("POST", "/posts", true);
    XHR.responseType = "json";
    XHR.send(formData);
    XHR.onload = () => {
      if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      }
      const list = document.getElementById("list");
      const titleText = document.getElementById("title");
      // const picText = document.getElementById("pic");
      // const statusText = document.getElementById("status");
      const contentText = document.getElementById("content");
      list.insertAdjacentHTML("afterend", buildHTML(XHR));
      titleText.value = "";
      // picText.value = "";
      // statusText.value = "";
      contentText.value = "";
      attachEventListeners();
    };
  });
  attachEventListeners();
}

function deletePost(event) {
  // 投稿の削除
  event.preventDefault();
  const postId = this.getAttribute("data-post-id");
  const XHR = new XMLHttpRequest();
  XHR.open("DELETE", `/posts/${postId}`, true);
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
}

function ongoingIndex() {
  // Ajaxリクエストの送信
  const XHR = new XMLHttpRequest();
  XHR.open("GET", "/posts.json", true);
  XHR.responseType = "json";
  XHR.send();

  // レスポンスの処理
  XHR.onload = function () {
    if (XHR.status === 200) {
      const posts = XHR.response;
      const list = document.getElementById("post-list");
      posts.forEach(function (post) {
        const postItem = document.createElement("li");
        postItem.textContent = post.title;
        list.appendChild(postItem);
      });
    }
  };
}

window.addEventListener("turbo:load", post);

function attachEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", deletePost); // 既存のイベントリスナーを削除
    button.addEventListener("click", deletePost); // 新しくイベントリスナーを追加
  });
}
