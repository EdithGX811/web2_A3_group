const express = require('express');
const app = express();
const port = 3000;

// 引入api_controller模块
const apiRoutes = require('./api_controller');

// 设置静态文件目录
app.use(express.static('client'));

// 使用API路由
app.use('/api', apiRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
