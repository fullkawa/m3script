/**
 * enchant.js v0.3.1
 *
 * Copyright (c) Ubiquitous Entertainment Inc.
 * Dual licensed under the MIT or GPL Version 3 licenses
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if (typeof Object.defineProperty != 'function') {
    Object.defineProperty = function(obj, prop, desc) {
        if ('value' in desc) obj[prop] =  desc.value;
        if ('get' in desc) obj.__defineGetter__(prop, desc.get);
        if ('set' in desc) obj.__defineSetter__(prop, desc.set);
        return obj;
    };
}
if (typeof Object.defineProperties != 'function') {
    Object.defineProperties = function(obj, descs) {
        for (var prop in descs) if (descs.hasOwnProperty(prop))  {
            Object.defineProperty(obj, prop, descs[prop]);
        }
        return obj;
    };
}
if (typeof Object.create != 'function') {
    Object.create = function(prototype, descs) {
        function F() {};
        F.prototype = prototype;
        var obj = new F();
        if (descs != null) Object.defineProperties(obj, descs);
        return obj;
    };
}
if (typeof Object.getPrototypeOf != 'function') {
    Object.getPrototypeOf = function(obj) {
        return obj.__proto__;
    };
}

/**
 * 繧ｰ繝ｭ繝ｼ繝舌Ν縺ｫ繝ｩ繧､繝悶Λ繝ｪ縺ｮ繧ｯ繝ｩ繧ｹ繧偵お繧ｯ繧ｹ繝昴・繝医☆繧・
 *
 * 蠑墓焚縺ｫ菴輔ｂ貂｡縺輔↑縺・ｴ蜷・nchant.js縺ｧ螳夂ｾｩ縺輔ｌ縺溘け繝ｩ繧ｹ蜿翫・繝励Λ繧ｰ繧､繝ｳ縺ｧ螳夂ｾｩ縺輔ｌ縺溘け繝ｩ繧ｹ
 * 蜈ｨ縺ｦ縺後お繧ｯ繧ｹ繝昴・繝医＆繧後ｋ. 蠑墓焚縺御ｸ縺､莉･荳翫・蝣ｴ蜷医・enchant.js縺ｧ螳夂ｾｩ縺輔ｌ縺溘け繝ｩ繧ｹ縺ｮ縺ｿ
 * 縺後ョ繝輔か繝ｫ繝医〒繧ｨ繧ｯ繧ｹ繝昴・繝医＆繧・ 繝励Λ繧ｰ繧､繝ｳ縺ｮ繧ｯ繝ｩ繧ｹ繧偵お繧ｯ繧ｹ繝昴・繝医＠縺溘＞蝣ｴ蜷医・譏守､ｺ逧・↓
 * 繝励Λ繧ｰ繧､繝ｳ縺ｮ隴伜挨蟄舌ｒ蠑墓焚縺ｨ縺励※貂｡縺吝ｿ・ｦ√′縺ゅｋ.
 *
 * @example
 *   enchant();     // 蜈ｨ縺ｦ縺ｮ繧ｯ繝ｩ繧ｹ縺後お繧ｯ繧ｹ繝昴・繝医＆繧後ｋ
 *   enchant('');   // enchant.js譛ｬ菴薙・繧ｯ繝ｩ繧ｹ縺ｮ縺ｿ縺後お繧ｯ繧ｹ繝昴・繝医＆繧後ｋ
 *   enchant('ui'); // enchant.js譛ｬ菴薙・繧ｯ繝ｩ繧ｹ縺ｨui.enchant.js縺ｮ繧ｯ繝ｩ繧ｹ縺後お繧ｯ繧ｹ繝昴・繝医＆繧後ｋ
 *
 * @param {...String} [modules] 繧ｨ繧ｯ繧ｹ繝昴・繝医☆繧九Δ繧ｸ繝･繝ｼ繝ｫ. 隍・焚謖・ｮ壹〒縺阪ｋ.
 */
