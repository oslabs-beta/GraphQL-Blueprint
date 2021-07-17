/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "6fe9cc3929fa6d577b5a";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./index.jsx","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/css-loader/index.js!./components/app.css":
/*!*******************************************************!*\
  !*** ../node_modules/css-loader!./components/app.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"\\n\\n.app-container{\\n  display: flex; \\n  flex-direction: column; \\n  width: 100%;\\n  height: 100vh; \\n  padding-bottom: 10rem;\\n}\\n\\n.app-header{\\n  width: 100%; \\n  text-align: center;\\n}\\n\\n.app-body-container{\\n  display: flex; \\n  flex-direction: column; \\n  width: 100%;\\n  /* height: 100%;  */\\n}\\n\\n.tabs{\\n  width: 100%;\\n  /* min-width: 750px;  */\\n}\\n\\nh1{\\n  margin-top: 0 !important;\\n}\\n\\n.loader{\\n  margin: 0 auto; \\n}\\n\\nhr {\\n  margin-top: 5px;\\n  margin-bottom: 5px;\\n}\\n\\nbutton{\\n  margin-top: 5px;\\n}\\n\\nbutton:disabled {\\n  opacity: 0.5;\\n}\\n\\n.table div span {\\n  margin-top: 5px;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/app.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/code/code.css":
/*!*************************************************************!*\
  !*** ../node_modules/css-loader!./components/code/code.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"h1,h2,h3,h4,h5,h6,p{\\n  font-family: \\\"Ubuntu\\\", sans-serif\\n}\\n\\n.codeHeader{\\n  text-align: center;\\n}\\n\\nhr {\\n  color: white; \\n  background: white; \\n}\\n\\npre {\\n  opacity: 0.8;\\n  width: 100%;  \\n}\\n\\n#column-filler-for-scroll {\\n  height: 100%; \\n  width: 100%; \\n}\\n\\n.code-app {\\n  display: flex;\\n  flex-direction: row;\\n  position: relative; \\n  width: 100vw;\\n  height: calc(100vh - 98px);\\n  min-height: 450px;\\n  /* min-width: 750px;  */\\n  padding: 0;\\n  margin: 0; \\n  text-align: left; \\n  color: white;\\n  background-color: #252935;\\n}\\n\\n#code-container-client{\\n  position: relative; \\n  width: 33.33%; \\n  padding: 10px; \\n  overflow: auto;\\n  border-left: 5px solid #393f4a;\\n}\\n\\n#code-container-database{\\n  position: relative; \\n  display: flex;\\n  flex-direction: column; \\n  width: 33.33%; \\n  padding: 10px; \\n  overflow: auto;\\n  border-right: 5px solid #393f4a;\\n}\\n\\n#code-container-server{\\n  position: relative; \\n  width: 33.33%; \\n  padding: 10px; \\n  overflow: auto;\\n  border-right: 5px solid #393f4a;\\n  border-left: 5px solid #393f4a;\\n}\\n\\nform {\\n  display: flex;\\n  \\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/code/code.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/databases/schema.css":
/*!********************************************************************!*\
  !*** ../node_modules/css-loader!./components/databases/schema.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".schema-app-container{\\n  display: flex; \\n  flex-direction: row-reverse;\\n  width: 100%;\\n  min-height: 450px;\\n  height: calc(100vh - 98px);\\n  position: relative;\\n}\\n\\n#sidebar-container {\\n  position: relative;\\n  background-color:  rgb(255, 255, 255);\\n  border-left: 1px solid #F1F1F1;\\n  display: flex;\\n  flex-direction: column;\\n  margin: 0;\\n  width: 250px; \\n  justify-content: flex-start;\\n  flex-shrink: 0; \\n}\\n\\n.table {\\n  position: relative;\\n  overflow: hidden;\\n  display: block;\\n  width: 100%; \\n  margin: 0; \\n  border-radius: 8px;\\n  border: 1px solid #F1F1F1;\\n  background-color: rgb(255, 255, 255);\\n  padding: 12px;\\n  box-shadow: none;\\n  transition: all 360ms linear;\\n}\\n\\n.edit-tables {\\n  background-color: #fff!important;\\n  color: #000;\\n}\\n\\n.edit-tables:hover {\\n  background-color: #f1f1f1!important;\\n}\\n\\n.table:hover {\\n  box-shadow: 0px 0px 50px -20px rgba(0, 0, 0, 0.25);\\n}\\n\\n.table button {\\n  opacity: 0;\\n  transition: opacity 360ms linear;\\n}\\n\\n.table:hover button {\\n  opacity: 1;\\n}\\n\\n.table .db-logo {\\n  margin: 2px 8px 11px 0;\\n  width: 26px;\\n  height: 26px;\\n  float: left;\\n}\\n\\n.tableButton {\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.tableButton h4 {\\n  font-size: 18px;\\n  display: block;\\n  line-height: 1.3em;\\n}\\n\\n.tableButton h4 small {\\n  display: block;\\n  font-weight: normal;\\n}\\n\\n.type {\\n  cursor: pointer;\\n  display: flex; \\n  justify-content: space-between;\\n  align-items: center;\\n  position: relative;\\n}\\n\\n.field{\\n  display: flex; \\n  justify-content: space-between;\\n  align-items: center;\\n  position: relative;\\n  margin: 5px 0;\\n}\\n\\n.fieldContainer1 {\\n  position: relative;\\n  display: flex;\\n  width: 96%;\\n  left: 5px;\\n}\\n\\n.fieldContainer2 {\\n  position: relative;\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  width: 96%;\\n}\\n\\n.delete-button {\\n  position: absolute;\\n  right: 5px;\\n}\\n\\n.delete-button svg {\\n  fill: #A1A1A1;\\n}\\n\\n.addField {\\n  display: flex;\\n  left: 0;\\n  justify-content: center;\\n  align-items: center;\\n  text-align: center;\\n  height: 30px;\\n  background-color: transparent;\\n  color: #000;\\n  cursor: pointer;\\n  position: relative;\\n  width: 100%;\\n  margin: 8px 0;\\n}\\n\\n.fieldBreak {\\n  width: 100%;\\n  height: 1px;\\n  border: none;\\n  margin: 0;\\n  background-color: rgba(200, 200, 200, 0.6);\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/databases/schema.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/databases/sidebar/sidebar.css":
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader!./components/databases/sidebar/sidebar.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"h1,h2,h3,h4,h5,h6,p{\\n  font-family: \\\"Ubuntu\\\", sans-serif\\n}\\n\\n#create-table-form h2{\\n  margin-top: 10px; \\n}\\n\\n#create-table-form h6,input{\\n  margin-top: 10px; \\n  margin-bottom: 10px; \\n}\\n\\n#tableName{\\n  display: flex;\\n}\\n\\n#newTable {\\n  display: flex;\\n  flex-direction: column;\\n  width: 100%;\\n  height: 100%; \\n  margin: 0;\\n  justify-content: flex-start;\\n  /* min-height: 350px;  */\\n  position: absolute;\\n  overflow: auto;\\n}\\n\\n#fieldOptions {\\n  /* position: absolute; */\\n  display: flex;\\n  justify-content: center;\\n  margin: 0;\\n  width: auto; \\n  height: auto; \\n  overflow-y: auto; \\n}\\n\\n\\nform {\\n  display: flex; \\n  flex-direction: column; \\n  padding: 0px 24px;\\n  min-height: 220px; \\n  color: #000; \\n  overflow-y: auto; \\n}\\n\\nselect{\\n  -webkit-appearance: none; \\n  -moz-appearance: none;\\n  appearance: none;\\n}\\n\\n\\n\\n#back-to-create{\\n  text-align: left !important;\\n  width: 100%; \\n}\\n\\n/* #loader-container{\\n  height: 100%;\\n  width: 100%; \\n  display: flex;\\n  justify-content: center;\\n  align-items: center; \\n  min-height: 150px; \\n} */\\n\\n.relation-options{\\n  font-size: 14px;\\n  display: flex;\\n  align-items: flex-end; \\n  font-family: \\\"Helvetica Neue\\\",Helvetica,Arial,sans-serif;\\n  font-weight: 600; \\n}\\n\\nimg {\\n  max-width: 100%;\\n  height: auto;\\n  max-height: 100%;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/databases/sidebar/sidebar.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/navbar/export-code/loader.css":
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader!./components/navbar/export-code/loader.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".loader {\\n  position: relative;\\n  height: 100px;\\n  width: 100px;\\n}\\n   \\n.hexContainer{\\n  position: relative;\\n  top: 27.5px;\\n  -webkit-animation: spin 2.5s ease-in-out infinite;\\n    animation: spin 2.5s ease-in-out infinite;\\n}\\n\\n.hex {\\n  width: 80px;\\n  height: 45px;\\n  background: rgb(255,66,128);\\n  margin: auto auto;\\n  position: relative;\\n}\\n\\n.hex:before, .hex:after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  width: 0;\\n  height: 0;\\n}\\n\\n.hex:before {\\n  top: -24px;\\n  left: 0;\\n  border-left: 40px solid transparent;\\n  border-right: 40px solid transparent;\\n  border-bottom: 25px solid rgb(255,66,128);\\n}\\n\\n.hex:after {\\n  bottom: -24px;\\n  left: 0;\\n  border-left: 40px solid transparent;\\n  border-right: 40px solid transparent;\\n  border-top: 25px solid rgb(255,66,128);\\n}\\n\\n.inner {\\n  background-color:rgb(36, 40, 46);\\n  -webkit-transform: scale(.86, .86);\\n  -moz-transform: scale(.86, .86);\\n  transform: scale(.86, .86);\\n  z-index:1;\\n}\\n\\n.inner:before {\\n  border-bottom: 25px solid rgb(36, 40, 46);\\n}\\n\\n.inner:after {\\n  border-top: 25px solid rgb(36, 40, 46);\\n} \\n \\n.triangleContainer {\\n  position: absolute;\\n  top: 16px;\\n}\\n\\n.triangle {\\n  display: inline-block;\\n  height: 15px;\\n  position: absolute;\\n  top: -4px;\\n  left: 15px;\\n  z-index: 3;\\n  border-bottom: solid 59px rgb(255,66,128);\\n  border-right: solid 35px transparent;\\n  border-left: solid 35px transparent;\\n}\\n\\n.triangleInner {\\n  display: inline-block;\\n  height: 15px;\\n  position: absolute;\\n  top: 11px;\\n  left: -23.5px;\\n  z-index: 4;\\n  border-bottom: solid 42px rgb(36, 40, 46);\\n  border-right: solid 24px transparent;\\n  border-left: solid 24px transparent;\\n}\\n   \\n.ballContainer {\\n  position: absolute;\\n  top: 7px;\\n  left: 7px;\\n  z-index: 5;\\n  height: 86px;\\n  width: 86px;\\n  border-radius: 50%;\\n  -webkit-animation: spin 2.5s ease-in-out infinite;\\n  animation: spin 2.5s ease-in-out infinite;\\n}\\n\\n.balls {\\n  height: 86px;\\n  width: 86px;\\n  border-radius: 50%;\\n  position: absolute;\\n  z-index: 6;\\n}\\n\\n.balls:after {\\n  content: \\\"\\\";\\n  height: 20px;\\n  width: 20px;\\n  border-radius: 50%;\\n  background-color: rgb(255,66,128);\\n  position: relative;\\n  display: block;\\n}\\n\\n.ball1:after {\\n  left: -2px;\\n  top: 14px;\\n}\\n\\n.ball2:after {\\n  left: 33px;\\n  top: -8px;\\n}\\n\\n.ball3:after {\\n  left: 70px;\\n  top: 14px;\\n}\\n\\n.ball4:after {\\n  left: 70px;\\n  top: 53px;\\n}\\n\\n.ball5:after {\\n  left: 33px;\\n  top: 75px;\\n}\\n\\n.ball6:after {\\n  left: -2px;\\n  top: 53px;\\n}\\n\\n@-webkit-keyframes spin {\\n  0% {\\n    -webkit-transform: rotate(0deg);\\n            transform: rotate(0deg);\\n  }\\n  100% {\\n    -webkit-transform: rotate(360deg);\\n            transform: rotate(360deg);\\n  }\\n}\\n\\n@keyframes spin {\\n  0% {\\n    -webkit-transform: rotate(0deg);\\n            transform: rotate(0deg);\\n  }\\n  100% {\\n    -webkit-transform: rotate(360deg);\\n            transform: rotate(360deg);\\n  }\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/navbar/export-code/loader.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/navbar/info/info.css":
/*!********************************************************************!*\
  !*** ../node_modules/css-loader!./components/navbar/info/info.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".info-container{\\n  text-align: center;\\n  margin-top: -7vh;\\n}\\n\\n.info-box{\\n  width: 400px;\\n  height: 300px; \\n}\\n\\n\\n#subtitle{\\n  font-size: 50px;\\n}\\n\\n.info-btn{\\n  display: flex;\\n  justify-content: space-around;\\n  border: '1px solid white';\\n  width: '125px';\\n  font-size: '1.2em';\\n  color: 'white';\\n}\\n\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/navbar/info/info.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/navbar/navbar.css":
/*!*****************************************************************!*\
  !*** ../node_modules/css-loader!./components/navbar/navbar.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"#navbar{\\n  background-color: rgb(255, 255, 255);\\n  width: 100%;\\n  height: 50px; \\n  display: flex; \\n  flex-direction: row; \\n  justify-content: space-between;\\n  align-items: center; \\n  padding: 0px 0px 0px 10px;\\n}\\n\\n#nav-left{\\n  height: 85%;\\n  padding: 0px 10px; \\n  display: flex; \\n  align-items: center; \\n}\\n\\n#nav-right{\\n  height: 85%;\\n  padding: 0px 10px; \\n  display: flex; \\n  align-items: center; \\n}\\n\\n#header-name {\\n  color: white; \\n  padding: 0px 0px 0px 10px;\\n  color: rgb(255,66,128); \\n}\\n\\n.overlay {\\n  z-index: 99;\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n  height: 100vh;\\n  width: 100vw;\\n  background-color: rgba(0, 0, 0, 0.6);\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n}\\n\\n.tree-box{\\n  min-width: 400px;\\n  min-height: 500px; \\n  display: flex;\\n  flex-direction: column;\\n  height: 100%; \\n}\\n\\n.tree-box2{\\n  display: flex;\\n  flex-direction: column;\\n  height: 100%;\\n}\\n\\n.node__root > circle {\\n  fill: red;\\n}\\n\\n.node__branch > circle {\\n  fill: yellow;\\n}\\n\\n.node__leaf > circle {\\n  fill: green;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/navbar/navbar.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/navbar/tree-view/treeView.css":
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader!./components/navbar/tree-view/treeView.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".tree-container{\\n  display: fixed;\\n  overflow: auto;\\n  min-height: 200px;\\n  margin-top: 20px;\\n  margin-bottom: 20px;\\n}\\n.tree-box {\\n  background-color: #282A36!important;\\n  padding: 0;\\n}\\n\\n.tree-box > div {\\n  padding: 0!important;\\n}\\n\\n.rd3t-svg {\\n  max-width: 100%;\\n  max-height: 100%;\\n}\\n\\n.node-title {\\n  /* dx: -200; */\\n  fill: green;\\n}\\n\\n.node__root > circle {\\n  fill: #FA8CA0;\\n}\\n\\n.rd3t-label,\\n.rd3t-label__title,\\n.rd3t-label__attribute {\\n  fill: #F8F8F2;\\n  stroke: #F8F8F2!important;\\n}\\n\\n.rd3t-link {\\n  stroke: #8BE9FD!important;\\n}\\n\\n\\n.node__branch > circle {\\n  fill: #F1FA8C;\\n}\\n\\n.node__leaf > circle {\\n  fill: #9BFA8C;\\n}\\n\\n.rd3t-node,\\n.rd3t-leaf-node{\\n  stroke: none!important;\\n}\\n\\n.rd3t-g {\\n  transform: translate(364.457, 145.335) scale(0.807761, 0.807761);\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/navbar/tree-view/treeView.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/schema/schema.css":
/*!*****************************************************************!*\
  !*** ../node_modules/css-loader!./components/schema/schema.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".schema-app-container{\\n  display: flex; \\n  flex-direction: row-reverse;\\n  width: 100%;\\n  min-height: 450px;\\n  height: calc(100vh - 98px);\\n  position: relative;\\n}\\n\\n#sidebar-container {\\n  position: relative;\\n  background-color:  rgb(255, 255, 255);\\n  display: flex;\\n  flex-direction: column;\\n  margin: 0;\\n  width: 250px; \\n  justify-content: flex-start;\\n  flex-shrink: 0; \\n}\\n\\n.table {\\n  display: flex; \\n  flex-direction: column; \\n  width: 250px; \\n  margin: 40px; \\n  box-shadow: 3px 3px 12.5px black;\\n  background-color: rgb(54, 58, 66, 1);\\n}\\n\\n.tableButton {\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.type {\\n  display: flex; \\n  justify-content: space-between;\\n  align-items: center;\\n  position: relative;\\n}\\n\\n.field{\\n  display: flex; \\n  justify-content: space-between;\\n  align-items: center;\\n  position: relative;\\n  margin: 5px 0;\\n}\\n\\n.fieldContainer1 {\\n  position: relative;\\n  display: flex;\\n  width: 96%;\\n  left: 5px;\\n}\\n\\n.table .fieldContainer1 .delete-button {\\n  opacity: 0;\\n}\\n\\n.table .fieldContainer1:hover .delete-button {\\n  opacity: 1;\\n}\\n\\n.fieldContainer2 {\\n  position: relative;\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  width: 96%;\\n}\\n\\n.fieldButton {\\n  width: 240px;\\n  display: flex; \\n  justify-content: flex-start;\\n  align-items: center;\\n  margin-left: 5px;\\n  cursor: pointer;\\n}\\n\\n.fieldButton small {\\n  margin: 0 1rem;\\n  font-style: italic;\\n}\\n\\n.delete-button {\\n  position: absolute;\\n  right: 5px;\\n}\\n\\n.table-components-container{\\n  display: grid; \\n  grid-template-columns: repeat(4, 1fr);\\n  grid-auto-rows: min-content;\\n  grid-column-gap: 32px;\\n  grid-row-gap: 32px;\\n  margin: 32px;\\n  width: 100%;\\n  margin-bottom: 6rem;\\n  position: relative;\\n  height: auto; \\n  overflow-y: auto;\\n  overflow-x: hidden;\\n}\\n\\n@media only screen and (max-width: 1400px) {\\n  .table-components-container {\\n    grid-template-columns: repeat(3, 1fr);\\n  }\\n}\\n\\n@media only screen and (max-width: 1000px) {\\n  .table-components-container {\\n    grid-template-columns: repeat(2, 1fr);\\n  }\\n}\\n\\n@media only screen and (max-width: 768px) {\\n  .table-components-container {\\n    grid-template-columns: repeat(1, 1fr);\\n  }\\n}\\n\\n@media only screen and (min-width: 2120px) {\\n  .table-components-container {\\n    grid-template-columns: repeat(5, 1fr);\\n  }\\n}\\n\\n@media only screen and (min-width: 2350px) {\\n  .table-components-container {\\n    grid-template-columns: repeat(6, 1fr);\\n  }\\n}\\n\\n.addField {\\n  display: flex;\\n  justify-content: center;\\n  text-align: center;\\n  height: 40px;\\n  background-color: rgb(48, 48, 48);\\n  color: white;\\n  cursor: pointer;\\n  position: relative;\\n  width: 96%;\\n  left: 5px;\\n  margin: 5px 0;\\n}\\n\\n.fieldBreak {\\n  width: 100%;\\n  height: 1px;\\n  border: none;\\n  margin: 0;\\n  background-color: rgba(200, 200, 200, 0.6);\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/schema/schema.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/schema/sidebar/sidebar.css":
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader!./components/schema/sidebar/sidebar.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"h1,h2,h3,h4,h5,h6,p{\\n  font-family: \\\"Ubuntu\\\", sans-serif\\n}\\n\\n#create-table-form h2{\\n  margin-top: 10px; \\n}\\n\\n#create-table-form h6,input{\\n  margin-top: 10px; \\n  margin-bottom: 10px; \\n}\\n\\n#create-table-form button[type=\\\"submit\\\"] {\\n  background-color: #194A9A!important;\\n  border-color: #194A9A;\\n  border-radius: 50px!important;\\n  box-shadow: none;\\n}\\n\\n#create-table-form button[type=\\\"submit\\\"] span {\\n  text-transform: capitalize!important;\\n  letter-spacing: 0.02em!important;\\n}\\n\\n#tableName{\\n  display: flex;\\n}\\n\\n#newTable {\\n  display: flex;\\n  flex-direction: column;\\n  width: 100%;\\n  height: 100%; \\n  margin: 0;\\n  justify-content: flex-start;\\n  /* min-height: 350px;  */\\n  position: absolute;\\n  overflow: auto;\\n}\\n\\n#fieldOptions {\\n  /* position: absolute; */\\n  display: flex;\\n  justify-content: center;\\n  margin: 0;\\n  width: auto; \\n  height: auto; \\n  overflow-y: auto; \\n}\\n\\n\\nform{\\n  display: flex; \\n  flex-direction: column; \\n  padding: 0px 10px;\\n  min-height: 220px; \\n  color: white; \\n  overflow-y: auto; \\n}\\n\\nselect{\\n  -webkit-appearance: none; \\n  -moz-appearance: none;\\n  appearance: none;\\n}\\n\\n\\n\\n#back-to-create{\\n  text-align: left !important;\\n  width: 100%; \\n}\\n\\n/* #loader-container{\\n  height: 100%;\\n  width: 100%; \\n  display: flex;\\n  justify-content: center;\\n  align-items: center; \\n  min-height: 150px; \\n} */\\n\\n.relation-options{\\n  font-size: 14px;\\n  display: flex;\\n  align-items: flex-end; \\n  font-family: \\\"Helvetica Neue\\\",Helvetica,Arial,sans-serif;\\n  font-weight: 600; \\n}\\n\\nimg {\\n  max-width: 100%;\\n  height: auto;\\n  max-height: 100%;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/schema/sidebar/sidebar.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/welcome/team/team.css":
/*!*********************************************************************!*\
  !*** ../node_modules/css-loader!./components/welcome/team/team.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".team{\\n  text-align: center;\\n  color: #484b56; \\n  padding: 20px;\\n  display: flex; \\n  flex-direction: column;\\n  justify-content: space-evenly;\\n\\n}\\n\\n.team-heading h4{\\n  font-size: 21px !important;\\n  font-weight: 700;\\n  font-weight: initial;\\n  align-items: flex-start;\\n  text-align: center;\\n  margin: 1px;\\n  padding: 8px;\\n}\\n\\n.team-heading p {\\n  font-size: 14px;\\n  line-height: 1.34em;\\n  margin-bottom: 1.25rem;\\n}\\n\\n#team-title{\\n  font-size: 0.9rem;\\n  text-align: center;\\n  font-weight: initial;\\n}\\n\\n.team-member h4 {\\n  margin-top: 15px;\\n  font-size: 1.2rem;\\n  font-weight: 600;\\n  display: flex;\\n  font-weight: initial;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: space-between;\\n}\\n\\n.team-links{\\n  padding: 4px; \\n  width: 100%;\\n  height: 100%;\\n  flex-direction: row;\\n  justify-content: space-between;\\n}\\n\\n.team-links a {\\n  padding: 3px; \\n}\\n\\n.row {\\n  margin-top: 12px;\\n  display: grid;\\n  grid-template-columns: repeat(4, 1fr);\\n  column-gap: 16px;\\n  row-gap: 16px;\\n}\\n\\n@media screen and (max-width: 980px) {\\n  .row {\\n    margin-top: 12px;\\n    display: grid;\\n    grid-template-columns: repeat(2, 1fr);\\n  }\\n}\\n\\n@media screen and (max-width: 565px) {\\n  .row {\\n    margin-top: 12px;\\n    display: grid;\\n    grid-template-columns: repeat(1, 1fr);\\n  }\\n}\\n\\n.row .team-member {\\n\\n}\\n\\n.team-member-photo {\\n  width: 150px;\\n  height: 150px;\\n  border-radius: 50%;\\n}\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/welcome/team/team.css?../node_modules/css-loader");

/***/ }),

/***/ "../node_modules/css-loader/index.js!./components/welcome/welcome.css":
/*!*******************************************************************!*\
  !*** ../node_modules/css-loader!./components/welcome/welcome.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ \"../node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".welcome-container{\\n  text-align: center;\\n  margin-top: -7vh;\\n}\\n\\n.welcome-box{\\n  min-width: 300px;\\n  /* min-height: 400px;  */\\n  display: flex;\\n  flex-direction: column;\\n  height: 100%; \\n  position: relative;\\n}\\n\\n.welcome-box box-icon {\\n  fill: #fff;\\n  cursor: pointer;\\n  position: absolute;\\n  left: -3rem;\\n  height: 2rem;\\n  width: 2rem;\\n}\\n\\n.welcome-box > div {\\n  padding: 0!important;\\n}\\n\\n.welcome-split {\\n  display: grid;\\n  grid-template-columns: repeat(7, 1fr);\\n}\\n\\n.welcome-split > div {\\n  padding: 1rem;\\n  text-align-last: left;\\n  max-height: 500px;\\n}\\n\\n.welcome-split div:first-child {\\n  grid-column-start: 1;\\n  grid-column-end: span 3;\\n  color: #484b56;\\n  line-height: 1.07em;\\n}\\n\\n.welcome-split div:first-child a {\\n  color: #484b56;\\n}\\n\\n.welcome-split div:last-child {\\n  padding: 0;\\n  grid-column-start: 4;\\n  grid-column-end: span 7;\\n}\\n.welcome-split div:last-child img {\\n  object-fit: cover;\\n  object-position: center; \\n  height: 100%;\\n}\\n\\n.welcome-split div:first-child > ul > li:last-child {\\n  margin-top: 2rem;\\n}\\n\\n.logos-container {\\n  padding-left: 0;\\n  margin-top: 0.5rem!important;\\n}\\n\\n.logos-container li {\\n  float: left;\\n  margin-right: 1rem;\\n  height: 28px;\\n}\\n\\n.logos-container li img {\\n  object-fit: cover;\\n  object-position: center; \\n}\\n\\n.welcome-split ul {\\n  margin-top: 2rem; \\n  list-style-type: none;\\n  font-size: 14px;\\n}\\n\\n.welcome-split ul li {\\n  margin-bottom: 1rem;\\n  text-align: left;\\n }\\n\\n .welcome-split small {\\n   display: block;\\n }\\n\\n#icon_graphql{\\n  max-width: 25%;\\n  max-height: 5%;\\n}\\n\\n#icon_express{\\n  max-width: 30%;\\n  max-height: 50%;\\n}\\n\\n#icon_react{\\n  max-width: 30%;\\n  max-height: 5%;\\n}\\n\\nh3{\\n  font-size: 50px !important;\\n}\\n\\n#subheading{\\n  font-size: 25px;\\n}\\n\\n#buttonsContainer{\\n  display: flex;\\n  flex-direction: row;\\n  justify-content: space-around;\\n  margin-top: 20px;\\n}\\n\\n.welcome-hr{\\n  height: 2px;\\n  background-color: black;\\n}\\n\\n.iconContainer {\\n  display: flex;\\n  justify-content: space-around;\\n  align-items: center;\\n  margin-top: 20px;\\n  margin-bottom: 20px;\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./components/welcome/welcome.css?../node_modules/css-loader");

/***/ }),

