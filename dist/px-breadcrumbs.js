'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}(function(){Polymer({is:'px-breadcrumbs',properties:{breadcrumbData:{type:Array,value:function value(){return[]}},_mainPathItems:{type:Array,value:function value(){return[]}},_clickPathItem:{type:Object,value:function value(){return{}}},_clickedItemChildren:{type:Array,value:function value(){return[]}},_isDropdownHidden:{type:Boolean,value:true},_selectedItem:{type:Object},_ulWidth:{type:Number,value:0},_selectedItemPath:{type:Array,value:function value(){return[]},readOnly:true}},behaviors:[Polymer.IronResizableBehavior],listeners:{'iron-resize':'_getContainerSize'},observers:['_calculatePath(_selectedItem)','_rebuildBreadcrumbsDisplayOptions(_selectedItemPath, _ulWidth)','prepareData(breadcrumbData)'],_calculatePathItemClass:function _calculatePathItemClass(pathItem){pathItem=pathItem.source?pathItem.source:pathItem;return this._clickPathItem===pathItem?'opened':''},_calculatePath:function _calculatePath(selectedItem){var graph=this.graph;this._set_selectedItemPath(graph.getPathToItem(selectedItem))},_getContainerSize:function _getContainerSize(){var _this=this;this.debounce('windowResize',function(){window.requestAnimationFrame(function(){var breadcrumbsContainer=Polymer.dom(_this.root).querySelector('.container'),breadcrumbsUlContainer=Polymer.dom(breadcrumbsContainer).querySelector('ul'),bcUlContainerRect=breadcrumbsContainer.getBoundingClientRect();_this.set('_ulWidth',bcUlContainerRect.width+4)})},10)},_rebuildBreadcrumbsDisplayOptions:function _rebuildBreadcrumbsDisplayOptions(){var itemPath=this._selectedItemPath||[],graph=this.graph,_ulWidth=this._ulWidth;if(!itemPath.length||!graph||!_ulWidth)return;var breadcrumbsObj=new Breadcrumbs(itemPath,graph);if(_ulWidth>breadcrumbsObj.sizeOfFullBreadcrumbs){this.set('_mainPathItems',itemPath);return}if(_ulWidth>breadcrumbsObj.sizeOfAllShortenedItemsExcludingLastItem+breadcrumbsObj.sizeOfFullLastItem){var strArrayShortenedWithFullLastItem=breadcrumbsObj.allShortenedItemsExcludingLast.concat(breadcrumbsObj.lastItemFull);this.set('_mainPathItems',strArrayShortenedWithFullLastItem);return}if(_ulWidth>breadcrumbsObj.sizeOfAllShortenedItems){var strArrayShortened=breadcrumbsObj.shortenedItems;this.set('_mainPathItems',strArrayShortened);return}this.set('_mainPathItems',this._createArrayWithOverflow(itemPath,_ulWidth,breadcrumbsObj))},_createArrayWithOverflow:function _createArrayWithOverflow(strArray,_ulWidth,breadcrumbsObj){var pointer=0,currentAccumSize=breadcrumbsObj.sizeOfAllShortenedItemsExcludingLastItem,sizeOfFullLastItem=breadcrumbsObj.sizeOfFullLastItem,sizeOfEllipsis=breadcrumbsObj.sizeOfEllipsis,noRoomForFullLastItem=false,lastItem={},overflowObj={'text':'...','hasChildren':true},slicedStrArray=[];while(_ulWidth<sizeOfEllipsis+currentAccumSize+sizeOfFullLastItem){if(pointer===strArray.length-1){noRoomForFullLastItem=true;break}var removedSize=breadcrumbsObj.sizeOfIndividualShortItem(strArray[pointer]);currentAccumSize-=removedSize;pointer++}overflowObj.children=strArray.slice(0,pointer);lastItem=noRoomForFullLastItem?breadcrumbsObj.lastItemShort:breadcrumbsObj.lastItemFull;slicedStrArray=[overflowObj].concat(breadcrumbsObj.shortenedItems.slice(pointer,strArray.length-1)).concat(lastItem);return slicedStrArray},_isLastItemInData:function _isLastItemInData(index){console.log('this._mainPathItems.length-1 = ',this._mainPathItems.length-1);console.log('index = '+index);console.log(this._mainPathItems.length-1===index);return this._mainPathItems.length-1===index},_normalizePathClickTarget:function _normalizePathClickTarget(evt){return evt.target._iconsetName==='fa'?evt.target.parentNode.parentNode:evt.target},prepareData:function prepareData(breadcrumbsData){if(!breadcrumbsData.length)return;var graph=new Graph(this.breadcrumbData,this);this.set('graph',graph);this.set('_selectedItem',graph.selectedItem)},_addParentPropToItem:function _addParentPropToItem(parent){var i=0,children=parent.children,len=children.length,breadcrumbsObj=this.breadcrumbsObj;for(;i<len;i++){var newItem={};newItem.children=children[i].children;newItem.text=children[i].text;newItem.hasChildren=children[i].hasChildren;newItem.selectedItem=children[i].selectedItem;newItem.parent=parent;breadcrumbsObj._addToWeakMap=newItem}},_doesItemHaveSiblings:function _doesItemHaveSiblings(itemInPath){var graph=this.graph,source=itemInPath.source?itemInPath.source:itemInPath,isItemOverflow=itemInPath.text==='...'?true:false;return!isItemOverflow?graph.hasSiblings(source):false},_dropdownTap:function _dropdownTap(evt){var newSelectItem=evt.model.item.source?evt.model.item.source:evt.model.item;this.set('_isDropdownHidden',true);this._changePathFromClick(newSelectItem);this.set('_clickPathItem',{})},_changePathFromClick:function _changePathFromClick(item){this.set('_selectedItem',item)},_onPathTap:function _onPathTap(evt){var dataItem=evt.model.item.source?evt.model.item.source:evt.model.item;if(this._clickPathItem===dataItem){this.set('_isDropdownHidden',true);this.set('_clickPathItem',{});return}var isClickedItemOverflow=dataItem.text==='...'?true:false;if(this._doesItemHaveSiblings(dataItem)||isClickedItemOverflow){var graph=this.graph,siblings=!isClickedItemOverflow?graph.getSiblings(dataItem):dataItem.children;this.set('_clickedItemChildren',siblings);this.set('_clickPathItem',dataItem);this.set('_isDropdownHidden',false);this._changeDropdownPosition(evt)}else{this.set('_clickedItemChildren',[]);this._changePathFromClick(dataItem)}},_changeDropdownPosition:function _changeDropdownPosition(evt){var normalizedTarget=this._normalizePathClickTarget(evt),targetRect=normalizedTarget.getBoundingClientRect(),targetLeft=targetRect.left,targetBottom=targetRect.bottom,targetHeight=targetRect.height,windowScrollX=window.scrollX,windowScrollY=window.scrollY,dropdown=Polymer.dom(this.root).querySelector('.breadCrumbdropdown');dropdown.style.top=targetBottom+windowScrollY+'px';dropdown.style.left=targetLeft+windowScrollX+'px'},_notifyClick:function _notifyClick(item){this.fire('px-breadcrumbs-item-clicked',{item:item,composed:true})}});var Breadcrumbs=function(){function Breadcrumbs(){var breadcrumbs=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var graph=arguments[1];_classCallCheck(this,Breadcrumbs);this.graph=graph;this.breadcrumbs=breadcrumbs;this.map=new WeakMap;this.ctx=this._createCanvas();this._preShortenItems(this.breadcrumbs);return this}_createClass(Breadcrumbs,[{key:'_addToWeakMap',value:function _addToWeakMap(item){var cachedItem=this.map.get(item)||null;if(!cachedItem){this.map.set(item,item)}}},{key:'_preShortenItems',value:function _preShortenItems(items){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=items[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var item=_step.value;this._getShortenedText(item)}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}},{key:'_getShortenedText',value:function _getShortenedText(item){var cachedItem=this.map.get(item)||{};cachedItem.shortText=cachedItem.shortText||item.text.substr(0,6)+'...'+item.text.substr(item.text.length-6);this.map.set(item,cachedItem);return cachedItem.shortText}},{key:'_sizeOfIndividualFullItem',value:function _sizeOfIndividualFullItem(item){var cachedItem=this.map.get(item)||{};cachedItem.fullSize=cachedItem.fullSize||parseInt(this.ctx.measureText(item.text).width,10);this.map.set(item,cachedItem);return cachedItem.fullSize}},{key:'sizeOfIndividualShortItem',value:function sizeOfIndividualShortItem(item){var cachedItem=this.map.get(item)||{};cachedItem.shortSize=cachedItem.shortSize||parseInt(this.ctx.measureText(cachedItem.shortText).width,10);this.map.set(item,cachedItem);return cachedItem.shortSize}},{key:'_calculateSizeOfBreadcrumbs',value:function _calculateSizeOfBreadcrumbs(strArray){var useFullSize=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;if(strArray){var accum=0,i=0,len=strArray.length,sizeOfItem=void 0;for(i=0;i<len;i++,sizeOfItem=null){if(useFullSize){sizeOfItem=this._sizeOfIndividualFullItem(strArray[i])}else{sizeOfItem=this.sizeOfIndividualShortItem(strArray[i])}var source=strArray[i].source?strArray[i].source:strArray[i];accum+=sizeOfItem+15;if(strArray[i].text!=='...'&&this.graph.hasSiblings(source)){accum+=11}}return accum}}},{key:'_createCanvas',value:function _createCanvas(){var canvas=document.createElement('canvas');canvas.height=20;canvas.width=9999;var ctx=canvas.getContext('2d');ctx.font='15px GE Inspira Sans';return ctx}},{key:'sizeOfFullBreadcrumbs',get:function get(){this.__sizeOfFullBreadcrumbs=this.__sizeOfFullBreadcrumbs||this._calculateSizeOfBreadcrumbs(this.breadcrumbs);return this.__sizeOfFullBreadcrumbs}},{key:'sizeOfAllShortenedItemsExcludingLastItem',get:function get(){return this._calculateSizeOfBreadcrumbs(this.breadcrumbs.slice(0,this.breadcrumbs.length-1),false)}},{key:'sizeOfFullLastItem',get:function get(){return this._calculateSizeOfBreadcrumbs(this.breadcrumbs.slice(-1))}},{key:'sizeOfShortLastItem',get:function get(){return this._calculateSizeOfBreadcrumbs(this.breadcrumbs.slice(-1),false)}},{key:'lastItemFull',get:function get(){return this.breadcrumbs.slice(-1)[0]}},{key:'lastItemShort',get:function get(){return this.shortenedItems.slice(-1)[0]}},{key:'shortenedItems',get:function get(){var _this2=this;this.__shortenedItems=this.__shortenedItems||this.breadcrumbs.map(function(item){var wrapper={};wrapper.source=item;wrapper.isTruncated=true;wrapper.text=_this2._getShortenedText(item);wrapper.children=item.children;wrapper.selectedItem=item.selectedItem;wrapper.hasChildren=item.hasChildren;return wrapper});return this.__shortenedItems}},{key:'sizeOfEllipsis',get:function get(){return parseInt(this.ctx.measureText('...').width,10)}},{key:'sizeOfAllShortenedItems',get:function get(){return this._calculateSizeOfBreadcrumbs(this.breadcrumbs,false)}},{key:'allShortenedItemsExcludingLast',get:function get(){return this.shortenedItems.slice(0,this.shortenedItems.length-1)}}]);return Breadcrumbs}();;var Graph=function(){function Graph(nodes){_classCallCheck(this,Graph);this.map=new WeakMap;this._selectedItem=null;this.graph=this._crawlGraph(nodes);this.nodes=nodes;return this}_createClass(Graph,[{key:'_crawlGraph',value:function _crawlGraph(nodes){var recursiveLoopThroughObj=function(nodes,parent){var path=arguments.length>2&&arguments[2]!==undefined?arguments[2]:[];for(var i=0,len=nodes.length;i<len;i++){var metaData={},itemPath;if(parent){metaData.parent=parent}if(nodes.length>1){metaData.siblings=nodes}itemPath=path.concat([nodes[i]]);if(nodes[i].children){metaData.children=nodes[i].children;recursiveLoopThroughObj.call(this,nodes[i].children,nodes[i],itemPath)}metaData.path=itemPath;if(nodes[i].selectedItem){this._selectedItem=nodes[i]}this.map.set(nodes[i],metaData)}}.bind(this);recursiveLoopThroughObj(nodes)}},{key:'handleSelectedItem',value:function handleSelectedItem(item){this.selectedItem=item;return this.selectedItemPath}},{key:'getPathToItem',value:function getPathToItem(item){var metaData=this.map.get(item);return metaData.path}},{key:'hasSiblings',value:function hasSiblings(item){var siblings=this.map.get(item).siblings;return siblings&&siblings.length>1}},{key:'getSiblings',value:function getSiblings(item){var siblings=this.map.get(item).siblings;return siblings}},{key:'selectedItem',get:function get(){return this._selectedItem},set:function set(item){if(item){this._selectedItem.selectedItem=false;item.selectedItem=true;this._selectedItem=item}}},{key:'selectedItemPath',get:function get(){var metaData=this.map.get(this._selectedItem);return metaData?metaData.path:undefined}}]);return Graph}()})();
//# sourceMappingURL=px-breadcrumbs.js.map