var enchant = function(modules) {
    if (modules != null) {
        if (!(modules instanceof Array)) {
            modules = Array.prototype.slice.call(arguments);
        }
        modules = modules.filter(function(module) {
            return [module].join();
        });
    }

    (function include(module, prefix) {
        var submodules = [];
        for (var prop in module) if (module.hasOwnProperty(prop)) {
            if (typeof module[prop] == 'function') {
                window[prop] = module[prop];
            } else if (Object.getPrototypeOf(module[prop]) == Object.prototype) {
                if (modules == null) {
                    submodules.push(prop);
                } else {
                    i = modules.indexOf(prefix + prop);
                    if (i != -1) {
                        submodules.push(prop);
                        modules.splice(i, 1);
                    }
                }
            }
        }
        for (var i = 0, len = submodules.length; i < len; i++) {
            include(module[submodules[i]], prefix + submodules[i] + '.');
        }
    })(enchant, '');

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

(function() {

"use strict";

var VENDER_PREFIX = (function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Opera') != -1) {
        return 'O';
    } else if (ua.indexOf('MSIE') != -1) {
        return 'ms';
    } else if (ua.indexOf('WebKit') != -1) {
        return 'webkit';
    } else if (navigator.product == 'Gecko') {
        return 'Moz';
    } else {
        return '';
    }
})();
var TOUCH_ENABLED = (function() {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
})();
var RETINA_DISPLAY = (function() {
    if (navigator.userAgent.indexOf('iPhone') != -1 && window.devicePixelRatio == 2) {
        var viewport = document.querySelector('meta[name="viewport"]');
        if (viewport == null) {
            viewport = document.createElement('meta');
            document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 'width=640px');
        return true;
    } else {
        return false;
    }
})();

// the running instance
var game;

/**
 * 繧ｯ繝ｩ繧ｹ縺ｮ繧ｯ繝ｩ繧ｹ.
 *
 * @param {Function} [superclass] 邯呎価縺吶ｋ繧ｯ繝ｩ繧ｹ.
 * @param {*} definition 繧ｯ繝ｩ繧ｹ螳夂ｾｩ.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 * 繧ｯ繝ｩ繧ｹ繧剃ｽ懈・縺吶ｋ.
 *
 * 縺ｻ縺九・繧ｯ繝ｩ繧ｹ繧堤ｶ呎価縺励◆繧ｯ繝ｩ繧ｹ繧剃ｽ懈・縺吶ｋ蝣ｴ蜷・ 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ縺ｯ繝・ヵ繧ｩ繝ｫ繝医〒
 * 邯呎価蜈・・繧ｯ繝ｩ繧ｹ縺ｮ繧ゅ・縺御ｽｿ繧上ｌ繧・ 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ繧偵が繝ｼ繝舌・繝ｩ繧､繝峨☆繧句ｴ蜷育ｶ呎価蜈・・
 * 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ繧帝←逕ｨ縺吶ｋ縺ｫ縺ｯ譏守､ｺ逧・↓蜻ｼ縺ｳ蜃ｺ縺吝ｿ・ｦ√′縺ゅｋ.
 *
 * @example
 *   var Ball = Class.create({ // 菴輔ｂ邯呎価縺励↑縺・け繝ｩ繧ｹ繧剃ｽ懈・縺吶ｋ
 *       initialize: function(radius) { ... }, // 繝｡繧ｽ繝・ラ螳夂ｾｩ
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Sprite繧堤ｶ呎価縺励◆繧ｯ繝ｩ繧ｹ繧剃ｽ懈・縺吶ｋ
 *   var Ball = Class.create(Sprite, { // Sprite繧堤ｶ呎価縺励◆繧ｯ繝ｩ繧ｹ繧剃ｽ懈・縺吶ｋ
 *       initialize: function(radius) { // 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ繧剃ｸ頑嶌縺阪☆繧・ *          Sprite.call(this, radius*2, radius*2); // 邯呎価蜈・・繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ繧帝←逕ｨ縺吶ｋ
 *          this.image = game.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] 邯呎価縺吶ｋ繧ｯ繝ｩ繧ｹ.
 * @param {*} [definition] 繧ｯ繝ｩ繧ｹ螳夂ｾｩ.
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (arguments.length == 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length == 1 && typeof arguments[0] != 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) if (definition.hasOwnProperty(prop)) {
        if (Object.getPrototypeOf(definition[prop]) == Object.prototype) {
            if (!('enumerable' in definition[prop])) definition[prop].enumerable = true;
        } else {
            definition[prop] = { value: definition[prop], enumerable: true, writable: true };
        }
    }
    var constructor = function() {
        if (this instanceof constructor) {
            constructor.prototype.initialize.apply(this, arguments);
        } else {
            return new constructor();
        }
    };
    constructor.prototype = Object.create(superclass.prototype, definition);
    constructor.prototype.constructor = constructor;
    if (constructor.prototype.initialize == null) {
        constructor.prototype.initialize = function() {
            superclass.apply(this, arguments);
        };
    }
    return constructor;
};

/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     * DOM Event鬚ｨ蜻ｳ縺ｮ迢ｬ閾ｪ繧､繝吶Φ繝亥ｮ溯｣・ｒ陦後▲縺溘け繝ｩ繧ｹ.
     * 縺溘□縺励ヵ繧ｧ繝ｼ繧ｺ縺ｮ讎ょｿｵ縺ｯ縺ｪ縺・
     * @param {String} type Event縺ｮ繧ｿ繧､繝・     * @constructs
     */
    initialize: function(type) {
        /**
         * 繧､繝吶Φ繝医・繧ｿ繧､繝・
         * @type {String}
         */
        this.type = type;
        /**
         * 繧､繝吶Φ繝医・繧ｿ繝ｼ繧ｲ繝・ヨ.
         * @type {*}
         */
        this.target = null;
        /**
         * 繧､繝吶Φ繝育匱逕滉ｽ咲ｽｮ縺ｮx蠎ｧ讓・
         * @type {Number}
         */
        this.x = 0;
        /**
         * 繧､繝吶Φ繝育匱逕滉ｽ咲ｽｮ縺ｮy蠎ｧ讓・
         * @type {Number}
         */
        this.y = 0;
        /**
         * 繧､繝吶Φ繝医ｒ逋ｺ陦後＠縺溘が繝悶ず繧ｧ繧ｯ繝医ｒ蝓ｺ貅悶→縺吶ｋ繧､繝吶Φ繝育匱逕滉ｽ咲ｽｮ縺ｮx蠎ｧ讓・
         * @type {Number}
         */
        this.localX = 0;
        /**
         * 繧､繝吶Φ繝医ｒ逋ｺ陦後＠縺溘が繝悶ず繧ｧ繧ｯ繝医ｒ蝓ｺ貅悶→縺吶ｋ繧､繝吶Φ繝育匱逕滉ｽ咲ｽｮ縺ｮy蠎ｧ讓・
         * @type {Number}
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        this.x = this.localX = (pageX - game._pageX) / game.scale;
        this.y = this.localY = (pageY - game._pageY) / game.scale;
    }
});

/**
 * Game縺ｮ繝ｭ繝ｼ繝牙ｮ御ｺ・凾縺ｫ逋ｺ逕溘☆繧九う繝吶Φ繝・
 *
 * 逕ｻ蜒上・繝励Μ繝ｭ繝ｼ繝峨ｒ陦後≧蝣ｴ蜷医Ο繝ｼ繝峨′螳御ｺ・☆繧九・繧貞ｾ・▲縺ｦ繧ｲ繝ｼ繝髢句ｧ区凾縺ｮ蜃ｦ逅・ｒ陦後≧蠢・ｦ√′縺ゅｋ.
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // 繧ｲ繝ｼ繝髢句ｧ区凾縺ｮ蜃ｦ逅・ｒ險倩ｿｰ
 *   };
 *   game.start();
 *
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 * Game縺ｮ繝ｭ繝ｼ繝蛾ｲ陦御ｸｭ縺ｫ逋ｺ逕溘☆繧九う繝吶Φ繝・
 * 繝励Μ繝ｭ繝ｼ繝峨☆繧狗判蜒上′荳譫壹Ο繝ｼ繝峨＆繧後ｋ蠎ｦ縺ｫ逋ｺ陦後＆繧後ｋ. 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 * 繝輔Ξ繝ｼ繝髢句ｧ区凾縺ｫ逋ｺ逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Node
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * 繝輔Ξ繝ｼ繝邨ゆｺ・凾縺ｫ逋ｺ逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 * Scene縺碁幕蟋九＠縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Scene
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 * Scene縺檎ｵゆｺ・＠縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Scene
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 * Node縺隈roup縺ｫ霑ｽ蜉縺輔ｌ縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 * Node縺郡cene縺ｫ霑ｽ蜉縺輔ｌ縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * Node縺隈roup縺九ｉ蜑企勁縺輔ｌ縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 * Node縺郡cene縺九ｉ蜑企勁縺輔ｌ縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * Node縺ｫ蟇ｾ縺吶ｋ繧ｿ繝・メ縺悟ｧ九∪縺｣縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 繧ｯ繝ｪ繝・け繧ゅち繝・メ縺ｨ縺励※謇ｱ繧上ｌ繧・ 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * Node縺ｫ蟇ｾ縺吶ｋ繧ｿ繝・メ縺檎ｧｻ蜍輔＠縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 繧ｯ繝ｪ繝・け繧ゅち繝・メ縺ｨ縺励※謇ｱ繧上ｌ繧・ 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * Node縺ｫ蟇ｾ縺吶ｋ繧ｿ繝・メ縺檎ｵゆｺ・＠縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 繧ｯ繝ｪ繝・け繧ゅち繝・メ縺ｨ縺励※謇ｱ繧上ｌ繧・ 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * Entity縺後Ξ繝ｳ繝繝ｪ繝ｳ繧ｰ縺輔ｌ繧九→縺阪↓逋ｺ逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Entity
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 * 繝懊ち繝ｳ蜈･蜉帙′蟋九∪縺｣縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * 繝懊ち繝ｳ蜈･蜉帙′螟牙喧縺励◆縺ｨ縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * 繝懊ち繝ｳ蜈･蜉帙′邨ゆｺ・＠縺溘→縺咲匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * left繝懊ち繝ｳ縺梧款縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * left繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * right繝懊ち繝ｳ縺梧款縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * right繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * up繝懊ち繝ｳ縺梧款縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * up繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * down繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * down繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * a繝懊ち繝ｳ縺梧款縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * a繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * b繝懊ち繝ｳ縺梧款縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * b繝懊ち繝ｳ縺碁屬縺輔ｌ縺溽匱逕溘☆繧九う繝吶Φ繝・
 * 逋ｺ陦後☆繧九が繝悶ず繧ｧ繧ｯ繝・ enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';


/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * DOM Event鬚ｨ蜻ｳ縺ｮ迢ｬ閾ｪ繧､繝吶Φ繝亥ｮ溯｣・ｒ陦後▲縺溘け繝ｩ繧ｹ.
     * 縺溘□縺励ヵ繧ｧ繝ｼ繧ｺ縺ｮ讎ょｿｵ縺ｯ縺ｪ縺・
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * 繧､繝吶Φ繝医Μ繧ｹ繝翫ｒ霑ｽ蜉縺吶ｋ.
     * @param {String} type 繧､繝吶Φ繝医・繧ｿ繧､繝・
     * @param {function(e:enchant.Event)} listener 霑ｽ蜉縺吶ｋ繧､繝吶Φ繝医Μ繧ｹ繝・
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) == -1) {
            listeners.unshift(listener);
        }
    },
    /**
     * 繧､繝吶Φ繝医Μ繧ｹ繝翫ｒ蜑企勁縺吶ｋ.
     * @param {String} type 繧､繝吶Φ繝医・繧ｿ繧､繝・
     * @param {function(e:enchant.Event)} listener 蜑企勁縺吶ｋ繧､繝吶Φ繝医Μ繧ｹ繝・
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i != -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     * 繧､繝吶Φ繝医ｒ逋ｺ陦後☆繧・
     * @param {enchant.Event} e 逋ｺ陦後☆繧九う繝吶Φ繝・
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null) this['on' + e.type]();
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});

/**
 * @scope enchant.Game.prototype
 */
enchant.Game = enchant.Class.create(enchant.EventTarget, {
    /**
     * 繧ｲ繝ｼ繝縺ｮ繝｡繧､繝ｳ繝ｫ繝ｼ繝・ 繧ｷ繝ｼ繝ｳ繧堤ｮ｡逅・☆繧九け繝ｩ繧ｹ.
     *
     * 繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ縺ｯ荳縺､縺励°蟄伜惠縺吶ｋ縺薙→縺後〒縺阪★, 縺吶〒縺ｫ繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ縺悟ｭ伜惠縺吶ｋ迥ｶ諷九〒
     * 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ繧貞ｮ溯｡後＠縺溷ｴ蜷域里蟄倥・繧ゅ・縺御ｸ頑嶌縺阪＆繧後ｋ. 蟄伜惠縺吶ｋ繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ縺ｫ縺ｯ
     * enchant.Game.instance縺九ｉ繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪ｋ.
     *
     * @param {Number} width 繧ｲ繝ｼ繝逕ｻ髱｢縺ｮ讓ｪ蟷・
     * @param {Number} height 繧ｲ繝ｼ繝逕ｻ髱｢縺ｮ鬮倥＆.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var initial = true;
        if (game) {
            initial = false;
            game.stop();
        }
        game = enchant.Game.instance = this;

        /**
         * 繧ｲ繝ｼ繝逕ｻ髱｢縺ｮ讓ｪ蟷・
         * @type {Number}
         */
        this.width = width || 320;
        /**
         * 繧ｲ繝ｼ繝逕ｻ髱｢縺ｮ鬮倥＆.
         * @type {Number}
         */
        this.height = height || 320;
        /**
         * 繧ｲ繝ｼ繝縺ｮ陦ｨ遉ｺ蛟咲紫.
         * @type {Number}
         */
        this.scale = 1;

        var stage = document.getElementById('enchant-stage');
        if (!stage) {
            stage = document.createElement('div');
            stage.id = 'enchant-stage';
            stage.style.width = window.innerWidth + 'px';
            stage.style.height = window.innerHeight + 'px';
            stage.style.position = 'absolute';
            if (document.body.firstChild) {
                document.body.insertBefore(stage, document.body.firstChild);
            } else {
                document.body.appendChild(stage);
            }
            this.scale = Math.min(
               window.innerWidth / this.width,
               window.innerHeight / this.height
            );
            this._pageX = 0;
            this._pageY = 0;
        } else {
            var style = window.getComputedStyle(stage);
            width = parseInt(style.width);
            height = parseInt(style.height);
            if (width && height) {
                this.scale = Math.min(
                   width / this.width,
                   height / this.height
                );
            } else {
                stage.style.width = this.width + 'px';
                stage.style.height = this.height + 'px';
            }
            while (stage.firstChild) {
                stage.removeChild(stage.firstChild);
            }
            stage.style.position = 'relative';
            var bounding = stage.getBoundingClientRect();
            this._pageX = Math.round(window.scrollX + bounding.left);
            this._pageY = Math.round(window.scrollY + bounding.top);
        }
        if (!this.scale) this.scale = 1;
        stage.style.fontSize = '12px';
        stage.style.webkitTextSizeAdjust = 'none';
        this._element = stage;

        /**
         * 繧ｲ繝ｼ繝縺ｮ繝輔Ξ繝ｼ繝繝ｬ繝ｼ繝・
         * @type {Number}
         */
        this.fps = 30;
        /**
         * 繧ｲ繝ｼ繝髢句ｧ九°繧峨・繝輔Ξ繝ｼ繝謨ｰ.
         * @type {Number}
         */
        this.frame = 0;
        /**
         * 繧ｲ繝ｼ繝縺悟ｮ溯｡悟庄閭ｽ縺ｪ迥ｶ諷九°縺ｩ縺・°.
         * @type {Boolean}
         */
        this.ready = null;
        /**
         * 繧ｲ繝ｼ繝縺悟ｮ溯｡檎憾諷九°縺ｩ縺・°.
         * @type {Boolean}
         */
        this.running = false;
        /**
         * 繝ｭ繝ｼ繝峨＆繧後◆逕ｻ蜒上ｒ繝代せ繧偵く繝ｼ縺ｨ縺励※菫晏ｭ倥☆繧九が繝悶ず繧ｧ繧ｯ繝・
         * @type {Object.<String, Surface>}
         */
        this.assets = {};
        var assets = this._assets = [];
        (function detectAssets(module) {
            if (module.assets instanceof Array) {
                [].push.apply(assets, module.assets);
            }
            for (var prop in module) if (module.hasOwnProperty(prop)) {
                if (Object.getPrototypeOf(module[prop]) == Object.prototype) {
                    detectAssets(module[prop]);
                }
            }
        })(enchant);

        this._scenes = [];
        /**
         * 迴ｾ蝨ｨ縺ｮScene. Scene繧ｹ繧ｿ繝・け荳ｭ縺ｮ荳逡ｪ荳翫・Scene.
         * @type {enchant.Scene}
         */
        this.currentScene = null;
        /**
         * 繝ｫ繝ｼ繝・cene. Scene繧ｹ繧ｿ繝・け荳ｭ縺ｮ荳逡ｪ荳九・Scene.
         * @type {enchant.Scene}
         */
        this.rootScene = new enchant.Scene();
        this.pushScene(this.rootScene);
        /**
         * 繝ｭ繝ｼ繝・ぅ繝ｳ繧ｰ譎ゅ↓陦ｨ遉ｺ縺輔ｌ繧鬼cene.
         * @type {enchant.Scene}
         */
        this.loadingScene = new enchant.Scene();
        this.loadingScene.backgroundColor = '#000';
        var barWidth = this.width * 0.9 | 0;
        var barHeight = this.width * 0.3 | 0;
        var border = barWidth * 0.05 | 0;
        var bar = new enchant.Sprite(barWidth, barHeight);
        bar.x = (this.width - barWidth) / 2;
        bar.y = (this.height - barHeight) / 2;
        var image = new enchant.Surface(barWidth, barHeight);
        image.context.fillStyle = '#fff';
        image.context.fillRect(0, 0, barWidth, barHeight);
        image.context.fillStyle = '#000';
        image.context.fillRect(border, border, barWidth - border*2, barHeight - border*2);
        bar.image = image;
        var progress = 0, _progress = 0;
        this.addEventListener('progress', function(e) {
            progress = e.loaded / e.total;
        });
        bar.addEventListener('enterframe', function() {
            _progress *= 0.9;
            _progress += progress * 0.1;
            image.context.fillStyle = '#fff';
            image.context.fillRect(border, 0, (barWidth - border*2) * _progress, barHeight);
        });
        this.loadingScene.addChild(bar);

        this._mousedownID = 0;
        this._surfaceID = 0;
        this._soundID = 0;
        this._intervalID = null;

        /**
         * 繧ｲ繝ｼ繝縺ｫ蟇ｾ縺吶ｋ蜈･蜉帷憾諷九ｒ菫晏ｭ倥☆繧九が繝悶ず繧ｧ繧ｯ繝・
         * @type {Object.<String, Boolean>}
         */
        this.input = {};
        this._keybind = {};
        this.keybind(37, 'left');  // Left Arrow
        this.keybind(38, 'up');    // Up Arrow
        this.keybind(39, 'right'); // Right Arrow
        this.keybind(40, 'down');  // Down Arrow

        var c = 0;
        ['left', 'right', 'up', 'down', 'a', 'b'].forEach(function(type) {
            this.addEventListener(type + 'buttondown', function(e) {
                if (!this.input[type]) {
                    this.input[type] = true;
                    this.dispatchEvent(new enchant.Event((c++) ? 'inputchange' : 'inputstart'));
                }
                this.currentScene.dispatchEvent(e);
            });
            this.addEventListener(type + 'buttonup', function(e) {
                if (this.input[type]) {
                    this.input[type] = false;
                    this.dispatchEvent(new enchant.Event((--c) ? 'inputchange' : 'inputend'));
                }
                this.currentScene.dispatchEvent(e);
            });
        }, this);

        if (initial) {
            document.addEventListener('keydown', function(e) {
                game.dispatchEvent(new enchant.Event('keydown'));
                if ((37 <= e.keyCode && e.keyCode <= 40) || e.keyCode == 32) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttondown');
                    game.dispatchEvent(e);
                }
            }, true);
            document.addEventListener('keyup', function(e) {
                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttonup');
                    game.dispatchEvent(e);
                }
            }, true);
            if (TOUCH_ENABLED) {
                document.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
            } else {
                document.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    game._mousedownID++;
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('mousemove', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('mouseup', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
            }
        }
    },
    /**
     * 繝輔ぃ繧､繝ｫ縺ｮ繝励Μ繝ｭ繝ｼ繝峨ｒ陦後≧.
     *
     * 繝励Μ繝ｭ繝ｼ繝峨ｒ陦後≧繧医≧險ｭ螳壹＆繧後◆繝輔ぃ繧､繝ｫ縺ｯenchant.Game#start縺悟ｮ溯｡後＆繧後ｋ縺ｨ縺・     * 繝ｭ繝ｼ繝峨′陦後ｏ繧後ｋ. 蜈ｨ縺ｦ縺ｮ繝輔ぃ繧､繝ｫ縺ｮ繝ｭ繝ｼ繝峨′螳御ｺ・＠縺溘→縺阪・Game繧ｪ繝悶ず繧ｧ繧ｯ繝医°繧瑛oad
     * 繧､繝吶Φ繝医′逋ｺ陦後＆繧・ Game繧ｪ繝悶ず繧ｧ繧ｯ繝医・assets繝励Ο繝代ユ繧｣縺九ｉ逕ｻ蜒上ヵ繧｡繧､繝ｫ縺ｮ蝣ｴ蜷医・
     * Surface繧ｪ繝悶ず繧ｧ繧ｯ繝医→縺励※, 髻ｳ螢ｰ繝輔ぃ繧､繝ｫ縺ｮ蝣ｴ蜷医・Sound繧ｪ繝悶ず繧ｧ繧ｯ繝医→縺励※,
     * 縺昴・莉悶・蝣ｴ蜷医・譁・ｭ怜・縺ｨ縺励※繧｢繧ｯ繧ｻ繧ｹ縺ｧ縺阪ｋ繧医≧縺ｫ縺ｪ繧・
     *
     * 縺ｪ縺翫％縺ｮSurface繧ｪ繝悶ず繧ｧ繧ｯ繝医・enchant.Surface.load繧剃ｽｿ縺｣縺ｦ菴懈・縺輔ｌ縺溘ｂ縺ｮ縺ｧ縺ゅｋ
     * 縺溘ａ逶ｴ謗･逕ｻ蜒乗桃菴懊ｒ陦後≧縺薙→縺ｯ縺ｧ縺阪↑縺・ enchant.Surface.load縺ｮ鬆・ｒ蜿ら・.
     *
     * @example
     *   game.preload('player.gif');
     *   game.onload = function() {
     *      var sprite = new Sprite(32, 32);
     *      sprite.image = game.assets['player.gif']; // 繝代せ蜷阪〒繧｢繧ｯ繧ｻ繧ｹ
     *      ...
     *   };
     *   game.start();
     *
     * @param {...String} assets 繝励Μ繝ｭ繝ｼ繝峨☆繧狗判蜒上・繝代せ. 隍・焚謖・ｮ壹〒縺阪ｋ.
     */
    preload: function(assets) {
        if (!(assets instanceof Array)) {
            assets = Array.prototype.slice.call(arguments);
        }
        [].push.apply(this._assets, assets);
    },
    /**
     * 繝輔ぃ繧､繝ｫ縺ｮ繝ｭ繝ｼ繝峨ｒ陦後≧.
     *
     * @param {String} asset 繝ｭ繝ｼ繝峨☆繧九ヵ繧｡繧､繝ｫ縺ｮ繝代せ.
     * @param {Function} [callback] 繝輔ぃ繧､繝ｫ縺ｮ繝ｭ繝ｼ繝峨′螳御ｺ・＠縺溘→縺阪↓蜻ｼ縺ｳ蜃ｺ縺輔ｌ繧矩未謨ｰ.
     */
    load: function(src, callback) {
        if (callback == null) callback = function() {};

        var ext = src.match(/\.\w+$/)[0];
        if (ext) ext = ext.slice(1).toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'gif':
            case 'png':
                game.assets[src] = enchant.Surface.load(src);
                game.assets[src].addEventListener('load', callback);
                break;
            case 'mp3':
            case 'aac':
            case 'm4a':
            case 'wav':
            case 'ogg':
                game.assets[src] = enchant.Sound.load(src, 'audio/' + ext);
                game.assets[src].addEventListener('load', callback);
                break;
            default:
                var req = new XMLHttpRequest();
                req.open('GET', src, true);
                req.onreadystatechange = function(e) {
                    if (req.readyState == 4) {
                        if (req.status != 200) {
                            throw new Error('Cannot load an asset: ' + src);
                        }

                        var type = req.getResponseHeader('Content-Type') || '';
                        if (type.match(/^image/)) {
                            game.assets[src] = enchant.Surface.load(src);
                            game.assets[src].addEventListener('load', callback);
                        } else if (type.match(/^audio/)) {
                            game.assets[src] = enchant.Sound.load(src, type);
                            game.assets[src].addEventListener('load', callback);
                        } else {
                            game.assets[asset] = req.responseText;
                            callback();
                        }
                    }
                };
                req.send(null);
        }
    },
    /**
     * 繧ｲ繝ｼ繝繧帝幕蟋九☆繧・
     *
     * enchant.Game#fps縺ｧ險ｭ螳壹＆繧後◆繝輔Ξ繝ｼ繝繝ｬ繝ｼ繝医↓蠕薙▲縺ｦenchant.Game#currentScene縺ｮ
     * 繝輔Ξ繝ｼ繝縺ｮ譖ｴ譁ｰ縺瑚｡後ｏ繧後ｋ繧医≧縺ｫ縺ｪ繧・ 繝励Μ繝ｭ繝ｼ繝峨☆繧狗判蜒上′蟄伜惠縺吶ｋ蝣ｴ蜷医・繝ｭ繝ｼ繝峨′
     * 蟋九∪繧翫Ο繝ｼ繝・ぅ繝ｳ繧ｰ逕ｻ髱｢縺瑚｡ｨ遉ｺ縺輔ｌ繧・
     */
    start: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        } else if (this._assets.length) {
            var o = {};
            var assets = this._assets.filter(function(asset) {
                return asset in o ? false : o[asset] = true;
            });
            var loaded = 0;
            for (var i = 0, len = assets.length; i < len; i++) {
                this.load(assets[i], function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    game.dispatchEvent(e);
                    if (loaded == len) {
                        game.removeScene(game.loadingScene);
                        game.dispatchEvent(new enchant.Event('load'));
                    }
                });
            }
            this.pushScene(this.loadingScene);
        } else {
            this.dispatchEvent(new enchant.Event('load'));
        }
        this.currentTime = Date.now();
        this._intervalID = window.setInterval(function() {
            game._tick()
        }, 1000 / this.fps);
        this.running = true;
    },
    _tick: function() {
        var now = Date.now();
        var e = new enchant.Event('enterframe');
        e.elapsed = now - this.currentTime;
        this.currentTime = now;

        var nodes = this.currentScene.childNodes.slice();
        var push = Array.prototype.push;
        while (nodes.length) {
            var node = nodes.pop();
            node.dispatchEvent(e);
            if (node.childNodes) {
                push.apply(nodes, node.childNodes);
            }
        }

        this.currentScene.dispatchEvent(e);
        this.dispatchEvent(e);

        this.dispatchEvent(new enchant.Event('exitframe'));
        this.frame++;
    },
    /**
     * 繧ｲ繝ｼ繝繧貞●豁｢縺吶ｋ.
     *
     * 繝輔Ξ繝ｼ繝縺ｯ譖ｴ譁ｰ縺輔ｌ縺・ 繝励Ξ繧､繝､繝ｼ縺ｮ蜈･蜉帙ｂ蜿励￠莉倥￠縺ｪ縺上↑繧・
     * enchant.Game#start縺ｧ蜀埼幕縺ｧ縺阪ｋ.
     */
    stop: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
        this.running = false;
    },
    /**
     * 繧ｲ繝ｼ繝繧剃ｸ譎ょ●豁｢縺吶ｋ.
     *
     * 繝輔Ξ繝ｼ繝縺ｯ譖ｴ譁ｰ縺輔ｌ縺・ 繝励Ξ繧､繝､繝ｼ縺ｮ蜈･蜉帙・蜿励￠莉倥￠繧・
     * enchant.Game#start縺ｧ蜀埼幕縺ｧ縺阪ｋ.
     */
    pause: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
    },
    /**
     * 譁ｰ縺励＞Scene縺ｫ遘ｻ陦後☆繧・
     *
     * Scene縺ｯ繧ｹ繧ｿ繝・け迥ｶ縺ｫ邂｡逅・＆繧後※縺翫ｊ, 陦ｨ遉ｺ鬆・ｺ上ｂ繧ｹ繧ｿ繝・け縺ｫ遨阪∩荳翫￡繧峨ｌ縺滄・↓蠕薙≧.
     * enchant.Game#pushScene繧定｡後≧縺ｨScene繧偵せ繧ｿ繝・け縺ｮ荳逡ｪ荳翫↓遨阪・縺薙→縺後〒縺阪ｋ. 繧ｹ繧ｿ繝・け縺ｮ
     * 荳逡ｪ荳翫・Scene縺ｫ蟇ｾ縺励※縺ｯ繝輔Ξ繝ｼ繝縺ｮ譖ｴ譁ｰ縺瑚｡後ｏ繧後ｋ.
     *
     * @param {enchant.Scene} scene 遘ｻ陦後☆繧区眠縺励＞Scene.
     * @return {enchant.Scene} 譁ｰ縺励＞Scene.
     */
    pushScene: function(scene) {
        this._element.appendChild(scene._element);
        if (this.currentScene) {
            this.currentScene.dispatchEvent(new enchant.Event('exit'));
        }
        this.currentScene = scene;
        this.currentScene.dispatchEvent(new enchant.Event('enter'));
        return this._scenes.push(scene);
    },
    /**
     * 迴ｾ蝨ｨ縺ｮScene繧堤ｵゆｺ・＆縺帛燕縺ｮScene縺ｫ謌ｻ繧・
     *
     * Scene縺ｯ繧ｹ繧ｿ繝・け迥ｶ縺ｫ邂｡逅・＆繧後※縺翫ｊ, 陦ｨ遉ｺ鬆・ｺ上ｂ繧ｹ繧ｿ繝・け縺ｫ遨阪∩荳翫￡繧峨ｌ縺滄・↓蠕薙≧.
     * enchant.Game#popScene繧定｡後≧縺ｨ繧ｹ繧ｿ繝・け縺ｮ荳逡ｪ荳翫・Scene繧貞叙繧雁・縺吶％縺ｨ縺後〒縺阪ｋ.
     *
     * @return {enchant.Scene} 邨ゆｺ・＆縺帙◆Scene.
     */
    popScene: function() {
        if (this.currentScene == this.rootScene) {
            return;
        }
        this._element.removeChild(this.currentScene._element);
        this.currentScene.dispatchEvent(new enchant.Event('exit'));
        this.currentScene = this._scenes[this._scenes.length-2];
        this.currentScene.dispatchEvent(new enchant.Event('enter'));
        return this._scenes.pop();
    },
    /**
     * 迴ｾ蝨ｨ縺ｮScene繧貞挨縺ｮScene縺ｫ縺翫″縺九∴繧・
     *
     * enchant.Game#popScene, enchant.Game#pushScene繧貞酔譎ゅ↓陦後≧.
     *
     * @param {enchant.Scene} scene 縺翫″縺九∴繧鬼cene.
     * @return {enchant.Scene} 譁ｰ縺励＞Scene.
     */
    replaceScene: function(scene) {
        this.popScene();
        return this.pushScene(scene);
    },
    /**
     * Scene蜑企勁縺吶ｋ.
     *
     * Scene繧ｹ繧ｿ繝・け荳ｭ縺九ｉScene繧貞炎髯､縺吶ｋ.
     *
     * @param {enchant.Scene} scene 蜑企勁縺吶ｋScene.
     * @return {enchant.Scene} 蜑企勁縺励◆Scene.
     */
    removeScene: function(scene) {
        if (this.currentScene == scene) {
            return this.popScene();
        } else {
            var i = this._scenes.indexOf(scene);
            if (i != -1) {
                this._scenes.splice(i, 1);
                this._element.removeChild(scene._element);
                return scene;
            }
        }
    },
    /**
     * 繧ｭ繝ｼ繝舌う繝ｳ繝峨ｒ險ｭ螳壹☆繧・
     *
     * 繧ｭ繝ｼ蜈･蜉帙ｒleft, right, up, down, a, b縺・★繧後°縺ｮ繝懊ち繝ｳ蜈･蜉帙→縺励※蜑ｲ繧雁ｽ薙※繧・
     *
     * @param {Number} key 繧ｭ繝ｼ繝舌う繝ｳ繝峨ｒ險ｭ螳壹☆繧九く繝ｼ繧ｳ繝ｼ繝・
     * @param {String} button 蜑ｲ繧雁ｽ薙※繧九・繧ｿ繝ｳ.
     */
    keybind: function(key, button) {
        this._keybind[key] = button;
    }
});

