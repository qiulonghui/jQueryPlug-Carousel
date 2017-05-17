;(function($){
	function Carousel(poster,setting){
		//默认配置参数
		this.setting = {
			width:1000,
			height:270,
			posterWidth:640,
			posterHeight:270,
			verticalAlign:"middle",
			scale:0.9,
			speed:500
		};
		$.extend(this.setting,setting);
		
		alert(poster.setSettingValue())
		this.setSettingValue();
	};
	
	Carousel.prototype = {
		//设置配置参数去控制基本的宽度高度
		setSettingValue:function(){
			this.poster.css({
				width : 200,
				height : 200
			});
		}
	};
	
	//初始化操作函数，自动把集合中的DOM节点 new为Carousel对象实例。
	Carousel.init = function(posters,setting){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this),setting);
		});
	}
	
	window['Carousel'] = Carousel;
})(jQuery);
