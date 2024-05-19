const WebSocket = require("ws")
const { WebSocketServer } = require("ws")

const wss = new WebSocketServer({ port: 8080 });
let messageQueue = []; // 消息队列
let userAll = [] //存目前所有的在线用户的
let msgObj = null

wss.on('connection', function connection(ws, req) {
  // 清除已经发送的消息(清除消息队列中的空对象)
  let filterMessageQueue = messageQueue.filter(obj => Object.keys(obj).length !== 0)
  messageQueue = filterMessageQueue
  // 检测用户的断开
  ws.on('close', function close() {
    console.log("用户断开连接")
    // 断开连接后删除所记录的用户信息
    if (userAll.indexOf(ws.user) != -1) {
      userAll.splice(userAll.indexOf(ws.user), 1)
    }
  });
  // 记录id
  const id = req.url.split('=')[1]
  ws.user = id
  ws.on('error', console.error);
  wss.clients.forEach(function each(client) {
    // 记录所有在线用户, 并且如果此用户在这里面了，就直接跳过
    if (client.user && !userAll.includes(client.user)) {
      userAll.push(client.user)
    }
  })
  // 优先发送离线消息
  if (messageQueue?.length) {
    console.log("有离线消息需要发送", messageQueue)
    wss.clients.forEach(function each(client) {
      // 只会发给前端传过来的msgObj.id这个值的用户
      for (var i = 0; i < messageQueue.length; i++) {
        if (client.user == messageQueue[i].id && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            ...messageQueue[i],
            fromId: msgObj.fromId
          }));
          // 发送后变成空对象
          messageQueue[i] = {}
        }
      }
    });
  }
  ws.on('message', function message(data, isBinary) {
    // 解析前端发过来的值，用来判断这个用户要发信息给谁
    msgObj = JSON.parse(data)
    wss.clients.forEach(function each(client) {
      // 只会发给前端传过来的msgObj.id这个值的用户
      if (client.user == msgObj.id && client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          ...msgObj,
          fromId: msgObj.fromId,
          date: msgObj.date
        }), { binary: isBinary })
      }
    });
    if (!userAll.includes(msgObj?.id)) {
      messageQueue.push(msgObj)
      ws.send("用户不在线")
    }
  });
});
