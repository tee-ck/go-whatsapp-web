(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter2() {
        EventEmitter2.init.call(this);
      }
      module.exports = EventEmitter2;
      module.exports.once = once;
      EventEmitter2.EventEmitter = EventEmitter2;
      EventEmitter2.prototype._events = void 0;
      EventEmitter2.prototype._eventsCount = 0;
      EventEmitter2.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter2.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter2.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter2.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit("newListener", type, listener.listener ? listener.listener : listener);
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter2.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
      EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter2.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter2.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter2.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter2.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter2.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // src/models/whatsapp.ts
  var Events = __toESM(require_events(), 1);

  // src/utils/ui-utils.ts
  var ui_utils_exports = {};
  __export(ui_utils_exports, {
    get_qr: () => get_qr,
    is_beta: () => is_beta,
    is_chat_page: () => is_chat_page,
    is_landing_page: () => is_landing_page,
    is_loading: () => is_loading,
    refresh_qr: () => refresh_qr,
    until_loaded: () => until_loaded
  });

  // src/utils/utils.ts
  var utils_exports = {};
  __export(utils_exports, {
    base64_to_file: () => base64_to_file,
    blob_to_base64: () => blob_to_base64,
    response: () => response,
    sleep: () => sleep,
    timeout: () => timeout
  });
  function response(status, flag, message, data) {
    return {
      status,
      flag,
      message,
      data
    };
  }
  async function sleep(ms, data) {
    await new Promise((r) => setTimeout(() => r(data), ms));
    return;
  }
  async function timeout(ms) {
    await setTimeout(null, ms);
    throw new Error("");
  }
  async function base64_to_file(mime, base64, filename) {
    const chars = window.atob(base64);
    const bytea = new Uint8Array(chars.length);
    for (let i = 0, len = chars.length; i < len; i++) {
      bytea[i] = chars.charCodeAt(i);
    }
    return new File([bytea], filename || `${new Date().getTime()}.${mime}`, { type: mime });
  }
  async function blob_to_base64(blob) {
    let reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => resolve(reader.result.toString());
      reader.readAsDataURL(blob);
    });
  }

  // src/constants.ts
  var Errors = {
    UNEXPECTED: "UNEXPECTED_ERROR",
    INVALID_PHONE: "INVALID_PHONE",
    CONNECTION_LOST: "CONNECTION_LOST",
    UNAUTHORIZED: "UNAUTHORIZED",
    PAGE_LOAD_FAILED: "PAGE_LOAD_FAILED",
    ZERO_OBJECT_SIZE: "ZERO_OBJECT_SIZE",
    REQUEST_TIMEOUT: "REQUEST_TIMEOUT"
  };
  var WaSocketStream = {
    CONNECTED: "CONNECTED",
    DISCONNECTED: "DISCONNECTED",
    RESUMING: "RESUMING",
    SYNCING: "SYNCING"
  };

  // src/utils/ui-utils.ts
  function is_beta() {
    const expression = `//*[text()="BETA"]`;
    const betaEl = document.evaluate(expression, document, null, XPathResult.ANY_TYPE, null).iterateNext();
    return !!betaEl;
  }
  function is_loading() {
    return !!document.querySelector("progress") || !!document.querySelector("#initial_startup") || !!document.querySelector("#startup");
  }
  async function until_loaded(polling_ms = 100, timeout2 = 3e4) {
    const start = new Date().getTime();
    while (true) {
      if (!is_loading()) {
        return response(200, ``);
      }
      if (timeout2 > 0 && new Date().getTime() - start > timeout2) {
        return response(400, Errors.PAGE_LOAD_FAILED);
      }
      await sleep(polling_ms);
    }
  }
  function is_landing_page() {
    return !!document.querySelector(".landing-wrapper");
  }
  function is_chat_page() {
    return !!document.querySelector("#pane-side");
  }
  function get_qr() {
    try {
      if (!is_landing_page() && (is_chat_page() || is_loading())) {
        return response(500, ``, `[fetch qr error][no qrcode detected]`);
      }
      refresh_qr();
      let qrBlock = document.querySelector("div[data-ref]");
      const qrcode = qrBlock?.getAttribute("data-ref");
      return response(200, ``, `[fetch qr success]`, qrcode);
    } catch (err) {
      return response(500, Errors.UNEXPECTED, `[fetch qr error][unknown error]`);
    }
  }
  function refresh_qr() {
    const button = document.querySelector("div[data-ref]")?.querySelector("button");
    if (!!button) {
      button.click();
    }
  }

  // src/utils/destruct.ts
  async function destruct() {
    let modules = await inject_parasite();
    return unpack_modules(modules);
  }
  function inject_parasite() {
    return new Promise((resolve) => {
      let tag = new Date().getTime();
      window.webpackChunkwhatsapp_web_client.push([
        [`parasite ${tag}`],
        {},
        (o, e, t) => {
          let modules = [];
          for (let idx in o.m) {
            let module = o(idx);
            modules.push(module);
          }
          resolve(modules);
        }
      ]);
    });
  }
  function unpack_modules(modules) {
    let unpacked = {};
    let mods = {
      GK: (mod) => mod.FEATURE_CHANGE_EVENT ? mod : null,
      Store: (mod) => mod?.default?.Chat && mod?.default?.Msg ? mod.default : null,
      MediaCollection: (mod) => mod?.default?.prototype?.processAttachments ? mod.default : null,
      MediaProcess: (mod) => mod?.BLOB ? mod : null,
      Wap: (mod) => mod?.createGroup ? mod : null,
      ServiceWorker: (mod) => mod?.default?.killServiceWorker ? mod.default : null,
      WapDelete: (mod) => mod?.sendCoversationDelete && mod?.SendConcersationDelete?.length > 2 ? mod : null,
      Conn: (mod) => mod?.default?.ref && mod?.default?.refTTL ? mod : null,
      WapQuery: (mod) => mod?.queryExist ? mod : mod?.default?.queryExist ? mod.default : null,
      CryptoLib: (mod) => mod?.decryptE2EMedia ? mod : null,
      OpenChat: (mod) => mod?.default?.prototype?.openChat ? mod.default.prototype.openChat : null,
      UserConstructor: (mod) => mod?.default?.prototype?.isServer ? mod.default : null,
      SendTextMsgToChat: (mod) => mod?.sendTextMsgToChat ? mod.sendTextMsgToChat : null,
      SendMsgToChat: (mod) => mod?.addAndSendMsgToChat ? mod : null,
      RandomID: (mod) => mod?.randomId ? mod.randomId : null,
      MsgKey: (mod) => mod?.default?.fromString ? mod.default : null,
      SendSeen: (mod) => mod?.sendSeen ? mod : null,
      SendClear: (mod) => mod?.sendClear ? mod : null,
      SendDelete: (mod) => mod?.sendDelete ? mod : null,
      SendJoinGroupViaInvite: (mod) => mod?.sendJoinGroupViaInvite ? mod : null,
      MediaPrep: (mod) => mod?.MediaPrep ? mod : null,
      MediaObject: (mod) => mod?.getOrCreateMediaObject ? mod : null,
      MediaUpload: (mod) => mod?.uploadMedia ? mod : null,
      NumberInfo: (mod) => mod?.formattedPhoneNumber ? mod : null,
      USyncUser: (mod) => mod?.USyncUser ? mod.USyncUser : null,
      USyncQuery: (mod) => mod?.USyncQuery ? mod.USyncQuery : null,
      Cmd: (mod) => mod?.Cmd ? mod : null,
      MediaTypes: (mod) => mod?.msgToMediaType ? mod : null,
      Validators: (mod) => mod?.findLinks ? mod : null,
      WidFactory: (mod) => mod?.createWid ? mod : null,
      BlockContact: (mod) => mod?.blockContact ? mod : null,
      GroupMetadata: (mod) => mod?.default?.handlePendingInvite ? mod.default : null,
      Sticker: (mod) => mod?.default?.Sticker ? mod : null,
      UploadUtils: (mod) => mod?.default?.encryptAndUpload ? mod.default : null,
      Label: (mod) => mod?.LabelCollection ? mod : null,
      VCard: (mod) => mod?.vcardFromContactModel ? mod : null,
      User: (mod) => mod?.getMaybeMeUser ? mod : null,
      AppConst: (mod) => mod?.default?.ACK ? mod.default : null,
      AppState: (mod) => mod?.STREAM ? mod : null
    };
    for (let module of modules) {
      if (typeof module != "object" || !module) {
        continue;
      }
      if (!Object.keys(mods).length) {
        break;
      }
      Object.entries(mods).map(([key, fn]) => {
        let result = fn(module);
        if (!!result) {
          window.wapi[key] = result;
          unpacked[key] = result;
          delete mods[key];
        }
      });
    }
    return unpacked;
  }

  // src/models/wapi.ts
  var WhatsAppApi = class {
    core = null;
    is_connected = false;
    on_initiated;
    constructor() {
      console.log(`initializing`);
      if (!!this.core) {
        if (!!this.on_initiated) {
          this.on_initiated();
        }
      } else {
        until_loaded(100).then(this.on_initiated).catch(() => {
        });
      }
      this.init().then();
    }
    async init() {
      this.core = await destruct();
      this.core.AppState.Socket.on("change:state", async (socket) => {
        console.log(`state changed: ${socket.state}`);
      });
      this.core.AppState.Socket.on("change:stream", async (socket) => {
        console.log(`stream changed: ${socket.stream}`);
        switch (socket.stream) {
          case WaSocketStream.CONNECTED:
            this.is_connected = true;
            this.core = await destruct();
            break;
          case WaSocketStream.DISCONNECTED:
            this.is_connected = false;
            break;
          default:
            break;
        }
      });
    }
    is_beta() {
      return !!this.core?.GK?.GK?.features?.MD_BACKEND;
    }
    async query_user(phone) {
      try {
        if (this.is_beta() || is_beta()) {
          let handler = new this.core.USyncQuery().withContactProtocol();
          handler = handler.withUser(new this.core.USyncUser().withPhone("+" + phone));
          const resp = await handler.execute();
          console.log(resp);
          if (!!resp.list[0].id) {
            switch (resp.list[0].contact.type) {
              case "in":
                return response(200, "", `[query user success]`, resp.list[0].id);
              case "out":
                return response(404, Errors.INVALID_PHONE, `[query user error][invalid phone]: ${phone}`);
              default:
                break;
            }
          }
          return response(500, Errors.UNEXPECTED, `[query user error]`);
        } else {
          const resp = await this.core.WapQuery.queryExists(phone + "@c.us");
          switch (resp.status) {
            case 200:
              return response(200, "", `[query user success]`, resp.jid);
            case 404:
              return response(404, Errors.INVALID_PHONE, `[query user error][invalid phone]: ${phone}`);
            default:
              return response(500, Errors.UNEXPECTED, `[query user error][invalid status]: ${resp.status}`);
          }
        }
      } catch (err) {
        return response(500, Errors.UNEXPECTED, `[query user error][unknown error]`);
      }
    }
    async query_chat(remote) {
      let chat;
      let rid;
      let jid;
      if (typeof remote === "string") {
        chat = this.core.Store.Chat.models.find((chat2) => chat2.id.user === remote);
        if (!chat) {
          if (!is_beta()) {
            const resp = await this.query_user(remote);
            switch (resp.status) {
              case 200:
                jid = resp.data;
                break;
              case 402:
                return [response(402, Errors.INVALID_PHONE, `[query chat error][invalid phone format]: ${remote}`)];
              case 404:
                return [response(404, Errors.INVALID_PHONE, `[query chat error][invalid phone]: ${remote}`)];
              case 500:
                return [response(500, Errors.UNEXPECTED, `[query chat error][unexpected error]`)];
            }
          } else {
            try {
              jid = this.core.WidFactory.createUserWid(remote);
            } catch (err) {
              return [response(500, Errors.UNEXPECTED, `[query chat error][create user wid error]`)];
            }
          }
          if (!!jid) {
            chat = this.core.Store.Chat.models[0];
            rid = chat.id;
            chat.id = jid;
          }
        }
      } else {
        chat = this.core.Store.Chat.models.find((chat2) => chat2.id.user === remote.user);
      }
      return [response(200, ``, ``, chat), rid];
    }
    async send_text(remote, message) {
      if (!message) {
        return response(400, Errors.ZERO_OBJECT_SIZE, `[send text error][empty message]`);
      }
      if (typeof remote !== "string" && !remote.user) {
        return response(400, Errors.UNEXPECTED, `[send text error][remote must be string or WaChatId]`);
      }
      try {
        const [resp, rid] = await this.query_chat(remote);
        let chat;
        if (resp.status === 200) {
          chat = resp.data;
        } else {
          return resp;
        }
        await window.wapi.SendTextMsgToChat(chat, message);
        if (!!rid) {
          chat.id = rid;
        }
        return response(200, ``, `[send text success]`);
      } catch (err) {
        return response(500, Errors.UNEXPECTED, `[send text error][unknown error]`, err);
      }
    }
    async send_media(remote, files, opts) {
      let chat;
      let rid;
      try {
        let [resp, _rid] = await this.query_chat(remote);
        chat = resp.data;
        rid = _rid;
        if (files.length === 0) {
          return response(400, Errors.ZERO_OBJECT_SIZE, `[send media error][empty message]`);
        }
        let attachments = [...files.map((file) => ({ file })), files.length];
        let mc = new this.core.MediaCollection(chat);
        await mc.processAttachments(attachments, chat, 1);
        if (files.length === 1) {
          await mc.models[0].sendToChat(chat, { caption: opts?.caption });
        } else {
          for (const model of mc.models) {
            await model.sendToChat(chat, { caption: null });
          }
          if (opts?.caption) {
            try {
              await this.core.SendTextMsgToChat(chat, opts?.caption);
            } catch (err) {
              return response(500, Errors.UNEXPECTED, `[send media error][send caption separately as text failed]`);
            }
          }
        }
      } catch (err) {
        console.error(err);
        return response(500, Errors.UNEXPECTED, `[send media error][process attachments error]`);
      } finally {
        if (!!chat && !!rid) {
          chat.id = rid;
        }
      }
      return response(200, ``, `[send media success]`);
    }
    async until_connected(polling = 100, timeout2 = 1e4) {
      const start = new Date().getTime();
      while (new Date().getTime() - start < timeout2) {
        if (!!this.is_connected) {
          return;
        }
        await sleep(polling);
      }
      throw new Error();
    }
  };
  var wapi_default = new WhatsAppApi();

  // src/models/message.ts
  var Message = class {
    #proto;
    files;
    constructor(proto) {
      this.#proto = proto;
      this.files = [];
    }
    get kind() {
      return this.#proto.kind;
    }
    get body() {
      return this.#proto.body;
    }
    get opts() {
      return this.#proto.opts;
    }
    static async from(proto) {
      let message = new Message(proto);
      if (message.opts?.attachments?.length > 0) {
        for (let attachment of message.opts.attachments) {
          let file = await base64_to_file(attachment.mimetype, attachment.body, attachment.filename);
          message.files.push(file);
        }
      }
      return message;
    }
    static async fromString(content) {
      return new Message({
        kind: "text",
        body: content
      });
    }
  };

  // src/models/chat.ts
  var Chat = class {
    #source;
    constructor(chat) {
      this.#source = chat;
    }
  };

  // public/manifest.json
  var version = "1.2.0";

  // src/models/whatsapp.ts
  var WhatsApp = class extends Events.EventEmitter {
    #key;
    #version = version;
    #ui = ui_utils_exports;
    #utils;
    #api;
    #session;
    #whatsapp;
    #caches;
    models = {
      Chat,
      Message
    };
    constructor() {
      super();
      this.#ui = ui_utils_exports;
      this.#utils = utils_exports;
      this.#api = wapi_default;
      this.#caches = {
        messages: {}
      };
    }
    get remote() {
      let [
        phone,
        server
      ] = JSON.parse(localStorage.getItem("last-wid") || localStorage.getItem("last-wid-md") || '""').split("@");
      if (phone.indexOf(":") >= 0) {
        phone = phone.split(":")[0];
      }
      return phone;
    }
    set session_key(key) {
      this.#key = key;
    }
    get session_key() {
      return this.#key;
    }
    get version() {
      return this.#version;
    }
    get ui() {
      return this.#ui;
    }
    get utils() {
      return this.#utils;
    }
    get api() {
      return this.#api;
    }
    get is_connected() {
      return this.#api.is_connected;
    }
    get_session() {
      if (this.#ui.is_beta()) {
        return response(500, Errors.UNEXPECTED, `[get_session error][beta not yet support]`, ``);
      } else {
        const {
          WAToken1,
          WAToken2,
          WABrowserId,
          WASecretBundle
        } = JSON.parse(JSON.stringify(localStorage));
        const data = {
          WAToken1,
          WAToken2,
          WABrowserId,
          WASecretBundle
        };
        return response(200, ``, ``, data);
      }
    }
    set_session(session) {
      if (this.#ui.is_beta()) {
        return response(500, Errors.UNEXPECTED, `[set_session error][beta not yet support]`);
      } else {
        indexedDB.deleteDatabase("wawc");
        Object.entries(session).forEach(([key, val]) => localStorage.setItem(key, val));
        return response(200, ``, ``);
      }
    }
    async cache_message(msg) {
      const message = await Message.from(msg);
      const id = `${new Date().getTime()}-${(Math.random() * 1e6).toFixed(0)}`;
      this.#caches.messages[id] = message;
      return id;
    }
    async fetch_files() {
      const input = document.createElement("input");
      input.type = "file";
      input.click();
      return await new Promise((resolve) => {
        input.oninput = (ev) => {
          const input2 = ev.target;
          resolve([...input2.files]);
        };
      });
    }
    async send_cache_message(chat, message_id) {
      try {
        const message = this.#caches.messages[message_id];
        if (!message) {
          return response(404, `[send_cache_message error]: invalid message cache id`);
        }
        return this.send_message(chat, message);
      } catch (err) {
        return response(500, `[send_cache_message error]: send cache message failed`);
      }
    }
    async send_message(chat, proto, timeout2 = 3e3) {
      let message;
      try {
        if (proto instanceof Message) {
          message = proto;
        } else {
          message = await Message.from(proto);
        }
        if (!!timeout2) {
          setTimeout(() => {
            throw Error("timeout");
          }, timeout2);
        }
        switch (proto.kind) {
          case "text":
            return await this.#api.send_text(chat, proto.body);
          case "media":
            return await this.#api.send_media(chat, message.files, {
              caption: proto.opts.caption
            });
          default:
            return response(400, `invalid message`);
        }
      } catch (err) {
        if (!!err.status) {
          return response(err.status, err.message);
        }
        if (err.message === "timeout") {
          return response(408, `send message timeout`);
        }
        return response(500, `unexpected error`);
      }
    }
  };
  var whatsapp_default = new WhatsApp();

  // src/index.ts
  (async () => {
    window.wapi = {};
    window.whatsapp = whatsapp_default;
  })();
})();
