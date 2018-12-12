!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports["vue-js-grid"] = factory() : root["vue-js-grid"] = factory();
}(this, function() {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        var installedModules = {};
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.i = function(value) {
            return value;
        }, __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "/dist/", __webpack_require__(__webpack_require__.s = 6);
    }([ function(module, exports) {
        module.exports = function() {
            var list = [];
            return list.toString = function() {
                for (var result = [], i = 0; i < this.length; i++) {
                    var item = this[i];
                    item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                }
                return result.join("");
            }, list.i = function(modules, mediaQuery) {
                "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
                for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    "number" == typeof id && (alreadyImportedModules[id] = !0);
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), 
                    list.push(item));
                }
            }, list;
        };
    }, function(module, exports) {
        module.exports = function(rawScriptExports, compiledTemplate, scopeId, cssModules) {
            var esModule, scriptExports = rawScriptExports = rawScriptExports || {}, type = typeof rawScriptExports.default;
            "object" !== type && "function" !== type || (esModule = rawScriptExports, scriptExports = rawScriptExports.default);
            var options = "function" == typeof scriptExports ? scriptExports.options : scriptExports;
            if (compiledTemplate && (options.render = compiledTemplate.render, options.staticRenderFns = compiledTemplate.staticRenderFns), 
            scopeId && (options._scopeId = scopeId), cssModules) {
                var computed = Object.create(options.computed || null);
                Object.keys(cssModules).forEach(function(key) {
                    var module = cssModules[key];
                    computed[key] = function() {
                        return module;
                    };
                }), options.computed = computed;
            }
            return {
                esModule: esModule,
                exports: scriptExports,
                options: options
            };
        };
    }, function(module, exports, __webpack_require__) {
        function addStylesToDom(styles) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i], domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                    for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j]));
                    domStyle.parts.length > item.parts.length && (domStyle.parts.length = item.parts.length);
                } else {
                    for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j]));
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function createStyleElement() {
            var styleElement = document.createElement("style");
            return styleElement.type = "text/css", head.appendChild(styleElement), styleElement;
        }
        function addStyle(obj) {
            var update, remove, styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]');
            if (styleElement) {
                if (isProduction) return noop;
                styleElement.parentNode.removeChild(styleElement);
            }
            if (isOldIE) {
                var styleIndex = singletonCounter++;
                styleElement = singletonElement || (singletonElement = createStyleElement()), update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), 
                remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
            } else styleElement = createStyleElement(), update = applyToTag.bind(null, styleElement), 
            remove = function() {
                styleElement.parentNode.removeChild(styleElement);
            };
            return update(obj), function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
                childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
            }
        }
        function applyToTag(styleElement, obj) {
            var css = obj.css, media = obj.media, sourceMap = obj.sourceMap;
            if (media && styleElement.setAttribute("media", media), sourceMap && (css += "\n/*# sourceURL=" + sourceMap.sources[0] + " */", 
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */"), 
            styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        var hasDocument = "undefined" != typeof document;
        if ("undefined" != typeof DEBUG && DEBUG && !hasDocument) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
        var listToStyles = __webpack_require__(16), stylesInDom = {}, head = hasDocument && (document.head || document.getElementsByTagName("head")[0]), singletonElement = null, singletonCounter = 0, isProduction = !1, noop = function() {}, isOldIE = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
        module.exports = function(parentId, list, _isProduction) {
            isProduction = _isProduction;
            var styles = listToStyles(parentId, list);
            return addStylesToDom(styles), function(newList) {
                for (var mayRemove = [], i = 0; i < styles.length; i++) {
                    var item = styles[i], domStyle = stylesInDom[item.id];
                    domStyle.refs--, mayRemove.push(domStyle);
                }
                newList ? (styles = listToStyles(parentId, newList), addStylesToDom(styles)) : styles = [];
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (0 === domStyle.refs) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
            };
        }();
    }, function(module, exports, __webpack_require__) {
        __webpack_require__(14);
        var Component = __webpack_require__(1)(__webpack_require__(4), __webpack_require__(12), null, null);
        module.exports = Component.exports;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _window_size = __webpack_require__(7), _window_size2 = _interopRequireDefault(_window_size), _GridItem = __webpack_require__(11), _GridItem2 = _interopRequireDefault(_GridItem), _elementResizeEvent = __webpack_require__(10), _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);
        exports.default = {
            name: "Grid",
            mixins: [ _window_size2.default ],
            components: {
                GridItem: _GridItem2.default
            },
            props: {
                items: {
                    type: Array,
                    default: function() {
                        return [];
                    }
                },
                cellWidth: {
                    type: Number,
                    default: 80
                },
                cellHeight: {
                    type: Number,
                    default: 80
                },
                numberOfColumns: {
                    type: Number,
                    default: 0
                },
                draggable: {
                    type: Boolean,
                    default: !1
                },
                dragDelay: {
                    type: Number,
                    default: 0
                },
                sortable: {
                    type: Boolean,
                    default: !1
                },
                center: {
                    type: Boolean,
                    default: !1
                },
                scrollZona: {
                    type: Number,
                    default: .25
                },
                scrollStep: {
                    type: Number,
                    default: 10
                },
                scrollInterval: {
                    type: Number,
                    default: 10
                },
                refScrollElement: {},
                wrapperStyles: {
                    type: Object,
                    default: function() {
                        return {};
                    }
                },
                columns: {
                    type: Number,
                    default: 0
                }
            },
            data: function() {
                return {
                    list: [],
                    scrollActive: !1,
                    scrollToDown: !0,
                    scrollOffset: 0,
                    gridSize: {
                        width: 0,
                        height: 0
                    },
                    currentScroll: 0,
                    elementIdInMotion: null,
                    itemsIsShown: !1
                };
            },
            created: function() {
                window.addEventListener("resize", this.resizeGrid);
            },
            beforeDestroy: function() {
                window.removeEventListener("resize", this.resizeGrid), (0, _elementResizeEvent.unbind)(this.scrollElement);
            },
            mounted: function() {
                var _this = this;
                this.refScrollElement ? (this.scrollElement = this.refScrollElement, this.$refs["grid-wrapper"].style.overflow = "visible") : (this.scrollElement = this.$refs["grid-wrapper"], 
                this.scrollElement.style["overflow-y"] = "auto"), this.$nextTick(function() {
                    _this.itemsIsShown = !0;
                }), (0, _elementResizeEvent2.default)(this.scrollElement, function() {
                    _this.resizeGrid();
                });
            },
            watch: {
                refScrollElement: function(val) {
                    val ? (this.scrollElement = val, this.$refs["grid-wrapper"].style.overflow = "visible") : (this.scrollElement = this.$refs["grid-wrapper"], 
                    this.scrollElement.style["overflow-y"] = "auto");
                },
                items: {
                    handler: function() {
                        var _this2 = this, nextItems = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                        this.list = nextItems.map(function(item, index) {
                            return {
                                item: item,
                                index: index,
                                key: item.hasOwnProperty("id") ? item.id : index,
                                sort: index
                            };
                        }), this.$nextTick(function() {
                            _this2.resizeGrid();
                        });
                    },
                    immediate: !0
                },
                scrollActive: function(val) {
                    val && this.startScroll();
                },
                columns: function() {
                    var _this3 = this;
                    this.$nextTick(function() {
                        _this3.resizeGrid();
                    });
                }
            },
            computed: {
                height: function() {
                    return Math.ceil(this.items.length / this.columnCount) * this.cellHeight;
                },
                style: function() {
                    return {
                        height: this.height + "px"
                    };
                },
                gridWrapperStyle: function() {
                    return this.gridSize.height > 0 ? _extends({}, this.wrapperStyles, {
                        height: this.gridSize.height + "px"
                    }) : this.wrapperStyles;
                },
                columnCount: function() {
                    return this.columns > 0 ? this.columns : Math.floor(this.windowWidth / this.cellWidth);
                },
                itemWidth: function() {
                    var itemWidth = this.columns > 0 && this.gridSize.width > 0 ? this.gridSize.width / this.columns : this.cellWidth;
                    return this.$emit("change-item-width", itemWidth), itemWidth;
                },
                itemHeight: function() {
                    return this.cellHeight;
                }
            },
            methods: {
                wrapEvent: function() {
                    var other = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return _extends({
                        datetime: Date.now(),
                        items: this.getListClone()
                    }, other);
                },
                getListClone: function() {
                    return this.list.slice(0).sort(function(a, b) {
                        return a.sort - b.sort;
                    });
                },
                removeItem: function(_ref) {
                    var index = _ref.index, removeItem = this.list.find(function(v) {
                        return v.index === index;
                    }), removeItemSort = removeItem.sort;
                    this.list = this.list.filter(function(v) {
                        return v.index !== index;
                    }).map(function(v) {
                        var sort = v.sort > removeItemSort ? v.sort - 1 : v.sort;
                        return _extends({}, v, {
                            sort: sort
                        });
                    }), this.$emit("remove", this.wrapEvent({
                        index: index
                    }));
                },
                onDragStart: function(event, id) {
                    this.elementIdInMotion = id, this.$emit("dragstart", this.wrapEvent(event));
                },
                onDragEnd: function(event) {
                    this.scrollActive = !1, this.scrollOffset = 0, this.$emit("dragend", this.wrapEvent(event));
                },
                onTransitionEnd: function(id) {
                    this.elementIdInMotion === id && this.$emit("alltransitionend");
                },
                click: function(event) {
                    this.$emit("click", this.wrapEvent(event));
                },
                onDrag: function(event) {
                    if (this.sortable && this.sortList(event.index, event.gridPosition), this.scrollElement) {
                        var pageY = event.event.pageY, mousePosition = pageY - this.scrollElement.offsetTop, coef = mousePosition / this.scrollElement.clientHeight;
                        this.scrollActive = coef < this.scrollZona || 1 - this.scrollZona < coef, this.scrollToDown = coef > 1 - this.scrollZona, 
                        this.$emit("drag", this.wrapEvent({
                            event: event
                        }));
                    }
                },
                sortList: function(itemIndex, gridPosition) {
                    var targetItem = this.list.find(function(item) {
                        return item.index === itemIndex;
                    }), targetItemSort = targetItem.sort;
                    gridPosition = Math.max(gridPosition, 0), gridPosition = Math.min(gridPosition, this.list.length - 1), 
                    targetItemSort !== gridPosition && (this.list = this.list.map(function(item) {
                        if (item.index === targetItem.index) return _extends({}, item, {
                            sort: gridPosition
                        });
                        var sort = item.sort;
                        return targetItemSort > gridPosition && sort <= targetItemSort && sort >= gridPosition ? _extends({}, item, {
                            sort: sort + 1
                        }) : targetItemSort < gridPosition && sort >= targetItemSort && sort <= gridPosition ? _extends({}, item, {
                            sort: sort - 1
                        }) : item;
                    }), this.$emit("sort", this.wrapEvent()));
                },
                startScroll: function() {
                    var _this4 = this, offsetY = this.scrollToDown ? this.scrollStep : -this.scrollStep;
                    if (this.scrollElement) {
                        var lastScrollTop = this.scrollElement.scrollTop;
                        this.scrollElement.scrollBy ? this.scrollElement.scrollBy(0, offsetY) : this.scrollElement.scrollTop = lastScrollTop + offsetY;
                        var currentScroll = this.scrollElement.scrollTop, scrollElementHeight = this.scrollElement.offsetHeight, childHeight = this.scrollElement.firstChild.offsetHeight, scrollToUp = lastScrollTop > currentScroll, scrollToDown = lastScrollTop < currentScroll && currentScroll + scrollElementHeight < childHeight;
                        if (scrollToUp && offsetY < 0 || scrollToDown && offsetY > 0) {
                            var newScrollOffset = this.scrollOffset + offsetY;
                            this.scrollOffset = newScrollOffset, setTimeout(function() {
                                _this4.scrollActive && _this4.startScroll();
                            }, this.scrollInterval);
                        }
                    }
                },
                resizeGrid: function() {
                    if (this.$refs.hasOwnProperty("grid-wrapper")) {
                        var gridWrapper = this.$refs["grid-wrapper"];
                        this.gridSize.width = gridWrapper.firstChild.clientWidth, this.gridSize.height = gridWrapper.firstChild.clientHeight;
                    }
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        exports.default = {
            name: "GridItem",
            props: {
                index: {
                    type: Number
                },
                sort: {
                    type: Number
                },
                cellWidth: {
                    type: Number
                },
                cellHeight: {
                    type: Number
                },
                columnCount: {
                    type: Number
                },
                rowShift: {
                    type: Number,
                    default: 0
                },
                draggable: {
                    type: Boolean
                },
                dragDelay: {
                    type: Number,
                    default: 0
                },
                scrollOffset: {
                    type: Number,
                    default: 0
                }
            },
            data: function() {
                return {
                    animate: !0,
                    dragging: !1,
                    shiftStartX: 0,
                    shiftStartY: 0,
                    mouseMoveStartX: 0,
                    mouseMoveStartY: 0,
                    lastEventMouse: null,
                    shiftX: 0,
                    shiftY: 0,
                    timer: null,
                    zIndex: 1
                };
            },
            mounted: function() {
                var _this = this;
                this.$refs.self.addEventListener("transitionend", function(event) {
                    _this.dragging || (_this.zIndex = 1, _this.$emit("transitionend"));
                });
            },
            watch: {
                scrollOffset: function(val) {
                    this.dragging && this.drag(this.lastEventMouse);
                }
            },
            computed: {
                className: function() {
                    return [ "v-grid-item-wrapper", {
                        "v-grid-item-animate": this.animate,
                        "v-grid-item-dragging": this.dragging
                    } ];
                },
                style: function() {
                    var zIndex = this.zIndex, cellWidth = this.cellWidth, cellHeight = this.cellHeight, top = this.top;
                    return {
                        zIndex: zIndex,
                        width: cellWidth + "px",
                        height: cellHeight + "px",
                        transform: "translate3d(" + this.left + "px, " + top + "px, 0)"
                    };
                },
                left: function() {
                    return this.dragging ? this.shiftX : this.rowShift + this.sort % this.columnCount * this.cellWidth;
                },
                top: function() {
                    return this.dragging ? this.shiftY : Math.floor(this.sort / this.columnCount) * this.cellHeight;
                }
            },
            methods: {
                wrapEvent: function(event) {
                    return {
                        event: event,
                        index: this.index,
                        sort: this.sort
                    };
                },
                dragStart: function(event) {
                    var e = event.touches ? event.touches[0] : event;
                    this.zIndex = 10, this.shiftX = this.shiftStartX = this.left, this.shiftY = this.shiftStartY = this.top, 
                    this.mouseMoveStartX = e.pageX, this.mouseMoveStartY = e.pageY, this.animate = !1, 
                    this.dragging = !0, document.addEventListener("mousemove", this.documentMouseMove), 
                    document.addEventListener("touchmove", this.documentMouseMove), this.$emit("dragstart", this.wrapEvent(event));
                },
                drag: function(event) {
                    var e = event.touches ? event.touches[0] : event;
                    this.lastEventMouse = e;
                    var distanceX = e.pageX - this.mouseMoveStartX, distanceY = e.pageY - this.mouseMoveStartY;
                    this.shiftX = distanceX + this.shiftStartX, this.shiftY = distanceY + this.shiftStartY + this.scrollOffset;
                    var gridX = Math.round(this.shiftX / this.cellWidth), gridY = Math.round(this.shiftY / this.cellHeight);
                    gridX = Math.min(gridX, this.columnCount - 1), gridY = Math.max(gridY, 0);
                    var gridPosition = gridX + gridY * this.columnCount, $event = {
                        event: event,
                        distanceX: distanceX,
                        distanceY: distanceY,
                        positionX: this.shiftX,
                        positionY: this.shiftY,
                        index: this.index,
                        gridX: gridX,
                        gridY: gridY,
                        gridPosition: gridPosition
                    };
                    this.$emit("drag", $event);
                },
                mousedown: function(event) {
                    var _this2 = this;
                    this.draggable && (this.timer = setTimeout(function() {
                        _this2.dragStart(event);
                    }, this.dragDelay), document.addEventListener("mouseup", this.documentMouseUp), 
                    document.addEventListener("touchend", this.documentMouseUp));
                },
                documentMouseMove: function(event) {
                    this.draggable && this.dragging && this.drag(event);
                },
                documentMouseUp: function(event) {
                    this.timer && (clearTimeout(this.timer), this.timer = null);
                    var dx = this.shiftStartX - this.shiftX, dy = this.shiftStartY - this.shiftY, distance = Math.sqrt(dx * dx + dy * dy);
                    this.animate = !0, this.dragging = !1, this.mouseMoveStartX = 0, this.mouseMoveStartY = 0, 
                    this.shiftStartX = 0, this.shiftStartY = 0, document.removeEventListener("mousemove", this.documentMouseMove), 
                    document.removeEventListener("touchmove", this.documentMouseMove), document.removeEventListener("mouseup", this.documentMouseUp), 
                    document.removeEventListener("touchend", this.documentMouseUp);
                    var $event = this.wrapEvent(event);
                    distance < 4 && this.$emit("click", $event), this.$emit("dragend", $event);
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _Grid = __webpack_require__(3), _Grid2 = function(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }(_Grid);
        exports.default = {
            install: function(Vue) {
                Vue.component("Grid", _Grid2.default);
            }
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = {
            data: function() {
                return {
                    windowHeight: 0,
                    windowWidth: 0
                };
            },
            created: function() {
                window.addEventListener("resize", this.getWindowSize), this.getWindowSize();
            },
            beforeDestroy: function() {
                window.removeEventListener("resize", this.getWindowSize);
            },
            methods: {
                getWindowSize: function() {
                    this.windowHeight = window.innerHeight, this.windowWidth = window.innerWidth;
                }
            }
        };
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(0)(), exports.push([ module.i, "\n.v-grid-wrapper {\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n@media print {\n.v-grid-wrapper {\n      height: auto !important;\n}\n}\n.v-grid {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n@media print {\n.v-grid {\n      height: auto !important;\n}\n}\n", "" ]);
    }, function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(0)(), exports.push([ module.i, "\n.v-grid-item-wrapper {\n  display: block;\n  position: absolute;\n  box-sizing: border-box;\n  left: 0;\n  top: 0;\n  user-select: none;\n  transform: translate3d(0px, 0px, 0px);\n  z-index: 1;\n}\n@media print {\n.v-grid-item-wrapper {\n      position: static;\n      transform: translate3d(0px, 0px, 0px) !important;\n      width: auto !important;\n}\n}\n.v-grid-item-wrapper.v-grid-item-animate {\n    transition: all 800ms ease;\n}\n", "" ]);
    }, function(module, exports) {
        function resizeListener(e) {
            var win = e.target || e.srcElement;
            win.__resizeRAF__ && cancelAnimationFrame(win.__resizeRAF__), win.__resizeRAF__ = requestAnimationFrame(function() {
                var trigger = win.__resizeTrigger__, listeners = trigger && trigger.__resizeListeners__;
                listeners && listeners.forEach(function(fn) {
                    fn.call(trigger, e);
                });
            });
        }
        var exports = function(element, fn) {
            function objectLoad() {
                this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__, this.contentDocument.defaultView.addEventListener("resize", resizeListener);
            }
            var isIE, window = this, document = window.document, attachEvent = document.attachEvent;
            if ("undefined" != typeof navigator && (isIE = navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/)), 
            !element.__resizeListeners__) if (element.__resizeListeners__ = [], attachEvent) element.__resizeTrigger__ = element, 
            element.attachEvent("onresize", resizeListener); else {
                "static" === getComputedStyle(element).position && (element.style.position = "relative");
                var obj = element.__resizeTrigger__ = document.createElement("object");
                obj.setAttribute("style", "position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none; z-index: -1; opacity: 0;"), 
                obj.setAttribute("class", "resize-sensor"), obj.setAttribute("tabindex", "-1"), 
                obj.__resizeElement__ = element, obj.onload = objectLoad, obj.type = "text/html", 
                isIE && element.appendChild(obj), obj.data = "about:blank", isIE || element.appendChild(obj);
            }
            element.__resizeListeners__.push(fn);
        };
        module.exports = "undefined" == typeof window ? exports : exports.bind(window), 
        module.exports.unbind = function(element, fn) {
            var attachEvent = document.attachEvent, listeners = element.__resizeListeners__ || [];
            if (fn) {
                var index = listeners.indexOf(fn);
                -1 !== index && listeners.splice(index, 1);
            } else listeners = element.__resizeListeners__ = [];
            if (!listeners.length) {
                if (attachEvent) element.detachEvent("onresize", resizeListener); else if (element.__resizeTrigger__) {
                    var contentDocument = element.__resizeTrigger__.contentDocument, defaultView = contentDocument && contentDocument.defaultView;
                    defaultView && (defaultView.removeEventListener("resize", resizeListener), delete defaultView.__resizeTrigger__), 
                    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
                }
                delete element.__resizeListeners__;
            }
        };
    }, function(module, exports, __webpack_require__) {
        __webpack_require__(15);
        var Component = __webpack_require__(1)(__webpack_require__(5), __webpack_require__(13), null, null);
        module.exports = Component.exports;
    }, function(module, exports) {
        module.exports = {
            render: function() {
                var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
                return _c("div", {
                    ref: "grid-wrapper",
                    staticClass: "v-grid-wrapper",
                    style: _vm.gridWrapperStyle
                }, [ _c("div", {
                    ref: "grid",
                    staticClass: "v-grid",
                    style: _vm.style
                }, _vm._l(_vm.list, function(v) {
                    return _vm.itemsIsShown ? _c("GridItem", {
                        key: v.key,
                        attrs: {
                            index: v.index,
                            sort: v.sort,
                            draggable: _vm.draggable,
                            "drag-delay": _vm.dragDelay,
                            "column-count": _vm.columnCount,
                            "cell-width": _vm.itemWidth,
                            "cell-height": _vm.itemHeight,
                            "scroll-offset": _vm.scrollOffset
                        },
                        on: {
                            transitionend: function() {
                                return _vm.onTransitionEnd(v.key);
                            },
                            dragstart: function(event) {
                                return _vm.onDragStart(event, v.key);
                            },
                            dragend: _vm.onDragEnd,
                            drag: _vm.onDrag,
                            click: _vm.click
                        }
                    }, [ _vm._t("cell", null, {
                        item: v.item,
                        index: v.index,
                        sort: v.sort,
                        remove: function() {
                            _vm.removeItem(v);
                        }
                    }) ], 2) : _vm._e();
                })) ]);
            },
            staticRenderFns: []
        };
    }, function(module, exports) {
        module.exports = {
            render: function() {
                var _vm = this, _h = _vm.$createElement;
                return (_vm._self._c || _h)("div", {
                    ref: "self",
                    class: _vm.className,
                    style: _vm.style,
                    on: {
                        mousedown: _vm.mousedown,
                        touchstart: _vm.mousedown
                    }
                }, [ _vm._t("default") ], 2);
            },
            staticRenderFns: []
        };
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(8);
        "string" == typeof content && (content = [ [ module.i, content, "" ] ]), content.locals && (module.exports = content.locals);
        __webpack_require__(2)("cee59df0", content, !0);
    }, function(module, exports, __webpack_require__) {
        var content = __webpack_require__(9);
        "string" == typeof content && (content = [ [ module.i, content, "" ] ]), content.locals && (module.exports = content.locals);
        __webpack_require__(2)("6d73958c", content, !0);
    }, function(module, exports) {
        module.exports = function(parentId, list) {
            for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                    id: parentId + ":" + i,
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                });
            }
            return styles;
        };
    } ]);
});