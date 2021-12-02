const API_KEY = 'ae73d9e3fc4cb4b8a9d5a4dcd0508b75';

const getRequestURL = (searchText) => {
  const parameters = {
    method: 'flickr.photos.search',
    api_key: API_KEY,
    text: searchText, // 検索テキスト
    sort: 'interestingness-desc', // 興味深さ順
    per_page: 4, // 取得件数
    license: '4', // Creative Commons Attributionのみ
    extras: 'owner_name,license', // 追加で取得する情報
    format: 'json', // レスポンスをJSON形式に
    nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
  };
  const url = new URL('https://api.flickr.com/services/rest');
  url.search = new URLSearchParams(parameters);
  return url;
};

const getFlickrImageURL = (photo, size) => {
  let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`;
  if (size) {
    // サイズ指定ありの場合
    url += `_${size}`;
  }
  url += '.jpg';
  return url;
};

const getFlickrPageURL = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;

const getFlickrText = (photo) => {
  let text = `"${photo.title}" by ${photo.ownername}`;
  if (photo.license === '4') {
    // Creative Commons Attribution（CC BY）ライセンス
    text += ' / CC BY';
  }
  return text;
};

/**
 * ※参考：コードのひな形
 * ここまで学習した内容を基に、Vueのコードを書くときの「ひな形」を用意しました。課題に取り組む際の参考にしてください。
 */

new Vue({
  el: '#gallery', // elオプションの値に '#gallery' を設定

  // components: {
  //   // ローカル登録するコンポーネントを設定
  //   // ( コンポーネントを利用しない場合は components: {}, は削除すること )
  // },


  

  data: {
    // 利用するデータを設定
    photos:[],
  },

  created() {
    // Vueが読み込まれたときに実行する処理を定義
    this.fetchImagesFromFlickr('cat');
    this.fetchImagesFromFlickr('dog');
  },
    // const getRequestURL = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
    // const getFlickrImageURL = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
    // const getFlickrPageURL = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
    // const getFlickrText = (photo) => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;

  methods: {

    fetchImagesFromFlickr(searchText) {
      const url = getRequestURL(searchText);

      $.getJSON(url, (data) => {
        if (data.stat !== 'ok') {
          //this.photos();
          return;
        }
        console.log(data);
        
        const fetchedPhotos = data.photos.photo;
        
       if (fetchedPhotos.length === 0) {
          return;
        }
        const imageData = fetchedPhotos.map(photo => ({
          id: photo.id,
          imageURL: getFlickrImageURL(photo, 'q'),
          pageURL: getFlickrPageURL(photo),
          text: getFlickrText(photo),
        }));
        // this.photos = [this.photos,imageData]
        this.photos = [...this.photos, ...imageData]
        // const new_photos = old_this.photos.concat(imageData);
        // console.log(imageData);
      }); 
    },
  },
});
