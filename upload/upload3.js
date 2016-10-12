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
			createView:null,
			onProgress:null,
			drag:null,
			onDragenter:null,
			onDrop:null
		}
		this.arr = [];//存上传的二进制数据
		this.json = {};//去重
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
			
			if(this.settings.drag){
				this.onHover();
				this.onOut();
				this.settings.drag.on('dragover',function(){
					return false;
				})
			}
			
		},
//		当上传文件标签的value值发生改变的时候就触发
		select1:function(){
			var that = this;
			this.settings.fileInput.change(function(ev){
				//将二进制数据存入this.arr中
				that.pushFile(ev.target.files);
				
				//添加文件成功时
				that.settings.onSelect();
			});
		},
		//输出文件的源格式
		viewFn:function(filesDate,fn){//filesDate：数组，fn：回调
			var data = [];//存放输出文件的源码
			//循环更新之后的数组，每循环一次都将文件源码转换出来
			
			//如果数据全部删掉（this.arr中没数据），调用fn并且把空数组传给fn，避免在this.arr没数据的时候不调用fn
			if(!filesDate.length)fn(data);
			
			$.each(filesDate,function(i,e){
				//每循环一次就创建一个解析源码的对象
				var fr = new FileReader();
				//当输出成功的时候
				fr.onload = function(ev){
					//将输出的文件源码存入data中
					data.push(ev.target.result);
					//当转化完成的时候，调用回调函数并且将转化好的文件源码传入fn中
					if(filesDate.length === data.length){
						//console.log(data)
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
			var oldFile = that.arr.slice();
			var len = 0;
			
			//保证能够循环并且保证多的和少的比
			if(files.length > that.arr.length){
				len = files.length
			}else{
				len = that.arr.length;
			}
			/*
			 	去重，如果this.json有key值说明有重复的，
			 	否则this.arr中没有这个数据，就要push
			*/
			for(var k=0;k<files.length;k++){
				if(!this.json[files[k].name]){
					this.json[files[k].name] = 1;
					this.arr.push(files[k]);
				}
			}
			//在添加数据时候，检测新的数据与老的数据是否一致
			this.onChangeData(oldFile,that.arr);
		},
		//当删除数据的时候调用这个函数
		deletFile:function(deletDate){//deletDate删除的数据
			var Feils = this.arr.slice();
			for(var i=0;i<this.arr.length;i++){
				if(Feils[i] == deletDate){
					this.arr.splice(i,1);
				}
			}
			//当数据删除的时候调用onChangeData函数
			this.onChangeData(Feils,this.arr);
			
		},
		//点击提交按钮的时候做的事。
		onClick:function(){
			var that = this;
			var opt = this.settings;
			var old = this.arr.slice();
			this.settings.oSubmit.click(function(){
				var num = 0;
				var arr = [];
				$.each(that.arr,function(i,e){
					var ajax = new XMLHttpRequest();
					ajax.open('post',opt.url);
					var fd = new FormData();
					fd.append('file',e);
					ajax.onload = function(ev){
						num+=1;
						var scale = num/that.arr.length;
						opt.onProgress(scale);
						if(num == that.arr.length){
							setTimeout(function(){
								//所有数据上传完成的时候触发（点击以后清空数据，作业）
							},1000);
						}
					}
					ajax.send(fd);
				});
			});
		},
		//监控当前的数据与之前的数据是否发生变化
		onChangeData:function(old,newF){
			//console.log(newF)
			if(old.length!=newF.length){
				//将更新过的数组传入视图的函数中
				//console.log(newF)
				this.settings.createView(newF);
				return true;
			}
			return false;
		},
		onHover:function(){
			var that = this;
			this.settings.drag.on('dragenter',function(){
				//移入
				that.settings.onDragenter();
				return false;
			});
		},
		onOut:function(){
			var that = this;
			this.settings.drag.on('drop',function(ev){
				//抬起
				var data = ev.originalEvent.dataTransfer.files;
				that.pushFile(data);
				//that.settings.onDrop();
				
				return false;
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