/**
 * 迴ｾ蝨ｨ縺ｮGame繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ.
 * @type {enchant.Game}
 * @static
 */
enchant.Game.instance = null;

/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * Scene繧偵Ν繝ｼ繝医→縺励◆陦ｨ遉ｺ繧ｪ繝悶ず繧ｧ繧ｯ繝医ヤ繝ｪ繝ｼ縺ｫ螻槭☆繧九が繝悶ず繧ｧ繧ｯ繝医・蝓ｺ蠎輔け繝ｩ繧ｹ.
     * 逶ｴ謗･菴ｿ逕ｨ縺吶ｋ縺薙→縺ｯ縺ｪ縺・
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * Node縺ｮ隕ｪNode.
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         * Node縺悟ｱ槭＠縺ｦ縺・ｋScene.
         * @type {enchant.Scene}
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
    },
    /**
     * Node繧堤ｧｻ蜍輔☆繧・
     * @param {Number} x 遘ｻ蜍募・縺ｮx蠎ｧ讓・
     * @param {Number} y 遘ｻ蜍募・縺ｮy蠎ｧ讓・
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._updateCoordinate();
    },
    /**
     * Node繧堤ｧｻ蜍輔☆繧・
     * @param {Number} x 遘ｻ蜍輔☆繧休霆ｸ譁ｹ蜷代・霍晞屬.
     * @param {Number} y 遘ｻ蜍輔☆繧及霆ｸ譁ｹ蜷代・霍晞屬.
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._updateCoordinate();
    },
    /**
     * Node縺ｮx蠎ｧ讓・
     * @type {Number}
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            this._updateCoordinate();
        }
    },
    /**
     * Node縺ｮy蠎ｧ讓・
     * @type {Number}
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            this._updateCoordinate();
        }
    },
    _updateCoordinate: function() {
        if (this.parentNode) {
            this._offsetX = this.parentNode._offsetX + this._x;
            this._offsetY = this.parentNode._offsetY + this._y;
        } else {
            this._offsetX = this._x;
            this._offsetY = this._y;
        }
    }
});

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * DOM荳翫〒陦ｨ遉ｺ縺吶ｋ螳滉ｽ薙ｒ謖√▲縺溘け繝ｩ繧ｹ.逶ｴ謗･菴ｿ逕ｨ縺吶ｋ縺薙→縺ｯ縺ｪ縺・
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        enchant.Node.call(this);

        this._element = document.createElement('div');
        this._style = this._element.style;
        this._style.position = 'absolute';

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        /**
         * Entity縺ｫ繝懊ち繝ｳ縺ｮ讖溯・繧定ｨｭ螳壹☆繧・
         * Entity縺ｫ蟇ｾ縺吶ｋ繧ｿ繝・メ, 繧ｯ繝ｪ繝・け繧値eft, right, up, down, a, b縺・★繧後°縺ｮ
         * 繝懊ち繝ｳ蜈･蜉帙→縺励※蜑ｲ繧雁ｽ薙※繧・
         * @type {String}
         */
        this.buttonMode = null;
        /**
         * Entity縺梧款縺輔ｌ縺ｦ縺・ｋ縺九←縺・°.
         * buttonMode縺瑚ｨｭ螳壹＆繧後※縺・ｋ縺ｨ縺阪□縺第ｩ溯・縺吶ｋ.
         * @type {Boolean}
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = true;
            var e = new Event(button + 'buttondown');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = false;
            var e = new Event(button + 'buttonup');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });

        var that = this;
        var render = function() {
            that.dispatchEvent(new enchant.Event('render'));
        };
        this.addEventListener('addedtoscene', function() {
            render();
            game.addEventListener('exitframe', render);
        });
        this.addEventListener('removedfromscene', function() {
            game.removeEventListener('exitframe', render);
        });
        this.addEventListener('render', function() {
            if (this._offsetX != this._previousOffsetX) {
                this._style.left = this._offsetX + 'px';
            }
            if (this._offsetY != this._previousOffsetY) {
                this._style.top = this._offsetY + 'px';
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });

        var that = this;
        if (TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
     * Entity縺ｮ讓ｪ蟷・
     * @type {Number}
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._style.width = (this._width = width) + 'px';
        }
    },
    /**
     * Entity縺ｮ鬮倥＆.
     * @type {Number}
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._style.height = (this._height = height) + 'px';
        }
    },
    /**
     * Entity縺ｮ閭梧勹濶ｲ.
     * CSS縺ｮ'color'繝励Ο繝代ユ繧｣縺ｨ蜷梧ｧ倥・蠖｢蠑上〒謖・ｮ壹〒縺阪ｋ.
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    /**
     * Entity縺ｮ騾乗・蠎ｦ.
     * 0縺九ｉ1縺ｾ縺ｧ縺ｮ蛟､繧定ｨｭ螳壹☆繧・0縺悟ｮ悟・縺ｪ騾乗・, 1縺悟ｮ悟・縺ｪ荳埼乗・).
     * @type {Number}
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._style.opacity = this._opacity = opacity;
        }
    },
    /**
     * Entity繧定｡ｨ遉ｺ縺吶ｋ縺九←縺・°繧呈欠螳壹☆繧・
     * @type {Boolean}
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            if (this._visible = visible) {
                this._style.display = 'block';
            } else {
                this._style.display = 'none';
            }
        }
    },
    /**
     * Entity縺ｮ繧ｿ繝・メ繧呈怏蜉ｹ縺ｫ縺吶ｋ縺九←縺・°繧呈欠螳壹☆繧・
     * @type {Boolean}
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            if (this._touchEnabled = enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
     * Entity縺ｮ遏ｩ蠖｢縺御ｺ､蟾ｮ縺励※縺・ｋ縺九←縺・°縺ｫ繧医ｊ陦晉ｪ∝愛螳壹ｒ陦後≧.
     * @param {*} other 陦晉ｪ∝愛螳壹ｒ陦後≧Entity縺ｪ縺ｩx, y, width, height繝励Ο繝代ユ繧｣繧呈戟縺｣縺欅bject.
     * @return {Boolean} 陦晉ｪ∝愛螳壹・邨先棡.
     */
    intersect: function(other) {
        return this.x < other.x + other.width && other.x < this.x + this.width &&
            this.y < other.y + other.height && other.y < this.y + this.height;
    },
    /**
     * Entity縺ｮ荳ｭ蠢・せ縺ｩ縺・＠縺ｮ霍晞屬縺ｫ繧医ｊ陦晉ｪ∝愛螳壹ｒ陦後≧.
     * @param {*} other 陦晉ｪ∝愛螳壹ｒ陦後≧Entity縺ｪ縺ｩx, y, width, height繝励Ο繝代ユ繧｣繧呈戟縺｣縺欅bject.
     * @param {Number} [distance] 陦晉ｪ√＠縺溘→隕九↑縺呎怙螟ｧ縺ｮ霍晞屬. 繝・ヵ繧ｩ繝ｫ繝亥､縺ｯ莠後▽縺ｮEntity縺ｮ讓ｪ蟷・→鬮倥＆縺ｮ蟷ｳ蝮・
     * @return {Boolean} 陦晉ｪ∝愛螳壹・邨先棡.
     */
    within: function(other, distance) {
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this.x - other.x + (this.width - other.width) / 2) * _ +
            (_ = this.y - other.y + (this.height - other.height) / 2) * _ < distance * distance;
    }
});

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * 逕ｻ蜒剰｡ｨ遉ｺ讖溯・繧呈戟縺｣縺溘け繝ｩ繧ｹ.
     *
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = game.assets['chara1.gif'];
     *
     * @param {Number} [width] Sprite縺ｮ讓ｪ蟷・
     * @param {Number} [height] Sprite縺ｮ鬮倥＆.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0;
        this._dirty = false;
        this._image = null;
        this._frame = 0;

        this._style.overflow = 'hidden';

        this.addEventListener('render', function() {
            if (this._dirty) {
                this._style[VENDER_PREFIX + 'Transform'] = [
                    'rotate(', this._rotation, 'deg)',
                    'scale(', this._scaleX, ',', this._scaleY, ')'
                ].join('');
                this._dirty = false;
            }
        });
    },
    /**
     * Sprite縺ｧ陦ｨ遉ｺ縺吶ｋ逕ｻ蜒・
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image == this._image) return;

            if (this._image != null) {
                if (this._image.css) {
                    this._style.backgroundImage = '';
                } else if (this._element.firstChild) {
                    this._element.removeChild(this._element.firstChild);
                    if (this._dirtyListener) {
                        this.removeEventListener('render', this._dirtyListener);
                        this._dirtyListener = null;
                    } else {
                        this._image._parent = null;
                    }
                }
            }

            if (image != null) {
                if (image._css) {
                    this._style.backgroundImage = image._css;
                } else if (image._parent) {
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image._element, 0, 0);
                    this._dirtyListener = function() {
                        if (image._dirty) {
                            context.drawImage(image._element);
                            image._dirty = false;
                        }
                    };
                    this.addEventListener('render', this._dirtyListener);
                    this._element.appendChild(canvas);
                } else {
                    image._parent = this;
                    this._element.appendChild(image._element);
                }
            }

            this._image = image;
       }
    },
    /**
     * 陦ｨ遉ｺ縺吶ｋ繝輔Ξ繝ｼ繝縺ｮ繧､繝ｳ繝・ャ繧ｯ繧ｹ.
     * Sprite縺ｨ蜷後§讓ｪ蟷・→鬮倥＆繧呈戟縺｣縺溘ヵ繝ｬ繝ｼ繝縺景mage繝励Ο繝代ユ繧｣縺ｮ逕ｻ蜒上↓蟾ｦ荳翫°繧蛾・↓
     * 驟榊・縺輔ｌ縺ｦ縺・ｋ縺ｨ隕九※, 0縺九ｉ蟋九∪繧九う繝ｳ繝・ャ繧ｯ繧ｹ繧呈欠螳壹☆繧九％縺ｨ縺ｧ繝輔Ξ繝ｼ繝繧貞・繧頑崛縺医ｋ.
     * @type {Number}
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            this._frame = frame;
            var row = this._image.width / this._width | 0;
            if (this._image._css) {
                this._style.backgroundPosition = [
                    -(frame % row) * this._width, 'px ',
                    -(frame / row | 0) * this._height, 'px'
                ].join('');
            } else if (this._element.firstChild) {
                var style = this._element.firstChild.style;
                style.left = -(frame % row) * this._width + 'px';
                style.top = -(frame / row | 0) * this._height + 'px';
            }
        }
    },
    /**
     * Sprite繧呈僑螟ｧ邵ｮ蟆上☆繧・
     * @param {Number} x 諡｡螟ｧ縺吶ｋx霆ｸ譁ｹ蜷代・蛟咲紫.
     * @param {Number} [y] 諡｡螟ｧ縺吶ｋy霆ｸ譁ｹ蜷代・蛟咲紫.
     */
    scale: function(x, y) {
        if (y == null) y = x;
        this._scaleX *= x;
        this._scaleY *= y;
        this._dirty = true;
    },
    /**
     * Sprite繧貞屓霆｢縺吶ｋ.
     * @param {Number} deg 蝗櫁ｻ｢縺吶ｋ隗貞ｺｦ (蠎ｦ謨ｰ豕・.
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     * Sprite縺ｮx霆ｸ譁ｹ蜷代・蛟咲紫.
     * @type {Number}
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            this._dirty = true;
        }
    },
    /**
     * Sprite縺ｮy霆ｸ譁ｹ蜷代・蛟咲紫.
     * @type {Number}
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            this._dirty = true;
        }
    },
    /**
     * Sprite縺ｮ蝗櫁ｻ｢隗・(蠎ｦ謨ｰ豕・.
     * @type {Number}
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    }
});

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * Label繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ菴懈・縺吶ｋ.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.text = text;
    },
    /**
     * 陦ｨ遉ｺ縺吶ｋ繝・く繧ｹ繝・
     * @type {String}
     */
    text: {
        get: function() {
            return this._element.innerHTML;
        },
        set: function(text) {
            this._element.innerHTML = text;
        }
    },
    /**
     * 繝輔か繝ｳ繝医・謖・ｮ・
     * CSS縺ｮ'font'繝励Ο繝代ユ繧｣縺ｨ蜷梧ｧ倥・蠖｢蠑上〒謖・ｮ壹〒縺阪ｋ.
     * @type {String}
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
        }
    },
    /**
     * 譁・ｭ苓牡縺ｮ謖・ｮ・
     * CSS縺ｮ'color'繝励Ο繝代ユ繧｣縺ｨ蜷梧ｧ倥・蠖｢蠑上〒謖・ｮ壹〒縺阪ｋ.
     * @type {String}
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    }
});

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * 繧ｿ繧､繝ｫ繧ｻ繝・ヨ縺九ｉ繝槭ャ繝励ｒ逕滓・縺励※陦ｨ遉ｺ縺吶ｋ繧ｯ繝ｩ繧ｹ.
     *
     * @param {Number} tileWidth 繧ｿ繧､繝ｫ縺ｮ讓ｪ蟷・
     * @param {Number} tileHeight 繧ｿ繧､繝ｫ縺ｮ鬮倥＆.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        enchant.Entity.call(this);

        var canvas = document.createElement('canvas');
        if (RETINA_DISPLAY && game.scale == 2) {
            canvas.width = game.width * 2;
            canvas.height = game.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = game.width;
            canvas.height = game.height;
        }
        this._element.appendChild(canvas);
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [[[]]];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
         * 繧ｿ繧､繝ｫ縺瑚｡晉ｪ∝愛螳壹ｒ謖√▽縺九ｒ陦ｨ縺吝､縺ｮ莠悟・驟榊・.
         * @type {Array.<Array.<Number>>}
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function() {
            if (this._dirty || this._previousOffsetX == null) {
                this._dirty = false;
                this.redraw(0, 0, game.width, game.height);
            } else if (this._offsetX != this._previousOffsetX ||
                       this._offsetY != this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + game.width;
                    var w2 = px - x + game.width;
                    var h1 = y - py + game.height;
                    var h2 = py - y + game.height;
                    if (w1 > this._tileWidth && w2 > this._tileWidth &&
                        h1 > this._tileHeight && h2 > this._tileHeight) {
                        var sx, sy, dx, dy, sw, sh;
                        if (w1 < w2) {
                            sx = 0;
                            dx = px - x;
                            sw = w1;
                        } else {
                            sx = x - px;
                            dx = 0;
                            sw = w2;
                        }
                        if (h1 < h2) {
                            sy = 0;
                            dy = py - y;
                            sh = h1;
                        } else {
                            sy = y - py;
                            dy = 0;
                            sh = h2;
                        }

                        if (game._buffer == null) {
                            game._buffer = document.createElement('canvas');
                            game._buffer.width = this._context.canvas.width;
                            game._buffer.height = this._context.canvas.height;
                        }
                        var context = game._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw*2, sh*2);
                            context.drawImage(this._context.canvas,
                                sx*2, sy*2, sw*2, sh*2, 0, 0, sw*2, sh*2);
                            context = this._context;
                            context.clearRect(dx*2, dy*2, sw*2, sh*2);
                            context.drawImage(game._buffer,
                                0, 0, sw*2, sh*2, dx*2, dy*2, sw*2, sh*2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(game._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx == 0) {
                            this.redraw(sw, 0, game.width - sw, game.height);
                        } else {
                            this.redraw(0, 0, game.width - sw, game.height);
                        }
                        if (dy == 0) {
                            this.redraw(0, sh, game.width, game.height - sh);
                        } else {
                            this.redraw(0, 0, game.width, game.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, game.width, game.height);
                    }
                } else {
                    this.redraw(0, 0, game.width, game.height);
                }
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });
    },
    /**
     * 繝・・繧ｿ繧定ｨｭ螳壹☆繧・
     * 繧ｿ繧､繝ｫ縺後′image繝励Ο繝代ユ繧｣縺ｮ逕ｻ蜒上↓蟾ｦ荳翫°繧蛾・↓驟榊・縺輔ｌ縺ｦ縺・ｋ縺ｨ隕九※, 0縺九ｉ蟋九∪繧・     * 繧､繝ｳ繝・ャ繧ｯ繧ｹ縺ｮ莠悟・驟榊・繧定ｨｭ螳壹☆繧・隍・焚謖・ｮ壹＆繧後◆蝣ｴ蜷医・蠕後・繧ゅ・縺九ｉ鬆・↓陦ｨ遉ｺ縺輔ｌ繧・
     * @param {...Array<Array.<Number>>} data 繧ｿ繧､繝ｫ縺ｮ繧､繝ｳ繝・ャ繧ｯ繧ｹ縺ｮ莠悟・驟榊・. 隍・焚謖・ｮ壹〒縺阪ｋ.
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            var data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) c++;
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
     * Map荳翫↓髫懷ｮｳ迚ｩ縺後≠繧九°縺ｩ縺・°繧貞愛螳壹☆繧・
     * @param {Number} x 蛻､螳壹ｒ陦後≧繝槭ャ繝嶺ｸ翫・轤ｹ縺ｮx蠎ｧ讓・
     * @param {Number} y 蛻､螳壹ｒ陦後≧繝槭ャ繝嶺ｸ翫・轤ｹ縺ｮy蠎ｧ讓・
     * @return {Boolean} 髫懷ｮｳ迚ｩ縺後≠繧九°縺ｩ縺・°.
     */
    hitTest: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        if (this.collisionData != null) {
            return this.collisionData[y] && !!this.collisionData[y][x];
        } else {
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var n;
                if (data[y] != null && (n = data[y][x]) != null &&
                    0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * Map縺ｧ陦ｨ遉ｺ縺吶ｋ繧ｿ繧､繝ｫ繧ｻ繝・ヨ逕ｻ蜒・
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;
            if (RETINA_DISPLAY && game.scale == 2) {
                var img = new Surface(image.width * 2, image.height * 2);
                var tileWidth = this._tileWidth || image.width;
                var tileHeight = this._tileHeight || image.height;
                var row = image.width / tileWidth | 0;
                var col = image.height / tileHeight | 0;
                for (var y = 0; y < col; y++) {
                    for (var x = 0; x < row; x++) {
                        img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                            x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                    }
                }
                this._doubledImage = img;
            }
            this._dirty = true;
        }
    },
    /**
     * Map縺ｮ繧ｿ繧､繝ｫ縺ｮ讓ｪ蟷・
     * @type {Number}
     */
    tileWidth: {
        get: function() {
            return this._tileWidth;
        },
        set: function(tileWidth) {
            this._tileWidth = tileWidth;
            this._dirty = true;
        }
    },
    /**
     * Map縺ｮ繧ｿ繧､繝ｫ縺ｮ鬮倥＆.
     * @type {Number}
     */
    tileHeight: {
        get: function() {
            return this._tileHeight;
        },
        set: function(tileHeight) {
            this._tileHeight = tileHeight;
            this._dirty = true;
        }
    },
    /**
     * @private
     */
    width: {
        get: function() {
            return this._tileWidth * this._data[0][0].length
        }
    },
    /**
     * @private
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length
        }
    },
    /**
     * @private
     */
    redraw: function(x, y, width, height) {
        if (this._image == null) {
            return;
        }

        var image, tileWidth, tileHeight, dx, dy;
        if (this._doubledImage) {
            image = this._doubledImage;
            tileWidth = this._tileWidth * 2;
            tileHeight = this._tileHeight * 2;
            dx = -this._offsetX * 2;
            dy = -this._offsetY * 2;
            x *= 2;
            y *= 2;
            width *= 2;
            height *= 2;
        } else {
            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;
        }
        var row = image.width / tileWidth | 0;
        var col = image.height / tileHeight | 0;
        var left = Math.max((x + dx) / tileWidth | 0, 0);
        var top = Math.max((y + dy) / tileHeight | 0, 0);
        var right = Math.ceil((x + dx + width) / tileWidth);
        var bottom = Math.ceil((y + dy + height) / tileHeight);

        var source = image._element;
        var context = this._context;
        var canvas = context.canvas;
        context.clearRect(x, y, width, height);
        for (var i = 0, len = this._data.length; i < len; i++) {
            var data = this._data[i];
            var r = Math.min(right, data[0].length);
            var b = Math.min(bottom, data.length);
            for (y = top; y < b; y++) {
                for (x = left; x < r; x++) {
                    var n = data[y][x];
                    if (0 <= n && n < row * col) {
                        var sx = (n % row) * tileWidth;
                        var sy = (n / row | 0) * tileHeight;
                        context.drawImage(source, sx, sy, tileWidth, tileHeight,
                            x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                    }
                }
            }
        }
    }
});

