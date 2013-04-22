/**
 * Created with JetBrains WebStorm.
 * User: rongwang
 * Date: 13-4-18
 * Time: 下午12:01
 * To change this template use File | Settings | File Templates.
 */


/**
 *
 * 抖动动画类<br/>
 * 提供抖动动画效果，可以对指定的dom(下一个版本可能对指定的panel等做操作)<br/>
 * 测试：可以支持panel
 * @extends Desktop.animation.BaseAnimation
 * @class ShakeAnimation
 * @namespace Desktop.animation
 * @module animation 动画模块
 */
Ext.define('Desktop.animation.ShakeAnimation',{
    extend:'Desktop.animation.BaseAnimation',

    statics:{
        /**
         * 用来存放基本样式
         * @property cls
         */
        cls:{
            shakeClick:'shake_click',
            shakeBase:'shake_base',
            shakeBig:'shake_big'
        },

        /**
         * 抖动方法
         * @method shake
         * @static
         * @param dom 需要抖动的dom
         * @param config 抖动参数
         * @callback callback 回调函数
         */
        shake:function(dom,config,callback){

            if(Ext.typeOf(config) == 'function'){
                callback = config;
                config = {};
            }
            var animation = Desktop.animation.ShakeAnimation,
                el = Ext.get(dom),
                cls =animation.cls;
            el.addCls(cls.shakeBase);
            var shakeO = animation.randomShakeConfig(el,config);
            var callback_=animation.initConfig(el,config);
            Ext.create('Ext.fx.Animator', {
                target: el,
                duration: config.time || 2000,
                keyframes: shakeO.keyFrames,
                listeners:{
                    afteranimate:function(){
                        el.removeCls(cls.shakeBase);
                        if(callback) callback();
                        callback_();
                    }
                }
            });
        },
        /**
         * 上下(纵向)抖动方法
         * @static
         * @method shakeH
         * @param dom 抖动的dom
         */
        shakeH :function(dom){
            Desktop.animation.ShakeAnimation.shake(dom,{left:false});
        },

        /**
         * 左右(水平)抖动方法
         * @static
         * @method shakeV
         * @param dom 抖动的dom
         */
        shakeV:function(dom){
            Desktop.animation.ShakeAnimation.shake(dom,{top:false});
        },

        /**
         * 通过配置，生成当前抖动的样式，比如 滚动过程中加粗，滚动过程中变色，等等
         * @static
         * @param el 抖动dom封装好的el
         * @param config 抖动参数
         * @return {Function}
         */
        initConfig:function(el,config){
            var cls = cls = Desktop.animation.ShakeAnimation.cls;
            var callback_cls = [];
            if(config.bigMore){
                el.addCls(cls.shakeBig);
                callback_cls.push(cls.shakeBig);
            }
            return function(){
                 for(var i=0;i<callback_cls.length;i++){
                        el.removeCls(callback_cls[i]);
                    }
               }
        },

        /**
         * 返回随机抖动的参数对象
         * @protected
         * @param el 抖动dom封装好的el
         * @param config 抖动参数
         * @return {*} 生成的 随机抖动参数{keyFrames:{'这是过程'},callback:{"这是回调"}}
         */
        randomShakeConfig:function(el,config){
            var cls = cls = Desktop.animation.ShakeAnimation.cls;
            var keyFrames = {};
            var top = el.getTop(),left = el.getLeft();
            //设置抖动过程中抖动状态
            for(var i = 0 ; i< 25; i++){
                keyFrames[i*2]={
                    top : top + ((config.top !=null &&config.top == false)?0:Ext.Number.randomInt(-5,5)),
                    left :left +((config.left != null &&config.left == false)?0:Ext.Number.randomInt(-5,5))
                };
                keyFrames[i*2+2]={
                    top:top,
                    left:left
                };
            }
            return {
                keyFrames:keyFrames
            } ;
        },
        /**
         * @method smoothShake
         * @param dom 抖动dom
         * @param config 抖动参数
         */
        smoothShakeConfig:function(dom,config){
            var el = Ext.get(dom),
                top = el.getTop(),left = el.getLeft();
             el.addCls('shakeing');
            var keyFrames = {},directionFlag = 1;
            //设置抖动过程中抖动状态
            for(var i = 0 ; i< 25; i++){
                keyFrames[i*2]={
                    top : top + (config.top !=null &&config.top == false)?0:Ext.Number.randomInt(-5,5),
                    left :left +(config.left != null &&config.left == false)?0:Ext.Number.randomInt(-5,5)
                };
                keyFrames[i*2+2]={
                    top:top,
                    left:left
                };
            }

            Ext.create('Ext.fx.Animator', {
                target: el,
                duration: config.time || 2000,
                keyframes: keyFrames
            });
        },

        /****************/
        /**
         *
         * 给当前dom加单机事件，单机之后会抖动
         * @param dom
         * @param config
         * @param callback
         */
        shakeOnClick:function(dom,config,callback){
            var animation = Desktop.animation.ShakeAnimation,
                el = Ext.get(dom),
                cls =animation.cls;
            el.addCls(cls.shakeClick);
            el.on('click',function(){
                animation.shake(dom,config,callback);
            })
        }
    }
})