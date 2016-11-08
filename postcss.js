'use strict';
//postcss plugins
const Precss = require('precss');
const Autoprefixer = require('autoprefixer');
const Center = require('postcss-center');
const Circle = require('postcss-circle');
const Sprites = require('postcss-sprites');

module.exports = function() {
    return [
      Autoprefixer, Precss, Center, Circle
     //  Sprites({
     //    retina: true,//支持retina，可以实现合并不同比例图片
	    // verbose: true,
	    // spritePath: '../../build/images/',//雪碧图合并后存放地址
	    // stylesheetPath: './src',
	    // basePath: './',
	    // padding:5
     //    filterBy(image) {
	    //     //过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
	    //     if (image.url.indexOf('/images/sprites/') === -1) {
	    //         return Promise.reject();
	    //     }
	    //     return Promise.resolve();
	    // },
	    // groupBy(image) {
	    // 	console.log(image);
	    //     //将图片分组，可以实现按照文件夹生成雪碧图
	    //     return spritesGroupBy(image);
	    // }
	    // hooks: {
	    //     onUpdateRule(rule, comment, image) {
	    //         //更新生成后的规则，这里主要是改变了生成后的url访问路径
	    //         return spritesOnUpdateRule(true, rule, comment, image);
	    //     },
	    //     onSaveSpritesheet(opts, groups) {
	    //         return spritesOnSaveSpritesheet(true, opts, groups);
	    //     }
	    // }
	  // })
    ];
}

function spritesGroupBy(image) {

    let groups = /\/images\/sprites\/(.*?)\/.*/gi.exec(image.url);
    let groupName = groups ? groups[1] : group;
    image.retina = true;
    image.ratio = 1;
    if (groupName) {
        let ratio = /@(\d+)x$/gi.exec(groupName);
        if (ratio) {
            ratio = ratio[1];
            while (ratio > 10) {
                ratio = ratio / 10;
            }
            image.ratio = ratio;
        }
    }
    return Promise.resolve(groupName);
}

// function spritesOnUpdateRule(isDev, rule, comment, image){
//     var spriteUrl = image.spriteUrl;
//     image.spriteUrl = '/src/' + spriteUrl;
//     postcssSprites.updateRule(rule, comment, image);
// }

// function spritesOnSaveSpritesheet(isDev, opts, groups) {
//     let file = postcssSprites.makeSpritesheetPath(opts, groups);
//     return file;
// }
