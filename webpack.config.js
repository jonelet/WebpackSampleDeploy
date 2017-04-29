var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// tablica stringów, będą nazwy bibliotek które chcemy mieć w osobnym pliku
const VENDOR_LIBS = [
  'react', 'lodash', 'redux', 'react-redux', 'react-dom',
  'faker', 'react-input-range', 'redux-form', 'redux-thunk'
];

module.exports = {
  entry: {
    // chcę utworzyć plik bundle.js, ma nazywać się bundle i chcę zacząć konkretnie w './src/index.js',
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    // kiedy bundle zostanie całkowicie utworzony zapisz go jako bundle.js
    // [name] - zostanie zastąpione przez key z sekcji entry więc następnie zostanie utworzony
    // vendor bundle i zostanie nazwany vendor.js

    // chunkhash - unikatowa nazwa, tworzona za każdym razem gdy zmieni się plik
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        // można spokojnie na nich działać, nic się nie stanie, tylko zmarnuje zasoby
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      // mówi, żeby spojrzeć na sumę wszystkie pliki projektu bundle i vendor (entry)
      // sprawia, że jeśli jakieś pliki, moduły są takie same w obu plikach, są duplikatami, kopiami itp między tymi dwoma to
      // dodaj je tylko do vendor
      //// name: 'vendor'

      // powyższe rozwiązanie sprawiałoby, że za każdą zmianą plików aplikacji tworzylibyśmy niepotrzebnie pliki vendor
      // plik manifest pomaga w tym sprawdzaniu
      names: ['vendor', 'manifest']
    }),
    // musimy dodać tutaj konfigurację, inaczej sam utworzy plik index.html z wklejonymi rzeczami
    new HtmlWebpackPlugin({
      // użyj pliku index.html jako szablonu, ale skoro teraz index.html jest częścią konfiguracji wpadałoby go przenieść do folderu src
      // potem usuwamy wszystkie taki script, po npm run build zostaną automatycznie dodane, a nowy plik index.html zostanie dodany do dist
      template: 'src/index.html'
    }),
    // mamy parę pluginów które mogą z tego korzystać (process.env). Jeśli znajdzie tą zmienną mającą wartość production wtedy webpack
    // będzie zachowywał się trochę inaczej. Nie będzie tylu sprawdzania błędów.
    // stringify jest po to aby mieć pewność, że po dostaniu zmiennej będzie poprawnie obsłużona
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
