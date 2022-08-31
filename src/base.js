if(typeof struts == "undefined") {
    throw new Error("请先导入struts.js");
}
window.LinkQueue = struts.LinkQueue;
window.LinkStack = struts.LinkStack;
window.events = {}; // "元素: { "事件名": [] }"
// window.modalStr = `<div id="${model_id}" class="modal fade" tabindex="-1" role="dialog">
// <div class="modal-dialog" role="document">
// <div class="modal-content">
//   <div class="modal-header">
//     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//     <h4 class="modal-title">${title}</h4>
//   </div>
//   <div class="modal-body">
//     ${message}
//   </div>
//   <div class="modal-footer" style="text-align: center;">
//     <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
//   </div>
// </div>
// </div>
// </div>`;
console.warn("==★此处应该判断所需的前置插件是否已经安装★==");
window.addEventListener = function(jsDom, eventName, handler, fn) { //使用该方法为 元素添加监听 后续可以获取到元素
  //从window.events中获取该元素注册的事件
  if(window.events[jsDom]) {
    let handlers = window.events[jsDom][eventName];
    if(handlders && handlers.constructor === Array) {
      handlers.push(handler);
    } else {
      window.events[jsDom][eventName] = [];
      window.events[jsDom][eventName].push(handler);
    }

  } else {
    window.events[jsDom] = {};
    window.events[jsDom][eventName] = [];
    window.events[jsDom][eventName].push(handler);
  }
  jsDom.addEventListener(eventName, handler, fn);
}

const createElement = function(propObj) {
  let { tagName, defAttr={}, custAttr={}, sonNodes=[], handlers={} } = propObj;
  if(typeof tagName != "string") {
    console.error("请正确输入tagName");
    return;
  }
  let element = document.createElement(tagName);
  // 处理属性 文字
  for(let defAttrName in defAttr) {
    if(defAttrName === "class" && typeof defAttr[defAttrName] === "string") { // 传入类名的是: "classa classb"
      element.setAttribute("class", defAttr[defAttrName]);
    }
    else if(defAttrName === "class" && typeof defAttr[defAttrName].constructor === Array) { // 传入的是 ["classa", "classb"]
      element.setAttribute("class", defAttr.join(" "));
    }
    else if(defAttrName === "style") {
      for(let cssName in defAttr[defAttrName]) {
        let arr = cssName.split("-");
        arr[1] = arr[1][0].toUpperCase() + arr[1].substring(1);
        let newCssName = arr.join("");
        element.style[newCssName] = defAttr[defAttrName][cssName];
      }
    }
    else {
      element[defAttrName] = defAttr[defAttrName];
    }
  }
  // 处理自定义属性
  for(let custAttrName in custAttr) {
    element.setAttribute(custAttrName, custAttr[custAttrName]);
  }
  //创建子节点
  for(let index in sonNodes) {
    let node = sonNodes[index];
    console.log(node);
    element.append(createElement(node));
  }
  //事件处理
  for(let eventName in handlers) {
    let handler = handlers[eventName];
    if(typeof handler != "function") {
      console.error("元素: " + element + "未注册事件: " + eventName + "！原因: " + eventName + " 事件对应的handler不是一个函数！");
      continue;
    }
    addEventListener(element, eventName, handler, false);
  }

  return element;
}
// console.warn("HTMLDocument.prototype.createElement 已被重写！原HTMLDocument.prototype.createElement 存放于 createElement 变量中！");
document.ready = function(callback) {
  if(document.addEventListener) {
    document.addEventListener("DOMContentLoaded", () => {
      document.removeEventListener("DOMContentLoaded", arguments.callee);
      callback();
    }, false);
  } else if(document.attachEvent) {
    document.attachEvent("onreadystatechange", () => {
      if(document.readyState === "complete") {
        document.detachEvent("onreadystatechange", arguments.callee)
        callback();
      }
    });
  } else if(document.lastChild === document.body){
    callback();
  }
}

// window.modal = { "big": [ { "id": "i333"}, {} ], "small" };
window.modal = { "big": [], "small": [] };
function initModal(size) {
  if(size === "big") {
    let id = "bootstrap_modal" + parseInt(Math.random()*10000)
    let bigModal = createElement("div", {
      defAttr: {
        "class": ["modal", "fade"],
        "id": id,
        "tabindex": -1,
        "role": "dialog"
      },
      custAttr: {}
    });
  } else if(size === "small"){

  }


}

// window.$alert = function (message, title) {
//     if(!message) { console.error("请输入需要弹出的消息！"); }
//     title = title || "";
//     let model_dom = window.$alertModal;
//     if(!model_dom) {
//       let model_id = "model_id_" + Math.random();
//       let domStr = `<div id="${model_id}" class="modal fade" tabindex="-1" role="dialog">
//     <div class="modal-dialog" role="document">
//       <div class="modal-content">
//         <div class="modal-header">
//           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//           <h4 class="modal-title">${title}</h4>
//         </div>
//         <div class="modal-body">
//           ${message}
//         </div>
//         <div class="modal-footer" style="text-align: center;">
//           <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
//         </div>
//       </div>
//     </div>
//   </div>`;
//       //创建 Model DOM
//       model_dom = $(domStr);
//       window.$alertModal = model_dom;
//       $('body').append(model_dom);
//     }
//     else {
//       model_dom.find(".modal-title").text(title);
//       model_dom.find(".modal-body").text(message);
//     }
//     model_dom.modal({
//       show: true,
//       backdrop: 'static'
//     });
// }
// let window.$confirmModal = {  };

// window.$confirm = function(config) {
//
//   let {
//     title="",
//     message,
//     callback,
//     size="big"
//   } = config;
//
//   if(typeof callback != 'function') {
//     console.error("window.$confirm 需要传入一个回调函数用于接受确定或取消的值");
//     return;
//   }
//   let model_dom = ;
//   if(!model_dom) {
//     let model_id = "model_id_" + Math.random();
//     let domStr = `<div id="${model_id}" class="modal fade" tabindex="-1" role="dialog">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title">${title}</h4>
//       </div>
//       <div class="modal-body">
//         ${message}
//       </div>
//       <div class="modal-footer" style="text-align: center;">
//         <button type="button" class="btn btn-default" id="${model_id}_confirm">确定</button>
//         <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
//       </div>
//     </div>
//   </div>
// </div>`;
//     //创建 Model DOM
//     model_dom = $(domStr);
//     window.$confirmModal = model_dom;
//     $('body').append(model_dom);
//
//   }
//   else {
//     model_dom.find(".modal-title").text(title);
//     model_dom.find(".modal-body").text(message);
//   }
//   model_dom.modal({
//     show: true,
//     backdrop: 'static'
//   });
// }