/***/ "../utl/create_file_func/client_mutations.js":
/*!***************************************************!*\
  !*** ../utl/create_file_func/client_mutations.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar tab = '  ';\n\nfunction parseClientMutations(tables) {\n  var query = \"import { gql } from \\'apollo-boost\\';\\n\\n\";\n  var exportNames = [];\n\n  // Build mutations\n  for (var tableId in tables) {\n    // Build add mutations\n    query += buildMutationParams(tables[tableId], 'add');\n    query += buildTypeParams(tables[tableId], 'add');\n    query += buildReturnValues(tables[tableId]);\n    exportNames.push('add' + tables[tableId].type + 'Mutation');\n\n    // Build delete and update mutations if there is an unique id\n    if (tables[tableId].fields[0]) {\n      // update mutations\n      query += buildMutationParams(tables[tableId], 'update');\n      query += buildTypeParams(tables[tableId], 'update');\n      query += buildReturnValues(tables[tableId]);\n      exportNames.push('update' + tables[tableId].type + 'Mutation');\n      // delete mutations\n      query += buildDeleteMutationParams(tables[tableId]);\n      query += buildReturnValues(tables[tableId]);\n      exportNames.push('delete' + tables[tableId].type + 'Mutation');\n    }\n  }\n\n  var endString = 'export {\\n';\n  exportNames.forEach(function (name, i) {\n    if (i === 0) {\n      endString += '' + tab + name + ',\\n';\n    } else {\n      endString += '' + tab + name + ',\\n';\n    }\n  });\n\n  return query += endString + '};';\n}\n\n// builds params for either add or update mutations\nfunction buildMutationParams(table, mutationType) {\n  var query = 'const ' + mutationType + table.type + 'Mutation = gql`\\n' + tab + 'mutation(';\n\n  var firstLoop = true;\n  for (var fieldId in table.fields) {\n    // if there's an unique id and creating an update mutation, then take in ID\n    if (fieldId === '0' && mutationType === 'update') {\n      if (!firstLoop) query += ', ';\n      firstLoop = false;\n\n      query += '$' + table.fields[fieldId].name + ': ' + table.fields[fieldId].type + '!';\n    }\n    if (fieldId !== '0') {\n      if (!firstLoop) query += ', ';\n      firstLoop = false;\n\n      query += '$' + table.fields[fieldId].name + ': ' + checkForMultipleValues(table.fields[fieldId].multipleValues, 'front');\n      query += '' + checkFieldType(table.fields[fieldId].type) + checkForMultipleValues(table.fields[fieldId].multipleValues, 'back');\n      query += '' + checkForRequired(table.fields[fieldId].required);\n    }\n  }\n  return query += ') {\\n' + tab;\n}\n\n// in case the inputed field type is Number, turn to Int to work with GraphQL\nfunction checkFieldType(fieldType) {\n  if (fieldType === 'Number') return 'Int';else return fieldType;\n}\n\nfunction buildDeleteMutationParams(table) {\n  var idName = table.fields[0].name;\n  var query = 'const delete' + table.type + 'Mutation = gql`\\n';\n  query += tab + 'mutation($' + idName + ': ' + table.fields[0].type + '!){\\n';\n  query += '' + tab + tab + 'delete' + table.type + '(' + idName + ': $' + idName + '){\\n';\n  return query;\n}\n\nfunction checkForMultipleValues(multipleValues, position) {\n  if (multipleValues) {\n    if (position === 'front') {\n      return '[';\n    }\n    return ']';\n  }\n  return '';\n}\n\nfunction checkForRequired(required) {\n  if (required) {\n    return '!';\n  }\n  return '';\n}\n\nfunction buildTypeParams(table, mutationType) {\n  var query = '' + tab + mutationType + table.type + '(';\n\n  var firstLoop = true;\n  for (var fieldId in table.fields) {\n    // if there's an unique id and creating an update mutation, then take in ID\n    if (fieldId === '0' && mutationType === 'update') {\n      if (!firstLoop) query += ', ';\n      firstLoop = false;\n      query += table.fields[fieldId].name + ': $' + table.fields[fieldId].name;\n    }\n    if (fieldId !== '0') {\n      if (!firstLoop) query += ', ';\n      firstLoop = false;\n\n      query += table.fields[fieldId].name + ': $' + table.fields[fieldId].name;\n    }\n  }\n  return query += ') {\\n';\n}\n\nfunction buildReturnValues(table) {\n  var query = '';\n\n  for (var fieldId in table.fields) {\n    query += '' + tab + tab + tab + table.fields[fieldId].name + '\\n';\n  }\n\n  return query += '' + tab + tab + '}\\n' + tab + '}\\n`\\n\\n';\n}\n\nmodule.exports = parseClientMutations;\n\n//# sourceURL=webpack:///../utl/create_file_func/client_mutations.js?");

/***/ }),

/***/ "../utl/create_file_func/client_queries.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/client_queries.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar tab = \"  \";\n\nfunction parseClientQueries(tables) {\n  var query = \"import { gql } from \\'apollo-boost\\';\\n\\n\";\n  var exportNames = [];\n\n  // tables is state.tables from schemaReducer\n  for (var tableId in tables) {\n    query += buildClientQueryAll(tables[tableId]);\n    exportNames.push(\"queryEvery\" + tables[tableId].type);\n\n    if (!!tables[tableId].fields[0]) {\n      query += buildClientQueryById(tables[tableId]);\n      exportNames.push(\"query\" + tables[tableId].type + \"ById \");\n    }\n  }\n\n  var endString = 'export {';\n  exportNames.forEach(function (name, i) {\n    if (i) {\n      endString += \", \" + name;\n    } else {\n      endString += \" \" + name;\n    }\n  });\n\n  return query += endString + \"};\";\n}\n\nfunction buildClientQueryAll(table) {\n  var string = \"const queryEvery\" + table.type + \" = gql`\\n\";\n  string += tab + \"{\\n\";\n  string += \"\" + tab + tab + \"every\" + toTitleCase(table.type) + \" {\\n\";\n\n  for (var fieldId in table.fields) {\n    string += \"\" + tab + tab + tab + table.fields[fieldId].name + \"\\n\";\n  }\n\n  return string += \"\" + tab + tab + \"}\\n\" + tab + \"}\\n`\\n\\n\";\n}\n\nfunction toTitleCase(refTypeName) {\n  var name = refTypeName[0].toUpperCase();\n  name += refTypeName.slice(1).toLowerCase();\n  return name;\n}\n\nfunction buildClientQueryById(table) {\n  var string = \"const query\" + table.type + \"ById = gql`\\n\";\n  string += tab + \"query($\" + table.fields[0].name + \": \" + table.fields[0].type + \"!) {\\n\";\n  string += \"\" + tab + tab + table.type.toLowerCase() + \"(\" + table.fields[0].name + \": $\" + table.fields[0].name + \") {\\n\";\n\n  for (var fieldId in table.fields) {\n    string += \"\" + tab + tab + tab + table.fields[fieldId].name + \"\\n\";\n  }\n\n  return string += \"\" + tab + tab + \"}\\n\" + tab + \"}\\n`\\n\\n\";\n}\n\nmodule.exports = parseClientQueries;\n\n//# sourceURL=webpack:///../utl/create_file_func/client_queries.js?");

/***/ }),

/***/ "../utl/create_file_func/graphql_server.js":
/*!*************************************************!*\
  !*** ../utl/create_file_func/graphql_server.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar tab = \"  \";\n\n// Function that evokes all other helper functions\n\nfunction parseGraphqlServer(databases) {\n  var query = \"\";\n  query += \"const graphql = require('graphql');\\n\";\n  for (var databaseIndex in databases) {\n    var database = databases[databaseIndex];\n    // database.data is same as database.tables\n\n    query += buildRequireStatements(database.tables, database.databaseName, database.name);\n  }\n  query += buildGraphqlVariables();\n\n  // BUILD TYPE SCHEMA\n  for (var _databaseIndex in databases) {\n    var tables = databases[_databaseIndex].tables;\n    var databaseName = databases[_databaseIndex].databaseName;\n    for (var tableIndex in tables) {\n      query += buildGraphqlTypeSchema(tables[tableIndex], tables, databaseName);\n    }\n  }\n\n  // BUILD ROOT QUERY\n  query += \"const RootQuery = new GraphQLObjectType({\\n\" + tab + \"name: 'RootQueryType',\\n\" + tab + \"fields: {\\n\";\n\n  var firstRootLoop = true;\n  for (var _databaseIndex2 in databases) {\n    var _tables = databases[_databaseIndex2].tables;\n    var _databaseName = databases[_databaseIndex2].databaseName;\n    for (var _tableIndex in _tables) {\n      if (!firstRootLoop) query += \",\\n\";\n      firstRootLoop = false;\n\n      query += buildGraphqlRootQuery(_tables[_tableIndex], _databaseName);\n    }\n  }\n  query += \"\\n\" + tab + \"}\\n});\\n\\n\";\n\n  // BUILD MUTATIONS\n  query += \"const Mutation = new GraphQLObjectType({\\n\" + tab + \"name: 'Mutation',\\n\" + tab + \"fields: {\\n\";\n\n  var firstMutationLoop = true;\n  for (var _databaseIndex3 in databases) {\n    var _tables2 = databases[_databaseIndex3].tables;\n    var _databaseName2 = databases[_databaseIndex3].databaseName;\n    for (var _tableIndex2 in _tables2) {\n      if (!firstMutationLoop) query += \",\\n\";\n      firstMutationLoop = false;\n\n      query += buildGraphqlMutationQuery(_tables2[_tableIndex2], _databaseName2);\n    }\n  }\n  query += \"\\n\" + tab + \"}\\n});\\n\\n\";\n\n  query += \"module.exports = new GraphQLSchema({\\n\" + tab + \"query: RootQuery,\\n\" + tab + \"mutation: Mutation\\n});\";\n  return query;\n}\n\n/**\n * @param {String} database - Represents the database selected (MongoDB, MySQL, or PostgreSQL)\n * @returns {String} - All the require statements needed for the GraphQL server.\n */\nfunction buildRequireStatements(tables, database, name) {\n  var requireStatements = \"\";\n  if (database === \"MongoDB\") {\n    for (var tableIndex in tables) {\n      requireStatements += \"const \" + tables[tableIndex].type + \" = require('../db/\" + name + \"/\" + tables[tableIndex].type.toLowerCase() + \".js');\\n\";\n    }\n  } else {\n    requireStatements += \"const pool = require('../db/\" + name + \"/sql_pool.js');\\n\";\n  }\n  return requireStatements;\n}\n\n/**\n * @returns {String} - all constants needed for a GraphQL server\n */\nfunction buildGraphqlVariables() {\n  return \"\\nconst { \\n  GraphQLObjectType,\\n  GraphQLSchema,\\n  GraphQLID,\\n  GraphQLString, \\n  GraphQLInt, \\n  GraphQLBoolean,\\n  GraphQLList,\\n  GraphQLNonNull\\n} = graphql;\\n  \\n\";\n}\n\n/**\n * @param {Object} table - table being interated on. Each table consists of fields\n * @param {Object} tables - an object of all the tables created in the application\n * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)\n * @returns {String} - The GraphQL type code for the inputted table\n */\nfunction buildGraphqlTypeSchema(table, tables, database) {\n  var query = \"const \" + table.type + \"Type = new GraphQLObjectType({\\n\";\n  query += tab + \"name: '\" + table.type + \"',\\n\";\n  query += tab + \"fields: () => ({\";\n  query += buildGraphQLTypeFields(table, tables, database);\n  return query += \"\\n\" + tab + \"})\\n});\\n\\n\";\n}\n\n/**\n * @param {Object} table - table being interated on. Each table consists of fields\n * @param {Object} tables - an object of all the tables created in the application\n * @param {String} database - Database selected (MongoDB, MySQL, or PostgreSQL)\n * @returns {String} - each field for the GraphQL type.\n */\nfunction buildGraphQLTypeFields(table, tables, database) {\n  var query = \"\";\n  var firstLoop = true;\n\n  var _loop = function _loop(fieldIndex) {\n    if (!firstLoop) query += \",\";\n    firstLoop = false;\n\n    query += \"\\n\" + tab + tab + buildFieldItem(table.fields[fieldIndex]);\n    // check if the field has a relation to another field\n    if (table.fields[fieldIndex].relation.tableIndex > -1) {\n      query += createSubQuery(table.fields[fieldIndex], tables, database);\n    }\n\n    // check if the field is a relation for another field\n    var refBy = table.fields[fieldIndex].refBy;\n    if (Array.isArray(refBy)) {\n      refBy.forEach(function (value) {\n        var parsedValue = value.split(\".\");\n        var field = {\n          name: table.fields[fieldIndex].name,\n          relation: {\n            tableIndex: parsedValue[0],\n            fieldIndex: parsedValue[1],\n            refType: parsedValue[2],\n            type: table.fields[fieldIndex].type\n          }\n        };\n        query += createSubQuery(field, tables, database);\n      });\n    }\n  };\n\n  for (var fieldIndex in table.fields) {\n    _loop(fieldIndex);\n  }\n  return query;\n}\n\n/**\n * @param {Object} field - an object containing all the information for the field being iterated on\n * @returns {String} - a field item (ex: 'id: { type: GraphQLID }')\n */\nfunction buildFieldItem(field) {\n  return field.name + \": { type: \" + checkForRequired(field.required, \"front\") + checkForMultipleValues(field.multipleValues, \"front\") + tableTypeToGraphqlType(field.type) + checkForMultipleValues(field.multipleValues, \"back\") + checkForRequired(field.required, \"back\") + \" }\";\n}\n\n/**\n * @param {String} type - the field type (ID, String, Number, Boolean, or Float)\n * @returns {String} - the GraphQL type associated with the field type entered\n */\nfunction tableTypeToGraphqlType(type) {\n  switch (type) {\n    case \"ID\":\n      return \"GraphQLID\";\n    case \"String\":\n      return \"GraphQLString\";\n    case \"Number\":\n      return \"GraphQLInt\";\n    case \"Boolean\":\n      return \"GraphQLBoolean\";\n    case \"Float\":\n      return \"GraphQLFloat\";\n    default:\n      return \"GraphQLString\";\n  }\n}\n\n/**\n * @param {String} refTypeName - Any string inputted\n * @returns {String} - The string inputted, but with the first letter capitalized and the rest lowercased\n */\nfunction toTitleCase(refTypeName) {\n  var name = refTypeName[0].toUpperCase();\n  name += refTypeName.slice(1).toLowerCase();\n  return name;\n}\n\n/**\n * @param {Object} field - field being iterated on\n * @param {Object} tables - all the tables made by the user.\n * @param {String} database - Datbase selected\n * @returns {String} - Builds a sub type for any field with a relation.\n */\nfunction createSubQuery(field, tables, database) {\n  var refTypeName = tables[field.relation.tableIndex].type;\n  var refFieldName = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].name;\n  var refFieldType = tables[field.relation.tableIndex].fields[field.relation.fieldIndex].type;\n  var query = \",\\n\" + tab + tab + createSubQueryName(field, refTypeName) + \": {\\n\" + tab + tab + tab + \"type: \";\n\n  if (field.relation.refType === \"one to many\" || field.relation.refType === \"many to many\") {\n    query += \"new GraphQLList(\" + refTypeName + \"Type),\";\n  } else {\n    query += refTypeName + \"Type,\";\n  }\n  query += \"\\n\" + tab + tab + tab + \"resolve(parent, args) {\\n\";\n\n  if (database === \"MongoDB\") {\n    query += \"\" + tab + tab + tab + tab + \"return \" + refTypeName + \".\" + findDbSearchMethod(refFieldName, refFieldType, field.relation.refType);\n    query += \"(\" + createSearchObject(refFieldName, refFieldType, field) + \");\\n\";\n    query += \"\" + tab + tab + tab + \"}\\n\";\n    query += \"\" + tab + tab + \"}\";\n  }\n\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"const sql = `SELECT * FROM \\\"\" + refTypeName + \"\\\" WHERE \\\"\" + refFieldName + \"\\\" = '${parent.\" + field.name + \"}';`\\n\";\n    query += buildSQLPoolQuery(field.relation.refType);\n    query += \"\" + tab + tab + tab + \"}\\n\";\n    query += \"\" + tab + tab + \"}\";\n  }\n  return query;\n}\n\n/**\n * @param {String} refType - The relation type of the sub query\n * @returns {String} - the code for a SQL pool query.\n */\nfunction buildSQLPoolQuery(refType) {\n  var rows = \"\";\n  if (refType === \"one to one\" || refType === \"many to one\") rows = \"rows[0]\";else rows = \"rows\";\n\n  var query = \"\" + tab + tab + tab + tab + \"return pool.query(sql)\\n\";\n  query += \"\" + tab + tab + tab + tab + tab + \".then(res => res.\" + rows + \")\\n\";\n  query += \"\" + tab + tab + tab + tab + tab + \".catch(err => console.log('Error: ', err))\\n\";\n  return query;\n}\n\nfunction createSubQueryName(field, refTypeName) {\n  switch (field.relation.refType) {\n    case \"one to one\":\n      return \"related\" + toTitleCase(refTypeName);\n    case \"one to many\":\n      return \"everyRelated\" + toTitleCase(refTypeName);\n    case \"many to one\":\n      return \"related\" + toTitleCase(refTypeName);\n    case \"many to many\":\n      return \"everyRelated\" + toTitleCase(refTypeName);\n    default:\n      return \"everyRelated\" + toTitleCase(refTypeName);\n  }\n}\n\nfunction findDbSearchMethod(refFieldName, refFieldType, refType) {\n  if (refFieldName === \"id\" || refFieldType === \"ID\") return \"findById\";else if (refType === \"one to one\") return \"findOne\";else return \"find\";\n}\n\nfunction createSearchObject(refFieldName, refFieldType, field) {\n  if (refFieldName === \"id\" || refFieldType === \"ID\") {\n    return \"parent.\" + field.name;\n  } else {\n    return \"{ \" + refFieldName + \": parent.\" + field.name + \" }\";\n  }\n}\n\nfunction buildGraphqlRootQuery(table, database) {\n  var query = \"\";\n\n  query += createFindAllRootQuery(table, database);\n\n  if (!!table.fields[0]) {\n    query += createFindByIdQuery(table, database);\n  }\n\n  return query;\n}\n\nfunction createFindAllRootQuery(table, database) {\n  var query = \"\" + tab + tab + \"every\" + toTitleCase(table.type) + \": {\\n\";\n  query += \"\" + tab + tab + tab + \"type: new GraphQLList(\" + table.type + \"Type),\\n\";\n  query += \"\" + tab + tab + tab + \"resolve() {\\n\";\n\n  if (database === \"MongoDB\") {\n    query += \"\" + tab + tab + tab + tab + \"return \" + table.type + \".find({});\\n\";\n  }\n\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"const sql = `SELECT * FROM \\\"\" + table.type + \"\\\";`\\n\";\n    query += buildSQLPoolQuery(\"many\");\n  }\n\n  return query += \"\" + tab + tab + tab + \"}\\n\" + tab + tab + \"}\";\n}\n\n/**\n * @param {Object} table - table being iterated on\n * @param {String} database - database selected\n * @returns {String} - root query code to find an individual type\n */\nfunction createFindByIdQuery(table, database) {\n  var idFieldName = table.fields[0].name;\n  var query = \",\\n\" + tab + tab + table.type.toLowerCase() + \": {\\n\";\n  query += \"\" + tab + tab + tab + \"type: \" + table.type + \"Type,\\n\";\n  query += \"\" + tab + tab + tab + \"args: { \" + idFieldName + \": { type: \" + tableTypeToGraphqlType(table.fields[0].type) + \"}},\\n\";\n  query += \"\" + tab + tab + tab + \"resolve(parent, args) {\\n\";\n\n  if (database === \"MongoDB\") {\n    query += \"\" + tab + tab + tab + tab + \"return \" + table.type + \".findById(args.id);\\n\";\n  }\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"const sql = `SELECT * FROM \\\"\" + table.type + \"\\\" WHERE \" + idFieldName + \" = '${args.id}';`;\\n\";\n    query += buildSQLPoolQuery(\"one to one\");\n  }\n\n  return query += \"\" + tab + tab + tab + \"}\\n\" + tab + tab + \"}\";\n}\n\nfunction buildGraphqlMutationQuery(table, database) {\n  var string = \"\";\n  string += \"\" + addMutation(table, database);\n  if (table.fields[0]) {\n    string += \",\\n\" + updateMutation(table, database) + \",\\n\";\n    string += \"\" + deleteMutation(table, database);\n  }\n  return string;\n}\n\nfunction buildSQLPoolMutation() {\n  var string = \"\";\n  string += \"\" + tab + tab + tab + tab + \"return pool.connect()\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + \".then(client => {\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + \"return client.query(sql)\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + \".then(res => {\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + tab + \"client.release();\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + tab + \"return res.rows[0];\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + \"})\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + \".catch(err => {\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + tab + \"client.release();\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + tab + \"console.log('Error: ', err);\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + tab + tab + \"})\\n\";\n  string += \"\" + tab + tab + tab + tab + tab + \"})\\n\";\n  return string;\n}\n\nfunction addMutation(table, database) {\n  var query = \"\" + tab + tab + \"add\" + table.type + \": {\\n\";\n  query += \"\" + tab + tab + tab + \"type: \" + table.type + \"Type,\\n\";\n  query += \"\" + tab + tab + tab + \"args: {\\n\";\n\n  var firstLoop = true;\n  for (var fieldIndex in table.fields) {\n    if (!firstLoop) query += \",\\n\";\n    firstLoop = false;\n\n    query += \"\" + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);\n  }\n  query += \"\\n\" + tab + tab + tab + \"},\\n\";\n  query += \"\" + tab + tab + tab + \"resolve(parent, args) {\\n\";\n\n  if (database === \"MongoDB\") {\n    query += \"\" + tab + tab + tab + tab + \"const \" + table.type.toLowerCase() + \" = new \" + table.type + \"(args);\\n\";\n    query += \"\" + tab + tab + tab + tab + \"return \" + table.type.toLowerCase() + \".save();\\n\";\n  }\n\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"const columns = Object.keys(args).map(el => `\\\"${el}\\\"`);\\n\";\n    query += \"\" + tab + tab + tab + tab + \"const values = Object.values(args).map(el => `'${el}'`);\\n\";\n    query += \"\" + tab + tab + tab + tab + \"const sql = `INSERT INTO \\\"\" + table.type + \"\\\" (${columns}) VALUES (${values}) RETURNING *`;\\n\";\n    query += buildSQLPoolMutation();\n  }\n\n  return query += \"\" + tab + tab + tab + \"}\\n\" + tab + tab + \"}\";\n}\n\nfunction updateMutation(table, database) {\n  var query = \"\" + tab + tab + \"update\" + table.type + \": {\\n\" + tab + tab + tab + \"type: \" + table.type + \"Type,\\n\" + tab + tab + tab + \"args: {\\n\";\n\n  var firstLoop = true;\n  for (var fieldIndex in table.fields) {\n    if (!firstLoop) query += \",\\n\";\n    firstLoop = false;\n\n    query += \"\" + tab + tab + tab + tab + buildFieldItem(table.fields[fieldIndex]);\n  }\n\n  query += \"\\n\" + tab + tab + tab + \"},\\n\" + tab + tab + tab + \"resolve(parent, args) {\\n\";\n\n  if (database === \"MongoDB\") query += \"\" + tab + tab + tab + tab + \"return \" + table.type + \".findByIdAndUpdate(args.id, args);\\n\";\n\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"let updateValues = '';\\n\";\n    query += \"\" + tab + tab + tab + tab + \"for (const prop in args) {\\n\";\n    query += \"\" + tab + tab + tab + tab + tab + \"if (updateValues.length > 0) updateValues += `, `;\\n\";\n    query += \"\" + tab + tab + tab + tab + tab + \"updateValues += `\\\"${prop}\\\" = '${args[prop]}' `;\\n\";\n    query += \"\" + tab + tab + tab + tab + \"}\\n\";\n    query += \"\" + tab + tab + tab + tab + \"const sql = `UPDATE \\\"\" + table.type + \"\\\" SET ${updateValues} WHERE id = '${args.id}' RETURNING *;`\\n\";\n    query += buildSQLPoolMutation();\n  }\n  return query += \"\" + tab + tab + tab + \"}\\n\" + tab + tab + \"}\";\n}\n\nfunction deleteMutation(table, database) {\n  var idFieldName = table.fields[0].name;\n  var query = \"\" + tab + tab + \"delete\" + table.type + \": {\\n\";\n  query += \"\" + tab + tab + tab + \"type: \" + table.type + \"Type,\\n\";\n  query += \"\" + tab + tab + tab + \"args: { \" + idFieldName + \": { type: \" + tableTypeToGraphqlType(table.fields[0].type) + \"}},\\n\";\n  query += \"\" + tab + tab + tab + \"resolve(parent, args) {\\n\";\n\n  if (database === \"MongoDB\") {\n    query += \"\" + tab + tab + tab + tab + \"return \" + table.type + \".findByIdAndRemove(args.id);\\n\";\n  }\n\n  if (database === \"MySQL\" || database === \"PostgreSQL\") {\n    query += \"\" + tab + tab + tab + tab + \"const sql = `DELETE FROM \\\"\" + table.type + \"\\\" WHERE id = '${args.id}' RETURNING *;`\\n\";\n    query += buildSQLPoolMutation();\n  }\n\n  return query += \"\" + tab + tab + tab + \"}\\n\" + tab + tab + \"}\";\n}\n\nfunction checkForRequired(required, position) {\n  if (required) {\n    if (position === \"front\") {\n      return \"new GraphQLNonNull(\";\n    }\n    return \")\";\n  }\n  return \"\";\n}\n\nfunction checkForMultipleValues(multipleValues, position) {\n  if (multipleValues) {\n    if (position === \"front\") {\n      return \"new GraphQLList(\";\n    }\n    return \")\";\n  }\n  return \"\";\n}\n\nmodule.exports = parseGraphqlServer;\n\n//# sourceURL=webpack:///../utl/create_file_func/graphql_server.js?");

/***/ }),

