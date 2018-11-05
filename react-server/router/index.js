
const express = require('express');
//引入md5加密
const md5 = require('blueimp-md5');
//引入cookie-parser
const cookieParser = require('cookie-parser');
//引入Users
const Users = require('../models/users');
const Messages = require('../models/messages');
//获取Router
const Router = express.Router;
//创建路由器对象
const router = new Router();

//解析请求体的数据
router.use(express.urlencoded({extended: true}));
//解析cookie
router.use(cookieParser());

const filter = {__v: 0, password: 0};
router.post('/register',async (req,res)=> {
    //收集用户信息
    const {username, password, type} = req.body;
    //判断输入是否合法
    if (!username || !password || !type) {
        res.json({
            'code': 2,
            'msg': '用户输入不合法'
        });
        return;
    }
    //去数据库查找用户是否存在
    try{
        const data = await Users.findOne({username});
        if (data) {
            res.json({
                'code': 1,
                'msg': '用户已存在'
            })
        } else {
            //注册成功 将用户信息保存在数据库中 不能用passward的简写方式
            const result =await Users.create({username, password: md5(password), type})
            res.cookie('userid',result.id,{maxAge:1000*3600*24*7});
            res.json({  //将json数组/对象转换成字符串,仔细琢磨下
                code: 0,
                data: {
                    _id: result.id,
                    username: result.username,
                    type: result.type
                }
            })
        }
    }catch(e){
        res.json({
            'code': 3,
            'msg': '网络出问题了，请刷新重试'
        })
    }
//后面已无逻辑，无需加return
})
router.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    
    if(!username||!password){
        res.json({
            'code':2,
            'msg': '用户输入不合法'
        });
        return;
    }
    try{
        const data=await Users.findOne({username,password:md5(password)},filter);
        if(!data){
            res.json({
                'code':1,
                'msg': '用户名或密码错误'
            });
        }else{
            res.cookie('userid',data.id,{maxAge:1000*3600*24*7});
            res.json({  //将json数组/对象转换成字符串,仔细琢磨下
                code: 0,
                data
            })
        }
    }catch(e){
        res.json({
            'code':3,
            'msg': '网络不稳定，请刷新重试'
        });
    }
})
// 更新用户信息的路由
router.post('/update', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  console.log(userid);
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.json({code: 1, msg: '请先登陆'});
  }
  // 存在, 根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body // 没有_id
  Users.findByIdAndUpdate({_id: userid}, {$set: user})
    .then(oldUser => {
      if (!oldUser) {
        //更新数据失败
        // 通知浏览器删除userid cookie
        res.clearCookie('userid');
        // 返回返回一个提示信息
        res.json({code: 1, msg: '请先登陆'});
      } else {
        //更新数据成功
        // 准备一个返回的user数据对象
        const {_id, username, type} = oldUser;
        console.log(oldUser);
        //此对象有所有的数据
        const data = Object.assign({_id, username, type}, user)
        // 返回成功的响应
        res.json({code: 0, data})
      }
    })
    .catch(error => {
      // console.error('登陆异常', error)
      res.send({code: 3, msg: '网络不稳定，请重新试试~'})
    })
})

// 获取用户信息的路由(根据cookie中的userid)
router.get('/user', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  Users.findOne({_id: userid}, filter)
    .then(user => {
      if (user) {
        res.send({code: 0, data: user})
      } else {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        res.send({code: 1, msg: '请先登陆'})
      }
    })
    .catch(error => {
      console.error('获取用户异常', error)
      res.send({code: 3, msg: '网络不稳定，请重新试试~'})
    })
})
//获取用户列表的路由
router.get('/userList',(req,res)=>{
  const {type}=req.query;
  Users.find({type},filter)
    .then(users=>{
      res.send({
          code:0,
          data:users
        })
    })
    .catch(rej=>{
      console.log('获取用户信息失败');
      res.send({
        code:1,
        msg:'获取用户信息失败，请重新尝试'
      })
    })
})
//获取聊天消息的路由
router.get('/msglist',async (req,res)=>{
  const {userid}=req.cookies;
  if(!userid){
    res.json({
      code:3,
      msg:'请先登录'
    });
    return;
  }
  try{
    const chatMsgs=await Messages.find({$or:[{from:userid},{to:userid}]},{__v:0});
    const result=await Users.find();
    let users=[];
    chatMsgs.forEach(item=>{
      users[item._id]={
        username:item.username,
        header:item.header
      }
    })
    res.json({
      code:0,
      data:{
        users,
        chatMsgs
      }
    })
  }catch(e){
    res.json({
      code:3,
      msg:'网络不稳定，请重新试试'
    })
  }
})
//暴露出去
module.exports = router;