/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * 隍・焚縺ｮNode繧貞ｭ舌↓謖√▽縺薙→縺後〒縺阪ｋ繧ｯ繝ｩ繧ｹ.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // player縺ｮ蠎ｧ讓吶↓蠕薙▲縺ｦ蜈ｨ菴薙ｒ繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ縺吶ｋ
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        enchant.Node.call(this);

        /**
         * 蟄舌・Node.
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        this._x = 0;
        this._y = 0;
    },
    /**
     * Group縺ｫNode繧定ｿｽ蜉縺吶ｋ.
     * @param {enchant.Node} node 霑ｽ蜉縺吶ｋNode.
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            var e = new enchant.Event('addedtoscene');
            node.scene = this.scene;
            node.dispatchEvent(e);
            node._updateCoordinate();

            var fragment = document.createDocumentFragment();
            var nodes;
            var push = Array.prototype.push;
            if (node._element) {
                fragment.appendChild(node._element);
            } else if (node.childNodes) {
                nodes = node.childNodes.slice().reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = this.scene;
                    node.dispatchEvent(e);
                    if (node._element) {
                        fragment.appendChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.reverse());
                    }
                }
            }
            if (!fragment.childNodes.length) return;

            var nextSibling, thisNode = this;
            while (thisNode.parentNode) {
                nodes = thisNode.parentNode.childNodes;
                nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    if (node._element) {
                        nextSibling = node._element;
                        break;
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.slice().reverse());
                    }
                }
                thisNode = thisNode.parentNode;
            }
            if (nextSibling) {
                this.scene._element.insertBefore(fragment, nextSibling);
            } else {
                this.scene._element.appendChild(fragment);
            }
        }
    },
    /**
     * Group縺ｫNode繧呈諺蜈･縺吶ｋ.
     * @param {enchant.Node} node 謖ｿ蜈･縺吶ｋNode.
     * @param {enchant.Node} reference 謖ｿ蜈･菴咲ｽｮ縺ｮ蜑阪↓縺ゅｋNode.
     */
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i != -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                var e = new enchant.Event('addedtoscene');
                node.scene = this.scene;
                node.dispatchEvent(e);
                node._updateCoordinate();

                var fragment = document.createDocumentFragment();
                var nodes;
                var push = Array.prototype.push;
                if (node._element) {
                    fragment.appendChild(node._element);
                } else if (node.childNodes) {
                    nodes = node.childNodes.slice().reverse();
                    while (nodes.length) {
                        node = nodes.pop();
                        node.scene = this.scene;
                        node.dispatchEvent(e);
                        if (node._element) {
                            fragment.appendChild(node._element);
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.reverse());
                        }
                    }
                }
                if (!fragment.childNodes.length) return;

                var nextSibling, thisNode = reference;
                while (thisNode.parentNode) {
                    if (i != null) {
                        nodes = this.childNodes.slice(i+1).reverse();
                        i = null;
                    } else {
                        nodes = thisNode.parentNode.childNodes;
                        nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                    }
                    while (nodes.length) {
                        node = nodes.pop();
                        if (node._element) {
                            nextSibling = node._element;
                            break;
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.slice().reverse());
                        }
                    }
                    thisNode = thisNode.parentNode;
                }
                if (nextSibling) {
                    this.scene._element.insertBefore(fragment, nextSibling);
                } else {
                    this.scene._element.appendChild(fragment);
                }
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     * Group縺九ｉNode繧貞炎髯､縺吶ｋ.
     * @param {enchant.Node} node 蜑企勁縺吶ｋNode.
     */
    removeChild: function(node) {
        var i = this.childNodes.indexOf(node);
        if (i != -1) {
            this.childNodes.splice(i, 1);
        } else {
            return;
        }
        node.parentNode = null;
        node.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) {
            var e = new enchant.Event('removedfromscene');
            node.scene = null;
            node.dispatchEvent(e);
            if (node._element) {
                this.scene._element.removeChild(node._element);
            } else if (node.childNodes) {
                var nodes = node.childNodes.slice();
                var push = Array.prototype.push;
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = null;
                    node.dispatchEvent(e);
                    if (node._element) {
                        this.scene._element.removeChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
            }
        }
    },
    /**
     * 譛蛻昴・蟄侵ode.
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * 譛蠕後・蟄侵ode.
     * @type {enchant.Node}
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length-1];
        }
    },
    _updateCoordinate: function() {
        if (this.parentNode) {
            this._offsetX = this.parentNode._offsetX + this._x;
            this._offsetY = this.parentNode._offsetY + this._y;
        } else {
            this._offsetX = this._x;
            this._offsetY = this._y;
        }
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
    }
});

/**
 * @scope enchant.Scene.prototype
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     * 陦ｨ遉ｺ繧ｪ繝悶ず繧ｧ繧ｯ繝医ヤ繝ｪ繝ｼ縺ｮ繝ｫ繝ｼ繝医↓縺ｪ繧九け繝ｩ繧ｹ.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        enchant.Group.call(this);

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style.width = (this.width = game.width) + 'px';
        this._element.style.height = (this.height = game.height) + 'px';
        this._element.style[VENDER_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[VENDER_PREFIX + 'Transform'] = 'scale(' +  game.scale + ')';

        this.scene = this;

        var that = this;
        if (TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
     * Scene縺ｮ閭梧勹濶ｲ.
     * CSS縺ｮ'color'繝励Ο繝代ユ繧｣縺ｨ蜷梧ｧ倥・蠖｢蠑上〒謖・ｮ壹〒縺阪ｋ.
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    _updateCoordinate: function() {
        this._offsetX = this._x;
        this._offsetY = this._y;
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
    }
});

var CANVAS_DRAWING_METHODS = [
    'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
    'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
];

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * canvas隕∫ｴ繧偵Λ繝・・縺励◆繧ｯ繝ｩ繧ｹ.
     *
     * Sprite繧Мap縺ｮimage繝励Ο繝代ユ繧｣縺ｫ險ｭ螳壹＠縺ｦ陦ｨ遉ｺ縺輔○繧九％縺ｨ縺後〒縺阪ｋ.
     * Canvas API縺ｫ繧｢繧ｯ繧ｻ繧ｹ縺励◆縺・→縺阪・context繝励Ο繝代ユ繧｣繧堤畑縺・ｋ.
     *
     * @example
     *   // 蜀・ｒ陦ｨ遉ｺ縺吶ｋSprite繧剃ｽ懈・縺吶ｋ
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Surface縺ｮ讓ｪ蟷・
     * @param {Number} height Surface縺ｮ鬮倥＆.
     * @constructs
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        /**
         * Surface縺ｮ讓ｪ蟷・
         * @type {Number}
         */
        this.width = width;
        /**
         * Surface縺ｮ鬮倥＆.
         * @type {Number}
         */
        this.height = height;
        /**
         * Surface縺ｮ謠冗判繧ｳ繝ｳ繝・け繧ｹ繝・
         * @type {CanvasRenderingContext2D}
         */
        this.context = null;

        var id = 'enchant-surface' + game._surfaceID++;
        if (document.getCSSCanvasContext) {
            this.context = document.getCSSCanvasContext('2d', id, width, height);
            this._element = this.context.canvas;
            this._css = '-webkit-canvas(' + id + ')';
            var context = this.context;
        } else if (document.mozSetImageElement) {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._css = '-moz-element(#' + id + ')';
            this.context = this._element.getContext('2d');
            document.mozSetImageElement(id, this._element)
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                }
            }, this);
        }
    },
    /**
     * Surface縺九ｉ1繝斐け繧ｻ繝ｫ蜿門ｾ励☆繧・
     * @param {Number} x 蜿門ｾ励☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮx蠎ｧ讓・
     * @param {Number} y 蜿門ｾ励☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮy蠎ｧ讓・
     * @return {Array.<Number>} 繝斐け繧ｻ繝ｫ縺ｮ諠・ｱ繧端r, g, b, a]縺ｮ蠖｢蠑上〒謖√▽驟榊・.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Surface縺ｫ1繝斐け繧ｻ繝ｫ險ｭ螳壹☆繧・
     * @param {Number} x 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮx蠎ｧ讓・
     * @param {Number} y 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮy蠎ｧ讓・
     * @param {Number} r 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮr縺ｮ蛟､.
     * @param {Number} g 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮg縺ｮ蛟､.
     * @param {Number} b 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮb縺ｮ蛟､.
     * @param {Number} a 險ｭ螳壹☆繧九ヴ繧ｯ繧ｻ繝ｫ縺ｮ騾乗・蠎ｦ.
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y, 1, 1);
    },
    /**
     * Surface縺ｮ蜈ｨ繝斐け繧ｻ繝ｫ繧偵け繝ｪ繧｢縺鈴乗・蠎ｦ0縺ｮ鮟偵↓險ｭ螳壹☆繧・
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
     * Surface縺ｫ蟇ｾ縺励※蠑墓焚縺ｧ謖・ｮ壹＆繧後◆Surface繧呈緒逕ｻ縺吶ｋ.
     *
     * Canvas API縺ｮdrawImage繧偵Λ繝・・縺励※縺翫ｊ, 謠冗判縺吶ｋ遏ｩ蠖｢繧貞酔讒倥・蠖｢蠑上〒謖・ｮ壹〒縺阪ｋ.
     *
     * @example
     *   var src = game.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // 繧ｽ繝ｼ繧ｹ繧・0, 0)縺ｫ謠冗判
     *   dst.draw(src, 50, 50); // 繧ｽ繝ｼ繧ｹ繧・50, 50)縺ｫ謠冗判
     *   // 繧ｽ繝ｼ繧ｹ繧・50, 50)縺ｫ邵ｦ讓ｪ30繝斐け繧ｻ繝ｫ蛻・□縺第緒逕ｻ
     *   dst.draw(src, 50, 50, 30, 30);
     *   // 繧ｽ繝ｼ繧ｹ縺ｮ(10, 10)縺九ｉ邵ｦ讓ｪ40繝斐け繧ｻ繝ｫ縺ｮ鬆伜沺繧・50, 50)縺ｫ邵ｦ讓ｪ30繝斐け繧ｻ繝ｫ縺ｫ邵ｮ蟆上＠縺ｦ謠冗判
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image 謠冗判縺ｫ逕ｨ縺・ｋSurface.
     */
    draw: function(image) {
        arguments[0] = image = image._element;
        if (arguments.length == 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            this.context.drawImage.apply(this.context, arguments);
        }
    },
    /**
     * Surface繧定､・｣ｽ縺吶ｋ.
     * @return {enchant.Surface} 隍・｣ｽ縺輔ｌ縺欖urface.
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    }
});

/**
 * 逕ｻ蜒上ヵ繧｡繧､繝ｫ繧定ｪｭ縺ｿ霎ｼ繧薙〒Surface繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ菴懈・縺吶ｋ.
 *
 * 縺薙・繝｡繧ｽ繝・ラ縺ｫ繧医▲縺ｦ菴懈・縺輔ｌ縺欖urface縺ｯimg隕∫ｴ縺ｮ繝ｩ繝・・縺励※縺翫ｊcontext繝励Ο繝代ユ繧｣縺ｫ
 * 繧｢繧ｯ繧ｻ繧ｹ縺励◆繧嚇raw, clear, getPixel, setPixel繝｡繧ｽ繝・ラ縺ｪ縺ｩ縺ｮ蜻ｼ縺ｳ蜃ｺ縺励〒Canvas API
 * 繧剃ｽｿ縺｣縺溽判蜒乗桃菴懊ｒ陦後≧縺薙→縺ｯ縺ｧ縺阪↑縺・ 縺溘□縺妖raw繝｡繧ｽ繝・ラ縺ｮ蠑墓焚縺ｨ縺吶ｋ縺薙→縺ｯ縺ｧ縺・
 * 縺ｻ縺九・Surface縺ｫ謠冗判縺励◆荳翫〒逕ｻ蜒乗桃菴懊ｒ陦後≧縺薙→縺ｯ縺ｧ縺阪ｋ(繧ｯ繝ｭ繧ｹ繝峨Γ繧､繝ｳ縺ｧ繝ｭ繝ｼ繝峨＠縺・ * 蝣ｴ蜷医・繝斐け繧ｻ繝ｫ繧貞叙蠕励☆繧九↑縺ｩ逕ｻ蜒乗桃菴懊・荳驛ｨ縺悟宛髯舌＆繧後ｋ).
 *
 * @param {String} src 繝ｭ繝ｼ繝峨☆繧狗判蜒上ヵ繧｡繧､繝ｫ縺ｮ繝代せ.
 * @static
 */
