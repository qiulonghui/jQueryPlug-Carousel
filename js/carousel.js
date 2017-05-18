;(function($){
	//初始化操作函数，自动把集合中的DOM节点 new为Carousel对象实例。
	Carousel.init = function(posters,setting){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this),setting);
		});
	}
	
	function Carousel(poster,setting){
		var self = this;
		//保存单个旋转木马jQuery对象
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");
		this.nextBtn = poster.find("div.poster-next-btn");
		this.prevBtn = poster.find("div.poster-prev-btn");
		this.posterItems = poster.find("li.poster-item");
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.rotateFlag = true;
		//默认配置参数
		this.setting = {
			width:1000,
			height:270,
			posterWidth:640,
			posterHeight:270,
			verticalAlign:"middle",
			scale:0.9,
			speed:500,
			autoPlay:false,
			delay:5000
		};
		$.extend(this.setting,setting);
		//设置配置参数值
		this.setSettingValue();
		//设置剩余poster的位置关系方法调用
		this.setPosterPos();
		//左旋转按钮
		this.nextBtn.click(function(){
			
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("left");
			}			
		});
		//右旋转按钮
		this.prevBtn.click(function(){
			
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("right");
			}			
		});
		//是否开启自动播放
		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){
				clearInterval(self.time);
			},function(){
				self.autoPlay();
			})
		};
		
	};
	
	Carousel.prototype = {
		//自动播放
		autoPlay:function(){
			var self = this;
			this.time = setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);//setInterval计时器的时间间隔中的this指向实例对象
		},
		//旋转
		carouseRotate:function(dir){
			var _this_ = this;
			if(dir === "left"){
				
				this.posterItems.each(function(){
					
					var self = $(this);
					var prev = self.prev()[0]?self.prev():_this_.posterLastItem;
					var pWidth = prev.width();
					var pHeight = prev.height();
					var pzIndex = prev.css("zIndex");
					var pOpacity = prev.css("opacity");
					var pLeft = prev.css("left");
					var pTop = prev.css("top");
					
					$(this).animate({
									//width:pWidth,
									//height:pHeight,
									zIndex:pzIndex,
									//opacity:pOpacity,
									//left:pLeft,
									//top:pTop			
									},1,function(){
										
										$(this).animate({
														width:pWidth,
														height:pHeight,
														//zIndex:pzIndex,
														opacity:pOpacity,
														left:pLeft,
														top:pTop		
													},_this_.setting.speed,function(){
														_this_.rotateFlag = true;
													});
									});
				});
				
			}else if(dir === "right"){
				
				this.posterItems.each(function(){
					
					var self = $(this);
					var next = self.next()[0]?self.next():_this_.posterFirstItem;
					var nWidth = next.width();
					var nHeight = next.height();
					var nzIndex = next.css("zIndex");
					var nOpacity = next.css("opacity");
					var nLeft = next.css("left");
					var nTop = next.css("top");
					
					$(this).animate({
									//width:nWidth,
									//height:nHeight,
									zIndex:nzIndex,
									//opacity:nOpacity,
									//left:nLeft,
									//top:nTop			
								},1,function(){
										$(this).animate({
														width:nWidth,
														height:nHeight,
														//zIndex:nzIndex,
														opacity:nOpacity,
														left:nLeft,
														top:nTop			
												},_this_.setting.speed,function(){
													_this_.rotateFlag = true;
												});
									});
				});
			};
		},
		
		//设置剩余poster的位置关系
		setPosterPos:function(){
			var self = this;
			var sliceItems = this.posterItems.slice(1);
			var sliceSize = sliceItems.size()/2;
			var rightSlice = sliceItems.slice(0,sliceSize);
			var level = Math.floor(this.posterItems.size()/2);
			
			var leftSlice = sliceItems.slice(sliceSize);
			
			//设置右边poster的位置关系和宽度高度等样式	
			var rw = this.setting.posterWidth;
			var rh = this.setting.posterHeight;
			var gap = ((this.setting.width-this.setting.posterWidth)/2)/level;
			
			var firstLeft = (this.setting.width-this.setting.posterWidth)/2;
			var fixOffsetLeft = firstLeft+rw;
			
			//设置右边poster的位置关系
			rightSlice.each(function(i){
				level--;
				rw = rw*self.setting.scale;
				rh = rh*self.setting.scale;
				$(this).css({
							zIndex:level,
							width:rw,
							height:rh,
							opacity:1/(++i),
							left:fixOffsetLeft+(i)*gap-rw,
							top:self.setVertucalAlign(rh)
						});
			});
			
			//设置左边poster的位置关系
			var lw = rightSlice.last().width();
			var lh = rightSlice.last().height();
			var oloop = Math.floor(this.posterItems.size()/2);
			
			leftSlice.each(function(i){
				
				$(this).css({
							zIndex:level,
							width:lw,
							height:lh,
							opacity:1/(oloop--),
							left:i*gap,
							top:self.setVertucalAlign(lh)
							});
				level++;
				lw=lw/self.setting.scale;
				lh=lh/self.setting.scale;
			});
		},
		
		//设置垂直排列对齐
		setVertucalAlign:function(height){
			var verticalType = this.setting.verticalAlign;
			var top = 0;
			if(verticalType === "middle"){
				top = (this.setting.height-height)/2;
				
			}else if(verticalType === "top"){
				top = 0;
			}else if(verticalType === "bottom"){
				top = this.setting.height-height;
			}else{
				top = (this.setting.height-height)/2;
			};
			return top;
		},
		
		//设置配置参数去控制基本的宽度高度
		setSettingValue:function(){
			this.poster.css({
							width : this.setting.width,
							height : this.setting.height
						});
			this.posterItemMain.css({
							width : this.setting.width,
							height : this.setting.height
						});
			//计算切换按钮的宽度
			var w = (this.setting.width-this.setting.posterWidth)/2;
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.posterItems.size()/2)
			});
		},
	};
	
	
	
	window['Carousel'] = Carousel;
})(jQuery);