/***/ "../utl/create_file_func/mongo_schema.js":
/*!***********************************************!*\
  !*** ../utl/create_file_func/mongo_schema.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction parseMongoSchema(data) {\n  var tab = '  ';\n  var query = 'const mongoose = require(\\'mongoose\\');\\nconst Schema = mongoose.Schema;\\n\\nconst ' + data.type.toLowerCase() + 'Schema = new Schema({\\n' + tab;\n\n  var firstLoop = true;\n  for (var prop in data.fields) {\n    if (prop !== '0') {\n      if (!firstLoop) query += ',\\n' + tab;\n      firstLoop = false;\n      query += createSchemaField(data.fields[prop]);\n    }\n  }\n  query += '\\n});\\n\\nmodule.exports = mongoose.model(\"' + data.type + '\", ' + data.type.toLowerCase() + 'Schema);';\n  return query;\n}\n\nfunction createSchemaField(data) {\n  var tab = '  ';\n  var query = data.name + ': ' + checkForArray('start') + '{\\n' + tab + tab + 'type: ' + checkDataType(data.type) + ',\\n' + tab + tab + 'unique: ' + data.unique + ',\\n' + tab + tab + 'required: ' + data.required;\n\n  if (data.defaultValue) {\n    query += ',\\n' + tab + tab + 'default: \"' + data.defaultValue + '\"';\n  }\n\n  return query += '\\n' + tab + '}' + checkForArray('end');\n\n  function checkForArray(position) {\n    if (data.multipleValues) {\n      if (position === 'start') return '[';\n      if (position === 'end') return ']';\n    }\n    return '';\n  }\n\n  function checkDataType(type) {\n    if (type === 'ID') {\n      return 'String';\n    }\n    return type;\n  }\n}\n\nmodule.exports = parseMongoSchema;\n\n//# sourceURL=webpack:///../utl/create_file_func/mongo_schema.js?");

/***/ }),

/***/ "../utl/create_file_func/mysql_scripts.js":
/*!************************************************!*\
  !*** ../utl/create_file_func/mysql_scripts.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction parseSQLTables(tables) {\n  var foreignKeys = {};\n  var primaryKey = [];\n  var createTablesCode = '';\n  var tab = '  ';\n\n  for (var tableId in tables) {\n    parseSQLTable(tables[tableId]);\n  }\n\n  function parseSQLTable(table) {\n    if (!table) return '';\n\n    createTablesCode += 'CREATE TABLE `' + table.type + '` (';\n    // create code for each field\n    for (var fieldId in table.fields) {\n      createTablesCode += '\\n';\n      createTablesCode += createTableField(table.fields[fieldId]);\n      // so long as it's not the last field, add a comma\n      var fieldIds = Object.keys(table.fields);\n\n      if (fieldId !== fieldIds[fieldIds.length - 1]) {\n        createTablesCode += ',';\n      }\n    }\n\n    // if table has a primary key\n    if (primaryKey.length > 0) {\n      createTablesCode += ',' + tab + 'PRIMARY KEY (';\n      primaryKey.forEach(function (key, i) {\n        if (i === primaryKey.length - 1) {\n          createTablesCode += '`' + key + '`)';\n        } else {\n          createTablesCode += '`' + key + '`, ';\n        }\n      });\n    }\n    // reset primaryKey to empty so primary keys don't slip into the next table\n    primaryKey = [];\n    createTablesCode += '\\n);\\n\\n';\n  }\n\n  // if any tables have relations, aka foreign keys\n\n  var _loop = function _loop(_tableId) {\n    // loop through the table's fields to find the particular relation\n    foreignKeys[_tableId].forEach(function (relationInfo, relationCount) {\n      // name of table making relation\n      var tableMakingRelation = tables[_tableId].type;\n      // get name of field making relation\n      var fieldId = relationInfo.fieldMakingRelation;\n      var fieldMakingRelation = tables[_tableId].fields[fieldId].name;\n      // get name of table being referenced\n      var relatedTableId = relationInfo.relatedTable;\n      var relatedTable = tables[relatedTableId].type;\n      // get name of field being referenced\n      var relatedFieldId = relationInfo.relatedField;\n      var relatedField = tables[relatedTableId].fields[relatedFieldId].name;\n\n      createTablesCode += '\\nALTER TABLE `' + tableMakingRelation + '` ADD CONSTRAINT `' + tableMakingRelation + '_fk' + relationCount + '` FOREIGN KEY (`' + fieldMakingRelation + '`) REFERENCES `' + relatedTable + '`(`' + relatedField + '`);\\n';\n    });\n  };\n\n  for (var _tableId in foreignKeys) {\n    _loop(_tableId);\n  }\n  return createTablesCode;\n\n  function createTableField(field) {\n    var fieldCode = '';\n    fieldCode += tab + '`' + field.name + '`' + tab + checkDataType(field.type);\n    fieldCode += checkAutoIncrement(field.autoIncrement);\n    fieldCode += checkRequired(field.required);\n    fieldCode += checkUnique(field.unique);\n    fieldCode += checkDefault(field.defaultValue, field.type);\n    if (field.primaryKey) {\n      primaryKey.push(field.name);\n    }\n\n    if (field.relationSelected) {\n      var relationData = {\n        'relatedTable': field.relation.tableIndex,\n        'relatedField': field.relation.fieldIndex,\n        'fieldMakingRelation': field.fieldNum\n      };\n      if (foreignKeys[field.tableNum]) {\n        foreignKeys[field.tableNum].push(relationData);\n      } else {\n        foreignKeys[field.tableNum] = [relationData];\n      }\n    }\n\n    return fieldCode;\n  }\n\n  function checkDataType(dataType) {\n    switch (dataType) {\n      case 'String':\n        return 'VARCHAR(255)';\n      case 'Number':\n        return 'INT';\n      case 'Boolean':\n        return 'BOOLEAN';\n      case 'ID':\n        return 'INT';\n    }\n  }\n\n  function checkAutoIncrement(fieldAutoIncrement) {\n    if (fieldAutoIncrement) return tab + 'AUTO_INCREMENT';else return '';\n  }\n\n  function checkUnique(fieldUnique) {\n    if (fieldUnique) return tab + 'UNIQUE';\n    return '';\n  }\n\n  function checkRequired(fieldRequired) {\n    if (fieldRequired) return tab + 'NOT NULL';\n    return '';\n  }\n\n  function checkDefault(fieldDefault, dataType) {\n    if (fieldDefault.length > 0) {\n      var defaultString = tab + 'DEFAULT ';\n      if (dataType === 'String') defaultString += '\\'' + fieldDefault + '\\'';else defaultString += fieldDefault;\n      return defaultString;\n    }\n    return '';\n  }\n}\n\nmodule.exports = parseSQLTables;\n\n//# sourceURL=webpack:///../utl/create_file_func/mysql_scripts.js?");

/***/ }),

/***/ "../utl/create_file_func/postgresql_scripts.js":
/*!*****************************************************!*\
  !*** ../utl/create_file_func/postgresql_scripts.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction parsePostgresTables(tables) {\n  var foreignKeys = {};\n  var primaryKey = [];\n  var createTablesCode = \"\";\n  var tab = \"  \";\n\n  for (var tableId in tables) {\n    parsePostgresTable(tables[tableId]);\n  }\n\n  function parsePostgresTable(table) {\n    if (!table) return \"\";\n\n    createTablesCode += \"CREATE TABLE \\\"\" + table.type + \"\\\" (\";\n\n    // create code for each field\n    for (var fieldId in table.fields) {\n      createTablesCode += \"\\n\";\n      createTablesCode += createSchemaField(table.fields[fieldId]);\n      // so long as it's not the last field, add a comma\n      var fieldIds = Object.keys(table.fields);\n      if (fieldId !== fieldIds[fieldIds.length - 1]) {\n        createTablesCode += \",\";\n      }\n    }\n\n    // if table has a primary key\n    if (primaryKey.length > 0) {\n      createTablesCode += \",\\n\" + tab + \"CONSTRAINT \" + table.type + \"_pk PRIMARY KEY (\";\n      primaryKey.forEach(function (key, i) {\n        if (i === primaryKey.length - 1) {\n          createTablesCode += \"\\\"\" + key + \"\\\")\";\n        } else {\n          createTablesCode += \"\\\"\" + key + \"\\\", \";\n        }\n      });\n    }\n    createTablesCode += \"\\n) WITH (\\n  OIDS=FALSE\\n);\\n\\n\";\n\n    // reset primaryKey to empty so primary keys don't slip into the next table\n    primaryKey = [];\n  }\n\n  function createSchemaField(field) {\n    var fieldCode = \"\";\n    fieldCode += tab + \"\\\"\" + field.name + \"\\\"\" + tab + checkDataType(field.type, field.autoIncrement);\n    fieldCode += checkRequired(field.required);\n    fieldCode += checkUnique(field.unique);\n    fieldCode += checkDefault(field.defaultValue, field.type);\n\n    if (field.primaryKey) {\n      primaryKey.push(field.name);\n    }\n\n    if (field.relationSelected) {\n      var relationData = {\n        \"relatedTable\": field.relation.tableIndex,\n        \"relatedField\": field.relation.fieldIndex,\n        \"fieldMakingRelation\": field.fieldNum\n      };\n      if (foreignKeys[field.tableNum]) {\n        foreignKeys[field.tableNum].push(relationData);\n      } else {\n        foreignKeys[field.tableNum] = [relationData];\n      }\n    }\n    return fieldCode;\n  }\n\n  function checkDataType(dataType, autoIncrement) {\n    if (autoIncrement) return \"serial\";\n    switch (dataType) {\n      case \"String\":\n        return \"varchar\";\n      case \"Number\":\n        return \"integer\";\n      case \"Boolean\":\n        return \"boolean\";\n      case \"ID\":\n        return \"serial\";\n    }\n  }\n\n  function checkUnique(fieldUnique) {\n    if (fieldUnique) return tab + \"UNIQUE\";else return '';\n  }\n\n  function checkRequired(fieldRequired) {\n    if (fieldRequired) return tab + \"NOT NULL\";else return '';\n  }\n\n  function checkDefault(fieldDefault, dataType) {\n    if (fieldDefault.length > 0) {\n      var defaultString = tab + \"DEFAULT \";\n      if (dataType === 'String') defaultString += \"'\" + fieldDefault + \"'\";else defaultString += fieldDefault;\n      return defaultString;\n    }\n    return '';\n  }\n\n  // if any tables have relations, aka foreign keys\n\n  var _loop = function _loop(_tableId) {\n    // loop through the table's fields to find the particular relation\n    foreignKeys[_tableId].forEach(function (relationInfo, relationCount) {\n      // name of table making relation\n      var tableMakingRelation = tables[_tableId].type;\n      // get name of field making relation\n      var fieldId = relationInfo.fieldMakingRelation;\n      var fieldMakingRelation = tables[_tableId].fields[fieldId].name;\n      // get name of table being referenced\n      var relatedTableId = relationInfo.relatedTable;\n      var relatedTable = tables[relatedTableId].type;\n      // get name of field being referenced\n      var relatedFieldId = relationInfo.relatedField;\n      var relatedField = tables[relatedTableId].fields[relatedFieldId].name;\n      createTablesCode += \"\\nALTER TABLE \\\"\" + tableMakingRelation + \"\\\" ADD CONSTRAINT \\\"\" + tableMakingRelation + \"_fk\" + relationCount + \"\\\" FOREIGN KEY (\\\"\" + fieldMakingRelation + \"\\\") REFERENCES \\\"\" + relatedTable + \"\\\"(\\\"\" + relatedField + \"\\\");\\n\";\n    });\n  };\n\n  for (var _tableId in foreignKeys) {\n    _loop(_tableId);\n  }\n  return createTablesCode;\n}\n\nmodule.exports = parsePostgresTables;\n\n//# sourceURL=webpack:///../utl/create_file_func/postgresql_scripts.js?");

/***/ }),

/***/ "./actions/action-types.js":
/*!*********************************!*\
  !*** ./actions/action-types.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n// Welcome and Intro\nvar HANDLE_SNACKBAR_UPDATE = exports.HANDLE_SNACKBAR_UPDATE = 'HANDLE_SNACKBAR_UPDATE';\nvar CHOOSE_DATABASE = exports.CHOOSE_DATABASE = 'CHOOSE_DATABASE';\nvar SHOW_MODAL = exports.SHOW_MODAL = 'SHOW_MODAL';\nvar HIDE_MODAL = exports.HIDE_MODAL = 'HIDE_MODAL';\n\n// Schema App\nvar OPEN_TABLE_CREATOR = exports.OPEN_TABLE_CREATOR = 'OPEN_TABLE_CREATOR';\nvar SAVE_TABLE_DATA_INPUT = exports.SAVE_TABLE_DATA_INPUT = 'SAVE_TABLE_DATA_INPUT';\nvar DELETE_TABLE = exports.DELETE_TABLE = 'DELETE_TABLE';\nvar DELETE_FIELD = exports.DELETE_FIELD = 'DELETE_FIELD';\nvar ADD_FIELD_CLICKED = exports.ADD_FIELD_CLICKED = 'ADD_FIELD_CLICKED';\nvar SAVE_FIELD_INPUT = exports.SAVE_FIELD_INPUT = 'SAVE_FIELD_INPUT';\nvar HANDLE_FIELDS_UPDATE = exports.HANDLE_FIELDS_UPDATE = 'HANDLE_FIELDS_UPDATE';\nvar HANDLE_FIELDS_SELECT = exports.HANDLE_FIELDS_SELECT = 'HANDLE_FIELDS_SELECT';\nvar HANDLE_TABLE_NAME_CHANGE = exports.HANDLE_TABLE_NAME_CHANGE = 'HANDLE_TABLE_NAME_CHANGE';\nvar HANDLE_TABLE_ID = exports.HANDLE_TABLE_ID = 'HANDLE_TABLE_ID';\nvar HANDLE_SELECTED_TABLE = exports.HANDLE_SELECTED_TABLE = 'HANDLE_SELECTED_TABLE';\nvar HANDLE_NEW_PROJECT = exports.HANDLE_NEW_PROJECT = 'HANDLE_NEW_PROJECT';\nvar HANDLE_INJECT_DATABASE = exports.HANDLE_INJECT_DATABASE = 'HANDLE_INJECT_DATABASE';\n\n// Database App\nvar SAVE_DATABASE_DATA_INPUT = exports.SAVE_DATABASE_DATA_INPUT = 'SAVE_DATABASE_DATA_INPUT';\nvar DELETE_DATABASE = exports.DELETE_DATABASE = 'DELETE_DATABASE';\nvar HANDLE_SELECTED_DATABASE = exports.HANDLE_SELECTED_DATABASE = 'HANDLE_SELECTED_DATABASE';\nvar HANDLE_DATABASE_NAME_CHANGE = exports.HANDLE_DATABASE_NAME_CHANGE = 'HANDLE_DATABASE_NAME_CHANGE';\nvar HANDLE_DATABASE_TYPE_CHANGE = exports.HANDLE_DATABASE_TYPE_CHANGE = 'HANDLE_DATABASE_TYPE_CHANGE';\nvar OPEN_DATABASE_CREATOR = exports.OPEN_DATABASE_CREATOR = 'OPEN_DATABASE_CREATOR';\nvar SAVE_SCHEMA_TO_DATABASES = exports.SAVE_SCHEMA_TO_DATABASES = 'SAVE_SCHEMA_TO_DATABASES';\nvar HANDLE_NEW_MULTI_PROJECT = exports.HANDLE_NEW_MULTI_PROJECT = 'HANDLE_NEW_MULTI_PROJECT';\n\n// Query App\nvar CREATE_QUERY = exports.CREATE_QUERY = 'CREATE_QUERY';\nvar OPEN_CREATE_QUERY = exports.OPEN_CREATE_QUERY = 'OPEN_CREATE_QUERY';\nvar HANDLE_NEW_QUERY_CHANGE = exports.HANDLE_NEW_QUERY_CHANGE = 'HANDLE_NEW_QUERY_CHANGE';\nvar CREATE_RETURN_VALUES = exports.CREATE_RETURN_VALUES = 'CREATE_RETURN_VALUES';\nvar HANDLE_RETURN_VALUES = exports.HANDLE_RETURN_VALUES = 'HANDLE_RETURN_VALUES';\nvar HANDLE_SUBQUERY_SELECTOR = exports.HANDLE_SUBQUERY_SELECTOR = 'HANDLE_SUBQUERY_SELECTOR';\nvar HANDLE_NEW_QUERY_NAME = exports.HANDLE_NEW_QUERY_NAME = 'HANDLE_NEW_QUERY_NAME';\nvar HANDLE_NEW_SUBQUERY_TOGGLE = exports.HANDLE_NEW_SUBQUERY_TOGGLE = 'HANDLE_NEW_SUBQUERY_TOGGLE';\nvar SUBMIT_SUBQUERY_HANDLER = exports.SUBMIT_SUBQUERY_HANDLER = 'SUBMIT_SUBQUERY_HANDLER';\nvar DELETED_FIELD_RELATION_UPDATE = exports.DELETED_FIELD_RELATION_UPDATE = 'DELETED_FIELD_RELATION_UPDATE';\n\n//# sourceURL=webpack:///./actions/action-types.js?");

/***/ }),

/***/ "./actions/actions.js":
/*!****************************!*\
  !*** ./actions/actions.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.saveSchemasToDatabases = exports.deletedFieldRelationUpdate = exports.submitSubQueryHandler = exports.handleNewSubQueryToggle = exports.handleNewQueryName = exports.handleSubQuerySelector = exports.handleReturnValues = exports.handleNewQueryChange = exports.openCreateQuery = exports.createQuery = exports.openDatabaseCreator = exports.handleNewMultiProject = exports.handleDatabaseTypeChange = exports.handleDatabaseNameChange = exports.handleSelectedDatabase = exports.deleteDatabase = exports.saveDatabaseDataInput = exports.handleInjectDatabase = exports.handleNewProject = exports.handleSelectedTable = exports.handleTableID = exports.handleTableNameChange = exports.handleFieldsSelect = exports.handleFieldsUpdate = exports.saveFieldInput = exports.addFieldClicked = exports.deleteField = exports.deleteTable = exports.saveTableDataInput = exports.openTableCreator = exports.showModal = exports.hideModal = exports.handleSnackbarUpdate = exports.chooseDatabase = undefined;\n\nvar _actionTypes = __webpack_require__(/*! ./action-types.js */ \"./actions/action-types.js\");\n\nvar types = _interopRequireWildcard(_actionTypes);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n// -------------------------- Welcome and Intro ----------------------------//\n\nvar chooseDatabase = exports.chooseDatabase = function chooseDatabase(dbName) {\n  return {\n    type: types.CHOOSE_DATABASE,\n    payload: dbName\n  };\n};\n\nvar handleSnackbarUpdate = exports.handleSnackbarUpdate = function handleSnackbarUpdate(status) {\n  return {\n    type: types.HANDLE_SNACKBAR_UPDATE,\n    payload: status\n  };\n};\n\nvar hideModal = exports.hideModal = function hideModal() {\n  return {\n    type: types.HIDE_MODAL\n  };\n};\n\nvar showModal = exports.showModal = function showModal() {\n  return {\n    type: types.SHOW_MODAL\n  };\n};\n\n// ----------------------------- Schema App --------------------------------//\nvar openTableCreator = exports.openTableCreator = function openTableCreator() {\n  return {\n    type: types.OPEN_TABLE_CREATOR\n  };\n};\n\nvar saveTableDataInput = exports.saveTableDataInput = function saveTableDataInput() {\n  return {\n    type: types.SAVE_TABLE_DATA_INPUT\n  };\n};\n\nvar deleteTable = exports.deleteTable = function deleteTable(tableIndex) {\n  return {\n    type: types.DELETE_TABLE,\n    payload: tableIndex\n  };\n};\n\nvar deleteField = exports.deleteField = function deleteField(tableIndex) {\n  return {\n    type: types.DELETE_FIELD,\n    payload: tableIndex\n  };\n};\n\nvar addFieldClicked = exports.addFieldClicked = function addFieldClicked(tableIndex) {\n  return {\n    type: types.ADD_FIELD_CLICKED,\n    payload: tableIndex\n  };\n};\n\nvar saveFieldInput = exports.saveFieldInput = function saveFieldInput(database) {\n  return {\n    type: types.SAVE_FIELD_INPUT,\n    payload: database\n  };\n};\n\nvar handleFieldsUpdate = exports.handleFieldsUpdate = function handleFieldsUpdate(field) {\n  return {\n    type: types.HANDLE_FIELDS_UPDATE,\n    payload: field\n  };\n};\n\nvar handleFieldsSelect = exports.handleFieldsSelect = function handleFieldsSelect(field) {\n  return {\n    type: types.HANDLE_FIELDS_SELECT,\n    payload: field\n  };\n};\n\nvar handleTableNameChange = exports.handleTableNameChange = function handleTableNameChange(tableName) {\n  return {\n    type: types.HANDLE_TABLE_NAME_CHANGE,\n    payload: tableName\n  };\n};\n\nvar handleTableID = exports.handleTableID = function handleTableID() {\n  return {\n    type: types.HANDLE_TABLE_ID\n  };\n};\n\nvar handleSelectedTable = exports.handleSelectedTable = function handleSelectedTable(tableIndex) {\n  return {\n    type: types.HANDLE_SELECTED_TABLE,\n    payload: tableIndex\n  };\n};\n\nvar handleNewProject = exports.handleNewProject = function handleNewProject(reset) {\n  return {\n    type: types.HANDLE_NEW_PROJECT,\n    payload: reset\n  };\n};\n\nvar handleInjectDatabase = exports.handleInjectDatabase = function handleInjectDatabase(database) {\n  return {\n    type: types.HANDLE_INJECT_DATABASE,\n    payload: database\n  };\n};\n\n// ----------------------------- Database App -------------------------------//\n\nvar saveDatabaseDataInput = exports.saveDatabaseDataInput = function saveDatabaseDataInput(state) {\n  return {\n    type: types.SAVE_DATABASE_DATA_INPUT,\n    payload: state\n  };\n};\n\nvar deleteDatabase = exports.deleteDatabase = function deleteDatabase(databaseIndex) {\n  return {\n    type: types.DELETE_DATABASE,\n    payload: databaseIndex\n  };\n};\n\nvar handleSelectedDatabase = exports.handleSelectedDatabase = function handleSelectedDatabase(databaseIndex) {\n  return {\n    type: types.HANDLE_SELECTED_DATABASE,\n    payload: databaseIndex\n  };\n};\n\nvar handleDatabaseNameChange = exports.handleDatabaseNameChange = function handleDatabaseNameChange(databaseName) {\n  return {\n    type: types.HANDLE_DATABASE_NAME_CHANGE,\n    payload: databaseName\n  };\n};\n\nvar handleDatabaseTypeChange = exports.handleDatabaseTypeChange = function handleDatabaseTypeChange(databaseType) {\n  return {\n    type: types.HANDLE_DATABASE_TYPE_CHANGE,\n    payload: databaseType\n  };\n};\n\nvar handleNewMultiProject = exports.handleNewMultiProject = function handleNewMultiProject(reset) {\n  return {\n    type: types.HANDLE_NEW_MULTI_PROJECT,\n    payload: reset\n  };\n};\n\nvar openDatabaseCreator = exports.openDatabaseCreator = function openDatabaseCreator() {\n  return {\n    type: types.OPEN_DATABASE_CREATOR\n  };\n};\n\n// ----------------------------- Query App -------------------------------//\n\nvar createQuery = exports.createQuery = function createQuery(query) {\n  return {\n    type: types.CREATE_QUERY,\n    payload: query\n  };\n};\n\nvar openCreateQuery = exports.openCreateQuery = function openCreateQuery() {\n  return {\n    type: types.OPEN_CREATE_QUERY\n  };\n};\n\nvar handleNewQueryChange = exports.handleNewQueryChange = function handleNewQueryChange(field) {\n  return {\n    type: types.HANDLE_NEW_QUERY_CHANGE,\n    payload: field\n  };\n};\n\n// export const createReturnFields = returnFields => ({\n//   type: types.CREATE_RETURN_FIELDS,\n//   payload: returnFields,\n// });\n\nvar handleReturnValues = exports.handleReturnValues = function handleReturnValues(returnValues) {\n  return {\n    type: types.HANDLE_RETURN_VALUES,\n    payload: returnValues\n  };\n};\n\nvar handleSubQuerySelector = exports.handleSubQuerySelector = function handleSubQuerySelector(tableFieldIndexes) {\n  return {\n    type: types.HANDLE_SUBQUERY_SELECTOR,\n    payload: tableFieldIndexes\n  };\n};\n\nvar handleNewQueryName = exports.handleNewQueryName = function handleNewQueryName(name) {\n  return {\n    type: types.HANDLE_NEW_QUERY_NAME,\n    payload: name\n  };\n};\n\nvar handleNewSubQueryToggle = exports.handleNewSubQueryToggle = function handleNewSubQueryToggle(field) {\n  return {\n    type: types.HANDLE_NEW_SUBQUERY_TOGGLE,\n    payload: field\n  };\n};\n\nvar submitSubQueryHandler = exports.submitSubQueryHandler = function submitSubQueryHandler(subQuery) {\n  return {\n    type: types.SUBMIT_SUBQUERY_HANDLER,\n    payload: subQuery\n  };\n};\n\nvar deletedFieldRelationUpdate = exports.deletedFieldRelationUpdate = function deletedFieldRelationUpdate(indexes) {\n  return {\n    type: types.DELETED_FIELD_RELATION_UPDATE,\n    payload: indexes\n  };\n};\n\nvar saveSchemasToDatabases = exports.saveSchemasToDatabases = function saveSchemasToDatabases() {\n  return function (dispatch, getState) {\n    var _getState = getState(),\n        schema = _getState.schema;\n  };\n};\n\n//# sourceURL=webpack:///./actions/actions.js?");

/***/ }),

/***/ "./actions/localStorage.js":
/*!*********************************!*\
  !*** ./actions/localStorage.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n// LOADING STATE TO APP\nvar loadState = exports.loadState = function loadState() {\n  // We put this in try catch because calls to local storage can fail\n  try {\n    var serializedState = localStorage.getItem('state');\n    // State doesn't exist\n    if (serializedState === null) {\n      return undefined;\n    }\n    // State exists\n    return JSON.parse(serializedState);\n  } catch (err) {\n    return undefined;\n  }\n};\n\n// SAVE STATE TO APP\nvar saveState = exports.saveState = function saveState(state) {\n  try {\n    var serializedState = JSON.stringify(state);\n    localStorage.setItem('state', serializedState);\n  } catch (err) {\n    // ignore write errors\n  }\n};\n\n//# sourceURL=webpack:///./actions/localStorage.js?");

/***/ }),

/***/ "./components/app.css":
/*!****************************!*\
  !*** ./components/app.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../node_modules/css-loader!./app.css */ \"../node_modules/css-loader/index.js!./components/app.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../node_modules/css-loader!./app.css */ \"../node_modules/css-loader/index.js!./components/app.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../node_modules/css-loader!./app.css */ \"../node_modules/css-loader/index.js!./components/app.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/app.css?");

/***/ }),

