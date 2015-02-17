
// kPromDef.js

var kPromDef = (function() {
	var Promise = function () {
		var dflt = function(d) {
			d = (d || true);
			return d;
		};
		return {
			status: 'pending',
			error: null,
			posCBKs: [],
			negCBKs: [],
			then: function (posCBK, negCBK) {
				var defer = new Deferred();
				posCBK = (!posCBK)?dflt:posCBK;
				negCBK = (!negCBK)?dflt:negCBK;
				this.posCBKs.push({
					func: posCBK,
					deferred: defer
				});				
				this.negCBKs.push({
					func: negCBK,
					deferred: defer
				});
				if (status === 'resolved') {
					this.execAction({
						func: posCBK,
						deferred: defer
					}, this.data);
				}
				else if (status === 'rejected') {
					this.execAction({
						func: negCBK,
						deferred: defer
					}, this.error);
				}
				return defer.promise;
			},
			execAction: function (callbackData, result) {
				wdw.setTimeout(function () {
					var res = callbackData.func(result);
					if (res instanceof Promise) {
						callbackData.deferred.bind(res);
					}
					else {
						callbackData.deferred.resolve(res);
					}
				}, 0);
			};
		 };
	 },
	 Deferred = function () {
		return {
			promise: new Promise(),
			resolve: function (data) {
				var pms = this.promise;
				pms.data = data;
				pms.status = 'resolved';
				if (pms.posCBKs) {
					pms.posCBKs.forEach(function (dta) {
						pms.execAction(dta, data);
					});
				}
			},
			reject: function (err) {
				var pms = this.promise;
				pms.error = err;
				pms.status = 'rejected';
				if (pms.negCBks) {
					pms.negCBKs.forEach(function (dta) {
						pms.execAction(dta, err);
					});
				}
			},
			bind: function (promise) {
				var slf = this;
				promise.then(function (dta) {
					slf.resolve(dta);
				}, function (err) {
					slf.reject(err);
				});
			};
		};
	};
	return {
		Promise: Promise,
		Deferred: Deferred
	}
}());