enchant.Surface.load = function(src) {
    var image = new Image();
    var surface = Object.create(Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    image.src = src;
    image.onerror = function() {
        throw new Error('Cannot load an asset: ' + image.src);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    return surface;
};

/**
 * @scope enchant.Sound.prototype
 */
enchant.Sound = enchant.Class.create(enchant.EventTarget, {
    /**
     * audio隕∫ｴ繧偵Λ繝・・縺励◆繧ｯ繝ｩ繧ｹ.
     *
     * MP3繝輔ぃ繧､繝ｫ縺ｮ蜀咲函縺ｯSafari, Chrome, Firefox, Opera, IE縺悟ｯｾ蠢・     * (Firefox, Opera縺ｧ縺ｯFlash繧堤ｵ檎罰縺励※蜀咲函). WAVE繝輔ぃ繧､繝ｫ縺ｮ蜀咲函縺ｯ
     * Safari, Chrome, Firefox, Opera縺悟ｯｾ蠢懊＠縺ｦ縺・ｋ. 繝悶Λ繧ｦ繧ｶ縺碁浹螢ｰ繝輔ぃ繧､繝ｫ
     * 縺ｮ繧ｳ繝ｼ繝・ャ繧ｯ縺ｫ蟇ｾ蠢懊＠縺ｦ縺・↑縺・ｴ蜷医・蜀咲函縺輔ｌ縺ｪ縺・
     *
     * 繧ｳ繝ｳ繧ｹ繝医Λ繧ｯ繧ｿ縺ｧ縺ｯ縺ｪ縺銃nchant.Sound.load繧帝壹§縺ｦ繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ繧剃ｽ懈・縺吶ｋ.
     *
     * @constructs
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        throw new Error("Illegal Constructor");

        /**
         * Sound縺ｮ蜀咲函譎る俣.
         * @type {Number}
         */
        this.duration = 0;
    },
    /**
     * 蜀咲函繧帝幕蟋九☆繧・
     */
    play: function() {
        if (this._element) this._element.play();
    },
    /**
     * 蜀咲函繧剃ｸｭ譁ｭ縺吶ｋ.
     */
    pause: function() {
        if (this._element) this._element.pause();
    },
    /**
     * 蜀咲函繧貞●豁｢縺吶ｋ.
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     * 迴ｾ蝨ｨ縺ｮ蜀咲函菴咲ｽｮ (遘・.
     * @type {Number}
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) this._element.currentTime = time;
        }
    },
    /**
     * 繝懊Μ繝･繝ｼ繝. 0 (辟｡髻ｳ) ・・1 (繝輔Ν繝懊Μ繝･繝ｼ繝).
     * @type {Number}
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) this._element.volume = volume;
        }
    }
});

/**
 * 髻ｳ螢ｰ繝輔ぃ繧､繝ｫ繧定ｪｭ縺ｿ霎ｼ繧薙〒Surface繧ｪ繝悶ず繧ｧ繧ｯ繝医ｒ菴懈・縺吶ｋ.
 *
 * @param {String} src 繝ｭ繝ｼ繝峨☆繧矩浹螢ｰ繝輔ぃ繧､繝ｫ縺ｮ繝代せ.
 * @param {String} [type] 髻ｳ螢ｰ繝輔ぃ繧､繝ｫ縺ｮMIME Type.
 * @static
 */
enchant.Sound.load = function(src, type) {
    if (type == null) {
        var ext = src.match(/\.\w+$/)[0];
        if (ext) {
            type = 'audio/' + ext.slice(1).toLowerCase();
        } else {
            type = '';
        }
    }

    var sound = Object.create(enchant.Sound.prototype);
    enchant.EventTarget.call(sound);
    var audio = new Audio();
    if (audio.canPlayType(type)) {
        audio.src = src;
        audio.load();
        audio.autoplay = false;
        audio.onerror = function() {
            throw new Error('Cannot load an asset: ' + audio.src);
        };
        audio.onload = function() {
            sound.duration = audio.duration;
            sound.dispatchEvent(new enchant.Event('load'));
        };
        sound._element = audio;
    } else if (type.match(/^audio\/(mpeg|mp3)/)) {
        var embed = document.createElement('embed');
        var id = 'enchant-audio' + game._soundID++;
        embed.width = embed.height = 1;
        embed.name = id;
        embed.src = ['sound.swf?id=', id, '&src=', src].join('');
        embed.allowscriptaccess = 'always';
        embed.style.position = 'absolute';
        embed.style.left = '-1px';
        sound.addEventListener('load', function() {
            Object.defineProperties(embed, {
                currentTime: {
                    get: function() { return embed.getCurrentTime() },
                    set: function(time) { embed.setCurrentTime(time) }
                },
                volume: {
                    get: function() { return embed.getVolume() },
                    set: function(volume) { embed.setVolume(volume) }
                }
            });
            sound._element = embed;
            sound.duration = embed.getDuration();
        });
        game._element.appendChild(embed);
        enchant.Sound[id] = sound;
    }
    return sound;
};

})();