/***/ "./components/app.jsx":
/*!****************************!*\
  !*** ./components/app.jsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _actions = __webpack_require__(/*! ../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\nvar _navbar = __webpack_require__(/*! ./navbar/navbar.jsx */ \"./components/navbar/navbar.jsx\");\n\nvar _navbar2 = _interopRequireDefault(_navbar);\n\nvar _welcome = __webpack_require__(/*! ./welcome/welcome.jsx */ \"./components/welcome/welcome.jsx\");\n\nvar _welcome2 = _interopRequireDefault(_welcome);\n\nvar _schemaApp = __webpack_require__(/*! ./schema/schema-app.jsx */ \"./components/schema/schema-app.jsx\");\n\nvar _schemaApp2 = _interopRequireDefault(_schemaApp);\n\nvar _dbApp = __webpack_require__(/*! ./databases/db-app.jsx */ \"./components/databases/db-app.jsx\");\n\nvar _dbApp2 = _interopRequireDefault(_dbApp);\n\nvar _codeApp = __webpack_require__(/*! ./code/code-app.jsx */ \"./components/code/code-app.jsx\");\n\nvar _codeApp2 = _interopRequireDefault(_codeApp);\n\nvar _reactGithubBtn = __webpack_require__(/*! react-github-btn */ \"../node_modules/react-github-btn/index.js\");\n\nvar _reactGithubBtn2 = _interopRequireDefault(_reactGithubBtn);\n\nvar _info = __webpack_require__(/*! ./navbar/info/info.jsx */ \"./components/navbar/info/info.jsx\");\n\nvar _info2 = _interopRequireDefault(_info);\n\nvar _Tabs = __webpack_require__(/*! material-ui/Tabs */ \"../node_modules/material-ui/Tabs/index.js\");\n\nvar _Snackbar = __webpack_require__(/*! material-ui/Snackbar */ \"../node_modules/material-ui/Snackbar/index.js\");\n\nvar _Snackbar2 = _interopRequireDefault(_Snackbar);\n\n__webpack_require__(/*! ./app.css */ \"./components/app.css\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// Components\nvar style = {\n  snackBarStyle: {\n    backgroundColor: 'rgb(255,66,128)'\n  },\n  snackBarFont: {\n    color: 'white'\n  },\n  tabStyle: {\n    backgroundColor: '#FFF',\n    border: '1px solid #F1F1F1',\n    color: '#000'\n  }\n};\n\n// Styling\n\n//import QueryApp from './query/query-app.jsx';\n\n// Material UI Components\n\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    snackBar: store.general.statusMessage,\n    schemaObject: store.schema\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    handleSnackbarUpdate: function handleSnackbarUpdate(status) {\n      return dispatch(actions.handleSnackbarUpdate(status));\n    },\n    saveDatabaseDataInput: function saveDatabaseDataInput(schemaObject) {\n      return dispatch(actions.saveDatabaseDataInput(schemaObject));\n    },\n    chooseDatabase: function chooseDatabase(database) {\n      return dispatch(actions.chooseDatabase(database));\n    }\n  };\n};\n\nvar App = function App(_ref) {\n  var snackBar = _ref.snackBar,\n      handleSnackbarUpdate = _ref.handleSnackbarUpdate,\n      schemaObject = _ref.schemaObject,\n      saveDatabaseDataInput = _ref.saveDatabaseDataInput,\n      chooseDatabase = _ref.chooseDatabase;\n\n  function handleRequestClose() {\n    handleSnackbarUpdate('');\n  }\n\n  (0, _react.useEffect)(function () {\n    var loader = document.getElementById('loader');\n    setTimeout(function () {\n      return loader.classList.add('hide');\n    }, 160);\n  });\n\n  return _react2.default.createElement(\n    'div',\n    { className: 'app-container' },\n    _react2.default.createElement(_navbar2.default, null),\n    _react2.default.createElement(_welcome2.default, null),\n    _react2.default.createElement(\n      'div',\n      { className: 'app-body-container' },\n      _react2.default.createElement(\n        _Tabs.Tabs,\n        {\n          className: 'tabs',\n          onChange: function onChange() {\n            if (schemaObject.name) {\n              chooseDatabase(schemaObject.database);\n              saveDatabaseDataInput(schemaObject);\n            }\n          }\n        },\n        _react2.default.createElement(\n          _Tabs.Tab,\n          {\n            id: 'databasesTab',\n            label: 'Databases',\n            style: style.tabStyle },\n          _react2.default.createElement(_dbApp2.default, null)\n        ),\n        _react2.default.createElement(\n          _Tabs.Tab,\n          {\n            id: 'schemaTab',\n            label: 'Tables',\n            style: style.tabStyle,\n            disabled: schemaObject.name === \"\" ? true : false },\n          _react2.default.createElement(_schemaApp2.default, null)\n        ),\n        _react2.default.createElement(\n          _Tabs.Tab,\n          { label: 'Preview Code', style: style.tabStyle },\n          _react2.default.createElement(_codeApp2.default, null)\n        )\n      ),\n      _react2.default.createElement(_Snackbar2.default, {\n        open: !!snackBar,\n        message: snackBar,\n        autoHideDuration: 3000,\n        onRequestClose: handleRequestClose,\n        bodyStyle: style.snackBarStyle,\n        contentStyle: style.snackBarFont\n      })\n    ),\n    _react2.default.createElement(\n      'footer',\n      {\n        style: {\n          position: 'absolute',\n          bottom: '2rem',\n          left: '2rem'\n        }\n      },\n      _react2.default.createElement(\n        'ul',\n        null,\n        _react2.default.createElement(\n          'li',\n          null,\n          _react2.default.createElement(\n            _reactGithubBtn2.default,\n            { href: 'https://github.com/oslabs-beta/GraphQL-Blueprint', 'data-icon': 'octicon-star', 'data-size': 'large', 'data-show-count': 'true', 'aria-label': 'Star oslabs-beta/GraphQL-Blueprint on GitHub' },\n            'Star'\n          )\n        ),\n        _react2.default.createElement(\n          'li',\n          null,\n          _react2.default.createElement(_info2.default, null)\n        )\n      )\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);\n\n//# sourceURL=webpack:///./components/app.jsx?");

/***/ }),

/***/ "./components/code/code-app.jsx":
/*!**************************************!*\
  !*** ./components/code/code-app.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _clientCode = __webpack_require__(/*! ./code-containers/client-code.jsx */ \"./components/code/code-containers/client-code.jsx\");\n\nvar _clientCode2 = _interopRequireDefault(_clientCode);\n\nvar _serverCode = __webpack_require__(/*! ./code-containers/server-code.jsx */ \"./components/code/code-containers/server-code.jsx\");\n\nvar _serverCode2 = _interopRequireDefault(_serverCode);\n\nvar _dbCode = __webpack_require__(/*! ./code-containers/db-code.jsx */ \"./components/code/code-containers/db-code.jsx\");\n\nvar _dbCode2 = _interopRequireDefault(_dbCode);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar CodeApp = function CodeApp() {\n  return _react2.default.createElement(\n    'div',\n    { className: 'code-app' },\n    _react2.default.createElement('div', { className: 'wallpaper-code' }),\n    _react2.default.createElement(_dbCode2.default, null),\n    _react2.default.createElement(_serverCode2.default, null),\n    _react2.default.createElement(_clientCode2.default, null)\n  );\n};\n\n// components\nexports.default = CodeApp;\n\n//# sourceURL=webpack:///./components/code/code-app.jsx?");

/***/ }),

/***/ "./components/code/code-containers/client-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/client-code.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _client_queries = __webpack_require__(/*! ../../../../utl/create_file_func/client_queries */ \"../utl/create_file_func/client_queries.js\");\n\nvar _client_queries2 = _interopRequireDefault(_client_queries);\n\nvar _client_mutations = __webpack_require__(/*! ../../../../utl/create_file_func/client_mutations */ \"../utl/create_file_func/client_mutations.js\");\n\nvar _client_mutations2 = _interopRequireDefault(_client_mutations);\n\n__webpack_require__(/*! ../code.css */ \"./components/code/code.css\");\n\nvar _reactSyntaxHighlighter = __webpack_require__(/*! react-syntax-highlighter */ \"../node_modules/react-syntax-highlighter/dist/esm/index.js\");\n\nvar _reactSyntaxHighlighter2 = _interopRequireDefault(_reactSyntaxHighlighter);\n\nvar _hljs = __webpack_require__(/*! react-syntax-highlighter/dist/esm/styles/hljs */ \"../node_modules/react-syntax-highlighter/dist/esm/styles/hljs/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    databases: store.multiSchema.databases\n  };\n};\n\n// styling\n\n\nvar createCombinedTables = function createCombinedTables(databases) {\n  var num = 0;\n  var tablesCombined = {};\n  for (var databaseIndex in databases) {\n    var database = databases[databaseIndex];\n    for (var index in database.tables) {\n      tablesCombined[num] = database.tables[index];\n      num++;\n    }\n  }\n  return tablesCombined;\n};\n\nvar CodeClientContainer = function CodeClientContainer(_ref) {\n  var databases = _ref.databases;\n\n  var tables = createCombinedTables(databases);\n  var clientQueries = (0, _client_queries2.default)(tables);\n  var clientMutations = (0, _client_mutations2.default)(tables);\n\n  return _react2.default.createElement(\n    'div',\n    { id: 'code-container-client' },\n    _react2.default.createElement(\n      'h4',\n      { className: 'codeHeader' },\n      'Client Queries'\n    ),\n    _react2.default.createElement('hr', null),\n    _react2.default.createElement(\n      _reactSyntaxHighlighter2.default,\n      { language: 'javascript', style: _hljs.dracula },\n      clientQueries\n    ),\n    _react2.default.createElement('br', null),\n    _react2.default.createElement('br', null),\n    _react2.default.createElement(\n      'h4',\n      { className: 'codeHeader' },\n      'Client Mutations'\n    ),\n    _react2.default.createElement('hr', null),\n    _react2.default.createElement(\n      _reactSyntaxHighlighter2.default,\n      { language: 'javascript', style: _hljs.dracula },\n      clientMutations\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeClientContainer);\n\n//# sourceURL=webpack:///./components/code/code-containers/client-code.jsx?");

/***/ }),

/***/ "./components/code/code-containers/db-code.jsx":
/*!*****************************************************!*\
  !*** ./components/code/code-containers/db-code.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _mysql_scripts = __webpack_require__(/*! ../../../../utl/create_file_func/mysql_scripts */ \"../utl/create_file_func/mysql_scripts.js\");\n\nvar _mysql_scripts2 = _interopRequireDefault(_mysql_scripts);\n\nvar _mongo_schema = __webpack_require__(/*! ../../../../utl/create_file_func/mongo_schema */ \"../utl/create_file_func/mongo_schema.js\");\n\nvar _mongo_schema2 = _interopRequireDefault(_mongo_schema);\n\nvar _postgresql_scripts = __webpack_require__(/*! ../../../../utl/create_file_func/postgresql_scripts */ \"../utl/create_file_func/postgresql_scripts.js\");\n\nvar _postgresql_scripts2 = _interopRequireDefault(_postgresql_scripts);\n\n__webpack_require__(/*! ../code.css */ \"./components/code/code.css\");\n\nvar _reactSyntaxHighlighter = __webpack_require__(/*! react-syntax-highlighter */ \"../node_modules/react-syntax-highlighter/dist/esm/index.js\");\n\nvar _reactSyntaxHighlighter2 = _interopRequireDefault(_reactSyntaxHighlighter);\n\nvar _hljs = __webpack_require__(/*! react-syntax-highlighter/dist/esm/styles/hljs */ \"../node_modules/react-syntax-highlighter/dist/esm/styles/hljs/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    database: store.schema.database\n  };\n};\n\n// Styling\n\n\nvar CodeDBSQLContainer = function CodeDBSQLContainer(_ref) {\n  var database = _ref.database,\n      tables = _ref.tables;\n\n  var databaseCode = '';\n  var header = '';\n  var enter = '\\n';\n\n  switch (database) {\n    case 'MongoDB':\n      header = 'MongoDB Schemas';\n      databaseCode = Object.keys(tables).map(function (tableId) {\n        return _react2.default.createElement(\n          _reactSyntaxHighlighter2.default,\n          { key: 'mongoSchema' + tableId, language: 'javascript', style: _hljs.dracula },\n          (0, _mongo_schema2.default)(tables[tableId]),\n          enter,\n          enter,\n          _react2.default.createElement('hr', null)\n        );\n      });\n      break;\n    case 'PostgreSQL':\n      databaseCode = _react2.default.createElement(\n        _reactSyntaxHighlighter2.default,\n        { language: 'javascript', style: _hljs.dracula },\n        (0, _postgresql_scripts2.default)(tables)\n      );\n      header = 'PostgreSQL Create Scripts';\n      break;\n    case 'MySQL':\n      databaseCode = _react2.default.createElement(\n        _reactSyntaxHighlighter2.default,\n        { language: 'javascript', style: _hljs.dracula },\n        (0, _mysql_scripts2.default)(tables)\n      );\n      header = 'MySQL Create Scripts';\n      break;\n    default:\n      break;\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { id: 'code-container-database' },\n    _react2.default.createElement(\n      'h4',\n      { className: 'codeHeader' },\n      header\n    ),\n    _react2.default.createElement('hr', null),\n    _react2.default.createElement(\n      'div',\n      null,\n      databaseCode\n    ),\n    _react2.default.createElement('pre', { id: 'column-filler-for-scroll' })\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeDBSQLContainer);\n\n//# sourceURL=webpack:///./components/code/code-containers/db-code.jsx?");

/***/ }),

/***/ "./components/code/code-containers/server-code.jsx":
/*!*********************************************************!*\
  !*** ./components/code/code-containers/server-code.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _graphql_server = __webpack_require__(/*! ../../../../utl/create_file_func/graphql_server */ \"../utl/create_file_func/graphql_server.js\");\n\nvar _graphql_server2 = _interopRequireDefault(_graphql_server);\n\n__webpack_require__(/*! ../code.css */ \"./components/code/code.css\");\n\nvar _reactSyntaxHighlighter = __webpack_require__(/*! react-syntax-highlighter */ \"../node_modules/react-syntax-highlighter/dist/esm/index.js\");\n\nvar _reactSyntaxHighlighter2 = _interopRequireDefault(_reactSyntaxHighlighter);\n\nvar _hljs = __webpack_require__(/*! react-syntax-highlighter/dist/esm/styles/hljs */ \"../node_modules/react-syntax-highlighter/dist/esm/styles/hljs/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    databases: store.multiSchema.databases\n  };\n};\n\n// styling\n\n\nvar convertTablesToData = function convertTablesToData(obj) {\n  var databasesCopy = JSON.parse(JSON.stringify(obj));\n  for (var databaseIndex in databasesCopy) {\n    databasesCopy[databaseIndex].databaseName = databasesCopy[databaseIndex].database;\n  }\n  return databasesCopy;\n};\n\nvar CodeServerContainer = function CodeServerContainer(_ref) {\n  var databases = _ref.databases;\n\n  var dbCopy = convertTablesToData(databases);\n  var serverCode = (0, _graphql_server2.default)(dbCopy);\n  return _react2.default.createElement(\n    \"div\",\n    { id: \"code-container-server\" },\n    _react2.default.createElement(\n      \"h4\",\n      { className: \"codeHeader\" },\n      \"GraphQl Types, Root Queries, and Mutations\"\n    ),\n    _react2.default.createElement(\"hr\", null),\n    _react2.default.createElement(\n      _reactSyntaxHighlighter2.default,\n      { language: \"javascript\", style: _hljs.dracula },\n      serverCode\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(CodeServerContainer);\n\n//# sourceURL=webpack:///./components/code/code-containers/server-code.jsx?");

/***/ }),

/***/ "./components/code/code.css":
/*!**********************************!*\
  !*** ./components/code/code.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!./code.css */ \"../node_modules/css-loader/index.js!./components/code/code.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../node_modules/css-loader!./code.css */ \"../node_modules/css-loader/index.js!./components/code/code.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../node_modules/css-loader!./code.css */ \"../node_modules/css-loader/index.js!./components/code/code.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/code/code.css?");

/***/ }),

/***/ "./components/databases/db-app.jsx":
/*!*****************************************!*\
  !*** ./components/databases/db-app.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _reactTransitionGroup = __webpack_require__(/*! react-transition-group */ \"../node_modules/react-transition-group/index.js\");\n\nvar _db = __webpack_require__(/*! ./db.jsx */ \"./components/databases/db.jsx\");\n\nvar _db2 = _interopRequireDefault(_db);\n\nvar _createDb = __webpack_require__(/*! ./sidebar/create-db.jsx */ \"./components/databases/sidebar/create-db.jsx\");\n\nvar _createDb2 = _interopRequireDefault(_createDb);\n\n__webpack_require__(/*! ./schema.css */ \"./components/databases/schema.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// We use store.data, because of index.js reduce function\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    databases: store.multiSchema.databases,\n    selectedDatabase: store.multiSchema.selectedDatabase\n  };\n};\n\n// styles\n\n\n// components\n\n\nvar SchemaApp = function SchemaApp(_ref) {\n  var databases = _ref.databases,\n      selectedDatabase = _ref.selectedDatabase;\n\n  // Dynamically renders each table based on the number of tables.\n  function renderTables() {\n    return Object.keys(databases).map(function (databaseIndex) {\n      return _react2.default.createElement(\n        _reactTransitionGroup.CSSTransition,\n        {\n          key: databaseIndex,\n          timeout: 100,\n          classNames: 'fadeScale'\n        },\n        _react2.default.createElement(_db2.default, {\n          key: databaseIndex,\n          databaseData: databases[databaseIndex],\n          databaseIndex: databaseIndex\n        })\n      );\n    });\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { className: 'schema-app-container' },\n    _react2.default.createElement(\n      _reactTransitionGroup.CSSTransition,\n      {\n        'in': true,\n        timeout: 200,\n        classNames: 'fade'\n      },\n      _react2.default.createElement(\n        'div',\n        { id: 'sidebar-container' },\n        _react2.default.createElement(\n          _reactTransitionGroup.CSSTransition,\n          {\n            'in': selectedDatabase.databaseID >= -1,\n            key: 'table',\n            timeout: 200,\n            classNames: 'fade'\n          },\n          _react2.default.createElement(_createDb2.default, null)\n        )\n      )\n    ),\n    _react2.default.createElement(\n      _reactTransitionGroup.TransitionGroup,\n      { className: 'table-components-container', id: 'wallpaper-schema' },\n      renderTables()\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(SchemaApp);\n\n//# sourceURL=webpack:///./components/databases/db-app.jsx?");

/***/ }),

/***/ "./components/databases/db.jsx":
/*!*************************************!*\
  !*** ./components/databases/db.jsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _actions = __webpack_require__(/*! ../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar style = {\n  deleteStyle: {\n    minWidth: '25px',\n    position: 'absolute',\n    right: '0',\n    top: '0',\n    color: '#A1A1A1'\n  },\n  editStyle: {\n    border: '2px solid #000',\n    padding: '4px 16px',\n    borderRadius: '50px',\n    height: 'auto',\n    lineHeight: 'auto',\n    fontSize: '14px',\n    fontWeight: '500',\n    float: 'right',\n    marginTop: '16px',\n    boxShadow: 'none'\n  },\n  idFiled: {\n    width: '100%',\n    justifyContent: 'center',\n    color: 'white',\n    marginTop: '5px',\n    cursor: 'pointer'\n  }\n};\n// import Close from 'material-ui/svg-icons/navigation/close';\n\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    databases: store.multiSchema.databases\n\n    // database prop might not be needed, (the equivilent is databaseTypes)\n    // database: store.schema.database,\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    //  requires reducer to delete database\n    deleteDatabase: function deleteDatabase(databaseIndex) {\n      return dispatch(actions.deleteDatabase(databaseIndex));\n    },\n    //  this reducer doesnt seem necessary in our db view\n    // addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),\n\n    //  requires a reducer to handleSelectedDatabase\n    handleInjectDatabase: function handleInjectDatabase(database) {\n      return dispatch(actions.handleInjectDatabase(database));\n    },\n    handleSelectedDatabase: function handleSelectedDatabase(databaseIndex) {\n      return dispatch(actions.handleSelectedDatabase(databaseIndex));\n    },\n    openTableCreator: function openTableCreator() {\n      return dispatch(actions.openTableCreator());\n    }\n    //  fields dont exist in db view, so reducer may be unnecessary\n    // deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes)),\n  };\n};\n\nvar Table = function Table(_ref) {\n  var databaseIndex = _ref.databaseIndex,\n      databaseData = _ref.databaseData,\n      databases = _ref.databases,\n      handleInjectDatabase = _ref.handleInjectDatabase,\n      deleteDatabase = _ref.deleteDatabase,\n      handleSelectedDatabase = _ref.handleSelectedDatabase,\n      openTableCreator = _ref.openTableCreator;\n\n  var colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet', 'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen', 'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna', 'darkslategrey', 'goldenrod', 'deeppink'];\n\n  function grabSelectedDatabase(e) {\n    var selectedDatabase = databases[Number(e)];\n    openTableCreator();\n    handleInjectDatabase(selectedDatabase);\n  };\n\n  return _react2.default.createElement(\n    'div',\n    { className: 'table' },\n    _react2.default.createElement('div', {\n      style: {\n        opacity: '0.15',\n        position: 'absolute',\n        bottom: '-40px',\n        right: '-20px',\n        width: '97px',\n        height: '101px',\n        backgroundImage: 'url(\\'images/' + databaseData.database + '.png\\')',\n        backgroundSize: 'cover'\n      }\n    }),\n    _react2.default.createElement(\n      'div',\n      null,\n      _react2.default.createElement(\n        'div',\n        {\n          className: 'type'\n        },\n        _react2.default.createElement(\n          'div',\n          {\n            backgroundColor: colors[databaseData.databaseID],\n            'data-value': databaseIndex,\n            onClick: function onClick(event) {\n              return handleSelectedDatabase(event.currentTarget.getAttribute(\"data-value\"));\n            },\n            className: 'tableButton'\n          },\n          _react2.default.createElement('div', {\n            className: 'db-logo',\n            style: {\n              backgroundImage: 'url(\\'images/' + databaseData.database + '.png\\')',\n              backgroundSize: 'cover'\n            }\n          }),\n          _react2.default.createElement(\n            'h4',\n            null,\n            databaseData.name,\n            _react2.default.createElement(\n              'small',\n              null,\n              databaseData.database,\n              ' ',\n              _react2.default.createElement(\n                'span',\n                { style: { color: '#939393' } },\n                '\\u2022'\n              ),\n              ' ',\n              databaseData.tableIndex,\n              ' tables'\n            )\n          )\n        ),\n        _react2.default.createElement(_FlatButton2.default, {\n          className: 'delete-button',\n          icon: _react2.default.createElement('box-icon', { name: 'trash' }),\n          value: databaseIndex,\n          onClick: function onClick(event) {\n            return deleteDatabase(event.currentTarget.value);\n          },\n          style: style.deleteStyle\n        })\n      )\n    ),\n    _react2.default.createElement(\n      _FlatButton2.default,\n      {\n        className: 'edit-tables',\n        value: databaseData.databaseID,\n        onClick: function onClick(e) {\n          grabSelectedDatabase(e.currentTarget.value);\n          setTimeout(function () {\n            document.getElementById('schemaTab').click();\n          }, 0);\n        },\n        style: style.editStyle\n      },\n      'Edit Tables'\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Table);\n\n//# sourceURL=webpack:///./components/databases/db.jsx?");

/***/ }),

/***/ "./components/databases/schema.css":
/*!*****************************************!*\
  !*** ./components/databases/schema.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/databases/schema.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/databases/schema.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/databases/schema.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/databases/schema.css?");

/***/ }),

