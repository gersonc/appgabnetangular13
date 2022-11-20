const PROXY_CONFIG = [
  {
    context: [
      "/"
    ],
    target: "http://slimgn05.dv",
    changeOrigin: true,
    secure: false
  }
];
module.exports = PROXY_CONFIG;
