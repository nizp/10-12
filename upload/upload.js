(function($){
	//第二步：创建一个构造函数
	function Upload(){
		//设置默认参数
		this.settings = {
			//file标签
			fileInput:null,
			//提交按钮
			oSubmit:null,
			//上传地址
			url:'',
			//添加文件的时候触发
			onSelect:null,
			//存放视图的DOM的元素
			view:null,
			//处理创建视图的函数
			createView:null
		}
		this.arr = [];//存上传的二进制数据
	};
	
	//第三步：给构造函数添加方法
	$.extend(Upload.prototype,{
		//初始化代码
		init:function(opt){ //接收配置参数
			//有配置走配置，没配置走默认
			for(var attr in opt){
				this.settings[attr] = opt[attr];
			}
			
			//如果有上传文件的标签就执行select1
			if(this.settings.fileInput){
				//this.select1：当上传文件标签的value值发生改变的时候就触发
				this.select1();
			}
			
			//当有提交按钮的时候，触发点击之后的操作（ajax请求）
			if(this.settings.oSubmit){
				this.onClick();
			}
		},
//		当上传文件标签的value值发生改变的时候就触发
		select1:function(){
			var that = this;
			this.settings.fileInput.change(function(ev){
				//将二进制数据存入this.arr中
				that.pushFile(ev.target.files);
				//将更新过的数组传入视图的函数中
				that.settings.createView(that.arr);
				//添加文件成功时
				that.settings.onSelect();
			});
		},
		//输出文件的源格式
		viewFn:function(filesDate,fn){//filesDate：数组，fn：回调
			var data = [];//存放输出文件的源码
			//循环更新之后的数组，每循环一次都将文件源码转换出来
			$.each(filesDate,function(i,e){
				//每循环一次就创建一个解析源码的对象
				var fr = new FileReader();
				//当输出成功的时候
				fr.onload = function(ev){
					//将输出的文件源码存入data中
					data.push(ev.target.result);
					//当转化完成的时候，调用回调函数并且将转化好的文件源码传入fn中
					if(filesDate.length === data.length){
						console.log(data)
						fn(data);
					}
					//console.log(ev);
				}
				//new FileReader() + readAsDataURL(传入二进制数据) 才能将二进制数据转化为文件源码
				fr.readAsDataURL(e);
			});
		},
		//push二进制数据的
		pushFile:function(files){
			var that = this;
			$.each(files,function(i,e){
			 	that.arr.push(e);
			});
		},
		//点击提交按钮的时候做的事。
		onClick:function(){
			this.settings.oSubmit.click(function(){
				alert(1);
			});
		}
	});
	
	
	
	
	
	//第一步：创建一个JQ方法
	$.extend({
		upload:function(options){//options 接收配置参数
			var up = new Upload();  //实例化对象
			up.init(options);//调用init把配置参数传进去
			return up; //返回这个对象
		}
	});
	
})(jQuery)
