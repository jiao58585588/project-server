/**
 * Created by 10560 on 2018/10/31.
 */
//引入下载库或其他模块
const  express=require('express');
const Router=express.Router;
const router=new Router();
const Users=require('../models/users');
const md5=require('blueimp-md5');
const cookirParser=require('cookie-parser');
router.use(express.urlencoded({extended:true}));
router.use(cookieParser());
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
            res.cookie('userId',data.id,{maxAge:1000*3600*24*7});
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
        const data=await Users.findOne({username,password:md5(password)});
        if(!data){
            res.json({
                'code':1,
                'msg': '用户名或密码错误'
            });
        }else{
            res.json({  //将json数组/对象转换成字符串,仔细琢磨下
                code: 0,
                data: {
                    _id: data.id,
                    username: data.username,
                    type: data.type
                }
            })
        }
    }catch(e){
        res.json({
            'code':3,
            'msg': '网络不稳定，请刷新重试'
        });
    }
})
router.post('/update',(req,res)=> {
  const id = req.cookies.userId;
  if (!id) {
    return req.json({code: 0, msg: '请先登录'});
  }
  const user=req.body;
  Users.findByIdAndUpdate({_id:user},(err,data))
})
module.exports=router;