/***/ "./components/databases/sidebar/create-db.jsx":
/*!****************************************************!*\
  !*** ./components/databases/sidebar/create-db.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _TextField = __webpack_require__(/*! material-ui/TextField */ \"../node_modules/material-ui/TextField/index.js\");\n\nvar _TextField2 = _interopRequireDefault(_TextField);\n\nvar _SelectField = __webpack_require__(/*! material-ui/SelectField */ \"../node_modules/material-ui/SelectField/index.js\");\n\nvar _SelectField2 = _interopRequireDefault(_SelectField);\n\nvar _MenuItem = __webpack_require__(/*! material-ui/MenuItem */ \"../node_modules/material-ui/MenuItem/index.js\");\n\nvar _MenuItem2 = _interopRequireDefault(_MenuItem);\n\nvar _RaisedButton = __webpack_require__(/*! material-ui/RaisedButton */ \"../node_modules/material-ui/RaisedButton/index.js\");\n\nvar _RaisedButton2 = _interopRequireDefault(_RaisedButton);\n\nvar _keyboardArrowLeft = __webpack_require__(/*! material-ui/svg-icons/hardware/keyboard-arrow-left */ \"../node_modules/material-ui/svg-icons/hardware/keyboard-arrow-left.js\");\n\nvar _keyboardArrowLeft2 = _interopRequireDefault(_keyboardArrowLeft);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _actions = __webpack_require__(/*! ../../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\n__webpack_require__(/*! ./sidebar.css */ \"./components/databases/sidebar/sidebar.css\");\n\nvar _actionTypes = __webpack_require__(/*! ../../../actions/action-types */ \"./actions/action-types.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// styles\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    databases: store.multiSchema.databases,\n    selectedDatabase: store.multiSchema.selectedDatabase,\n    databaseName: store.multiSchema.selectedDatabase.name,\n    databaseType: store.multiSchema.selectedDatabase.database,\n    //  if ID = -1, this is a new DB, else it corresponds to db id\n    databaseID: store.multiSchema.selectedDatabase.databaseID\n\n    //  type of db (i.e. MongoDb), this prop equivilent (database) was used to check if it was MongoDb to display a different sidebar, not needed in our view\n    // databaseTypes: store.multiSchema.databaseTypes,\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    //  passes in selectedDB, and this reducer updates name changes or dbID.\n    saveDatabaseDataInput: function saveDatabaseDataInput(selectedDatabase) {\n      return dispatch(actions.saveDatabaseDataInput(selectedDatabase));\n    },\n    databaseNameChange: function databaseNameChange(databaseName) {\n      return dispatch(actions.handleDatabaseNameChange(databaseName));\n    },\n    handleDatabaseTypeChange: function handleDatabaseTypeChange(databaseType) {\n      return dispatch(actions.handleDatabaseTypeChange(databaseType));\n    },\n\n    //  this doesn't seem needed in our DB view\n    // idSelector: () => dispatch(actions.handleTableID()),\n\n    openDatabaseCreator: function openDatabaseCreator() {\n      return dispatch(actions.openDatabaseCreator());\n    },\n    // error message display\n    handleSnackbarUpdate: function handleSnackbarUpdate(status) {\n      return dispatch(actions.handleSnackbarUpdate(status));\n    }\n  };\n};\n\nvar CreateDatabase = function CreateDatabase(_ref) {\n  var databases = _ref.databases,\n      selectedDatabase = _ref.selectedDatabase,\n      databaseName = _ref.databaseName,\n      databaseType = _ref.databaseType,\n      databaseID = _ref.databaseID,\n      databaseTypes = _ref.databaseTypes,\n      saveDatabaseDataInput = _ref.saveDatabaseDataInput,\n      databaseNameChange = _ref.databaseNameChange,\n      openDatabaseCreator = _ref.openDatabaseCreator,\n      handleSnackbarUpdate = _ref.handleSnackbarUpdate,\n      handleDatabaseTypeChange = _ref.handleDatabaseTypeChange;\n\n  function saveDatabaseData(e) {\n    e.preventDefault();\n\n    // remove whitespace and symbols\n    // //  following previous convention would be, but i refactored\n    var name = selectedDatabase.name.replace(/[^\\w]/gi, '');\n    // let name = databaseName.replace(/[^\\w]/gi, '');\n\n    // confirm database name was entered\n    if (!name.length) {\n      return handleSnackbarUpdate('Please enter a database name (no symbols or spaces)');\n    }\n\n    // capitalize first letter\n    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();\n\n    var databaseIndices = Object.keys(databases);\n    var selectedDatabaseIndex = String(selectedDatabase.databaseID);\n    // confirm database name does not exist\n    for (var x = 0; x < databaseIndices.length; x += 1) {\n      var existingDatabaseName = databases[databaseIndices[x]].name;\n      // if table name is a duplicate (not counting our selected table if updating)\n      if (existingDatabaseName === name && databaseIndices[x] !== selectedDatabaseIndex) {\n        return handleSnackbarUpdate('Error: Database name already exist');\n      }\n    }\n\n    // update table name with uppercase before saving/updating\n    databaseNameChange(name);\n    //  not sure why i had to make this difference, but the action doesn't dispatch if i take out \"selectedDatbase\"\n    return saveDatabaseDataInput(selectedDatabase);\n  }\n\n  function renderDatabaseName() {\n    if (databaseID >= 0) {\n      return _react2.default.createElement(\n        'h2',\n        null,\n        databases[databaseID].name,\n        ' Database'\n      );\n    }\n    return _react2.default.createElement(\n      'h2',\n      null,\n      'Create Database'\n    );\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { id: 'newTable', key: databaseID },\n    databaseID >= 0 && _react2.default.createElement(_FlatButton2.default, {\n      id: 'back-to-create',\n      label: 'Create Database',\n      icon: _react2.default.createElement(_keyboardArrowLeft2.default, null),\n      onClick: openDatabaseCreator\n    }),\n    _react2.default.createElement(\n      'form',\n      { id: 'create-table-form', onSubmit: saveDatabaseData },\n      renderDatabaseName(),\n      _react2.default.createElement(_TextField2.default, {\n        floatingLabelText: 'Database Name',\n        floatingLabelFocusStyle: {\n          color: '#194A9A'\n        },\n        underlineFocusStyle: {\n          borderColor: '#194A9A'\n        },\n        id: 'tableName',\n        fullWidth: true,\n        autoFocus: true,\n        onChange: function onChange(e) {\n          return databaseNameChange(e.target.value);\n        },\n        value: databaseName\n      }),\n      _react2.default.createElement(\n        'h5',\n        { style: { textAlign: 'center', marginTop: '-4px', fontWeight: '300' } },\n        '( Singular naming convention )'\n      ),\n      _react2.default.createElement(\n        _SelectField2.default,\n        {\n          labelid: 'databaseType',\n          id: 'select',\n          floatingLabelText: 'Choose Database Type',\n          selectedMenuItemStyle: {\n            color: '#194A9A'\n          },\n          style: {\n            width: '100%'\n          },\n          value: databaseType,\n          onChange: function onChange(e, index, value) {\n            return handleDatabaseTypeChange(value);\n          },\n          required: true\n        },\n        _react2.default.createElement(_MenuItem2.default, { value: 'MongoDB', primaryText: 'MongoDB' }),\n        _react2.default.createElement(_MenuItem2.default, { value: 'PostgreSQL', primaryText: 'PostgreSQL' }),\n        _react2.default.createElement(_MenuItem2.default, { value: 'MySQL', primaryText: 'MySQL' })\n      ),\n      _react2.default.createElement(_RaisedButton2.default, {\n        label: databaseID >= 0 ? 'Update Database' : 'Create Database',\n        fullWidth: true,\n        secondary: true,\n        type: 'submit',\n        style: {\n          marginTop: '25px',\n          boxShadow: 'none'\n        }\n      })\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CreateDatabase);\n\n//# sourceURL=webpack:///./components/databases/sidebar/create-db.jsx?");

/***/ }),

/***/ "./components/databases/sidebar/sidebar.css":
/*!**************************************************!*\
  !*** ./components/databases/sidebar/sidebar.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/databases/sidebar/sidebar.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/databases/sidebar/sidebar.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/databases/sidebar/sidebar.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/databases/sidebar/sidebar.css?");

/***/ }),

/***/ "./components/navbar/export-code/export-button.jsx":
/*!*********************************************************!*\
  !*** ./components/navbar/export-code/export-button.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _loader = __webpack_require__(/*! ./loader.jsx */ \"./components/navbar/export-code/loader.jsx\");\n\nvar _loader2 = _interopRequireDefault(_loader);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n// Material UI Components\n\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    database: store.schema.database,\n    databases: store.multiSchema.databases,\n    databaseTypes: store.multiSchema.databaseTypes\n  };\n};\n\nvar ExportCode = function (_Component) {\n  _inherits(ExportCode, _Component);\n\n  function ExportCode(props) {\n    _classCallCheck(this, ExportCode);\n\n    var _this = _possibleConstructorReturn(this, (ExportCode.__proto__ || Object.getPrototypeOf(ExportCode)).call(this, props));\n\n    _this.state = {\n      showLoader: false\n    };\n    _this.handleExport = _this.handleExport.bind(_this);\n    return _this;\n  }\n\n  _createClass(ExportCode, [{\n    key: 'toggleLoader',\n    value: function toggleLoader() {\n      var showLoader = this.state.showLoader;\n\n      this.setState({\n        showLoader: !showLoader\n      });\n    }\n  }, {\n    key: 'changeSetsToArrays',\n    value: function changeSetsToArrays(tables, databaseType, databaseName) {\n      // const tables = this.props.tables;\n      var changedTables = {};\n      for (var tableId in tables) {\n        var changedFields = {};\n        for (var fieldId in tables[tableId].fields) {\n          var field = tables[tableId].fields[fieldId];\n          var refBy = field.refBy;\n          if (refBy.size > 0) {\n            (function () {\n              var refByArray = [];\n              refBy.forEach(function (ele) {\n                refByArray.push(ele);\n              });\n              changedFields[fieldId] = Object.assign({}, field, { 'refBy': refByArray });\n            })();\n          }\n        }\n        if (Object.keys(changedFields).length > 0) {\n          var fields = Object.assign({}, tables[tableId].fields, changedFields);\n          changedTables[tableId] = Object.assign({}, tables[tableId], { 'fields': fields });\n        }\n      }\n      var tableData = Object.assign({}, tables, changedTables);\n      var data = Object.assign({}, { 'name': databaseName }, { 'tables': tableData }, { 'databaseName': databaseType });\n      return data;\n    }\n  }, {\n    key: 'handleExport',\n    value: function handleExport() {\n      var _this2 = this;\n\n      this.toggleLoader();\n      var data = {};\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n\n      try {\n        for (var _iterator = Object.entries(this.props.databases)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var _step$value = _slicedToArray(_step.value, 2),\n              key = _step$value[0],\n              value = _step$value[1];\n\n          var databaseName = value['name'];\n          data[key] = this.changeSetsToArrays(value['tables'], this.props.databaseTypes[key], databaseName);\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator.return) {\n            _iterator.return();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n\n      ;\n      // JSON.stringify doesn't work with Sets. Change Sets to arrays for export\n      // const data = this.changeSetsToArrays(); \n      setTimeout(function () {\n        fetch('/write-files-multiple', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          //  not sure why prop was passed as second argument\n          body: JSON.stringify(data, _this2.props.database)\n        }).then(function (res) {\n          return res.blob();\n        }).then(function (blob) {\n          return URL.createObjectURL(blob);\n        }).then(function (file) {\n          var element = document.createElement('a');\n          document.body.appendChild(element);\n          element.href = file;\n\n          // Multi-Project Feature: dynamic naming based on project name\n          element.download = 'graphql.zip';\n          element.click();\n          _this2.toggleLoader();\n        }).catch(function (err) {\n          _this2.toggleLoader();\n          console.log(err);\n        });\n      }, 2500);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(_FlatButton2.default, { style: { color: '#194A9A' }, label: 'Export Code', onClick: this.handleExport }),\n        this.state.showLoader && _react2.default.createElement(_loader2.default, null)\n      );\n    }\n  }]);\n\n  return ExportCode;\n}(_react.Component);\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(ExportCode);\n\n//# sourceURL=webpack:///./components/navbar/export-code/export-button.jsx?");

/***/ }),

/***/ "./components/navbar/export-code/loader.css":
/*!**************************************************!*\
  !*** ./components/navbar/export-code/loader.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./loader.css */ \"../node_modules/css-loader/index.js!./components/navbar/export-code/loader.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./loader.css */ \"../node_modules/css-loader/index.js!./components/navbar/export-code/loader.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./loader.css */ \"../node_modules/css-loader/index.js!./components/navbar/export-code/loader.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/navbar/export-code/loader.css?");

/***/ }),

/***/ "./components/navbar/export-code/loader.jsx":
/*!**************************************************!*\
  !*** ./components/navbar/export-code/loader.jsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\n__webpack_require__(/*! ./loader.css */ \"./components/navbar/export-code/loader.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Loader = function Loader() {\n  return _react2.default.createElement(\n    'div',\n    { className: 'overlay' },\n    _react2.default.createElement(\n      'div',\n      null,\n      _react2.default.createElement(\n        'h2',\n        { style: { color: 'white' } },\n        'Creating Your Code!'\n      ),\n      _react2.default.createElement(\n        'div',\n        { className: 'loader' },\n        _react2.default.createElement(\n          'div',\n          { className: 'hexContainer' },\n          _react2.default.createElement(\n            'div',\n            { className: 'hex' },\n            _react2.default.createElement('div', { className: 'hex inner' })\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'triangleContainer' },\n          _react2.default.createElement(\n            'div',\n            { className: 'triangle' },\n            _react2.default.createElement('div', { className: 'triangleInner' })\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'ballContainer' },\n          _react2.default.createElement('div', { className: 'balls ball1' }),\n          _react2.default.createElement('div', { className: 'balls ball2' }),\n          _react2.default.createElement('div', { className: 'balls ball3' }),\n          _react2.default.createElement('div', { className: 'balls ball4' }),\n          _react2.default.createElement('div', { className: 'balls ball5' }),\n          _react2.default.createElement('div', { className: 'balls ball6' })\n        )\n      )\n    )\n  );\n};\n\nexports.default = Loader;\n\n//# sourceURL=webpack:///./components/navbar/export-code/loader.jsx?");

/***/ }),

/***/ "./components/navbar/info/info.css":
/*!*****************************************!*\
  !*** ./components/navbar/info/info.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./info.css */ \"../node_modules/css-loader/index.js!./components/navbar/info/info.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./info.css */ \"../node_modules/css-loader/index.js!./components/navbar/info/info.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./info.css */ \"../node_modules/css-loader/index.js!./components/navbar/info/info.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/navbar/info/info.css?");

/***/ }),

/***/ "./components/navbar/info/info.jsx":
/*!*****************************************!*\
  !*** ./components/navbar/info/info.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _Dialog = __webpack_require__(/*! material-ui/Dialog */ \"../node_modules/material-ui/Dialog/index.js\");\n\nvar _Dialog2 = _interopRequireDefault(_Dialog);\n\nvar _teamButton = __webpack_require__(/*! ../../welcome/team/team-button.jsx */ \"./components/welcome/team/team-button.jsx\");\n\nvar _teamButton2 = _interopRequireDefault(_teamButton);\n\n__webpack_require__(/*! ./info.css */ \"./components/navbar/info/info.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n// styling\n\n\nvar style = {\n  height: '100%',\n  width: '100%',\n  margin: '10',\n  textAlign: 'center'\n};\n\nvar Info = function (_React$Component) {\n  _inherits(Info, _React$Component);\n\n  function Info(props) {\n    _classCallCheck(this, Info);\n\n    var _this = _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props));\n\n    _this.state = {\n      info: false\n    };\n    _this.handleInfoToggle = _this.handleInfoToggle.bind(_this);\n    return _this;\n  }\n\n  _createClass(Info, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var _this2 = this;\n\n      setTimeout(function () {\n        _this2.setState({ open: true });\n      }, 750);\n    }\n  }, {\n    key: 'handleInfoToggle',\n    value: function handleInfoToggle() {\n      console.log('click info button');\n      var info = this.state.info;\n\n      this.setState({ info: !info });\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var info = this.state.info;\n\n      return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n          _FlatButton2.default,\n          {\n            onClick: this.handleInfoToggle,\n            style: {\n              backgroundColor: '#fff',\n              height: '31px',\n              lineHeight: '31px',\n              fontSize: '0.9em',\n              fontWeight: '400'\n            }\n          },\n          'About us'\n        ),\n        _react2.default.createElement(\n          _Dialog2.default,\n          {\n            modal: true,\n            open: info,\n            onClose: this.handleClose,\n            onRequestClose: this.handleInfoToggle,\n            className: 'welcome-container',\n            paperClassName: 'welcome-box'\n          },\n          _react2.default.createElement('box-icon', {\n            name: 'x',\n            onClick: this.handleInfoToggle\n          }),\n          _react2.default.createElement(\n            'div',\n            {\n              className: 'welcome-split'\n            },\n            _react2.default.createElement(\n              'div',\n              null,\n              _react2.default.createElement('img', { src: './images/logo-vertical.png', alt: 'GraphQL Blueprint' }),\n              _react2.default.createElement(\n                'ul',\n                null,\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'Last updated: July 14, 2021'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'An OSLabs Project'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'MIT License'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    _react2.default.createElement(\n                      'a',\n                      { href: '#' },\n                      'https://github.com/oslabs-beta/GraphQL-Blueprint/'\n                    )\n                  )\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'A collaborative effort by'\n                  ),\n                  'Dylan Li, Sean Yalda, Kevin Berlanga, Ethan Yeh',\n                  _react2.default.createElement(_teamButton2.default, null)\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'Thanks to the team at ',\n                    _react2.default.createElement(\n                      'a',\n                      { href: 'http://graphqldesigner.com' },\n                      'GraphQL Designer'\n                    ),\n                    ' for open sourcing their code in 2018 to be iterated upon. Without them, GraphQL Blueprint wouldn\\u2019t exist.'\n                  )\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'Powered by'\n                  ),\n                  _react2.default.createElement(\n                    'ul',\n                    { className: 'logos-container' },\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://graphql.org/' },\n                        _react2.default.createElement('img', { src: './images/graphql.png', alt: 'GraphQL' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://www.apollographql.com/docs/apollo-server/' },\n                        _react2.default.createElement('img', { src: './images/apollo.png', alt: 'Apollo Server' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://expressjs.com/' },\n                        _react2.default.createElement('img', { src: './images/express.png', alt: 'Express JS' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://reactjs.org/' },\n                        _react2.default.createElement('img', { src: './images/react.png', alt: 'React JS' })\n                      )\n                    )\n                  )\n                )\n              )\n            ),\n            _react2.default.createElement(\n              'div',\n              null,\n              _react2.default.createElement('img', { src: './images/blueprint-texture.jpg', alt: 'Schema' })\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return Info;\n}(_react2.default.Component);\n\nexports.default = Info;\n\n//# sourceURL=webpack:///./components/navbar/info/info.jsx?");

/***/ }),

/***/ "./components/navbar/navbar.css":
/*!**************************************!*\
  !*** ./components/navbar/navbar.css ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!./navbar.css */ \"../node_modules/css-loader/index.js!./components/navbar/navbar.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../node_modules/css-loader!./navbar.css */ \"../node_modules/css-loader/index.js!./components/navbar/navbar.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../node_modules/css-loader!./navbar.css */ \"../node_modules/css-loader/index.js!./components/navbar/navbar.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/navbar/navbar.css?");

/***/ }),

/***/ "./components/navbar/navbar.jsx":
/*!**************************************!*\
  !*** ./components/navbar/navbar.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _actions = __webpack_require__(/*! ../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\n__webpack_require__(/*! ./navbar.css */ \"./components/navbar/navbar.css\");\n\nvar _exportButton = __webpack_require__(/*! ./export-code/export-button.jsx */ \"./components/navbar/export-code/export-button.jsx\");\n\nvar _exportButton2 = _interopRequireDefault(_exportButton);\n\nvar _treeView = __webpack_require__(/*! ./tree-view/treeView.jsx */ \"./components/navbar/tree-view/treeView.jsx\");\n\nvar _treeView2 = _interopRequireDefault(_treeView);\n\nvar _materialUi = __webpack_require__(/*! material-ui */ \"../node_modules/material-ui/index.es.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// styling\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    modalState: store.general.open,\n    schemaObject: store.schema\n  };\n};\n\n// components\n\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    handleNewProject: function handleNewProject(reset) {\n      return dispatch(actions.handleNewProject(reset));\n    },\n    saveDatabaseDataInput: function saveDatabaseDataInput(schemaObject) {\n      return dispatch(actions.saveDatabaseDataInput(schemaObject));\n    },\n    handleOpen: function handleOpen() {\n      return dispatch(actions.showModal());\n    },\n    handleClose: function handleClose() {\n      return dispatch(actions.hideModal());\n    },\n    handleNewMultiProject: function handleNewMultiProject(reset) {\n      return dispatch(actions.handleNewMultiProject(reset));\n    }\n  };\n};\n\nvar classes = {\n  button: {\n    color: '#5C5E72'\n  }\n};\n\nvar MainNav = function MainNav(_ref) {\n  var handleNewProject = _ref.handleNewProject,\n      handleNewMultiProject = _ref.handleNewMultiProject,\n      modalState = _ref.modalState,\n      handleClose = _ref.handleClose,\n      handleOpen = _ref.handleOpen,\n      saveDatabaseDataInput = _ref.saveDatabaseDataInput,\n      schemaObject = _ref.schemaObject;\n  return _react2.default.createElement(\n    'div',\n    null,\n    _react2.default.createElement(\n      'nav',\n      { id: 'navbar' },\n      _react2.default.createElement(\n        'div',\n        { id: 'nav-left' },\n        _react2.default.createElement('img', { alt: '', id: 'logo', src: './images/logo-horizontal.svg' }),\n        _react2.default.createElement(_FlatButton2.default, { label: 'New Project', onClick: function onClick() {\n            handleNewProject(true);\n            handleNewMultiProject(true);\n          } }),\n        _react2.default.createElement(_FlatButton2.default, {\n          label: 'Tree View',\n          onClick: function onClick() {\n            handleOpen();\n            if (schemaObject.name) {\n              saveDatabaseDataInput(schemaObject);\n            }\n          } }),\n        _react2.default.createElement(\n          _materialUi.Dialog,\n          {\n            paperClassName: 'tree-box',\n            actionsContainerClassName: 'tree-box2',\n            modal: false,\n            open: modalState,\n            onRequestClose: handleClose,\n            autoDetectWindowHeight: true,\n            contentStyle: {\n              maxWidth: '95%',\n              width: '100%'\n            }\n          },\n          _react2.default.createElement(_treeView2.default, null)\n        )\n      ),\n      _react2.default.createElement(\n        'div',\n        { id: 'nav-right' },\n        _react2.default.createElement(_exportButton2.default, null)\n      )\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MainNav);\n\n//# sourceURL=webpack:///./components/navbar/navbar.jsx?");

/***/ }),

/***/ "./components/navbar/tree-view/treeView.css":
/*!**************************************************!*\
  !*** ./components/navbar/tree-view/treeView.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./treeView.css */ \"../node_modules/css-loader/index.js!./components/navbar/tree-view/treeView.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./treeView.css */ \"../node_modules/css-loader/index.js!./components/navbar/tree-view/treeView.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./treeView.css */ \"../node_modules/css-loader/index.js!./components/navbar/tree-view/treeView.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/navbar/tree-view/treeView.css?");

/***/ }),

/***/ "./components/navbar/tree-view/treeView.jsx":
/*!**************************************************!*\
  !*** ./components/navbar/tree-view/treeView.jsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n// styles\n\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _reactD3Tree = __webpack_require__(/*! react-d3-tree */ \"../node_modules/react-d3-tree/lib/index.js\");\n\nvar _reactD3Tree2 = _interopRequireDefault(_reactD3Tree);\n\n__webpack_require__(/*! ./treeView.css */ \"./components/navbar/tree-view/treeView.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    databases: store.multiSchema.databases\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {};\n};\n\nvar treeViewify = function treeViewify(data) {\n  //  initialize tree\n  var tree = {\n    name: 'GraphQL Endpoint'\n\n    //  declare first children layer array\n  };var firstChildrenArray = [];\n\n  if (_typeof(data.databases) === 'object' && data.databases !== null && JSON.stringify(data.databases) !== '{}') {\n    var _iteratorNormalCompletion = true;\n    var _didIteratorError = false;\n    var _iteratorError = undefined;\n\n    try {\n      for (var _iterator = Object.entries(data.databases)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n        var _step$value = _slicedToArray(_step.value, 2),\n            databaseIndex = _step$value[0],\n            databaseObject = _step$value[1];\n\n        var firstChildrenObject = {};\n\n        if ((typeof databaseObject === 'undefined' ? 'undefined' : _typeof(databaseObject)) === 'object' && databaseObject !== null && JSON.stringify(databaseObject) !== '{}') {\n          var secondChildrenArray = [];\n          firstChildrenObject['name'] = databaseObject.name;\n          firstChildrenObject['attributes'] = { \"type\": databaseObject.database };\n\n          var _iteratorNormalCompletion2 = true;\n          var _didIteratorError2 = false;\n          var _iteratorError2 = undefined;\n\n          try {\n            for (var _iterator2 = Object.entries(databaseObject.tables)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n              var _step2$value = _slicedToArray(_step2.value, 2),\n                  tableIndex = _step2$value[0],\n                  tableObject = _step2$value[1];\n\n              var secondChildrenObject = {};\n\n              if (_typeof(databaseObject.tables) === 'object' && databaseObject.tables !== null && JSON.stringify(databaseObject.tables) !== '{}') {\n                var thirdChildrenArray = [];\n                secondChildrenObject['name'] = tableObject.type;\n\n                var _iteratorNormalCompletion3 = true;\n                var _didIteratorError3 = false;\n                var _iteratorError3 = undefined;\n\n                try {\n                  for (var _iterator3 = Object.entries(tableObject.fields)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n                    var _step3$value = _slicedToArray(_step3.value, 2),\n                        fieldIndex = _step3$value[0],\n                        fieldObject = _step3$value[1];\n\n                    var thirdChildrenObject = {};\n\n                    if (_typeof(tableObject.fields) === 'object' && tableObject.fields !== null) {\n                      thirdChildrenObject['name'] = fieldObject.name;\n                      thirdChildrenObject['attributes'] = { \"type\": fieldObject.type };\n                      thirdChildrenArray.push(thirdChildrenObject);\n                    }\n                  }\n                } catch (err) {\n                  _didIteratorError3 = true;\n                  _iteratorError3 = err;\n                } finally {\n                  try {\n                    if (!_iteratorNormalCompletion3 && _iterator3.return) {\n                      _iterator3.return();\n                    }\n                  } finally {\n                    if (_didIteratorError3) {\n                      throw _iteratorError3;\n                    }\n                  }\n                }\n\n                secondChildrenObject['children'] = thirdChildrenArray;\n                secondChildrenArray.push(secondChildrenObject);\n              }\n            }\n          } catch (err) {\n            _didIteratorError2 = true;\n            _iteratorError2 = err;\n          } finally {\n            try {\n              if (!_iteratorNormalCompletion2 && _iterator2.return) {\n                _iterator2.return();\n              }\n            } finally {\n              if (_didIteratorError2) {\n                throw _iteratorError2;\n              }\n            }\n          }\n\n          firstChildrenObject['children'] = secondChildrenArray;\n          firstChildrenArray.push(firstChildrenObject);\n        }\n      }\n    } catch (err) {\n      _didIteratorError = true;\n      _iteratorError = err;\n    } finally {\n      try {\n        if (!_iteratorNormalCompletion && _iterator.return) {\n          _iterator.return();\n        }\n      } finally {\n        if (_didIteratorError) {\n          throw _iteratorError;\n        }\n      }\n    }\n\n    tree['children'] = firstChildrenArray;\n  }\n\n  return tree;\n};\n\n// This is a simplified example of an org chart to be fed into D3 React Tree\n\n// const orgChart = {\n//   name: 'CEO',\n//   children: [\n//     {\n//       name: 'Manager',\n//       attributes: {\n//         department: 'Production',\n//       },\n//       children: [\n//         {\n//           name: 'Foreman',\n//           attributes: {\n//             department: 'Fabrication',\n//           },\n//           children: [\n//             {\n//               name: 'Worker',\n//             },\n//           ],\n//         },\n//         {\n//           name: 'Foreman',\n//           attributes: {\n//             department: 'Assembly',\n//           },\n//           children: [\n//             {\n//               name: 'Worker',\n//             },\n//           ],\n//         },\n//       ],\n//     },\n//   ],\n// };\nvar renderRectSvgNode = function renderRectSvgNode(_ref) {\n  var nodeDatum = _ref.nodeDatum,\n      toggleNode = _ref.toggleNode;\n  return _react2.default.createElement(\n    'g',\n    null,\n    _react2.default.createElement('rect', { width: '20', height: '20', x: '-10', onClick: toggleNode }),\n    _react2.default.createElement(\n      'text',\n      { fill: 'white', strokeWidth: '1', x: '20' },\n      nodeDatum.name\n    ),\n    nodeDatum.attributes && nodeDatum.attributes.type && _react2.default.createElement(\n      'text',\n      { fill: 'white', x: '20', dy: '20', strokeWidth: '1' },\n      'Type: ',\n      nodeDatum.attributes.type\n    )\n  );\n};\n\nvar TreeView = function TreeView(databases) {\n  var treeData = treeViewify(databases);\n  return (\n    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.\n    _react2.default.createElement(\n      'div',\n      { id: 'treeWrapper', style: { height: '40em' } },\n      _react2.default.createElement(_reactD3Tree2.default, {\n        data: treeData,\n        rootNodeClassName: 'node__root',\n        branchNodeClassName: 'node__branch',\n        leafNodeClassName: 'node__leaf',\n        orientation: 'vertical',\n        translate: { x: '375', y: '165' }\n      })\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TreeView);\n\n//# sourceURL=webpack:///./components/navbar/tree-view/treeView.jsx?");

/***/ }),

