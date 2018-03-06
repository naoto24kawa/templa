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
        console.log('split values');
        console.log(values);
      }
    }
  });

  $('#execute').on({
    'click': function(e){
      let result = [];

      for (let i = 0; i < values[0].length; i++) {
        let escaped = values[0][i].replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
        const regexp = new RegExp(escaped, 'g');
        let result = template.replace(regexp, values[1][i]);

        let blob = new Blob([result], {type: 'text/plain'}); // バイナリデータを作ります
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
