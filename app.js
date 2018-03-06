$(document).ready(function() {
  let template;
  let values;

  $('#template').on({
    'change': function(f){
      const template_file = f.target.files;
      const reader = new FileReader();
      reader.readAsText(template_file[0]);
      reader.onload = function(t){
        template = reader.result;
        console.log('input template');
        console.log(template);
      }
    }
  });

  $('#values').on({
    'change': function(f){
      const values_file = f.target.files;
      const reader = new FileReader();
      reader.readAsText(values_file[0]);
      reader.onload = function(t){
        values = reader.result;
        console.log('input values');
        console.log(values);
        let splited = values.split(/\r?\n/g); // 最初に行で分割する
        values = []; // 詰め替えるために配列準備
        for(let i = 0; i < splited.length; i++) {
          values[i] = splited[i].split(','); // カンマで分割し、配列に詰める
        }
        // ヘッダー長と一致しない、要素の削除
        const headerLength = values[0].length;
        let indexNum = []; // 削除対象の要素の番号を保持する
        for (let i = 1; i < values.length; i++) {
          if(values[i].length != headerLength) {
            indexNum.unshift(i);
          }
        }
        for (let i = 0; i < indexNum.length; i++) {
          values.splice(indexNum[i], 1);
        }
        console.log('split values');
        console.log(values);
      }
    }
  });

  $('#execute').on({
    'click': function(e){
      let regexps = [];
      let result = [];

      for (var i = 0; i < values[0].length; i++) {
        regexps[i] = new RegExp(values[0][i].replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), 'g');
      }

      for (let i = 1; i < values.length; i++) {
        result[i] = template;
        for (var j = 0; j < values[i].length; j++) {
          result[i] = result[i].replace(regexps[j], values[i][j]);
        }

        // バイナリデータを作ります
        let blob = new Blob([result[i]], {type: 'text/plain'});
        // IEか他ブラウザかの判定
        if(window.navigator.msSaveBlob) {
            // IEなら独自関数を使います。
            window.navigator.msSaveBlob(blob, 'result.html');
        } else {
            // それ以外はaタグを利用してイベントを発火させます
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.target = '_blank';
            a.download = 'result.html';
            a.click();
        }
      }
    }
  });
});