/***/ "./components/schema/field.jsx":
/*!*************************************!*\
  !*** ./components/schema/field.jsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _close = __webpack_require__(/*! material-ui/svg-icons/navigation/close */ \"../node_modules/material-ui/svg-icons/navigation/close.js\");\n\nvar _close2 = _interopRequireDefault(_close);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _actions = __webpack_require__(/*! ../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    deleteField: function deleteField(fieldName) {\n      return dispatch(actions.deleteField(fieldName));\n    },\n    handleFieldsSelect: function handleFieldsSelect(field) {\n      return dispatch(actions.handleFieldsSelect(field));\n    },\n    deletedFieldRelationUpdate: function deletedFieldRelationUpdate(indexes) {\n      return dispatch(actions.deletedFieldRelationUpdate(indexes));\n    }\n  };\n};\n\nvar Field = function Field(_ref) {\n  var deletedFieldRelationUpdate = _ref.deletedFieldRelationUpdate,\n      deleteField = _ref.deleteField,\n      handleFieldsSelect = _ref.handleFieldsSelect,\n      fieldIndex = _ref.fieldIndex,\n      tableIndex = _ref.tableIndex,\n      buttonColor = _ref.buttonColor,\n      refColor = _ref.refColor,\n      buttonDisabled = _ref.buttonDisabled,\n      field = _ref.field;\n\n  function handleDeleteField() {\n    if (field.relation.tableIndex > -1 || field.refBy.size) {\n      deletedFieldRelationUpdate({ tableIndex: tableIndex, fieldIndex: fieldIndex });\n    }\n    deleteField([tableIndex, fieldIndex]);\n  }\n\n  function handleUpdateField(event) {\n    handleFieldsSelect({\n      location: event.currentTarget.getAttribute('data-value'),\n      submitUpdate: false\n    });\n  }\n\n  function generateFieldText() {\n    function checkForArray(position, multipleValues) {\n      if (multipleValues) {\n        if (position === 'front') return '[ ';\n        if (position === 'back') return ' ]';\n      }\n      return '';\n    }\n\n    function checkForRequired(value) {\n      if (value) return ' !';\n      return '';\n    }\n\n    function checkForUnique(value) {\n      if (value) return ' *';\n      return '';\n    }\n\n    var fieldText = field.name;\n    fieldText += '<small>';\n    fieldText += checkForArray('front', field.multipleValues);\n    fieldText += field.type;\n    fieldText += checkForRequired(field.required);\n    fieldText += checkForUnique(field.unique);\n    fieldText += checkForArray('back', field.multipleValues);\n    fieldText += '</small>';\n    return fieldText;\n  }\n\n  return _react2.default.createElement(\n    'div',\n    null,\n    _react2.default.createElement(\n      'div',\n      { className: 'field' },\n      _react2.default.createElement(\n        'div',\n        { className: 'fieldContainer1', style: { borderLeft: '10px solid ' + buttonColor } },\n        _react2.default.createElement(\n          'div',\n          { className: 'fieldContainer2', style: { borderLeft: '10px solid ' + refColor } },\n          _react2.default.createElement('div', {\n            'data-value': tableIndex + ' ' + field.fieldNum,\n            onClick: handleUpdateField,\n            className: 'fieldButton',\n            disabled: buttonDisabled,\n            dangerouslySetInnerHTML: { __html: generateFieldText() }\n          }),\n          _react2.default.createElement(_FlatButton2.default, {\n            className: 'delete-button',\n            icon: _react2.default.createElement(_close2.default, null),\n            value: fieldIndex,\n            onClick: handleDeleteField,\n            style: { minWidth: '25px' },\n            disabled: buttonDisabled\n          })\n        )\n      )\n    ),\n    _react2.default.createElement('hr', { className: 'fieldBreak' })\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(null, mapDispatchToProps)(Field);\n\n//# sourceURL=webpack:///./components/schema/field.jsx?");

/***/ }),

/***/ "./components/schema/schema-app.jsx":
/*!******************************************!*\
  !*** ./components/schema/schema-app.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _reactTransitionGroup = __webpack_require__(/*! react-transition-group */ \"../node_modules/react-transition-group/index.js\");\n\nvar _table = __webpack_require__(/*! ./table.jsx */ \"./components/schema/table.jsx\");\n\nvar _table2 = _interopRequireDefault(_table);\n\nvar _createTable = __webpack_require__(/*! ./sidebar/create-table.jsx */ \"./components/schema/sidebar/create-table.jsx\");\n\nvar _createTable2 = _interopRequireDefault(_createTable);\n\nvar _tableOptions = __webpack_require__(/*! ./sidebar/table-options.jsx */ \"./components/schema/sidebar/table-options.jsx\");\n\nvar _tableOptions2 = _interopRequireDefault(_tableOptions);\n\n__webpack_require__(/*! ./schema.css */ \"./components/schema/schema.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// We use store.data, because of index.js reduce function\n\n\n// components\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    selectedField: store.schema.selectedField\n  };\n};\n\n// styles\n\n\nvar SchemaApp = function SchemaApp(_ref) {\n  var tables = _ref.tables,\n      selectedField = _ref.selectedField;\n\n  // Dynamically renders each table based on the number of tables.\n  function renderTables() {\n    return Object.keys(tables).map(function (tableIndex) {\n      return _react2.default.createElement(\n        _reactTransitionGroup.CSSTransition,\n        {\n          key: tableIndex,\n          timeout: 100,\n          classNames: 'fadeScale'\n        },\n        _react2.default.createElement(_table2.default, {\n          key: tableIndex,\n          tableData: tables[tableIndex],\n          tableIndex: tableIndex\n        })\n      );\n    });\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { className: 'schema-app-container' },\n    _react2.default.createElement(\n      _reactTransitionGroup.CSSTransition,\n      {\n        'in': true,\n        timeout: 200,\n        classNames: 'fade'\n      },\n      _react2.default.createElement(\n        'div',\n        { id: 'sidebar-container' },\n        _react2.default.createElement(\n          _reactTransitionGroup.CSSTransition,\n          {\n            'in': selectedField.tableNum < 0,\n            key: 'table',\n            timeout: 200,\n            classNames: 'fade'\n          },\n          _react2.default.createElement(_createTable2.default, null)\n        ),\n        _react2.default.createElement(\n          _reactTransitionGroup.CSSTransition,\n          {\n            'in': selectedField.tableNum >= 0,\n            key: 'fields',\n            timeout: 200,\n            classNames: 'fade'\n          },\n          _react2.default.createElement(_tableOptions2.default, null)\n        )\n      )\n    ),\n    _react2.default.createElement(\n      _reactTransitionGroup.TransitionGroup,\n      { className: 'table-components-container', id: 'wallpaper-schema' },\n      renderTables()\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, null)(SchemaApp);\n\n//# sourceURL=webpack:///./components/schema/schema-app.jsx?");

/***/ }),

/***/ "./components/schema/schema.css":
/*!**************************************!*\
  !*** ./components/schema/schema.css ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/schema/schema.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/schema/schema.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../node_modules/css-loader!./schema.css */ \"../node_modules/css-loader/index.js!./components/schema/schema.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/schema/schema.css?");

/***/ }),

/***/ "./components/schema/sidebar/create-table.jsx":
/*!****************************************************!*\
  !*** ./components/schema/sidebar/create-table.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _TextField = __webpack_require__(/*! material-ui/TextField */ \"../node_modules/material-ui/TextField/index.js\");\n\nvar _TextField2 = _interopRequireDefault(_TextField);\n\nvar _RaisedButton = __webpack_require__(/*! material-ui/RaisedButton */ \"../node_modules/material-ui/RaisedButton/index.js\");\n\nvar _RaisedButton2 = _interopRequireDefault(_RaisedButton);\n\nvar _Checkbox = __webpack_require__(/*! material-ui/Checkbox */ \"../node_modules/material-ui/Checkbox/index.js\");\n\nvar _Checkbox2 = _interopRequireDefault(_Checkbox);\n\nvar _keyboardArrowLeft = __webpack_require__(/*! material-ui/svg-icons/hardware/keyboard-arrow-left */ \"../node_modules/material-ui/svg-icons/hardware/keyboard-arrow-left.js\");\n\nvar _keyboardArrowLeft2 = _interopRequireDefault(_keyboardArrowLeft);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _List = __webpack_require__(/*! material-ui/List */ \"../node_modules/material-ui/List/index.js\");\n\nvar _Divider = __webpack_require__(/*! material-ui/Divider */ \"../node_modules/material-ui/Divider/index.js\");\n\nvar _Divider2 = _interopRequireDefault(_Divider);\n\nvar _Paper = __webpack_require__(/*! material-ui/Paper */ \"../node_modules/material-ui/Paper/index.js\");\n\nvar _Paper2 = _interopRequireDefault(_Paper);\n\nvar _actions = __webpack_require__(/*! ../../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\n__webpack_require__(/*! ./sidebar.css */ \"./components/schema/sidebar/sidebar.css\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar style = {\n  paper: {\n    display: 'block',\n    width: '80%',\n    margin: 'auto',\n    borderRadius: '8px',\n    backgroundColor: '#F2F3F3',\n    boxShadow: 'none',\n    padding: '0px 16px 8px'\n  },\n  relationDesc: {\n    fontSize: '12px'\n  },\n  listItems: {\n    fontSize: '14px',\n    padding: '12px 8px 8px'\n  }\n};\n\n// styles\n\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    selectedTable: store.schema.selectedTable,\n    tableName: store.schema.selectedTable.type,\n    tableID: store.schema.selectedTable.tableID,\n    database: store.schema.database\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    saveTableDataInput: function saveTableDataInput(database) {\n      return dispatch(actions.saveTableDataInput(database));\n    },\n    tableNameChange: function tableNameChange(tableName) {\n      return dispatch(actions.handleTableNameChange(tableName));\n    },\n    idSelector: function idSelector() {\n      return dispatch(actions.handleTableID());\n    },\n    openTableCreator: function openTableCreator() {\n      return dispatch(actions.openTableCreator());\n    },\n    handleSnackbarUpdate: function handleSnackbarUpdate(status) {\n      return dispatch(actions.handleSnackbarUpdate(status));\n    }\n  };\n};\n// function notifyAndSetInventory(notify, inventoryItem) {\n//   return dispatch => {\n//       dispatch(displayNotification(notify));\n//       return dispatch(setInventory(inventoryItem));\n//   };\n// }\nvar CreateTable = function CreateTable(_ref) {\n  var tables = _ref.tables,\n      selectedTable = _ref.selectedTable,\n      tableName = _ref.tableName,\n      tableID = _ref.tableID,\n      database = _ref.database,\n      saveTableDataInput = _ref.saveTableDataInput,\n      tableNameChange = _ref.tableNameChange,\n      idSelector = _ref.idSelector,\n      openTableCreator = _ref.openTableCreator,\n      handleSnackbarUpdate = _ref.handleSnackbarUpdate;\n\n  function saveTableData(e) {\n    e.preventDefault();\n\n    // remove whitespace and symbols\n    var name = selectedTable.type.replace(/[^\\w]/gi, '');\n\n    // confirm table name was entered\n    if (!name.length) {\n      return handleSnackbarUpdate('Please enter a table name (no symbols or spaces)');\n    }\n\n    // capitalize first letter\n    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();\n\n    var tableIndices = Object.keys(tables);\n    var selectedTableIndex = String(selectedTable.tableID);\n    // confirm table name does not exist\n    for (var x = 0; x < tableIndices.length; x += 1) {\n      var existingTableName = tables[tableIndices[x]].type;\n      // if table name is a duplicate (not counting our selected table if updating)\n      if (existingTableName === name && tableIndices[x] !== selectedTableIndex) {\n        return handleSnackbarUpdate('Error: Table name already exist');\n      }\n    }\n\n    // update table name with uppercase before saving/updating\n    tableNameChange(name);\n    return saveTableDataInput();\n  }\n\n  function renderTableName() {\n    if (tableID >= 0) {\n      return _react2.default.createElement(\n        'h2',\n        null,\n        tables[tableID].type,\n        ' Table'\n      );\n    }\n    return _react2.default.createElement(\n      'h2',\n      null,\n      'Create Table'\n    );\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { id: 'newTable', key: tableID },\n    tableID >= 0 && _react2.default.createElement(_FlatButton2.default, {\n      id: 'back-to-create',\n      label: 'Create Table',\n      icon: _react2.default.createElement(_keyboardArrowLeft2.default, null),\n      onClick: openTableCreator\n    }),\n    _react2.default.createElement(\n      'form',\n      { id: 'create-table-form', onSubmit: saveTableData },\n      renderTableName(),\n      _react2.default.createElement(_TextField2.default, {\n        floatingLabelText: 'Table Name',\n        floatingLabelFocusStyle: {\n          color: '#194A9A'\n        },\n        underlineFocusStyle: {\n          borderColor: '#194A9A'\n        },\n        id: 'tableName',\n        fullWidth: true,\n        autoFocus: true,\n        onChange: function onChange(e) {\n          return tableNameChange(e.target.value);\n        },\n        value: tableName\n      }),\n      _react2.default.createElement(\n        'h5',\n        { style: { textAlign: 'center', marginTop: '-4px', fontWeight: '300' } },\n        '( Singular naming convention )'\n      ),\n      _react2.default.createElement(_Checkbox2.default, {\n        style: { marginTop: '10px' },\n        label: 'Unique ID',\n        onCheck: function onCheck() {\n          return idSelector();\n        },\n        id: 'idCheckbox',\n        checked: !!selectedTable.fields[0],\n        disabled: database === 'MongoDB'\n      }),\n      _react2.default.createElement(_RaisedButton2.default, {\n        label: tableID >= 0 ? 'Update Table' : 'Create Table',\n        fullWidth: true,\n        secondary: true,\n        type: 'submit',\n        style: {\n          marginTop: '25px',\n          boxShadow: 'none'\n        }\n      })\n    ),\n    _react2.default.createElement('br', null),\n    _react2.default.createElement('br', null),\n    _react2.default.createElement(\n      'div',\n      null,\n      _react2.default.createElement(\n        _Paper2.default,\n        { style: style.paper },\n        _react2.default.createElement(\n          _List.List,\n          { style: { paddingLeft: \"0\" } },\n          _react2.default.createElement(\n            _List.ListItem,\n            { key: 'legend', disabled: true, style: style.listItems },\n            _react2.default.createElement(\n              'strong',\n              null,\n              'Legend'\n            )\n          ),\n          _react2.default.createElement(_Divider2.default, null),\n          _react2.default.createElement(\n            _List.ListItem,\n            { key: 'legend-required', disabled: true, style: style.listItems },\n            'Required : !'\n          ),\n          _react2.default.createElement(\n            _List.ListItem,\n            { key: 'unique', disabled: true, style: style.listItems },\n            'Unique : *'\n          ),\n          _react2.default.createElement(\n            _List.ListItem,\n            { key: 'multiple-values', disabled: true, style: style.listItems },\n            'Multiple Values : [ ]'\n          ),\n          _react2.default.createElement(\n            _List.ListItem,\n            {\n              key: 'relation',\n              disabled: true,\n              style: style.listItems,\n              nestedItems: [_react2.default.createElement(\n                _List.ListItem,\n                { key: 'relation-desc1', disabled: true, style: style.relationDesc },\n                'Diagonal color on field (Name) indicates field is referenced by another field of that same color'\n              ), _react2.default.createElement(\n                _List.ListItem,\n                { key: 'relation-pic', disabled: true },\n                _react2.default.createElement('img', { src: './images/relation1.png', alt: 'relations' })\n              ), _react2.default.createElement(\n                _List.ListItem,\n                { key: 'relation-desc2', disabled: true, style: style.relationDesc },\n                'Colored field (AuthorId) indicates it has relation to another field of that same color'\n              ), _react2.default.createElement(\n                _List.ListItem,\n                { key: 'relation-pic2', disabled: true },\n                _react2.default.createElement('img', { src: './images/relation2.png', alt: 'relations' })\n              )]\n            },\n            'Relation :'\n          )\n        )\n      )\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(CreateTable);\n\n//# sourceURL=webpack:///./components/schema/sidebar/create-table.jsx?");

/***/ }),

/***/ "./components/schema/sidebar/sidebar.css":
/*!***********************************************!*\
  !*** ./components/schema/sidebar/sidebar.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/schema/sidebar/sidebar.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/schema/sidebar/sidebar.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./sidebar.css */ \"../node_modules/css-loader/index.js!./components/schema/sidebar/sidebar.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/schema/sidebar/sidebar.css?");

/***/ }),

/***/ "./components/schema/sidebar/table-options.jsx":
/*!*****************************************************!*\
  !*** ./components/schema/sidebar/table-options.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _actions = __webpack_require__(/*! ../../../actions/actions.js */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\n__webpack_require__(/*! ./sidebar.css */ \"./components/schema/sidebar/sidebar.css\");\n\nvar _keyboardArrowLeft = __webpack_require__(/*! material-ui/svg-icons/hardware/keyboard-arrow-left */ \"../node_modules/material-ui/svg-icons/hardware/keyboard-arrow-left.js\");\n\nvar _keyboardArrowLeft2 = _interopRequireDefault(_keyboardArrowLeft);\n\nvar _TextField = __webpack_require__(/*! material-ui/TextField */ \"../node_modules/material-ui/TextField/index.js\");\n\nvar _TextField2 = _interopRequireDefault(_TextField);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _RaisedButton = __webpack_require__(/*! material-ui/RaisedButton/RaisedButton */ \"../node_modules/material-ui/RaisedButton/RaisedButton.js\");\n\nvar _RaisedButton2 = _interopRequireDefault(_RaisedButton);\n\nvar _SelectField = __webpack_require__(/*! material-ui/SelectField */ \"../node_modules/material-ui/SelectField/index.js\");\n\nvar _SelectField2 = _interopRequireDefault(_SelectField);\n\nvar _Toggle = __webpack_require__(/*! material-ui/Toggle */ \"../node_modules/material-ui/Toggle/index.js\");\n\nvar _Toggle2 = _interopRequireDefault(_Toggle);\n\nvar _MenuItem = __webpack_require__(/*! material-ui/MenuItem */ \"../node_modules/material-ui/MenuItem/index.js\");\n\nvar _MenuItem2 = _interopRequireDefault(_MenuItem);\n\nvar _DropDownMenu = __webpack_require__(/*! material-ui/DropDownMenu */ \"../node_modules/material-ui/DropDownMenu/index.js\");\n\nvar _DropDownMenu2 = _interopRequireDefault(_DropDownMenu);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar style = {\n  customWidth: {\n    width: 200\n  },\n  toggle: {\n    marginTop: '5px'\n  }\n};\n\n// styles\n\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    database: store.schema.database,\n    selectedField: store.schema.selectedField,\n    tables: store.schema.tables\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    // createField: field => dispatch(actions.addField(field)),\n    saveFieldInput: function saveFieldInput(database) {\n      return dispatch(actions.saveFieldInput(database));\n    },\n    handleChange: function handleChange(field) {\n      return dispatch(actions.handleFieldsUpdate(field));\n    },\n    openTableCreator: function openTableCreator() {\n      return dispatch(actions.openTableCreator());\n    },\n    handleSnackbarUpdate: function handleSnackbarUpdate(status) {\n      return dispatch(actions.handleSnackbarUpdate(status));\n    }\n  };\n};\n\nvar TableOptions = function TableOptions(_ref) {\n  var database = _ref.database,\n      selectedField = _ref.selectedField,\n      tables = _ref.tables,\n      saveFieldInput = _ref.saveFieldInput,\n      handleChange = _ref.handleChange,\n      openTableCreator = _ref.openTableCreator,\n      handleSnackbarUpdate = _ref.handleSnackbarUpdate;\n\n  function handleToggle(name, value) {\n    handleChange({ name: name, value: value });\n\n    // set required to true and disabled if primary key is selected for SQL\n    if (database !== 'MongoDB' && name === 'primaryKey' && value === true) {\n      handleChange({ name: 'required', value: true });\n    }\n  }\n\n  // user saves added or updated field\n  function submitOptions(event) {\n    event.preventDefault();\n    var currTableNum = selectedField.tableNum;\n\n    // remove whitespace and symbols\n    var originalFieldName = selectedField.name;\n    var newFieldName = selectedField.name.replace(/[^\\w]/gi, '');\n\n    if (!newFieldName.length) {\n      return handleSnackbarUpdate('Please enter a field name (no space, symbols allowed)');\n    }\n\n    // get list of field indexes\n    var listFieldIndexes = Object.keys(tables[currTableNum].fields);\n    var selectedFieldIndex = String(selectedField.fieldNum);\n\n    // check that the new field name is not the same as a previous field name\n    for (var i = 0; i < listFieldIndexes.length; i += 1) {\n      var existingFieldName = tables[currTableNum].fields[listFieldIndexes[i]].name;\n      // if field name is a duplicate (not counting our selected field if updating)\n      if (existingFieldName === newFieldName && listFieldIndexes[i] !== selectedFieldIndex) {\n        return handleSnackbarUpdate('Error: Field name already exist');\n      }\n    }\n\n    // confirm Type, Field, and RefType are filled out if Relation is toggled\n    if (selectedField.relationSelected) {\n      if (selectedField.relation.tableIndex === -1 || selectedField.relation.fieldIndex === -1 || !selectedField.relation.refType) {\n        return handleSnackbarUpdate('Please fill out Type, Field and RefType for matching field');\n      }\n    }\n\n    // update state if field name was modified to take out spaces and symbols.\n    if (originalFieldName !== newFieldName) {\n      handleSnackbarUpdate('Spaces or symbols were removed from field name');\n      handleChange({\n        name: 'name',\n        value: newFieldName\n      });\n    }\n\n    // save or update table\n    return saveFieldInput();\n  }\n\n  // returns an array of the related tables\n  function renderRelatedTables() {\n    return Object.keys(tables).map(function (tableIndex) {\n      return _react2.default.createElement(_MenuItem2.default, {\n        key: tableIndex,\n        value: tableIndex,\n        primaryText: tables[tableIndex].type\n      });\n    });\n  }\n\n  function renderRelatedFields() {\n    var renderedFields = [];\n    var selectedTableIndex = selectedField.relation.tableIndex;\n    if (selectedTableIndex >= 0) {\n      Object.keys(tables[selectedTableIndex].fields).forEach(function (field) {\n        // check if field has a relation to selected field, if so, don't push\n        var noRelationExists = true;\n        var tableIndex = selectedField.tableNum;\n        var fieldIndex = selectedField.fieldNum;\n        if (fieldIndex >= 0) {\n          var refBy = tables[tableIndex].fields[fieldIndex].refBy;\n\n          var refTypes = ['one to one', 'one to many', 'many to one', 'many to many'];\n          for (var i = 0; i < refTypes.length; i += 1) {\n            var refInfo = selectedTableIndex + '.' + field + '.' + refTypes[i];\n            if (refBy.has(refInfo)) {\n              noRelationExists = false;\n            }\n          }\n        }\n        // only push to fields if multiple values is false for the field,\n        // and no relation exists to selected field\n        if (!tables[selectedTableIndex].fields[field].multipleValues && noRelationExists) {\n          renderedFields.push(_react2.default.createElement(_MenuItem2.default, {\n            key: field,\n            value: field,\n            primaryText: tables[selectedTableIndex].fields[field].name\n          }));\n        }\n      });\n    }\n    return renderedFields;\n  }\n\n  function fieldName(fieldNum, tableNum) {\n    // Header text if adding a new field\n    var h2Text = 'Add Field';\n    var h4Text = 'in ' + tables[tableNum].type;\n    // Header text if updating a field\n    if (fieldNum >= 0) {\n      h2Text = 'Update ' + tables[tableNum].fields[fieldNum].name;\n      h4Text = 'in ' + tables[tableNum].type;\n    }\n\n    return _react2.default.createElement(\n      'div',\n      { style: { marginTop: '10px' } },\n      _react2.default.createElement(\n        'h2',\n        null,\n        h2Text\n      ),\n      _react2.default.createElement(\n        'h4',\n        { style: { fontWeight: '200', marginTop: '5px' } },\n        h4Text\n      )\n    );\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { id: 'fieldOptions create-table-form' },\n    selectedField.tableNum > -1 && _react2.default.createElement(\n      'div',\n      { id: 'options', style: { width: '250px' } },\n      _react2.default.createElement(_FlatButton2.default, {\n        id: 'back-to-create',\n        label: 'Create Table',\n        icon: _react2.default.createElement(_keyboardArrowLeft2.default, null),\n        onClick: openTableCreator\n      }),\n      _react2.default.createElement(\n        'form',\n        { style: { width: '100%' } },\n        fieldName(selectedField.fieldNum, selectedField.tableNum, tables),\n        _react2.default.createElement(_TextField2.default, {\n          hintText: 'Field Name',\n          floatingLabelText: 'Field Name',\n          fullWidth: true,\n          name: 'name',\n          id: 'fieldNameOption',\n          onChange: function onChange(e) {\n            return handleChange({ name: e.target.name, value: e.target.value });\n          },\n          value: selectedField.name,\n          autoFocus: true\n        }),\n        _react2.default.createElement(\n          _SelectField2.default,\n          {\n            floatingLabelText: 'Type',\n            fullWidth: true,\n            value: selectedField.type,\n            onChange: function onChange(e, i, value) {\n              return handleChange({ name: 'type', value: value });\n            }\n          },\n          _react2.default.createElement(_MenuItem2.default, { value: 'String', primaryText: 'String' }),\n          _react2.default.createElement(_MenuItem2.default, { value: 'Number', primaryText: 'Number' }),\n          _react2.default.createElement(_MenuItem2.default, { value: 'Boolean', primaryText: 'Boolean' }),\n          _react2.default.createElement(_MenuItem2.default, { value: 'ID', primaryText: 'ID' })\n        ),\n        _react2.default.createElement(_TextField2.default, {\n          hintText: 'Default Value',\n          floatingLabelText: 'Default Value',\n          fullWidth: true,\n          id: 'defaultValueOption',\n          name: 'defaultValue',\n          onChange: function onChange(e) {\n            return handleChange({ name: e.target.name, value: e.target.value });\n          },\n          value: selectedField.defaultValue\n        }),\n        database !== 'MongoDB' && _react2.default.createElement(_Toggle2.default, {\n          label: 'Primary Key',\n          toggled: selectedField.primaryKey,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('primaryKey', value);\n          },\n          style: style.toggle\n        }),\n        _react2.default.createElement(_Toggle2.default, {\n          label: 'Required',\n          toggled: selectedField.required,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('required', value);\n          },\n          style: style.toggle,\n          disabled: selectedField.primaryKey\n        }),\n        _react2.default.createElement(_Toggle2.default, {\n          label: 'Unique',\n          toggled: selectedField.unique,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('unique', value);\n          },\n          style: style.toggle\n        }),\n        database !== 'MongoDB' && _react2.default.createElement(_Toggle2.default, {\n          label: 'Auto Increment',\n          toggled: selectedField.autoIncrement,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('autoIncrement', value);\n          },\n          style: style.toggle\n        }),\n        database === 'MongoDB' && _react2.default.createElement(_Toggle2.default, {\n          label: 'Multiple Values',\n          toggled: selectedField.multipleValues && !selectedField.relationSelected,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('multipleValues', value);\n          },\n          style: style.toggle,\n          disabled: selectedField.relationSelected || selectedField.refBy.size > 0\n        }),\n        _react2.default.createElement(_Toggle2.default, {\n          label: database === 'MongoDB' ? 'Relation' : 'Foreign Key',\n          toggled: selectedField.relationSelected && !selectedField.multipleValues,\n          onToggle: function onToggle(event, value) {\n            return handleToggle('relationSelected', value);\n          },\n          style: style.toggle,\n          disabled: selectedField.multipleValues\n        }),\n        selectedField.relationSelected && !selectedField.multipleValues && _react2.default.createElement(\n          'span',\n          null,\n          _react2.default.createElement(\n            'div',\n            { className: 'relation-options' },\n            _react2.default.createElement(\n              'p',\n              null,\n              'Type:'\n            ),\n            _react2.default.createElement(\n              _DropDownMenu2.default,\n              {\n                value: selectedField.relation.tableIndex,\n                style: style.customWidth,\n                onChange: function onChange(e, i, value) {\n                  return handleChange({ name: 'relation.tableIndex', value: value });\n                }\n              },\n              renderRelatedTables()\n            )\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'relation-options' },\n            _react2.default.createElement(\n              'p',\n              null,\n              'Field:'\n            ),\n            _react2.default.createElement(\n              _DropDownMenu2.default,\n              {\n                value: selectedField.relation.fieldIndex,\n                style: style.customWidth,\n                onChange: function onChange(e, i, value) {\n                  return handleChange({ name: 'relation.fieldIndex', value: value });\n                }\n              },\n              renderRelatedFields()\n            )\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'relation-options' },\n            _react2.default.createElement(\n              'p',\n              null,\n              'RefType:'\n            ),\n            _react2.default.createElement(\n              _DropDownMenu2.default,\n              {\n                value: selectedField.relation.refType,\n                style: style.customWidth,\n                onChange: function onChange(e, i, value) {\n                  return handleChange({ name: 'relation.refType', value: value });\n                }\n              },\n              _react2.default.createElement(_MenuItem2.default, { value: 'one to one', primaryText: 'one to one' }),\n              _react2.default.createElement(_MenuItem2.default, { value: 'one to many', primaryText: 'one to many' }),\n              _react2.default.createElement(_MenuItem2.default, { value: 'many to one', primaryText: 'many to one' })\n            )\n          )\n        ),\n        _react2.default.createElement(_RaisedButton2.default, {\n          secondary: true,\n          label: selectedField.fieldNum > -1 ? 'Update Field' : 'Create Field',\n          type: 'submit',\n          onClick: submitOptions,\n          style: { marginTop: '25px' }\n        })\n      )\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TableOptions);\n\n//# sourceURL=webpack:///./components/schema/sidebar/table-options.jsx?");

