let mix = require("laravel-mix");

mix.js("assets/js/index.js", "js");
mix.sass("assets/scss/index.scss", "css");
mix.setPublicPath("build");

mix.browserSync("localhost:3000");
