$(function () {
  $('.wrapper').fadeIn(600);
});

document.addEventListener('DOMContentLoaded', function () {

  // サーバーからCSVデータを取得する
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpXRJZ-wYtTU-IZOUlLrUxTcM3_Sea50E7xXkTfrUUspGonSvNilrxQ6HRUp3bvkLn1luRR-qhLtRP/pub?gid=0&single=true&output=csv')
    .then(response => response.text())
    .then(csvText => {
      var grid = document.querySelector('.grid');
      if (!grid) return;

      // CSVを行に分割
      var rows = csvText.split('\n').slice(1);


      rows.forEach(function (row) {
        var data = row.split(','); // カンマで列を分割

        var newLi = document.createElement('li');
        newLi.className = 'item ' + data[2]; // CSVのタグデータ
        newLi.setAttribute("recommend", data[3]);// おすすめ順
        newLi.setAttribute("date", data[4].replace(/\//g, '-'));// 日付を追加


        var div = document.createElement('div');
        div.className = 'item-content';
        div.style.position = 'relative'; // divを相対位置に設定

        var imgBG = document.createElement('img');
        imgBG.src = 'media/loading.gif';
        imgBG.style.position = 'absolute'; // imgBGを絶対位置に設定
        imgBG.style.width = 'auto';
        imgBG.style.height = 'auto';
        imgBG.style.top = '50%';
        imgBG.style.left = '50%';
        imgBG.style.transform = 'translate(-50%, -50%)'; // 中央に配置
        imgBG.style.zIndex = '0'; // imgBGを背面に配置
        imgBG.setAttribute('loading', 'eager');

        var a = document.createElement('a');
        a.href = data[1]; // URL
        // a.dataset.caption = 'キャプション'; // キャプション
        a.style.zIndex = '2';
        // URLの末尾をチェック
        if (a.href.endsWith('.png') || a.href.endsWith('.jpg')) {
          a.className = 'dialog-link';
        }else if (a.href.endsWith('_f.html')) {
          a.className = 'dialog-link_fullweb';
          a.setAttribute('target','_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }        
        else if (a.href.endsWith('.html')) {
          a.className = 'dialog-link_web';
        }

        var img = document.createElement('img');
        img.src = data[0]; // 画像URL
        img.alt = ''; // 代替テキスト
        img.style.zIndex = '1';
        img.setAttribute('decoding', 'async');
        img.setAttribute('loading', 'lazy');

        a.appendChild(img);
        div.appendChild(imgBG);
        div.appendChild(a);
        newLi.appendChild(div);

        grid.appendChild(newLi);
      });
      filterReload();
    })
    .catch(error => console.error('Error loading CSV data:', error));



});



// $(window).on('load',function(){ //画面遷移時にギャラリーの画像が被らないように、すべての読み込みが終わった後に実行する
function filterReload() {
  var grid;
  //＝＝＝Muuriギャラリープラグイン設定
  grid = new Muuri('.grid', {
    sortData: {
      date: function (item, element) {
        return parseFloat(element.getAttribute('date'));
      },
      recommend: function (item, element) {
        return parseFloat(element.getAttribute('recommend'));
      }
    }
  });
  grid.refreshSortData();
  grid.sort('recommend:desc');
  grid.on('layoutEnd', function () {
    loadFix();
  });

  $('.sort-btn ul li').on('click', function () { //並び替えボタンをクリックしたら
    var className = $(this).attr("class"); //クリックしたボタンのクラス名を取得
    className = className.split(' '); //「.sort-btn ul li」のクラス名を分割して配列にする

    $(".sort-btn ul li").removeClass("active"); //すべてのボタンからactiveクラスを削除
    // クリックしたボタンにactiveクラスを追加
    $(this).addClass("active");

    if (className[0] == "all") {
      grid.show(''); //ギャラリーの全ての画像を表示
    } else {
      filterDo(); //並び替えを行う
    }
  });

  function filterDo() {

    var selectElms = $(".sort-btn ul li.active"); //全てのボタンのactive要素を取得
    var selectElemAry = [];             //activeクラスがついているボタンのクラス名（sortXX）を保存する配列を定義
    $.each(selectElms, function (index, selectElm) {
      var className = $(this).attr("class")   //activeクラスがついている全てのボタンのクラス名（sortXX）を取得
      className = className.split(' ');     //ボタンのクラス名を分割して配列にし、
      selectElemAry.push("." + className[0]);   //selectElemAry配列に、チェックのついたクラス名（sortXX）を追加
    })
    str = selectElemAry.join(',');        //selectElemAry配列に追加されたクラス名をカンマ区切りでテキストにして
    grid.filter(str);               //grid.filter(str);のstrに代入し、ボタンのクラス名と<li>につけられたクラス名が一致したら出現

  }


  function down() {
    grid = new Muuri('.grid', {
      sortData: {
        date: function (item, element) {
          return parseFloat(element.getAttribute('date'));
        }
      }
    });
    grid.refreshSortData();
    grid.sort('date', { descending: false });
  }
  function up() {

    grid = new Muuri('.grid', {
      sortData: {
        date: function (item, element) {
          return parseFloat(element.getAttribute('date'));
        },
        recommend: function (item, element) {
          return parseFloat(element.getAttribute('recommend'));
        }
      }
    });
    grid.refreshSortData();
    grid.sort('date', { descending: true });
  }

  function recommend() {
    var grid = new Muuri('.grid', {
      sortData: {
        date: function (item, element) {
          return parseFloat(element.getAttribute('date'));
        },
        recommend: function (item, element) {
          return parseFloat(element.getAttribute('recommend'));
        }
      }
    });
    grid.refreshSortData();
    grid.sort('date recommend:desc');
  }



  // セレクトボックス
  $(".custom-select").each(function () {
    var classes = $(this).attr("class"),
      id = $(this).attr("id"),
      name = $(this).attr("name");
    var template = '<div class="' + classes + '">';
    template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
    template += '<div class="custom-options">';
    $(this).find("option").each(function () {
      template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
    });
    template += '</div></div>';

    $(this).wrap('<div class="custom-select-wrapper"></div>');
    $(this).hide();
    $(this).after(template);
  });
  $(".custom-option:first-of-type").hover(function () {
    $(this).parents(".custom-options").addClass("option-hover");
  }, function () {
    $(this).parents(".custom-options").removeClass("option-hover");
  });
  $(".custom-select-trigger").on("click", function () {
    $('html').one('click', function () {
      $(".custom-select").removeClass("opened");
    });
    $(this).parents(".custom-select").toggleClass("opened");
    event.stopPropagation();
  });

  var urrentValue;
  $(".custom-option").on("click", function () {
    urrentValue = null;
    currentValue = $(this).parents(".custom-select-wrapper").find("select").val();
    var newValue = $(this).data("value");
    $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
    $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
    $(this).addClass("selection");
    $(this).parents(".custom-select").removeClass("opened");
    $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

    if (currentValue !== newValue) {
      if (newValue === "new") {
        up();
      } else if (newValue === "old") {
        down();
      }
      else if (newValue === "recommend") {
        recommend();
      }
    }
  });


};

//ロードが完了したら

function loadFix() {
  $('.load').fadeOut(0);

  $(function () {
    $('.dialog-link').modaal({
      type: 'image',
      hide_close: true,
      animation: "none",
      overlay_opacity: 0,
      background_scroll: false,

    });
  });
  $(function () {
    $('.dialog-link_web').modaal({
      type: 'iframe',
      height: 700,
      hide_close: true,
      animation: "none",
      overlay_opacity: 0,
      background_scroll: false,
    });
  });

};