/***/ }),

/***/ "./components/schema/table.jsx":
/*!*************************************!*\
  !*** ./components/schema/table.jsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _actions = __webpack_require__(/*! ../../actions/actions */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\nvar _field = __webpack_require__(/*! ./field.jsx */ \"./components/schema/field.jsx\");\n\nvar _field2 = _interopRequireDefault(_field);\n\n__webpack_require__(/*! boxicons */ \"../node_modules/boxicons/dist/boxicons.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar style = {\n  deleteStyle: {\n    minWidth: '25px',\n    position: 'absolute',\n    right: '0',\n    top: '0',\n    color: '#A1A1A1'\n  },\n  idFiled: {\n    width: '100%',\n    justifyContent: 'center',\n    color: 'white',\n    marginTop: '5px',\n    cursor: 'pointer'\n  }\n};\n\nvar mapStateToProps = function mapStateToProps(store) {\n  return {\n    tables: store.schema.tables,\n    database: store.schema.database\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    deleteTable: function deleteTable(tableIndex) {\n      return dispatch(actions.deleteTable(tableIndex));\n    },\n    addField: function addField(fieldName) {\n      return dispatch(actions.addFieldClicked(fieldName));\n    },\n    handleSelectedTable: function handleSelectedTable(tableIndex) {\n      return dispatch(actions.handleSelectedTable(tableIndex));\n    },\n    deletedFieldRelationUpdate: function deletedFieldRelationUpdate(indexes) {\n      return dispatch(actions.deletedFieldRelationUpdate(indexes));\n    }\n  };\n};\n\nvar Table = function Table(_ref) {\n  var tableIndex = _ref.tableIndex,\n      tableData = _ref.tableData,\n      database = _ref.database,\n      deleteTable = _ref.deleteTable,\n      addField = _ref.addField,\n      handleSelectedTable = _ref.handleSelectedTable;\n\n  var colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet', 'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen', 'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna', 'darkslategrey', 'goldenrod', 'deeppink'];\n\n  function renderFields() {\n    return Object.keys(tableData.fields).map(function (property) {\n      var field = tableData.fields[property];\n      var relation = field.relation.tableIndex;\n      var refBy = field.refBy;\n\n      // if MongoDB is selected, the ID field is no longer clickable\n      var buttonDisabled = false;\n      if (database === 'MongoDB' && tableData.fields[property].name === 'id') {\n        buttonDisabled = true;\n      }\n\n      // button color is clear unless there is a relation\n      var buttonColor = 'rgba(0,0,0,0)';\n      if (relation >= 0) buttonColor = colors[relation];\n\n      // create relation colors if field has relation\n      var refColor = 'rgba(0,0,0,0)';\n      if (refBy.size > 0) {\n        var transparent = ', transparent';\n        var gradient = 'linear-gradient(-45deg' + transparent.repeat(25);\n\n        refBy.forEach(function (ref) {\n          gradient += ', #363A42, ' + colors[ref.split('.')[0]];\n        });\n\n        gradient += ', #363A42, transparent, transparent)';\n        refColor = gradient;\n      }\n\n      return _react2.default.createElement(_field2.default, {\n        key: property,\n        buttonColor: buttonColor,\n        refColor: refColor,\n        tableIndex: tableIndex,\n        fieldIndex: property,\n        buttonDisabled: buttonDisabled,\n        field: field\n      });\n    });\n  }\n\n  return _react2.default.createElement(\n    'div',\n    { className: 'table' },\n    _react2.default.createElement(\n      'div',\n      null,\n      _react2.default.createElement(\n        'div',\n        { className: 'type' },\n        _react2.default.createElement(\n          'div',\n          {\n            backgroundColor: colors[tableData.tableID],\n            'data-value': tableIndex,\n            onClick: function onClick(event) {\n              return handleSelectedTable(event.currentTarget.getAttribute('data-value'));\n            },\n            className: 'tableButton'\n          },\n          _react2.default.createElement(\n            'h4',\n            null,\n            tableData.type\n          )\n        ),\n        _react2.default.createElement(_FlatButton2.default, {\n          className: 'delete-button',\n          icon: _react2.default.createElement('box-icon', { name: 'trash' }),\n          value: tableIndex,\n          onClick: function onClick(event) {\n            return deleteTable(event.currentTarget.value);\n          },\n          style: style.deleteStyle\n        })\n      )\n    ),\n    renderFields(),\n    _react2.default.createElement(\n      'div',\n      { onClick: function onClick() {\n          return addField(tableIndex);\n        }, className: 'addField' },\n      _react2.default.createElement('box-icon', {\n        name: 'plus-circle',\n        style: {\n          height: '20px',\n          width: '20px',\n          fill: '#A1A1A1',\n          marginRight: '6px',\n          marginTop: '4px'\n        }\n      }),\n      ' ',\n      _react2.default.createElement(\n        'span',\n        null,\n        ' Add Field'\n      )\n    )\n  );\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Table);\n\n//# sourceURL=webpack:///./components/schema/table.jsx?");

/***/ }),

/***/ "./components/welcome/team/team-button.jsx":
/*!*************************************************!*\
  !*** ./components/welcome/team/team-button.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FlatButton = __webpack_require__(/*! material-ui/FlatButton */ \"../node_modules/material-ui/FlatButton/index.js\");\n\nvar _FlatButton2 = _interopRequireDefault(_FlatButton);\n\nvar _Dialog = __webpack_require__(/*! material-ui/Dialog */ \"../node_modules/material-ui/Dialog/index.js\");\n\nvar _Dialog2 = _interopRequireDefault(_Dialog);\n\nvar _teamContainer = __webpack_require__(/*! ./team-container.jsx */ \"./components/welcome/team/team-container.jsx\");\n\nvar _teamContainer2 = _interopRequireDefault(_teamContainer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar TeamButton = function (_Component) {\n  _inherits(TeamButton, _Component);\n\n  function TeamButton(props) {\n    _classCallCheck(this, TeamButton);\n\n    var _this = _possibleConstructorReturn(this, (TeamButton.__proto__ || Object.getPrototypeOf(TeamButton)).call(this, props));\n\n    _this.state = {\n      showTeam: false\n    };\n    _this.handleToggleTeam = _this.handleToggleTeam.bind(_this);\n    return _this;\n  }\n\n  _createClass(TeamButton, [{\n    key: 'handleToggleTeam',\n    value: function handleToggleTeam() {\n      var showTeam = this.state.showTeam;\n\n      this.setState({ showTeam: !showTeam });\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var showTeam = this.state.showTeam;\n\n      return _react2.default.createElement(\n        'div',\n        {\n          style: {\n            display: 'block',\n            cursor: 'pointer'\n          }\n        },\n        _react2.default.createElement(\n          'small',\n          {\n            onClick: this.handleToggleTeam,\n            style: {\n              cursor: 'pointer',\n              textDecoration: 'underline'\n            }\n          },\n          'Meet the Team'\n        ),\n        _react2.default.createElement(\n          _Dialog2.default,\n          {\n            modal: true,\n            open: showTeam,\n            onClose: this.handleToggleTeam,\n            style: {\n              top: '4%'\n            }\n          },\n          _react2.default.createElement(_teamContainer2.default, null),\n          _react2.default.createElement(\n            'div',\n            {\n              style: {\n                textAlign: 'center'\n              } },\n            _react2.default.createElement(\n              _FlatButton2.default,\n              {\n                style: {\n                  padding: '0 1rem',\n                  textAlign: 'center',\n                  border: '2px solid #000',\n                  lineHeight: '1em',\n                  borderRadius: '25px'\n                },\n                onClick: this.handleToggleTeam\n              },\n              'Great! Go Back.'\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return TeamButton;\n}(_react.Component);\n\nexports.default = TeamButton;\n\n//# sourceURL=webpack:///./components/welcome/team/team-button.jsx?");

/***/ }),

/***/ "./components/welcome/team/team-container.jsx":
/*!****************************************************!*\
  !*** ./components/welcome/team/team-container.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _teamMember = __webpack_require__(/*! ./team-member.jsx */ \"./components/welcome/team/team-member.jsx\");\n\nvar _teamMember2 = _interopRequireDefault(_teamMember);\n\n__webpack_require__(/*! ./team.css */ \"./components/welcome/team/team.css\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar Team = function Team() {\n  return _react2.default.createElement(\n    'div',\n    { className: 'team-container' },\n    _react2.default.createElement(\n      'div',\n      { className: 'team' },\n      _react2.default.createElement(\n        'div',\n        { className: 'team-heading' },\n        _react2.default.createElement(\n          'h4',\n          null,\n          'Meet our Team'\n        ),\n        _react2.default.createElement(\n          'p',\n          null,\n          'GraphQL Blueprint is an open source project recently collaborated on by the following individuals. If this project is something you\\u2019d like to iterate on, reach out to any of us or checkout our ',\n          _react2.default.createElement(\n            'a',\n            { href: 'https://github.com/oslabs-beta/GraphQL-Blueprint' },\n            'GitHub repo'\n          ),\n          '!'\n        )\n      ),\n      _react2.default.createElement(\n        'div',\n        { className: 'row' },\n        _react2.default.createElement(_teamMember2.default, {\n          name: 'Dylan Li',\n          photo: './images/dylan-li.jpg',\n          GitHub: 'https://github.com/dylan2040',\n          LinkedIn: 'https://www.linkedin.com/in/dli107/'\n        }),\n        _react2.default.createElement(_teamMember2.default, {\n          name: 'Sean Yalda',\n          photo: './images/sean-yalda.jpg',\n          GitHub: 'https://github.com/Seanathon',\n          LinkedIn: 'https://www.linkedin.com/in/sean-yalda/'\n        }),\n        _react2.default.createElement(_teamMember2.default, {\n          name: 'Kevin Berlanga',\n          photo: './images/kevin-berlanga.jpg',\n          GitHub: 'https://github.com/kevinberlanga',\n          LinkedIn: 'https://www.linkedin.com/in/kevinberlanga/'\n        }),\n        _react2.default.createElement(_teamMember2.default, {\n          name: 'Ethan Yeh',\n          photo: './images/ethan-yeh.jpg',\n          GitHub: 'https://github.com/ehwyeh',\n          LinkedIn: 'https://www.linkedin.com/in/ethan-yeh-171391172/'\n        })\n      )\n    )\n  );\n};\n\n// styling\nexports.default = Team;\n\n//# sourceURL=webpack:///./components/welcome/team/team-container.jsx?");

/***/ }),

/***/ "./components/welcome/team/team-member.jsx":
/*!*************************************************!*\
  !*** ./components/welcome/team/team-member.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar TeamMember = function TeamMember(_ref) {\n  var name = _ref.name,\n      photo = _ref.photo,\n      GitHub = _ref.GitHub,\n      LinkedIn = _ref.LinkedIn;\n  return _react2.default.createElement(\n    \"div\",\n    { className: \"team-member\" },\n    _react2.default.createElement(\"img\", { className: \"team-member-photo\", src: photo, alt: name }),\n    _react2.default.createElement(\n      \"h4\",\n      null,\n      name\n    ),\n    _react2.default.createElement(\n      \"p\",\n      { id: \"team-title\" },\n      \"Software Engineer\"\n    ),\n    _react2.default.createElement(\n      \"div\",\n      { className: \"team-links\" },\n      _react2.default.createElement(\n        \"a\",\n        { href: GitHub },\n        _react2.default.createElement(\"box-icon\", { type: \"logo\", name: \"github\" })\n      ),\n      _react2.default.createElement(\n        \"a\",\n        { href: LinkedIn },\n        _react2.default.createElement(\"box-icon\", { name: \"linkedin-square\", type: \"logo\" })\n      )\n    )\n  );\n};\n\nexports.default = TeamMember;\n\n//# sourceURL=webpack:///./components/welcome/team/team-member.jsx?");

/***/ }),

/***/ "./components/welcome/team/team.css":
/*!******************************************!*\
  !*** ./components/welcome/team/team.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../../node_modules/css-loader!./team.css */ \"../node_modules/css-loader/index.js!./components/welcome/team/team.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../../node_modules/css-loader!./team.css */ \"../node_modules/css-loader/index.js!./components/welcome/team/team.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../../node_modules/css-loader!./team.css */ \"../node_modules/css-loader/index.js!./components/welcome/team/team.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/welcome/team/team.css?");

/***/ }),

/***/ "./components/welcome/welcome.css":
/*!****************************************!*\
  !*** ./components/welcome/welcome.css ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../../node_modules/css-loader!./welcome.css */ \"../node_modules/css-loader/index.js!./components/welcome/welcome.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ \"../node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../../node_modules/css-loader!./welcome.css */ \"../node_modules/css-loader/index.js!./components/welcome/welcome.css\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../../node_modules/css-loader!./welcome.css */ \"../node_modules/css-loader/index.js!./components/welcome/welcome.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./components/welcome/welcome.css?");

/***/ }),

/***/ "./components/welcome/welcome.jsx":
/*!****************************************!*\
  !*** ./components/welcome/welcome.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _Dialog = __webpack_require__(/*! material-ui/Dialog */ \"../node_modules/material-ui/Dialog/index.js\");\n\nvar _Dialog2 = _interopRequireDefault(_Dialog);\n\nvar _teamButton = __webpack_require__(/*! ./team/team-button.jsx */ \"./components/welcome/team/team-button.jsx\");\n\nvar _teamButton2 = _interopRequireDefault(_teamButton);\n\nvar _actions = __webpack_require__(/*! ../../actions/actions.js */ \"./actions/actions.js\");\n\nvar actions = _interopRequireWildcard(_actions);\n\n__webpack_require__(/*! ./welcome.css */ \"./components/welcome/welcome.css\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n// styling\n\n\nvar mapStatetoProps = function mapStatetoProps(store) {\n  return {\n    projectReset: store.schema.projectReset\n  };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n  return {\n    handleNewProject: function handleNewProject(reset) {\n      return dispatch(actions.handleNewProject(reset));\n    }\n  };\n};\n\nvar styles = {\n  border: '1px solid white',\n  width: '125px',\n  fontSize: '1.2em',\n  color: 'white'\n};\n\nvar Welcome = function (_React$Component) {\n  _inherits(Welcome, _React$Component);\n\n  function Welcome(props) {\n    _classCallCheck(this, Welcome);\n\n    var _this = _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).call(this, props));\n\n    _this.state = {\n      open: false\n    };\n    _this.handleClose = _this.handleClose.bind(_this);\n    _this.handleDatabaseClick = _this.handleDatabaseClick.bind(_this);\n    return _this;\n  }\n\n  _createClass(Welcome, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var _this2 = this;\n\n      setTimeout(function () {\n        _this2.setState({ open: true });\n      }, 750);\n    }\n  }, {\n    key: 'handleClose',\n    value: function handleClose() {\n      this.setState({ open: false });\n      this.props.handleNewProject(false);\n      console.log('clicked close');\n    }\n  }, {\n    key: 'handleDatabaseClick',\n    value: function handleDatabaseClick(database) {\n      this.props.handleNewProject(false);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this3 = this;\n\n      return _react2.default.createElement(\n        'div',\n        {\n          style: {\n            position: 'relative',\n            top: 0,\n            width: '100vw',\n            height: '100vh'\n          }\n        },\n        _react2.default.createElement(\n          _Dialog2.default,\n          {\n            modal: true,\n            open: this.props.projectReset,\n            onRequestClose: this.handleClose,\n            className: 'welcome-container',\n            paperClassName: 'welcome-box'\n          },\n          _react2.default.createElement('box-icon', {\n            name: 'x',\n            onClick: function onClick() {\n              return _this3.handleClose();\n            }\n          }),\n          _react2.default.createElement(\n            'div',\n            {\n              className: 'welcome-split'\n            },\n            _react2.default.createElement(\n              'div',\n              null,\n              _react2.default.createElement('img', { src: './images/logo-vertical.png', alt: 'GraphQL Blueprint' }),\n              _react2.default.createElement(\n                'ul',\n                null,\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'Last updated: July 14, 2021'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'An OSLabs Project'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  'MIT License'\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    _react2.default.createElement(\n                      'a',\n                      { href: '#' },\n                      'https://github.com/oslabs-beta/GraphQL-Blueprint/'\n                    )\n                  )\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'A collaborative effort by'\n                  ),\n                  'Dylan Li, Sean Yalda, Kevin Berlanga, Ethan Yeh',\n                  _react2.default.createElement(_teamButton2.default, null)\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'Thanks to the team at ',\n                    _react2.default.createElement(\n                      'a',\n                      { href: 'http://graphqldesigner.com' },\n                      'GraphQL Designer'\n                    ),\n                    ' for open sourcing their code in 2018 to be iterated upon. Without them, GraphQL Blueprint wouldn\\u2019t exist.'\n                  )\n                ),\n                _react2.default.createElement(\n                  'li',\n                  null,\n                  _react2.default.createElement(\n                    'small',\n                    null,\n                    'Powered by'\n                  ),\n                  _react2.default.createElement(\n                    'ul',\n                    { className: 'logos-container' },\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://graphql.org/' },\n                        _react2.default.createElement('img', { src: './images/graphql.png', alt: 'GraphQL' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://www.apollographql.com/docs/apollo-server/' },\n                        _react2.default.createElement('img', { src: './images/apollo.png', alt: 'Apollo Server' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://expressjs.com/' },\n                        _react2.default.createElement('img', { src: './images/express.png', alt: 'Express JS' })\n                      )\n                    ),\n                    _react2.default.createElement(\n                      'li',\n                      null,\n                      _react2.default.createElement(\n                        'a',\n                        { href: 'https://reactjs.org/' },\n                        _react2.default.createElement('img', { src: './images/react.png', alt: 'React JS' })\n                      )\n                    )\n                  )\n                )\n              )\n            ),\n            _react2.default.createElement(\n              'div',\n              null,\n              _react2.default.createElement('img', { src: './images/blueprint-texture.jpg', alt: 'Schema' })\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return Welcome;\n}(_react2.default.Component);\n\nexports.default = (0, _reactRedux.connect)(mapStatetoProps, mapDispatchToProps)(Welcome);\n\n//# sourceURL=webpack:///./components/welcome/welcome.jsx?");

/***/ }),

/***/ "./index.jsx":
/*!*******************!*\
  !*** ./index.jsx ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"../node_modules/react-dom/index.js\");\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _store = __webpack_require__(/*! ./store */ \"./store.js\");\n\nvar _store2 = _interopRequireDefault(_store);\n\nvar _MuiThemeProvider = __webpack_require__(/*! material-ui/styles/MuiThemeProvider */ \"../node_modules/material-ui/styles/MuiThemeProvider.js\");\n\nvar _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);\n\nvar _getMuiTheme = __webpack_require__(/*! material-ui/styles/getMuiTheme */ \"../node_modules/material-ui/styles/getMuiTheme.js\");\n\nvar _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);\n\nvar _app = __webpack_require__(/*! ./components/app.jsx */ \"./components/app.jsx\");\n\nvar _app2 = _interopRequireDefault(_app);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar muiTheme = (0, _getMuiTheme2.default)({\n  fontFamily: 'Ubuntu, sans-serif',\n  textField: {\n    floatingLabelColor: '#848393',\n    focusColor: '#194A9A'\n  },\n  toggle: {\n    thumbOnColor: '#194A9A',\n    thumbOffColor: '#FFFFFF',\n    trackOffColor: '#8C8C8C',\n    trackOnColor: '#BBCBE0'\n  },\n  palette: {\n    accent1Color: '#194A9A',\n    accent2Color: '#194A9A',\n    accent3Color: '#194A9A'\n  },\n  tabs: {\n    backgroundColor: '#194A9A',\n    textColor: '#FFF'\n  },\n  checkbox: {\n    boxColor: '#194A9A'\n  }\n});\n\n// Components\n\n\n// Material UI\n\n\nvar ThemedIndex = function ThemedIndex() {\n  return _react2.default.createElement(\n    _MuiThemeProvider2.default,\n    { muiTheme: muiTheme },\n    _react2.default.createElement(_app2.default, null)\n  );\n};\n\n(0, _reactDom.render)(_react2.default.createElement(\n  _reactRedux.Provider,\n  { store: _store2.default },\n  _react2.default.createElement(ThemedIndex, null)\n), document.getElementById('app'));\n\n//# sourceURL=webpack:///./index.jsx?");

/***/ }),

/***/ "./reducers/generalReducers.js":
/*!*************************************!*\
  !*** ./reducers/generalReducers.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _actionTypes = __webpack_require__(/*! ../actions/action-types */ \"./actions/action-types.js\");\n\nvar types = _interopRequireWildcard(_actionTypes);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nvar initialState = {\n  statusMessage: '',\n  modalProps: {},\n  open: false\n};\n\nvar generalReducers = function generalReducers() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;\n  var action = arguments[1];\n\n  switch (action.type) {\n    //  NOT USED\n    case types.MESSAGE:\n      return _extends({}, state);\n\n    // to show tree modal\n    case types.SHOW_MODAL:\n      return _extends({}, state, {\n        open: true\n      });\n\n    //  to hide tree modal\n    case types.HIDE_MODAL:\n      return _extends({}, state, {\n        open: false\n      });\n\n    //  used in APP prop, to reset \"snackbar\" state (displayed message) within Snackbar back to '' on close.\n    case types.HANDLE_SNACKBAR_UPDATE:\n      var newState = action.payload;\n\n      return _extends({}, state, {\n        statusMessage: newState\n      });\n\n    default:\n      return state;\n  }\n};\n\nexports.default = generalReducers;\n\n//# sourceURL=webpack:///./reducers/generalReducers.js?");

/***/ }),

/***/ "./reducers/index.js":
/*!***************************!*\
  !*** ./reducers/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _redux = __webpack_require__(/*! redux */ \"../node_modules/redux/es/redux.js\");\n\nvar _schemaReducers = __webpack_require__(/*! ./schemaReducers.js */ \"./reducers/schemaReducers.js\");\n\nvar _schemaReducers2 = _interopRequireDefault(_schemaReducers);\n\nvar _generalReducers = __webpack_require__(/*! ./generalReducers.js */ \"./reducers/generalReducers.js\");\n\nvar _generalReducers2 = _interopRequireDefault(_generalReducers);\n\nvar _multiSchemaReducer = __webpack_require__(/*! ./multiSchemaReducer.js */ \"./reducers/multiSchemaReducer.js\");\n\nvar _multiSchemaReducer2 = _interopRequireDefault(_multiSchemaReducer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// import queryReducers from './queryReducers.js';\n\n\n// combine reducers\n\n// import all reducers here\nvar combinedReducers = (0, _redux.combineReducers)({\n  general: _generalReducers2.default,\n  schema: _schemaReducers2.default,\n  multiSchema: _multiSchemaReducer2.default\n  // query: queryReducers,\n});\n\n// make the combined reducers available for import\nexports.default = combinedReducers;\n\n//# sourceURL=webpack:///./reducers/index.js?");

/***/ }),

/***/ "./reducers/multiSchemaReducer.js":
/*!****************************************!*\
  !*** ./reducers/multiSchemaReducer.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _actionTypes = __webpack_require__(/*! ../actions/action-types */ \"./actions/action-types.js\");\n\nvar types = _interopRequireWildcard(_actionTypes);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar initialState = {\n  id: '',\n  projectName: '',\n  //  maps to each database wireframe\n  databases: {},\n\n  // state that holds type of databases in order\n  databaseTypes: {},\n\n  // make sure to delete from schemaReducers, use search feature to ensure projectReset state is refactored\n  projectReset: true,\n  databaseIndex: 0,\n\n  selectedDatabase: {\n    //  name of database (i.e. eastcoast employees)\n    name: '',\n    // type of database (i.e. mongoDb)\n    database: '',\n    // take out projectRest\n    projectReset: true,\n    //  number of tables in selected DB\n    tableIndex: 0,\n    //  object holding each table state (i believe this is not needed)\n    //  pointless to access table state from this state object\n    //  tables: {},\n\n    //  ID for each database (necessary to refer to which database's state to inject from schema object)\n    databaseID: -1\n  }\n};\n\nvar reducers = function reducers() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;\n  var action = arguments[1];\n\n  var newDatabase = void 0;\n  var newDatabases = void 0;\n  var newState = void 0;\n  var databaseNum = void 0;\n  var newSelectedDatabase = void 0;\n  var newDatabaseTypes = void 0;\n\n  var databaseReset = {\n    name: '',\n    database: '',\n    // take out projectRest\n    projectReset: true,\n    tableIndex: 0,\n    databaseID: -1\n    // tables: {},\n  };\n\n  switch (action.type) {\n\n    //  reducer for updating \"databases\" state, after database schema is created add schema states as another object\n    //  (this reducer would be tied to a save button, where the action's payload would be store.schema state object)\n    //  this reducer is called in both Schema view and Database view\n    case types.SAVE_DATABASE_DATA_INPUT:\n\n      //  replace action.payload with getState() from redux-thunk (maybe not)\n      //  databaseState can be both selectedDB or schema state object (depends on what's being passed in as payload)\n      var databaseState = action.payload;\n      //  Saving a new database\n      if (action.payload.databaseID < 0) {\n        //  maybe 'field' here doesn't work\n        newDatabase = Object.assign({}, { 'tables': {} }, action.payload, { databaseID: state.databaseIndex });\n        newDatabases = Object.assign({}, state.databases, _defineProperty({}, state.databaseIndex, newDatabase));\n        newDatabaseTypes = Object.assign({}, state.databaseTypes, _defineProperty({}, state.databaseIndex, action.payload.database));\n        newState = Object.assign({}, state, {\n          databaseIndex: state.databaseIndex + 1,\n          databases: newDatabases,\n          databaseTypes: newDatabaseTypes\n        });\n      }\n      //  Updating a saved database\n      else {\n          newDatabase = Object.assign({}, action.payload);\n          newDatabases = Object.assign({}, state.databases, _defineProperty({}, action.payload.databaseID, newDatabase));\n          newState = Object.assign({}, state, {\n            databases: newDatabases\n          });\n        }\n\n      return newState;\n    // ----------------------------- Open Table Creator ---------------------------------//\n\n    //  used in \"create-db\" component, function dispatched to store when clicking the back button on the side bar\n    //  resets selectedDatabase state since conditional rendering on view makes a different side menu appear\n    case types.OPEN_DATABASE_CREATOR:\n      newSelectedDatabase = Object.assign({}, databaseReset);\n\n      return _extends({}, state, {\n        selectedDatabase: newSelectedDatabase\n      });\n\n    // ---------------------------- Change Database Name -----------------------------------//\n    //  payload = databaseName\n    case types.HANDLE_DATABASE_NAME_CHANGE:\n      newSelectedDatabase = Object.assign({}, state.selectedDatabase, { name: action.payload });\n\n      return _extends({}, state, {\n        selectedDatabase: newSelectedDatabase\n      });\n\n    case types.HANDLE_DATABASE_TYPE_CHANGE:\n      // console.log(action.payload);\n      newSelectedDatabase = Object.assign({}, state.selectedDatabase, { database: action.payload });\n\n      return _extends({}, state, {\n        selectedDatabase: newSelectedDatabase\n      });\n\n    //  add reducer for changing projectreset state (the one that triggers welcome dialog)\n    //  this is triggered when clicking \"add new db\"\n\n\n    //  reducer for when you click a database, updates \"selectedDatabase\" state\n    //  (payload would be the event.target.currentValue which should equal databaseID)\n\n\n    // -------------------------------- Select Database for Update -------------------------------//\n    case types.HANDLE_SELECTED_DATABASE:\n      databaseNum = Number(action.payload);\n      if (typeof databaseNum === 'number') {\n        newSelectedDatabase = Object.assign({}, state.databases[databaseNum]);\n      } else {\n        newSelectedDatabase = Object.assign({}, databaseReset);\n      }\n\n      return _extends({}, state, {\n        selectedDatabase: newSelectedDatabase\n\n        // -------------------------------- Delete Database -------------------------------// \n      });case types.DELETE_DATABASE:\n      databaseNum = Number(action.payload);\n\n      newDatabases = Object.assign({}, state.databases);\n      delete newDatabases[databaseNum];\n\n      var newDatabasesCopy = {};\n      var counter = 0;\n\n      for (var key in newDatabases) {\n        newDatabasesCopy[counter] = newDatabases[key];\n        counter++;\n      };\n\n      if (counter > 0) {\n        newSelectedDatabase = JSON.parse(JSON.stringify(state.databases[databaseNum - 1]));\n      } else {\n        newSelectedDatabase = Object.assign({}, databaseReset);\n      }\n      // must be refactored to update databaseIndex and to update databaseType state\n      return _extends({}, state, {\n        databases: newDatabasesCopy,\n        databaseIndex: counter,\n        selectedDatabase: newSelectedDatabase\n        // reducer from when you go from schemaView back to databse view. It saves the tables that user was working on in the schema state and the database state.\n\n      });case types.HANDLE_NEW_MULTI_PROJECT:\n      newState = Object.assign({}, initialState, { projectReset: action.payload });\n\n      //  used to mimic a click to ensure view is on schemaTab\n      document.getElementById('databasesTab').click();\n\n      return newState;\n\n    default:\n      return state;\n  }\n};\n\nexports.default = reducers;\n\n//# sourceURL=webpack:///./reducers/multiSchemaReducer.js?");

/***/ }),

/***/ "./reducers/schemaReducers.js":
/*!************************************!*\
  !*** ./reducers/schemaReducers.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _actionTypes = __webpack_require__(/*! ../actions/action-types */ \"./actions/action-types.js\");\n\nvar types = _interopRequireWildcard(_actionTypes);\n\nvar _localStorage = __webpack_require__(/*! ../actions/localStorage */ \"./actions/localStorage.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar initialState = {\n  //  New state added to name database purpose (i.e. books, authors, etc.)\n  name: '',\n\n  // this corresponds to type of DB chosen (i.e. mongoDb, PostgresQL, MySQL)\n  database: '',\n\n  // take out projectRest (this state is used to determine whehter \"welcome\" component pops up)\n  projectReset: true,\n\n  //  number of tables in the database\n  tableIndex: 0,\n\n  // New state added to refer to a selected database\n  databaseID: -1,\n\n  //  object holding each table state\n  tables: {},\n\n  selectedTable: {\n    //  table name\n    type: '',\n\n    //  object holding selectedTable fields\n    fields: {},\n\n    //  number of fields in the selected table\n    fieldsIndex: 1,\n\n    //  corresponds to which table ID is selected. -1 means none which brings up the default \"create table\" sidebar\n    tableID: -1\n  },\n  selectedField: {\n    //  name of field\n    name: '',\n    type: 'String',\n    primaryKey: false,\n    autoIncrement: false,\n    unique: false,\n    defaultValue: '',\n    required: false,\n    multipleValues: false,\n    relationSelected: false,\n    relation: {\n      tableIndex: -1,\n      fieldIndex: -1,\n      refType: ''\n    },\n    refBy: new Set(),\n    tableNum: -1,\n    fieldNum: -1\n  }\n};\n\nvar reducers = function reducers() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;\n  var action = arguments[1];\n\n  var newSelectedField = void 0;\n  var newSelectedTable = void 0;\n  var newTables = void 0;\n  var newTable = void 0;\n  var newState = void 0;\n  var tableNum = void 0;\n  var newTableData = void 0;\n  var newFields = void 0;\n  var refBy = void 0;\n  var selectedDatabase = void 0;\n\n  var tableReset = {\n    type: '',\n    fields: {},\n    fieldsIndex: 1,\n    tableID: -1\n  };\n\n  var fieldReset = {\n    name: '',\n    type: 'String',\n    primaryKey: false,\n    autoIncrement: false,\n    unique: false,\n    defaultValue: '',\n    required: false,\n    multipleValues: false,\n    relationSelected: false,\n    relation: {\n      tableIndex: -1,\n      fieldIndex: -1,\n      refType: ''\n    },\n    refBy: new Set(),\n    tableNum: -1,\n    fieldNum: -1\n  };\n  var relationReset = {\n    tableIndex: -1,\n    fieldIndex: -1,\n    refType: ''\n  };\n  var idDefault = {\n    name: 'id',\n    type: 'ID',\n    primaryKey: true,\n    autoIncrement: true,\n    unique: true,\n    defaultValue: '',\n    required: false,\n    multipleValues: false,\n    relationSelected: false,\n    relation: {\n      tableIndex: -1,\n      fieldIndex: -1,\n      refType: ''\n    },\n    refByIndex: 0,\n    refBy: new Set(),\n    tableNum: -1,\n    fieldNum: 0\n  };\n\n  //  if mongodb is selected, this state object is set up and utilized\n  var mongoTable = Object.assign({}, tableReset, {\n    fields: {\n      0: Object.assign({}, idDefault, { type: 'String' }, { tableNum: state.tableIndex })\n    }\n  });\n\n  switch (action.type) {\n\n    //  used in the \"Welcome\" component, takes in the chosen DB (mongo, mysql, or postgres) as payload, \n    //  and updates \"database\" (i.e. mongodb) and \"selectedTable\" (keep intiital state for sql or utilize mongodbtable)\n    // case 'CHOOSE_DATABASE':\n    case types.CHOOSE_DATABASE:\n      var database = action.payload;\n      // go to the schema tab if they start a new project\n      var selectedTable = state.selectedTable;\n      if (database === 'MongoDB') {\n        selectedTable = mongoTable;\n      }\n\n      return _extends({}, state, {\n        database: database,\n        selectedTable: selectedTable\n      });\n\n    // ----------------------------- Open Table Creator ---------------------------------//\n\n    //  used in \"TableOptions\" Component, function dispatched to store when clicking the back button on the side bar\n    case types.OPEN_TABLE_CREATOR:\n      //  fieldReset is a defined object. newlyselected F\n      newSelectedField = Object.assign({}, fieldReset);\n      if (state.database === 'MongoDB') {\n        newSelectedTable = Object.assign({}, mongoTable);\n      } else {\n        newSelectedTable = Object.assign({}, tableReset);\n      }\n\n      return _extends({}, state, {\n        selectedTable: newSelectedTable,\n        selectedField: newSelectedField\n      });\n\n    // ------------------------------- Add Or Update Table -------------------------------//\n    // Gets dispatched when user creates 'Create Table'\n    // If the selectedTable is reset (meaning that the tableID is equal to -1), then create\n    // a new table, add it to the tables object (array-like object of all tables), and create a\n    // new state with all these updates.   \n    case types.SAVE_TABLE_DATA_INPUT:\n      // SAVE A NEW TABLE\n      if (state.selectedTable.tableID < 0) {\n        newTable = Object.assign({}, state.selectedTable, { tableID: state.tableIndex });\n        newTables = Object.assign({}, state.tables, _defineProperty({}, state.tableIndex, newTable));\n        newState = Object.assign({}, state, {\n          tableIndex: state.tableIndex + 1,\n          tables: newTables,\n          selectedTable: state.database === 'MongoDB' ? mongoTable : tableReset\n        });\n\n        if (state.database === 'MongoDB') newState.selectedTable.fields[0].tableNum++;\n      }\n      // UPDATE A SAVED TABLE\n      else {\n          newTableData = Object.assign({}, state.selectedTable);\n          newTables = Object.assign({}, state.tables, _defineProperty({}, state.selectedTable.tableID, newTableData));\n          newState = Object.assign({}, state, {\n            tables: newTables,\n            selectedTable: state.database === 'MongoDB' ? mongoTable : tableReset\n          });\n        }\n\n      return newState;\n\n    // ---------------------------- Change Table Name -----------------------------------//\n    case types.HANDLE_TABLE_NAME_CHANGE:\n      newSelectedTable = Object.assign({}, state.selectedTable, { type: action.payload });\n\n      return _extends({}, state, {\n        selectedTable: newSelectedTable\n      });\n\n    // ----------------------------- Change Table ID ---------------------------------//\n    case types.HANDLE_TABLE_ID:\n      // If table previously had unique ID, remove it\n      if (!!state.selectedTable.fields[0]) {\n        newFields = Object.assign({}, state.selectedTable.fields);\n        delete newFields[0];\n        newSelectedTable = Object.assign({}, state.selectedTable, { fields: newFields });\n      }\n      // table did not previously have unique ID, add it\n      else {\n          newFields = Object.assign({}, state.selectedTable.fields, { 0: idDefault });\n          // new table is being created, give it an unique ID\n          if (state.selectedTable.tableID < 0) {\n            newFields[0].tableNum = state.tableIndex;\n          }\n          // table is being updated, and user clicked to add unique ID\n          else {\n              newFields[0].tableNum = state.selectedTable.tableID;\n            }\n          newSelectedTable = Object.assign({}, state.selectedTable, { fields: newFields });\n        }\n\n      return _extends({}, state, {\n        selectedTable: newSelectedTable\n      });\n\n    // -------------------------- Select Table For Update -----------------------------//\n    case types.HANDLE_SELECTED_TABLE:\n      tableNum = Number(action.payload);\n\n      if (typeof tableNum === 'number') {\n        newSelectedTable = Object.assign({}, state.tables[tableNum]);\n      } else {\n        newSelectedTable = Object.assign({}, tableReset);\n      }\n\n      return _extends({}, state, {\n        selectedTable: newSelectedTable,\n        selectedField: fieldReset\n      });\n\n    // -------------------------------- Delete Table -------------------------------//\n    case types.DELETE_TABLE:\n      tableNum = Number(action.payload);\n\n      // loop through table fields, and check for relations to delete in other fields\n      for (var _fieldNum in state.tables[tableNum].fields) {\n        // Deleted field has relation. Delete reference in related field\n        if (state.tables[tableNum].fields[_fieldNum].relationSelected) {\n          var relatedTableIndex = state.tables[tableNum].fields[_fieldNum].relation.tableIndex;\n          var relatedFieldIndex = state.tables[tableNum].fields[_fieldNum].relation.fieldIndex;\n          var relatedRefType = state.tables[tableNum].fields[_fieldNum].relation.refType;\n          if (relatedRefType === 'one to many') relatedRefType = 'many to one';else if (relatedRefType === 'many to one') relatedRefType = 'one to many';\n          var refInfo = tableNum + '.' + _fieldNum + '.' + relatedRefType;\n          var deletedRefBy = state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy;\n          deletedRefBy = new Set(deletedRefBy);\n          deletedRefBy.delete(refInfo);\n          state.tables[relatedTableIndex].fields[relatedFieldIndex].refBy = deletedRefBy;\n        }\n        // Deleted field is being referenced by another field. Delete other field's relation\n        refBy = state.tables[tableNum].fields[_fieldNum].refBy;\n        if (refBy.size > 0) {\n          refBy.forEach(function (value) {\n            var refInfo = value.split('.');\n            var relatedTableIndex = refInfo[0];\n            var relatedFieldIndex = refInfo[1];\n            var relatedField = state.tables[relatedTableIndex].fields[relatedFieldIndex];\n            relatedField.relationSelected = false;\n            relatedField.relation = relationReset;\n          });\n        }\n      }\n\n      newTables = Object.assign({}, state.tables);\n      delete newTables[tableNum];\n\n      if (state.database === 'MongoDB') {\n        newSelectedTable = Object.assign({}, mongoTable);\n      } else {\n        newSelectedTable = Object.assign({}, tableReset);\n      }\n\n      if (state.selectedField.tableNum === tableNum) {\n        return _extends({}, state, {\n          tables: newTables,\n          selectedTable: newSelectedTable,\n          selectedField: fieldReset\n        });\n      } else {\n        if (state.selectedTable.tableID === tableNum) {\n          return _extends({}, state, {\n            tables: newTables,\n            selectedTable: newSelectedTable\n          });\n        } else {\n          return _extends({}, state, {\n            tables: newTables\n          });\n        }\n      }\n\n    // ------------------------- Save Added or Updated Field ---------------------------//\n    case types.SAVE_FIELD_INPUT:\n      tableNum = state.selectedField.tableNum;\n      var newSelectedFieldName = state.selectedField.name;\n      var selectedFieldNum = state.selectedField.fieldNum;\n      var currentFieldIndex = state.tables[tableNum].fieldsIndex;\n\n      // variables for relations\n      var relationSelected = state.selectedField.relationSelected;\n      var newRelatedTableIndex = state.selectedField.relation.tableIndex;\n      var newRelatedFieldIndex = state.selectedField.relation.fieldIndex;\n      var newRelatedRefType = state.selectedField.relation.refType;\n      // flip the RefType so the related ref type is representative of itself.\n      if (newRelatedRefType === 'one to many') newRelatedRefType = 'many to one';else if (newRelatedRefType === 'many to one') newRelatedRefType = 'one to many';\n      // Below 2 variables depend on if field is new or being updated\n      var newRefInfo = void 0;\n      var relationPreviouslySelected = void 0;\n      if (selectedFieldNum < 0) {\n        relationPreviouslySelected = false;\n        newRefInfo = tableNum + '.' + currentFieldIndex + '.' + newRelatedRefType;\n      } else {\n        relationPreviouslySelected = state.tables[tableNum].fields[selectedFieldNum].relationSelected;\n        newRefInfo = tableNum + '.' + selectedFieldNum + '.' + newRelatedRefType;\n      }\n\n      // relation selected. New field, or updating field with no previous relation. Add relation\n      if ((selectedFieldNum < 0 || !relationPreviouslySelected) && relationSelected) {\n        refBy = state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy;\n        refBy = new Set(refBy);\n        refBy.add(newRefInfo);\n        state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy = refBy;\n      }\n      // field update, update relation to other field if changed\n      else if (selectedFieldNum >= 0) {\n          var prevRelatedTableIndex = state.tables[tableNum].fields[selectedFieldNum].relation.tableIndex;\n          var prevRelatedFieldIndex = state.tables[tableNum].fields[selectedFieldNum].relation.fieldIndex;\n          var newRefBy = void 0;\n          // if relation toggled off, then newRefBy is a empty Set.\n          if (newRelatedFieldIndex < 0) newRefBy = new Set();else newRefBy = state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy;\n\n          // relation changed, update the other fields (delete old if necessary, and add new)\n          if (!newRefBy.has(newRefInfo)) {\n            // A previous relation existed, delete it\n            if (relationPreviouslySelected) {\n              var prevRefBy = state.tables[prevRelatedTableIndex].fields[prevRelatedFieldIndex].refBy;\n              var prevRelatedRefType = state.tables[tableNum].fields[selectedFieldNum].relation.refType;\n              if (prevRelatedRefType === 'one to many') prevRelatedRefType = 'many to one';else if (prevRelatedRefType === 'many to one') prevRelatedRefType = 'one to many';\n              var prevRefInfo = tableNum + '.' + selectedFieldNum + '.' + prevRelatedRefType;\n              prevRefBy = new Set(prevRefBy);\n              prevRefBy.delete(prevRefInfo);\n              state.tables[prevRelatedTableIndex].fields[prevRelatedFieldIndex].refBy = prevRefBy;\n              newRefBy = new Set(prevRefBy);\n            }\n            // relation selected, add relation infomation to other field\n            if (relationSelected) {\n              newRefBy = new Set(newRefBy);\n              newRefBy.add(newRefInfo);\n              state.tables[newRelatedTableIndex].fields[newRelatedFieldIndex].refBy = newRefBy;\n            }\n          }\n        }\n\n      // Save new field\n      if (selectedFieldNum < 0) {\n        newTables = Object.assign({}, state.tables, _defineProperty({}, tableNum, Object.assign({}, state.tables[tableNum], { fieldsIndex: currentFieldIndex + 1 }, {\n          fields: Object.assign({}, state.tables[tableNum].fields, _defineProperty({}, currentFieldIndex, Object.assign({}, state.selectedField, { fieldNum: currentFieldIndex, name: newSelectedFieldName }))) })));\n\n        newSelectedField = Object.assign({}, fieldReset, { tableNum: tableNum });\n        return _extends({}, state, {\n          tables: newTables,\n          selectedField: newSelectedField\n        });\n      }\n\n      // Save updated field\n      else {\n          newTables = Object.assign({}, state.tables, _defineProperty({}, tableNum, Object.assign({}, state.tables[tableNum], { fieldsIndex: currentFieldIndex }, {\n            fields: Object.assign({}, state.tables[tableNum].fields, _defineProperty({}, selectedFieldNum, Object.assign({}, state.selectedField, { fieldNum: selectedFieldNum, name: newSelectedFieldName }))) })));\n\n          return _extends({}, state, {\n            tables: newTables,\n            selectedField: fieldReset\n          });\n        }\n\n    // ----------------------------- Delete Field -----------------------------------//\n    case types.DELETE_FIELD:\n      tableNum = Number(action.payload[0]);\n      var fieldNum = Number(action.payload[1]);\n\n      // Deleted field has relation. Delete reference in related field\n      if (state.tables[tableNum].fields[fieldNum].relationSelected) {\n        var _relatedTableIndex = state.tables[tableNum].fields[fieldNum].relation.tableIndex;\n        var _relatedFieldIndex = state.tables[tableNum].fields[fieldNum].relation.fieldIndex;\n        var _relatedRefType = state.tables[tableNum].fields[fieldNum].relation.refType;\n        if (_relatedRefType === 'one to many') _relatedRefType = 'many to one';else if (_relatedRefType === 'many to one') _relatedRefType = 'one to many';\n        var _refInfo = tableNum + '.' + fieldNum + '.' + _relatedRefType;\n        var _deletedRefBy = state.tables[_relatedTableIndex].fields[_relatedFieldIndex].refBy;\n        _deletedRefBy = new Set(_deletedRefBy);\n        _deletedRefBy.delete(_refInfo);\n        state.tables[_relatedTableIndex].fields[_relatedFieldIndex].refBy = _deletedRefBy;\n      }\n\n      // Deleted field is being referenced by another field. Delete other field's relation\n      refBy = state.tables[tableNum].fields[fieldNum].refBy;\n      if (refBy.size > 0) {\n        refBy.forEach(function (value) {\n          var refInfo = value.split('.');\n          var relatedTableIndex = refInfo[0];\n          var relatedFieldIndex = refInfo[1];\n          var relatedField = state.tables[relatedTableIndex].fields[relatedFieldIndex];\n          relatedField.relationSelected = false;\n          relatedField.relation = relationReset;\n        });\n      }\n\n      newTable = Object.assign({}, state.tables[tableNum]);\n      delete newTable.fields[fieldNum];\n      newTables = Object.assign({}, state.tables, _defineProperty({}, tableNum, newTable));\n      newSelectedField = state.selectedField;\n\n      // if you are deleting the field currently selected, reset selectedField\n      if (state.selectedField.tableNum === tableNum && state.selectedField.fieldNum === fieldNum) {\n        newSelectedField = fieldReset;\n      }\n\n      return _extends({}, state, {\n        tables: newTables,\n        selectedField: newSelectedField\n      });\n\n    // -------------------------------- HANDLE FIELD UPDATE ---------------------------------//\n    // Gets dispatched when you click on add field; Used in table-options.jsx. Field gets passed\n    // in the payload.      \n    // updates selected field on each data entry\n    case types.HANDLE_FIELDS_UPDATE:\n      // parse if relations field is selected\n      if (action.payload.name.indexOf('.') !== -1) {\n        var rel = action.payload.name.split('.'); // rel[0] is 'relation' and rel[1] is either 'tableIndex', 'fieldIndex', or 'refType'\n        newSelectedField = Object.assign({}, state.selectedField, _defineProperty({}, rel[0], Object.assign({}, state.selectedField[rel[0]], _defineProperty({}, rel[1], action.payload.value))));\n      } else {\n        if (action.payload.value === 'true') action.payload.value = true;\n        if (action.payload.value === 'false') action.payload.value = false;\n        newSelectedField = Object.assign({}, state.selectedField, _defineProperty({}, action.payload.name, action.payload.value));\n        // user toggled relation off\n        if (action.payload.name === 'relationSelected' && action.payload.value === false) {\n          newSelectedField.relation = Object.assign({}, relationReset);\n        }\n      }\n      return _extends({}, state, {\n        selectedField: newSelectedField\n      });\n\n    // --------------------------- FIELD SELECTED FOR UPDATE -------------------------------//\n\n    // when a user selects a field, it changes selectedField to be an object with the necessary\n    // info from the selected table and field. this function is in the \"field\" component\n    case types.HANDLE_FIELDS_SELECT:\n      // location object contains the table index at [0], and field at [1]\n      var location = action.payload.location.split(' ');\n\n      newSelectedField = Object.assign({}, state.tables[Number(location[0])].fields[Number(location[1])]);\n\n      if (state.database === 'MongoDB') {\n        newSelectedTable = Object.assign({}, mongoTable);\n      } else {\n        newSelectedTable = Object.assign({}, tableReset);\n      }\n\n      return _extends({}, state, {\n        selectedTable: newSelectedTable,\n        selectedField: newSelectedField\n      });\n\n    // ----------------------------- OPEN FIELD CREATOR ----------------------------------//\n    // Gets dispatched when user clicks 'Add Field'; Gets dispatched in table.jsx\n    // Add Field in Table was clicked to display field options. This reducer creates a new \n    // field and updates the tableNum to reflect the proper tableIndex to which the field\n    // will belong to.\n    case types.ADD_FIELD_CLICKED:\n      newSelectedField = fieldReset;\n      newSelectedField.tableNum = Number(action.payload);\n\n      return _extends({}, state, {\n        selectedField: newSelectedField,\n        selectedTable: tableReset\n      });\n\n    // ---------------------------------- New Project -------------------------------------//\n\n    // User clicked \"New Project\" button or at init (function is in welcome component)\n    // used to change \"projectReset\" state (if state is true, the \"welcome\" component is shown )\n    case types.HANDLE_NEW_PROJECT:\n      newState = Object.assign({}, initialState, { projectReset: action.payload });\n\n      //  used to mimic a click to ensure view is on schemaTab\n      document.getElementById('databasesTab').click();\n\n      return newState;\n\n    // ---------------------------------- INJECT DATABASE -------------------------------------//\n    case types.HANDLE_INJECT_DATABASE:\n\n      selectedDatabase = action.payload;\n      newState = Object.assign({}, state, selectedDatabase, { projectReset: false });\n\n      return newState;\n\n    default:\n      return state;\n  }\n};\n\nexports.default = reducers;\n\n//# sourceURL=webpack:///./reducers/schemaReducers.js?");

/***/ }),

/***/ "./store.js":
/*!******************!*\
  !*** ./store.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _redux = __webpack_require__(/*! redux */ \"../node_modules/redux/es/redux.js\");\n\nvar _reduxDevtoolsExtension = __webpack_require__(/*! redux-devtools-extension */ \"../node_modules/redux-devtools-extension/index.js\");\n\nvar _index = __webpack_require__(/*! ./reducers/index.js */ \"./reducers/index.js\");\n\nvar _index2 = _interopRequireDefault(_index);\n\nvar _localStorage = __webpack_require__(/*! ./actions/localStorage */ \"./actions/localStorage.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// we are adding composeWithDevTools here to get easy access to the Redux dev tools\nvar persistedState = (0, _localStorage.loadState)();\n\nvar store = (0, _redux.createStore)(_index2.default, persistedState, (0, _reduxDevtoolsExtension.composeWithDevTools)());\n\n// Save state anytime store state changes. Invokes every time there's a change \nstore.subscribe(function () {\n  (0, _localStorage.saveState)(store.getState());\n});\nexports.default = store;\n\n//# sourceURL=webpack:///./store.js?");

/***/ })

/******/ });