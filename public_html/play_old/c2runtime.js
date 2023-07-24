
var cr = {};
cr.plugins_ = {};
cr.behaviors = {};
if (typeof Object.getPrototypeOf !== "function")
{
	if (typeof "test".__proto__ === "object")
	{
		Object.getPrototypeOf = function(object) {
			return object.__proto__;
		};
	}
	else
	{
		Object.getPrototypeOf = function(object) {
			return object.constructor.prototype;
		};
	}
}
(function(){
	cr.logexport = function (msg)
	{
		if (window.console && window.console.log)
			window.console.log(msg);
	};
	cr.logerror = function (msg)
	{
		if (window.console && window.console.error)
			window.console.error(msg);
	};
	cr.seal = function(x)
	{
		return x;
	};
	cr.freeze = function(x)
	{
		return x;
	};
	cr.is_undefined = function (x)
	{
		return typeof x === "undefined";
	};
	cr.is_number = function (x)
	{
		return typeof x === "number";
	};
	cr.is_string = function (x)
	{
		return typeof x === "string";
	};
	cr.isPOT = function (x)
	{
		return x > 0 && ((x - 1) & x) === 0;
	};
	cr.nextHighestPowerOfTwo = function(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	cr.abs = function (x)
	{
		return (x < 0 ? -x : x);
	};
	cr.max = function (a, b)
	{
		return (a > b ? a : b);
	};
	cr.min = function (a, b)
	{
		return (a < b ? a : b);
	};
	cr.PI = Math.PI;
	cr.round = function (x)
	{
		return (x + 0.5) | 0;
	};
	cr.floor = function (x)
	{
		if (x >= 0)
			return x | 0;
		else
			return (x | 0) - 1;		// correctly round down when negative
	};
	cr.ceil = function (x)
	{
		var f = x | 0;
		return (f === x ? f : f + 1);
	};
	function Vector2(x, y)
	{
		this.x = x;
		this.y = y;
		cr.seal(this);
	};
	Vector2.prototype.offset = function (px, py)
	{
		this.x += px;
		this.y += py;
		return this;
	};
	Vector2.prototype.mul = function (px, py)
	{
		this.x *= px;
		this.y *= py;
		return this;
	};
	cr.vector2 = Vector2;
	cr.segments_intersect = function(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
	{
		var max_ax, min_ax, max_ay, min_ay, max_bx, min_bx, max_by, min_by;
		if (a1x < a2x)
		{
			min_ax = a1x;
			max_ax = a2x;
		}
		else
		{
			min_ax = a2x;
			max_ax = a1x;
		}
		if (b1x < b2x)
		{
			min_bx = b1x;
			max_bx = b2x;
		}
		else
		{
			min_bx = b2x;
			max_bx = b1x;
		}
		if (max_ax < min_bx || min_ax > max_bx)
			return false;
		if (a1y < a2y)
		{
			min_ay = a1y;
			max_ay = a2y;
		}
		else
		{
			min_ay = a2y;
			max_ay = a1y;
		}
		if (b1y < b2y)
		{
			min_by = b1y;
			max_by = b2y;
		}
		else
		{
			min_by = b2y;
			max_by = b1y;
		}
		if (max_ay < min_by || min_ay > max_by)
			return false;
		var dpx = b1x - a1x + b2x - a2x;
		var dpy = b1y - a1y + b2y - a2y;
		var qax = a2x - a1x;
		var qay = a2y - a1y;
		var qbx = b2x - b1x;
		var qby = b2y - b1y;
		var d = cr.abs(qay * qbx - qby * qax);
		var la = qbx * dpy - qby * dpx;
		if (cr.abs(la) > d)
			return false;
		var lb = qax * dpy - qay * dpx;
		return cr.abs(lb) <= d;
	};
	function Rect(left, top, right, bottom)
	{
		this.set(left, top, right, bottom);
		cr.seal(this);
	};
	Rect.prototype.set = function (left, top, right, bottom)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	};
	Rect.prototype.copy = function (r)
	{
		this.left = r.left;
		this.top = r.top;
		this.right = r.right;
		this.bottom = r.bottom;
	};
	Rect.prototype.width = function ()
	{
		return this.right - this.left;
	};
	Rect.prototype.height = function ()
	{
		return this.bottom - this.top;
	};
	Rect.prototype.offset = function (px, py)
	{
		this.left += px;
		this.top += py;
		this.right += px;
		this.bottom += py;
		return this;
	};
	Rect.prototype.normalize = function ()
	{
		var temp = 0;
		if (this.left > this.right)
		{
			temp = this.left;
			this.left = this.right;
			this.right = temp;
		}
		if (this.top > this.bottom)
		{
			temp = this.top;
			this.top = this.bottom;
			this.bottom = temp;
		}
	};
	Rect.prototype.intersects_rect = function (rc)
	{
		return !(rc.right < this.left || rc.bottom < this.top || rc.left > this.right || rc.top > this.bottom);
	};
	Rect.prototype.intersects_rect_off = function (rc, ox, oy)
	{
		return !(rc.right + ox < this.left || rc.bottom + oy < this.top || rc.left + ox > this.right || rc.top + oy > this.bottom);
	};
	Rect.prototype.contains_pt = function (x, y)
	{
		return (x >= this.left && x <= this.right) && (y >= this.top && y <= this.bottom);
	};
	Rect.prototype.equals = function (r)
	{
		return this.left === r.left && this.top === r.top && this.right === r.right && this.bottom === r.bottom;
	};
	cr.rect = Rect;
	function Quad()
	{
		this.tlx = 0;
		this.tly = 0;
		this.trx = 0;
		this.try_ = 0;	// is a keyword otherwise!
		this.brx = 0;
		this.bry = 0;
		this.blx = 0;
		this.bly = 0;
		cr.seal(this);
	};
	Quad.prototype.set_from_rect = function (rc)
	{
		this.tlx = rc.left;
		this.tly = rc.top;
		this.trx = rc.right;
		this.try_ = rc.top;
		this.brx = rc.right;
		this.bry = rc.bottom;
		this.blx = rc.left;
		this.bly = rc.bottom;
	};
	Quad.prototype.set_from_rotated_rect = function (rc, a)
	{
		if (a === 0)
		{
			this.set_from_rect(rc);
		}
		else
		{
			var sin_a = Math.sin(a);
			var cos_a = Math.cos(a);
			var left_sin_a = rc.left * sin_a;
			var top_sin_a = rc.top * sin_a;
			var right_sin_a = rc.right * sin_a;
			var bottom_sin_a = rc.bottom * sin_a;
			var left_cos_a = rc.left * cos_a;
			var top_cos_a = rc.top * cos_a;
			var right_cos_a = rc.right * cos_a;
			var bottom_cos_a = rc.bottom * cos_a;
			this.tlx = left_cos_a - top_sin_a;
			this.tly = top_cos_a + left_sin_a;
			this.trx = right_cos_a - top_sin_a;
			this.try_ = top_cos_a + right_sin_a;
			this.brx = right_cos_a - bottom_sin_a;
			this.bry = bottom_cos_a + right_sin_a;
			this.blx = left_cos_a - bottom_sin_a;
			this.bly = bottom_cos_a + left_sin_a;
		}
	};
	Quad.prototype.offset = function (px, py)
	{
		this.tlx += px;
		this.tly += py;
		this.trx += px;
		this.try_ += py;
		this.brx += px;
		this.bry += py;
		this.blx += px;
		this.bly += py;
		return this;
	};
	var minresult = 0;
	var maxresult = 0;
	function minmax4(a, b, c, d)
	{
		if (a < b)
		{
			if (c < d)
			{
				if (a < c)
					minresult = a;
				else
					minresult = c;
				if (b > d)
					maxresult = b;
				else
					maxresult = d;
			}
			else
			{
				if (a < d)
					minresult = a;
				else
					minresult = d;
				if (b > c)
					maxresult = b;
				else
					maxresult = c;
			}
		}
		else
		{
			if (c < d)
			{
				if (b < c)
					minresult = b;
				else
					minresult = c;
				if (a > d)
					maxresult = a;
				else
					maxresult = d;
			}
			else
			{
				if (b < d)
					minresult = b;
				else
					minresult = d;
				if (a > c)
					maxresult = a;
				else
					maxresult = c;
			}
		}
	};
	Quad.prototype.bounding_box = function (rc)
	{
		minmax4(this.tlx, this.trx, this.brx, this.blx);
		rc.left = minresult;
		rc.right = maxresult;
		minmax4(this.tly, this.try_, this.bry, this.bly);
		rc.top = minresult;
		rc.bottom = maxresult;
	};
	Quad.prototype.contains_pt = function (x, y)
	{
		var tlx = this.tlx;
		var tly = this.tly;
		var v0x = this.trx - tlx;
		var v0y = this.try_ - tly;
		var v1x = this.brx - tlx;
		var v1y = this.bry - tly;
		var v2x = x - tlx;
		var v2y = y - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		var dot11 = v1x * v1x + v1y * v1y
		var dot12 = v1x * v2x + v1y * v2y
		var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		if ((u >= 0.0) && (v > 0.0) && (u + v < 1))
			return true;
		v0x = this.blx - tlx;
		v0y = this.bly - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return (u >= 0.0) && (v > 0.0) && (u + v < 1);
	};
	Quad.prototype.at = function (i, xory)
	{
		if (xory)
		{
			switch (i)
			{
				case 0: return this.tlx;
				case 1: return this.trx;
				case 2: return this.brx;
				case 3: return this.blx;
				case 4: return this.tlx;
				default: return this.tlx;
			}
		}
		else
		{
			switch (i)
			{
				case 0: return this.tly;
				case 1: return this.try_;
				case 2: return this.bry;
				case 3: return this.bly;
				case 4: return this.tly;
				default: return this.tly;
			}
		}
	};
	Quad.prototype.midX = function ()
	{
		return (this.tlx + this.trx  + this.brx + this.blx) / 4;
	};
	Quad.prototype.midY = function ()
	{
		return (this.tly + this.try_ + this.bry + this.bly) / 4;
	};
	Quad.prototype.intersects_segment = function (x1, y1, x2, y2)
	{
		if (this.contains_pt(x1, y1) || this.contains_pt(x2, y2))
			return true;
		var a1x, a1y, a2x, a2y;
		var i;
		for (i = 0; i < 4; i++)
		{
			a1x = this.at(i, true);
			a1y = this.at(i, false);
			a2x = this.at(i + 1, true);
			a2y = this.at(i + 1, false);
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	Quad.prototype.intersects_quad = function (rhs)
	{
		var midx = rhs.midX();
		var midy = rhs.midY();
		if (this.contains_pt(midx, midy))
			return true;
		midx = this.midX();
		midy = this.midY();
		if (rhs.contains_pt(midx, midy))
			return true;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		var i, j;
		for (i = 0; i < 4; i++)
		{
			for (j = 0; j < 4; j++)
			{
				a1x = this.at(i, true);
				a1y = this.at(i, false);
				a2x = this.at(i + 1, true);
				a2y = this.at(i + 1, false);
				b1x = rhs.at(j, true);
				b1y = rhs.at(j, false);
				b2x = rhs.at(j + 1, true);
				b2y = rhs.at(j + 1, false);
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	cr.quad = Quad;
	cr.RGB = function (red, green, blue)
	{
		return Math.max(Math.min(red, 255), 0)
			 | (Math.max(Math.min(green, 255), 0) << 8)
			 | (Math.max(Math.min(blue, 255), 0) << 16);
	};
	cr.GetRValue = function (rgb)
	{
		return rgb & 0xFF;
	};
	cr.GetGValue = function (rgb)
	{
		return (rgb & 0xFF00) >> 8;
	};
	cr.GetBValue = function (rgb)
	{
		return (rgb & 0xFF0000) >> 16;
	};
	cr.shallowCopy = function (a, b, allowOverwrite)
	{
		var attr;
		for (attr in b)
		{
			if (b.hasOwnProperty(attr))
			{
;
				a[attr] = b[attr];
			}
		}
		return a;
	};
	cr.arrayRemove = function (arr, index)
	{
		var i, len;
		index = cr.floor(index);
		if (index < 0 || index >= arr.length)
			return;							// index out of bounds
		for (i = index, len = arr.length - 1; i < len; i++)
			arr[i] = arr[i + 1];
		cr.truncateArray(arr, len);
	};
	cr.truncateArray = function (arr, index)
	{
		arr.length = index;
	};
	cr.clearArray = function (arr)
	{
		cr.truncateArray(arr, 0);
	};
	cr.shallowAssignArray = function (dest, src)
	{
		cr.clearArray(dest);
		var i, len;
		for (i = 0, len = src.length; i < len; ++i)
			dest[i] = src[i];
	};
	cr.appendArray = function (a, b)
	{
		a.push.apply(a, b);
	};
	cr.fastIndexOf = function (arr, item)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			if (arr[i] === item)
				return i;
		}
		return -1;
	};
	cr.arrayFindRemove = function (arr, item)
	{
		var index = cr.fastIndexOf(arr, item);
		if (index !== -1)
			cr.arrayRemove(arr, index);
	};
	cr.clamp = function(x, a, b)
	{
		if (x < a)
			return a;
		else if (x > b)
			return b;
		else
			return x;
	};
	cr.to_radians = function(x)
	{
		return x / (180.0 / cr.PI);
	};
	cr.to_degrees = function(x)
	{
		return x * (180.0 / cr.PI);
	};
	cr.clamp_angle_degrees = function (a)
	{
		a %= 360;       // now in (-360, 360) range
		if (a < 0)
			a += 360;   // now in [0, 360) range
		return a;
	};
	cr.clamp_angle = function (a)
	{
		a %= 2 * cr.PI;       // now in (-2pi, 2pi) range
		if (a < 0)
			a += 2 * cr.PI;   // now in [0, 2pi) range
		return a;
	};
	cr.to_clamped_degrees = function (x)
	{
		return cr.clamp_angle_degrees(cr.to_degrees(x));
	};
	cr.to_clamped_radians = function (x)
	{
		return cr.clamp_angle(cr.to_radians(x));
	};
	cr.angleTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.atan2(dy, dx);
	};
	cr.angleDiff = function (a1, a2)
	{
		if (a1 === a2)
			return 0;
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		var n = s1 * s2 + c1 * c2;
		if (n >= 1)
			return 0;
		if (n <= -1)
			return cr.PI;
		return Math.acos(n);
	};
	cr.angleRotate = function (start, end, step)
	{
		var ss = Math.sin(start);
		var cs = Math.cos(start);
		var se = Math.sin(end);
		var ce = Math.cos(end);
		if (Math.acos(ss * se + cs * ce) > step)
		{
			if (cs * se - ss * ce > 0)
				return cr.clamp_angle(start + step);
			else
				return cr.clamp_angle(start - step);
		}
		else
			return cr.clamp_angle(end);
	};
	cr.angleClockwise = function (a1, a2)
	{
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		return c1 * s2 - s1 * c2 <= 0;
	};
	cr.rotatePtAround = function (px, py, a, ox, oy, getx)
	{
		if (a === 0)
			return getx ? px : py;
		var sin_a = Math.sin(a);
		var cos_a = Math.cos(a);
		px -= ox;
		py -= oy;
		var left_sin_a = px * sin_a;
		var top_sin_a = py * sin_a;
		var left_cos_a = px * cos_a;
		var top_cos_a = py * cos_a;
		px = left_cos_a - top_sin_a;
		py = top_cos_a + left_sin_a;
		px += ox;
		py += oy;
		return getx ? px : py;
	}
	cr.distanceTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.sqrt(dx*dx + dy*dy);
	};
	cr.xor = function (x, y)
	{
		return !x !== !y;
	};
	cr.lerp = function (a, b, x)
	{
		return a + (b - a) * x;
	};
	cr.unlerp = function (a, b, c)
	{
		if (a === b)
			return 0;		// avoid divide by 0
		return (c - a) / (b - a);
	};
	cr.anglelerp = function (a, b, x)
	{
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			return a + diff * x;
		}
		else
		{
			return a - diff * x;
		}
	};
	cr.qarp = function (a, b, c, x)
	{
		return cr.lerp(cr.lerp(a, b, x), cr.lerp(b, c, x), x);
	};
	cr.cubic = function (a, b, c, d, x)
	{
		return cr.lerp(cr.qarp(a, b, c, x), cr.qarp(b, c, d, x), x);
	};
	cr.cosp = function (a, b, x)
	{
		return (a + b + (a - b) * Math.cos(x * Math.PI)) / 2;
	};
	cr.hasAnyOwnProperty = function (o)
	{
		var p;
		for (p in o)
		{
			if (o.hasOwnProperty(p))
				return true;
		}
		return false;
	};
	cr.wipe = function (obj)
	{
		var p;
		for (p in obj)
		{
			if (obj.hasOwnProperty(p))
				delete obj[p];
		}
	};
	var startup_time = +(new Date());
	cr.performance_now = function()
	{
		if (typeof window["performance"] !== "undefined")
		{
			var winperf = window["performance"];
			if (typeof winperf.now !== "undefined")
				return winperf.now();
			else if (typeof winperf["webkitNow"] !== "undefined")
				return winperf["webkitNow"]();
			else if (typeof winperf["mozNow"] !== "undefined")
				return winperf["mozNow"]();
			else if (typeof winperf["msNow"] !== "undefined")
				return winperf["msNow"]();
		}
		return Date.now() - startup_time;
	};
	var isChrome = false;
	var isSafari = false;
	var isiOS = false;
	var isEjecta = false;
	if (typeof window !== "undefined")		// not c2 editor
	{
		isChrome = /chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent);
		isSafari = !isChrome && /safari/i.test(navigator.userAgent);
		isiOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);
		isEjecta = window["c2ejecta"];
	}
	var supports_set = ((!isSafari && !isEjecta && !isiOS) && (typeof Set !== "undefined" && typeof Set.prototype["forEach"] !== "undefined"));
	function ObjectSet_()
	{
		this.s = null;
		this.items = null;			// lazy allocated (hopefully results in better GC performance)
		this.item_count = 0;
		if (supports_set)
		{
			this.s = new Set();
		}
		this.values_cache = [];
		this.cache_valid = true;
		cr.seal(this);
	};
	ObjectSet_.prototype.contains = function (x)
	{
		if (this.isEmpty())
			return false;
		if (supports_set)
			return this.s["has"](x);
		else
			return (this.items && this.items.hasOwnProperty(x));
	};
	ObjectSet_.prototype.add = function (x)
	{
		if (supports_set)
		{
			if (!this.s["has"](x))
			{
				this.s["add"](x);
				this.cache_valid = false;
			}
		}
		else
		{
			var str = x.toString();
			var items = this.items;
			if (!items)
			{
				this.items = {};
				this.items[str] = x;
				this.item_count = 1;
				this.cache_valid = false;
			}
			else if (!items.hasOwnProperty(str))
			{
				items[str] = x;
				this.item_count++;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.remove = function (x)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			if (this.s["has"](x))
			{
				this.s["delete"](x);
				this.cache_valid = false;
			}
		}
		else if (this.items)
		{
			var str = x.toString();
			var items = this.items;
			if (items.hasOwnProperty(str))
			{
				delete items[str];
				this.item_count--;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.clear = function (/*wipe_*/)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			this.s["clear"]();			// best!
		}
		else
		{
				this.items = null;		// creates garbage; will lazy allocate on next add()
			this.item_count = 0;
		}
		cr.clearArray(this.values_cache);
		this.cache_valid = true;
	};
	ObjectSet_.prototype.isEmpty = function ()
	{
		return this.count() === 0;
	};
	ObjectSet_.prototype.count = function ()
	{
		if (supports_set)
			return this.s["size"];
		else
			return this.item_count;
	};
	var current_arr = null;
	var current_index = 0;
	function set_append_to_arr(x)
	{
		current_arr[current_index++] = x;
	};
	ObjectSet_.prototype.update_cache = function ()
	{
		if (this.cache_valid)
			return;
		if (supports_set)
		{
			cr.clearArray(this.values_cache);
			current_arr = this.values_cache;
			current_index = 0;
			this.s["forEach"](set_append_to_arr);
;
			current_arr = null;
			current_index = 0;
		}
		else
		{
			var values_cache = this.values_cache;
			cr.clearArray(values_cache);
			var p, n = 0, items = this.items;
			if (items)
			{
				for (p in items)
				{
					if (items.hasOwnProperty(p))
						values_cache[n++] = items[p];
				}
			}
;
		}
		this.cache_valid = true;
	};
	ObjectSet_.prototype.valuesRef = function ()
	{
		this.update_cache();
		return this.values_cache;
	};
	cr.ObjectSet = ObjectSet_;
	var tmpSet = new cr.ObjectSet();
	cr.removeArrayDuplicates = function (arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			tmpSet.add(arr[i]);
		}
		cr.shallowAssignArray(arr, tmpSet.valuesRef());
		tmpSet.clear();
	};
	cr.arrayRemoveAllFromObjectSet = function (arr, remset)
	{
		if (supports_set)
			cr.arrayRemoveAll_set(arr, remset.s);
		else
			cr.arrayRemoveAll_arr(arr, remset.valuesRef());
	};
	cr.arrayRemoveAll_set = function (arr, s)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (!s["has"](item))					// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	cr.arrayRemoveAll_arr = function (arr, rem)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (cr.fastIndexOf(rem, item) === -1)	// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	function KahanAdder_()
	{
		this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
		cr.seal(this);
	};
	KahanAdder_.prototype.add = function (v)
	{
		this.y = v - this.c;
	    this.t = this.sum + this.y;
	    this.c = (this.t - this.sum) - this.y;
	    this.sum = this.t;
	};
    KahanAdder_.prototype.reset = function ()
    {
        this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
    };
	cr.KahanAdder = KahanAdder_;
	cr.regexp_escape = function(text)
	{
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	function CollisionPoly_(pts_array_)
	{
		this.pts_cache = [];
		this.bboxLeft = 0;
		this.bboxTop = 0;
		this.bboxRight = 0;
		this.bboxBottom = 0;
		this.convexpolys = null;		// for physics behavior to cache separated polys
		this.set_pts(pts_array_);
		cr.seal(this);
	};
	CollisionPoly_.prototype.set_pts = function(pts_array_)
	{
		this.pts_array = pts_array_;
		this.pts_count = pts_array_.length / 2;			// x, y, x, y... in array
		this.pts_cache.length = pts_array_.length;
		this.cache_width = -1;
		this.cache_height = -1;
		this.cache_angle = 0;
	};
	CollisionPoly_.prototype.is_empty = function()
	{
		return !this.pts_array.length;
	};
	CollisionPoly_.prototype.update_bbox = function ()
	{
		var myptscache = this.pts_cache;
		var bboxLeft_ = myptscache[0];
		var bboxRight_ = bboxLeft_;
		var bboxTop_ = myptscache[1];
		var bboxBottom_ = bboxTop_;
		var x, y, i = 1, i2, len = this.pts_count;
		for ( ; i < len; ++i)
		{
			i2 = i*2;
			x = myptscache[i2];
			y = myptscache[i2+1];
			if (x < bboxLeft_)
				bboxLeft_ = x;
			if (x > bboxRight_)
				bboxRight_ = x;
			if (y < bboxTop_)
				bboxTop_ = y;
			if (y > bboxBottom_)
				bboxBottom_ = y;
		}
		this.bboxLeft = bboxLeft_;
		this.bboxRight = bboxRight_;
		this.bboxTop = bboxTop_;
		this.bboxBottom = bboxBottom_;
	};
	CollisionPoly_.prototype.set_from_rect = function(rc, offx, offy)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = rc.left - offx;
		myptscache[1] = rc.top - offy;
		myptscache[2] = rc.right - offx;
		myptscache[3] = rc.top - offy;
		myptscache[4] = rc.right - offx;
		myptscache[5] = rc.bottom - offy;
		myptscache[6] = rc.left - offx;
		myptscache[7] = rc.bottom - offy;
		this.cache_width = rc.right - rc.left;
		this.cache_height = rc.bottom - rc.top;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_quad = function(q, offx, offy, w, h)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = q.tlx - offx;
		myptscache[1] = q.tly - offy;
		myptscache[2] = q.trx - offx;
		myptscache[3] = q.try_ - offy;
		myptscache[4] = q.brx - offx;
		myptscache[5] = q.bry - offy;
		myptscache[6] = q.blx - offx;
		myptscache[7] = q.bly - offy;
		this.cache_width = w;
		this.cache_height = h;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_poly = function (r)
	{
		this.pts_count = r.pts_count;
		cr.shallowAssignArray(this.pts_cache, r.pts_cache);
		this.bboxLeft = r.bboxLeft;
		this.bboxTop - r.bboxTop;
		this.bboxRight = r.bboxRight;
		this.bboxBottom = r.bboxBottom;
	};
	CollisionPoly_.prototype.cache_poly = function(w, h, a)
	{
		if (this.cache_width === w && this.cache_height === h && this.cache_angle === a)
			return;		// cache up-to-date
		this.cache_width = w;
		this.cache_height = h;
		this.cache_angle = a;
		var i, i2, i21, len, x, y;
		var sina = 0;
		var cosa = 1;
		var myptsarray = this.pts_array;
		var myptscache = this.pts_cache;
		if (a !== 0)
		{
			sina = Math.sin(a);
			cosa = Math.cos(a);
		}
		for (i = 0, len = this.pts_count; i < len; i++)
		{
			i2 = i*2;
			i21 = i2+1;
			x = myptsarray[i2] * w;
			y = myptsarray[i21] * h;
			myptscache[i2] = (x * cosa) - (y * sina);
			myptscache[i21] = (y * cosa) + (x * sina);
		}
		this.update_bbox();
	};
	CollisionPoly_.prototype.contains_pt = function (a2x, a2y)
	{
		var myptscache = this.pts_cache;
		if (a2x === myptscache[0] && a2y === myptscache[1])
			return true;
		var i, i2, imod, len = this.pts_count;
		var a1x = this.bboxLeft - 110;
		var a1y = this.bboxTop - 101;
		var a3x = this.bboxRight + 131
		var a3y = this.bboxBottom + 120;
		var b1x, b1y, b2x, b2y;
		var count1 = 0, count2 = 0;
		for (i = 0; i < len; i++)
		{
			i2 = i*2;
			imod = ((i+1)%len)*2;
			b1x = myptscache[i2];
			b1y = myptscache[i2+1];
			b2x = myptscache[imod];
			b2y = myptscache[imod+1];
			if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
				count1++;
			if (cr.segments_intersect(a3x, a3y, a2x, a2y, b1x, b1y, b2x, b2y))
				count2++;
		}
		return (count1 % 2 === 1) || (count2 % 2 === 1);
	};
	CollisionPoly_.prototype.intersects_poly = function (rhs, offx, offy)
	{
		var rhspts = rhs.pts_cache;
		var mypts = this.pts_cache;
		if (this.contains_pt(rhspts[0] + offx, rhspts[1] + offy))
			return true;
		if (rhs.contains_pt(mypts[0] - offx, mypts[1] - offy))
			return true;
		var i, i2, imod, leni, j, j2, jmod, lenj;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2];
			a1y = mypts[i2+1];
			a2x = mypts[imod];
			a2y = mypts[imod+1];
			for (j = 0, lenj = rhs.pts_count; j < lenj; j++)
			{
				j2 = j*2;
				jmod = ((j+1)%lenj)*2;
				b1x = rhspts[j2] + offx;
				b1y = rhspts[j2+1] + offy;
				b2x = rhspts[jmod] + offx;
				b2y = rhspts[jmod+1] + offy;
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	CollisionPoly_.prototype.intersects_segment = function (offx, offy, x1, y1, x2, y2)
	{
		var mypts = this.pts_cache;
		if (this.contains_pt(x1 - offx, y1 - offy))
			return true;
		var i, leni, i2, imod;
		var a1x, a1y, a2x, a2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2] + offx;
			a1y = mypts[i2+1] + offy;
			a2x = mypts[imod] + offx;
			a2y = mypts[imod+1] + offy;
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	CollisionPoly_.prototype.mirror = function (px)
	{
		var i, leni, i2;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			this.pts_cache[i2] = px * 2 - this.pts_cache[i2];
		}
	};
	CollisionPoly_.prototype.flip = function (py)
	{
		var i, leni, i21;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i21 = i*2+1;
			this.pts_cache[i21] = py * 2 - this.pts_cache[i21];
		}
	};
	CollisionPoly_.prototype.diag = function ()
	{
		var i, leni, i2, i21, temp;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			i21 = i2+1;
			temp = this.pts_cache[i2];
			this.pts_cache[i2] = this.pts_cache[i21];
			this.pts_cache[i21] = temp;
		}
	};
	cr.CollisionPoly = CollisionPoly_;
	function SparseGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	SparseGrid_.prototype.totalCellCount = 0;
	SparseGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocGridCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocGridCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	SparseGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	SparseGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	SparseGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeGridCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	SparseGrid_.prototype.queryRange = function (rc, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(rc.left);
		ystart = this.YToCell(rc.top);
		lenx = this.XToCell(rc.right);
		leny = this.YToCell(rc.bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	cr.SparseGrid = SparseGrid_;
	function RenderGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	RenderGrid_.prototype.totalCellCount = 0;
	RenderGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocRenderCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocRenderCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	RenderGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	RenderGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	RenderGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeRenderCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	RenderGrid_.prototype.queryRange = function (left, top, right, bottom, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(left);
		ystart = this.YToCell(top);
		lenx = this.XToCell(right);
		leny = this.YToCell(bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	RenderGrid_.prototype.markRangeChanged = function (rc)
	{
		var x, lenx, ystart, y, leny, cell;
		x = rc.left;
		ystart = rc.top;
		lenx = rc.right;
		leny = rc.bottom;
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.is_sorted = false;
			}
		}
	};
	cr.RenderGrid = RenderGrid_;
	var gridcellcache = [];
	function allocGridCell(grid_, x_, y_)
	{
		var ret;
		SparseGrid_.prototype.totalCellCount++;
		if (gridcellcache.length)
		{
			ret = gridcellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.GridCell(grid_, x_, y_);
	};
	function freeGridCell(c)
	{
		SparseGrid_.prototype.totalCellCount--;
		c.objects.clear();
		if (gridcellcache.length < 1000)
			gridcellcache.push(c);
	};
	function GridCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = new cr.ObjectSet();
	};
	GridCell_.prototype.isEmpty = function ()
	{
		return this.objects.isEmpty();
	};
	GridCell_.prototype.insert = function (inst)
	{
		this.objects.add(inst);
	};
	GridCell_.prototype.remove = function (inst)
	{
		this.objects.remove(inst);
	};
	GridCell_.prototype.dump = function (result)
	{
		cr.appendArray(result, this.objects.valuesRef());
	};
	cr.GridCell = GridCell_;
	var rendercellcache = [];
	function allocRenderCell(grid_, x_, y_)
	{
		var ret;
		RenderGrid_.prototype.totalCellCount++;
		if (rendercellcache.length)
		{
			ret = rendercellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.RenderCell(grid_, x_, y_);
	};
	function freeRenderCell(c)
	{
		RenderGrid_.prototype.totalCellCount--;
		c.reset();
		if (rendercellcache.length < 1000)
			rendercellcache.push(c);
	};
	function RenderCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = [];		// array which needs to be sorted by Z order
		this.is_sorted = true;	// whether array is in correct sort order or not
		this.pending_removal = new cr.ObjectSet();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.isEmpty = function ()
	{
		if (!this.objects.length)
		{
;
;
			return true;
		}
		if (this.objects.length > this.pending_removal.count())
			return false;
;
		this.flush_pending();		// takes fast path and just resets state
		return true;
	};
	RenderCell_.prototype.insert = function (inst)
	{
		if (this.pending_removal.contains(inst))
		{
			this.pending_removal.remove(inst);
			if (this.pending_removal.isEmpty())
				this.any_pending_removal = false;
			return;
		}
		if (this.objects.length)
		{
			var top = this.objects[this.objects.length - 1];
			if (top.get_zindex() > inst.get_zindex())
				this.is_sorted = false;		// 'inst' should be somewhere beneath 'top'
			this.objects.push(inst);
		}
		else
		{
			this.objects.push(inst);
			this.is_sorted = true;
		}
;
	};
	RenderCell_.prototype.remove = function (inst)
	{
		this.pending_removal.add(inst);
		this.any_pending_removal = true;
		if (this.pending_removal.count() >= 30)
			this.flush_pending();
	};
	RenderCell_.prototype.flush_pending = function ()
	{
;
		if (!this.any_pending_removal)
			return;		// not changed
		if (this.pending_removal.count() === this.objects.length)
		{
			this.reset();
			return;
		}
		cr.arrayRemoveAllFromObjectSet(this.objects, this.pending_removal);
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	function sortByInstanceZIndex(a, b)
	{
		return a.zindex - b.zindex;
	};
	RenderCell_.prototype.ensure_sorted = function ()
	{
		if (this.is_sorted)
			return;		// already sorted
		this.objects.sort(sortByInstanceZIndex);
		this.is_sorted = true;
	};
	RenderCell_.prototype.reset = function ()
	{
		cr.clearArray(this.objects);
		this.is_sorted = true;
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.dump = function (result)
	{
		this.flush_pending();
		this.ensure_sorted();
		if (this.objects.length)
			result.push(this.objects);
	};
	cr.RenderCell = RenderCell_;
	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];
	cr.effectToCompositeOp = function(effect)
	{
		if (effect <= 0 || effect >= 11)
			return "source-over";
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	cr.setGLBlend = function(this_, effect, gl)
	{
		if (!gl)
			return;
		this_.srcBlend = gl.ONE;
		this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		switch (effect) {
		case 1:		// lighter (additive)
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		}
	};
	cr.round6dp = function (x)
	{
		return Math.round(x * 1000000) / 1000000;
	};
	/*
	var localeCompare_options = {
		"usage": "search",
		"sensitivity": "accent"
	};
	var has_localeCompare = !!"a".localeCompare;
	var localeCompare_works1 = (has_localeCompare && "a".localeCompare("A", undefined, localeCompare_options) === 0);
	var localeCompare_works2 = (has_localeCompare && "a".localeCompare("á", undefined, localeCompare_options) !== 0);
	var supports_localeCompare = (has_localeCompare && localeCompare_works1 && localeCompare_works2);
	*/
	cr.equals_nocase = function (a, b)
	{
		if (typeof a !== "string" || typeof b !== "string")
			return false;
		if (a.length !== b.length)
			return false;
		if (a === b)
			return true;
		/*
		if (supports_localeCompare)
		{
			return (a.localeCompare(b, undefined, localeCompare_options) === 0);
		}
		else
		{
		*/
			return a.toLowerCase() === b.toLowerCase();
	};
	cr.isCanvasInputEvent = function (e)
	{
		var target = e.target;
		if (!target)
			return true;
		if (target === document || target === window)
			return true;
		if (document && document.body && target === document.body)
			return true;
		if (cr.equals_nocase(target.tagName, "canvas"))
			return true;
		return false;
	};
}());
;
(function()
{
	var raf = window["requestAnimationFrame"] ||
	  window["mozRequestAnimationFrame"]    ||
	  window["webkitRequestAnimationFrame"] ||
	  window["msRequestAnimationFrame"]     ||
	  window["oRequestAnimationFrame"];
	function Runtime(canvas)
	{
		if (!canvas || (!canvas.getContext && !canvas["dc"]))
			return;
		if (canvas["c2runtime"])
			return;
		else
			canvas["c2runtime"] = this;
		var self = this;
		this.isCrosswalk = /crosswalk/i.test(navigator.userAgent) || /xwalk/i.test(navigator.userAgent) || !!(typeof window["c2isCrosswalk"] !== "undefined" && window["c2isCrosswalk"]);
		this.isCordova = this.isCrosswalk || (typeof window["device"] !== "undefined" && (typeof window["device"]["cordova"] !== "undefined" || typeof window["device"]["phonegap"] !== "undefined")) || (typeof window["c2iscordova"] !== "undefined" && window["c2iscordova"]);
		this.isPhoneGap = this.isCordova;
		this.isDirectCanvas = !!canvas["dc"];
		this.isAppMobi = (typeof window["AppMobi"] !== "undefined" || this.isDirectCanvas);
		this.isCocoonJs = !!window["c2cocoonjs"];
		this.isEjecta = !!window["c2ejecta"];
		if (this.isCocoonJs)
		{
			CocoonJS["App"]["onSuspended"].addEventListener(function() {
				self["setSuspended"](true);
			});
			CocoonJS["App"]["onActivated"].addEventListener(function () {
				self["setSuspended"](false);
			});
		}
		if (this.isEjecta)
		{
			document.addEventListener("pagehide", function() {
				self["setSuspended"](true);
			});
			document.addEventListener("pageshow", function() {
				self["setSuspended"](false);
			});
			document.addEventListener("resize", function () {
				self["setSize"](window.innerWidth, window.innerHeight);
			});
		}
		this.isDomFree = (this.isDirectCanvas || this.isCocoonJs || this.isEjecta);
		this.isMicrosoftEdge = /edge\//i.test(navigator.userAgent);
		this.isIE = (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent) || /iemobile/i.test(navigator.userAgent)) && !this.isMicrosoftEdge;
		this.isTizen = /tizen/i.test(navigator.userAgent);
		this.isAndroid = /android/i.test(navigator.userAgent) && !this.isTizen && !this.isIE && !this.isMicrosoftEdge;		// IE mobile and Tizen masquerade as Android
		this.isiPhone = (/iphone/i.test(navigator.userAgent) || /ipod/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// treat ipod as an iphone; IE mobile masquerades as iPhone
		this.isiPad = /ipad/i.test(navigator.userAgent);
		this.isiOS = this.isiPhone || this.isiPad || this.isEjecta;
		this.isiPhoneiOS6 = (this.isiPhone && /os\s6/i.test(navigator.userAgent));
		this.isChrome = (/chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// note true on Chromium-based webview on Android 4.4+; IE 'Edge' mode also pretends to be Chrome
		this.isAmazonWebApp = /amazonwebappplatform/i.test(navigator.userAgent);
		this.isFirefox = /firefox/i.test(navigator.userAgent);
		this.isSafari = /safari/i.test(navigator.userAgent) && !this.isChrome && !this.isIE && !this.isMicrosoftEdge;		// Chrome and IE Mobile masquerade as Safari
		this.isWindows = /windows/i.test(navigator.userAgent);
		this.isNWjs = (typeof window["c2nodewebkit"] !== "undefined" || typeof window["c2nwjs"] !== "undefined" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent));
		this.isNodeWebkit = this.isNWjs;		// old name for backwards compat
		this.isArcade = (typeof window["is_scirra_arcade"] !== "undefined");
		this.isWindows8App = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.isWindows8Capable = !!(typeof window["c2isWindows8Capable"] !== "undefined" && window["c2isWindows8Capable"]);
		this.isWindowsPhone8 = !!(typeof window["c2isWindowsPhone8"] !== "undefined" && window["c2isWindowsPhone8"]);
		this.isWindowsPhone81 = !!(typeof window["c2isWindowsPhone81"] !== "undefined" && window["c2isWindowsPhone81"]);
		this.isWindows10 = !!window["cr_windows10"];
		this.isWinJS = (this.isWindows8App || this.isWindows8Capable || this.isWindowsPhone81 || this.isWindows10);	// note not WP8.0
		this.isBlackberry10 = !!(typeof window["c2isBlackberry10"] !== "undefined" && window["c2isBlackberry10"]);
		this.isAndroidStockBrowser = (this.isAndroid && !this.isChrome && !this.isCrosswalk && !this.isFirefox && !this.isAmazonWebApp && !this.isDomFree);
		this.devicePixelRatio = 1;
		this.isMobile = (this.isCordova || this.isCrosswalk || this.isAppMobi || this.isCocoonJs || this.isAndroid || this.isiOS || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isBlackberry10 || this.isTizen || this.isEjecta);
		if (!this.isMobile)
		{
			this.isMobile = /(blackberry|bb10|playbook|palm|symbian|nokia|windows\s+ce|phone|mobile|tablet|kindle|silk)/i.test(navigator.userAgent);
		}
		this.isWKWebView = !!(this.isiOS && this.isCordova && window["webkit"]);
		this.httpServer = null;
		this.httpServerUrl = "";
		if (this.isWKWebView)
		{
			this.httpServer = (cordova && cordova["plugins"] && cordova["plugins"]["CorHttpd"]) ? cordova["plugins"]["CorHttpd"] : null;
		}
		if (typeof cr_is_preview !== "undefined" && !this.isNWjs && (window.location.search === "?nw" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent)))
		{
			this.isNWjs = true;
		}
		this.isDebug = (typeof cr_is_preview !== "undefined" && window.location.search.indexOf("debug") > -1);
		this.canvas = canvas;
		this.canvasdiv = document.getElementById("c2canvasdiv");
		this.gl = null;
		this.glwrap = null;
		this.glUnmaskedRenderer = "(unavailable)";
		this.enableFrontToBack = false;
		this.earlyz_index = 0;
		this.ctx = null;
		this.fullscreenOldMarginCss = "";
		this.firstInFullscreen = false;
		this.oldWidth = 0;		// for restoring non-fullscreen canvas after fullscreen
		this.oldHeight = 0;
		this.canvas.oncontextmenu = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.onselectstart = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		if (this.isDirectCanvas)
			window["c2runtime"] = this;
		if (this.isNWjs)
		{
			window["ondragover"] = function(e) { e.preventDefault(); return false; };
			window["ondrop"] = function(e) { e.preventDefault(); return false; };
			if (window["nwgui"] && window["nwgui"]["App"]["clearCache"])
				window["nwgui"]["App"]["clearCache"]();
		}
		if (this.isAndroidStockBrowser && typeof jQuery !== "undefined")
		{
			jQuery("canvas").parents("*").css("overflow", "visible");
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw_width = this.width;
		this.draw_height = this.height;
		this.cssWidth = this.width;
		this.cssHeight = this.height;
		this.lastWindowWidth = window.innerWidth;
		this.lastWindowHeight = window.innerHeight;
		this.forceCanvasAlpha = false;		// allow plugins to force the canvas to display with alpha channel
		this.redraw = true;
		this.isSuspended = false;
		if (!Date.now) {
		  Date.now = function now() {
			return +new Date();
		  };
		}
		this.plugins = [];
		this.types = {};
		this.types_by_index = [];
		this.behaviors = [];
		this.layouts = {};
		this.layouts_by_index = [];
		this.eventsheets = {};
		this.eventsheets_by_index = [];
		this.wait_for_textures = [];        // for blocking until textures loaded
		this.triggers_to_postinit = [];
		this.all_global_vars = [];
		this.all_local_vars = [];
		this.solidBehavior = null;
		this.jumpthruBehavior = null;
		this.shadowcasterBehavior = null;
		this.deathRow = {};
		this.hasPendingInstances = false;		// true if anything exists in create row or death row
		this.isInClearDeathRow = false;
		this.isInOnDestroy = 0;					// needs to support recursion so increments and decrements and is true if > 0
		this.isRunningEvents = false;
		this.isEndingLayout = false;
		this.createRow = [];
		this.isLoadingState = false;
		this.saveToSlot = "";
		this.loadFromSlot = "";
		this.loadFromJson = "";
		this.lastSaveJson = "";
		this.signalledContinuousPreview = false;
		this.suspendDrawing = false;		// for hiding display until continuous preview loads
		this.fireOnCreateAfterLoad = [];	// for delaying "On create" triggers until loading complete
		this.dt = 0;
        this.dt1 = 0;
		this.minimumFramerate = 30;
		this.logictime = 0;			// used to calculate CPUUtilisation
		this.cpuutilisation = 0;
        this.timescale = 1.0;
        this.kahanTime = new cr.KahanAdder();
		this.wallTime = new cr.KahanAdder();
		this.last_tick_time = 0;
		this.fps = 0;
		this.last_fps_time = 0;
		this.tickcount = 0;
		this.execcount = 0;
		this.framecount = 0;        // for fps
		this.objectcount = 0;
		this.changelayout = null;
		this.destroycallbacks = [];
		this.event_stack = [];
		this.event_stack_index = -1;
		this.localvar_stack = [[]];
		this.localvar_stack_index = 0;
		this.trigger_depth = 0;		// recursion depth for triggers
		this.pushEventStack(null);
		this.loop_stack = [];
		this.loop_stack_index = -1;
		this.next_uid = 0;
		this.next_puid = 0;		// permanent unique ids
		this.layout_first_tick = true;
		this.family_count = 0;
		this.suspend_events = [];
		this.raf_id = -1;
		this.timeout_id = -1;
		this.isloading = true;
		this.loadingprogress = 0;
		this.isNodeFullscreen = false;
		this.stackLocalCount = 0;	// number of stack-based local vars for recursion
		this.audioInstance = null;
		this.had_a_click = false;
		this.isInUserInputEvent = false;
		this.objects_to_pretick = new cr.ObjectSet();
        this.objects_to_tick = new cr.ObjectSet();
		this.objects_to_tick2 = new cr.ObjectSet();
		this.registered_collisions = [];
		this.temp_poly = new cr.CollisionPoly([]);
		this.temp_poly2 = new cr.CollisionPoly([]);
		this.allGroups = [];				// array of all event groups
        this.groups_by_name = {};
		this.cndsBySid = {};
		this.actsBySid = {};
		this.varsBySid = {};
		this.blocksBySid = {};
		this.running_layout = null;			// currently running layout
		this.layer_canvas = null;			// for layers "render-to-texture"
		this.layer_ctx = null;
		this.layer_tex = null;
		this.layout_tex = null;
		this.layout_canvas = null;
		this.layout_ctx = null;
		this.is_WebGL_context_lost = false;
		this.uses_background_blending = false;	// if any shader uses background blending, so entire layout renders to texture
		this.fx_tex = [null, null];
		this.fullscreen_scaling = 0;
		this.files_subfolder = "";			// path with project files
		this.objectsByUid = {};				// maps every in-use UID (as a string) to its instance
		this.loaderlogos = null;
		this.snapshotCanvas = null;
		this.snapshotData = "";
		this.objectRefTable = [];
		this.requestProjectData();
	};
	Runtime.prototype.requestProjectData = function ()
	{
		var self = this;
		if (this.isWKWebView)
		{
			if (this.httpServer)
			{
				this.httpServer["startServer"]({
					"port": 0,
					"localhost_only": true
				}, function (url)
				{
					self.httpServerUrl = url;
					self.fetchLocalFileViaCordovaAsText("data.js", function (str)
					{
						self.loadProject(JSON.parse(str));
					}, function (err)
					{
						alert("Error fetching data.js");
					});
				}, function (err)
				{
					alert("error starting local server: " + err);
				});
			}
			else
			{
				this.fetchLocalFileViaCordovaAsText("data.js", function (str)
				{
					self.loadProject(JSON.parse(str));
				}, function (err)
				{
					alert("Error fetching data.js");
				});
			}
			return;
		}
		var xhr;
		if (this.isWindowsPhone8)
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		else
			xhr = new XMLHttpRequest();
		var datajs_filename = "data.js";
		if (this.isWindows8App || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isWindows10)
			datajs_filename = "data.json";
		xhr.open("GET", datajs_filename, true);
		var supportsJsonResponse = false;
		if (!this.isDomFree && ("response" in xhr) && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "json";
				supportsJsonResponse = (xhr["responseType"] === "json");
			}
			catch (e) {
				supportsJsonResponse = false;
			}
		}
		if (!supportsJsonResponse && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "text";
			}
			catch (e) {}
		}
		if ("overrideMimeType" in xhr)
		{
			try {
				xhr["overrideMimeType"]("application/json; charset=utf-8");
			}
			catch (e) {}
		}
		if (this.isWindowsPhone8)
		{
			xhr.onreadystatechange = function ()
			{
				if (xhr.readyState !== 4)
					return;
				self.loadProject(JSON.parse(xhr["responseText"]));
			};
		}
		else
		{
			xhr.onload = function ()
			{
				if (supportsJsonResponse)
				{
					self.loadProject(xhr["response"]);					// already parsed by browser
				}
				else
				{
					if (self.isEjecta)
					{
						var str = xhr["responseText"];
						str = str.substr(str.indexOf("{"));		// trim any BOM
						self.loadProject(JSON.parse(str));
					}
					else
					{
						self.loadProject(JSON.parse(xhr["responseText"]));	// forced to sync parse JSON
					}
				}
			};
			xhr.onerror = function (e)
			{
				cr.logerror("Error requesting " + datajs_filename + ":");
				cr.logerror(e);
			};
		}
		xhr.send();
	};
	Runtime.prototype.initRendererAndLoader = function ()
	{
		var self = this;
		var i, len, j, lenj, k, lenk, t, s, l, y;
		this.isRetina = ((!this.isDomFree || this.isEjecta || this.isCordova) && this.useHighDpi && !this.isAndroidStockBrowser);
		if (this.fullscreen_mode === 0 && this.isiOS)
			this.isRetina = false;
		this.devicePixelRatio = (this.isRetina ? (window["devicePixelRatio"] || window["webkitDevicePixelRatio"] || window["mozDevicePixelRatio"] || window["msDevicePixelRatio"] || 1) : 1);
		this.ClearDeathRow();
		var attribs;
		var alpha_canvas = !!(this.forceCanvasAlpha || (this.alphaBackground && !(this.isNWjs || this.isWinJS || this.isWindowsPhone8 || this.isCrosswalk || this.isCordova || this.isAmazonWebApp)));
		if (this.fullscreen_mode > 0)
			this["setSize"](window.innerWidth, window.innerHeight, true);
		try {
			if (this.enableWebGL && (this.isCocoonJs || this.isEjecta || !this.isDomFree))
			{
				attribs = {
					"alpha": alpha_canvas,
					"depth": false,
					"antialias": false,
					"failIfMajorPerformanceCaveat": true
				};
				this.gl = (this.canvas.getContext("webgl", attribs) || this.canvas.getContext("experimental-webgl", attribs));
			}
		}
		catch (e) {
		}
		if (this.gl)
		{
			var debug_ext = this.gl.getExtension("WEBGL_debug_renderer_info");
			if (debug_ext)
			{
				var unmasked_vendor = this.gl.getParameter(debug_ext.UNMASKED_VENDOR_WEBGL);
				var unmasked_renderer = this.gl.getParameter(debug_ext.UNMASKED_RENDERER_WEBGL);
				this.glUnmaskedRenderer = unmasked_renderer + " [" + unmasked_vendor + "]";
			}
			if (this.enableFrontToBack)
				this.glUnmaskedRenderer += " [front-to-back enabled]";
;
			if (!this.isDomFree)
			{
				this.overlay_canvas = document.createElement("canvas");
				jQuery(this.overlay_canvas).appendTo(this.canvas.parentNode);
				this.overlay_canvas.oncontextmenu = function (e) { return false; };
				this.overlay_canvas.onselectstart = function (e) { return false; };
				this.overlay_canvas.width = Math.round(this.cssWidth * this.devicePixelRatio);
				this.overlay_canvas.height = Math.round(this.cssHeight * this.devicePixelRatio);
				jQuery(this.overlay_canvas).css({"width": this.cssWidth + "px",
												"height": this.cssHeight + "px"});
				this.positionOverlayCanvas();
				this.overlay_ctx = this.overlay_canvas.getContext("2d");
			}
			this.glwrap = new cr.GLWrap(this.gl, this.isMobile, this.enableFrontToBack);
			this.glwrap.setSize(this.canvas.width, this.canvas.height);
			this.glwrap.enable_mipmaps = (this.downscalingQuality !== 0);
			this.ctx = null;
			this.canvas.addEventListener("webglcontextlost", function (ev) {
				ev.preventDefault();
				self.onContextLost();
				cr.logexport("[Construct 2] WebGL context lost");
				window["cr_setSuspended"](true);		// stop rendering
			}, false);
			this.canvas.addEventListener("webglcontextrestored", function (ev) {
				self.glwrap.initState();
				self.glwrap.setSize(self.glwrap.width, self.glwrap.height, true);
				self.layer_tex = null;
				self.layout_tex = null;
				self.fx_tex[0] = null;
				self.fx_tex[1] = null;
				self.onContextRestored();
				self.redraw = true;
				cr.logexport("[Construct 2] WebGL context restored");
				window["cr_setSuspended"](false);		// resume rendering
			}, false);
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
				{
					s = t.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
					this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
				}
			}
			for (i = 0, len = this.layouts_by_index.length; i < len; i++)
			{
				l = this.layouts_by_index[i];
				for (j = 0, lenj = l.effect_types.length; j < lenj; j++)
				{
					s = l.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
				}
				l.updateActiveEffects();		// update preserves opaqueness flag
				for (j = 0, lenj = l.layers.length; j < lenj; j++)
				{
					y = l.layers[j];
					for (k = 0, lenk = y.effect_types.length; k < lenk; k++)
					{
						s = y.effect_types[k];
						s.shaderindex = this.glwrap.getShaderIndex(s.id);
						s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
						this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
					}
					y.updateActiveEffects();		// update preserves opaqueness flag
				}
			}
		}
		else
		{
			if (this.fullscreen_mode > 0 && this.isDirectCanvas)
			{
;
				this.canvas = null;
				document.oncontextmenu = function (e) { return false; };
				document.onselectstart = function (e) { return false; };
				this.ctx = AppMobi["canvas"]["getContext"]("2d");
				try {
					this.ctx["samplingMode"] = this.linearSampling ? "smooth" : "sharp";
					this.ctx["globalScale"] = 1;
					this.ctx["HTML5CompatibilityMode"] = true;
					this.ctx["imageSmoothingEnabled"] = this.linearSampling;
				} catch(e){}
				if (this.width !== 0 && this.height !== 0)
				{
					this.ctx.width = this.width;
					this.ctx.height = this.height;
				}
			}
			if (!this.ctx)
			{
;
				if (this.isCocoonJs)
				{
					attribs = {
						"antialias": !!this.linearSampling,
						"alpha": alpha_canvas
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				else
				{
					attribs = {
						"alpha": alpha_canvas
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
			}
			this.overlay_canvas = null;
			this.overlay_ctx = null;
		}
		this.tickFunc = function (timestamp) { self.tick(false, timestamp); };
		if (window != window.top && !this.isDomFree && !this.isWinJS && !this.isWindowsPhone8)
		{
			document.addEventListener("mousedown", function () {
				window.focus();
			}, true);
			document.addEventListener("touchstart", function () {
				window.focus();
			}, true);
		}
		if (typeof cr_is_preview !== "undefined")
		{
			if (this.isCocoonJs)
				console.log("[Construct 2] In preview-over-wifi via CocoonJS mode");
			if (window.location.search.indexOf("continuous") > -1)
			{
				cr.logexport("Reloading for continuous preview");
				this.loadFromSlot = "__c2_continuouspreview";
				this.suspendDrawing = true;
			}
			if (this.pauseOnBlur && !this.isMobile)
			{
				jQuery(window).focus(function ()
				{
					self["setSuspended"](false);
				});
				jQuery(window).blur(function ()
				{
					var parent = window.parent;
					if (!parent || !parent.document.hasFocus())
						self["setSuspended"](true);
				});
			}
		}
		window.addEventListener("blur", function () {
			self.onWindowBlur();
		});
		if (!this.isDomFree)
		{
			var unfocusFormControlFunc = function (e) {
				if (cr.isCanvasInputEvent(e) && document["activeElement"] && document["activeElement"] !== document.getElementsByTagName("body")[0] && document["activeElement"].blur)
				{
					try {
						document["activeElement"].blur();
					}
					catch (e) {}
				}
			}
			if (window.navigator["pointerEnabled"])
			{
				document.addEventListener("pointerdown", unfocusFormControlFunc);
			}
			else if (window.navigator["msPointerEnabled"])
			{
				document.addEventListener("MSPointerDown", unfocusFormControlFunc);
			}
			else
			{
				document.addEventListener("touchstart", unfocusFormControlFunc);
			}
			document.addEventListener("mousedown", unfocusFormControlFunc);
		}
		if (this.fullscreen_mode === 0 && this.isRetina && this.devicePixelRatio > 1)
		{
			this["setSize"](this.original_width, this.original_height, true);
		}
		this.tryLockOrientation();
		this.getready();	// determine things to preload
		this.go();			// run loading screen
		this.extra = {};
		cr.seal(this);
	};
	var webkitRepaintFlag = false;
	Runtime.prototype["setSize"] = function (w, h, force)
	{
		var offx = 0, offy = 0;
		var neww = 0, newh = 0, intscale = 0;
		if (this.lastWindowWidth === w && this.lastWindowHeight === h && !force)
			return;
		this.lastWindowWidth = w;
		this.lastWindowHeight = h;
		var mode = this.fullscreen_mode;
		var orig_aspect, cur_aspect;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen) && !this.isCordova;
		if (!isfullscreen && this.fullscreen_mode === 0 && !force)
			return;			// ignore size events when not fullscreen and not using a fullscreen-in-browser mode
		if (isfullscreen && this.fullscreen_scaling > 0)
			mode = this.fullscreen_scaling;
		var dpr = this.devicePixelRatio;
		if (mode >= 4)
		{
			orig_aspect = this.original_width / this.original_height;
			cur_aspect = w / h;
			if (cur_aspect > orig_aspect)
			{
				neww = h * orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (neww * dpr) / this.original_width;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offx = (w - neww) / 2;
					w = neww;
				}
			}
			else
			{
				newh = w / orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (newh * dpr) / this.original_height;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offy = (h - newh) / 2;
					h = newh;
				}
			}
			if (isfullscreen && !this.isNWjs)
			{
				offx = 0;
				offy = 0;
			}
		}
		else if (this.isNWjs && this.isNodeFullscreen && this.fullscreen_mode_set === 0)
		{
			offx = Math.floor((w - this.original_width) / 2);
			offy = Math.floor((h - this.original_height) / 2);
			w = this.original_width;
			h = this.original_height;
		}
		if (mode < 2)
			this.aspect_scale = dpr;
		this.cssWidth = Math.round(w);
		this.cssHeight = Math.round(h);
		this.width = Math.round(w * dpr);
		this.height = Math.round(h * dpr);
		this.redraw = true;
		if (this.wantFullscreenScalingQuality)
		{
			this.draw_width = this.width;
			this.draw_height = this.height;
			this.fullscreenScalingQuality = true;
		}
		else
		{
			if ((this.width < this.original_width && this.height < this.original_height) || mode === 1)
			{
				this.draw_width = this.width;
				this.draw_height = this.height;
				this.fullscreenScalingQuality = true;
			}
			else
			{
				this.draw_width = this.original_width;
				this.draw_height = this.original_height;
				this.fullscreenScalingQuality = false;
				/*var orig_aspect = this.original_width / this.original_height;
				var cur_aspect = this.width / this.height;
				if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
					this.aspect_scale = this.height / this.original_height;
				else
					this.aspect_scale = this.width / this.original_width;*/
				if (mode === 2)		// scale inner
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect < orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect > orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
				else if (mode === 3)
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect > orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect < orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
			}
		}
		if (this.canvasdiv && !this.isDomFree)
		{
			jQuery(this.canvasdiv).css({"width": Math.round(w) + "px",
										"height": Math.round(h) + "px",
										"margin-left": Math.floor(offx) + "px",
										"margin-top": Math.floor(offy) + "px"});
			if (typeof cr_is_preview !== "undefined")
			{
				jQuery("#borderwrap").css({"width": Math.round(w) + "px",
											"height": Math.round(h) + "px"});
			}
		}
		if (this.canvas)
		{
			this.canvas.width = Math.round(w * dpr);
			this.canvas.height = Math.round(h * dpr);
			if (this.isEjecta)
			{
				this.canvas.style.left = Math.floor(offx) + "px";
				this.canvas.style.top = Math.floor(offy) + "px";
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
			else if (this.isRetina && !this.isDomFree)
			{
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
		}
		if (this.overlay_canvas)
		{
			this.overlay_canvas.width = Math.round(w * dpr);
			this.overlay_canvas.height = Math.round(h * dpr);
			this.overlay_canvas.style.width = this.cssWidth + "px";
			this.overlay_canvas.style.height = this.cssHeight + "px";
		}
		if (this.glwrap)
		{
			this.glwrap.setSize(Math.round(w * dpr), Math.round(h * dpr));
		}
		if (this.isDirectCanvas && this.ctx)
		{
			this.ctx.width = Math.round(w);
			this.ctx.height = Math.round(h);
		}
		if (this.ctx)
		{
			this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
		}
		this.tryLockOrientation();
		if (this.isiPhone && !this.isCordova)
		{
			window.scrollTo(0, 0);
		}
	};
	Runtime.prototype.tryLockOrientation = function ()
	{
		if (!this.autoLockOrientation || this.orientations === 0)
			return;
		var orientation = "portrait";
		if (this.orientations === 2)
			orientation = "landscape";
		try {
			if (screen["orientation"] && screen["orientation"]["lock"])
				screen["orientation"]["lock"](orientation).catch(function(){});
			else if (screen["lockOrientation"])
				screen["lockOrientation"](orientation);
			else if (screen["webkitLockOrientation"])
				screen["webkitLockOrientation"](orientation);
			else if (screen["mozLockOrientation"])
				screen["mozLockOrientation"](orientation);
			else if (screen["msLockOrientation"])
				screen["msLockOrientation"](orientation);
		}
		catch (e)
		{
			if (console && console.warn)
				console.warn("Failed to lock orientation: ", e);
		}
	};
	Runtime.prototype.onContextLost = function ()
	{
		this.glwrap.contextLost();
		this.is_WebGL_context_lost = true;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onLostWebGLContext)
				t.onLostWebGLContext();
		}
	};
	Runtime.prototype.onContextRestored = function ()
	{
		this.is_WebGL_context_lost = false;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onRestoreWebGLContext)
				t.onRestoreWebGLContext();
		}
	};
	Runtime.prototype.positionOverlayCanvas = function()
	{
		if (this.isDomFree)
			return;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		var overlay_position = isfullscreen ? jQuery(this.canvas).offset() : jQuery(this.canvas).position();
		overlay_position.position = "absolute";
		jQuery(this.overlay_canvas).css(overlay_position);
	};
	var caf = window["cancelAnimationFrame"] ||
	  window["mozCancelAnimationFrame"]    ||
	  window["webkitCancelAnimationFrame"] ||
	  window["msCancelAnimationFrame"]     ||
	  window["oCancelAnimationFrame"];
	Runtime.prototype["setSuspended"] = function (s)
	{
		var i, len;
		var self = this;
		if (s && !this.isSuspended)
		{
			cr.logexport("[Construct 2] Suspending");
			this.isSuspended = true;			// next tick will be last
			if (this.raf_id !== -1 && caf)		// note: CocoonJS does not implement cancelAnimationFrame
				caf(this.raf_id);
			if (this.timeout_id !== -1)
				clearTimeout(this.timeout_id);
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](true);
		}
		else if (!s && this.isSuspended)
		{
			cr.logexport("[Construct 2] Resuming");
			this.isSuspended = false;
			this.last_tick_time = cr.performance_now();	// ensure first tick is a zero-dt one
			this.last_fps_time = cr.performance_now();	// reset FPS counter
			this.framecount = 0;
			this.logictime = 0;
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](false);
			this.tick(false);						// kick off runtime again
		}
	};
	Runtime.prototype.addSuspendCallback = function (f)
	{
		this.suspend_events.push(f);
	};
	Runtime.prototype.GetObjectReference = function (i)
	{
;
		return this.objectRefTable[i];
	};
	Runtime.prototype.loadProject = function (data_response)
	{
;
		if (!data_response || !data_response["project"])
			cr.logerror("Project model unavailable");
		var pm = data_response["project"];
		this.name = pm[0];
		this.first_layout = pm[1];
		this.fullscreen_mode = pm[12];	// 0 = off, 1 = crop, 2 = scale inner, 3 = scale outer, 4 = letterbox scale, 5 = integer letterbox scale
		this.fullscreen_mode_set = pm[12];
		this.original_width = pm[10];
		this.original_height = pm[11];
		this.parallax_x_origin = this.original_width / 2;
		this.parallax_y_origin = this.original_height / 2;
		if (this.isDomFree && !this.isEjecta && (pm[12] >= 4 || pm[12] === 0))
		{
			cr.logexport("[Construct 2] Letterbox scale fullscreen modes are not supported on this platform - falling back to 'Scale outer'");
			this.fullscreen_mode = 3;
			this.fullscreen_mode_set = 3;
		}
		this.uses_loader_layout = pm[18];
		this.loaderstyle = pm[19];
		if (this.loaderstyle === 0)
		{
			var loaderImage = new Image();
			loaderImage.crossOrigin = "anonymous";
			this.setImageSrc(loaderImage, "loading-logo.png");
			this.loaderlogos = {
				logo: loaderImage
			};
		}
		else if (this.loaderstyle === 4)	// c2 splash
		{
			var loaderC2logo_1024 = new Image();
			loaderC2logo_1024.src = "";
			var loaderC2logo_512 = new Image();
			loaderC2logo_512.src = "";
			var loaderC2logo_256 = new Image();
			loaderC2logo_256.src = "";
			var loaderC2logo_128 = new Image();
			loaderC2logo_128.src = "";
			var loaderPowered_1024 = new Image();
			loaderPowered_1024.src = "";
			var loaderPowered_512 = new Image();
			loaderPowered_512.src = "";
			var loaderPowered_256 = new Image();
			loaderPowered_256.src = "";
			var loaderPowered_128 = new Image();
			loaderPowered_128.src = "";
			var loaderWebsite_1024 = new Image();
			loaderWebsite_1024.src = "";
			var loaderWebsite_512 = new Image();
			loaderWebsite_512.src = "";
			var loaderWebsite_256 = new Image();
			loaderWebsite_256.src = "";
			var loaderWebsite_128 = new Image();
			loaderWebsite_128.src = "";
			this.loaderlogos = {
				logo: [loaderC2logo_1024, loaderC2logo_512, loaderC2logo_256, loaderC2logo_128],
				powered: [loaderPowered_1024, loaderPowered_512, loaderPowered_256, loaderPowered_128],
				website: [loaderWebsite_1024, loaderWebsite_512, loaderWebsite_256, loaderWebsite_128]
			};
		}
		this.next_uid = pm[21];
		this.objectRefTable = cr.getObjectRefTable();
		this.system = new cr.system_object(this);
		var i, len, j, lenj, k, lenk, idstr, m, b, t, f, p;
		var plugin, plugin_ctor;
		for (i = 0, len = pm[2].length; i < len; i++)
		{
			m = pm[2][i];
			p = this.GetObjectReference(m[0]);
;
			cr.add_common_aces(m, p.prototype);
			plugin = new p(this);
			plugin.singleglobal = m[1];
			plugin.is_world = m[2];
			plugin.must_predraw = m[9];
			if (plugin.onCreate)
				plugin.onCreate();  // opportunity to override default ACEs
			cr.seal(plugin);
			this.plugins.push(plugin);
		}
		this.objectRefTable = cr.getObjectRefTable();
		for (i = 0, len = pm[3].length; i < len; i++)
		{
			m = pm[3][i];
			plugin_ctor = this.GetObjectReference(m[1]);
;
			plugin = null;
			for (j = 0, lenj = this.plugins.length; j < lenj; j++)
			{
				if (this.plugins[j] instanceof plugin_ctor)
				{
					plugin = this.plugins[j];
					break;
				}
			}
;
;
			var type_inst = new plugin.Type(plugin);
;
			type_inst.name = m[0];
			type_inst.is_family = m[2];
			type_inst.instvar_sids = m[3].slice(0);
			type_inst.vars_count = m[3].length;
			type_inst.behs_count = m[4];
			type_inst.fx_count = m[5];
			type_inst.sid = m[11];
			if (type_inst.is_family)
			{
				type_inst.members = [];				// types in this family
				type_inst.family_index = this.family_count++;
				type_inst.families = null;
			}
			else
			{
				type_inst.members = null;
				type_inst.family_index = -1;
				type_inst.families = [];			// families this type belongs to
			}
			type_inst.family_var_map = null;
			type_inst.family_beh_map = null;
			type_inst.family_fx_map = null;
			type_inst.is_contained = false;
			type_inst.container = null;
			if (m[6])
			{
				type_inst.texture_file = m[6][0];
				type_inst.texture_filesize = m[6][1];
				type_inst.texture_pixelformat = m[6][2];
			}
			else
			{
				type_inst.texture_file = null;
				type_inst.texture_filesize = 0;
				type_inst.texture_pixelformat = 0;		// rgba8
			}
			if (m[7])
			{
				type_inst.animations = m[7];
			}
			else
			{
				type_inst.animations = null;
			}
			type_inst.index = i;                                // save index in to types array in type
			type_inst.instances = [];                           // all instances of this type
			type_inst.deadCache = [];							// destroyed instances to recycle next create
			type_inst.solstack = [new cr.selection(type_inst)]; // initialise SOL stack with one empty SOL
			type_inst.cur_sol = 0;
			type_inst.default_instance = null;
			type_inst.default_layerindex = 0;
			type_inst.stale_iids = true;
			type_inst.updateIIDs = cr.type_updateIIDs;
			type_inst.getFirstPicked = cr.type_getFirstPicked;
			type_inst.getPairedInstance = cr.type_getPairedInstance;
			type_inst.getCurrentSol = cr.type_getCurrentSol;
			type_inst.pushCleanSol = cr.type_pushCleanSol;
			type_inst.pushCopySol = cr.type_pushCopySol;
			type_inst.popSol = cr.type_popSol;
			type_inst.getBehaviorByName = cr.type_getBehaviorByName;
			type_inst.getBehaviorIndexByName = cr.type_getBehaviorIndexByName;
			type_inst.getEffectIndexByName = cr.type_getEffectIndexByName;
			type_inst.applySolToContainer = cr.type_applySolToContainer;
			type_inst.getInstanceByIID = cr.type_getInstanceByIID;
			type_inst.collision_grid = new cr.SparseGrid(this.original_width, this.original_height);
			type_inst.any_cell_changed = true;
			type_inst.any_instance_parallaxed = false;
			type_inst.extra = {};
			type_inst.toString = cr.type_toString;
			type_inst.behaviors = [];
			for (j = 0, lenj = m[8].length; j < lenj; j++)
			{
				b = m[8][j];
				var behavior_ctor = this.GetObjectReference(b[1]);
				var behavior_plugin = null;
				for (k = 0, lenk = this.behaviors.length; k < lenk; k++)
				{
					if (this.behaviors[k] instanceof behavior_ctor)
					{
						behavior_plugin = this.behaviors[k];
						break;
					}
				}
				if (!behavior_plugin)
				{
					behavior_plugin = new behavior_ctor(this);
					behavior_plugin.my_types = [];						// types using this behavior
					behavior_plugin.my_instances = new cr.ObjectSet(); 	// instances of this behavior
					if (behavior_plugin.onCreate)
						behavior_plugin.onCreate();
					cr.seal(behavior_plugin);
					this.behaviors.push(behavior_plugin);
					if (cr.behaviors.solid && behavior_plugin instanceof cr.behaviors.solid)
						this.solidBehavior = behavior_plugin;
					if (cr.behaviors.jumpthru && behavior_plugin instanceof cr.behaviors.jumpthru)
						this.jumpthruBehavior = behavior_plugin;
					if (cr.behaviors.shadowcaster && behavior_plugin instanceof cr.behaviors.shadowcaster)
						this.shadowcasterBehavior = behavior_plugin;
				}
				if (behavior_plugin.my_types.indexOf(type_inst) === -1)
					behavior_plugin.my_types.push(type_inst);
				var behavior_type = new behavior_plugin.Type(behavior_plugin, type_inst);
				behavior_type.name = b[0];
				behavior_type.sid = b[2];
				behavior_type.onCreate();
				cr.seal(behavior_type);
				type_inst.behaviors.push(behavior_type);
			}
			type_inst.global = m[9];
			type_inst.isOnLoaderLayout = m[10];
			type_inst.effect_types = [];
			for (j = 0, lenj = m[12].length; j < lenj; j++)
			{
				type_inst.effect_types.push({
					id: m[12][j][0],
					name: m[12][j][1],
					shaderindex: -1,
					preservesOpaqueness: false,
					active: true,
					index: j
				});
			}
			type_inst.tile_poly_data = m[13];
			if (!this.uses_loader_layout || type_inst.is_family || type_inst.isOnLoaderLayout || !plugin.is_world)
			{
				type_inst.onCreate();
				cr.seal(type_inst);
			}
			if (type_inst.name)
				this.types[type_inst.name] = type_inst;
			this.types_by_index.push(type_inst);
			if (plugin.singleglobal)
			{
				var instance = new plugin.Instance(type_inst);
				instance.uid = this.next_uid++;
				instance.puid = this.next_puid++;
				instance.iid = 0;
				instance.get_iid = cr.inst_get_iid;
				instance.toString = cr.inst_toString;
				instance.properties = m[14];
				instance.onCreate();
				cr.seal(instance);
				type_inst.instances.push(instance);
				this.objectsByUid[instance.uid.toString()] = instance;
			}
		}
		for (i = 0, len = pm[4].length; i < len; i++)
		{
			var familydata = pm[4][i];
			var familytype = this.types_by_index[familydata[0]];
			var familymember;
			for (j = 1, lenj = familydata.length; j < lenj; j++)
			{
				familymember = this.types_by_index[familydata[j]];
				familymember.families.push(familytype);
				familytype.members.push(familymember);
			}
		}
		for (i = 0, len = pm[28].length; i < len; i++)
		{
			var containerdata = pm[28][i];
			var containertypes = [];
			for (j = 0, lenj = containerdata.length; j < lenj; j++)
				containertypes.push(this.types_by_index[containerdata[j]]);
			for (j = 0, lenj = containertypes.length; j < lenj; j++)
			{
				containertypes[j].is_contained = true;
				containertypes[j].container = containertypes;
			}
		}
		if (this.family_count > 0)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (t.is_family || !t.families.length)
					continue;
				t.family_var_map = new Array(this.family_count);
				t.family_beh_map = new Array(this.family_count);
				t.family_fx_map = new Array(this.family_count);
				var all_fx = [];
				var varsum = 0;
				var behsum = 0;
				var fxsum = 0;
				for (j = 0, lenj = t.families.length; j < lenj; j++)
				{
					f = t.families[j];
					t.family_var_map[f.family_index] = varsum;
					varsum += f.vars_count;
					t.family_beh_map[f.family_index] = behsum;
					behsum += f.behs_count;
					t.family_fx_map[f.family_index] = fxsum;
					fxsum += f.fx_count;
					for (k = 0, lenk = f.effect_types.length; k < lenk; k++)
						all_fx.push(cr.shallowCopy({}, f.effect_types[k]));
				}
				t.effect_types = all_fx.concat(t.effect_types);
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
					t.effect_types[j].index = j;
			}
		}
		for (i = 0, len = pm[5].length; i < len; i++)
		{
			m = pm[5][i];
			var layout = new cr.layout(this, m);
			cr.seal(layout);
			this.layouts[layout.name] = layout;
			this.layouts_by_index.push(layout);
		}
		for (i = 0, len = pm[6].length; i < len; i++)
		{
			m = pm[6][i];
			var sheet = new cr.eventsheet(this, m);
			cr.seal(sheet);
			this.eventsheets[sheet.name] = sheet;
			this.eventsheets_by_index.push(sheet);
		}
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].postInit();
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].updateDeepIncludes();
		for (i = 0, len = this.triggers_to_postinit.length; i < len; i++)
			this.triggers_to_postinit[i].postInit();
		cr.clearArray(this.triggers_to_postinit)
		this.audio_to_preload = pm[7];
		this.files_subfolder = pm[8];
		this.pixel_rounding = pm[9];
		this.aspect_scale = 1.0;
		this.enableWebGL = pm[13];
		this.linearSampling = pm[14];
		this.alphaBackground = pm[15];
		this.versionstr = pm[16];
		this.useHighDpi = pm[17];
		this.orientations = pm[20];		// 0 = any, 1 = portrait, 2 = landscape
		this.autoLockOrientation = (this.orientations > 0);
		this.pauseOnBlur = pm[22];
		this.wantFullscreenScalingQuality = pm[23];		// false = low quality, true = high quality
		this.fullscreenScalingQuality = this.wantFullscreenScalingQuality;
		this.downscalingQuality = pm[24];	// 0 = low (mips off), 1 = medium (mips on, dense spritesheet), 2 = high (mips on, sparse spritesheet)
		this.preloadSounds = pm[25];		// 0 = no, 1 = yes
		this.projectName = pm[26];
		this.enableFrontToBack = pm[27] && !this.isIE;		// front-to-back renderer disabled in IE (but not Edge)
		this.start_time = Date.now();
		cr.clearArray(this.objectRefTable);
		this.initRendererAndLoader();
	};
	var anyImageHadError = false;
	Runtime.prototype.waitForImageLoad = function (img_, src_)
	{
		img_["cocoonLazyLoad"] = true;
		img_.onerror = function (e)
		{
			img_.c2error = true;
			anyImageHadError = true;
			if (console && console.error)
				console.error("Error loading image '" + img_.src + "': ", e);
		};
		if (this.isEjecta)
		{
			img_.src = src_;
		}
		else if (!img_.src)
		{
			if (typeof XAPKReader !== "undefined")
			{
				XAPKReader.get(src_, function (expanded_url)
				{
					img_.src = expanded_url;
				}, function (e)
				{
					img_.c2error = true;
					anyImageHadError = true;
					if (console && console.error)
						console.error("Error extracting image '" + src_ + "' from expansion file: ", e);
				});
			}
			else
			{
				img_.crossOrigin = "anonymous";			// required for Arcade sandbox compatibility
				this.setImageSrc(img_, src_);			// work around WKWebView problems
			}
		}
		this.wait_for_textures.push(img_);
	};
	Runtime.prototype.findWaitingTexture = function (src_)
	{
		var i, len;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			if (this.wait_for_textures[i].cr_src === src_)
				return this.wait_for_textures[i];
		}
		return null;
	};
	var audio_preload_totalsize = 0;
	var audio_preload_started = false;
	Runtime.prototype.getready = function ()
	{
		if (!this.audioInstance)
			return;
		audio_preload_totalsize = this.audioInstance.setPreloadList(this.audio_to_preload);
	};
	Runtime.prototype.areAllTexturesAndSoundsLoaded = function ()
	{
		var totalsize = audio_preload_totalsize;
		var completedsize = 0;
		var audiocompletedsize = 0;
		var ret = true;
		var i, len, img;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			img = this.wait_for_textures[i];
			var filesize = img.cr_filesize;
			if (!filesize || filesize <= 0)
				filesize = 50000;
			totalsize += filesize;
			if (!!img.src && (img.complete || img["loaded"]) && !img.c2error)
				completedsize += filesize;
			else
				ret = false;    // not all textures loaded
		}
		if (ret && this.preloadSounds && this.audioInstance)
		{
			if (!audio_preload_started)
			{
				this.audioInstance.startPreloads();
				audio_preload_started = true;
			}
			audiocompletedsize = this.audioInstance.getPreloadedSize();
			completedsize += audiocompletedsize;
			if (audiocompletedsize < audio_preload_totalsize)
				ret = false;		// not done yet
		}
		if (totalsize == 0)
			this.progress = 1;		// indicate to C2 splash loader that it can finish now
		else
			this.progress = (completedsize / totalsize);
		return ret;
	};
	var isC2SplashDone = false;
	Runtime.prototype.go = function ()
	{
		if (!this.ctx && !this.glwrap)
			return;
		var ctx = this.ctx || this.overlay_ctx;
		if (this.overlay_canvas)
			this.positionOverlayCanvas();
		var curwidth = window.innerWidth;
		var curheight = window.innerHeight;
		if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
		{
			this["setSize"](curwidth, curheight);
		}
		this.progress = 0;
		this.last_progress = -1;
		var self = this;
		if (this.areAllTexturesAndSoundsLoaded() && (this.loaderstyle !== 4 || isC2SplashDone))
		{
			this.go_loading_finished();
		}
		else
		{
			var ms_elapsed = Date.now() - this.start_time;
			if (ctx)
			{
				var overlay_width = this.width;
				var overlay_height = this.height;
				var dpr = this.devicePixelRatio;
				if (this.loaderstyle < 3 && (this.isCocoonJs || (ms_elapsed >= 500 && this.last_progress != this.progress)))
				{
					ctx.clearRect(0, 0, overlay_width, overlay_height);
					var mx = overlay_width / 2;
					var my = overlay_height / 2;
					var haslogo = (this.loaderstyle === 0 && this.loaderlogos.logo.complete);
					var hlw = 40 * dpr;
					var hlh = 0;
					var logowidth = 80 * dpr;
					var logoheight;
					if (haslogo)
					{
						var loaderLogoImage = this.loaderlogos.logo;
						logowidth = loaderLogoImage.width * dpr;
						logoheight = loaderLogoImage.height * dpr;
						hlw = logowidth / 2;
						hlh = logoheight / 2;
						ctx.drawImage(loaderLogoImage, cr.floor(mx - hlw), cr.floor(my - hlh), logowidth, logoheight);
					}
					if (this.loaderstyle <= 1)
					{
						my += hlh + (haslogo ? 12 * dpr : 0);
						mx -= hlw;
						mx = cr.floor(mx) + 0.5;
						my = cr.floor(my) + 0.5;
						ctx.fillStyle = anyImageHadError ? "red" : "DodgerBlue";
						ctx.fillRect(mx, my, Math.floor(logowidth * this.progress), 6 * dpr);
						ctx.strokeStyle = "black";
						ctx.strokeRect(mx, my, logowidth, 6 * dpr);
						ctx.strokeStyle = "white";
						ctx.strokeRect(mx - 1 * dpr, my - 1 * dpr, logowidth + 2 * dpr, 8 * dpr);
					}
					else if (this.loaderstyle === 2)
					{
						ctx.font = (this.isEjecta ? "12pt ArialMT" : "12pt Arial");
						ctx.fillStyle = anyImageHadError ? "#f00" : "#999";
						ctx.textBaseLine = "middle";
						var percent_text = Math.round(this.progress * 100) + "%";
						var text_dim = ctx.measureText ? ctx.measureText(percent_text) : null;
						var text_width = text_dim ? text_dim.width : 0;
						ctx.fillText(percent_text, mx - (text_width / 2), my);
					}
					this.last_progress = this.progress;
				}
				else if (this.loaderstyle === 4)
				{
					this.draw_c2_splash_loader(ctx);
					if (raf)
						raf(function() { self.go(); });
					else
						setTimeout(function() { self.go(); }, 16);
					return;
				}
			}
			setTimeout(function() { self.go(); }, (this.isCocoonJs ? 10 : 100));
		}
	};
	var splashStartTime = -1;
	var splashFadeInDuration = 300;
	var splashFadeOutDuration = 300;
	var splashAfterFadeOutWait = (typeof cr_is_preview === "undefined" ? 200 : 0);
	var splashIsFadeIn = true;
	var splashIsFadeOut = false;
	var splashFadeInFinish = 0;
	var splashFadeOutStart = 0;
	var splashMinDisplayTime = (typeof cr_is_preview === "undefined" ? 3000 : 0);
	var renderViaCanvas = null;
	var renderViaCtx = null;
	var splashFrameNumber = 0;
	function maybeCreateRenderViaCanvas(w, h)
	{
		if (!renderViaCanvas || renderViaCanvas.width !== w || renderViaCanvas.height !== h)
		{
			renderViaCanvas = document.createElement("canvas");
			renderViaCanvas.width = w;
			renderViaCanvas.height = h;
			renderViaCtx = renderViaCanvas.getContext("2d");
		}
	};
	function mipImage(arr, size)
	{
		if (size <= 128)
			return arr[3];
		else if (size <= 256)
			return arr[2];
		else if (size <= 512)
			return arr[1];
		else
			return arr[0];
	};
	Runtime.prototype.draw_c2_splash_loader = function(ctx)
	{
		if (isC2SplashDone)
			return;
		var w = Math.ceil(this.width);
		var h = Math.ceil(this.height);
		var dpr = this.devicePixelRatio;
		var logoimages = this.loaderlogos.logo;
		var poweredimages = this.loaderlogos.powered;
		var websiteimages = this.loaderlogos.website;
		for (var i = 0; i < 4; ++i)
		{
			if (!logoimages[i].complete || !poweredimages[i].complete || !websiteimages[i].complete)
				return;
		}
		if (splashFrameNumber === 0)
			splashStartTime = Date.now();
		var nowTime = Date.now();
		var isRenderingVia = false;
		var renderToCtx = ctx;
		var drawW, drawH;
		if (splashIsFadeIn || splashIsFadeOut)
		{
			ctx.clearRect(0, 0, w, h);
			maybeCreateRenderViaCanvas(w, h);
			renderToCtx = renderViaCtx;
			isRenderingVia = true;
			if (splashIsFadeIn && splashFrameNumber === 1)
				splashStartTime = Date.now();
		}
		else
		{
			ctx.globalAlpha = 1;
		}
		renderToCtx.fillStyle = "#333333";
		renderToCtx.fillRect(0, 0, w, h);
		if (this.cssHeight > 256)
		{
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(poweredimages, drawW), w * 0.5 - drawW/2, h * 0.2 - drawH/2, drawW, drawH);
			drawW = Math.min(h * 0.395, w * 0.95);
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.485 - drawH/2, drawW, drawH);
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(websiteimages, drawW), w * 0.5 - drawW/2, h * 0.868 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.8 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.8 - drawH/2, drawW, drawH);
		}
		else
		{
			drawW = h * 0.55;
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.45 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.85 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.85 - drawH/2, drawW, drawH);
		}
		if (isRenderingVia)
		{
			if (splashIsFadeIn)
			{
				if (splashFrameNumber === 0)
					ctx.globalAlpha = 0;
				else
					ctx.globalAlpha = Math.min((nowTime - splashStartTime) / splashFadeInDuration, 1);
			}
			else if (splashIsFadeOut)
			{
				ctx.globalAlpha = Math.max(1 - (nowTime - splashFadeOutStart) / splashFadeOutDuration, 0);
			}
			ctx.drawImage(renderViaCanvas, 0, 0, w, h);
		}
		if (splashIsFadeIn && nowTime - splashStartTime >= splashFadeInDuration && splashFrameNumber >= 2)
		{
			splashIsFadeIn = false;
			splashFadeInFinish = nowTime;
		}
		if (!splashIsFadeIn && nowTime - splashFadeInFinish >= splashMinDisplayTime && !splashIsFadeOut && this.progress >= 1)
		{
			splashIsFadeOut = true;
			splashFadeOutStart = nowTime;
		}
		if ((splashIsFadeOut && nowTime - splashFadeOutStart >= splashFadeOutDuration + splashAfterFadeOutWait) ||
			(typeof cr_is_preview !== "undefined" && this.progress >= 1 && Date.now() - splashStartTime < 500))
		{
			isC2SplashDone = true;
			splashIsFadeIn = false;
			splashIsFadeOut = false;
			renderViaCanvas = null;
			renderViaCtx = null;
			this.loaderlogos = null;
		}
		++splashFrameNumber;
	};
	Runtime.prototype.go_loading_finished = function ()
	{
		if (this.overlay_canvas)
		{
			this.canvas.parentNode.removeChild(this.overlay_canvas);
			this.overlay_ctx = null;
			this.overlay_canvas = null;
		}
		this.start_time = Date.now();
		this.last_fps_time = cr.performance_now();       // for counting framerate
		var i, len, t;
		if (this.uses_loader_layout)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (!t.is_family && !t.isOnLoaderLayout && t.plugin.is_world)
				{
					t.onCreate();
					cr.seal(t);
				}
			}
		}
		else
			this.isloading = false;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			this.layouts_by_index[i].createGlobalNonWorlds();
		}
		if (this.fullscreen_mode >= 2)
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
				this.aspect_scale = this.height / this.original_height;
			else
				this.aspect_scale = this.width / this.original_width;
		}
		if (this.first_layout)
			this.layouts[this.first_layout].startRunning();
		else
			this.layouts_by_index[0].startRunning();
;
		if (!this.uses_loader_layout)
		{
			this.loadingprogress = 1;
			this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
			if (window["C2_RegisterSW"])		// note not all platforms use SW
				window["C2_RegisterSW"]();
		}
		if (navigator["splashscreen"] && navigator["splashscreen"]["hide"])
			navigator["splashscreen"]["hide"]();
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onAppBegin)
				t.onAppBegin();
		}
		if (document["hidden"] || document["webkitHidden"] || document["mozHidden"] || document["msHidden"])
		{
			window["cr_setSuspended"](true);		// stop rendering
		}
		else
		{
			this.tick(false);
		}
		if (this.isDirectCanvas)
			AppMobi["webview"]["execute"]("onGameReady();");
	};
	Runtime.prototype.tick = function (background_wake, timestamp, debug_step)
	{
		if (!this.running_layout)
			return;
		var nowtime = cr.performance_now();
		var logic_start = nowtime;
		if (!debug_step && this.isSuspended && !background_wake)
			return;
		if (!background_wake)
		{
			if (raf)
				this.raf_id = raf(this.tickFunc);
			else
			{
				this.timeout_id = setTimeout(this.tickFunc, this.isMobile ? 1 : 16);
			}
		}
		var raf_time = timestamp || nowtime;
		var fsmode = this.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"]) && !this.isCordova;
		if ((isfullscreen || this.isNodeFullscreen) && this.fullscreen_scaling > 0)
			fsmode = this.fullscreen_scaling;
		if (fsmode > 0)	// r222: experimentally enabling this workaround for all platforms
		{
			var curwidth = window.innerWidth;
			var curheight = window.innerHeight;
			if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
			{
				this["setSize"](curwidth, curheight);
			}
		}
		if (!this.isDomFree)
		{
			if (isfullscreen)
			{
				if (!this.firstInFullscreen)
				{
					this.fullscreenOldMarginCss = jQuery(this.canvas).css("margin") || "0";
					this.firstInFullscreen = true;
				}
				if (!this.isChrome && !this.isNWjs)
				{
					jQuery(this.canvas).css({
						"margin-left": "" + Math.floor((screen.width - (this.width / this.devicePixelRatio)) / 2) + "px",
						"margin-top": "" + Math.floor((screen.height - (this.height / this.devicePixelRatio)) / 2) + "px"
					});
				}
			}
			else
			{
				if (this.firstInFullscreen)
				{
					if (!this.isChrome && !this.isNWjs)
					{
						jQuery(this.canvas).css("margin", this.fullscreenOldMarginCss);
					}
					this.fullscreenOldMarginCss = "";
					this.firstInFullscreen = false;
					if (this.fullscreen_mode === 0)
					{
						this["setSize"](Math.round(this.oldWidth / this.devicePixelRatio), Math.round(this.oldHeight / this.devicePixelRatio), true);
					}
				}
				else
				{
					this.oldWidth = this.width;
					this.oldHeight = this.height;
				}
			}
		}
		if (this.isloading)
		{
			var done = this.areAllTexturesAndSoundsLoaded();		// updates this.progress
			this.loadingprogress = this.progress;
			if (done)
			{
				this.isloading = false;
				this.progress = 1;
				this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
				if (window["C2_RegisterSW"])
					window["C2_RegisterSW"]();
			}
		}
		this.logic(raf_time);
		if ((this.redraw || this.isCocoonJs) && !this.is_WebGL_context_lost && !this.suspendDrawing && !background_wake)
		{
			this.redraw = false;
			if (this.glwrap)
				this.drawGL();
			else
				this.draw();
			if (this.snapshotCanvas)
			{
				if (this.canvas && this.canvas.toDataURL)
				{
					this.snapshotData = this.canvas.toDataURL(this.snapshotCanvas[0], this.snapshotCanvas[1]);
					if (window["cr_onSnapshot"])
						window["cr_onSnapshot"](this.snapshotData);
					this.trigger(cr.system_object.prototype.cnds.OnCanvasSnapshot, null);
				}
				this.snapshotCanvas = null;
			}
		}
		if (!this.hit_breakpoint)
		{
			this.tickcount++;
			this.execcount++;
			this.framecount++;
		}
		this.logictime += cr.performance_now() - logic_start;
	};
	Runtime.prototype.logic = function (cur_time)
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		if (cur_time - this.last_fps_time >= 1000)  // every 1 second
		{
			this.last_fps_time += 1000;
			if (cur_time - this.last_fps_time >= 1000)
				this.last_fps_time = cur_time;
			this.fps = this.framecount;
			this.framecount = 0;
			this.cpuutilisation = this.logictime;
			this.logictime = 0;
		}
		var wallDt = 0;
		if (this.last_tick_time !== 0)
		{
			var ms_diff = cur_time - this.last_tick_time;
			if (ms_diff < 0)
				ms_diff = 0;
			wallDt = ms_diff / 1000.0; // dt measured in seconds
			this.dt1 = wallDt;
			if (this.dt1 > 0.5)
				this.dt1 = 0;
			else if (this.dt1 > 1 / this.minimumFramerate)
				this.dt1 = 1 / this.minimumFramerate;
		}
		this.last_tick_time = cur_time;
        this.dt = this.dt1 * this.timescale;
        this.kahanTime.add(this.dt);
		this.wallTime.add(wallDt);		// prevent min/max framerate affecting wall clock
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		if (this.fullscreen_mode >= 2 /* scale */ || (isfullscreen && this.fullscreen_scaling > 0))
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			var mode = this.fullscreen_mode;
			if (isfullscreen && this.fullscreen_scaling > 0)
				mode = this.fullscreen_scaling;
			if ((mode !== 2 && cur_aspect > orig_aspect) || (mode === 2 && cur_aspect < orig_aspect))
			{
				this.aspect_scale = this.height / this.original_height;
			}
			else
			{
				this.aspect_scale = this.width / this.original_width;
			}
			if (this.running_layout)
			{
				this.running_layout.scrollToX(this.running_layout.scrollX);
				this.running_layout.scrollToY(this.running_layout.scrollY);
			}
		}
		else
			this.aspect_scale = (this.isRetina ? this.devicePixelRatio : 1);
		this.ClearDeathRow();
		this.isInOnDestroy++;
		this.system.runWaits();		// prevent instance list changing
		this.isInOnDestroy--;
		this.ClearDeathRow();		// allow instance list changing
		this.isInOnDestroy++;
        var tickarr = this.objects_to_pretick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].pretick();
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					inst.behavior_insts[k].tick();
				}
			}
		}
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.posttick)
						binst.posttick();
				}
			}
		}
        tickarr = this.objects_to_tick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
		this.handleSaveLoad();		// save/load now if queued
		i = 0;
		while (this.changelayout && i++ < 10)
		{
			this.doChangeLayout(this.changelayout);
		}
        for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
            this.eventsheets_by_index[i].hasRun = false;
		if (this.running_layout.event_sheet)
			this.running_layout.event_sheet.run();
		cr.clearArray(this.registered_collisions);
		this.layout_first_tick = false;
		this.isInOnDestroy++;		// prevent instance lists from being changed
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				var inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.tick2)
						binst.tick2();
				}
			}
		}
        tickarr = this.objects_to_tick2.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick2();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
	};
	Runtime.prototype.onWindowBlur = function ()
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (inst.onWindowBlur)
					inst.onWindowBlur();
				if (!inst.behavior_insts)
					continue;	// single-globals don't have behavior_insts
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.onWindowBlur)
						binst.onWindowBlur();
				}
			}
		}
	};
	Runtime.prototype.doChangeLayout = function (changeToLayout)
	{
		var prev_layout = this.running_layout;
		this.running_layout.stopRunning();
		var i, len, j, lenj, k, lenk, type, inst, binst;
		if (this.glwrap)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				type = this.types_by_index[i];
				if (type.is_family)
					continue;
				if (type.unloadTextures && (!type.global || type.instances.length === 0) && changeToLayout.initial_types.indexOf(type) === -1)
				{
					type.unloadTextures();
				}
			}
		}
		if (prev_layout == changeToLayout)
			cr.clearArray(this.system.waits);
		cr.clearArray(this.registered_collisions);
		this.runLayoutChangeMethods(true);
		changeToLayout.startRunning();
		this.runLayoutChangeMethods(false);
		this.redraw = true;
		this.layout_first_tick = true;
		this.ClearDeathRow();
	};
	Runtime.prototype.runLayoutChangeMethods = function (isBeforeChange)
	{
		var i, len, beh, type, j, lenj, inst, k, lenk, binst;
		for (i = 0, len = this.behaviors.length; i < len; i++)
		{
			beh = this.behaviors[i];
			if (isBeforeChange)
			{
				if (beh.onBeforeLayoutChange)
					beh.onBeforeLayoutChange();
			}
			else
			{
				if (beh.onLayoutChange)
					beh.onLayoutChange();
			}
		}
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (!type.global && !type.plugin.singleglobal)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (isBeforeChange)
				{
					if (inst.onBeforeLayoutChange)
						inst.onBeforeLayoutChange();
				}
				else
				{
					if (inst.onLayoutChange)
						inst.onLayoutChange();
				}
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (isBeforeChange)
						{
							if (binst.onBeforeLayoutChange)
								binst.onBeforeLayoutChange();
						}
						else
						{
							if (binst.onLayoutChange)
								binst.onLayoutChange();
						}
					}
				}
			}
		}
	};
	Runtime.prototype.pretickMe = function (inst)
    {
        this.objects_to_pretick.add(inst);
    };
	Runtime.prototype.unpretickMe = function (inst)
	{
		this.objects_to_pretick.remove(inst);
	};
    Runtime.prototype.tickMe = function (inst)
    {
        this.objects_to_tick.add(inst);
    };
	Runtime.prototype.untickMe = function (inst)
	{
		this.objects_to_tick.remove(inst);
	};
	Runtime.prototype.tick2Me = function (inst)
    {
        this.objects_to_tick2.add(inst);
    };
	Runtime.prototype.untick2Me = function (inst)
	{
		this.objects_to_tick2.remove(inst);
	};
    Runtime.prototype.getDt = function (inst)
    {
        if (!inst || inst.my_timescale === -1.0)
            return this.dt;
        return this.dt1 * inst.my_timescale;
    };
	Runtime.prototype.draw = function ()
	{
		this.running_layout.draw(this.ctx);
		if (this.isDirectCanvas)
			this.ctx["present"]();
	};
	Runtime.prototype.drawGL = function ()
	{
		if (this.enableFrontToBack)
		{
			this.earlyz_index = 1;		// start from front, 1-based to avoid exactly equalling near plane Z value
			this.running_layout.drawGL_earlyZPass(this.glwrap);
		}
		this.running_layout.drawGL(this.glwrap);
		this.glwrap.present();
	};
	Runtime.prototype.addDestroyCallback = function (f)
	{
		if (f)
			this.destroycallbacks.push(f);
	};
	Runtime.prototype.removeDestroyCallback = function (f)
	{
		cr.arrayFindRemove(this.destroycallbacks, f);
	};
	Runtime.prototype.getObjectByUID = function (uid_)
	{
;
		var uidstr = uid_.toString();
		if (this.objectsByUid.hasOwnProperty(uidstr))
			return this.objectsByUid[uidstr];
		else
			return null;
	};
	var objectset_cache = [];
	function alloc_objectset()
	{
		if (objectset_cache.length)
			return objectset_cache.pop();
		else
			return new cr.ObjectSet();
	};
	function free_objectset(s)
	{
		s.clear();
		objectset_cache.push(s);
	};
	Runtime.prototype.DestroyInstance = function (inst)
	{
		var i, len;
		var type = inst.type;
		var typename = type.name;
		var has_typename = this.deathRow.hasOwnProperty(typename);
		var obj_set = null;
		if (has_typename)
		{
			obj_set = this.deathRow[typename];
			if (obj_set.contains(inst))
				return;		// already had DestroyInstance called
		}
		else
		{
			obj_set = alloc_objectset();
			this.deathRow[typename] = obj_set;
		}
		obj_set.add(inst);
		this.hasPendingInstances = true;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				this.DestroyInstance(inst.siblings[i]);
			}
		}
		if (this.isInClearDeathRow)
			obj_set.values_cache.push(inst);
		if (!this.isEndingLayout)
		{
			this.isInOnDestroy++;		// support recursion
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
			this.isInOnDestroy--;
		}
	};
	Runtime.prototype.ClearDeathRow = function ()
	{
		if (!this.hasPendingInstances)
			return;
		var inst, type, instances;
		var i, j, leni, lenj, obj_set;
		this.isInClearDeathRow = true;
		for (i = 0, leni = this.createRow.length; i < leni; ++i)
		{
			inst = this.createRow[i];
			type = inst.type;
			type.instances.push(inst);
			for (j = 0, lenj = type.families.length; j < lenj; ++j)
			{
				type.families[j].instances.push(inst);
				type.families[j].stale_iids = true;
			}
		}
		cr.clearArray(this.createRow);
		this.IterateDeathRow();		// moved to separate function so for-in performance doesn't hobble entire function
		cr.wipe(this.deathRow);		// all objectsets have already been recycled
		this.isInClearDeathRow = false;
		this.hasPendingInstances = false;
	};
	Runtime.prototype.IterateDeathRow = function ()
	{
		for (var p in this.deathRow)
		{
			if (this.deathRow.hasOwnProperty(p))
			{
				this.ClearDeathRowForType(this.deathRow[p]);
			}
		}
	};
	Runtime.prototype.ClearDeathRowForType = function (obj_set)
	{
		var arr = obj_set.valuesRef();			// get array of items from set
;
		var type = arr[0].type;
;
;
		var i, len, j, lenj, w, f, layer_instances, inst;
		cr.arrayRemoveAllFromObjectSet(type.instances, obj_set);
		type.stale_iids = true;
		if (type.instances.length === 0)
			type.any_instance_parallaxed = false;
		for (i = 0, len = type.families.length; i < len; ++i)
		{
			f = type.families[i];
			cr.arrayRemoveAllFromObjectSet(f.instances, obj_set);
			f.stale_iids = true;
		}
		for (i = 0, len = this.system.waits.length; i < len; ++i)
		{
			w = this.system.waits[i];
			if (w.sols.hasOwnProperty(type.index))
				cr.arrayRemoveAllFromObjectSet(w.sols[type.index].insts, obj_set);
			if (!type.is_family)
			{
				for (j = 0, lenj = type.families.length; j < lenj; ++j)
				{
					f = type.families[j];
					if (w.sols.hasOwnProperty(f.index))
						cr.arrayRemoveAllFromObjectSet(w.sols[f.index].insts, obj_set);
				}
			}
		}
		var first_layer = arr[0].layer;
		if (first_layer)
		{
			if (first_layer.useRenderCells)
			{
				layer_instances = first_layer.instances;
				for (i = 0, len = layer_instances.length; i < len; ++i)
				{
					inst = layer_instances[i];
					if (!obj_set.contains(inst))
						continue;		// not destroying this instance
					inst.update_bbox();
					first_layer.render_grid.update(inst, inst.rendercells, null);
					inst.rendercells.set(0, 0, -1, -1);
				}
			}
			cr.arrayRemoveAllFromObjectSet(first_layer.instances, obj_set);
			first_layer.setZIndicesStaleFrom(0);
		}
		for (i = 0; i < arr.length; ++i)		// check array length every time in case it changes
		{
			this.ClearDeathRowForSingleInstance(arr[i], type);
		}
		free_objectset(obj_set);
		this.redraw = true;
	};
	Runtime.prototype.ClearDeathRowForSingleInstance = function (inst, type)
	{
		var i, len, binst;
		for (i = 0, len = this.destroycallbacks.length; i < len; ++i)
			this.destroycallbacks[i](inst);
		if (inst.collcells)
		{
			type.collision_grid.update(inst, inst.collcells, null);
		}
		var layer = inst.layer;
		if (layer)
		{
			layer.removeFromInstanceList(inst, true);		// remove from both instance list and render grid
		}
		if (inst.behavior_insts)
		{
			for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
			{
				binst = inst.behavior_insts[i];
				if (binst.onDestroy)
					binst.onDestroy();
				binst.behavior.my_instances.remove(inst);
			}
		}
		this.objects_to_pretick.remove(inst);
		this.objects_to_tick.remove(inst);
		this.objects_to_tick2.remove(inst);
		if (inst.onDestroy)
			inst.onDestroy();
		if (this.objectsByUid.hasOwnProperty(inst.uid.toString()))
			delete this.objectsByUid[inst.uid.toString()];
		this.objectcount--;
		if (type.deadCache.length < 100)
			type.deadCache.push(inst);
	};
	Runtime.prototype.createInstance = function (type, layer, sx, sy)
	{
		if (type.is_family)
		{
			var i = cr.floor(Math.random() * type.members.length);
			return this.createInstance(type.members[i], layer, sx, sy);
		}
		if (!type.default_instance)
		{
			return null;
		}
		return this.createInstanceFromInit(type.default_instance, layer, false, sx, sy, false);
	};
	var all_behaviors = [];
	Runtime.prototype.createInstanceFromInit = function (initial_inst, layer, is_startup_instance, sx, sy, skip_siblings)
	{
		var i, len, j, lenj, p, effect_fallback, x, y;
		if (!initial_inst)
			return null;
		var type = this.types_by_index[initial_inst[1]];
;
;
		var is_world = type.plugin.is_world;
;
		if (this.isloading && is_world && !type.isOnLoaderLayout)
			return null;
		if (is_world && !this.glwrap && initial_inst[0][11] === 11)
			return null;
		var original_layer = layer;
		if (!is_world)
			layer = null;
		var inst;
		if (type.deadCache.length)
		{
			inst = type.deadCache.pop();
			inst.recycled = true;
			type.plugin.Instance.call(inst, type);
		}
		else
		{
			inst = new type.plugin.Instance(type);
			inst.recycled = false;
		}
		if (is_startup_instance && !skip_siblings && !this.objectsByUid.hasOwnProperty(initial_inst[2].toString()))
			inst.uid = initial_inst[2];
		else
			inst.uid = this.next_uid++;
		this.objectsByUid[inst.uid.toString()] = inst;
		inst.puid = this.next_puid++;
		inst.iid = type.instances.length;
		for (i = 0, len = this.createRow.length; i < len; ++i)
		{
			if (this.createRow[i].type === type)
				inst.iid++;
		}
		inst.get_iid = cr.inst_get_iid;
		inst.toString = cr.inst_toString;
		var initial_vars = initial_inst[3];
		if (inst.recycled)
		{
			cr.wipe(inst.extra);
		}
		else
		{
			inst.extra = {};
			if (typeof cr_is_preview !== "undefined")
			{
				inst.instance_var_names = [];
				inst.instance_var_names.length = initial_vars.length;
				for (i = 0, len = initial_vars.length; i < len; i++)
					inst.instance_var_names[i] = initial_vars[i][1];
			}
			inst.instance_vars = [];
			inst.instance_vars.length = initial_vars.length;
		}
		for (i = 0, len = initial_vars.length; i < len; i++)
			inst.instance_vars[i] = initial_vars[i][0];
		if (is_world)
		{
			var wm = initial_inst[0];
;
			inst.x = cr.is_undefined(sx) ? wm[0] : sx;
			inst.y = cr.is_undefined(sy) ? wm[1] : sy;
			inst.z = wm[2];
			inst.width = wm[3];
			inst.height = wm[4];
			inst.depth = wm[5];
			inst.angle = wm[6];
			inst.opacity = wm[7];
			inst.hotspotX = wm[8];
			inst.hotspotY = wm[9];
			inst.blend_mode = wm[10];
			effect_fallback = wm[11];
			if (!this.glwrap && type.effect_types.length)	// no WebGL renderer and shaders used
				inst.blend_mode = effect_fallback;			// use fallback blend mode - destroy mode was handled above
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			if (inst.recycled)
			{
				for (i = 0, len = wm[12].length; i < len; i++)
				{
					for (j = 0, lenj = wm[12][i].length; j < lenj; j++)
						inst.effect_params[i][j] = wm[12][i][j];
				}
				inst.bbox.set(0, 0, 0, 0);
				inst.collcells.set(0, 0, -1, -1);
				inst.rendercells.set(0, 0, -1, -1);
				inst.bquad.set_from_rect(inst.bbox);
				cr.clearArray(inst.bbox_changed_callbacks);
			}
			else
			{
				inst.effect_params = wm[12].slice(0);
				for (i = 0, len = inst.effect_params.length; i < len; i++)
					inst.effect_params[i] = wm[12][i].slice(0);
				inst.active_effect_types = [];
				inst.active_effect_flags = [];
				inst.active_effect_flags.length = type.effect_types.length;
				inst.bbox = new cr.rect(0, 0, 0, 0);
				inst.collcells = new cr.rect(0, 0, -1, -1);
				inst.rendercells = new cr.rect(0, 0, -1, -1);
				inst.bquad = new cr.quad();
				inst.bbox_changed_callbacks = [];
				inst.set_bbox_changed = cr.set_bbox_changed;
				inst.add_bbox_changed_callback = cr.add_bbox_changed_callback;
				inst.contains_pt = cr.inst_contains_pt;
				inst.update_bbox = cr.update_bbox;
				inst.update_render_cell = cr.update_render_cell;
				inst.update_collision_cell = cr.update_collision_cell;
				inst.get_zindex = cr.inst_get_zindex;
			}
			inst.tilemap_exists = false;
			inst.tilemap_width = 0;
			inst.tilemap_height = 0;
			inst.tilemap_data = null;
			if (wm.length === 14)
			{
				inst.tilemap_exists = true;
				inst.tilemap_width = wm[13][0];
				inst.tilemap_height = wm[13][1];
				inst.tilemap_data = wm[13][2];
			}
			for (i = 0, len = type.effect_types.length; i < len; i++)
				inst.active_effect_flags[i] = true;
			inst.shaders_preserve_opaqueness = true;
			inst.updateActiveEffects = cr.inst_updateActiveEffects;
			inst.updateActiveEffects();
			inst.uses_shaders = !!inst.active_effect_types.length;
			inst.bbox_changed = true;
			inst.cell_changed = true;
			type.any_cell_changed = true;
			inst.visible = true;
            inst.my_timescale = -1.0;
			inst.layer = layer;
			inst.zindex = layer.instances.length;	// will be placed at top of current layer
			inst.earlyz_index = 0;
			if (typeof inst.collision_poly === "undefined")
				inst.collision_poly = null;
			inst.collisionsEnabled = true;
			this.redraw = true;
		}
		var initial_props, binst;
		cr.clearArray(all_behaviors);
		for (i = 0, len = type.families.length; i < len; i++)
		{
			all_behaviors.push.apply(all_behaviors, type.families[i].behaviors);
		}
		all_behaviors.push.apply(all_behaviors, type.behaviors);
		if (inst.recycled)
		{
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				binst = inst.behavior_insts[i];
				binst.recycled = true;
				btype.behavior.Instance.call(binst, btype, inst);
				initial_props = initial_inst[4][i];
				for (j = 0, lenj = initial_props.length; j < lenj; j++)
					binst.properties[j] = initial_props[j];
				binst.onCreate();
				btype.behavior.my_instances.add(inst);
			}
		}
		else
		{
			inst.behavior_insts = [];
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				var binst = new btype.behavior.Instance(btype, inst);
				binst.recycled = false;
				binst.properties = initial_inst[4][i].slice(0);
				binst.onCreate();
				cr.seal(binst);
				inst.behavior_insts.push(binst);
				btype.behavior.my_instances.add(inst);
			}
		}
		initial_props = initial_inst[5];
		if (inst.recycled)
		{
			for (i = 0, len = initial_props.length; i < len; i++)
				inst.properties[i] = initial_props[i];
		}
		else
			inst.properties = initial_props.slice(0);
		this.createRow.push(inst);
		this.hasPendingInstances = true;
		if (layer)
		{
;
			layer.appendToInstanceList(inst, true);
			if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
				type.any_instance_parallaxed = true;
		}
		this.objectcount++;
		if (type.is_contained)
		{
			inst.is_contained = true;
			if (inst.recycled)
				cr.clearArray(inst.siblings);
			else
				inst.siblings = [];			// note: should not include self in siblings
			if (!is_startup_instance && !skip_siblings)	// layout links initial instances
			{
				for (i = 0, len = type.container.length; i < len; i++)
				{
					if (type.container[i] === type)
						continue;
					if (!type.container[i].default_instance)
					{
						return null;
					}
					inst.siblings.push(this.createInstanceFromInit(type.container[i].default_instance, original_layer, false, is_world ? inst.x : sx, is_world ? inst.y : sy, true));
				}
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					inst.siblings[i].siblings.push(inst);
					for (j = 0; j < len; j++)
					{
						if (i !== j)
							inst.siblings[i].siblings.push(inst.siblings[j]);
					}
				}
			}
		}
		else
		{
			inst.is_contained = false;
			inst.siblings = null;
		}
		inst.onCreate();
		if (!inst.recycled)
			cr.seal(inst);
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].postCreate)
				inst.behavior_insts[i].postCreate();
		}
		return inst;
	};
	Runtime.prototype.getLayerByName = function (layer_name)
	{
		var i, len;
		for (i = 0, len = this.running_layout.layers.length; i < len; i++)
		{
			var layer = this.running_layout.layers[i];
			if (cr.equals_nocase(layer.name, layer_name))
				return layer;
		}
		return null;
	};
	Runtime.prototype.getLayerByNumber = function (index)
	{
		index = cr.floor(index);
		if (index < 0)
			index = 0;
		if (index >= this.running_layout.layers.length)
			index = this.running_layout.layers.length - 1;
		return this.running_layout.layers[index];
	};
	Runtime.prototype.getLayer = function (l)
	{
		if (cr.is_number(l))
			return this.getLayerByNumber(l);
		else
			return this.getLayerByName(l.toString());
	};
	Runtime.prototype.clearSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].getCurrentSol().select_all = true;
		}
	};
	Runtime.prototype.pushCleanSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCleanSol();
		}
	};
	Runtime.prototype.pushCopySol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCopySol();
		}
	};
	Runtime.prototype.popSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].popSol();
		}
	};
	Runtime.prototype.updateAllCells = function (type)
	{
		if (!type.any_cell_changed)
			return;		// all instances must already be up-to-date
		var i, len, instances = type.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].update_collision_cell();
		}
		var createRow = this.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === type)
				createRow[i].update_collision_cell();
		}
		type.any_cell_changed = false;
	};
	Runtime.prototype.getCollisionCandidates = function (layer, rtype, bbox, candidates)
	{
		var i, len, t;
		var is_parallaxed = (layer ? (layer.parallaxX !== 1 || layer.parallaxY !== 1) : false);
		if (rtype.is_family)
		{
			for (i = 0, len = rtype.members.length; i < len; ++i)
			{
				t = rtype.members[i];
				if (is_parallaxed || t.any_instance_parallaxed)
				{
					cr.appendArray(candidates, t.instances);
				}
				else
				{
					this.updateAllCells(t);
					t.collision_grid.queryRange(bbox, candidates);
				}
			}
		}
		else
		{
			if (is_parallaxed || rtype.any_instance_parallaxed)
			{
				cr.appendArray(candidates, rtype.instances);
			}
			else
			{
				this.updateAllCells(rtype);
				rtype.collision_grid.queryRange(bbox, candidates);
			}
		}
	};
	Runtime.prototype.getTypesCollisionCandidates = function (layer, types, bbox, candidates)
	{
		var i, len;
		for (i = 0, len = types.length; i < len; ++i)
		{
			this.getCollisionCandidates(layer, types[i], bbox, candidates);
		}
	};
	Runtime.prototype.getSolidCollisionCandidates = function (layer, bbox, candidates)
	{
		var solid = this.getSolidBehavior();
		if (!solid)
			return null;
		this.getTypesCollisionCandidates(layer, solid.my_types, bbox, candidates);
	};
	Runtime.prototype.getJumpthruCollisionCandidates = function (layer, bbox, candidates)
	{
		var jumpthru = this.getJumpthruBehavior();
		if (!jumpthru)
			return null;
		this.getTypesCollisionCandidates(layer, jumpthru.my_types, bbox, candidates);
	};
	Runtime.prototype.testAndSelectCanvasPointOverlap = function (type, ptx, pty, inverted)
	{
		var sol = type.getCurrentSol();
		var i, j, inst, len;
		var orblock = this.getCurrentEventStack().current_event.orblock;
		var lx, ly, arr;
		if (sol.select_all)
		{
			if (!inverted)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);   // clear contents
			}
			for (i = 0, len = type.instances.length; i < len; i++)
			{
				inst = type.instances[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else
						sol.instances.push(inst);
				}
				else if (orblock)
					sol.else_instances.push(inst);
			}
		}
		else
		{
			j = 0;
			arr = (orblock ? sol.else_instances : sol.instances);
			for (i = 0, len = arr.length; i < len; i++)
			{
				inst = arr[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else if (orblock)
						sol.instances.push(inst);
					else
					{
						sol.instances[j] = sol.instances[i];
						j++;
					}
				}
			}
			if (!inverted)
				arr.length = j;
		}
		type.applySolToContainer();
		if (inverted)
			return true;		// did not find anything overlapping
		else
			return sol.hasObjects();
	};
	Runtime.prototype.testOverlap = function (a, b)
	{
		if (!a || !b || a === b || !a.collisionsEnabled || !b.collisionsEnabled)
			return false;
		a.update_bbox();
		b.update_bbox();
		var layera = a.layer;
		var layerb = b.layer;
		var different_layers = (layera !== layerb && (layera.parallaxX !== layerb.parallaxX || layerb.parallaxY !== layerb.parallaxY || layera.scale !== layerb.scale || layera.angle !== layerb.angle || layera.zoomRate !== layerb.zoomRate));
		var i, len, i2, i21, x, y, haspolya, haspolyb, polya, polyb;
		if (!different_layers)	// same layers: easy check
		{
			if (!a.bbox.intersects_rect(b.bbox))
				return false;
			if (!a.bquad.intersects_quad(b.bquad))
				return false;
			if (a.tilemap_exists && b.tilemap_exists)
				return false;
			if (a.tilemap_exists)
				return this.testTilemapOverlap(a, b);
			if (b.tilemap_exists)
				return this.testTilemapOverlap(b, a);
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolya && !haspolyb)
				return true;
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				polya = a.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
				polya = this.temp_poly;
			}
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				polyb = b.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
				polyb = this.temp_poly;
			}
			return polya.intersects_poly(polyb, b.x - a.x, b.y - a.y);
		}
		else	// different layers: need to do full translated check
		{
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				this.temp_poly.set_from_poly(a.collision_poly);
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
			}
			polya = this.temp_poly;
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				this.temp_poly2.set_from_poly(b.collision_poly);
			}
			else
			{
				this.temp_poly2.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
			}
			polyb = this.temp_poly2;
			for (i = 0, len = polya.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polya.pts_cache[i2];
				y = polya.pts_cache[i21];
				polya.pts_cache[i2] = layera.layerToCanvas(x + a.x, y + a.y, true);
				polya.pts_cache[i21] = layera.layerToCanvas(x + a.x, y + a.y, false);
			}
			polya.update_bbox();
			for (i = 0, len = polyb.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polyb.pts_cache[i2];
				y = polyb.pts_cache[i21];
				polyb.pts_cache[i2] = layerb.layerToCanvas(x + b.x, y + b.y, true);
				polyb.pts_cache[i21] = layerb.layerToCanvas(x + b.x, y + b.y, false);
			}
			polyb.update_bbox();
			return polya.intersects_poly(polyb, 0, 0);
		}
	};
	var tmpQuad = new cr.quad();
	var tmpRect = new cr.rect(0, 0, 0, 0);
	var collrect_candidates = [];
	Runtime.prototype.testTilemapOverlap = function (tm, a)
	{
		var i, len, c, rc;
		var bbox = a.bbox;
		var tmx = tm.x;
		var tmy = tm.y;
		tm.getCollisionRectCandidates(bbox, collrect_candidates);
		var collrects = collrect_candidates;
		var haspolya = (a.collision_poly && !a.collision_poly.is_empty());
		for (i = 0, len = collrects.length; i < len; ++i)
		{
			c = collrects[i];
			rc = c.rc;
			if (bbox.intersects_rect_off(rc, tmx, tmy))
			{
				tmpQuad.set_from_rect(rc);
				tmpQuad.offset(tmx, tmy);
				if (tmpQuad.intersects_quad(a.bquad))
				{
					if (haspolya)
					{
						a.collision_poly.cache_poly(a.width, a.height, a.angle);
						if (c.poly)
						{
							if (c.poly.intersects_poly(a.collision_poly, a.x - (tmx + rc.left), a.y - (tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							this.temp_poly.set_from_quad(tmpQuad, 0, 0, rc.right - rc.left, rc.bottom - rc.top);
							if (this.temp_poly.intersects_poly(a.collision_poly, a.x, a.y))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
					}
					else
					{
						if (c.poly)
						{
							this.temp_poly.set_from_quad(a.bquad, 0, 0, a.width, a.height);
							if (c.poly.intersects_poly(this.temp_poly, -(tmx + rc.left), -(tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
		}
		cr.clearArray(collrect_candidates);
		return false;
	};
	Runtime.prototype.testRectOverlap = function (r, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		if (!b.bbox.intersects_rect(r))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(r, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (r.intersects_rect_off(tilerc, tmx, tmy))
				{
					if (c.poly)
					{
						this.temp_poly.set_from_rect(r, 0, 0);
						if (c.poly.intersects_poly(this.temp_poly, -(tmx + tilerc.left), -(tmy + tilerc.top)))
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
					else
					{
						cr.clearArray(collrect_candidates);
						return true;
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			tmpQuad.set_from_rect(r);
			if (!b.bquad.intersects_quad(tmpQuad))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			tmpQuad.offset(-r.left, -r.top);
			this.temp_poly.set_from_quad(tmpQuad, 0, 0, 1, 1);
			return b.collision_poly.intersects_poly(this.temp_poly, r.left - b.x, r.top - b.y);
		}
	};
	Runtime.prototype.testSegmentOverlap = function (x1, y1, x2, y2, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		tmpRect.set(cr.min(x1, x2), cr.min(y1, y2), cr.max(x1, x2), cr.max(y1, y2));
		if (!b.bbox.intersects_rect(tmpRect))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(tmpRect, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (tmpRect.intersects_rect_off(tilerc, tmx, tmy))
				{
					tmpQuad.set_from_rect(tilerc);
					tmpQuad.offset(tmx, tmy);
					if (tmpQuad.intersects_segment(x1, y1, x2, y2))
					{
						if (c.poly)
						{
							if (c.poly.intersects_segment(tmx + tilerc.left, tmy + tilerc.top, x1, y1, x2, y2))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			if (!b.bquad.intersects_segment(x1, y1, x2, y2))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			return b.collision_poly.intersects_segment(b.x, b.y, x1, y1, x2, y2);
		}
	};
	Runtime.prototype.typeHasBehavior = function (t, b)
	{
		if (!b)
			return false;
		var i, len, j, lenj, f;
		for (i = 0, len = t.behaviors.length; i < len; i++)
		{
			if (t.behaviors[i].behavior instanceof b)
				return true;
		}
		if (!t.is_family)
		{
			for (i = 0, len = t.families.length; i < len; i++)
			{
				f = t.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (f.behaviors[j].behavior instanceof b)
						return true;
				}
			}
		}
		return false;
	};
	Runtime.prototype.typeHasNoSaveBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.NoSave);
	};
	Runtime.prototype.typeHasPersistBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.Persist);
	};
	Runtime.prototype.getSolidBehavior = function ()
	{
		return this.solidBehavior;
	};
	Runtime.prototype.getJumpthruBehavior = function ()
	{
		return this.jumpthruBehavior;
	};
	var candidates = [];
	Runtime.prototype.testOverlapSolid = function (inst)
	{
		var i, len, s;
		inst.update_bbox();
		this.getSolidCollisionCandidates(inst.layer, inst.bbox, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testOverlap(inst, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	Runtime.prototype.testRectOverlapSolid = function (r)
	{
		var i, len, s;
		this.getSolidCollisionCandidates(null, r, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testRectOverlap(r, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	var jumpthru_array_ret = [];
	Runtime.prototype.testOverlapJumpThru = function (inst, all)
	{
		var ret = null;
		if (all)
		{
			ret = jumpthru_array_ret;
			cr.clearArray(ret);
		}
		inst.update_bbox();
		this.getJumpthruCollisionCandidates(inst.layer, inst.bbox, candidates);
		var i, len, j;
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			j = candidates[i];
			if (!j.extra["jumpthruEnabled"])
				continue;
			if (this.testOverlap(inst, j))
			{
				if (all)
					ret.push(j);
				else
				{
					cr.clearArray(candidates);
					return j;
				}
			}
		}
		cr.clearArray(candidates);
		return ret;
	};
	Runtime.prototype.pushOutSolid = function (inst, xdir, ydir, dist, include_jumpthrus, specific_jumpthru)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		var last_overlapped = null, secondlast_overlapped = null;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (last_overlapped)
					secondlast_overlapped = last_overlapped;
				if (!last_overlapped)
				{
					if (include_jumpthrus)
					{
						if (specific_jumpthru)
							last_overlapped = (this.testOverlap(inst, specific_jumpthru) ? specific_jumpthru : null);
						else
							last_overlapped = this.testOverlapJumpThru(inst);
						if (last_overlapped)
							secondlast_overlapped = last_overlapped;
					}
					if (!last_overlapped)
					{
						if (secondlast_overlapped)
							this.pushInFractional(inst, xdir, ydir, secondlast_overlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOut = function (inst, xdir, ydir, dist, otherinst)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, otherinst))
				return true;
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushInFractional = function (inst, xdir, ydir, obj, limit)
	{
		var divisor = 2;
		var frac;
		var forward = false;
		var overlapping = false;
		var bestx = inst.x;
		var besty = inst.y;
		while (divisor <= limit)
		{
			frac = 1 / divisor;
			divisor *= 2;
			inst.x += xdir * frac * (forward ? 1 : -1);
			inst.y += ydir * frac * (forward ? 1 : -1);
			inst.set_bbox_changed();
			if (this.testOverlap(inst, obj))
			{
				forward = true;
				overlapping = true;
			}
			else
			{
				forward = false;
				overlapping = false;
				bestx = inst.x;
				besty = inst.y;
			}
		}
		if (overlapping)
		{
			inst.x = bestx;
			inst.y = besty;
			inst.set_bbox_changed();
		}
	};
	Runtime.prototype.pushOutSolidNearest = function (inst, max_dist_)
	{
		var max_dist = (cr.is_undefined(max_dist_) ? 100 : max_dist_);
		var dist = 0;
		var oldx = inst.x
		var oldy = inst.y;
		var dir = 0;
		var dx = 0, dy = 0;
		var last_overlapped = this.testOverlapSolid(inst);
		if (!last_overlapped)
			return true;		// already clear of solids
		while (dist <= max_dist)
		{
			switch (dir) {
			case 0:		dx = 0; dy = -1; dist++; break;
			case 1:		dx = 1; dy = -1; break;
			case 2:		dx = 1; dy = 0; break;
			case 3:		dx = 1; dy = 1; break;
			case 4:		dx = 0; dy = 1; break;
			case 5:		dx = -1; dy = 1; break;
			case 6:		dx = -1; dy = 0; break;
			case 7:		dx = -1; dy = -1; break;
			}
			dir = (dir + 1) % 8;
			inst.x = cr.floor(oldx + (dx * dist));
			inst.y = cr.floor(oldy + (dy * dist));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (!last_overlapped)
					return true;
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.registerCollision = function (a, b)
	{
		if (!a.collisionsEnabled || !b.collisionsEnabled)
			return;
		this.registered_collisions.push([a, b]);
	};
	Runtime.prototype.checkRegisteredCollision = function (a, b)
	{
		var i, len, x;
		for (i = 0, len = this.registered_collisions.length; i < len; i++)
		{
			x = this.registered_collisions[i];
			if ((x[0] == a && x[1] == b) || (x[0] == b && x[1] == a))
				return true;
		}
		return false;
	};
	Runtime.prototype.calculateSolidBounceAngle = function(inst, startx, starty, obj)
	{
		var objx = inst.x;
		var objy = inst.y;
		var radius = cr.max(10, cr.distanceTo(startx, starty, objx, objy));
		var startangle = cr.angleTo(startx, starty, objx, objy);
		var firstsolid = obj || this.testOverlapSolid(inst);
		if (!firstsolid)
			return cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		var i, curangle, anticlockwise_free_angle, clockwise_free_angle;
		var increment = cr.to_radians(5);	// 5 degree increments
		for (i = 1; i < 36; i++)
		{
			curangle = startangle - i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					anticlockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			anticlockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		for (i = 1; i < 36; i++)
		{
			curangle = startangle + i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					clockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			clockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		inst.x = objx;
		inst.y = objy;
		inst.set_bbox_changed();
		if (clockwise_free_angle === anticlockwise_free_angle)
			return clockwise_free_angle;
		var half_diff = cr.angleDiff(clockwise_free_angle, anticlockwise_free_angle) / 2;
		var normal;
		if (cr.angleClockwise(clockwise_free_angle, anticlockwise_free_angle))
		{
			normal = cr.clamp_angle(anticlockwise_free_angle + half_diff + cr.PI);
		}
		else
		{
			normal = cr.clamp_angle(clockwise_free_angle + half_diff);
		}
;
		var vx = Math.cos(startangle);
		var vy = Math.sin(startangle);
		var nx = Math.cos(normal);
		var ny = Math.sin(normal);
		var v_dot_n = vx * nx + vy * ny;
		var rx = vx - 2 * v_dot_n * nx;
		var ry = vy - 2 * v_dot_n * ny;
		return cr.angleTo(0, 0, rx, ry);
	};
	var triggerSheetIndex = -1;
	Runtime.prototype.trigger = function (method, inst, value /* for fast triggers */)
	{
;
		if (!this.running_layout)
			return false;
		var sheet = this.running_layout.event_sheet;
		if (!sheet)
			return false;     // no event sheet active; nothing to trigger
		var ret = false;
		var r, i, len;
		triggerSheetIndex++;
		var deep_includes = sheet.deep_includes;
		for (i = 0, len = deep_includes.length; i < len; ++i)
		{
			r = this.triggerOnSheet(method, inst, deep_includes[i], value);
			ret = ret || r;
		}
		r = this.triggerOnSheet(method, inst, sheet, value);
		ret = ret || r;
		triggerSheetIndex--;
		return ret;
    };
    Runtime.prototype.triggerOnSheet = function (method, inst, sheet, value)
    {
        var ret = false;
		var i, leni, r, families;
		if (!inst)
		{
			r = this.triggerOnSheetForTypeName(method, inst, "system", sheet, value);
			ret = ret || r;
		}
		else
		{
			r = this.triggerOnSheetForTypeName(method, inst, inst.type.name, sheet, value);
			ret = ret || r;
			families = inst.type.families;
			for (i = 0, leni = families.length; i < leni; ++i)
			{
				r = this.triggerOnSheetForTypeName(method, inst, families[i].name, sheet, value);
				ret = ret || r;
			}
		}
		return ret;             // true if anything got triggered
	};
	Runtime.prototype.triggerOnSheetForTypeName = function (method, inst, type_name, sheet, value)
	{
		var i, leni;
		var ret = false, ret2 = false;
		var trig, index;
		var fasttrigger = (typeof value !== "undefined");
		var triggers = (fasttrigger ? sheet.fasttriggers : sheet.triggers);
		var obj_entry = triggers[type_name];
		if (!obj_entry)
			return ret;
		var triggers_list = null;
		for (i = 0, leni = obj_entry.length; i < leni; ++i)
		{
			if (obj_entry[i].method == method)
			{
				triggers_list = obj_entry[i].evs;
				break;
			}
		}
		if (!triggers_list)
			return ret;
		var triggers_to_fire;
		if (fasttrigger)
		{
			triggers_to_fire = triggers_list[value];
		}
		else
		{
			triggers_to_fire = triggers_list;
		}
		if (!triggers_to_fire)
			return null;
		for (i = 0, leni = triggers_to_fire.length; i < leni; i++)
		{
			trig = triggers_to_fire[i][0];
			index = triggers_to_fire[i][1];
			ret2 = this.executeSingleTrigger(inst, type_name, trig, index);
			ret = ret || ret2;
		}
		return ret;
	};
	Runtime.prototype.executeSingleTrigger = function (inst, type_name, trig, index)
	{
		var i, leni;
		var ret = false;
		this.trigger_depth++;
		var current_event = this.getCurrentEventStack().current_event;
		if (current_event)
			this.pushCleanSol(current_event.solModifiersIncludingParents);
		var isrecursive = (this.trigger_depth > 1);		// calling trigger from inside another trigger
		this.pushCleanSol(trig.solModifiersIncludingParents);
		if (isrecursive)
			this.pushLocalVarStack();
		var event_stack = this.pushEventStack(trig);
		event_stack.current_event = trig;
		if (inst)
		{
			var sol = this.types[type_name].getCurrentSol();
			sol.select_all = false;
			cr.clearArray(sol.instances);
			sol.instances[0] = inst;
			this.types[type_name].applySolToContainer();
		}
		var ok_to_run = true;
		if (trig.parent)
		{
			var temp_parents_arr = event_stack.temp_parents_arr;
			var cur_parent = trig.parent;
			while (cur_parent)
			{
				temp_parents_arr.push(cur_parent);
				cur_parent = cur_parent.parent;
			}
			temp_parents_arr.reverse();
			for (i = 0, leni = temp_parents_arr.length; i < leni; i++)
			{
				if (!temp_parents_arr[i].run_pretrigger())   // parent event failed
				{
					ok_to_run = false;
					break;
				}
			}
		}
		if (ok_to_run)
		{
			this.execcount++;
			if (trig.orblock)
				trig.run_orblocktrigger(index);
			else
				trig.run();
			ret = ret || event_stack.last_event_true;
		}
		this.popEventStack();
		if (isrecursive)
			this.popLocalVarStack();
		this.popSol(trig.solModifiersIncludingParents);
		if (current_event)
			this.popSol(current_event.solModifiersIncludingParents);
		if (this.hasPendingInstances && this.isInOnDestroy === 0 && triggerSheetIndex === 0 && !this.isRunningEvents)
		{
			this.ClearDeathRow();
		}
		this.trigger_depth--;
		return ret;
	};
	Runtime.prototype.getCurrentCondition = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.conditions[evinfo.cndindex];
	};
	Runtime.prototype.getCurrentConditionObjectType = function ()
	{
		var cnd = this.getCurrentCondition();
		return cnd.type;
	};
	Runtime.prototype.isCurrentConditionFirst = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.cndindex === 0;
	};
	Runtime.prototype.getCurrentAction = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.actions[evinfo.actindex];
	};
	Runtime.prototype.pushLocalVarStack = function ()
	{
		this.localvar_stack_index++;
		if (this.localvar_stack_index >= this.localvar_stack.length)
			this.localvar_stack.push([]);
	};
	Runtime.prototype.popLocalVarStack = function ()
	{
;
		this.localvar_stack_index--;
	};
	Runtime.prototype.getCurrentLocalVarStack = function ()
	{
		return this.localvar_stack[this.localvar_stack_index];
	};
	Runtime.prototype.pushEventStack = function (cur_event)
	{
		this.event_stack_index++;
		if (this.event_stack_index >= this.event_stack.length)
			this.event_stack.push(new cr.eventStackFrame());
		var ret = this.getCurrentEventStack();
		ret.reset(cur_event);
		return ret;
	};
	Runtime.prototype.popEventStack = function ()
	{
;
		this.event_stack_index--;
	};
	Runtime.prototype.getCurrentEventStack = function ()
	{
		return this.event_stack[this.event_stack_index];
	};
	Runtime.prototype.pushLoopStack = function (name_)
	{
		this.loop_stack_index++;
		if (this.loop_stack_index >= this.loop_stack.length)
		{
			this.loop_stack.push(cr.seal({ name: name_, index: 0, stopped: false }));
		}
		var ret = this.getCurrentLoop();
		ret.name = name_;
		ret.index = 0;
		ret.stopped = false;
		return ret;
	};
	Runtime.prototype.popLoopStack = function ()
	{
;
		this.loop_stack_index--;
	};
	Runtime.prototype.getCurrentLoop = function ()
	{
		return this.loop_stack[this.loop_stack_index];
	};
	Runtime.prototype.getEventVariableByName = function (name, scope)
	{
		var i, leni, j, lenj, sheet, e;
		while (scope)
		{
			for (i = 0, leni = scope.subevents.length; i < leni; i++)
			{
				e = scope.subevents[i];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
			scope = scope.parent;
		}
		for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
		{
			sheet = this.eventsheets_by_index[i];
			for (j = 0, lenj = sheet.events.length; j < lenj; j++)
			{
				e = sheet.events[j];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
		}
		return null;
	};
	Runtime.prototype.getLayoutBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			if (this.layouts_by_index[i].sid === sid_)
				return this.layouts_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getObjectTypeBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			if (this.types_by_index[i].sid === sid_)
				return this.types_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getGroupBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			if (this.allGroups[i].sid === sid_)
				return this.allGroups[i];
		}
		return null;
	};
	Runtime.prototype.doCanvasSnapshot = function (format_, quality_)
	{
		this.snapshotCanvas = [format_, quality_];
		this.redraw = true;		// force redraw so snapshot is always taken
	};
	function IsIndexedDBAvailable()
	{
		try {
			return !!window.indexedDB;
		}
		catch (e)
		{
			return false;
		}
	};
	function makeSaveDb(e)
	{
		var db = e.target.result;
		db.createObjectStore("saves", { keyPath: "slot" });
	};
	function IndexedDB_WriteSlot(slot_, data_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"], "readwrite");
				var objectStore = transaction.objectStore("saves");
				var putReq = objectStore.put({"slot": slot_, "data": data_ });
				putReq.onsuccess = oncomplete_;
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	function IndexedDB_ReadSlot(slot_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"]);
				var objectStore = transaction.objectStore("saves");
				var readReq = objectStore.get(slot_);
				readReq.onsuccess = function (e)
				{
					if (readReq.result)
						oncomplete_(readReq.result["data"]);
					else
						oncomplete_(null);
				};
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	Runtime.prototype.signalContinuousPreview = function ()
	{
		this.signalledContinuousPreview = true;
	};
	function doContinuousPreviewReload()
	{
		cr.logexport("Reloading for continuous preview");
		if (!!window["c2cocoonjs"])
		{
			CocoonJS["App"]["reload"]();
		}
		else
		{
			if (window.location.search.indexOf("continuous") > -1)
				window.location.reload(true);
			else
				window.location = window.location + "?continuous";
		}
	};
	Runtime.prototype.handleSaveLoad = function ()
	{
		var self = this;
		var savingToSlot = this.saveToSlot;
		var savingJson = this.lastSaveJson;
		var loadingFromSlot = this.loadFromSlot;
		var continuous = false;
		if (this.signalledContinuousPreview)
		{
			continuous = true;
			savingToSlot = "__c2_continuouspreview";
			this.signalledContinuousPreview = false;
		}
		if (savingToSlot.length)
		{
			this.ClearDeathRow();
			savingJson = this.saveToJSONString();
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_WriteSlot(savingToSlot, savingJson, function ()
				{
					cr.logexport("Saved state to IndexedDB storage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}, function (e)
				{
					try {
						localStorage.setItem("__c2save_" + savingToSlot, savingJson);
						cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
						self.lastSaveJson = savingJson;
						self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
						self.lastSaveJson = "";
						if (continuous)
							doContinuousPreviewReload();
					}
					catch (f)
					{
						cr.logexport("Failed to save game state: " + e + "; " + f);
						self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
					}
				});
			}
			else
			{
				try {
					localStorage.setItem("__c2save_" + savingToSlot, savingJson);
					cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					this.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}
				catch (e)
				{
					cr.logexport("Error saving to WebStorage: " + e);
					self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
				}
			}
			this.saveToSlot = "";
			this.loadFromSlot = "";
			this.loadFromJson = "";
		}
		if (loadingFromSlot.length)
		{
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_ReadSlot(loadingFromSlot, function (result_)
				{
					if (result_)
					{
						self.loadFromJson = result_;
						cr.logexport("Loaded state from IndexedDB storage (" + self.loadFromJson.length + " bytes)");
					}
					else
					{
						self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
						cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					}
					self.suspendDrawing = false;
					if (!self.loadFromJson.length)
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				}, function (e)
				{
					self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					self.suspendDrawing = false;
					if (!self.loadFromJson.length)
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				});
			}
			else
			{
				try {
					this.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + this.loadFromJson.length + " bytes)");
				}
				catch (e)
				{
					this.loadFromJson = "";
				}
				this.suspendDrawing = false;
				if (!self.loadFromJson.length)
					self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
			}
			this.loadFromSlot = "";
			this.saveToSlot = "";
		}
		if (this.loadFromJson.length)
		{
			this.ClearDeathRow();
			this.loadFromJSONString(this.loadFromJson);
			this.lastSaveJson = this.loadFromJson;
			this.trigger(cr.system_object.prototype.cnds.OnLoadComplete, null);
			this.lastSaveJson = "";
			this.loadFromJson = "";
		}
	};
	function CopyExtraObject(extra)
	{
		var p, ret = {};
		for (p in extra)
		{
			if (extra.hasOwnProperty(p))
			{
				if (extra[p] instanceof cr.ObjectSet)
					continue;
				if (extra[p] && typeof extra[p].c2userdata !== "undefined")
					continue;
				if (p === "spriteCreatedDestroyCallback")
					continue;
				ret[p] = extra[p];
			}
		}
		return ret;
	};
	Runtime.prototype.saveToJSONString = function()
	{
		var i, len, j, lenj, type, layout, typeobj, g, c, a, v, p;
		var o = {
			"c2save":				true,
			"version":				1,
			"rt": {
				"time":				this.kahanTime.sum,
				"walltime":			this.wallTime.sum,
				"timescale":		this.timescale,
				"tickcount":		this.tickcount,
				"execcount":		this.execcount,
				"next_uid":			this.next_uid,
				"running_layout":	this.running_layout.sid,
				"start_time_offset": (Date.now() - this.start_time)
			},
			"types": {},
			"layouts": {},
			"events": {
				"groups": {},
				"cnds": {},
				"acts": {},
				"vars": {}
			}
		};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			typeobj = {
				"instances": []
			};
			if (cr.hasAnyOwnProperty(type.extra))
				typeobj["ex"] = CopyExtraObject(type.extra);
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				typeobj["instances"].push(this.saveInstanceToJSON(type.instances[j]));
			}
			o["types"][type.sid.toString()] = typeobj;
		}
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			layout = this.layouts_by_index[i];
			o["layouts"][layout.sid.toString()] = layout.saveToJSON();
		}
		var ogroups = o["events"]["groups"];
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			g = this.allGroups[i];
			ogroups[g.sid.toString()] = this.groups_by_name[g.group_name].group_active;
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				c = this.cndsBySid[p];
				if (cr.hasAnyOwnProperty(c.extra))
					ocnds[p] = { "ex": CopyExtraObject(c.extra) };
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				a = this.actsBySid[p];
				if (cr.hasAnyOwnProperty(a.extra))
					oacts[p] = { "ex": CopyExtraObject(a.extra) };
			}
		}
		var ovars = o["events"]["vars"];
		for (p in this.varsBySid)
		{
			if (this.varsBySid.hasOwnProperty(p))
			{
				v = this.varsBySid[p];
				if (!v.is_constant && (!v.parent || v.is_static))
					ovars[p] = v.data;
			}
		}
		o["system"] = this.system.saveToJSON();
		return JSON.stringify(o);
	};
	Runtime.prototype.refreshUidMap = function ()
	{
		var i, len, type, j, lenj, inst;
		this.objectsByUid = {};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				this.objectsByUid[inst.uid.toString()] = inst;
			}
		}
	};
	Runtime.prototype.loadFromJSONString = function (str)
	{
		var o = JSON.parse(str);
		if (!o["c2save"])
			return;		// probably not a c2 save state
		if (o["version"] > 1)
			return;		// from future version of c2; assume not compatible
		this.isLoadingState = true;
		var rt = o["rt"];
		this.kahanTime.reset();
		this.kahanTime.sum = rt["time"];
		this.wallTime.reset();
		this.wallTime.sum = rt["walltime"] || 0;
		this.timescale = rt["timescale"];
		this.tickcount = rt["tickcount"];
		this.execcount = rt["execcount"];
		this.start_time = Date.now() - rt["start_time_offset"];
		var layout_sid = rt["running_layout"];
		if (layout_sid !== this.running_layout.sid)
		{
			var changeToLayout = this.getLayoutBySid(layout_sid);
			if (changeToLayout)
				this.doChangeLayout(changeToLayout);
			else
				return;		// layout that was saved on has gone missing (deleted?)
		}
		var i, len, j, lenj, k, lenk, p, type, existing_insts, load_insts, inst, binst, layout, layer, g, iid, t;
		var otypes = o["types"];
		for (p in otypes)
		{
			if (otypes.hasOwnProperty(p))
			{
				type = this.getObjectTypeBySid(parseInt(p, 10));
				if (!type || type.is_family || this.typeHasNoSaveBehavior(type))
					continue;
				if (otypes[p]["ex"])
					type.extra = otypes[p]["ex"];
				else
					cr.wipe(type.extra);
				existing_insts = type.instances;
				load_insts = otypes[p]["instances"];
				for (i = 0, len = cr.min(existing_insts.length, load_insts.length); i < len; i++)
				{
					this.loadInstanceFromJSON(existing_insts[i], load_insts[i]);
				}
				for (i = load_insts.length, len = existing_insts.length; i < len; i++)
					this.DestroyInstance(existing_insts[i]);
				for (i = existing_insts.length, len = load_insts.length; i < len; i++)
				{
					layer = null;
					if (type.plugin.is_world)
					{
						layer = this.running_layout.getLayerBySid(load_insts[i]["w"]["l"]);
						if (!layer)
							continue;
					}
					inst = this.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
					this.loadInstanceFromJSON(inst, load_insts[i]);
				}
				type.stale_iids = true;
			}
		}
		this.ClearDeathRow();
		this.refreshUidMap();
		var olayouts = o["layouts"];
		for (p in olayouts)
		{
			if (olayouts.hasOwnProperty(p))
			{
				layout = this.getLayoutBySid(parseInt(p, 10));
				if (!layout)
					continue;		// must've gone missing
				layout.loadFromJSON(olayouts[p]);
			}
		}
		var ogroups = o["events"]["groups"];
		for (p in ogroups)
		{
			if (ogroups.hasOwnProperty(p))
			{
				g = this.getGroupBySid(parseInt(p, 10));
				if (g && this.groups_by_name[g.group_name])
					this.groups_by_name[g.group_name].setGroupActive(ogroups[p]);
			}
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				if (ocnds.hasOwnProperty(p))
				{
					this.cndsBySid[p].extra = ocnds[p]["ex"];
				}
				else
				{
					this.cndsBySid[p].extra = {};
				}
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				if (oacts.hasOwnProperty(p))
				{
					this.actsBySid[p].extra = oacts[p]["ex"];
				}
				else
				{
					this.actsBySid[p].extra = {};
				}
			}
		}
		var ovars = o["events"]["vars"];
		for (p in ovars)
		{
			if (ovars.hasOwnProperty(p) && this.varsBySid.hasOwnProperty(p))
			{
				this.varsBySid[p].data = ovars[p];
			}
		}
		this.next_uid = rt["next_uid"];
		this.isLoadingState = false;
		for (i = 0, len = this.fireOnCreateAfterLoad.length; i < len; ++i)
		{
			inst = this.fireOnCreateAfterLoad[i];
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
		}
		cr.clearArray(this.fireOnCreateAfterLoad);
		this.system.loadFromJSON(o["system"]);
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (type.is_contained)
				{
					iid = inst.get_iid();
					cr.clearArray(inst.siblings);
					for (k = 0, lenk = type.container.length; k < lenk; k++)
					{
						t = type.container[k];
						if (type === t)
							continue;
;
						inst.siblings.push(t.instances[iid]);
					}
				}
				if (inst.afterLoad)
					inst.afterLoad();
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (binst.afterLoad)
							binst.afterLoad();
					}
				}
			}
		}
		this.redraw = true;
	};
	Runtime.prototype.saveInstanceToJSON = function(inst, state_only)
	{
		var i, len, world, behinst, et;
		var type = inst.type;
		var plugin = type.plugin;
		var o = {};
		if (state_only)
			o["c2"] = true;		// mark as known json data from Construct 2
		else
			o["uid"] = inst.uid;
		if (cr.hasAnyOwnProperty(inst.extra))
			o["ex"] = CopyExtraObject(inst.extra);
		if (inst.instance_vars && inst.instance_vars.length)
		{
			o["ivs"] = {};
			for (i = 0, len = inst.instance_vars.length; i < len; i++)
			{
				o["ivs"][inst.type.instvar_sids[i].toString()] = inst.instance_vars[i];
			}
		}
		if (plugin.is_world)
		{
			world = {
				"x": inst.x,
				"y": inst.y,
				"w": inst.width,
				"h": inst.height,
				"l": inst.layer.sid,
				"zi": inst.get_zindex()
			};
			if (inst.angle !== 0)
				world["a"] = inst.angle;
			if (inst.opacity !== 1)
				world["o"] = inst.opacity;
			if (inst.hotspotX !== 0.5)
				world["hX"] = inst.hotspotX;
			if (inst.hotspotY !== 0.5)
				world["hY"] = inst.hotspotY;
			if (inst.blend_mode !== 0)
				world["bm"] = inst.blend_mode;
			if (!inst.visible)
				world["v"] = inst.visible;
			if (!inst.collisionsEnabled)
				world["ce"] = inst.collisionsEnabled;
			if (inst.my_timescale !== -1)
				world["mts"] = inst.my_timescale;
			if (type.effect_types.length)
			{
				world["fx"] = [];
				for (i = 0, len = type.effect_types.length; i < len; i++)
				{
					et = type.effect_types[i];
					world["fx"].push({"name": et.name,
									  "active": inst.active_effect_flags[et.index],
									  "params": inst.effect_params[et.index] });
				}
			}
			o["w"] = world;
		}
		if (inst.behavior_insts && inst.behavior_insts.length)
		{
			o["behs"] = {};
			for (i = 0, len = inst.behavior_insts.length; i < len; i++)
			{
				behinst = inst.behavior_insts[i];
				if (behinst.saveToJSON)
					o["behs"][behinst.type.sid.toString()] = behinst.saveToJSON();
			}
		}
		if (inst.saveToJSON)
			o["data"] = inst.saveToJSON();
		return o;
	};
	Runtime.prototype.getInstanceVarIndexBySid = function (type, sid_)
	{
		var i, len;
		for (i = 0, len = type.instvar_sids.length; i < len; i++)
		{
			if (type.instvar_sids[i] === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.getBehaviorIndexBySid = function (inst, sid_)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].type.sid === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.loadInstanceFromJSON = function(inst, o, state_only)
	{
		var p, i, len, iv, oivs, world, fxindex, obehs, behindex;
		var oldlayer;
		var type = inst.type;
		var plugin = type.plugin;
		if (state_only)
		{
			if (!o["c2"])
				return;
		}
		else
			inst.uid = o["uid"];
		if (o["ex"])
			inst.extra = o["ex"];
		else
			cr.wipe(inst.extra);
		oivs = o["ivs"];
		if (oivs)
		{
			for (p in oivs)
			{
				if (oivs.hasOwnProperty(p))
				{
					iv = this.getInstanceVarIndexBySid(type, parseInt(p, 10));
					if (iv < 0 || iv >= inst.instance_vars.length)
						continue;		// must've gone missing
					inst.instance_vars[iv] = oivs[p];
				}
			}
		}
		if (plugin.is_world)
		{
			world = o["w"];
			if (inst.layer.sid !== world["l"])
			{
				oldlayer = inst.layer;
				inst.layer = this.running_layout.getLayerBySid(world["l"]);
				if (inst.layer)
				{
					oldlayer.removeFromInstanceList(inst, true);
					inst.layer.appendToInstanceList(inst, true);
					inst.set_bbox_changed();
					inst.layer.setZIndicesStaleFrom(0);
				}
				else
				{
					inst.layer = oldlayer;
					if (!state_only)
						this.DestroyInstance(inst);
				}
			}
			inst.x = world["x"];
			inst.y = world["y"];
			inst.width = world["w"];
			inst.height = world["h"];
			inst.zindex = world["zi"];
			inst.angle = world.hasOwnProperty("a") ? world["a"] : 0;
			inst.opacity = world.hasOwnProperty("o") ? world["o"] : 1;
			inst.hotspotX = world.hasOwnProperty("hX") ? world["hX"] : 0.5;
			inst.hotspotY = world.hasOwnProperty("hY") ? world["hY"] : 0.5;
			inst.visible = world.hasOwnProperty("v") ? world["v"] : true;
			inst.collisionsEnabled = world.hasOwnProperty("ce") ? world["ce"] : true;
			inst.my_timescale = world.hasOwnProperty("mts") ? world["mts"] : -1;
			inst.blend_mode = world.hasOwnProperty("bm") ? world["bm"] : 0;;
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			inst.set_bbox_changed();
			if (world.hasOwnProperty("fx"))
			{
				for (i = 0, len = world["fx"].length; i < len; i++)
				{
					fxindex = type.getEffectIndexByName(world["fx"][i]["name"]);
					if (fxindex < 0)
						continue;		// must've gone missing
					inst.active_effect_flags[fxindex] = world["fx"][i]["active"];
					inst.effect_params[fxindex] = world["fx"][i]["params"];
				}
			}
			inst.updateActiveEffects();
		}
		obehs = o["behs"];
		if (obehs)
		{
			for (p in obehs)
			{
				if (obehs.hasOwnProperty(p))
				{
					behindex = this.getBehaviorIndexBySid(inst, parseInt(p, 10));
					if (behindex < 0)
						continue;		// must've gone missing
					inst.behavior_insts[behindex].loadFromJSON(obehs[p]);
				}
			}
		}
		if (o["data"])
			inst.loadFromJSON(o["data"]);
	};
	Runtime.prototype.fetchLocalFileViaCordova = function (filename, successCallback, errorCallback)
	{
		var path = cordova["file"]["applicationDirectory"] + "www/" + filename;
		window["resolveLocalFileSystemURL"](path, function (entry)
		{
			entry.file(successCallback, errorCallback);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsText = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.onerror = errorCallback;
			reader.readAsText(file);
		}, errorCallback);
	};
	var queuedArrayBufferReads = [];
	var activeArrayBufferReads = 0;
	var MAX_ARRAYBUFFER_READS = 8;
	Runtime.prototype.maybeStartNextArrayBufferRead = function()
	{
		if (!queuedArrayBufferReads.length)
			return;		// none left
		if (activeArrayBufferReads >= MAX_ARRAYBUFFER_READS)
			return;		// already got maximum number in-flight
		activeArrayBufferReads++;
		var job = queuedArrayBufferReads.shift();
		this.doFetchLocalFileViaCordovaAsArrayBuffer(job.filename, job.successCallback, job.errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback_, errorCallback_)
	{
		var self = this;
		queuedArrayBufferReads.push({
			filename: filename,
			successCallback: function (result)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				successCallback_(result);
			},
			errorCallback: function (err)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				errorCallback_(err);
			}
		});
		this.maybeStartNextArrayBufferRead();
	};
	Runtime.prototype.doFetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.readAsArrayBuffer(file);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsURL = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordovaAsArrayBuffer(filename, function (arrayBuffer)
		{
			var blob = new Blob([arrayBuffer]);
			var url = URL.createObjectURL(blob);
			successCallback(url);
		}, errorCallback);
	};
	Runtime.prototype.isAbsoluteUrl = function (url)
	{
		return /^(?:[a-z]+:)?\/\//.test(url) || url.substr(0, 5) === "data:"  || url.substr(0, 5) === "blob:";
	};
	Runtime.prototype.setImageSrc = function (img, src)
	{
		if (this.isWKWebView && !this.isAbsoluteUrl(src))
		{
			this.fetchLocalFileViaCordovaAsURL(src, function (url)
			{
				img.src = url;
			}, function (err)
			{
				alert("Failed to load image: " + err);
			});
		}
		else
		{
			img.src = src;
		}
	};
	Runtime.prototype.setCtxImageSmoothingEnabled = function (ctx, e)
	{
		if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
		{
			ctx["imageSmoothingEnabled"] = e;
		}
		else
		{
			ctx["webkitImageSmoothingEnabled"] = e;
			ctx["mozImageSmoothingEnabled"] = e;
			ctx["msImageSmoothingEnabled"] = e;
		}
	};
	cr.runtime = Runtime;
	cr.createRuntime = function (canvasid)
	{
		return new Runtime(document.getElementById(canvasid));
	};
	cr.createDCRuntime = function (w, h)
	{
		return new Runtime({ "dc": true, "width": w, "height": h });
	};
	window["cr_createRuntime"] = cr.createRuntime;
	window["cr_createDCRuntime"] = cr.createDCRuntime;
	window["createCocoonJSRuntime"] = function ()
	{
		window["c2cocoonjs"] = true;
		var canvas = document.createElement("screencanvas") || document.createElement("canvas");
		canvas.screencanvas = true;
		document.body.appendChild(canvas);
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window.addEventListener("orientationchange", function () {
			window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		});
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
	window["createEjectaRuntime"] = function ()
	{
		var canvas = document.getElementById("canvas");
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
}());
window["cr_getC2Runtime"] = function()
{
	var canvas = document.getElementById("c2canvas");
	if (canvas)
		return canvas["c2runtime"];
	else if (window["c2runtime"])
		return window["c2runtime"];
	else
		return null;
}
window["cr_getSnapshot"] = function (format_, quality_)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime.doCanvasSnapshot(format_, quality_);
}
window["cr_sizeCanvas"] = function(w, h)
{
	if (w === 0 || h === 0)
		return;
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSize"](w, h);
}
window["cr_setSuspended"] = function(s)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSuspended"](s);
}
;
(function()
{
	function Layout(runtime, m)
	{
		this.runtime = runtime;
		this.event_sheet = null;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		this.scale = 1.0;
		this.angle = 0;
		this.first_visit = true;
		this.name = m[0];
		this.originalWidth = m[1];
		this.originalHeight = m[2];
		this.width = m[1];
		this.height = m[2];
		this.unbounded_scrolling = m[3];
		this.sheetname = m[4];
		this.sid = m[5];
		var lm = m[6];
		var i, len;
		this.layers = [];
		this.initial_types = [];
		for (i = 0, len = lm.length; i < len; i++)
		{
			var layer = new cr.layer(this, lm[i]);
			layer.number = i;
			cr.seal(layer);
			this.layers.push(layer);
		}
		var im = m[7];
		this.initial_nonworld = [];
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
				type.default_instance = inst;
			this.initial_nonworld.push(inst);
			if (this.initial_types.indexOf(type) === -1)
				this.initial_types.push(type);
		}
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[8].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[8][i][0],
				name: m[8][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[8][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
		this.persist_data = {};
	};
	Layout.prototype.saveObjectToPersist = function (inst)
	{
		var sidStr = inst.type.sid.toString();
		if (!this.persist_data.hasOwnProperty(sidStr))
			this.persist_data[sidStr] = [];
		var type_persist = this.persist_data[sidStr];
		type_persist.push(this.runtime.saveInstanceToJSON(inst));
	};
	Layout.prototype.hasOpaqueBottomLayer = function ()
	{
		var layer = this.layers[0];
		return !layer.transparent && layer.opacity === 1.0 && !layer.forceOwnTexture && layer.visible;
	};
	Layout.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layout.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	var created_instances = [];
	function sort_by_zindex(a, b)
	{
		return a.zindex - b.zindex;
	};
	var first_layout = true;
	Layout.prototype.startRunning = function ()
	{
		if (this.sheetname)
		{
			this.event_sheet = this.runtime.eventsheets[this.sheetname];
;
			this.event_sheet.updateDeepIncludes();
		}
		this.runtime.running_layout = this;
		this.width = this.originalWidth;
		this.height = this.originalHeight;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		var i, k, len, lenk, type, type_instances, inst, iid, t, s, p, q, type_data, layer;
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.is_family)
				continue;		// instances are only transferred for their real type
			type_instances = type.instances;
			for (k = 0, lenk = type_instances.length; k < lenk; k++)
			{
				inst = type_instances[k];
				if (inst.layer)
				{
					var num = inst.layer.number;
					if (num >= this.layers.length)
						num = this.layers.length - 1;
					inst.layer = this.layers[num];
					if (inst.layer.instances.indexOf(inst) === -1)
						inst.layer.instances.push(inst);
					inst.layer.zindices_stale = true;
				}
			}
		}
		if (!first_layout)
		{
			for (i = 0, len = this.layers.length; i < len; ++i)
			{
				this.layers[i].instances.sort(sort_by_zindex);
			}
		}
		var layer;
		cr.clearArray(created_instances);
		this.boundScrolling();
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			layer.createInitialInstances();		// fills created_instances
			layer.updateViewport(null);
		}
		var uids_changed = false;
		if (!this.first_visit)
		{
			for (p in this.persist_data)
			{
				if (this.persist_data.hasOwnProperty(p))
				{
					type = this.runtime.getObjectTypeBySid(parseInt(p, 10));
					if (!type || type.is_family || !this.runtime.typeHasPersistBehavior(type))
						continue;
					type_data = this.persist_data[p];
					for (i = 0, len = type_data.length; i < len; i++)
					{
						layer = null;
						if (type.plugin.is_world)
						{
							layer = this.getLayerBySid(type_data[i]["w"]["l"]);
							if (!layer)
								continue;
						}
						inst = this.runtime.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
						this.runtime.loadInstanceFromJSON(inst, type_data[i]);
						uids_changed = true;
						created_instances.push(inst);
					}
					cr.clearArray(type_data);
				}
			}
			for (i = 0, len = this.layers.length; i < len; i++)
			{
				this.layers[i].instances.sort(sort_by_zindex);
				this.layers[i].zindices_stale = true;		// in case of duplicates/holes
			}
		}
		if (uids_changed)
		{
			this.runtime.ClearDeathRow();
			this.runtime.refreshUidMap();
		}
		for (i = 0; i < created_instances.length; i++)
		{
			inst = created_instances[i];
			if (!inst.type.is_contained)
				continue;
			iid = inst.get_iid();
			for (k = 0, lenk = inst.type.container.length; k < lenk; k++)
			{
				t = inst.type.container[k];
				if (inst.type === t)
					continue;
				if (t.instances.length > iid)
					inst.siblings.push(t.instances[iid]);
				else
				{
					if (!t.default_instance)
					{
					}
					else
					{
						s = this.runtime.createInstanceFromInit(t.default_instance, inst.layer, true, inst.x, inst.y, true);
						this.runtime.ClearDeathRow();
						t.updateIIDs();
						inst.siblings.push(s);
						created_instances.push(s);		// come back around and link up its own instances too
					}
				}
			}
		}
		for (i = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			inst = this.runtime.createInstanceFromInit(this.initial_nonworld[i], null, true);
;
		}
		this.runtime.changelayout = null;
		this.runtime.ClearDeathRow();
		if (this.runtime.ctx && !this.runtime.isDomFree)
		{
			for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
			{
				t = this.runtime.types_by_index[i];
				if (t.is_family || !t.instances.length || !t.preloadCanvas2D)
					continue;
				t.preloadCanvas2D(this.runtime.ctx);
			}
		}
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout start: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (this.runtime.isLoadingState)
		{
			cr.shallowAssignArray(this.runtime.fireOnCreateAfterLoad, created_instances);
		}
		else
		{
			for (i = 0, len = created_instances.length; i < len; i++)
			{
				inst = created_instances[i];
				this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
			}
		}
		cr.clearArray(created_instances);
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutStart, null);
		}
		this.first_visit = false;
	};
	Layout.prototype.createGlobalNonWorlds = function ()
	{
		var i, k, len, initial_inst, inst, type;
		for (i = 0, k = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (type.global)
			{
				if (!type.is_contained)
				{
					inst = this.runtime.createInstanceFromInit(initial_inst, null, true);
				}
			}
			else
			{
				this.initial_nonworld[k] = initial_inst;
				k++;
			}
		}
		cr.truncateArray(this.initial_nonworld, k);
	};
	Layout.prototype.stopRunning = function ()
	{
;
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout end: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutEnd, null);
		}
		this.runtime.isEndingLayout = true;
		cr.clearArray(this.runtime.system.waits);
		var i, leni, j, lenj;
		var layer_instances, inst, type;
		if (!this.first_visit)
		{
			for (i = 0, leni = this.layers.length; i < leni; i++)
			{
				this.layers[i].updateZIndices();
				layer_instances = this.layers[i].instances;
				for (j = 0, lenj = layer_instances.length; j < lenj; j++)
				{
					inst = layer_instances[j];
					if (!inst.type.global)
					{
						if (this.runtime.typeHasPersistBehavior(inst.type))
							this.saveObjectToPersist(inst);
					}
				}
			}
		}
		for (i = 0, leni = this.layers.length; i < leni; i++)
		{
			layer_instances = this.layers[i].instances;
			for (j = 0, lenj = layer_instances.length; j < lenj; j++)
			{
				inst = layer_instances[j];
				if (!inst.type.global)
				{
					this.runtime.DestroyInstance(inst);
				}
			}
			this.runtime.ClearDeathRow();
			cr.clearArray(layer_instances);
			this.layers[i].zindices_stale = true;
		}
		for (i = 0, leni = this.runtime.types_by_index.length; i < leni; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.global || type.plugin.is_world || type.plugin.singleglobal || type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
				this.runtime.DestroyInstance(type.instances[j]);
			this.runtime.ClearDeathRow();
		}
		first_layout = false;
		this.runtime.isEndingLayout = false;
	};
	var temp_rect = new cr.rect(0, 0, 0, 0);
	Layout.prototype.recreateInitialObjects = function (type, x1, y1, x2, y2)
	{
		temp_rect.set(x1, y1, x2, y2);
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			this.layers[i].recreateInitialObjects(type, temp_rect);
		}
	};
	Layout.prototype.draw = function (ctx)
	{
		var layout_canvas;
		var layout_ctx = ctx;
		var ctx_changed = false;
		var render_offscreen = !this.runtime.fullscreenScalingQuality;
		if (render_offscreen)
		{
			if (!this.runtime.layout_canvas)
			{
				this.runtime.layout_canvas = document.createElement("canvas");
				layout_canvas = this.runtime.layout_canvas;
				layout_canvas.width = this.runtime.draw_width;
				layout_canvas.height = this.runtime.draw_height;
				this.runtime.layout_ctx = layout_canvas.getContext("2d");
				ctx_changed = true;
			}
			layout_canvas = this.runtime.layout_canvas;
			layout_ctx = this.runtime.layout_ctx;
			if (layout_canvas.width !== this.runtime.draw_width)
			{
				layout_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layout_canvas.height !== this.runtime.draw_height)
			{
				layout_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layout_ctx, this.runtime.linearSampling);
			}
		}
		layout_ctx.globalAlpha = 1;
		layout_ctx.globalCompositeOperation = "source-over";
		if (this.runtime.alphaBackground && !this.hasOpaqueBottomLayer())
			layout_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && l.blend_mode !== 11 && (l.instances.length || !l.transparent))
				l.draw(layout_ctx);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_offscreen)
		{
			ctx.drawImage(layout_canvas, 0, 0, this.runtime.width, this.runtime.height);
		}
	};
	Layout.prototype.drawGL_earlyZPass = function (glw)
	{
		glw.setEarlyZPass(true);
		if (!this.runtime.layout_tex)
		{
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
		{
			glw.deleteTexture(this.runtime.layout_tex);
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		glw.setRenderingToTexture(this.runtime.layout_tex);
		if (!this.runtime.fullscreenScalingQuality)
		{
			glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
		}
		var i, l;
		for (i = this.layers.length - 1; i >= 0; --i)
		{
			l = this.layers[i];
			if (l.visible && l.opacity === 1 && l.shaders_preserve_opaqueness &&
				l.blend_mode === 0 && (l.instances.length || !l.transparent))
			{
				l.drawGL_earlyZPass(glw);
			}
			else
			{
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
			}
		}
		glw.setEarlyZPass(false);
	};
	Layout.prototype.drawGL = function (glw)
	{
		var render_to_texture = (this.active_effect_types.length > 0 ||
								 this.runtime.uses_background_blending ||
								 !this.runtime.fullscreenScalingQuality ||
								 this.runtime.enableFrontToBack);
		if (render_to_texture)
		{
			if (!this.runtime.layout_tex)
			{
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layout_tex);
			if (!this.runtime.fullscreenScalingQuality)
			{
				glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
			}
		}
		else
		{
			if (this.runtime.layout_tex)
			{
				glw.setRenderingToTexture(null);
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = null;
			}
		}
		if (this.runtime.alphaBackground && !this.hasOpaqueBottomLayer())
			glw.clear(0, 0, 0, 0);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && (l.instances.length || !l.transparent))
				l.drawGL(glw);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_to_texture)
		{
			if (this.active_effect_types.length === 0 ||
				(this.active_effect_types.length === 1 && this.runtime.fullscreenScalingQuality))
			{
				if (this.active_effect_types.length === 1)
				{
					var etindex = this.active_effect_types[0].index;
					glw.switchProgram(this.active_effect_types[0].shaderindex);
					glw.setProgramParameters(null,								// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 this.scale,						// layerScale
											 this.angle,						// layerAngle
											 0.0, 0.0,							// viewOrigin
											 this.runtime.draw_width / 2, this.runtime.draw_height / 2,	// scrollPos
											 this.runtime.kahanTime.sum,		// seconds
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(this.active_effect_types[0].shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
				}
				glw.setRenderingToTexture(null);				// to backbuffer
				glw.setDepthTestEnabled(false);					// ignore depth buffer, copy full texture
				glw.setOpacity(1);
				glw.setTexture(this.runtime.layout_tex);
				glw.setAlphaBlend();
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.width / 2;
				var halfh = this.runtime.height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
				glw.setDepthTestEnabled(true);					// turn depth test back on
			}
			else
			{
				this.renderEffectChain(glw, null, null, null);
			}
		}
	};
	Layout.prototype.getRenderTarget = function()
	{
		if (this.active_effect_types.length > 0 ||
				this.runtime.uses_background_blending ||
				!this.runtime.fullscreenScalingQuality ||
				this.runtime.enableFrontToBack)
		{
			return this.runtime.layout_tex;
		}
		else
		{
			return null;
		}
	};
	Layout.prototype.getMinLayerScale = function ()
	{
		var m = this.layers[0].getScale();
		var i, len, l;
		for (i = 1, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.parallaxX === 0 && l.parallaxY === 0)
				continue;
			if (l.getScale() < m)
				m = l.getScale();
		}
		return m;
	};
	Layout.prototype.scrollToX = function (x)
	{
		if (!this.unbounded_scrolling)
		{
			var widthBoundary = (this.runtime.draw_width * (1 / this.getMinLayerScale()) / 2);
			if (x > this.width - widthBoundary)
				x = this.width - widthBoundary;
			if (x < widthBoundary)
				x = widthBoundary;
		}
		if (this.scrollX !== x)
		{
			this.scrollX = x;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.scrollToY = function (y)
	{
		if (!this.unbounded_scrolling)
		{
			var heightBoundary = (this.runtime.draw_height * (1 / this.getMinLayerScale()) / 2);
			if (y > this.height - heightBoundary)
				y = this.height - heightBoundary;
			if (y < heightBoundary)
				y = heightBoundary;
		}
		if (this.scrollY !== y)
		{
			this.scrollY = y;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.boundScrolling = function ()
	{
		this.scrollToX(this.scrollX);
		this.scrollToY(this.scrollY);
	};
	Layout.prototype.renderEffectChain = function (glw, layer, inst, rendertarget)
	{
		var active_effect_types = inst ?
							inst.active_effect_types :
							layer ?
								layer.active_effect_types :
								this.active_effect_types;
		var layerScale = 1, layerAngle = 0, viewOriginLeft = 0, viewOriginTop = 0, viewOriginRight = this.runtime.draw_width, viewOriginBottom = this.runtime.draw_height;
		if (inst)
		{
			layerScale = inst.layer.getScale();
			layerAngle = inst.layer.getAngle();
			viewOriginLeft = inst.layer.viewLeft;
			viewOriginTop = inst.layer.viewTop;
			viewOriginRight = inst.layer.viewRight;
			viewOriginBottom = inst.layer.viewBottom;
		}
		else if (layer)
		{
			layerScale = layer.getScale();
			layerAngle = layer.getAngle();
			viewOriginLeft = layer.viewLeft;
			viewOriginTop = layer.viewTop;
			viewOriginRight = layer.viewRight;
			viewOriginBottom = layer.viewBottom;
		}
		var fx_tex = this.runtime.fx_tex;
		var i, len, last, temp, fx_index = 0, other_fx_index = 1;
		var y, h;
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var halfw = windowWidth / 2;
		var halfh = windowHeight / 2;
		var rcTex = layer ? layer.rcTex : this.rcTex;
		var rcTex2 = layer ? layer.rcTex2 : this.rcTex2;
		var screenleft = 0, clearleft = 0;
		var screentop = 0, cleartop = 0;
		var screenright = windowWidth, clearright = windowWidth;
		var screenbottom = windowHeight, clearbottom = windowHeight;
		var boxExtendHorizontal = 0;
		var boxExtendVertical = 0;
		var inst_layer_angle = inst ? inst.layer.getAngle() : 0;
		if (inst)
		{
			for (i = 0, len = active_effect_types.length; i < len; i++)
			{
				boxExtendHorizontal += glw.getProgramBoxExtendHorizontal(active_effect_types[i].shaderindex);
				boxExtendVertical += glw.getProgramBoxExtendVertical(active_effect_types[i].shaderindex);
			}
			var bbox = inst.bbox;
			screenleft = layer.layerToCanvas(bbox.left, bbox.top, true, true);
			screentop = layer.layerToCanvas(bbox.left, bbox.top, false, true);
			screenright = layer.layerToCanvas(bbox.right, bbox.bottom, true, true);
			screenbottom = layer.layerToCanvas(bbox.right, bbox.bottom, false, true);
			if (inst_layer_angle !== 0)
			{
				var screentrx = layer.layerToCanvas(bbox.right, bbox.top, true, true);
				var screentry = layer.layerToCanvas(bbox.right, bbox.top, false, true);
				var screenblx = layer.layerToCanvas(bbox.left, bbox.bottom, true, true);
				var screenbly = layer.layerToCanvas(bbox.left, bbox.bottom, false, true);
				temp = Math.min(screenleft, screenright, screentrx, screenblx);
				screenright = Math.max(screenleft, screenright, screentrx, screenblx);
				screenleft = temp;
				temp = Math.min(screentop, screenbottom, screentry, screenbly);
				screenbottom = Math.max(screentop, screenbottom, screentry, screenbly);
				screentop = temp;
			}
			screenleft -= boxExtendHorizontal;
			screentop -= boxExtendVertical;
			screenright += boxExtendHorizontal;
			screenbottom += boxExtendVertical;
			rcTex2.left = screenleft / windowWidth;
			rcTex2.top = 1 - screentop / windowHeight;
			rcTex2.right = screenright / windowWidth;
			rcTex2.bottom = 1 - screenbottom / windowHeight;
			clearleft = screenleft = cr.floor(screenleft);
			cleartop = screentop = cr.floor(screentop);
			clearright = screenright = cr.ceil(screenright);
			clearbottom = screenbottom = cr.ceil(screenbottom);
			clearleft -= boxExtendHorizontal;
			cleartop -= boxExtendVertical;
			clearright += boxExtendHorizontal;
			clearbottom += boxExtendVertical;
			if (screenleft < 0)					screenleft = 0;
			if (screentop < 0)					screentop = 0;
			if (screenright > windowWidth)		screenright = windowWidth;
			if (screenbottom > windowHeight)	screenbottom = windowHeight;
			if (clearleft < 0)					clearleft = 0;
			if (cleartop < 0)					cleartop = 0;
			if (clearright > windowWidth)		clearright = windowWidth;
			if (clearbottom > windowHeight)		clearbottom = windowHeight;
			rcTex.left = screenleft / windowWidth;
			rcTex.top = 1 - screentop / windowHeight;
			rcTex.right = screenright / windowWidth;
			rcTex.bottom = 1 - screenbottom / windowHeight;
		}
		else
		{
			rcTex.left = rcTex2.left = 0;
			rcTex.top = rcTex2.top = 0;
			rcTex.right = rcTex2.right = 1;
			rcTex.bottom = rcTex2.bottom = 1;
		}
		var pre_draw = (inst && (glw.programUsesDest(active_effect_types[0].shaderindex) || boxExtendHorizontal !== 0 || boxExtendVertical !== 0 || inst.opacity !== 1 || inst.type.plugin.must_predraw)) || (layer && !inst && layer.opacity !== 1);
		glw.setAlphaBlend();
		if (pre_draw)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(0);
			glw.setRenderingToTexture(fx_tex[fx_index]);
			h = clearbottom - cleartop;
			y = (windowHeight - cleartop) - h;
			glw.clearRect(clearleft, y, clearright - clearleft, h);
			if (inst)
			{
				inst.drawGL(glw);
			}
			else
			{
				glw.setTexture(this.runtime.layer_tex);
				glw.setOpacity(layer.opacity);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			}
			rcTex2.left = rcTex2.top = 0;
			rcTex2.right = rcTex2.bottom = 1;
			if (inst)
			{
				temp = rcTex.top;
				rcTex.top = rcTex.bottom;
				rcTex.bottom = temp;
			}
			fx_index = 1;
			other_fx_index = 0;
		}
		glw.setOpacity(1);
		var last = active_effect_types.length - 1;
		var post_draw = glw.programUsesCrossSampling(active_effect_types[last].shaderindex) ||
						(!layer && !inst && !this.runtime.fullscreenScalingQuality);
		var etindex = 0;
		for (i = 0, len = active_effect_types.length; i < len; i++)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(active_effect_types[i].shaderindex);
			etindex = active_effect_types[i].index;
			if (glw.programIsAnimated(active_effect_types[i].shaderindex))
				this.runtime.redraw = true;
			if (i == 0 && !pre_draw)
			{
				glw.setRenderingToTexture(fx_tex[fx_index]);
				h = clearbottom - cleartop;
				y = (windowHeight - cleartop) - h;
				glw.clearRect(clearleft, y, clearright - clearleft, h);
				if (inst)
				{
					var pixelWidth;
					var pixelHeight;
					if (inst.curFrame && inst.curFrame.texture_img)
					{
						var img = inst.curFrame.texture_img;
						pixelWidth = 1.0 / img.width;
						pixelHeight = 1.0 / img.height;
					}
					else
					{
						pixelWidth = 1.0 / inst.width;
						pixelHeight = 1.0 / inst.height;
					}
					glw.setProgramParameters(rendertarget,					// backTex
											 pixelWidth,
											 pixelHeight,
											 rcTex2.left, rcTex2.top,		// destStart
											 rcTex2.right, rcTex2.bottom,	// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 inst.effect_params[etindex]);	// fx params
					inst.drawGL(glw);
				}
				else
				{
					glw.setProgramParameters(rendertarget,					// backTex
											 1.0 / windowWidth,				// pixelWidth
											 1.0 / windowHeight,			// pixelHeight
											 0.0, 0.0,						// destStart
											 1.0, 1.0,						// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 layer ?						// fx params
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
					glw.setTexture(layer ? this.runtime.layer_tex : this.runtime.layout_tex);
					glw.resetModelView();
					glw.translate(-halfw, -halfh);
					glw.updateModelView();
					glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				}
				rcTex2.left = rcTex2.top = 0;
				rcTex2.right = rcTex2.bottom = 1;
				if (inst && !post_draw)
				{
					temp = screenbottom;
					screenbottom = screentop;
					screentop = temp;
				}
			}
			else
			{
				glw.setProgramParameters(rendertarget,						// backTex
										 1.0 / windowWidth,					// pixelWidth
										 1.0 / windowHeight,				// pixelHeight
										 rcTex2.left, rcTex2.top,			// destStart
										 rcTex2.right, rcTex2.bottom,		// destEnd
										 layerScale,
										 layerAngle,
										 viewOriginLeft, viewOriginTop,
										 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
										 this.runtime.kahanTime.sum,
										 inst ?								// fx params
											inst.effect_params[etindex] :
											layer ?
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
				glw.setTexture(null);
				if (i === last && !post_draw)
				{
					if (inst)
						glw.setBlend(inst.srcBlend, inst.destBlend);
					else if (layer)
						glw.setBlend(layer.srcBlend, layer.destBlend);
					glw.setRenderingToTexture(rendertarget);
				}
				else
				{
					glw.setRenderingToTexture(fx_tex[fx_index]);
					h = clearbottom - cleartop;
					y = (windowHeight - cleartop) - h;
					glw.clearRect(clearleft, y, clearright - clearleft, h);
				}
				glw.setTexture(fx_tex[other_fx_index]);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				if (i === last && !post_draw)
					glw.setTexture(null);
			}
			fx_index = (fx_index === 0 ? 1 : 0);
			other_fx_index = (fx_index === 0 ? 1 : 0);		// will be opposite to fx_index since it was just assigned
		}
		if (post_draw)
		{
			glw.switchProgram(0);
			if (inst)
				glw.setBlend(inst.srcBlend, inst.destBlend);
			else if (layer)
				glw.setBlend(layer.srcBlend, layer.destBlend);
			else
			{
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
					halfw = this.runtime.width / 2;
					halfh = this.runtime.height / 2;
					screenleft = 0;
					screentop = 0;
					screenright = this.runtime.width;
					screenbottom = this.runtime.height;
				}
			}
			glw.setRenderingToTexture(rendertarget);
			glw.setTexture(fx_tex[other_fx_index]);
			glw.resetModelView();
			glw.translate(-halfw, -halfh);
			glw.updateModelView();
			if (inst && active_effect_types.length === 1 && !pre_draw)
				glw.quadTex(screenleft, screentop, screenright, screentop, screenright, screenbottom, screenleft, screenbottom, rcTex);
			else
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			glw.setTexture(null);
		}
	};
	Layout.prototype.getLayerBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			if (this.layers[i].sid === sid_)
				return this.layers[i];
		}
		return null;
	};
	Layout.prototype.saveToJSON = function ()
	{
		var i, len, layer, et;
		var o = {
			"sx": this.scrollX,
			"sy": this.scrollY,
			"s": this.scale,
			"a": this.angle,
			"w": this.width,
			"h": this.height,
			"fv": this.first_visit,			// added r127
			"persist": this.persist_data,
			"fx": [],
			"layers": {}
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			o["layers"][layer.sid.toString()] = layer.saveToJSON();
		}
		return o;
	};
	Layout.prototype.loadFromJSON = function (o)
	{
		var i, j, len, fx, p, layer;
		this.scrollX = o["sx"];
		this.scrollY = o["sy"];
		this.scale = o["s"];
		this.angle = o["a"];
		this.width = o["w"];
		this.height = o["h"];
		this.persist_data = o["persist"];
		if (typeof o["fv"] !== "undefined")
			this.first_visit = o["fv"];
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		var olayers = o["layers"];
		for (p in olayers)
		{
			if (olayers.hasOwnProperty(p))
			{
				layer = this.getLayerBySid(parseInt(p, 10));
				if (!layer)
					continue;		// must've gone missing
				layer.loadFromJSON(olayers[p]);
			}
		}
	};
	cr.layout = Layout;
	function Layer(layout, m)
	{
		this.layout = layout;
		this.runtime = layout.runtime;
		this.instances = [];        // running instances
		this.scale = 1.0;
		this.angle = 0;
		this.disableAngle = false;
		this.tmprect = new cr.rect(0, 0, 0, 0);
		this.tmpquad = new cr.quad();
		this.viewLeft = 0;
		this.viewRight = 0;
		this.viewTop = 0;
		this.viewBottom = 0;
		this.zindices_stale = false;
		this.zindices_stale_from = -1;		// first index that has changed, or -1 if no bound
		this.clear_earlyz_index = 0;
		this.name = m[0];
		this.index = m[1];
		this.sid = m[2];
		this.visible = m[3];		// initially visible
		this.background_color = m[4];
		this.transparent = m[5];
		this.parallaxX = m[6];
		this.parallaxY = m[7];
		this.opacity = m[8];
		this.forceOwnTexture = m[9];
		this.useRenderCells = m[10];
		this.zoomRate = m[11];
		this.blend_mode = m[12];
		this.effect_fallback = m[13];
		this.compositeOp = "source-over";
		this.srcBlend = 0;
		this.destBlend = 0;
		this.render_grid = null;
		this.last_render_list = alloc_arr();
		this.render_list_stale = true;
		this.last_render_cells = new cr.rect(0, 0, -1, -1);
		this.cur_render_cells = new cr.rect(0, 0, -1, -1);
		if (this.useRenderCells)
		{
			this.render_grid = new cr.RenderGrid(this.runtime.original_width, this.runtime.original_height);
		}
		this.render_offscreen = false;
		var im = m[14];
		var i, len;
		this.startup_initial_instances = [];		// for restoring initial_instances after load
		this.initial_instances = [];
		this.created_globals = [];		// global object UIDs already created - for save/load to avoid recreating
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
			{
				type.default_instance = inst;
				type.default_layerindex = this.index;
			}
			this.initial_instances.push(inst);
			if (this.layout.initial_types.indexOf(type) === -1)
				this.layout.initial_types.push(type);
		}
		cr.shallowAssignArray(this.startup_initial_instances, this.initial_instances);
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[15].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[15][i][0],
				name: m[15][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[15][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
	};
	Layer.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layer.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	Layer.prototype.createInitialInstances = function ()
	{
		var i, k, len, inst, initial_inst, type, keep, hasPersistBehavior;
		for (i = 0, k = 0, len = this.initial_instances.length; i < len; i++)
		{
			initial_inst = this.initial_instances[i];
			type = this.runtime.types_by_index[initial_inst[1]];
;
			hasPersistBehavior = this.runtime.typeHasPersistBehavior(type);
			keep = true;
			if (!hasPersistBehavior || this.layout.first_visit)
			{
				inst = this.runtime.createInstanceFromInit(initial_inst, this, true);
				if (!inst)
					continue;		// may have skipped creation due to fallback effect "destroy"
				created_instances.push(inst);
				if (inst.type.global)
				{
					keep = false;
					this.created_globals.push(inst.uid);
				}
			}
			if (keep)
			{
				this.initial_instances[k] = this.initial_instances[i];
				k++;
			}
		}
		this.initial_instances.length = k;
		this.runtime.ClearDeathRow();		// flushes creation row so IIDs will be correct
		if (!this.runtime.glwrap && this.effect_types.length)	// no WebGL renderer and shaders used
			this.blend_mode = this.effect_fallback;				// use fallback blend mode
		this.compositeOp = cr.effectToCompositeOp(this.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(this, this.blend_mode, this.runtime.gl);
		this.render_list_stale = true;
	};
	Layer.prototype.recreateInitialObjects = function (only_type, rc)
	{
		var i, len, initial_inst, type, wm, x, y, inst, j, lenj, s;
		var types_by_index = this.runtime.types_by_index;
		var only_type_is_family = only_type.is_family;
		var only_type_members = only_type.members;
		for (i = 0, len = this.initial_instances.length; i < len; ++i)
		{
			initial_inst = this.initial_instances[i];
			wm = initial_inst[0];
			x = wm[0];
			y = wm[1];
			if (!rc.contains_pt(x, y))
				continue;		// not in the given area
			type = types_by_index[initial_inst[1]];
			if (type !== only_type)
			{
				if (only_type_is_family)
				{
					if (only_type_members.indexOf(type) < 0)
						continue;
				}
				else
					continue;		// only_type is not a family, and the initial inst type does not match
			}
			inst = this.runtime.createInstanceFromInit(initial_inst, this, false);
			this.runtime.isInOnDestroy++;
			this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
			if (inst.is_contained)
			{
				for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
				{
					s = inst.siblings[i];
					this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
				}
			}
			this.runtime.isInOnDestroy--;
		}
	};
	Layer.prototype.removeFromInstanceList = function (inst, remove_from_grid)
	{
		var index = cr.fastIndexOf(this.instances, inst);
		if (index < 0)
			return;		// not found
		if (remove_from_grid && this.useRenderCells && inst.rendercells && inst.rendercells.right >= inst.rendercells.left)
		{
			inst.update_bbox();											// make sure actually in its current rendercells
			this.render_grid.update(inst, inst.rendercells, null);		// no new range provided - remove only
			inst.rendercells.set(0, 0, -1, -1);							// set to invalid state to indicate not inserted
		}
		if (index === this.instances.length - 1)
			this.instances.pop();
		else
		{
			cr.arrayRemove(this.instances, index);
			this.setZIndicesStaleFrom(index);
		}
		this.render_list_stale = true;
	};
	Layer.prototype.appendToInstanceList = function (inst, add_to_grid)
	{
;
		inst.zindex = this.instances.length;
		this.instances.push(inst);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
		this.render_list_stale = true;
	};
	Layer.prototype.prependToInstanceList = function (inst, add_to_grid)
	{
;
		this.instances.unshift(inst);
		this.setZIndicesStaleFrom(0);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
	};
	Layer.prototype.moveInstanceAdjacent = function (inst, other, isafter)
	{
;
		var myZ = inst.get_zindex();
		var insertZ = other.get_zindex();
		cr.arrayRemove(this.instances, myZ);
		if (myZ < insertZ)
			insertZ--;
		if (isafter)
			insertZ++;
		if (insertZ === this.instances.length)
			this.instances.push(inst);
		else
			this.instances.splice(insertZ, 0, inst);
		this.setZIndicesStaleFrom(myZ < insertZ ? myZ : insertZ);
	};
	Layer.prototype.setZIndicesStaleFrom = function (index)
	{
		if (this.zindices_stale_from === -1)			// not yet set
			this.zindices_stale_from = index;
		else if (index < this.zindices_stale_from)		// determine minimum z index affected
			this.zindices_stale_from = index;
		this.zindices_stale = true;
		this.render_list_stale = true;
	};
	Layer.prototype.updateZIndices = function ()
	{
		if (!this.zindices_stale)
			return;
		if (this.zindices_stale_from === -1)
			this.zindices_stale_from = 0;
		var i, len, inst;
		if (this.useRenderCells)
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				inst = this.instances[i];
				inst.zindex = i;
				this.render_grid.markRangeChanged(inst.rendercells);
			}
		}
		else
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				this.instances[i].zindex = i;
			}
		}
		this.zindices_stale = false;
		this.zindices_stale_from = -1;
	};
	Layer.prototype.getScale = function (include_aspect)
	{
		return this.getNormalScale() * (this.runtime.fullscreenScalingQuality || include_aspect ? this.runtime.aspect_scale : 1);
	};
	Layer.prototype.getNormalScale = function ()
	{
		return ((this.scale * this.layout.scale) - 1) * this.zoomRate + 1;
	};
	Layer.prototype.getAngle = function ()
	{
		if (this.disableAngle)
			return 0;
		return cr.clamp_angle(this.layout.angle + this.angle);
	};
	var arr_cache = [];
	function alloc_arr()
	{
		if (arr_cache.length)
			return arr_cache.pop();
		else
			return [];
	}
	function free_arr(a)
	{
		cr.clearArray(a);
		arr_cache.push(a);
	};
	function mergeSortedZArrays(a, b, out)
	{
		var i = 0, j = 0, k = 0, lena = a.length, lenb = b.length, ai, bj;
		out.length = lena + lenb;
		for ( ; i < lena && j < lenb; ++k)
		{
			ai = a[i];
			bj = b[j];
			if (ai.zindex < bj.zindex)
			{
				out[k] = ai;
				++i;
			}
			else
			{
				out[k] = bj;
				++j;
			}
		}
		for ( ; i < lena; ++i, ++k)
			out[k] = a[i];
		for ( ; j < lenb; ++j, ++k)
			out[k] = b[j];
	};
	var next_arr = [];
	function mergeAllSortedZArrays_pass(arr, first_pass)
	{
		var i, len, arr1, arr2, out;
		for (i = 0, len = arr.length; i < len - 1; i += 2)
		{
			arr1 = arr[i];
			arr2 = arr[i+1];
			out = alloc_arr();
			mergeSortedZArrays(arr1, arr2, out);
			if (!first_pass)
			{
				free_arr(arr1);
				free_arr(arr2);
			}
			next_arr.push(out);
		}
		if (len % 2 === 1)
		{
			if (first_pass)
			{
				arr1 = alloc_arr();
				cr.shallowAssignArray(arr1, arr[len - 1]);
				next_arr.push(arr1);
			}
			else
			{
				next_arr.push(arr[len - 1]);
			}
		}
		cr.shallowAssignArray(arr, next_arr);
		cr.clearArray(next_arr);
	};
	function mergeAllSortedZArrays(arr)
	{
		var first_pass = true;
		while (arr.length > 1)
		{
			mergeAllSortedZArrays_pass(arr, first_pass);
			first_pass = false;
		}
		return arr[0];
	};
	var render_arr = [];
	Layer.prototype.getRenderCellInstancesToDraw = function ()
	{
;
		this.updateZIndices();
		this.render_grid.queryRange(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom, render_arr);
		if (!render_arr.length)
			return alloc_arr();
		if (render_arr.length === 1)
		{
			var a = alloc_arr();
			cr.shallowAssignArray(a, render_arr[0]);
			cr.clearArray(render_arr);
			return a;
		}
		var draw_list = mergeAllSortedZArrays(render_arr);
		cr.clearArray(render_arr);
		return draw_list;
	};
	Layer.prototype.draw = function (ctx)
	{
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.blend_mode !== 0);
		var layer_canvas = this.runtime.canvas;
		var layer_ctx = ctx;
		var ctx_changed = false;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_canvas)
			{
				this.runtime.layer_canvas = document.createElement("canvas");
;
				layer_canvas = this.runtime.layer_canvas;
				layer_canvas.width = this.runtime.draw_width;
				layer_canvas.height = this.runtime.draw_height;
				this.runtime.layer_ctx = layer_canvas.getContext("2d");
;
				ctx_changed = true;
			}
			layer_canvas = this.runtime.layer_canvas;
			layer_ctx = this.runtime.layer_ctx;
			if (layer_canvas.width !== this.runtime.draw_width)
			{
				layer_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layer_canvas.height !== this.runtime.draw_height)
			{
				layer_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layer_ctx, this.runtime.linearSampling);
			}
			if (this.transparent)
				layer_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.globalAlpha = 1;
		layer_ctx.globalCompositeOperation = "source-over";
		if (!this.transparent)
		{
			layer_ctx.fillStyle = "rgb(" + this.background_color[0] + "," + this.background_color[1] + "," + this.background_color[2] + ")";
			layer_ctx.fillRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.save();
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, layer_ctx);
		var myscale = this.getScale();
		layer_ctx.scale(myscale, myscale);
		layer_ctx.translate(-px, -py);
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstance(inst, layer_ctx);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		layer_ctx.restore();
		if (this.render_offscreen)
		{
			ctx.globalCompositeOperation = this.compositeOp;
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(layer_canvas, 0, 0);
		}
	};
	Layer.prototype.drawInstance = function(inst, layer_ctx)
	{
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		layer_ctx.globalCompositeOperation = inst.compositeOp;
		inst.draw(layer_ctx);
	};
	Layer.prototype.updateViewport = function (ctx)
	{
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, ctx);
	};
	Layer.prototype.rotateViewport = function (px, py, ctx)
	{
		var myscale = this.getScale();
		this.viewLeft = px;
		this.viewTop = py;
		this.viewRight = px + (this.runtime.draw_width * (1 / myscale));
		this.viewBottom = py + (this.runtime.draw_height * (1 / myscale));
		var temp;
		if (this.viewLeft > this.viewRight)
		{
			temp = this.viewLeft;
			this.viewLeft = this.viewRight;
			this.viewRight = temp;
		}
		if (this.viewTop > this.viewBottom)
		{
			temp = this.viewTop;
			this.viewTop = this.viewBottom;
			this.viewBottom = temp;
		}
		var myAngle = this.getAngle();
		if (myAngle !== 0)
		{
			if (ctx)
			{
				ctx.translate(this.runtime.draw_width / 2, this.runtime.draw_height / 2);
				ctx.rotate(-myAngle);
				ctx.translate(this.runtime.draw_width / -2, this.runtime.draw_height / -2);
			}
			this.tmprect.set(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom);
			this.tmprect.offset((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			this.tmpquad.set_from_rotated_rect(this.tmprect, myAngle);
			this.tmpquad.bounding_box(this.tmprect);
			this.tmprect.offset((this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2);
			this.viewLeft = this.tmprect.left;
			this.viewTop = this.tmprect.top;
			this.viewRight = this.tmprect.right;
			this.viewBottom = this.tmprect.bottom;
		}
	}
	Layer.prototype.drawGL_earlyZPass = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = this.forceOwnTexture;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, inst, last_inst = null;
		for (i = instances_to_draw.length - 1; i >= 0; --i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL_earlyZPass(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (!this.transparent)
		{
			this.clear_earlyz_index = this.runtime.earlyz_index++;
			glw.setEarlyZIndex(this.clear_earlyz_index);
			glw.setColorFillMode(1, 1, 1, 1);
			glw.fullscreenQuad();		// fill remaining space in depth buffer with current Z value
			glw.restoreEarlyZMode();
		}
	};
	Layer.prototype.drawGL = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.active_effect_types.length > 0 || this.blend_mode !== 0);
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
			if (this.transparent)
				glw.clear(0, 0, 0, 0);
		}
		if (!this.transparent)
		{
			if (this.runtime.enableFrontToBack)
			{
				glw.setEarlyZIndex(this.clear_earlyz_index);
				glw.setColorFillMode(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
				glw.fullscreenQuad();
				glw.setTextureFillMode();
			}
			else
			{
				glw.clear(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
			}
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (this.render_offscreen)
		{
			shaderindex = this.active_effect_types.length ? this.active_effect_types[0].shaderindex : 0;
			etindex = this.active_effect_types.length ? this.active_effect_types[0].index : 0;
			if (this.active_effect_types.length === 0 || (this.active_effect_types.length === 1 &&
				!glw.programUsesCrossSampling(shaderindex) && this.opacity === 1))
			{
				if (this.active_effect_types.length === 1)
				{
					glw.switchProgram(shaderindex);
					glw.setProgramParameters(this.layout.getRenderTarget(),		// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 myscale,							// layerScale
											 this.getAngle(),
											 this.viewLeft, this.viewTop,
											 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
											 this.runtime.kahanTime.sum,
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				glw.setRenderingToTexture(this.layout.getRenderTarget());
				glw.setOpacity(this.opacity);
				glw.setTexture(this.runtime.layer_tex);
				glw.setBlend(this.srcBlend, this.destBlend);
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.draw_width / 2;
				var halfh = this.runtime.draw_height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
			}
			else
			{
				this.layout.renderEffectChain(glw, this, null, this.layout.getRenderTarget());
			}
		}
	};
	Layer.prototype.drawInstanceGL = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		if (inst.uses_shaders)
		{
			this.drawInstanceWithShadersGL(inst, glw);
		}
		else
		{
			glw.switchProgram(0);		// un-set any previously set shader
			glw.setBlend(inst.srcBlend, inst.destBlend);
			inst.drawGL(glw);
		}
	};
	Layer.prototype.drawInstanceGL_earlyZPass = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		inst.earlyz_index = this.runtime.earlyz_index++;
		if (inst.blend_mode !== 0 || inst.opacity !== 1 || !inst.shaders_preserve_opaqueness || !inst.drawGL_earlyZPass)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		inst.drawGL_earlyZPass(glw);
	};
	Layer.prototype.drawInstanceWithShadersGL = function (inst, glw)
	{
		var shaderindex = inst.active_effect_types[0].shaderindex;
		var etindex = inst.active_effect_types[0].index;
		var myscale = this.getScale();
		if (inst.active_effect_types.length === 1 && !glw.programUsesCrossSampling(shaderindex) &&
			!glw.programExtendsBox(shaderindex) && ((!inst.angle && !inst.layer.getAngle()) || !glw.programUsesDest(shaderindex)) &&
			inst.opacity === 1 && !inst.type.plugin.must_predraw)
		{
			glw.switchProgram(shaderindex);
			glw.setBlend(inst.srcBlend, inst.destBlend);
			if (glw.programIsAnimated(shaderindex))
				this.runtime.redraw = true;
			var destStartX = 0, destStartY = 0, destEndX = 0, destEndY = 0;
			if (glw.programUsesDest(shaderindex))
			{
				var bbox = inst.bbox;
				var screenleft = this.layerToCanvas(bbox.left, bbox.top, true, true);
				var screentop = this.layerToCanvas(bbox.left, bbox.top, false, true);
				var screenright = this.layerToCanvas(bbox.right, bbox.bottom, true, true);
				var screenbottom = this.layerToCanvas(bbox.right, bbox.bottom, false, true);
				destStartX = screenleft / windowWidth;
				destStartY = 1 - screentop / windowHeight;
				destEndX = screenright / windowWidth;
				destEndY = 1 - screenbottom / windowHeight;
			}
			var pixelWidth;
			var pixelHeight;
			if (inst.curFrame && inst.curFrame.texture_img)
			{
				var img = inst.curFrame.texture_img;
				pixelWidth = 1.0 / img.width;
				pixelHeight = 1.0 / img.height;
			}
			else
			{
				pixelWidth = 1.0 / inst.width;
				pixelHeight = 1.0 / inst.height;
			}
			glw.setProgramParameters(this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget(), // backTex
									 pixelWidth,
									 pixelHeight,
									 destStartX, destStartY,
									 destEndX, destEndY,
									 myscale,
									 this.getAngle(),
									 this.viewLeft, this.viewTop,
									 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
									 this.runtime.kahanTime.sum,
									 inst.effect_params[etindex]);
			inst.drawGL(glw);
		}
		else
		{
			this.layout.renderEffectChain(glw, this, inst, this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget());
			glw.resetModelView();
			glw.scale(myscale, myscale);
			glw.rotateZ(-this.getAngle());
			glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			glw.updateModelView();
		}
	};
	Layer.prototype.canvasToLayer = function (ptx, pty, getx, using_draw_area)
	{
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina)
		{
			ptx *= multiplier;
			pty *= multiplier;
		}
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x += ptx * invScale;
		y += pty * invScale;
		var a = this.getAngle();
		if (a !== 0)
		{
			x -= par_x;
			y -= par_y;
			var cosa = Math.cos(a);
			var sina = Math.sin(a);
			var x_temp = (x * cosa) - (y * sina);
			y = (y * cosa) + (x * sina);
			x = x_temp;
			x += par_x;
			y += par_y;
		}
		return getx ? x : y;
	};
	Layer.prototype.layerToCanvas = function (ptx, pty, getx, using_draw_area)
	{
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var a = this.getAngle();
		if (a !== 0)
		{
			ptx -= par_x;
			pty -= par_y;
			var cosa = Math.cos(-a);
			var sina = Math.sin(-a);
			var x_temp = (ptx * cosa) - (pty * sina);
			pty = (pty * cosa) + (ptx * sina);
			ptx = x_temp;
			ptx += par_x;
			pty += par_y;
		}
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x = (ptx - x) / invScale;
		y = (pty - y) / invScale;
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina && !using_draw_area)
		{
			x /= multiplier;
			y /= multiplier;
		}
		return getx ? x : y;
	};
	Layer.prototype.rotatePt = function (x_, y_, getx)
	{
		if (this.getAngle() === 0)
			return getx ? x_ : y_;
		var nx = this.layerToCanvas(x_, y_, true);
		var ny = this.layerToCanvas(x_, y_, false);
		this.disableAngle = true;
		var px = this.canvasToLayer(nx, ny, true);
		var py = this.canvasToLayer(nx, ny, true);
		this.disableAngle = false;
		return getx ? px : py;
	};
	Layer.prototype.saveToJSON = function ()
	{
		var i, len, et;
		var o = {
			"s": this.scale,
			"a": this.angle,
			"vl": this.viewLeft,
			"vt": this.viewTop,
			"vr": this.viewRight,
			"vb": this.viewBottom,
			"v": this.visible,
			"bc": this.background_color,
			"t": this.transparent,
			"px": this.parallaxX,
			"py": this.parallaxY,
			"o": this.opacity,
			"zr": this.zoomRate,
			"fx": [],
			"cg": this.created_globals,		// added r197; list of global UIDs already created
			"instances": []
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		return o;
	};
	Layer.prototype.loadFromJSON = function (o)
	{
		var i, j, len, p, inst, fx;
		this.scale = o["s"];
		this.angle = o["a"];
		this.viewLeft = o["vl"];
		this.viewTop = o["vt"];
		this.viewRight = o["vr"];
		this.viewBottom = o["vb"];
		this.visible = o["v"];
		this.background_color = o["bc"];
		this.transparent = o["t"];
		this.parallaxX = o["px"];
		this.parallaxY = o["py"];
		this.opacity = o["o"];
		this.zoomRate = o["zr"];
		this.created_globals = o["cg"] || [];		// added r197
		cr.shallowAssignArray(this.initial_instances, this.startup_initial_instances);
		var temp_set = new cr.ObjectSet();
		for (i = 0, len = this.created_globals.length; i < len; ++i)
			temp_set.add(this.created_globals[i]);
		for (i = 0, j = 0, len = this.initial_instances.length; i < len; ++i)
		{
			if (!temp_set.contains(this.initial_instances[i][2]))		// UID in element 2
			{
				this.initial_instances[j] = this.initial_instances[i];
				++j;
			}
		}
		cr.truncateArray(this.initial_instances, j);
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		this.instances.sort(sort_by_zindex);
		this.zindices_stale = true;
	};
	cr.layer = Layer;
}());
;
(function()
{
	var allUniqueSolModifiers = [];
	function testSolsMatch(arr1, arr2)
	{
		var i, len = arr1.length;
		switch (len) {
		case 0:
			return true;
		case 1:
			return arr1[0] === arr2[0];
		case 2:
			return arr1[0] === arr2[0] && arr1[1] === arr2[1];
		default:
			for (i = 0; i < len; i++)
			{
				if (arr1[i] !== arr2[i])
					return false;
			}
			return true;
		}
	};
	function solArraySorter(t1, t2)
	{
		return t1.index - t2.index;
	};
	function findMatchingSolModifier(arr)
	{
		var i, len, u, temp, subarr;
		if (arr.length === 2)
		{
			if (arr[0].index > arr[1].index)
			{
				temp = arr[0];
				arr[0] = arr[1];
				arr[1] = temp;
			}
		}
		else if (arr.length > 2)
			arr.sort(solArraySorter);		// so testSolsMatch compares in same order
		if (arr.length >= allUniqueSolModifiers.length)
			allUniqueSolModifiers.length = arr.length + 1;
		if (!allUniqueSolModifiers[arr.length])
			allUniqueSolModifiers[arr.length] = [];
		subarr = allUniqueSolModifiers[arr.length];
		for (i = 0, len = subarr.length; i < len; i++)
		{
			u = subarr[i];
			if (testSolsMatch(arr, u))
				return u;
		}
		subarr.push(arr);
		return arr;
	};
	function EventSheet(runtime, m)
	{
		this.runtime = runtime;
		this.triggers = {};
		this.fasttriggers = {};
        this.hasRun = false;
        this.includes = new cr.ObjectSet(); 	// all event sheets included by this sheet, at first-level indirection only
		this.deep_includes = [];				// all includes from this sheet recursively, in trigger order
		this.already_included_sheets = [];		// used while building deep_includes
		this.name = m[0];
		var em = m[1];		// events model
		this.events = [];       // triggers won't make it to this array
		var i, len;
		for (i = 0, len = em.length; i < len; i++)
			this.init_event(em[i], null, this.events);
	};
    EventSheet.prototype.toString = function ()
    {
        return this.name;
    };
	EventSheet.prototype.init_event = function (m, parent, nontriggers)
	{
		switch (m[0]) {
		case 0:	// event block
		{
			var block = new cr.eventblock(this, parent, m);
			cr.seal(block);
			if (block.orblock)
			{
				nontriggers.push(block);
				var i, len;
				for (i = 0, len = block.conditions.length; i < len; i++)
				{
					if (block.conditions[i].trigger)
						this.init_trigger(block, i);
				}
			}
			else
			{
				if (block.is_trigger())
					this.init_trigger(block, 0);
				else
					nontriggers.push(block);
			}
			break;
		}
		case 1: // variable
		{
			var v = new cr.eventvariable(this, parent, m);
			cr.seal(v);
			nontriggers.push(v);
			break;
		}
        case 2:	// include
        {
            var inc = new cr.eventinclude(this, parent, m);
			cr.seal(inc);
            nontriggers.push(inc);
			break;
        }
		default:
;
		}
	};
	EventSheet.prototype.postInit = function ()
	{
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			this.events[i].postInit(i < len - 1 && this.events[i + 1].is_else_block);
		}
	};
	EventSheet.prototype.updateDeepIncludes = function ()
	{
		cr.clearArray(this.deep_includes);
		cr.clearArray(this.already_included_sheets);
		this.addDeepIncludes(this);
		cr.clearArray(this.already_included_sheets);
	};
	EventSheet.prototype.addDeepIncludes = function (root_sheet)
	{
		var i, len, inc, sheet;
		var deep_includes = root_sheet.deep_includes;
		var already_included_sheets = root_sheet.already_included_sheets;
		var arr = this.includes.valuesRef();
		for (i = 0, len = arr.length; i < len; ++i)
		{
			inc = arr[i];
			sheet = inc.include_sheet;
			if (!inc.isActive() || root_sheet === sheet || already_included_sheets.indexOf(sheet) > -1)
				continue;
			already_included_sheets.push(sheet);
			sheet.addDeepIncludes(root_sheet);
			deep_includes.push(sheet);
		}
	};
	EventSheet.prototype.run = function (from_include)
	{
		if (!this.runtime.resuming_breakpoint)
		{
			this.hasRun = true;
			if (!from_include)
				this.runtime.isRunningEvents = true;
		}
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			var ev = this.events[i];
			ev.run();
				this.runtime.clearSol(ev.solModifiers);
				if (this.runtime.hasPendingInstances)
					this.runtime.ClearDeathRow();
		}
			if (!from_include)
				this.runtime.isRunningEvents = false;
	};
	function isPerformanceSensitiveTrigger(method)
	{
		if (cr.plugins_.Sprite && method === cr.plugins_.Sprite.prototype.cnds.OnFrameChanged)
		{
			return true;
		}
		return false;
	};
	EventSheet.prototype.init_trigger = function (trig, index)
	{
		if (!trig.orblock)
			this.runtime.triggers_to_postinit.push(trig);	// needs to be postInit'd later
		var i, len;
		var cnd = trig.conditions[index];
		var type_name;
		if (cnd.type)
			type_name = cnd.type.name;
		else
			type_name = "system";
		var fasttrigger = cnd.fasttrigger;
		var triggers = (fasttrigger ? this.fasttriggers : this.triggers);
		if (!triggers[type_name])
			triggers[type_name] = [];
		var obj_entry = triggers[type_name];
		var method = cnd.func;
		if (fasttrigger)
		{
			if (!cnd.parameters.length)				// no parameters
				return;
			var firstparam = cnd.parameters[0];
			if (firstparam.type !== 1 ||			// not a string param
				firstparam.expression.type !== 2)	// not a string literal node
			{
				return;
			}
			var fastevs;
			var firstvalue = firstparam.expression.value.toLowerCase();
			var i, len;
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					fastevs = obj_entry[i].evs;
					if (!fastevs[firstvalue])
						fastevs[firstvalue] = [[trig, index]];
					else
						fastevs[firstvalue].push([trig, index]);
					return;
				}
			}
			fastevs = {};
			fastevs[firstvalue] = [[trig, index]];
			obj_entry.push({ method: method, evs: fastevs });
		}
		else
		{
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					obj_entry[i].evs.push([trig, index]);
					return;
				}
			}
			if (isPerformanceSensitiveTrigger(method))
				obj_entry.unshift({ method: method, evs: [[trig, index]]});
			else
				obj_entry.push({ method: method, evs: [[trig, index]]});
		}
	};
	cr.eventsheet = EventSheet;
	function Selection(type)
	{
		this.type = type;
		this.instances = [];        // subset of picked instances
		this.else_instances = [];	// subset of unpicked instances
		this.select_all = true;
	};
	Selection.prototype.hasObjects = function ()
	{
		if (this.select_all)
			return this.type.instances.length;
		else
			return this.instances.length;
	};
	Selection.prototype.getObjects = function ()
	{
		if (this.select_all)
			return this.type.instances;
		else
			return this.instances;
	};
	/*
	Selection.prototype.ensure_picked = function (inst, skip_siblings)
	{
		var i, len;
		var orblock = inst.runtime.getCurrentEventStack().current_event.orblock;
		if (this.select_all)
		{
			this.select_all = false;
			if (orblock)
			{
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				cr.arrayFindRemove(this.else_instances, inst);
			}
			this.instances.length = 1;
			this.instances[0] = inst;
		}
		else
		{
			if (orblock)
			{
				i = this.else_instances.indexOf(inst);
				if (i !== -1)
				{
					this.instances.push(this.else_instances[i]);
					this.else_instances.splice(i, 1);
				}
			}
			else
			{
				if (this.instances.indexOf(inst) === -1)
					this.instances.push(inst);
			}
		}
		if (!skip_siblings)
		{
		}
	};
	*/
	Selection.prototype.pick_one = function (inst)
	{
		if (!inst)
			return;
		if (inst.runtime.getCurrentEventStack().current_event.orblock)
		{
			if (this.select_all)
			{
				cr.clearArray(this.instances);
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				this.select_all = false;
			}
			var i = this.else_instances.indexOf(inst);
			if (i !== -1)
			{
				this.instances.push(this.else_instances[i]);
				this.else_instances.splice(i, 1);
			}
		}
		else
		{
			this.select_all = false;
			cr.clearArray(this.instances);
			this.instances[0] = inst;
		}
	};
	cr.selection = Selection;
	function EventBlock(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.solModifiersIncludingParents = [];
		this.solWriterAfterCnds = false;	// block does not change SOL after running its conditions
		this.group = false;					// is group of events
		this.initially_activated = false;	// if a group, is active on startup
		this.toplevelevent = false;			// is an event block parented only by a top-level group
		this.toplevelgroup = false;			// is parented only by other groups or is top-level (i.e. not in a subevent)
		this.has_else_block = false;		// is followed by else
;
		this.conditions = [];
		this.actions = [];
		this.subevents = [];
		this.group_name = "";
		this.group = false;
		this.initially_activated = false;
		this.group_active = false;
		this.contained_includes = null;
        if (m[1])
        {
			this.group_name = m[1][1].toLowerCase();
			this.group = true;
			this.initially_activated = !!m[1][0];
			this.contained_includes = [];
			this.group_active = this.initially_activated;
			this.runtime.allGroups.push(this);
            this.runtime.groups_by_name[this.group_name] = this;
        }
		this.orblock = m[2];
		this.sid = m[4];
		if (!this.group)
			this.runtime.blocksBySid[this.sid.toString()] = this;
		var i, len;
		var cm = m[5];
		for (i = 0, len = cm.length; i < len; i++)
		{
			var cnd = new cr.condition(this, cm[i]);
			cnd.index = i;
			cr.seal(cnd);
			this.conditions.push(cnd);
			/*
			if (cnd.is_logical())
				this.is_logical = true;
			if (cnd.type && !cnd.type.plugin.singleglobal && this.cndReferences.indexOf(cnd.type) === -1)
				this.cndReferences.push(cnd.type);
			*/
			this.addSolModifier(cnd.type);
		}
		var am = m[6];
		for (i = 0, len = am.length; i < len; i++)
		{
			var act = new cr.action(this, am[i]);
			act.index = i;
			cr.seal(act);
			this.actions.push(act);
		}
		if (m.length === 8)
		{
			var em = m[7];
			for (i = 0, len = em.length; i < len; i++)
				this.sheet.init_event(em[i], this, this.subevents);
		}
		this.is_else_block = false;
		if (this.conditions.length)
		{
			this.is_else_block = (this.conditions[0].type == null && this.conditions[0].func == cr.system_object.prototype.cnds.Else);
		}
	};
	window["_c2hh_"] = "037C0FC50ADDD297D44DED34FA8EE3CD5EE9F592";
	EventBlock.prototype.postInit = function (hasElse/*, prevBlock_*/)
	{
		var i, len;
		var p = this.parent;
		if (this.group)
		{
			this.toplevelgroup = true;
			while (p)
			{
				if (!p.group)
				{
					this.toplevelgroup = false;
					break;
				}
				p = p.parent;
			}
		}
		this.toplevelevent = !this.is_trigger() && (!this.parent || (this.parent.group && this.parent.toplevelgroup));
		this.has_else_block = !!hasElse;
		this.solModifiersIncludingParents = this.solModifiers.slice(0);
		p = this.parent;
		while (p)
		{
			for (i = 0, len = p.solModifiers.length; i < len; i++)
				this.addParentSolModifier(p.solModifiers[i]);
			p = p.parent;
		}
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		this.solModifiersIncludingParents = findMatchingSolModifier(this.solModifiersIncludingParents);
		var i, len/*, s*/;
		for (i = 0, len = this.conditions.length; i < len; i++)
			this.conditions[i].postInit();
		for (i = 0, len = this.actions.length; i < len; i++)
			this.actions[i].postInit();
		for (i = 0, len = this.subevents.length; i < len; i++)
		{
			this.subevents[i].postInit(i < len - 1 && this.subevents[i + 1].is_else_block);
		}
		/*
		if (this.is_else_block && this.prev_block)
		{
			for (i = 0, len = this.prev_block.solModifiers.length; i < len; i++)
			{
				s = this.prev_block.solModifiers[i];
				if (this.solModifiers.indexOf(s) === -1)
					this.solModifiers.push(s);
			}
		}
		*/
	};
	EventBlock.prototype.setGroupActive = function (a)
	{
		if (this.group_active === !!a)
			return;		// same state
		this.group_active = !!a;
		var i, len;
		for (i = 0, len = this.contained_includes.length; i < len; ++i)
		{
			this.contained_includes[i].updateActive();
		}
		if (len > 0 && this.runtime.running_layout.event_sheet)
			this.runtime.running_layout.event_sheet.updateDeepIncludes();
	};
	function addSolModifierToList(type, arr)
	{
		var i, len, t;
		if (!type)
			return;
		if (arr.indexOf(type) === -1)
			arr.push(type);
		if (type.is_contained)
		{
			for (i = 0, len = type.container.length; i < len; i++)
			{
				t = type.container[i];
				if (type === t)
					continue;		// already handled
				if (arr.indexOf(t) === -1)
					arr.push(t);
			}
		}
	};
	EventBlock.prototype.addSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiers);
	};
	EventBlock.prototype.addParentSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiersIncludingParents);
	};
	EventBlock.prototype.setSolWriterAfterCnds = function ()
	{
		this.solWriterAfterCnds = true;
		if (this.parent)
			this.parent.setSolWriterAfterCnds();
	};
	EventBlock.prototype.is_trigger = function ()
	{
		if (!this.conditions.length)    // no conditions
			return false;
		else
			return this.conditions[0].trigger;
	};
	EventBlock.prototype.run = function ()
	{
		var i, len, c, any_true = false, cnd_result;
		var runtime = this.runtime;
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var conditions = this.conditions;
			if (!this.is_else_block)
				evinfo.else_branch_ran = false;
		if (this.orblock)
		{
			if (conditions.length === 0)
				any_true = true;		// be sure to run if empty block
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				c = conditions[evinfo.cndindex];
				if (c.trigger)		// skip triggers when running OR block
					continue;
				cnd_result = c.run();
				if (cnd_result)			// make sure all conditions run and run if any were true
					any_true = true;
			}
			evinfo.last_event_true = any_true;
			if (any_true)
				this.run_actions_and_subevents();
		}
		else
		{
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				cnd_result = conditions[evinfo.cndindex].run();
				if (!cnd_result)    // condition failed
				{
					evinfo.last_event_true = false;
					if (this.toplevelevent && runtime.hasPendingInstances)
						runtime.ClearDeathRow();
					return;		// bail out now
				}
			}
			evinfo.last_event_true = true;
			this.run_actions_and_subevents();
		}
		this.end_run(evinfo);
	};
	EventBlock.prototype.end_run = function (evinfo)
	{
		if (evinfo.last_event_true && this.has_else_block)
			evinfo.else_branch_ran = true;
		if (this.toplevelevent && this.runtime.hasPendingInstances)
			this.runtime.ClearDeathRow();
	};
	EventBlock.prototype.run_orblocktrigger = function (index)
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		if (this.conditions[index].run())
		{
			this.run_actions_and_subevents();
			this.runtime.getCurrentEventStack().last_event_true = true;
		}
	};
	EventBlock.prototype.run_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (evinfo.actindex = 0, len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.resume_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.run_subevents = function ()
	{
		if (!this.subevents.length)
			return;
		var i, len, subev, pushpop/*, skipped_pop = false, pop_modifiers = null*/;
		var last = this.subevents.length - 1;
			this.runtime.pushEventStack(this);
		if (this.solWriterAfterCnds)
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				subev = this.subevents[i];
					pushpop = (!this.toplevelgroup || (!this.group && i < last));
					if (pushpop)
						this.runtime.pushCopySol(subev.solModifiers);
				subev.run();
					if (pushpop)
						this.runtime.popSol(subev.solModifiers);
					else
						this.runtime.clearSol(subev.solModifiers);
			}
		}
		else
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				this.subevents[i].run();
			}
		}
			this.runtime.popEventStack();
	};
	EventBlock.prototype.run_pretrigger = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var any_true = false;
		var i, len;
		for (evinfo.cndindex = 0, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
		{
;
			if (this.conditions[evinfo.cndindex].run())
				any_true = true;
			else if (!this.orblock)			// condition failed (let OR blocks run all conditions anyway)
				return false;               // bail out
		}
		return this.orblock ? any_true : true;
	};
	EventBlock.prototype.retrigger = function ()
	{
		this.runtime.execcount++;
		var prevcndindex = this.runtime.getCurrentEventStack().cndindex;
		var len;
		var evinfo = this.runtime.pushEventStack(this);
		if (!this.orblock)
		{
			for (evinfo.cndindex = prevcndindex + 1, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				if (!this.conditions[evinfo.cndindex].run())    // condition failed
				{
					this.runtime.popEventStack();               // moving up level of recursion
					return false;                               // bail out
				}
			}
		}
		this.run_actions_and_subevents();
		this.runtime.popEventStack();
		return true;		// ran an iteration
	};
	EventBlock.prototype.isFirstConditionOfType = function (cnd)
	{
		var cndindex = cnd.index;
		if (cndindex === 0)
			return true;
		--cndindex;
		for ( ; cndindex >= 0; --cndindex)
		{
			if (this.conditions[cndindex].type === cnd.type)
				return false;
		}
		return true;
	};
	cr.eventblock = EventBlock;
	function Condition(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		this.trigger = (m[3] > 0);
		this.fasttrigger = (m[3] === 2);
		this.looping = m[4];
		this.inverted = m[5];
		this.isstatic = m[6];
		this.sid = m[7];
		this.runtime.cndsBySid[this.sid.toString()] = this;
		if (m[0] === -1)		// system object
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			if (this.isstatic)
				this.run = this.run_static;
			else
				this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
			if (this.block.parent)
				this.block.parent.setSolWriterAfterCnds();
		}
		if (this.fasttrigger)
			this.run = this.run_true;
		if (m.length === 10)
		{
			var i, len;
			var em = m[9];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Condition.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	/*
	Condition.prototype.is_logical = function ()
	{
		return !this.type || this.type.plugin.singleglobal;
	};
	*/
	Condition.prototype.run_true = function ()
	{
		return true;
	};
	Condition.prototype.run_system = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		return cr.xor(this.func.apply(this.runtime.system, this.results), this.inverted);
	};
	Condition.prototype.run_static = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		var ret = this.func.apply(this.behaviortype ? this.behaviortype : this.type, this.results);
		this.type.applySolToContainer();
		return ret;
	};
	Condition.prototype.run_object = function ()
	{
		var i, j, k, leni, lenj, p, ret, met, inst, s, sol2;
		var type = this.type;
		var sol = type.getCurrentSol();
		var is_orblock = this.block.orblock && !this.trigger;		// triggers in OR blocks need to work normally
		var offset = 0;
		var is_contained = type.is_contained;
		var is_family = type.is_family;
		var family_index = type.family_index;
		var beh_index = this.beh_index;
		var is_beh = (beh_index > -1);
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var inverted = this.inverted;
		var func = this.func;
		var arr, container;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		if (sol.select_all) {
			cr.clearArray(sol.instances);       // clear contents
			cr.clearArray(sol.else_instances);
			arr = type.instances;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				met = cr.xor(ret, inverted);
				if (met)
					sol.instances.push(inst);
				else if (is_orblock)					// in OR blocks, keep the instances not meeting the condition for subsequent testing
					sol.else_instances.push(inst);
			}
			if (type.finish)
				type.finish(true);
			sol.select_all = false;
			type.applySolToContainer();
			return sol.hasObjects();
		}
		else {
			k = 0;
			var using_else_instances = (is_orblock && !this.block.isFirstConditionOfType(this));
			arr = (using_else_instances ? sol.else_instances : sol.instances);
			var any_true = false;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				if (cr.xor(ret, inverted))
				{
					any_true = true;
					if (using_else_instances)
					{
						sol.instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances.push(s);
							}
						}
					}
					else
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances[k] = s;
							}
						}
						k++;
					}
				}
				else
				{
					if (using_else_instances)
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances[k] = s;
							}
						}
						k++;
					}
					else if (is_orblock)
					{
						sol.else_instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances.push(s);
							}
						}
					}
				}
			}
			cr.truncateArray(arr, k);
			if (is_contained)
			{
				container = type.container;
				for (i = 0, leni = container.length; i < leni; i++)
				{
					sol2 = container[i].getCurrentSol();
					if (using_else_instances)
						cr.truncateArray(sol2.else_instances, k);
					else
						cr.truncateArray(sol2.instances, k);
				}
			}
			var pick_in_finish = any_true;		// don't pick in finish() if we're only doing the logic test below
			if (using_else_instances && !any_true)
			{
				for (i = 0, leni = sol.instances.length; i < leni; i++)
				{
					inst = sol.instances[i];
					if (params_vary)
					{
						for (j = 0, lenj = parameters.length; j < lenj; j++)
						{
							p = parameters[j];
							if (p.variesPerInstance)
								results[j] = p.get(i);
						}
					}
					if (is_beh)
						ret = func.apply(inst.behavior_insts[beh_index], results);
					else
						ret = func.apply(inst, results);
					if (cr.xor(ret, inverted))
					{
						any_true = true;
						break;		// got our flag, don't need to test any more
					}
				}
			}
			if (type.finish)
				type.finish(pick_in_finish || is_orblock);
			return is_orblock ? any_true : sol.hasObjects();
		}
	};
	cr.condition = Condition;
	function Action(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		if (m[0] === -1)	// system
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
		}
		this.sid = m[3];
		this.runtime.actsBySid[this.sid.toString()] = this;
		if (m.length === 6)
		{
			var i, len;
			var em = m[5];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Action.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	Action.prototype.run_system = function ()
	{
		var runtime = this.runtime;
		var i, len;
		var parameters = this.parameters;
		var results = this.results;
		for (i = 0, len = parameters.length; i < len; ++i)
			results[i] = parameters[i].get();
		return this.func.apply(runtime.system, results);
	};
	Action.prototype.run_object = function ()
	{
		var type = this.type;
		var beh_index = this.beh_index;
		var family_index = type.family_index;
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var func = this.func;
		var instances = type.getCurrentSol().getObjects();
		var is_family = type.is_family;
		var is_beh = (beh_index > -1);
		var i, j, leni, lenj, p, inst, offset;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		for (i = 0, leni = instances.length; i < leni; ++i)
		{
			inst = instances[i];
			if (params_vary)
			{
				for (j = 0, lenj = parameters.length; j < lenj; ++j)
				{
					p = parameters[j];
					if (p.variesPerInstance)
						results[j] = p.get(i);    // pass i to use as default SOL index
				}
			}
			if (is_beh)
			{
				offset = 0;
				if (is_family)
				{
					offset = inst.type.family_beh_map[family_index];
				}
				func.apply(inst.behavior_insts[beh_index + offset], results);
			}
			else
				func.apply(inst, results);
		}
		return false;
	};
	cr.action = Action;
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		tempValuesPtr++;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		tempValuesPtr--;
	};
	function Parameter(owner, m)
	{
		this.owner = owner;
		this.block = owner.block;
		this.sheet = owner.sheet;
		this.runtime = owner.runtime;
		this.type = m[0];
		this.expression = null;
		this.solindex = 0;
		this.get = null;
		this.combosel = 0;
		this.layout = null;
		this.key = 0;
		this.object = null;
		this.index = 0;
		this.varname = null;
		this.eventvar = null;
		this.fileinfo = null;
		this.subparams = null;
		this.variadicret = null;
		this.subparams = null;
		this.variadicret = null;
		this.variesPerInstance = false;
		var i, len, param;
		switch (m[0])
		{
			case 0:		// number
			case 7:		// any
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp;
				break;
			case 1:		// string
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp_str;
				break;
			case 5:		// layer
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_layer;
				break;
			case 3:		// combo
			case 8:		// cmp
				this.combosel = m[1];
				this.get = this.get_combosel;
				break;
			case 6:		// layout
				this.layout = this.runtime.layouts[m[1]];
;
				this.get = this.get_layout;
				break;
			case 9:		// keyb
				this.key = m[1];
				this.get = this.get_key;
				break;
			case 4:		// object
				this.object = this.runtime.types_by_index[m[1]];
;
				this.get = this.get_object;
				this.block.addSolModifier(this.object);
				if (this.owner instanceof cr.action)
					this.block.setSolWriterAfterCnds();
				else if (this.block.parent)
					this.block.parent.setSolWriterAfterCnds();
				break;
			case 10:	// instvar
				this.index = m[1];
				if (owner.type && owner.type.is_family)
				{
					this.get = this.get_familyvar;
					this.variesPerInstance = true;
				}
				else
					this.get = this.get_instvar;
				break;
			case 11:	// eventvar
				this.varname = m[1];
				this.eventvar = null;
				this.get = this.get_eventvar;
				break;
			case 2:		// audiofile	["name", ismusic]
			case 12:	// fileinfo		"name"
				this.fileinfo = m[1];
				this.get = this.get_audiofile;
				break;
			case 13:	// variadic
				this.get = this.get_variadic;
				this.subparams = [];
				this.variadicret = [];
				for (i = 1, len = m.length; i < len; i++)
				{
					param = new cr.parameter(this.owner, m[i]);
					cr.seal(param);
					this.subparams.push(param);
					this.variadicret.push(0);
				}
				break;
			default:
;
		}
	};
	Parameter.prototype.postInit = function ()
	{
		var i, len;
		if (this.type === 11)		// eventvar
		{
			this.eventvar = this.runtime.getEventVariableByName(this.varname, this.block.parent);
;
		}
		else if (this.type === 13)	// variadic, postInit all sub-params
		{
			for (i = 0, len = this.subparams.length; i < len; i++)
				this.subparams[i].postInit();
		}
		if (this.expression)
			this.expression.postInit();
	};
	Parameter.prototype.maybeVaryForType = function (t)
	{
		if (this.variesPerInstance)
			return;				// already varies per instance, no need to check again
		if (!t)
			return;				// never vary for system type
		if (!t.plugin.singleglobal)
		{
			this.variesPerInstance = true;
			return;
		}
	};
	Parameter.prototype.setVaries = function ()
	{
		this.variesPerInstance = true;
	};
	Parameter.prototype.get_exp = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		return temp.data;      			// return actual JS value, not expvalue
	};
	Parameter.prototype.get_exp_str = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (cr.is_string(temp.data))
			return temp.data;
		else
			return "";
	};
	Parameter.prototype.get_object = function ()
	{
		return this.object;
	};
	Parameter.prototype.get_combosel = function ()
	{
		return this.combosel;
	};
	Parameter.prototype.get_layer = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (temp.is_number())
			return this.runtime.getLayerByNumber(temp.data);
		else
			return this.runtime.getLayerByName(temp.data);
	}
	Parameter.prototype.get_layout = function ()
	{
		return this.layout;
	};
	Parameter.prototype.get_key = function ()
	{
		return this.key;
	};
	Parameter.prototype.get_instvar = function ()
	{
		return this.index;
	};
	Parameter.prototype.get_familyvar = function (solindex_)
	{
		var solindex = solindex_ || 0;
		var familytype = this.owner.type;
		var realtype = null;
		var sol = familytype.getCurrentSol();
		var objs = sol.getObjects();
		if (objs.length)
			realtype = objs[solindex % objs.length].type;
		else if (sol.else_instances.length)
			realtype = sol.else_instances[solindex % sol.else_instances.length].type;
		else if (familytype.instances.length)
			realtype = familytype.instances[solindex % familytype.instances.length].type;
		else
			return 0;
		return this.index + realtype.family_var_map[familytype.family_index];
	};
	Parameter.prototype.get_eventvar = function ()
	{
		return this.eventvar;
	};
	Parameter.prototype.get_audiofile = function ()
	{
		return this.fileinfo;
	};
	Parameter.prototype.get_variadic = function ()
	{
		var i, len;
		for (i = 0, len = this.subparams.length; i < len; i++)
		{
			this.variadicret[i] = this.subparams[i].get();
		}
		return this.variadicret;
	};
	cr.parameter = Parameter;
	function EventVariable(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.name = m[1];
		this.vartype = m[2];
		this.initial = m[3];
		this.is_static = !!m[4];
		this.is_constant = !!m[5];
		this.sid = m[6];
		this.runtime.varsBySid[this.sid.toString()] = this;
		this.data = this.initial;	// note: also stored in event stack frame for local nonstatic nonconst vars
		if (this.parent)			// local var
		{
			if (this.is_static || this.is_constant)
				this.localIndex = -1;
			else
				this.localIndex = this.runtime.stackLocalCount++;
			this.runtime.all_local_vars.push(this);
		}
		else						// global var
		{
			this.localIndex = -1;
			this.runtime.all_global_vars.push(this);
		}
	};
	EventVariable.prototype.postInit = function ()
	{
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
	};
	EventVariable.prototype.setValue = function (x)
	{
;
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs)
			this.data = x;
		else	// local nonstatic variable: use event stack to keep value at this level of recursion
		{
			if (this.localIndex >= lvs.length)
				lvs.length = this.localIndex + 1;
			lvs[this.localIndex] = x;
		}
	};
	EventVariable.prototype.getValue = function ()
	{
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs || this.is_constant)
			return this.data;
		else	// local nonstatic variable
		{
			if (this.localIndex >= lvs.length)
			{
				return this.initial;
			}
			if (typeof lvs[this.localIndex] === "undefined")
			{
				return this.initial;
			}
			return lvs[this.localIndex];
		}
	};
	EventVariable.prototype.run = function ()
	{
			if (this.parent && !this.is_static && !this.is_constant)
				this.setValue(this.initial);
	};
	cr.eventvariable = EventVariable;
	function EventInclude(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.include_sheet = null;		// determined in postInit
		this.include_sheet_name = m[1];
		this.active = true;
	};
	EventInclude.prototype.toString = function ()
	{
		return "include:" + this.include_sheet.toString();
	};
	EventInclude.prototype.postInit = function ()
	{
        this.include_sheet = this.runtime.eventsheets[this.include_sheet_name];
;
;
        this.sheet.includes.add(this);
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		var p = this.parent;
		while (p)
		{
			if (p.group)
				p.contained_includes.push(this);
			p = p.parent;
		}
		this.updateActive();
	};
	EventInclude.prototype.run = function ()
	{
			if (this.parent)
				this.runtime.pushCleanSol(this.runtime.types_by_index);
        if (!this.include_sheet.hasRun)
            this.include_sheet.run(true);			// from include
			if (this.parent)
				this.runtime.popSol(this.runtime.types_by_index);
	};
	EventInclude.prototype.updateActive = function ()
	{
		var p = this.parent;
		while (p)
		{
			if (p.group && !p.group_active)
			{
				this.active = false;
				return;
			}
			p = p.parent;
		}
		this.active = true;
	};
	EventInclude.prototype.isActive = function ()
	{
		return this.active;
	};
	cr.eventinclude = EventInclude;
	function EventStackFrame()
	{
		this.temp_parents_arr = [];
		this.reset(null);
		cr.seal(this);
	};
	EventStackFrame.prototype.reset = function (cur_event)
	{
		this.current_event = cur_event;
		this.cndindex = 0;
		this.actindex = 0;
		cr.clearArray(this.temp_parents_arr);
		this.last_event_true = false;
		this.else_branch_ran = false;
		this.any_true_state = false;
	};
	EventStackFrame.prototype.isModifierAfterCnds = function ()
	{
		if (this.current_event.solWriterAfterCnds)
			return true;
		if (this.cndindex < this.current_event.conditions.length - 1)
			return !!this.current_event.solModifiers.length;
		return false;
	};
	cr.eventStackFrame = EventStackFrame;
}());
(function()
{
	function ExpNode(owner_, m)
	{
		this.owner = owner_;
		this.runtime = owner_.runtime;
		this.type = m[0];
;
		this.get = [this.eval_int,
					this.eval_float,
					this.eval_string,
					this.eval_unaryminus,
					this.eval_add,
					this.eval_subtract,
					this.eval_multiply,
					this.eval_divide,
					this.eval_mod,
					this.eval_power,
					this.eval_and,
					this.eval_or,
					this.eval_equal,
					this.eval_notequal,
					this.eval_less,
					this.eval_lessequal,
					this.eval_greater,
					this.eval_greaterequal,
					this.eval_conditional,
					this.eval_system_exp,
					this.eval_object_exp,
					this.eval_instvar_exp,
					this.eval_behavior_exp,
					this.eval_eventvar_exp][this.type];
		var paramsModel = null;
		this.value = null;
		this.first = null;
		this.second = null;
		this.third = null;
		this.func = null;
		this.results = null;
		this.parameters = null;
		this.object_type = null;
		this.beh_index = -1;
		this.instance_expr = null;
		this.varindex = -1;
		this.behavior_type = null;
		this.varname = null;
		this.eventvar = null;
		this.return_string = false;
		switch (this.type) {
		case 0:		// int
		case 1:		// float
		case 2:		// string
			this.value = m[1];
			break;
		case 3:		// unaryminus
			this.first = new cr.expNode(owner_, m[1]);
			break;
		case 18:	// conditional
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
			this.third = new cr.expNode(owner_, m[3]);
			break;
		case 19:	// system_exp
			this.func = this.runtime.GetObjectReference(m[1]);
;
			if (this.func === cr.system_object.prototype.exps.random
			 || this.func === cr.system_object.prototype.exps.choose)
			{
				this.owner.setVaries();
			}
			this.results = [];
			this.parameters = [];
			if (m.length === 3)
			{
				paramsModel = m[2];
				this.results.length = paramsModel.length + 1;	// must also fit 'ret'
			}
			else
				this.results.length = 1;      // to fit 'ret'
			break;
		case 20:	// object_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.beh_index = -1;
			this.func = this.runtime.GetObjectReference(m[2]);
			this.return_string = m[3];
			if (cr.plugins_.Function && this.func === cr.plugins_.Function.prototype.exps.Call)
			{
				this.owner.setVaries();
			}
			if (m[4])
				this.instance_expr = new cr.expNode(owner_, m[4]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 6)
			{
				paramsModel = m[5];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 21:		// instvar_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.return_string = m[2];
			if (m[3])
				this.instance_expr = new cr.expNode(owner_, m[3]);
			else
				this.instance_expr = null;
			this.varindex = m[4];
			break;
		case 22:		// behavior_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.behavior_type = this.object_type.getBehaviorByName(m[2]);
;
			this.beh_index = this.object_type.getBehaviorIndexByName(m[2]);
			this.func = this.runtime.GetObjectReference(m[3]);
			this.return_string = m[4];
			if (m[5])
				this.instance_expr = new cr.expNode(owner_, m[5]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 7)
			{
				paramsModel = m[6];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 23:		// eventvar_exp
			this.varname = m[1];
			this.eventvar = null;	// assigned in postInit
			break;
		}
		this.owner.maybeVaryForType(this.object_type);
		if (this.type >= 4 && this.type <= 17)
		{
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
		}
		if (paramsModel)
		{
			var i, len;
			for (i = 0, len = paramsModel.length; i < len; i++)
				this.parameters.push(new cr.expNode(owner_, paramsModel[i]));
		}
		cr.seal(this);
	};
	ExpNode.prototype.postInit = function ()
	{
		if (this.type === 23)	// eventvar_exp
		{
			this.eventvar = this.owner.runtime.getEventVariableByName(this.varname, this.owner.block.parent);
;
		}
		if (this.first)
			this.first.postInit();
		if (this.second)
			this.second.postInit();
		if (this.third)
			this.third.postInit();
		if (this.instance_expr)
			this.instance_expr.postInit();
		if (this.parameters)
		{
			var i, len;
			for (i = 0, len = this.parameters.length; i < len; i++)
				this.parameters[i].postInit();
		}
	};
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		++tempValuesPtr;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		--tempValuesPtr;
	};
	function eval_params(parameters, results, temp)
	{
		var i, len;
		for (i = 0, len = parameters.length; i < len; ++i)
		{
			parameters[i].get(temp);
			results[i + 1] = temp.data;   // passing actual javascript value as argument instead of expvalue
		}
	}
	ExpNode.prototype.eval_system_exp = function (ret)
	{
		var parameters = this.parameters;
		var results = this.results;
		results[0] = ret;
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		popTempValue();
		this.func.apply(this.runtime.system, results);
	};
	ExpNode.prototype.eval_object_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var returned_val = func.apply(instances[index], results);
;
	};
	ExpNode.prototype.eval_behavior_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var beh_index = this.beh_index;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_beh_map[object_type.family_index];
		}
		var returned_val = func.apply(inst.behavior_insts[beh_index + offset], results);
;
	};
	ExpNode.prototype.eval_instvar_exp = function (ret)
	{
		var instance_expr = this.instance_expr;
		var object_type = this.object_type;
		var varindex = this.varindex;
		var index = this.owner.solindex;		// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		var inst;
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		if (instance_expr)
		{
			var temp = pushTempValue();
			instance_expr.get(temp);
			if (temp.is_number())
			{
				index = temp.data;
				var type_instances = object_type.instances;
				if (type_instances.length !== 0)		// avoid NaN result with %
				{
					index %= type_instances.length;     // wraparound
					if (index < 0)                      // offset
						index += type_instances.length;
				}
				inst = object_type.getInstanceByIID(index);
				var to_ret = inst.instance_vars[varindex];
				if (cr.is_string(to_ret))
					ret.set_string(to_ret);
				else
					ret.set_float(to_ret);
				popTempValue();
				return;         // done
			}
			popTempValue();
		}
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;		// wraparound
		if (index < 0)
			index += len;
		inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_var_map[object_type.family_index];
		}
		var to_ret = inst.instance_vars[varindex + offset];
		if (cr.is_string(to_ret))
			ret.set_string(to_ret);
		else
			ret.set_float(to_ret);
	};
	ExpNode.prototype.eval_int = function (ret)
	{
		ret.type = cr.exptype.Integer;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_float = function (ret)
	{
		ret.type = cr.exptype.Float;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_string = function (ret)
	{
		ret.type = cr.exptype.String;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_unaryminus = function (ret)
	{
		this.first.get(ret);                // retrieve operand
		if (ret.is_number())
			ret.data = -ret.data;
	};
	ExpNode.prototype.eval_add = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data += temp.data;          // both operands numbers: add
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_subtract = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data -= temp.data;          // both operands numbers: subtract
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_multiply = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data *= temp.data;          // both operands numbers: multiply
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_divide = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data /= temp.data;          // both operands numbers: divide
			ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_mod = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data %= temp.data;          // both operands numbers: modulo
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_power = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data = Math.pow(ret.data, temp.data);   // both operands numbers: raise to power
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_and = function (ret)
	{
		this.first.get(ret);			// left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (temp.is_string() || ret.is_string())
			this.eval_and_stringconcat(ret, temp);
		else
			this.eval_and_logical(ret, temp);
		popTempValue();
	};
	ExpNode.prototype.eval_and_stringconcat = function (ret, temp)
	{
		if (ret.is_string() && temp.is_string())
			this.eval_and_stringconcat_str_str(ret, temp);
		else
			this.eval_and_stringconcat_num(ret, temp);
	};
	ExpNode.prototype.eval_and_stringconcat_str_str = function (ret, temp)
	{
		ret.data += temp.data;
	};
	ExpNode.prototype.eval_and_stringconcat_num = function (ret, temp)
	{
		if (ret.is_string())
		{
			ret.data += (Math.round(temp.data * 1e10) / 1e10).toString();
		}
		else
		{
			ret.set_string(ret.data.toString() + temp.data);
		}
	};
	ExpNode.prototype.eval_and_logical = function (ret, temp)
	{
		ret.set_int(ret.data && temp.data ? 1 : 0);
	};
	ExpNode.prototype.eval_or = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			if (ret.data || temp.data)
				ret.set_int(1);
			else
				ret.set_int(0);
		}
		popTempValue();
	};
	ExpNode.prototype.eval_conditional = function (ret)
	{
		this.first.get(ret);                // condition operand
		if (ret.data)                       // is true
			this.second.get(ret);           // evaluate second operand to ret
		else
			this.third.get(ret);            // evaluate third operand to ret
	};
	ExpNode.prototype.eval_equal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data === temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_notequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data !== temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_less = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data < temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_lessequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data <= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greater = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data > temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greaterequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data >= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_eventvar_exp = function (ret)
	{
		var val = this.eventvar.getValue();
		if (cr.is_number(val))
			ret.set_float(val);
		else
			ret.set_string(val);
	};
	cr.expNode = ExpNode;
	function ExpValue(type, data)
	{
		this.type = type || cr.exptype.Integer;
		this.data = data || 0;
		this.object_class = null;
;
;
;
		if (this.type == cr.exptype.Integer)
			this.data = Math.floor(this.data);
		cr.seal(this);
	};
	ExpValue.prototype.is_int = function ()
	{
		return this.type === cr.exptype.Integer;
	};
	ExpValue.prototype.is_float = function ()
	{
		return this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_number = function ()
	{
		return this.type === cr.exptype.Integer || this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_string = function ()
	{
		return this.type === cr.exptype.String;
	};
	ExpValue.prototype.make_int = function ()
	{
		if (!this.is_int())
		{
			if (this.is_float())
				this.data = Math.floor(this.data);      // truncate float
			else if (this.is_string())
				this.data = parseInt(this.data, 10);
			this.type = cr.exptype.Integer;
		}
	};
	ExpValue.prototype.make_float = function ()
	{
		if (!this.is_float())
		{
			if (this.is_string())
				this.data = parseFloat(this.data);
			this.type = cr.exptype.Float;
		}
	};
	ExpValue.prototype.make_string = function ()
	{
		if (!this.is_string())
		{
			this.data = this.data.toString();
			this.type = cr.exptype.String;
		}
	};
	ExpValue.prototype.set_int = function (val)
	{
;
		this.type = cr.exptype.Integer;
		this.data = Math.floor(val);
	};
	ExpValue.prototype.set_float = function (val)
	{
;
		this.type = cr.exptype.Float;
		this.data = val;
	};
	ExpValue.prototype.set_string = function (val)
	{
;
		this.type = cr.exptype.String;
		this.data = val;
	};
	ExpValue.prototype.set_any = function (val)
	{
		if (cr.is_number(val))
		{
			this.type = cr.exptype.Float;
			this.data = val;
		}
		else if (cr.is_string(val))
		{
			this.type = cr.exptype.String;
			this.data = val.toString();
		}
		else
		{
			this.type = cr.exptype.Integer;
			this.data = 0;
		}
	};
	cr.expvalue = ExpValue;
	cr.exptype = {
		Integer: 0,     // emulated; no native integer support in javascript
		Float: 1,
		String: 2
	};
}());
;
cr.system_object = function (runtime)
{
    this.runtime = runtime;
	this.waits = [];
};
cr.system_object.prototype.saveToJSON = function ()
{
	var o = {};
	var i, len, j, lenj, p, w, t, sobj;
	o["waits"] = [];
	var owaits = o["waits"];
	var waitobj;
	for (i = 0, len = this.waits.length; i < len; i++)
	{
		w = this.waits[i];
		waitobj = {
			"t": w.time,
			"st": w.signaltag,
			"s": w.signalled,
			"ev": w.ev.sid,
			"sm": [],
			"sols": {}
		};
		if (w.ev.actions[w.actindex])
			waitobj["act"] = w.ev.actions[w.actindex].sid;
		for (j = 0, lenj = w.solModifiers.length; j < lenj; j++)
			waitobj["sm"].push(w.solModifiers[j].sid);
		for (p in w.sols)
		{
			if (w.sols.hasOwnProperty(p))
			{
				t = this.runtime.types_by_index[parseInt(p, 10)];
;
				sobj = {
					"sa": w.sols[p].sa,
					"insts": []
				};
				for (j = 0, lenj = w.sols[p].insts.length; j < lenj; j++)
					sobj["insts"].push(w.sols[p].insts[j].uid);
				waitobj["sols"][t.sid.toString()] = sobj;
			}
		}
		owaits.push(waitobj);
	}
	return o;
};
cr.system_object.prototype.loadFromJSON = function (o)
{
	var owaits = o["waits"];
	var i, len, j, lenj, p, w, addWait, e, aindex, t, savedsol, nusol, inst;
	cr.clearArray(this.waits);
	for (i = 0, len = owaits.length; i < len; i++)
	{
		w = owaits[i];
		e = this.runtime.blocksBySid[w["ev"].toString()];
		if (!e)
			continue;	// event must've gone missing
		aindex = -1;
		for (j = 0, lenj = e.actions.length; j < lenj; j++)
		{
			if (e.actions[j].sid === w["act"])
			{
				aindex = j;
				break;
			}
		}
		if (aindex === -1)
			continue;	// action must've gone missing
		addWait = {};
		addWait.sols = {};
		addWait.solModifiers = [];
		addWait.deleteme = false;
		addWait.time = w["t"];
		addWait.signaltag = w["st"] || "";
		addWait.signalled = !!w["s"];
		addWait.ev = e;
		addWait.actindex = aindex;
		for (j = 0, lenj = w["sm"].length; j < lenj; j++)
		{
			t = this.runtime.getObjectTypeBySid(w["sm"][j]);
			if (t)
				addWait.solModifiers.push(t);
		}
		for (p in w["sols"])
		{
			if (w["sols"].hasOwnProperty(p))
			{
				t = this.runtime.getObjectTypeBySid(parseInt(p, 10));
				if (!t)
					continue;		// type must've been deleted
				savedsol = w["sols"][p];
				nusol = {
					sa: savedsol["sa"],
					insts: []
				};
				for (j = 0, lenj = savedsol["insts"].length; j < lenj; j++)
				{
					inst = this.runtime.getObjectByUID(savedsol["insts"][j]);
					if (inst)
						nusol.insts.push(inst);
				}
				addWait.sols[t.index.toString()] = nusol;
			}
		}
		this.waits.push(addWait);
	}
};
(function ()
{
	var sysProto = cr.system_object.prototype;
	function SysCnds() {};
    SysCnds.prototype.EveryTick = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutStart = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutEnd = function()
    {
        return true;
    };
    SysCnds.prototype.Compare = function(x, cmp, y)
    {
        return cr.do_cmp(x, cmp, y);
    };
    SysCnds.prototype.CompareTime = function (cmp, t)
    {
        var elapsed = this.runtime.kahanTime.sum;
        if (cmp === 0)
        {
            var cnd = this.runtime.getCurrentCondition();
            if (!cnd.extra["CompareTime_executed"])
            {
                if (elapsed >= t)
                {
                    cnd.extra["CompareTime_executed"] = true;
                    return true;
                }
            }
            return false;
        }
        return cr.do_cmp(elapsed, cmp, t);
    };
    SysCnds.prototype.LayerVisible = function (layer)
    {
        if (!layer)
            return false;
        else
            return layer.visible;
    };
	SysCnds.prototype.LayerEmpty = function (layer)
    {
        if (!layer)
            return false;
        else
            return !layer.instances.length;
    };
	SysCnds.prototype.LayerCmpOpacity = function (layer, cmp, opacity_)
	{
		if (!layer)
			return false;
		return cr.do_cmp(layer.opacity * 100, cmp, opacity_);
	};
    SysCnds.prototype.Repeat = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				current_loop.index = i;
				current_event.retrigger();
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	SysCnds.prototype.While = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				if (!current_event.retrigger())		// one of the other conditions returned false
					current_loop.stopped = true;	// break
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				current_loop.index = i;
				if (!current_event.retrigger())
					current_loop.stopped = true;
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
    SysCnds.prototype.For = function (name, start, end)
    {
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack(name);
        var i;
		if (end < start)
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
		else
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	var foreach_instancestack = [];
	var foreach_instanceptr = -1;
    SysCnds.prototype.ForEach = function (obj)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i, len, j, lenj, inst, s, sol2;
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	function foreach_sortinstances(a, b)
	{
		var va = a.extra["c2_feo_val"];
		var vb = b.extra["c2_feo_val"];
		if (cr.is_number(va) && cr.is_number(vb))
			return va - vb;
		else
		{
			va = "" + va;
			vb = "" + vb;
			if (va < vb)
				return -1;
			else if (va > vb)
				return 1;
			else
				return 0;
		}
	};
	SysCnds.prototype.ForEachOrdered = function (obj, exp, order)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var current_condition = this.runtime.getCurrentCondition();
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
		var i, len, j, lenj, inst, s, sol2;
		for (i = 0, len = instances.length; i < len; i++)
		{
			instances[i].extra["c2_feo_val"] = current_condition.parameters[1].get(i);
		}
		instances.sort(foreach_sortinstances);
		if (order === 1)
			instances.reverse();
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	SysCnds.prototype.PickByComparison = function (obj_, exp_, cmp_, val_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			val_ = current_condition.parameters[3].get(i);
			if (cr.do_cmp(exp_, cmp_, val_))
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
	SysCnds.prototype.PickByEvaluate = function (obj_, exp_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			if (exp_)
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
    SysCnds.prototype.TriggerOnce = function ()
    {
        var cndextra = this.runtime.getCurrentCondition().extra;
		if (typeof cndextra["TriggerOnce_lastTick"] === "undefined")
			cndextra["TriggerOnce_lastTick"] = -1;
        var last_tick = cndextra["TriggerOnce_lastTick"];
        var cur_tick = this.runtime.tickcount;
        cndextra["TriggerOnce_lastTick"] = cur_tick;
        return this.runtime.layout_first_tick || last_tick !== cur_tick - 1;
    };
    SysCnds.prototype.Every = function (seconds)
    {
        var cnd = this.runtime.getCurrentCondition();
        var last_time = cnd.extra["Every_lastTime"] || 0;
        var cur_time = this.runtime.kahanTime.sum;
		if (typeof cnd.extra["Every_seconds"] === "undefined")
			cnd.extra["Every_seconds"] = seconds;
		var this_seconds = cnd.extra["Every_seconds"];
        if (cur_time >= last_time + this_seconds)
        {
            cnd.extra["Every_lastTime"] = last_time + this_seconds;
			if (cur_time >= cnd.extra["Every_lastTime"] + 0.04)
			{
				cnd.extra["Every_lastTime"] = cur_time;
			}
			cnd.extra["Every_seconds"] = seconds;
            return true;
        }
		else if (cur_time < last_time - 0.1)
		{
			cnd.extra["Every_lastTime"] = cur_time;
		}
		return false;
    };
    SysCnds.prototype.PickNth = function (obj, index)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		index = cr.floor(index);
        if (index < 0 || index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.PickRandom = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		var index = cr.floor(Math.random() * instances.length);
        if (index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.CompareVar = function (v, cmp, val)
    {
        return cr.do_cmp(v.getValue(), cmp, val);
    };
    SysCnds.prototype.IsGroupActive = function (group)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
        return g && g.group_active;
    };
	SysCnds.prototype.IsPreview = function ()
	{
		return typeof cr_is_preview !== "undefined";
	};
	SysCnds.prototype.PickAll = function (obj)
    {
        if (!obj)
            return false;
		if (!obj.instances.length)
			return false;
        var sol = obj.getCurrentSol();
        sol.select_all = true;
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.IsMobile = function ()
	{
		return this.runtime.isMobile;
	};
	SysCnds.prototype.CompareBetween = function (x, a, b)
	{
		return x >= a && x <= b;
	};
	SysCnds.prototype.Else = function ()
	{
		var current_frame = this.runtime.getCurrentEventStack();
		if (current_frame.else_branch_ran)
			return false;		// another event in this else-if chain has run
		else
			return !current_frame.last_event_true;
		/*
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var prev_event = current_event.prev_block;
		if (!prev_event)
			return false;
		if (prev_event.is_logical)
			return !this.runtime.last_event_true;
		var i, len, j, lenj, s, sol, temp, inst, any_picked = false;
		for (i = 0, len = prev_event.cndReferences.length; i < len; i++)
		{
			s = prev_event.cndReferences[i];
			sol = s.getCurrentSol();
			if (sol.select_all || sol.instances.length === s.instances.length)
			{
				sol.select_all = false;
				sol.instances.length = 0;
			}
			else
			{
				if (sol.instances.length === 1 && sol.else_instances.length === 0 && s.instances.length >= 2)
				{
					inst = sol.instances[0];
					sol.instances.length = 0;
					for (j = 0, lenj = s.instances.length; j < lenj; j++)
					{
						if (s.instances[j] != inst)
							sol.instances.push(s.instances[j]);
					}
					any_picked = true;
				}
				else
				{
					temp = sol.instances;
					sol.instances = sol.else_instances;
					sol.else_instances = temp;
					any_picked = true;
				}
			}
		}
		return any_picked;
		*/
	};
	SysCnds.prototype.OnLoadFinished = function ()
	{
		return true;
	};
	SysCnds.prototype.OnCanvasSnapshot = function ()
	{
		return true;
	};
	SysCnds.prototype.EffectsSupported = function ()
	{
		return !!this.runtime.glwrap;
	};
	SysCnds.prototype.OnSaveComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnSaveFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.ObjectUIDExists = function (u)
	{
		return !!this.runtime.getObjectByUID(u);
	};
	SysCnds.prototype.IsOnPlatform = function (p)
	{
		var rt = this.runtime;
		switch (p) {
		case 0:		// HTML5 website
			return !rt.isDomFree && !rt.isNodeWebkit && !rt.isCordova && !rt.isWinJS && !rt.isWindowsPhone8 && !rt.isBlackberry10 && !rt.isAmazonWebApp;
		case 1:		// iOS
			return rt.isiOS;
		case 2:		// Android
			return rt.isAndroid;
		case 3:		// Windows 8
			return rt.isWindows8App;
		case 4:		// Windows Phone 8
			return rt.isWindowsPhone8;
		case 5:		// Blackberry 10
			return rt.isBlackberry10;
		case 6:		// Tizen
			return rt.isTizen;
		case 7:		// CocoonJS
			return rt.isCocoonJs;
		case 8:		// Cordova
			return rt.isCordova;
		case 9:	// Scirra Arcade
			return rt.isArcade;
		case 10:	// node-webkit
			return rt.isNodeWebkit;
		case 11:	// crosswalk
			return rt.isCrosswalk;
		case 12:	// amazon webapp
			return rt.isAmazonWebApp;
		case 13:	// windows 10 app
			return rt.isWindows10;
		default:	// should not be possible
			return false;
		}
	};
	var cacheRegex = null;
	var lastRegex = "";
	var lastFlags = "";
	function getRegex(regex_, flags_)
	{
		if (!cacheRegex || regex_ !== lastRegex || flags_ !== lastFlags)
		{
			cacheRegex = new RegExp(regex_, flags_);
			lastRegex = regex_;
			lastFlags = flags_;
		}
		cacheRegex.lastIndex = 0;		// reset
		return cacheRegex;
	};
	SysCnds.prototype.RegexTest = function (str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		return regex.test(str_);
	};
	var tmp_arr = [];
	SysCnds.prototype.PickOverlappingPoint = function (obj_, x_, y_)
	{
		if (!obj_)
            return false;
        var sol = obj_.getCurrentSol();
        var instances = sol.getObjects();
		var current_event = this.runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		var cnd = this.runtime.getCurrentCondition();
		var i, len, inst, pick;
		if (sol.select_all)
		{
			cr.shallowAssignArray(tmp_arr, instances);
			cr.clearArray(sol.else_instances);
			sol.select_all = false;
			cr.clearArray(sol.instances);
		}
		else
		{
			if (orblock)
			{
				cr.shallowAssignArray(tmp_arr, sol.else_instances);
				cr.clearArray(sol.else_instances);
			}
			else
			{
				cr.shallowAssignArray(tmp_arr, instances);
				cr.clearArray(sol.instances);
			}
		}
		for (i = 0, len = tmp_arr.length; i < len; ++i)
		{
			inst = tmp_arr[i];
			inst.update_bbox();
			pick = cr.xor(inst.contains_pt(x_, y_), cnd.inverted);
			if (pick)
				sol.instances.push(inst);
			else
				sol.else_instances.push(inst);
		}
		obj_.applySolToContainer();
		return cr.xor(!!sol.instances.length, cnd.inverted);
	};
	SysCnds.prototype.IsNaN = function (n)
	{
		return !!isNaN(n);
	};
	SysCnds.prototype.AngleWithin = function (a1, within, a2)
	{
		return cr.angleDiff(cr.to_radians(a1), cr.to_radians(a2)) <= cr.to_radians(within);
	};
	SysCnds.prototype.IsClockwiseFrom = function (a1, a2)
	{
		return cr.angleClockwise(cr.to_radians(a1), cr.to_radians(a2));
	};
	SysCnds.prototype.IsBetweenAngles = function (a, la, ua)
	{
		var angle = cr.to_clamped_radians(a);
		var lower = cr.to_clamped_radians(la);
		var upper = cr.to_clamped_radians(ua);
		var obtuse = (!cr.angleClockwise(upper, lower));
		if (obtuse)
			return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
		else
			return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
	};
	SysCnds.prototype.IsValueType = function (x, t)
	{
		if (typeof x === "number")
			return t === 0;
		else		// string
			return t === 1;
	};
	sysProto.cnds = new SysCnds();
    function SysActs() {};
    SysActs.prototype.GoToLayout = function (to)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
        this.runtime.changelayout = to;
    };
	SysActs.prototype.NextPrevLayout = function (prev)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
		var index = this.runtime.layouts_by_index.indexOf(this.runtime.running_layout);
		if (prev && index === 0)
			return;		// cannot go to previous layout from first layout
		if (!prev && index === this.runtime.layouts_by_index.length - 1)
			return;		// cannot go to next layout from last layout
		var to = this.runtime.layouts_by_index[index + (prev ? -1 : 1)];
;
        this.runtime.changelayout = to;
    };
    SysActs.prototype.CreateObject = function (obj, layer, x, y)
    {
        if (!layer || !obj)
            return;
        var inst = this.runtime.createInstance(obj, layer, x, y);
		if (!inst)
			return;
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
        var sol = obj.getCurrentSol();
        sol.select_all = false;
		cr.clearArray(sol.instances);
		sol.instances[0] = inst;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				sol = s.type.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = s;
			}
		}
    };
    SysActs.prototype.SetLayerVisible = function (layer, visible_)
    {
        if (!layer)
            return;
		if (layer.visible !== visible_)
		{
			layer.visible = visible_;
			this.runtime.redraw = true;
		}
    };
	SysActs.prototype.SetLayerOpacity = function (layer, opacity_)
	{
		if (!layer)
			return;
		opacity_ = cr.clamp(opacity_ / 100, 0, 1);
		if (layer.opacity !== opacity_)
		{
			layer.opacity = opacity_;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerScaleRate = function (layer, sr)
	{
		if (!layer)
			return;
		if (layer.zoomRate !== sr)
		{
			layer.zoomRate = sr;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerForceOwnTexture = function (layer, f)
	{
		if (!layer)
			return;
		f = !!f;
		if (layer.forceOwnTexture !== f)
		{
			layer.forceOwnTexture = f;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayoutScale = function (s)
	{
		if (!this.runtime.running_layout)
			return;
		if (this.runtime.running_layout.scale !== s)
		{
			this.runtime.running_layout.scale = s;
			this.runtime.running_layout.boundScrolling();
			this.runtime.redraw = true;
		}
	};
    SysActs.prototype.ScrollX = function(x)
    {
        this.runtime.running_layout.scrollToX(x);
    };
    SysActs.prototype.ScrollY = function(y)
    {
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.Scroll = function(x, y)
    {
        this.runtime.running_layout.scrollToX(x);
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.ScrollToObject = function(obj)
    {
        var inst = obj.getFirstPicked();
        if (inst)
        {
            this.runtime.running_layout.scrollToX(inst.x);
            this.runtime.running_layout.scrollToY(inst.y);
        }
    };
	SysActs.prototype.SetVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(x);
			else
				v.setValue(parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(x.toString());
	};
	SysActs.prototype.AddVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() + x);
			else
				v.setValue(v.getValue() + parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(v.getValue() + x.toString());
	};
	SysActs.prototype.SubVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() - x);
			else
				v.setValue(v.getValue() - parseFloat(x));
		}
	};
    SysActs.prototype.SetGroupActive = function (group, active)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
		if (!g)
			return;
		switch (active) {
		case 0:
			g.setGroupActive(false);
			break;
		case 1:
			g.setGroupActive(true);
			break;
		case 2:
			g.setGroupActive(!g.group_active);
			break;
		}
    };
    SysActs.prototype.SetTimescale = function (ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        this.runtime.timescale = ts;
    };
    SysActs.prototype.SetObjectTimescale = function (obj, ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        if (!obj)
            return;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = ts;
        }
    };
    SysActs.prototype.RestoreObjectTimescale = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = -1.0;
        }
    };
	var waitobjrecycle = [];
	function allocWaitObject()
	{
		var w;
		if (waitobjrecycle.length)
			w = waitobjrecycle.pop();
		else
		{
			w = {};
			w.sols = {};
			w.solModifiers = [];
		}
		w.deleteme = false;
		return w;
	};
	function freeWaitObject(w)
	{
		cr.wipe(w.sols);
		cr.clearArray(w.solModifiers);
		waitobjrecycle.push(w);
	};
	var solstateobjects = [];
	function allocSolStateObject()
	{
		var s;
		if (solstateobjects.length)
			s = solstateobjects.pop();
		else
		{
			s = {};
			s.insts = [];
		}
		s.sa = false;
		return s;
	};
	function freeSolStateObject(s)
	{
		cr.clearArray(s.insts);
		solstateobjects.push(s);
	};
	SysActs.prototype.Wait = function (seconds)
	{
		if (seconds < 0)
			return;
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = this.runtime.kahanTime.sum + seconds;
		waitobj.signaltag = "";
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.WaitForSignal = function (tag)
	{
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = -1;
		waitobj.signaltag = tag.toLowerCase();
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.Signal = function (tag)
	{
		var lowertag = tag.toLowerCase();
		var i, len, w;
		for (i = 0, len = this.waits.length; i < len; ++i)
		{
			w = this.waits[i];
			if (w.time !== -1)
				continue;					// timer wait, ignore
			if (w.signaltag === lowertag)	// waiting for this signal
				w.signalled = true;			// will run on next check
		}
	};
	SysActs.prototype.SetLayerScale = function (layer, scale)
    {
        if (!layer)
            return;
		if (layer.scale === scale)
			return;
        layer.scale = scale;
        this.runtime.redraw = true;
    };
	SysActs.prototype.ResetGlobals = function ()
	{
		var i, len, g;
		for (i = 0, len = this.runtime.all_global_vars.length; i < len; i++)
		{
			g = this.runtime.all_global_vars[i];
			g.data = g.initial;
		}
	};
	SysActs.prototype.SetLayoutAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.runtime.running_layout)
		{
			if (this.runtime.running_layout.angle !== a)
			{
				this.runtime.running_layout.angle = a;
				this.runtime.redraw = true;
			}
		}
	};
	SysActs.prototype.SetLayerAngle = function (layer, a)
    {
        if (!layer)
            return;
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (layer.angle === a)
			return;
        layer.angle = a;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerParallax = function (layer, px, py)
    {
        if (!layer)
            return;
		if (layer.parallaxX === px / 100 && layer.parallaxY === py / 100)
			return;
        layer.parallaxX = px / 100;
		layer.parallaxY = py / 100;
		if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
		{
			var i, len, instances = layer.instances;
			for (i = 0, len = instances.length; i < len; ++i)
			{
				instances[i].type.any_instance_parallaxed = true;
			}
		}
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBackground = function (layer, c)
    {
        if (!layer)
            return;
		var r = cr.GetRValue(c);
		var g = cr.GetGValue(c);
		var b = cr.GetBValue(c);
		if (layer.background_color[0] === r && layer.background_color[1] === g && layer.background_color[2] === b)
			return;
        layer.background_color[0] = r;
		layer.background_color[1] = g;
		layer.background_color[2] = b;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerTransparent = function (layer, t)
    {
        if (!layer)
            return;
		if (!!t === !!layer.transparent)
			return;
		layer.transparent = !!t;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBlendMode = function (layer, bm)
    {
        if (!layer)
            return;
		if (layer.blend_mode === bm)
			return;
		layer.blend_mode = bm;
		layer.compositeOp = cr.effectToCompositeOp(layer.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(layer, layer.blend_mode, this.runtime.gl);
        this.runtime.redraw = true;
    };
	SysActs.prototype.StopLoop = function ()
	{
		if (this.runtime.loop_stack_index < 0)
			return;		// no loop currently running
		this.runtime.getCurrentLoop().stopped = true;
	};
	SysActs.prototype.GoToLayoutByName = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to different layout
;
		var l;
		for (l in this.runtime.layouts)
		{
			if (this.runtime.layouts.hasOwnProperty(l) && cr.equals_nocase(l, layoutname))
			{
				this.runtime.changelayout = this.runtime.layouts[l];
				return;
			}
		}
	};
	SysActs.prototype.RestartLayout = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot restart loader layouts
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
		if (!this.runtime.running_layout)
			return;
		this.runtime.changelayout = this.runtime.running_layout;
		var i, len, g;
		for (i = 0, len = this.runtime.allGroups.length; i < len; i++)
		{
			g = this.runtime.allGroups[i];
			g.setGroupActive(g.initially_activated);
		}
	};
	SysActs.prototype.SnapshotCanvas = function (format_, quality_)
	{
		this.runtime.doCanvasSnapshot(format_ === 0 ? "image/png" : "image/jpeg", quality_ / 100);
	};
	SysActs.prototype.SetCanvasSize = function (w, h)
	{
		if (w <= 0 || h <= 0)
			return;
		var mode = this.runtime.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
		if (isfullscreen && this.runtime.fullscreen_scaling > 0)
			mode = this.runtime.fullscreen_scaling;
		if (mode === 0)
		{
			this.runtime["setSize"](w, h, true);
		}
		else
		{
			this.runtime.original_width = w;
			this.runtime.original_height = h;
			this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
		}
	};
	SysActs.prototype.SetLayoutEffectEnabled = function (enable_, effectname_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		this.runtime.running_layout.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectEnabled = function (layer, enable_, effectname_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		layer.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayoutEffectParam = function (effectname_, index_, value_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = this.runtime.running_layout.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectParam = function (layer, effectname_, index_, value_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = layer.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SaveState = function (slot_)
	{
		this.runtime.saveToSlot = slot_;
	};
	SysActs.prototype.LoadState = function (slot_)
	{
		this.runtime.loadFromSlot = slot_;
	};
	SysActs.prototype.LoadStateJSON = function (jsonstr_)
	{
		this.runtime.loadFromJson = jsonstr_;
	};
	SysActs.prototype.SetHalfFramerateMode = function (set_)
	{
		this.runtime.halfFramerateMode = (set_ !== 0);
	};
	SysActs.prototype.SetFullscreenQuality = function (q)
	{
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen);
		if (!isfullscreen && this.runtime.fullscreen_mode === 0)
			return;
		this.runtime.wantFullscreenScalingQuality = (q !== 0);
		this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
	};
	SysActs.prototype.ResetPersisted = function ()
	{
		var i, len;
		for (i = 0, len = this.runtime.layouts_by_index.length; i < len; ++i)
		{
			this.runtime.layouts_by_index[i].persist_data = {};
			this.runtime.layouts_by_index[i].first_visit = true;
		}
	};
	SysActs.prototype.RecreateInitialObjects = function (obj, x1, y1, x2, y2)
	{
		if (!obj)
			return;
		this.runtime.running_layout.recreateInitialObjects(obj, x1, y1, x2, y2);
	};
	SysActs.prototype.SetPixelRounding = function (m)
	{
		this.runtime.pixel_rounding = (m !== 0);
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetMinimumFramerate = function (f)
	{
		if (f < 1)
			f = 1;
		if (f > 120)
			f = 120;
		this.runtime.minimumFramerate = f;
	};
	function SortZOrderList(a, b)
	{
		var layerA = a[0];
		var layerB = b[0];
		var diff = layerA - layerB;
		if (diff !== 0)
			return diff;
		var indexA = a[1];
		var indexB = b[1];
		return indexA - indexB;
	};
	function SortInstancesByValue(a, b)
	{
		return a[1] - b[1];
	};
	SysActs.prototype.SortZOrderByInstVar = function (obj, iv)
	{
		if (!obj)
			return;
		var i, len, inst, value, r, layer, toZ;
		var sol = obj.getCurrentSol();
		var pickedInstances = sol.getObjects();
		var zOrderList = [];
		var instValues = [];
		var layout = this.runtime.running_layout;
		var isFamily = obj.is_family;
		var familyIndex = obj.family_index;
		for (i = 0, len = pickedInstances.length; i < len; ++i)
		{
			inst = pickedInstances[i];
			if (!inst.layer)
				continue;		// not a world instance
			if (isFamily)
				value = inst.instance_vars[iv + inst.type.family_var_map[familyIndex]];
			else
				value = inst.instance_vars[iv];
			zOrderList.push([
				inst.layer.index,
				inst.get_zindex()
			]);
			instValues.push([
				inst,
				value
			]);
		}
		if (!zOrderList.length)
			return;				// no instances were world instances
		zOrderList.sort(SortZOrderList);
		instValues.sort(SortInstancesByValue);
		for (i = 0, len = zOrderList.length; i < len; ++i)
		{
			inst = instValues[i][0];					// instance in the order we want
			layer = layout.layers[zOrderList[i][0]];	// layer to put it on
			toZ = zOrderList[i][1];						// Z index on that layer to put it
			if (layer.instances[toZ] !== inst)			// not already got this instance there
			{
				layer.instances[toZ] = inst;			// update instance
				inst.layer = layer;						// update instance's layer reference (could have changed)
				layer.setZIndicesStaleFrom(toZ);		// mark Z indices stale from this point since they have changed
			}
		}
	};
	sysProto.acts = new SysActs();
    function SysExps() {};
    SysExps.prototype["int"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_int(parseInt(x, 10));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_int(x);
    };
    SysExps.prototype["float"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_float(parseFloat(x));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_float(x);
    };
    SysExps.prototype.str = function(ret, x)
    {
        if (cr.is_string(x))
            ret.set_string(x);
        else
            ret.set_string(x.toString());
    };
    SysExps.prototype.len = function(ret, x)
    {
        ret.set_int(x.length || 0);
    };
    SysExps.prototype.random = function (ret, a, b)
    {
        if (b === undefined)
        {
            ret.set_float(Math.random() * a);
        }
        else
        {
            ret.set_float(Math.random() * (b - a) + a);
        }
    };
    SysExps.prototype.sqrt = function(ret, x)
    {
        ret.set_float(Math.sqrt(x));
    };
    SysExps.prototype.abs = function(ret, x)
    {
        ret.set_float(Math.abs(x));
    };
    SysExps.prototype.round = function(ret, x)
    {
        ret.set_int(Math.round(x));
    };
    SysExps.prototype.floor = function(ret, x)
    {
        ret.set_int(Math.floor(x));
    };
    SysExps.prototype.ceil = function(ret, x)
    {
        ret.set_int(Math.ceil(x));
    };
    SysExps.prototype.sin = function(ret, x)
    {
        ret.set_float(Math.sin(cr.to_radians(x)));
    };
    SysExps.prototype.cos = function(ret, x)
    {
        ret.set_float(Math.cos(cr.to_radians(x)));
    };
    SysExps.prototype.tan = function(ret, x)
    {
        ret.set_float(Math.tan(cr.to_radians(x)));
    };
    SysExps.prototype.asin = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.asin(x)));
    };
    SysExps.prototype.acos = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.acos(x)));
    };
    SysExps.prototype.atan = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.atan(x)));
    };
    SysExps.prototype.exp = function(ret, x)
    {
        ret.set_float(Math.exp(x));
    };
    SysExps.prototype.ln = function(ret, x)
    {
        ret.set_float(Math.log(x));
    };
    SysExps.prototype.log10 = function(ret, x)
    {
        ret.set_float(Math.log(x) / Math.LN10);
    };
    SysExps.prototype.max = function(ret)
    {
		var max_ = arguments[1];
		if (typeof max_ !== "number")
			max_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (max_ < a)
				max_ = a;
		}
		ret.set_float(max_);
    };
    SysExps.prototype.min = function(ret)
    {
        var min_ = arguments[1];
		if (typeof min_ !== "number")
			min_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (min_ > a)
				min_ = a;
		}
		ret.set_float(min_);
    };
    SysExps.prototype.dt = function(ret)
    {
        ret.set_float(this.runtime.dt);
    };
    SysExps.prototype.timescale = function(ret)
    {
        ret.set_float(this.runtime.timescale);
    };
    SysExps.prototype.wallclocktime = function(ret)
    {
        ret.set_float((Date.now() - this.runtime.start_time) / 1000.0);
    };
    SysExps.prototype.time = function(ret)
    {
        ret.set_float(this.runtime.kahanTime.sum);
    };
    SysExps.prototype.tickcount = function(ret)
    {
        ret.set_int(this.runtime.tickcount);
    };
    SysExps.prototype.objectcount = function(ret)
    {
        ret.set_int(this.runtime.objectcount);
    };
    SysExps.prototype.fps = function(ret)
    {
        ret.set_int(this.runtime.fps);
    };
    SysExps.prototype.loopindex = function(ret, name_)
    {
		var loop, i, len;
        if (!this.runtime.loop_stack.length)
        {
            ret.set_int(0);
            return;
        }
        if (name_)
        {
            for (i = this.runtime.loop_stack_index; i >= 0; --i)
            {
                loop = this.runtime.loop_stack[i];
                if (loop.name === name_)
                {
                    ret.set_int(loop.index);
                    return;
                }
            }
            ret.set_int(0);
        }
        else
        {
			loop = this.runtime.getCurrentLoop();
			ret.set_int(loop ? loop.index : -1);
        }
    };
    SysExps.prototype.distance = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.distanceTo(x1, y1, x2, y2));
    };
    SysExps.prototype.angle = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.to_degrees(cr.angleTo(x1, y1, x2, y2)));
    };
    SysExps.prototype.scrollx = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollX);
    };
    SysExps.prototype.scrolly = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollY);
    };
    SysExps.prototype.newline = function(ret)
    {
        ret.set_string("\n");
    };
    SysExps.prototype.lerp = function(ret, a, b, x)
    {
        ret.set_float(cr.lerp(a, b, x));
    };
	SysExps.prototype.qarp = function(ret, a, b, c, x)
    {
        ret.set_float(cr.qarp(a, b, c, x));
    };
	SysExps.prototype.cubic = function(ret, a, b, c, d, x)
    {
        ret.set_float(cr.cubic(a, b, c, d, x));
    };
	SysExps.prototype.cosp = function(ret, a, b, x)
    {
        ret.set_float(cr.cosp(a, b, x));
    };
    SysExps.prototype.windowwidth = function(ret)
    {
        ret.set_int(this.runtime.width);
    };
    SysExps.prototype.windowheight = function(ret)
    {
        ret.set_int(this.runtime.height);
    };
	SysExps.prototype.uppercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toUpperCase() : "");
	};
	SysExps.prototype.lowercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toLowerCase() : "");
	};
	SysExps.prototype.clamp = function(ret, x, l, u)
	{
		if (x < l)
			ret.set_float(l);
		else if (x > u)
			ret.set_float(u);
		else
			ret.set_float(x);
	};
	SysExps.prototype.layerscale = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.scale);
	};
	SysExps.prototype.layeropacity = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.opacity * 100);
	};
	SysExps.prototype.layerscalerate = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.zoomRate);
	};
	SysExps.prototype.layerparallaxx = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxX * 100);
	};
	SysExps.prototype.layerparallaxy = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxY * 100);
	};
	SysExps.prototype.layerindex = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_int(-1);
		else
			ret.set_int(layer.index);
	};
	SysExps.prototype.layoutscale = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_float(this.runtime.running_layout.scale);
		else
			ret.set_float(0);
	};
	SysExps.prototype.layoutangle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.runtime.running_layout.angle));
	};
	SysExps.prototype.layerangle = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(cr.to_degrees(layer.angle));
	};
	SysExps.prototype.layoutwidth = function (ret)
	{
		ret.set_int(this.runtime.running_layout.width);
	};
	SysExps.prototype.layoutheight = function (ret)
	{
		ret.set_int(this.runtime.running_layout.height);
	};
	SysExps.prototype.find = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "i")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.findcase = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.left = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(0, n) : "");
	};
	SysExps.prototype.right = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(text.length - n) : "");
	};
	SysExps.prototype.mid = function (ret, text, index_, length_)
	{
		ret.set_string(cr.is_string(text) ? text.substr(index_, length_) : "");
	};
	SysExps.prototype.tokenat = function (ret, text, index_, sep)
	{
		if (cr.is_string(text) && cr.is_string(sep))
		{
			var arr = text.split(sep);
			var i = cr.floor(index_);
			if (i < 0 || i >= arr.length)
				ret.set_string("");
			else
				ret.set_string(arr[i]);
		}
		else
			ret.set_string("");
	};
	SysExps.prototype.tokencount = function (ret, text, sep)
	{
		if (cr.is_string(text) && text.length)
			ret.set_int(text.split(sep).length);
		else
			ret.set_int(0);
	};
	SysExps.prototype.replace = function (ret, text, find_, replace_)
	{
		if (cr.is_string(text) && cr.is_string(find_) && cr.is_string(replace_))
			ret.set_string(text.replace(new RegExp(cr.regexp_escape(find_), "gi"), replace_));
		else
			ret.set_string(cr.is_string(text) ? text : "");
	};
	SysExps.prototype.trim = function (ret, text)
	{
		ret.set_string(cr.is_string(text) ? text.trim() : "");
	};
	SysExps.prototype.pi = function (ret)
	{
		ret.set_float(cr.PI);
	};
	SysExps.prototype.layoutname = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_string(this.runtime.running_layout.name);
		else
			ret.set_string("");
	};
	SysExps.prototype.renderer = function (ret)
	{
		ret.set_string(this.runtime.gl ? "webgl" : "canvas2d");
	};
	SysExps.prototype.rendererdetail = function (ret)
	{
		ret.set_string(this.runtime.glUnmaskedRenderer);
	};
	SysExps.prototype.anglediff = function (ret, a, b)
	{
		ret.set_float(cr.to_degrees(cr.angleDiff(cr.to_radians(a), cr.to_radians(b))));
	};
	SysExps.prototype.choose = function (ret)
	{
		var index = cr.floor(Math.random() * (arguments.length - 1));
		ret.set_any(arguments[index + 1]);
	};
	SysExps.prototype.rgb = function (ret, r, g, b)
	{
		ret.set_int(cr.RGB(r, g, b));
	};
	SysExps.prototype.projectversion = function (ret)
	{
		ret.set_string(this.runtime.versionstr);
	};
	SysExps.prototype.projectname = function (ret)
	{
		ret.set_string(this.runtime.projectName);
	};
	SysExps.prototype.anglelerp = function (ret, a, b, x)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			ret.set_float(cr.to_clamped_degrees(a + diff * x));
		}
		else
		{
			ret.set_float(cr.to_clamped_degrees(a - diff * x));
		}
	};
	SysExps.prototype.anglerotate = function (ret, a, b, c)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		c = cr.to_radians(c);
		ret.set_float(cr.to_clamped_degrees(cr.angleRotate(a, b, c)));
	};
	SysExps.prototype.zeropad = function (ret, n, d)
	{
		var s = (n < 0 ? "-" : "");
		if (n < 0) n = -n;
		var zeroes = d - n.toString().length;
		for (var i = 0; i < zeroes; i++)
			s += "0";
		ret.set_string(s + n.toString());
	};
	SysExps.prototype.cpuutilisation = function (ret)
	{
		ret.set_float(this.runtime.cpuutilisation / 1000);
	};
	SysExps.prototype.viewportleft = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewLeft : 0);
	};
	SysExps.prototype.viewporttop = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewTop : 0);
	};
	SysExps.prototype.viewportright = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewRight : 0);
	};
	SysExps.prototype.viewportbottom = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewBottom : 0);
	};
	SysExps.prototype.loadingprogress = function (ret)
	{
		ret.set_float(this.runtime.loadingprogress);
	};
	SysExps.prototype.unlerp = function(ret, a, b, y)
    {
        ret.set_float(cr.unlerp(a, b, y));
    };
	SysExps.prototype.canvassnapshot = function (ret)
	{
		ret.set_string(this.runtime.snapshotData);
	};
	SysExps.prototype.urlencode = function (ret, s)
	{
		ret.set_string(encodeURIComponent(s));
	};
	SysExps.prototype.urldecode = function (ret, s)
	{
		ret.set_string(decodeURIComponent(s));
	};
	SysExps.prototype.canvastolayerx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, true) : 0);
	};
	SysExps.prototype.canvastolayery = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, false) : 0);
	};
	SysExps.prototype.layertocanvasx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, true) : 0);
	};
	SysExps.prototype.layertocanvasy = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, false) : 0);
	};
	SysExps.prototype.savestatejson = function (ret)
	{
		ret.set_string(this.runtime.lastSaveJson);
	};
	SysExps.prototype.imagememoryusage = function (ret)
	{
		if (this.runtime.glwrap)
			ret.set_float(Math.round(100 * this.runtime.glwrap.estimateVRAM() / (1024 * 1024)) / 100);
		else
			ret.set_float(0);
	};
	SysExps.prototype.regexsearch = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_int(str_ ? str_.search(regex) : -1);
	};
	SysExps.prototype.regexreplace = function (ret, str_, regex_, flags_, replace_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_string(str_ ? str_.replace(regex, replace_) : "");
	};
	var regexMatches = [];
	var lastMatchesStr = "";
	var lastMatchesRegex = "";
	var lastMatchesFlags = "";
	function updateRegexMatches(str_, regex_, flags_)
	{
		if (str_ === lastMatchesStr && regex_ === lastMatchesRegex && flags_ === lastMatchesFlags)
			return;
		var regex = getRegex(regex_, flags_);
		regexMatches = str_.match(regex);
		lastMatchesStr = str_;
		lastMatchesRegex = regex_;
		lastMatchesFlags = flags_;
	};
	SysExps.prototype.regexmatchcount = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_, regex_, flags_);
		ret.set_int(regexMatches ? regexMatches.length : 0);
	};
	SysExps.prototype.regexmatchat = function (ret, str_, regex_, flags_, index_)
	{
		index_ = Math.floor(index_);
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_, regex_, flags_);
		if (!regexMatches || index_ < 0 || index_ >= regexMatches.length)
			ret.set_string("");
		else
			ret.set_string(regexMatches[index_]);
	};
	SysExps.prototype.infinity = function (ret)
	{
		ret.set_float(Infinity);
	};
	SysExps.prototype.setbit = function (ret, n, b, v)
	{
		n = n | 0;
		b = b | 0;
		v = (v !== 0 ? 1 : 0);
		ret.set_int((n & ~(1 << b)) | (v << b));
	};
	SysExps.prototype.togglebit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int(n ^ (1 << b));
	};
	SysExps.prototype.getbit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int((n & (1 << b)) ? 1 : 0);
	};
	SysExps.prototype.originalwindowwidth = function (ret)
	{
		ret.set_int(this.runtime.original_width);
	};
	SysExps.prototype.originalwindowheight = function (ret)
	{
		ret.set_int(this.runtime.original_height);
	};
	sysProto.exps = new SysExps();
	sysProto.runWaits = function ()
	{
		var i, j, len, w, k, s, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		for (i = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			if (w.time === -1)		// signalled wait
			{
				if (!w.signalled)
					continue;		// not yet signalled
			}
			else					// timer wait
			{
				if (w.time > this.runtime.kahanTime.sum)
					continue;		// timer not yet expired
			}
			evinfo.current_event = w.ev;
			evinfo.actindex = w.actindex;
			evinfo.cndindex = 0;
			for (k in w.sols)
			{
				if (w.sols.hasOwnProperty(k))
				{
					s = this.runtime.types_by_index[parseInt(k, 10)].getCurrentSol();
					ss = w.sols[k];
					s.select_all = ss.sa;
					cr.shallowAssignArray(s.instances, ss.insts);
					freeSolStateObject(ss);
				}
			}
			w.ev.resume_actions_and_subevents();
			this.runtime.clearSol(w.solModifiers);
			w.deleteme = true;
		}
		for (i = 0, j = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			this.waits[j] = w;
			if (w.deleteme)
				freeWaitObject(w);
			else
				j++;
		}
		cr.truncateArray(this.waits, j);
	};
}());
;
(function () {
	cr.add_common_aces = function (m, pluginProto)
	{
		var singleglobal_ = m[1];
		var position_aces = m[3];
		var size_aces = m[4];
		var angle_aces = m[5];
		var appearance_aces = m[6];
		var zorder_aces = m[7];
		var effects_aces = m[8];
		if (!pluginProto.cnds)
			pluginProto.cnds = {};
		if (!pluginProto.acts)
			pluginProto.acts = {};
		if (!pluginProto.exps)
			pluginProto.exps = {};
		var cnds = pluginProto.cnds;
		var acts = pluginProto.acts;
		var exps = pluginProto.exps;
		if (position_aces)
		{
			cnds.CompareX = function (cmp, x)
			{
				return cr.do_cmp(this.x, cmp, x);
			};
			cnds.CompareY = function (cmp, y)
			{
				return cr.do_cmp(this.y, cmp, y);
			};
			cnds.IsOnScreen = function ()
			{
				var layer = this.layer;
				this.update_bbox();
				var bbox = this.bbox;
				return !(bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom);
			};
			cnds.IsOutsideLayout = function ()
			{
				this.update_bbox();
				var bbox = this.bbox;
				var layout = this.runtime.running_layout;
				return (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height);
			};
			cnds.PickDistance = function (which, x, y)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var dist = cr.distanceTo(inst.x, inst.y, x, y);
				var i, len, d;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					d = cr.distanceTo(inst.x, inst.y, x, y);
					if ((which === 0 && d < dist) || (which === 1 && d > dist))
					{
						dist = d;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.SetX = function (x)
			{
				if (this.x !== x)
				{
					this.x = x;
					this.set_bbox_changed();
				}
			};
			acts.SetY = function (y)
			{
				if (this.y !== y)
				{
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPos = function (x, y)
			{
				if (this.x !== x || this.y !== y)
				{
					this.x = x;
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPosToObject = function (obj, imgpt)
			{
				var inst = obj.getPairedInstance(this);
				if (!inst)
					return;
				var newx, newy;
				if (inst.getImagePoint)
				{
					newx = inst.getImagePoint(imgpt, true);
					newy = inst.getImagePoint(imgpt, false);
				}
				else
				{
					newx = inst.x;
					newy = inst.y;
				}
				if (this.x !== newx || this.y !== newy)
				{
					this.x = newx;
					this.y = newy;
					this.set_bbox_changed();
				}
			};
			acts.MoveForward = function (dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(this.angle) * dist;
					this.y += Math.sin(this.angle) * dist;
					this.set_bbox_changed();
				}
			};
			acts.MoveAtAngle = function (a, dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(cr.to_radians(a)) * dist;
					this.y += Math.sin(cr.to_radians(a)) * dist;
					this.set_bbox_changed();
				}
			};
			exps.X = function (ret)
			{
				ret.set_float(this.x);
			};
			exps.Y = function (ret)
			{
				ret.set_float(this.y);
			};
			exps.dt = function (ret)
			{
				ret.set_float(this.runtime.getDt(this));
			};
		}
		if (size_aces)
		{
			cnds.CompareWidth = function (cmp, w)
			{
				return cr.do_cmp(this.width, cmp, w);
			};
			cnds.CompareHeight = function (cmp, h)
			{
				return cr.do_cmp(this.height, cmp, h);
			};
			acts.SetWidth = function (w)
			{
				if (this.width !== w)
				{
					this.width = w;
					this.set_bbox_changed();
				}
			};
			acts.SetHeight = function (h)
			{
				if (this.height !== h)
				{
					this.height = h;
					this.set_bbox_changed();
				}
			};
			acts.SetSize = function (w, h)
			{
				if (this.width !== w || this.height !== h)
				{
					this.width = w;
					this.height = h;
					this.set_bbox_changed();
				}
			};
			exps.Width = function (ret)
			{
				ret.set_float(this.width);
			};
			exps.Height = function (ret)
			{
				ret.set_float(this.height);
			};
			exps.BBoxLeft = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.left);
			};
			exps.BBoxTop = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.top);
			};
			exps.BBoxRight = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.right);
			};
			exps.BBoxBottom = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.bottom);
			};
		}
		if (angle_aces)
		{
			cnds.AngleWithin = function (within, a)
			{
				return cr.angleDiff(this.angle, cr.to_radians(a)) <= cr.to_radians(within);
			};
			cnds.IsClockwiseFrom = function (a)
			{
				return cr.angleClockwise(this.angle, cr.to_radians(a));
			};
			cnds.IsBetweenAngles = function (a, b)
			{
				var lower = cr.to_clamped_radians(a);
				var upper = cr.to_clamped_radians(b);
				var angle = cr.clamp_angle(this.angle);
				var obtuse = (!cr.angleClockwise(upper, lower));
				if (obtuse)
					return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
				else
					return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
			};
			acts.SetAngle = function (a)
			{
				var newangle = cr.to_radians(cr.clamp_angle_degrees(a));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateClockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle += cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateCounterclockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle -= cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardAngle = function (amt, target)
			{
				var newangle = cr.angleRotate(this.angle, cr.to_radians(target), cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardPosition = function (amt, x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var target = Math.atan2(dy, dx);
				var newangle = cr.angleRotate(this.angle, target, cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.SetTowardPosition = function (x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var newangle = Math.atan2(dy, dx);
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			exps.Angle = function (ret)
			{
				ret.set_float(cr.to_clamped_degrees(this.angle));
			};
		}
		if (!singleglobal_)
		{
			cnds.CompareInstanceVar = function (iv, cmp, val)
			{
				return cr.do_cmp(this.instance_vars[iv], cmp, val);
			};
			cnds.IsBoolInstanceVarSet = function (iv)
			{
				return this.instance_vars[iv];
			};
			cnds.PickInstVarHiLow = function (which, iv)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var val = inst.instance_vars[iv];
				var i, len, v;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					v = inst.instance_vars[iv];
					if ((which === 0 && v < val) || (which === 1 && v > val))
					{
						val = v;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			cnds.PickByUID = function (u)
			{
				var i, len, j, inst, families, instances, sol;
				var cnd = this.runtime.getCurrentCondition();
				if (cnd.inverted)
				{
					sol = this.getCurrentSol();
					if (sol.select_all)
					{
						sol.select_all = false;
						cr.clearArray(sol.instances);
						cr.clearArray(sol.else_instances);
						instances = this.instances;
						for (i = 0, len = instances.length; i < len; i++)
						{
							inst = instances[i];
							if (inst.uid === u)
								sol.else_instances.push(inst);
							else
								sol.instances.push(inst);
						}
						this.applySolToContainer();
						return !!sol.instances.length;
					}
					else
					{
						for (i = 0, j = 0, len = sol.instances.length; i < len; i++)
						{
							inst = sol.instances[i];
							sol.instances[j] = inst;
							if (inst.uid === u)
							{
								sol.else_instances.push(inst);
							}
							else
								j++;
						}
						cr.truncateArray(sol.instances, j);
						this.applySolToContainer();
						return !!sol.instances.length;
					}
				}
				else
				{
					inst = this.runtime.getObjectByUID(u);
					if (!inst)
						return false;
					sol = this.getCurrentSol();
					if (!sol.select_all && sol.instances.indexOf(inst) === -1)
						return false;		// not picked
					if (this.is_family)
					{
						families = inst.type.families;
						for (i = 0, len = families.length; i < len; i++)
						{
							if (families[i] === this)
							{
								sol.pick_one(inst);
								this.applySolToContainer();
								return true;
							}
						}
					}
					else if (inst.type === this)
					{
						sol.pick_one(inst);
						this.applySolToContainer();
						return true;
					}
					return false;
				}
			};
			cnds.OnCreated = function ()
			{
				return true;
			};
			cnds.OnDestroyed = function ()
			{
				return true;
			};
			acts.SetInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = val.toString();
				}
				else
;
			};
			acts.AddInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += val.toString();
				}
				else
;
			};
			acts.SubInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] -= val;
					else
						myinstvars[iv] -= parseFloat(val);
				}
				else
;
			};
			acts.SetBoolInstanceVar = function (iv, val)
			{
				this.instance_vars[iv] = val ? 1 : 0;
			};
			acts.ToggleBoolInstanceVar = function (iv)
			{
				this.instance_vars[iv] = 1 - this.instance_vars[iv];
			};
			acts.Destroy = function ()
			{
				this.runtime.DestroyInstance(this);
			};
			if (!acts.LoadFromJsonString)
			{
				acts.LoadFromJsonString = function (str_)
				{
					var o, i, len, binst;
					try {
						o = JSON.parse(str_);
					}
					catch (e) {
						return;
					}
					this.runtime.loadInstanceFromJSON(this, o, true);
					if (this.afterLoad)
						this.afterLoad();
					if (this.behavior_insts)
					{
						for (i = 0, len = this.behavior_insts.length; i < len; ++i)
						{
							binst = this.behavior_insts[i];
							if (binst.afterLoad)
								binst.afterLoad();
						}
					}
				};
			}
			exps.Count = function (ret)
			{
				var count = ret.object_class.instances.length;
				var i, len, inst;
				for (i = 0, len = this.runtime.createRow.length; i < len; i++)
				{
					inst = this.runtime.createRow[i];
					if (ret.object_class.is_family)
					{
						if (inst.type.families.indexOf(ret.object_class) >= 0)
							count++;
					}
					else
					{
						if (inst.type === ret.object_class)
							count++;
					}
				}
				ret.set_int(count);
			};
			exps.PickedCount = function (ret)
			{
				ret.set_int(ret.object_class.getCurrentSol().getObjects().length);
			};
			exps.UID = function (ret)
			{
				ret.set_int(this.uid);
			};
			exps.IID = function (ret)
			{
				ret.set_int(this.get_iid());
			};
			if (!exps.AsJSON)
			{
				exps.AsJSON = function (ret)
				{
					ret.set_string(JSON.stringify(this.runtime.saveInstanceToJSON(this, true)));
				};
			}
		}
		if (appearance_aces)
		{
			cnds.IsVisible = function ()
			{
				return this.visible;
			};
			acts.SetVisible = function (v)
			{
				if (!v !== !this.visible)
				{
					this.visible = !!v;
					this.runtime.redraw = true;
				}
			};
			cnds.CompareOpacity = function (cmp, x)
			{
				return cr.do_cmp(cr.round6dp(this.opacity * 100), cmp, x);
			};
			acts.SetOpacity = function (x)
			{
				var new_opacity = x / 100.0;
				if (new_opacity < 0)
					new_opacity = 0;
				else if (new_opacity > 1)
					new_opacity = 1;
				if (new_opacity !== this.opacity)
				{
					this.opacity = new_opacity;
					this.runtime.redraw = true;
				}
			};
			exps.Opacity = function (ret)
			{
				ret.set_float(cr.round6dp(this.opacity * 100.0));
			};
		}
		if (zorder_aces)
		{
			cnds.IsOnLayer = function (layer_)
			{
				if (!layer_)
					return false;
				return this.layer === layer_;
			};
			cnds.PickTopBottom = function (which_)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var i, len;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					if (which_ === 0)
					{
						if (inst.layer.index > pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() > pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
					else
					{
						if (inst.layer.index < pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() < pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.MoveToTop = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[layer_instances.length - 1] === this)
					return;		// is already at top
				layer.removeFromInstanceList(this, false);
				layer.appendToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToBottom = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[0] === this)
					return;		// is already at bottom
				layer.removeFromInstanceList(this, false);
				layer.prependToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToLayer = function (layerMove)
			{
				if (!layerMove || layerMove == this.layer)
					return;
				this.layer.removeFromInstanceList(this, true);
				this.layer = layerMove;
				layerMove.appendToInstanceList(this, true);
				this.runtime.redraw = true;
			};
			acts.ZMoveToObject = function (where_, obj_)
			{
				var isafter = (where_ === 0);
				if (!obj_)
					return;
				var other = obj_.getFirstPicked(this);
				if (!other || other.uid === this.uid)
					return;
				if (this.layer.index !== other.layer.index)
				{
					this.layer.removeFromInstanceList(this, true);
					this.layer = other.layer;
					other.layer.appendToInstanceList(this, true);
				}
				this.layer.moveInstanceAdjacent(this, other, isafter);
				this.runtime.redraw = true;
			};
			exps.LayerNumber = function (ret)
			{
				ret.set_int(this.layer.number);
			};
			exps.LayerName = function (ret)
			{
				ret.set_string(this.layer.name);
			};
			exps.ZIndex = function (ret)
			{
				ret.set_int(this.get_zindex());
			};
		}
		if (effects_aces)
		{
			acts.SetEffectEnabled = function (enable_, effectname_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var enable = (enable_ === 1);
				if (this.active_effect_flags[i] === enable)
					return;		// no change
				this.active_effect_flags[i] = enable;
				this.updateActiveEffects();
				this.runtime.redraw = true;
			};
			acts.SetEffectParam = function (effectname_, index_, value_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var et = this.type.effect_types[i];
				var params = this.effect_params[i];
				index_ = Math.floor(index_);
				if (index_ < 0 || index_ >= params.length)
					return;		// effect index out of bounds
				if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
					value_ /= 100.0;
				if (params[index_] === value_)
					return;		// no change
				params[index_] = value_;
				if (et.active)
					this.runtime.redraw = true;
			};
		}
	};
	cr.set_bbox_changed = function ()
	{
		this.bbox_changed = true;      		// will recreate next time box requested
		this.cell_changed = true;
		this.type.any_cell_changed = true;	// avoid unnecessary updateAllBBox() calls
		this.runtime.redraw = true;     	// assume runtime needs to redraw
		var i, len, callbacks = this.bbox_changed_callbacks;
		for (i = 0, len = callbacks.length; i < len; ++i)
		{
			callbacks[i](this);
		}
		if (this.layer.useRenderCells)
			this.update_bbox();
	};
	cr.add_bbox_changed_callback = function (f)
	{
		if (f)
		{
			this.bbox_changed_callbacks.push(f);
		}
	};
	cr.update_bbox = function ()
	{
		if (!this.bbox_changed)
			return;                 // bounding box not changed
		var bbox = this.bbox;
		var bquad = this.bquad;
		bbox.set(this.x, this.y, this.x + this.width, this.y + this.height);
		bbox.offset(-this.hotspotX * this.width, -this.hotspotY * this.height);
		if (!this.angle)
		{
			bquad.set_from_rect(bbox);    // make bounding quad from box
		}
		else
		{
			bbox.offset(-this.x, -this.y);       			// translate to origin
			bquad.set_from_rotated_rect(bbox, this.angle);	// rotate around origin
			bquad.offset(this.x, this.y);      				// translate back to original position
			bquad.bounding_box(bbox);
		}
		bbox.normalize();
		this.bbox_changed = false;  // bounding box up to date
		this.update_render_cell();
	};
	var tmprc = new cr.rect(0, 0, 0, 0);
	cr.update_render_cell = function ()
	{
		if (!this.layer.useRenderCells)
			return;
		var mygrid = this.layer.render_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.rendercells.equals(tmprc))
			return;
		if (this.rendercells.right < this.rendercells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.rendercells, tmprc);
		this.rendercells.copy(tmprc);
		this.layer.render_list_stale = true;
	};
	cr.update_collision_cell = function ()
	{
		if (!this.cell_changed || !this.collisionsEnabled)
			return;
		this.update_bbox();
		var mygrid = this.type.collision_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.collcells.equals(tmprc))
			return;
		if (this.collcells.right < this.collcells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.collcells, tmprc);
		this.collcells.copy(tmprc);
		this.cell_changed = false;
	};
	cr.inst_contains_pt = function (x, y)
	{
		if (!this.bbox.contains_pt(x, y))
			return false;
		if (!this.bquad.contains_pt(x, y))
			return false;
		if (this.collision_poly && !this.collision_poly.is_empty())
		{
			this.collision_poly.cache_poly(this.width, this.height, this.angle);
			return this.collision_poly.contains_pt(x - this.x, y - this.y);
		}
		else
			return true;
	};
	cr.inst_get_iid = function ()
	{
		this.type.updateIIDs();
		return this.iid;
	};
	cr.inst_get_zindex = function ()
	{
		this.layer.updateZIndices();
		return this.zindex;
	};
	cr.inst_updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		var i, len, et;
		var preserves_opaqueness = true;
		for (i = 0, len = this.active_effect_flags.length; i < len; i++)
		{
			if (this.active_effect_flags[i])
			{
				et = this.type.effect_types[i];
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					preserves_opaqueness = false;
			}
		}
		this.uses_shaders = !!this.active_effect_types.length;
		this.shaders_preserve_opaqueness = preserves_opaqueness;
	};
	cr.inst_toString = function ()
	{
		return "Inst" + this.puid;
	};
	cr.type_getFirstPicked = function (frominst)
	{
		if (frominst && frominst.is_contained && frominst.type != this)
		{
			var i, len, s;
			for (i = 0, len = frominst.siblings.length; i < len; i++)
			{
				s = frominst.siblings[i];
				if (s.type == this)
					return s;
			}
		}
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[0];
		else
			return null;
	};
	cr.type_getPairedInstance = function (inst)
	{
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[inst.get_iid() % instances.length];
		else
			return null;
	};
	cr.type_updateIIDs = function ()
	{
		if (!this.stale_iids || this.is_family)
			return;		// up to date or is family - don't want family to overwrite IIDs
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].iid = i;
		var next_iid = i;
		var createRow = this.runtime.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === this)
				createRow[i].iid = next_iid++;
		}
		this.stale_iids = false;
	};
	cr.type_getInstanceByIID = function (i)
	{
		if (i < this.instances.length)
			return this.instances[i];
		i -= this.instances.length;
		var createRow = this.runtime.createRow;
		var j, lenj;
		for (j = 0, lenj = createRow.length; j < lenj; ++j)
		{
			if (createRow[j].type === this)
			{
				if (i === 0)
					return createRow[j];
				--i;
			}
		}
;
		return null;
	};
	cr.type_getCurrentSol = function ()
	{
		return this.solstack[this.cur_sol];
	};
	cr.type_pushCleanSol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
		{
			this.solstack.push(new cr.selection(this));
		}
		else
		{
			this.solstack[this.cur_sol].select_all = true;  // else clear next SOL
			cr.clearArray(this.solstack[this.cur_sol].else_instances);
		}
	};
	cr.type_pushCopySol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
			this.solstack.push(new cr.selection(this));
		var clonesol = this.solstack[this.cur_sol];
		var prevsol = this.solstack[this.cur_sol - 1];
		if (prevsol.select_all)
		{
			clonesol.select_all = true;
			cr.clearArray(clonesol.else_instances);
		}
		else
		{
			clonesol.select_all = false;
			cr.shallowAssignArray(clonesol.instances, prevsol.instances);
			cr.shallowAssignArray(clonesol.else_instances, prevsol.else_instances);
		}
	};
	cr.type_popSol = function ()
	{
;
		this.cur_sol--;
	};
	cr.type_getBehaviorByName = function (behname)
	{
		var i, len, j, lenj, f, index = 0;
		if (!this.is_family)
		{
			for (i = 0, len = this.families.length; i < len; i++)
			{
				f = this.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (behname === f.behaviors[j].name)
					{
						this.extra["lastBehIndex"] = index;
						return f.behaviors[j];
					}
					index++;
				}
			}
		}
		for (i = 0, len = this.behaviors.length; i < len; i++) {
			if (behname === this.behaviors[i].name)
			{
				this.extra["lastBehIndex"] = index;
				return this.behaviors[i];
			}
			index++;
		}
		return null;
	};
	cr.type_getBehaviorIndexByName = function (behname)
	{
		var b = this.getBehaviorByName(behname);
		if (b)
			return this.extra["lastBehIndex"];
		else
			return -1;
	};
	cr.type_getEffectIndexByName = function (name_)
	{
		var i, len;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			if (this.effect_types[i].name === name_)
				return i;
		}
		return -1;
	};
	cr.type_applySolToContainer = function ()
	{
		if (!this.is_contained || this.is_family)
			return;
		var i, len, j, lenj, t, sol, sol2;
		this.updateIIDs();
		sol = this.getCurrentSol();
		var select_all = sol.select_all;
		var es = this.runtime.getCurrentEventStack();
		var orblock = es && es.current_event && es.current_event.orblock;
		for (i = 0, len = this.container.length; i < len; i++)
		{
			t = this.container[i];
			if (t === this)
				continue;
			t.updateIIDs();
			sol2 = t.getCurrentSol();
			sol2.select_all = select_all;
			if (!select_all)
			{
				cr.clearArray(sol2.instances);
				for (j = 0, lenj = sol.instances.length; j < lenj; ++j)
					sol2.instances[j] = t.getInstanceByIID(sol.instances[j].iid);
				if (orblock)
				{
					cr.clearArray(sol2.else_instances);
					for (j = 0, lenj = sol.else_instances.length; j < lenj; ++j)
						sol2.else_instances[j] = t.getInstanceByIID(sol.else_instances[j].iid);
				}
			}
		}
	};
	cr.type_toString = function ()
	{
		return "Type" + this.sid;
	};
	cr.do_cmp = function (x, cmp, y)
	{
		if (typeof x === "undefined" || typeof y === "undefined")
			return false;
		switch (cmp)
		{
			case 0:     // equal
				return x === y;
			case 1:     // not equal
				return x !== y;
			case 2:     // less
				return x < y;
			case 3:     // less/equal
				return x <= y;
			case 4:     // greater
				return x > y;
			case 5:     // greater/equal
				return x >= y;
			default:
;
				return false;
		}
	};
})();
cr.shaders = {};
cr.shaders["blurhorizontal"] = {src: ["varying mediump vec2 vTex;",
"uniform mediump sampler2D samplerFront;",
"uniform mediump float pixelWidth;",
"uniform mediump float intensity;",
"void main(void)",
"{",
"mediump vec4 sum = vec4(0.0);",
"mediump float halfPixelWidth = pixelWidth / 2.0;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 7.0 + halfPixelWidth, 0.0)) * 0.06;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 5.0 + halfPixelWidth, 0.0)) * 0.10;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 3.0 + halfPixelWidth, 0.0)) * 0.13;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 1.0 + halfPixelWidth, 0.0)) * 0.16;",
"mediump vec4 front = texture2D(samplerFront, vTex);",
"sum += front * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 1.0 + halfPixelWidth, 0.0)) * 0.16;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 3.0 + halfPixelWidth, 0.0)) * 0.13;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 5.0 + halfPixelWidth, 0.0)) * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 7.0 + halfPixelWidth, 0.0)) * 0.06;",
"gl_FragColor = mix(front, sum, intensity);",
"}"
].join("\n"),
	extendBoxHorizontal: 8,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["intensity", 0, 1]] }
cr.shaders["brightness"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform lowp float brightness;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"lowp float a = front.a;",
"if (a != 0.0)",
"front.rgb /= front.a;",
"front.rgb += (brightness - 1.0);",
"front.rgb *= a;",
"gl_FragColor = front;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["brightness", 0, 1]] }
cr.shaders["contrast"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform lowp float contrast;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"lowp float a = front.a;",
"if (a != 0.0)",
"front.rgb /= front.a;",
"front.rgb = (front.rgb - vec3(0.5)) * contrast + vec3(0.5);",
"front.rgb *= a;",
"gl_FragColor = front;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["contrast", 0, 1]] }
cr.shaders["gamma"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float gamma;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"gl_FragColor = vec4(pow(front.rgb, vec3(gamma)), front.a);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["gamma", 0, 0]] }
cr.shaders["glowhorizontal"] = {src: ["varying mediump vec2 vTex;",
"uniform mediump sampler2D samplerFront;",
"uniform mediump float pixelWidth;",
"uniform mediump float intensity;",
"void main(void)",
"{",
"mediump vec4 sum = vec4(0.0);",
"mediump float halfPixelWidth = pixelWidth / 2.0;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 7.0 + halfPixelWidth, 0.0)) * 0.06;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 5.0 + halfPixelWidth, 0.0)) * 0.10;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 3.0 + halfPixelWidth, 0.0)) * 0.13;",
"sum += texture2D(samplerFront, vTex - vec2(pixelWidth * 1.0 + halfPixelWidth, 0.0)) * 0.16;",
"mediump vec4 front = texture2D(samplerFront, vTex);",
"sum += front * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 1.0 + halfPixelWidth, 0.0)) * 0.16;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 3.0 + halfPixelWidth, 0.0)) * 0.13;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 5.0 + halfPixelWidth, 0.0)) * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(pixelWidth * 7.0 + halfPixelWidth, 0.0)) * 0.06;",
"gl_FragColor = mix(front, max(front, sum), intensity);",
"}"
].join("\n"),
	extendBoxHorizontal: 8,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["intensity", 0, 1]] }
cr.shaders["glowvertical"] = {src: ["varying mediump vec2 vTex;",
"uniform mediump sampler2D samplerFront;",
"uniform mediump float pixelHeight;",
"uniform mediump float intensity;",
"void main(void)",
"{",
"mediump vec4 sum = vec4(0.0);",
"mediump float halfPixelHeight = pixelHeight / 2.0;",
"sum += texture2D(samplerFront, vTex - vec2(0.0, pixelHeight * 7.0 + halfPixelHeight)) * 0.06;",
"sum += texture2D(samplerFront, vTex - vec2(0.0, pixelHeight * 5.0 + halfPixelHeight)) * 0.10;",
"sum += texture2D(samplerFront, vTex - vec2(0.0, pixelHeight * 3.0 + halfPixelHeight)) * 0.13;",
"sum += texture2D(samplerFront, vTex - vec2(0.0, pixelHeight * 1.0 + halfPixelHeight)) * 0.16;",
"mediump vec4 front = texture2D(samplerFront, vTex);",
"sum += front * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(0.0, pixelHeight * 1.0 + halfPixelHeight)) * 0.16;",
"sum += texture2D(samplerFront, vTex + vec2(0.0, pixelHeight * 3.0 + halfPixelHeight)) * 0.13;",
"sum += texture2D(samplerFront, vTex + vec2(0.0, pixelHeight * 5.0 + halfPixelHeight)) * 0.10;",
"sum += texture2D(samplerFront, vTex + vec2(0.0, pixelHeight * 7.0 + halfPixelHeight)) * 0.06;",
"gl_FragColor = mix(front, max(front, sum), intensity);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 8,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["intensity", 0, 1]] }
cr.shaders["hexpixellate"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"precision mediump float;",
"uniform float pixelWidth;",
"uniform float pixelHeight;",
"uniform float scale;",
"void main()",
"{",
"vec2 texSize = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);",
"vec2 tex = (vTex * texSize - vec2(0.5, 0.5)) / scale;",
"tex.y /= 0.866025404;",
"tex.x -= tex.y * 0.5;",
"vec2 a;",
"if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0)",
"a = vec2(floor(tex.x), floor(tex.y));",
"else",
"a = vec2(ceil(tex.x), ceil(tex.y));",
"vec2 b = vec2(ceil(tex.x), floor(tex.y));",
"vec2 c = vec2(floor(tex.x), ceil(tex.y));",
"vec3 tex2 = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);",
"vec3 a2 = vec3(a.x, a.y, 1.0 - a.x - a.y);",
"vec3 b2 = vec3(b.x, b.y, 1.0 - b.x - b.y);",
"vec3 c2 = vec3(c.x, c.y, 1.0 - c.x - c.y);",
"float alen = length(tex2 - a2);",
"float blen = length(tex2 - b2);",
"float clen = length(tex2 - c2);",
"vec2 choice;",
"if (alen < blen)",
"{",
"if (alen < clen)",
"choice = a;",
"else",
"choice = c;",
"}",
"else",
"{",
"if (blen < clen)",
"choice = b;",
"else",
"choice = c;",
"}",
"choice.x += choice.y * 0.5;",
"choice.y *= 0.866025404;",
"choice *= scale / texSize;",
"gl_FragColor = texture2D(samplerFront, choice + vec2(0.5, 0.5) / texSize);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["scale", 0, 0]] }
cr.shaders["noise"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float seconds;",
"uniform lowp float intensity;",
"uniform lowp float color;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"lowp float a = front.a;",
"if (a != 0.0)",
"front.rgb /= a;",
"mediump float seconds_mod = mod(seconds, 10.0);",
"mediump vec3 noise = vec3(fract(sin(dot(vTex.xy, vec2(12.9898,78.233)) + seconds_mod) * 43758.5453),",
"fract(sin(dot(vTex.yx, vec2(12.9898,-78.233)) + seconds_mod) * 43758.5453),",
"fract(sin(dot(vTex.xy, vec2(-12.9898,-78.233)) + seconds_mod) * 43758.5453));",
"noise = mix(vec3(noise.r), noise, color);",
"front.rgb += (noise * intensity) - (intensity / 2.0);",
"front.rgb *= a;",
"gl_FragColor = front;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: true,
	parameters: [["intensity", 0, 1], ["color", 0, 1]] }
cr.shaders["radialblur"] = {src: ["precision mediump float;",
"varying vec2 vTex;",
"uniform sampler2D samplerFront;",
"uniform float pixelWidth;",
"uniform float pixelHeight;",
"uniform float intensity;",
"uniform float radius;",
"void main(void)",
"{",
"vec2 dir = 0.5 - vTex;",
"float dist = sqrt(dir.x*dir.x + dir.y*dir.y);",
"dir = dir/dist;",
"vec4 front = texture2D(samplerFront, vTex);",
"vec4 sum = front;",
"sum += texture2D(samplerFront, vTex + dir * -0.08 * radius);",
"sum += texture2D(samplerFront, vTex + dir * -0.05 * radius);",
"sum += texture2D(samplerFront, vTex + dir * -0.03 * radius);",
"sum += texture2D(samplerFront, vTex + dir * -0.02 * radius);",
"sum += texture2D(samplerFront, vTex + dir * -0.01 * radius);",
"sum += texture2D(samplerFront, vTex + dir * 0.01 * radius);",
"sum += texture2D(samplerFront, vTex + dir * 0.02 * radius);",
"sum += texture2D(samplerFront, vTex + dir * 0.03 * radius);",
"sum += texture2D(samplerFront, vTex + dir * 0.05 * radius);",
"sum += texture2D(samplerFront, vTex + dir * 0.08 * radius);",
"sum /= 11.0;",
"float t = dist * 2.2;",
"t = clamp(t, 0.0, 1.0);",
"gl_FragColor = mix(front, mix(front, sum, t), intensity);",
"}"
].join("\n"),
	extendBoxHorizontal: 32,
	extendBoxVertical: 32,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["radius", 0, 1], ["intensity", 0, 1]] }
cr.shaders["scanlines"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float pixelHeight;",
"uniform mediump float lineHeight;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"mediump float factor = 1.0 + (floor(mod(vTex.y, pixelHeight * lineHeight * 2.0) / (pixelHeight * lineHeight)) / 3.0);",
"front.rgb /= factor;",
"gl_FragColor = front;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["lineHeight", 0, 0]] }
cr.shaders["sharpen"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float pixelWidth;",
"uniform mediump float pixelHeight;",
"uniform lowp float intensity;",
"void main(void)",
"{",
"mediump float centerMultiplier = 1.0 + 4.0 * intensity;",
"mediump vec4 front = texture2D(samplerFront, vTex);",
"mediump vec3 textureColor = front.rgb;",
"mediump vec3 leftTextureColor = texture2D(samplerFront, vTex - vec2(pixelWidth, 0.0)).rgb;",
"mediump vec3 rightTextureColor = texture2D(samplerFront, vTex + vec2(pixelWidth, 0.0)).rgb;",
"mediump vec3 topTextureColor = texture2D(samplerFront, vTex - vec2(0.0, pixelHeight)).rgb;",
"mediump vec3 bottomTextureColor = texture2D(samplerFront, vTex + vec2(0.0, pixelHeight)).rgb;",
"gl_FragColor = vec4((textureColor * centerMultiplier - (leftTextureColor * intensity + rightTextureColor * intensity + topTextureColor * intensity + bottomTextureColor * intensity)), front.a);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["intensity", 0, 1]] }
cr.shaders["tint"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform lowp float red;",
"uniform lowp float green;",
"uniform lowp float blue;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"gl_FragColor = front * vec4(red, green, blue, 1.0);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["red", 0, 1], ["green", 0, 1], ["blue", 0, 1]] }
cr.shaders["vignette"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float vignetteStart;",
"uniform mediump float vignetteEnd;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"lowp float a = front.a;",
"if (a != 0.0)",
"front.rgb /= a;",
"lowp float d = distance(vTex, vec2(0.5, 0.5));",
"front.rgb *= smoothstep(vignetteEnd, vignetteStart, d);",
"front.rgb *= a;",
"gl_FragColor = front;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["vignetteStart", 0, 1], ["vignetteEnd", 0, 1]] }
;
;
cr.plugins_.AJAX = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var isNWjs = false;
	var path = null;
	var fs = null;
	var nw_appfolder = "";
	var pluginProto = cr.plugins_.AJAX.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lastData = "";
		this.curTag = "";
		this.progress = 0;
		this.timeout = -1;
		isNWjs = this.runtime.isNWjs;
		if (isNWjs)
		{
			path = require("path");
			fs = require("fs");
			var process = window["process"] || nw["process"];
			nw_appfolder = path["dirname"](process["execPath"]) + "\\";
		}
	};
	var instanceProto = pluginProto.Instance.prototype;
	var theInstance = null;
	window["C2_AJAX_DCSide"] = function (event_, tag_, param_)
	{
		if (!theInstance)
			return;
		if (event_ === "success")
		{
			theInstance.curTag = tag_;
			theInstance.lastData = param_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, theInstance);
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, theInstance);
		}
		else if (event_ === "error")
		{
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, theInstance);
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, theInstance);
		}
		else if (event_ === "progress")
		{
			theInstance.progress = param_;
			theInstance.curTag = tag_;
			theInstance.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnProgress, theInstance);
		}
	};
	instanceProto.onCreate = function()
	{
		theInstance = this;
	};
	instanceProto.saveToJSON = function ()
	{
		return { "lastData": this.lastData };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.lastData = o["lastData"];
		this.curTag = "";
		this.progress = 0;
	};
	var next_request_headers = {};
	var next_override_mime = "";
	instanceProto.doRequest = function (tag_, url_, method_, data_)
	{
		if (this.runtime.isDirectCanvas)
		{
			AppMobi["webview"]["execute"]('C2_AJAX_WebSide("' + tag_ + '", "' + url_ + '", "' + method_ + '", ' + (data_ ? '"' + data_ + '"' : "null") + ');');
			return;
		}
		var self = this;
		var request = null;
		var doErrorFunc = function ()
		{
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
		};
		var errorFunc = function ()
		{
			if (isNWjs)
			{
				var filepath = nw_appfolder + url_;
				if (fs["existsSync"](filepath))
				{
					fs["readFile"](filepath, {"encoding": "utf8"}, function (err, data) {
						if (err)
						{
							doErrorFunc();
							return;
						}
						self.curTag = tag_;
						self.lastData = data.replace(/\r\n/g, "\n")
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
					});
				}
				else
					doErrorFunc();
			}
			else
				doErrorFunc();
		};
		var progressFunc = function (e)
		{
			if (!e["lengthComputable"])
				return;
			self.progress = e.loaded / e.total;
			self.curTag = tag_;
			self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnProgress, self);
		};
		try
		{
			if (this.runtime.isWindowsPhone8)
				request = new ActiveXObject("Microsoft.XMLHTTP");
			else
				request = new XMLHttpRequest();
			request.onreadystatechange = function()
			{
				if (request.readyState === 4)
				{
					self.curTag = tag_;
					if (request.responseText)
						self.lastData = request.responseText.replace(/\r\n/g, "\n");		// fix windows style line endings
					else
						self.lastData = "";
					if (request.status >= 400)
					{
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
						self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
					}
					else
					{
						if ((!isNWjs || self.lastData.length) && !(!isNWjs && request.status === 0 && !self.lastData.length))
						{
							self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
							self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
						}
					}
				}
			};
			if (!this.runtime.isWindowsPhone8)
			{
				request.onerror = errorFunc;
				request.ontimeout = errorFunc;
				request.onabort = errorFunc;
				request["onprogress"] = progressFunc;
			}
			request.open(method_, url_);
			if (!this.runtime.isWindowsPhone8)
			{
				if (this.timeout >= 0 && typeof request["timeout"] !== "undefined")
					request["timeout"] = this.timeout;
			}
			try {
				request.responseType = "text";
			} catch (e) {}
			if (data_)
			{
				if (request["setRequestHeader"] && !next_request_headers.hasOwnProperty("Content-Type"))
				{
					request["setRequestHeader"]("Content-Type", "application/x-www-form-urlencoded");
				}
			}
			if (request["setRequestHeader"])
			{
				var p;
				for (p in next_request_headers)
				{
					if (next_request_headers.hasOwnProperty(p))
					{
						try {
							request["setRequestHeader"](p, next_request_headers[p]);
						}
						catch (e) {}
					}
				}
				next_request_headers = {};
			}
			if (next_override_mime && request["overrideMimeType"])
			{
				try {
					request["overrideMimeType"](next_override_mime);
				}
				catch (e) {}
				next_override_mime = "";
			}
			if (data_)
				request.send(data_);
			else
				request.send();
		}
		catch (e)
		{
			errorFunc();
		}
	};
	function Cnds() {};
	Cnds.prototype.OnComplete = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnAnyComplete = function (tag)
	{
		return true;
	};
	Cnds.prototype.OnError = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	Cnds.prototype.OnAnyError = function (tag)
	{
		return true;
	};
	Cnds.prototype.OnProgress = function (tag)
	{
		return cr.equals_nocase(tag, this.curTag);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Request = function (tag_, url_)
	{
		var self = this;
		if (this.runtime.isWKWebView && !this.runtime.isAbsoluteUrl(url_))
		{
			this.runtime.fetchLocalFileViaCordovaAsText(url_,
			function (str)
			{
				self.curTag = tag_;
				self.lastData = str.replace(/\r\n/g, "\n");		// fix windows style line endings
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
			},
			function (err)
			{
				self.curTag = tag_;
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
			});
		}
		else
		{
			this.doRequest(tag_, url_, "GET");
		}
	};
	Acts.prototype.RequestFile = function (tag_, file_)
	{
		var self = this;
		if (this.runtime.isWKWebView)
		{
			this.runtime.fetchLocalFileViaCordovaAsText(file_,
			function (str)
			{
				self.curTag = tag_;
				self.lastData = str.replace(/\r\n/g, "\n");		// fix windows style line endings
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyComplete, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnComplete, self);
			},
			function (err)
			{
				self.curTag = tag_;
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnAnyError, self);
				self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
			});
		}
		else
		{
			this.doRequest(tag_, file_, "GET");
		}
	};
	Acts.prototype.Post = function (tag_, url_, data_, method_)
	{
		this.doRequest(tag_, url_, method_, data_);
	};
	Acts.prototype.SetTimeout = function (t)
	{
		this.timeout = t * 1000;
	};
	Acts.prototype.SetHeader = function (n, v)
	{
		next_request_headers[n] = v;
	};
	Acts.prototype.OverrideMIMEType = function (m)
	{
		next_override_mime = m;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastData = function (ret)
	{
		ret.set_string(this.lastData);
	};
	Exps.prototype.Progress = function (ret)
	{
		ret.set_float(this.progress);
	};
	Exps.prototype.Tag = function (ret)
	{
		ret.set_string(this.curTag);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Audio = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Audio.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	var audRuntime = null;
	var audInst = null;
	var audTag = "";
	var appPath = "";			// for Cordova only
	var API_HTML5 = 0;
	var API_WEBAUDIO = 1;
	var API_CORDOVA = 2;
	var API_APPMOBI = 3;
	var api = API_HTML5;
	var context = null;
	var audioBuffers = [];		// cache of buffers
	var audioInstances = [];	// cache of instances
	var lastAudio = null;
	var useOgg = false;			// determined at create time
	var timescale_mode = 0;
	var silent = false;
	var masterVolume = 1;
	var listenerX = 0;
	var listenerY = 0;
	var isContextSuspended = false;
	var panningModel = 1;		// HRTF
	var distanceModel = 1;		// Inverse
	var refDistance = 10;
	var maxDistance = 10000;
	var rolloffFactor = 1;
	var micSource = null;
	var micTag = "";
	var isMusicWorkaround = false;
	var musicPlayNextTouch = [];
	var playMusicAsSoundWorkaround = false;		// play music tracks with Web Audio API
	function dbToLinear(x)
	{
		var v = dbToLinear_nocap(x);
		if (!isFinite(v))	// accidentally passing a string can result in NaN; set volume to 0 if so
			v = 0;
		if (v < 0)
			v = 0;
		if (v > 1)
			v = 1;
		return v;
	};
	function linearToDb(x)
	{
		if (x < 0)
			x = 0;
		if (x > 1)
			x = 1;
		return linearToDb_nocap(x);
	};
	function dbToLinear_nocap(x)
	{
		return Math.pow(10, x / 20);
	};
	function linearToDb_nocap(x)
	{
		return (Math.log(x) / Math.log(10)) * 20;
	};
	var effects = {};
	function getDestinationForTag(tag)
	{
		tag = tag.toLowerCase();
		if (effects.hasOwnProperty(tag))
		{
			if (effects[tag].length)
				return effects[tag][0].getInputNode();
		}
		return context["destination"];
	};
	function createGain()
	{
		if (context["createGain"])
			return context["createGain"]();
		else
			return context["createGainNode"]();
	};
	function createDelay(d)
	{
		if (context["createDelay"])
			return context["createDelay"](d);
		else
			return context["createDelayNode"](d);
	};
	function startSource(s, scheduledTime)
	{
		if (s["start"])
			s["start"](scheduledTime || 0);
		else
			s["noteOn"](scheduledTime || 0);
	};
	function startSourceAt(s, x, d, scheduledTime)
	{
		if (s["start"])
			s["start"](scheduledTime || 0, x);
		else
			s["noteGrainOn"](scheduledTime || 0, x, d - x);
	};
	function stopSource(s)
	{
		try {
			if (s["stop"])
				s["stop"](0);
			else
				s["noteOff"](0);
		}
		catch (e) {}
	};
	function setAudioParam(ap, value, ramp, time)
	{
		if (!ap)
			return;		// iOS is missing some parameters
		ap["cancelScheduledValues"](0);
		if (time === 0)
		{
			ap["value"] = value;
			return;
		}
		var curTime = context["currentTime"];
		time += curTime;
		switch (ramp) {
		case 0:		// step
			ap["setValueAtTime"](value, time);
			break;
		case 1:		// linear
			ap["setValueAtTime"](ap["value"], curTime);		// to set what to ramp from
			ap["linearRampToValueAtTime"](value, time);
			break;
		case 2:		// exponential
			ap["setValueAtTime"](ap["value"], curTime);		// to set what to ramp from
			ap["exponentialRampToValueAtTime"](value, time);
			break;
		}
	};
	var filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
	function FilterEffect(type, freq, detune, q, gain, mix)
	{
		this.type = "filter";
		this.params = [type, freq, detune, q, gain, mix];
		this.inputNode = createGain();
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix;
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - mix;
		this.filterNode = context["createBiquadFilter"]();
		if (typeof this.filterNode["type"] === "number")
			this.filterNode["type"] = type;
		else
			this.filterNode["type"] = filterTypes[type];
		this.filterNode["frequency"]["value"] = freq;
		if (this.filterNode["detune"])		// iOS 6 doesn't have detune yet
			this.filterNode["detune"]["value"] = detune;
		this.filterNode["Q"]["value"] = q;
		this.filterNode["gain"]["value"] = gain;
		this.inputNode["connect"](this.filterNode);
		this.inputNode["connect"](this.dryNode);
		this.filterNode["connect"](this.wetNode);
	};
	FilterEffect.prototype.connectTo = function (node)
	{
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
	};
	FilterEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.filterNode["disconnect"]();
		this.wetNode["disconnect"]();
		this.dryNode["disconnect"]();
	};
	FilterEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	FilterEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[5] = value;
			setAudioParam(this.wetNode["gain"], value, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - value, ramp, time);
			break;
		case 1:		// filter frequency
			this.params[1] = value;
			setAudioParam(this.filterNode["frequency"], value, ramp, time);
			break;
		case 2:		// filter detune
			this.params[2] = value;
			setAudioParam(this.filterNode["detune"], value, ramp, time);
			break;
		case 3:		// filter Q
			this.params[3] = value;
			setAudioParam(this.filterNode["Q"], value, ramp, time);
			break;
		case 4:		// filter/delay gain (note value is in dB here)
			this.params[4] = value;
			setAudioParam(this.filterNode["gain"], value, ramp, time);
			break;
		}
	};
	function DelayEffect(delayTime, delayGain, mix)
	{
		this.type = "delay";
		this.params = [delayTime, delayGain, mix];
		this.inputNode = createGain();
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix;
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - mix;
		this.mainNode = createGain();
		this.delayNode = createDelay(delayTime);
		this.delayNode["delayTime"]["value"] = delayTime;
		this.delayGainNode = createGain();
		this.delayGainNode["gain"]["value"] = delayGain;
		this.inputNode["connect"](this.mainNode);
		this.inputNode["connect"](this.dryNode);
		this.mainNode["connect"](this.wetNode);
		this.mainNode["connect"](this.delayNode);
		this.delayNode["connect"](this.delayGainNode);
		this.delayGainNode["connect"](this.mainNode);
	};
	DelayEffect.prototype.connectTo = function (node)
	{
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
	};
	DelayEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.mainNode["disconnect"]();
		this.delayNode["disconnect"]();
		this.delayGainNode["disconnect"]();
		this.wetNode["disconnect"]();
		this.dryNode["disconnect"]();
	};
	DelayEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	DelayEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[2] = value;
			setAudioParam(this.wetNode["gain"], value, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - value, ramp, time);
			break;
		case 4:		// filter/delay gain (note value is passed in dB but needs to be linear here)
			this.params[1] = dbToLinear(value);
			setAudioParam(this.delayGainNode["gain"], dbToLinear(value), ramp, time);
			break;
		case 5:		// delay time
			this.params[0] = value;
			setAudioParam(this.delayNode["delayTime"], value, ramp, time);
			break;
		}
	};
	function ConvolveEffect(buffer, normalize, mix, src)
	{
		this.type = "convolve";
		this.params = [normalize, mix, src];
		this.inputNode = createGain();
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix;
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - mix;
		this.convolveNode = context["createConvolver"]();
		if (buffer)
		{
			this.convolveNode["normalize"] = normalize;
			this.convolveNode["buffer"] = buffer;
		}
		this.inputNode["connect"](this.convolveNode);
		this.inputNode["connect"](this.dryNode);
		this.convolveNode["connect"](this.wetNode);
	};
	ConvolveEffect.prototype.connectTo = function (node)
	{
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
	};
	ConvolveEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.convolveNode["disconnect"]();
		this.wetNode["disconnect"]();
		this.dryNode["disconnect"]();
	};
	ConvolveEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	ConvolveEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[1] = value;
			setAudioParam(this.wetNode["gain"], value, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - value, ramp, time);
			break;
		}
	};
	function FlangerEffect(delay, modulation, freq, feedback, mix)
	{
		this.type = "flanger";
		this.params = [delay, modulation, freq, feedback, mix];
		this.inputNode = createGain();
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - (mix / 2);
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix / 2;
		this.feedbackNode = createGain();
		this.feedbackNode["gain"]["value"] = feedback;
		this.delayNode = createDelay(delay + modulation);
		this.delayNode["delayTime"]["value"] = delay;
		this.oscNode = context["createOscillator"]();
		this.oscNode["frequency"]["value"] = freq;
		this.oscGainNode = createGain();
		this.oscGainNode["gain"]["value"] = modulation;
		this.inputNode["connect"](this.delayNode);
		this.inputNode["connect"](this.dryNode);
		this.delayNode["connect"](this.wetNode);
		this.delayNode["connect"](this.feedbackNode);
		this.feedbackNode["connect"](this.delayNode);
		this.oscNode["connect"](this.oscGainNode);
		this.oscGainNode["connect"](this.delayNode["delayTime"]);
		startSource(this.oscNode);
	};
	FlangerEffect.prototype.connectTo = function (node)
	{
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
	};
	FlangerEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.delayNode["disconnect"]();
		this.oscNode["disconnect"]();
		this.oscGainNode["disconnect"]();
		this.dryNode["disconnect"]();
		this.wetNode["disconnect"]();
		this.feedbackNode["disconnect"]();
	};
	FlangerEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	FlangerEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[4] = value;
			setAudioParam(this.wetNode["gain"], value / 2, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - (value / 2), ramp, time);
			break;
		case 6:		// modulation
			this.params[1] = value / 1000;
			setAudioParam(this.oscGainNode["gain"], value / 1000, ramp, time);
			break;
		case 7:		// modulation frequency
			this.params[2] = value;
			setAudioParam(this.oscNode["frequency"], value, ramp, time);
			break;
		case 8:		// feedback
			this.params[3] = value / 100;
			setAudioParam(this.feedbackNode["gain"], value / 100, ramp, time);
			break;
		}
	};
	function PhaserEffect(freq, detune, q, modulation, modfreq, mix)
	{
		this.type = "phaser";
		this.params = [freq, detune, q, modulation, modfreq, mix];
		this.inputNode = createGain();
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - (mix / 2);
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix / 2;
		this.filterNode = context["createBiquadFilter"]();
		if (typeof this.filterNode["type"] === "number")
			this.filterNode["type"] = 7;	// all-pass
		else
			this.filterNode["type"] = "allpass";
		this.filterNode["frequency"]["value"] = freq;
		if (this.filterNode["detune"])		// iOS 6 doesn't have detune yet
			this.filterNode["detune"]["value"] = detune;
		this.filterNode["Q"]["value"] = q;
		this.oscNode = context["createOscillator"]();
		this.oscNode["frequency"]["value"] = modfreq;
		this.oscGainNode = createGain();
		this.oscGainNode["gain"]["value"] = modulation;
		this.inputNode["connect"](this.filterNode);
		this.inputNode["connect"](this.dryNode);
		this.filterNode["connect"](this.wetNode);
		this.oscNode["connect"](this.oscGainNode);
		this.oscGainNode["connect"](this.filterNode["frequency"]);
		startSource(this.oscNode);
	};
	PhaserEffect.prototype.connectTo = function (node)
	{
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
	};
	PhaserEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.filterNode["disconnect"]();
		this.oscNode["disconnect"]();
		this.oscGainNode["disconnect"]();
		this.dryNode["disconnect"]();
		this.wetNode["disconnect"]();
	};
	PhaserEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	PhaserEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[5] = value;
			setAudioParam(this.wetNode["gain"], value / 2, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - (value / 2), ramp, time);
			break;
		case 1:		// filter frequency
			this.params[0] = value;
			setAudioParam(this.filterNode["frequency"], value, ramp, time);
			break;
		case 2:		// filter detune
			this.params[1] = value;
			setAudioParam(this.filterNode["detune"], value, ramp, time);
			break;
		case 3:		// filter Q
			this.params[2] = value;
			setAudioParam(this.filterNode["Q"], value, ramp, time);
			break;
		case 6:		// modulation
			this.params[3] = value;
			setAudioParam(this.oscGainNode["gain"], value, ramp, time);
			break;
		case 7:		// modulation frequency
			this.params[4] = value;
			setAudioParam(this.oscNode["frequency"], value, ramp, time);
			break;
		}
	};
	function GainEffect(g)
	{
		this.type = "gain";
		this.params = [g];
		this.node = createGain();
		this.node["gain"]["value"] = g;
	};
	GainEffect.prototype.connectTo = function (node_)
	{
		this.node["disconnect"]();
		this.node["connect"](node_);
	};
	GainEffect.prototype.remove = function ()
	{
		this.node["disconnect"]();
	};
	GainEffect.prototype.getInputNode = function ()
	{
		return this.node;
	};
	GainEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 4:		// gain
			this.params[0] = dbToLinear(value);
			setAudioParam(this.node["gain"], dbToLinear(value), ramp, time);
			break;
		}
	};
	function TremoloEffect(freq, mix)
	{
		this.type = "tremolo";
		this.params = [freq, mix];
		this.node = createGain();
		this.node["gain"]["value"] = 1 - (mix / 2);
		this.oscNode = context["createOscillator"]();
		this.oscNode["frequency"]["value"] = freq;
		this.oscGainNode = createGain();
		this.oscGainNode["gain"]["value"] = mix / 2;
		this.oscNode["connect"](this.oscGainNode);
		this.oscGainNode["connect"](this.node["gain"]);
		startSource(this.oscNode);
	};
	TremoloEffect.prototype.connectTo = function (node_)
	{
		this.node["disconnect"]();
		this.node["connect"](node_);
	};
	TremoloEffect.prototype.remove = function ()
	{
		this.oscNode["disconnect"]();
		this.oscGainNode["disconnect"]();
		this.node["disconnect"]();
	};
	TremoloEffect.prototype.getInputNode = function ()
	{
		return this.node;
	};
	TremoloEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[1] = value;
			setAudioParam(this.node["gain"]["value"], 1 - (value / 2), ramp, time);
			setAudioParam(this.oscGainNode["gain"]["value"], value / 2, ramp, time);
			break;
		case 7:		// modulation frequency
			this.params[0] = value;
			setAudioParam(this.oscNode["frequency"], value, ramp, time);
			break;
		}
	};
	function RingModulatorEffect(freq, mix)
	{
		this.type = "ringmod";
		this.params = [freq, mix];
		this.inputNode = createGain();
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix;
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - mix;
		this.ringNode = createGain();
		this.ringNode["gain"]["value"] = 0;
		this.oscNode = context["createOscillator"]();
		this.oscNode["frequency"]["value"] = freq;
		this.oscNode["connect"](this.ringNode["gain"]);
		startSource(this.oscNode);
		this.inputNode["connect"](this.ringNode);
		this.inputNode["connect"](this.dryNode);
		this.ringNode["connect"](this.wetNode);
	};
	RingModulatorEffect.prototype.connectTo = function (node_)
	{
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node_);
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node_);
	};
	RingModulatorEffect.prototype.remove = function ()
	{
		this.oscNode["disconnect"]();
		this.ringNode["disconnect"]();
		this.inputNode["disconnect"]();
		this.wetNode["disconnect"]();
		this.dryNode["disconnect"]();
	};
	RingModulatorEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	RingModulatorEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[1] = value;
			setAudioParam(this.wetNode["gain"], value, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - value, ramp, time);
			break;
		case 7:		// modulation frequency
			this.params[0] = value;
			setAudioParam(this.oscNode["frequency"], value, ramp, time);
			break;
		}
	};
	function DistortionEffect(threshold, headroom, drive, makeupgain, mix)
	{
		this.type = "distortion";
		this.params = [threshold, headroom, drive, makeupgain, mix];
		this.inputNode = createGain();
		this.preGain = createGain();
		this.postGain = createGain();
		this.setDrive(drive, dbToLinear_nocap(makeupgain));
		this.wetNode = createGain();
		this.wetNode["gain"]["value"] = mix;
		this.dryNode = createGain();
		this.dryNode["gain"]["value"] = 1 - mix;
		this.waveShaper = context["createWaveShaper"]();
		this.curve = new Float32Array(65536);
		this.generateColortouchCurve(threshold, headroom);
		this.waveShaper.curve = this.curve;
		this.inputNode["connect"](this.preGain);
		this.inputNode["connect"](this.dryNode);
		this.preGain["connect"](this.waveShaper);
		this.waveShaper["connect"](this.postGain);
		this.postGain["connect"](this.wetNode);
	};
	DistortionEffect.prototype.setDrive = function (drive, makeupgain)
	{
		if (drive < 0.01)
			drive = 0.01;
		this.preGain["gain"]["value"] = drive;
		this.postGain["gain"]["value"] = Math.pow(1 / drive, 0.6) * makeupgain;
	};
	function e4(x, k)
	{
		return 1.0 - Math.exp(-k * x);
	}
	DistortionEffect.prototype.shape = function (x, linearThreshold, linearHeadroom)
	{
		var maximum = 1.05 * linearHeadroom * linearThreshold;
		var kk = (maximum - linearThreshold);
		var sign = x < 0 ? -1 : +1;
		var absx = x < 0 ? -x : x;
		var shapedInput = absx < linearThreshold ? absx : linearThreshold + kk * e4(absx - linearThreshold, 1.0 / kk);
		shapedInput *= sign;
		return shapedInput;
	};
	DistortionEffect.prototype.generateColortouchCurve = function (threshold, headroom)
	{
		var linearThreshold = dbToLinear_nocap(threshold);
		var linearHeadroom = dbToLinear_nocap(headroom);
		var n = 65536;
		var n2 = n / 2;
		var x = 0;
		for (var i = 0; i < n2; ++i) {
			x = i / n2;
			x = this.shape(x, linearThreshold, linearHeadroom);
			this.curve[n2 + i] = x;
			this.curve[n2 - i - 1] = -x;
		}
	};
	DistortionEffect.prototype.connectTo = function (node)
	{
		this.wetNode["disconnect"]();
		this.wetNode["connect"](node);
		this.dryNode["disconnect"]();
		this.dryNode["connect"](node);
	};
	DistortionEffect.prototype.remove = function ()
	{
		this.inputNode["disconnect"]();
		this.preGain["disconnect"]();
		this.waveShaper["disconnect"]();
		this.postGain["disconnect"]();
		this.wetNode["disconnect"]();
		this.dryNode["disconnect"]();
	};
	DistortionEffect.prototype.getInputNode = function ()
	{
		return this.inputNode;
	};
	DistortionEffect.prototype.setParam = function(param, value, ramp, time)
	{
		switch (param) {
		case 0:		// mix
			value = value / 100;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			this.params[4] = value;
			setAudioParam(this.wetNode["gain"], value, ramp, time);
			setAudioParam(this.dryNode["gain"], 1 - value, ramp, time);
			break;
		}
	};
	function CompressorEffect(threshold, knee, ratio, attack, release)
	{
		this.type = "compressor";
		this.params = [threshold, knee, ratio, attack, release];
		this.node = context["createDynamicsCompressor"]();
		try {
			this.node["threshold"]["value"] = threshold;
			this.node["knee"]["value"] = knee;
			this.node["ratio"]["value"] = ratio;
			this.node["attack"]["value"] = attack;
			this.node["release"]["value"] = release;
		}
		catch (e) {}
	};
	CompressorEffect.prototype.connectTo = function (node_)
	{
		this.node["disconnect"]();
		this.node["connect"](node_);
	};
	CompressorEffect.prototype.remove = function ()
	{
		this.node["disconnect"]();
	};
	CompressorEffect.prototype.getInputNode = function ()
	{
		return this.node;
	};
	CompressorEffect.prototype.setParam = function(param, value, ramp, time)
	{
	};
	function AnalyserEffect(fftSize, smoothing)
	{
		this.type = "analyser";
		this.params = [fftSize, smoothing];
		this.node = context["createAnalyser"]();
		this.node["fftSize"] = fftSize;
		this.node["smoothingTimeConstant"] = smoothing;
		this.freqBins = new Float32Array(this.node["frequencyBinCount"]);
		this.signal = new Uint8Array(fftSize);
		this.peak = 0;
		this.rms = 0;
	};
	AnalyserEffect.prototype.tick = function ()
	{
		this.node["getFloatFrequencyData"](this.freqBins);
		this.node["getByteTimeDomainData"](this.signal);
		var fftSize = this.node["fftSize"];
		var i = 0;
		this.peak = 0;
		var rmsSquaredSum = 0;
		var s = 0;
		for ( ; i < fftSize; i++)
		{
			s = (this.signal[i] - 128) / 128;
			if (s < 0)
				s = -s;
			if (this.peak < s)
				this.peak = s;
			rmsSquaredSum += s * s;
		}
		this.peak = linearToDb(this.peak);
		this.rms = linearToDb(Math.sqrt(rmsSquaredSum / fftSize));
	};
	AnalyserEffect.prototype.connectTo = function (node_)
	{
		this.node["disconnect"]();
		this.node["connect"](node_);
	};
	AnalyserEffect.prototype.remove = function ()
	{
		this.node["disconnect"]();
	};
	AnalyserEffect.prototype.getInputNode = function ()
	{
		return this.node;
	};
	AnalyserEffect.prototype.setParam = function(param, value, ramp, time)
	{
	};
	function ObjectTracker()
	{
		this.obj = null;
		this.loadUid = 0;
	};
	ObjectTracker.prototype.setObject = function (obj_)
	{
		this.obj = obj_;
	};
	ObjectTracker.prototype.hasObject = function ()
	{
		return !!this.obj;
	};
	ObjectTracker.prototype.tick = function (dt)
	{
	};
	var iOShadtouchstart = false;	// has had touch start input on iOS <=8 to work around web audio API muting
	var iOShadtouchend = false;		// has had touch end input on iOS 9+ to work around web audio API muting
	function C2AudioBuffer(src_, is_music)
	{
		this.src = src_;
		this.myapi = api;
		this.is_music = is_music;
		this.added_end_listener = false;
		var self = this;
		this.outNode = null;
		this.mediaSourceNode = null;
		this.panWhenReady = [];		// for web audio API positioned sounds
		this.seekWhenReady = 0;
		this.pauseWhenReady = false;
		this.supportWebAudioAPI = false;
		this.failedToLoad = false;
		this.wasEverReady = false;	// if a buffer is ever marked as ready, it's permanently considered ready after then.
		if (api === API_WEBAUDIO && is_music && !playMusicAsSoundWorkaround)
		{
			this.myapi = API_HTML5;
			this.outNode = createGain();
		}
		this.bufferObject = null;			// actual audio object
		this.audioData = null;				// web audio api: ajax request result (compressed audio that needs decoding)
		var request;
		switch (this.myapi) {
		case API_HTML5:
			this.bufferObject = new Audio();
			this.bufferObject.crossOrigin = "anonymous";
			this.bufferObject.addEventListener("canplaythrough", function () {
				self.wasEverReady = true;	// update loaded state so preload is considered complete
			});
			if (api === API_WEBAUDIO && context["createMediaElementSource"] && !/wiiu/i.test(navigator.userAgent))
			{
				this.supportWebAudioAPI = true;		// can be routed through web audio api
				this.bufferObject.addEventListener("canplay", function ()
				{
					if (!self.mediaSourceNode)		// protect against this event firing twice
					{
						self.mediaSourceNode = context["createMediaElementSource"](self.bufferObject);
						self.mediaSourceNode["connect"](self.outNode);
					}
				});
			}
			this.bufferObject.autoplay = false;	// this is only a source buffer, not an instance
			this.bufferObject.preload = "auto";
			this.bufferObject.src = src_;
			break;
		case API_WEBAUDIO:
			if (audRuntime.isWKWebView)
			{
				audRuntime.fetchLocalFileViaCordovaAsArrayBuffer(src_, function (arrayBuffer)
				{
					self.audioData = arrayBuffer;
					self.decodeAudioBuffer();
				}, function (err)
				{
					self.failedToLoad = true;
				});
			}
			else
			{
				request = new XMLHttpRequest();
				request.open("GET", src_, true);
				request.responseType = "arraybuffer";
				request.onload = function () {
					self.audioData = request.response;
					self.decodeAudioBuffer();
				};
				request.onerror = function () {
					self.failedToLoad = true;
				};
				request.send();
			}
			break;
		case API_CORDOVA:
			this.bufferObject = true;
			break;
		case API_APPMOBI:
			this.bufferObject = true;
			break;
		}
	};
	C2AudioBuffer.prototype.release = function ()
	{
		var i, len, j, a;
		for (i = 0, j = 0, len = audioInstances.length; i < len; ++i)
		{
			a = audioInstances[i];
			audioInstances[j] = a;
			if (a.buffer === this)
				a.stop();
			else
				++j;		// keep
		}
		audioInstances.length = j;
		this.bufferObject = null;
		this.audioData = null;
	};
	C2AudioBuffer.prototype.decodeAudioBuffer = function ()
	{
		if (this.bufferObject || !this.audioData)
			return;		// audio already decoded or AJAX request not yet complete
		var self = this;
		if (context["decodeAudioData"])
		{
			context["decodeAudioData"](this.audioData, function (buffer) {
					self.bufferObject = buffer;
					self.audioData = null;		// clear AJAX response to allow GC and save memory, only need the bufferObject now
					var p, i, len, a;
					if (!cr.is_undefined(self.playTagWhenReady) && !silent)
					{
						if (self.panWhenReady.length)
						{
							for (i = 0, len = self.panWhenReady.length; i < len; i++)
							{
								p = self.panWhenReady[i];
								a = new C2AudioInstance(self, p.thistag);
								a.setPannerEnabled(true);
								if (typeof p.objUid !== "undefined")
								{
									p.obj = audRuntime.getObjectByUID(p.objUid);
									if (!p.obj)
										continue;
								}
								if (p.obj)
								{
									var px = cr.rotatePtAround(p.obj.x, p.obj.y, -p.obj.layer.getAngle(), listenerX, listenerY, true);
									var py = cr.rotatePtAround(p.obj.x, p.obj.y, -p.obj.layer.getAngle(), listenerX, listenerY, false);
									a.setPan(px, py, cr.to_degrees(p.obj.angle - p.obj.layer.getAngle()), p.ia, p.oa, p.og);
									a.setObject(p.obj);
								}
								else
								{
									a.setPan(p.x, p.y, p.a, p.ia, p.oa, p.og);
								}
								a.play(self.loopWhenReady, self.volumeWhenReady, self.seekWhenReady);
								if (self.pauseWhenReady)
									a.pause();
								audioInstances.push(a);
							}
							cr.clearArray(self.panWhenReady);
						}
						else
						{
							a = new C2AudioInstance(self, self.playTagWhenReady || "");		// sometimes playTagWhenReady is not set - TODO: why?
							a.play(self.loopWhenReady, self.volumeWhenReady, self.seekWhenReady);
							if (self.pauseWhenReady)
								a.pause();
							audioInstances.push(a);
						}
					}
					else if (!cr.is_undefined(self.convolveWhenReady))
					{
						var convolveNode = self.convolveWhenReady.convolveNode;
						convolveNode["normalize"] = self.normalizeWhenReady;
						convolveNode["buffer"] = buffer;
					}
			}, function (e) {
				self.failedToLoad = true;
			});
		}
		else
		{
			this.bufferObject = context["createBuffer"](this.audioData, false);
			this.audioData = null;		// clear AJAX response to allow GC and save memory, only need the bufferObject now
			if (!cr.is_undefined(this.playTagWhenReady) && !silent)
			{
				var a = new C2AudioInstance(this, this.playTagWhenReady);
				a.play(this.loopWhenReady, this.volumeWhenReady, this.seekWhenReady);
				if (this.pauseWhenReady)
					a.pause();
				audioInstances.push(a);
			}
			else if (!cr.is_undefined(this.convolveWhenReady))
			{
				var convolveNode = this.convolveWhenReady.convolveNode;
				convolveNode["normalize"] = this.normalizeWhenReady;
				convolveNode["buffer"] = this.bufferObject;
			}
		}
	};
	C2AudioBuffer.prototype.isLoaded = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			var ret = this.bufferObject["readyState"] >= 4;	// HAVE_ENOUGH_DATA
			if (ret)
				this.wasEverReady = true;
			return ret || this.wasEverReady;
		case API_WEBAUDIO:
			return !!this.audioData || !!this.bufferObject;
		case API_CORDOVA:
			return true;
		case API_APPMOBI:
			return true;
		}
		return false;
	};
	C2AudioBuffer.prototype.isLoadedAndDecoded = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			return this.isLoaded();		// no distinction between loaded and decoded in HTML5 audio, just rely on ready state
		case API_WEBAUDIO:
			return !!this.bufferObject;
		case API_CORDOVA:
			return true;
		case API_APPMOBI:
			return true;
		}
		return false;
	};
	C2AudioBuffer.prototype.hasFailedToLoad = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			return !!this.bufferObject["error"];
		case API_WEBAUDIO:
			return this.failedToLoad;
		}
		return false;
	};
	function C2AudioInstance(buffer_, tag_)
	{
		var self = this;
		this.tag = tag_;
		this.fresh = true;
		this.stopped = true;
		this.src = buffer_.src;
		this.buffer = buffer_;
		this.myapi = api;
		this.is_music = buffer_.is_music;
		this.playbackRate = 1;
		this.hasPlaybackEnded = true;	// ended flag
		this.resume_me = false;			// make sure resumes when leaving suspend
		this.is_paused = false;
		this.resume_position = 0;		// for web audio api to resume from correct playback position
		this.looping = false;
		this.is_muted = false;
		this.is_silent = false;
		this.volume = 1;
		this.onended_handler = function (e)
		{
			if (self.is_paused || self.resume_me)
				return;
			var bufferThatEnded = this;
			if (!bufferThatEnded)
				bufferThatEnded = e.target;
			if (bufferThatEnded !== self.active_buffer)
				return;
			self.hasPlaybackEnded = true;
			self.stopped = true;
			audTag = self.tag;
			audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
		};
		this.active_buffer = null;
		this.isTimescaled = ((timescale_mode === 1 && !this.is_music) || timescale_mode === 2);
		this.mutevol = 1;
		this.startTime = (this.isTimescaled ? audRuntime.kahanTime.sum : audRuntime.wallTime.sum);
		this.gainNode = null;
		this.pannerNode = null;
		this.pannerEnabled = false;
		this.objectTracker = null;
		this.panX = 0;
		this.panY = 0;
		this.panAngle = 0;
		this.panConeInner = 0;
		this.panConeOuter = 0;
		this.panConeOuterGain = 0;
		this.instanceObject = null;
		var add_end_listener = false;
		if (this.myapi === API_WEBAUDIO && this.buffer.myapi === API_HTML5 && !this.buffer.supportWebAudioAPI)
			this.myapi = API_HTML5;
		switch (this.myapi) {
		case API_HTML5:
			if (this.is_music)
			{
				this.instanceObject = buffer_.bufferObject;
				add_end_listener = !buffer_.added_end_listener;
				buffer_.added_end_listener = true;
			}
			else
			{
				this.instanceObject = new Audio();
				this.instanceObject.crossOrigin = "anonymous";
				this.instanceObject.autoplay = false;
				this.instanceObject.src = buffer_.bufferObject.src;
				add_end_listener = true;
			}
			if (add_end_listener)
			{
				this.instanceObject.addEventListener('ended', function () {
						audTag = self.tag;
						self.stopped = true;
						audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
				});
			}
			break;
		case API_WEBAUDIO:
			this.gainNode = createGain();
			this.gainNode["connect"](getDestinationForTag(tag_));
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				if (buffer_.bufferObject)
				{
					this.instanceObject = context["createBufferSource"]();
					this.instanceObject["buffer"] = buffer_.bufferObject;
					this.instanceObject["connect"](this.gainNode);
				}
			}
			else
			{
				this.instanceObject = this.buffer.bufferObject;		// reference the audio element
				this.buffer.outNode["connect"](this.gainNode);
				if (!this.buffer.added_end_listener)
				{
					this.buffer.added_end_listener = true;
					this.buffer.bufferObject.addEventListener('ended', function () {
							audTag = self.tag;
							self.stopped = true;
							audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
					});
				}
			}
			break;
		case API_CORDOVA:
			this.instanceObject = new window["Media"](appPath + this.src, null, null, function (status) {
					if (status === window["Media"]["MEDIA_STOPPED"])
					{
						self.hasPlaybackEnded = true;
						self.stopped = true;
						audTag = self.tag;
						audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
					}
			});
			break;
		case API_APPMOBI:
			this.instanceObject = true;
			break;
		}
	};
	C2AudioInstance.prototype.hasEnded = function ()
	{
		var time;
		switch (this.myapi) {
		case API_HTML5:
			return this.instanceObject.ended;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				if (!this.fresh && !this.stopped && this.instanceObject["loop"])
					return false;
				if (this.is_paused)
					return false;
				return this.hasPlaybackEnded;
			}
			else
				return this.instanceObject.ended;
		case API_CORDOVA:
			return this.hasPlaybackEnded;
		case API_APPMOBI:
			true;	// recycling an AppMobi sound does not matter because it will just do another throwaway playSound
		}
		return true;
	};
	C2AudioInstance.prototype.canBeRecycled = function ()
	{
		if (this.fresh || this.stopped)
			return true;		// not yet used or is not playing
		return this.hasEnded();
	};
	C2AudioInstance.prototype.setPannerEnabled = function (enable_)
	{
		if (api !== API_WEBAUDIO)
			return;
		if (!this.pannerEnabled && enable_)
		{
			if (!this.gainNode)
				return;
			if (!this.pannerNode)
			{
				this.pannerNode = context["createPanner"]();
				if (typeof this.pannerNode["panningModel"] === "number")
					this.pannerNode["panningModel"] = panningModel;
				else
					this.pannerNode["panningModel"] = ["equalpower", "HRTF", "soundfield"][panningModel];
				if (typeof this.pannerNode["distanceModel"] === "number")
					this.pannerNode["distanceModel"] = distanceModel;
				else
					this.pannerNode["distanceModel"] = ["linear", "inverse", "exponential"][distanceModel];
				this.pannerNode["refDistance"] = refDistance;
				this.pannerNode["maxDistance"] = maxDistance;
				this.pannerNode["rolloffFactor"] = rolloffFactor;
			}
			this.gainNode["disconnect"]();
			this.gainNode["connect"](this.pannerNode);
			this.pannerNode["connect"](getDestinationForTag(this.tag));
			this.pannerEnabled = true;
		}
		else if (this.pannerEnabled && !enable_)
		{
			if (!this.gainNode)
				return;
			this.pannerNode["disconnect"]();
			this.gainNode["disconnect"]();
			this.gainNode["connect"](getDestinationForTag(this.tag));
			this.pannerEnabled = false;
		}
	};
	C2AudioInstance.prototype.setPan = function (x, y, angle, innerangle, outerangle, outergain)
	{
		if (!this.pannerEnabled || api !== API_WEBAUDIO)
			return;
		this.pannerNode["setPosition"](x, y, 0);
		this.pannerNode["setOrientation"](Math.cos(cr.to_radians(angle)), Math.sin(cr.to_radians(angle)), 0);
		this.pannerNode["coneInnerAngle"] = innerangle;
		this.pannerNode["coneOuterAngle"] = outerangle;
		this.pannerNode["coneOuterGain"] = outergain;
		this.panX = x;
		this.panY = y;
		this.panAngle = angle;
		this.panConeInner = innerangle;
		this.panConeOuter = outerangle;
		this.panConeOuterGain = outergain;
	};
	C2AudioInstance.prototype.setObject = function (o)
	{
		if (!this.pannerEnabled || api !== API_WEBAUDIO)
			return;
		if (!this.objectTracker)
			this.objectTracker = new ObjectTracker();
		this.objectTracker.setObject(o);
	};
	C2AudioInstance.prototype.tick = function (dt)
	{
		if (!this.pannerEnabled || api !== API_WEBAUDIO || !this.objectTracker || !this.objectTracker.hasObject() || !this.isPlaying())
		{
			return;
		}
		this.objectTracker.tick(dt);
		var inst = this.objectTracker.obj;
		var px = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, true);
		var py = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, false);
		this.pannerNode["setPosition"](px, py, 0);
		var a = 0;
		if (typeof this.objectTracker.obj.angle !== "undefined")
		{
			a = inst.angle - inst.layer.getAngle();
			this.pannerNode["setOrientation"](Math.cos(a), Math.sin(a), 0);
		}
	};
	C2AudioInstance.prototype.play = function (looping, vol, fromPosition, scheduledTime)
	{
		var instobj = this.instanceObject;
		this.looping = looping;
		this.volume = vol;
		var seekPos = fromPosition || 0;
		scheduledTime = scheduledTime || 0;
		switch (this.myapi) {
		case API_HTML5:
			if (instobj.playbackRate !== 1.0)
				instobj.playbackRate = 1.0;
			if (instobj.volume !== vol * masterVolume)
				instobj.volume = vol * masterVolume;
			if (instobj.loop !== looping)
				instobj.loop = looping;
			if (instobj.muted)
				instobj.muted = false;
			if (instobj.currentTime !== seekPos)
			{
				try {
					instobj.currentTime = seekPos;
				}
				catch (err)
				{
;
				}
			}
			if (this.is_music && isMusicWorkaround && !audRuntime.isInUserInputEvent)
				musicPlayNextTouch.push(this);
			else
			{
				try {
					this.instanceObject.play();
				}
				catch (e) {		// sometimes throws on WP8.1... try not to kill the app
					if (console && console.log)
						console.log("[C2] WARNING: exception trying to play audio '" + this.buffer.src + "': ", e);
				}
			}
			break;
		case API_WEBAUDIO:
			this.muted = false;
			this.mutevol = 1;
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				this.gainNode["gain"]["value"] = vol * masterVolume;
				if (!this.fresh)
				{
					this.instanceObject = context["createBufferSource"]();
					this.instanceObject["buffer"] = this.buffer.bufferObject;
					this.instanceObject["connect"](this.gainNode);
				}
				this.instanceObject["onended"] = this.onended_handler;
				this.active_buffer = this.instanceObject;
				this.instanceObject.loop = looping;
				this.hasPlaybackEnded = false;
				if (seekPos === 0)
					startSource(this.instanceObject, scheduledTime);
				else
					startSourceAt(this.instanceObject, seekPos, this.getDuration(), scheduledTime);
			}
			else
			{
				if (instobj.playbackRate !== 1.0)
					instobj.playbackRate = 1.0;
				if (instobj.loop !== looping)
					instobj.loop = looping;
				instobj.volume = vol * masterVolume;
				if (instobj.currentTime !== seekPos)
				{
					try {
						instobj.currentTime = seekPos;
					}
					catch (err)
					{
;
					}
				}
				if (this.is_music && isMusicWorkaround && !audRuntime.isInUserInputEvent)
					musicPlayNextTouch.push(this);
				else
					instobj.play();
			}
			break;
		case API_CORDOVA:
			if ((!this.fresh && this.stopped) || seekPos !== 0)
				instobj["seekTo"](seekPos);
			instobj["play"]();
			this.hasPlaybackEnded = false;
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["playSound"](this.src, looping);
			else
				AppMobi["player"]["playSound"](this.src, looping);
			break;
		}
		this.playbackRate = 1;
		this.startTime = (this.isTimescaled ? audRuntime.kahanTime.sum : audRuntime.wallTime.sum) - seekPos;
		this.fresh = false;
		this.stopped = false;
		this.is_paused = false;
	};
	C2AudioInstance.prototype.stop = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			if (!this.instanceObject.paused)
				this.instanceObject.pause();
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
				stopSource(this.instanceObject);
			else
			{
				if (!this.instanceObject.paused)
					this.instanceObject.pause();
			}
			break;
		case API_CORDOVA:
			this.instanceObject["stop"]();
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["stopSound"](this.src);
			break;
		}
		this.stopped = true;
		this.is_paused = false;
	};
	C2AudioInstance.prototype.pause = function ()
	{
		if (this.fresh || this.stopped || this.hasEnded() || this.is_paused)
			return;
		switch (this.myapi) {
		case API_HTML5:
			if (!this.instanceObject.paused)
				this.instanceObject.pause();
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				this.resume_position = this.getPlaybackTime(true);
				if (this.looping)
					this.resume_position = this.resume_position % this.getDuration();
				this.is_paused = true;
				stopSource(this.instanceObject);
			}
			else
			{
				if (!this.instanceObject.paused)
					this.instanceObject.pause();
			}
			break;
		case API_CORDOVA:
			this.instanceObject["pause"]();
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["stopSound"](this.src);
			break;
		}
		this.is_paused = true;
	};
	C2AudioInstance.prototype.resume = function ()
	{
		if (this.fresh || this.stopped || this.hasEnded() || !this.is_paused)
			return;
		switch (this.myapi) {
		case API_HTML5:
			this.instanceObject.play();
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				this.instanceObject = context["createBufferSource"]();
				this.instanceObject["buffer"] = this.buffer.bufferObject;
				this.instanceObject["connect"](this.gainNode);
				this.instanceObject["onended"] = this.onended_handler;
				this.active_buffer = this.instanceObject;
				this.instanceObject.loop = this.looping;
				this.gainNode["gain"]["value"] = masterVolume * this.volume * this.mutevol;
				this.updatePlaybackRate();
				this.startTime = (this.isTimescaled ? audRuntime.kahanTime.sum : audRuntime.wallTime.sum) - (this.resume_position / (this.playbackRate || 0.001));
				startSourceAt(this.instanceObject, this.resume_position, this.getDuration());
			}
			else
			{
				this.instanceObject.play();
			}
			break;
		case API_CORDOVA:
			this.instanceObject["play"]();
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["resumeSound"](this.src);
			break;
		}
		this.is_paused = false;
	};
	C2AudioInstance.prototype.seek = function (pos)
	{
		if (this.fresh || this.stopped || this.hasEnded())
			return;
		switch (this.myapi) {
		case API_HTML5:
			try {
				this.instanceObject.currentTime = pos;
			}
			catch (e) {}
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				if (this.is_paused)
					this.resume_position = pos;
				else
				{
					this.pause();
					this.resume_position = pos;
					this.resume();
				}
			}
			else
			{
				try {
					this.instanceObject.currentTime = pos;
				}
				catch (e) {}
			}
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["seekSound"](this.src, pos);
			break;
		}
	};
	C2AudioInstance.prototype.reconnect = function (toNode)
	{
		if (this.myapi !== API_WEBAUDIO)
			return;
		if (this.pannerEnabled)
		{
			this.pannerNode["disconnect"]();
			this.pannerNode["connect"](toNode);
		}
		else
		{
			this.gainNode["disconnect"]();
			this.gainNode["connect"](toNode);
		}
	};
	C2AudioInstance.prototype.getDuration = function (applyPlaybackRate)
	{
		var ret = 0;
		switch (this.myapi) {
		case API_HTML5:
			if (typeof this.instanceObject.duration !== "undefined")
				ret = this.instanceObject.duration;
			break;
		case API_WEBAUDIO:
			ret = this.buffer.bufferObject["duration"];
			break;
		case API_CORDOVA:
			ret = this.instanceObject["getDuration"]();
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				ret = AppMobi["context"]["getDurationSound"](this.src);
			break;
		}
		if (applyPlaybackRate)
			ret /= (this.playbackRate || 0.001);		// avoid divide-by-zero
		return ret;
	};
	C2AudioInstance.prototype.getPlaybackTime = function (applyPlaybackRate)
	{
		var duration = this.getDuration();
		var ret = 0;
		switch (this.myapi) {
		case API_HTML5:
			if (typeof this.instanceObject.currentTime !== "undefined")
				ret = this.instanceObject.currentTime;
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				if (this.is_paused)
					return this.resume_position;
				else
					ret = (this.isTimescaled ? audRuntime.kahanTime.sum : audRuntime.wallTime.sum) - this.startTime;
			}
			else if (typeof this.instanceObject.currentTime !== "undefined")
				ret = this.instanceObject.currentTime;
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				ret = AppMobi["context"]["getPlaybackTimeSound"](this.src);
			break;
		}
		if (applyPlaybackRate)
			ret *= this.playbackRate;
		if (!this.looping && ret > duration)
			ret = duration;
		return ret;
	};
	C2AudioInstance.prototype.isPlaying = function ()
	{
		return !this.is_paused && !this.fresh && !this.stopped && !this.hasEnded();
	};
	C2AudioInstance.prototype.shouldSave = function ()
	{
		return !this.fresh && !this.stopped && !this.hasEnded();
	};
	C2AudioInstance.prototype.setVolume = function (v)
	{
		this.volume = v;
		this.updateVolume();
	};
	C2AudioInstance.prototype.updateVolume = function ()
	{
		var volToSet = this.volume * masterVolume;
		if (!isFinite(volToSet))
			volToSet = 0;		// HTMLMediaElement throws if setting non-finite volume
		switch (this.myapi) {
		case API_HTML5:
			if (typeof this.instanceObject.volume !== "undefined" && this.instanceObject.volume !== volToSet)
				this.instanceObject.volume = volToSet;
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				this.gainNode["gain"]["value"] = volToSet * this.mutevol;
			}
			else
			{
				if (typeof this.instanceObject.volume !== "undefined" && this.instanceObject.volume !== volToSet)
					this.instanceObject.volume = volToSet;
			}
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			break;
		}
	};
	C2AudioInstance.prototype.getVolume = function ()
	{
		return this.volume;
	};
	C2AudioInstance.prototype.doSetMuted = function (m)
	{
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.muted !== !!m)
				this.instanceObject.muted = !!m;
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				this.mutevol = (m ? 0 : 1);
				this.gainNode["gain"]["value"] = masterVolume * this.volume * this.mutevol;
			}
			else
			{
				if (this.instanceObject.muted !== !!m)
					this.instanceObject.muted = !!m;
			}
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			break;
		}
	};
	C2AudioInstance.prototype.setMuted = function (m)
	{
		this.is_muted = !!m;
		this.doSetMuted(this.is_muted || this.is_silent);
	};
	C2AudioInstance.prototype.setSilent = function (m)
	{
		this.is_silent = !!m;
		this.doSetMuted(this.is_muted || this.is_silent);
	};
	C2AudioInstance.prototype.setLooping = function (l)
	{
		this.looping = l;
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.loop !== !!l)
				this.instanceObject.loop = !!l;
			break;
		case API_WEBAUDIO:
			if (this.instanceObject.loop !== !!l)
				this.instanceObject.loop = !!l;
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["setLoopingSound"](this.src, l);
			break;
		}
	};
	C2AudioInstance.prototype.setPlaybackRate = function (r)
	{
		this.playbackRate = r;
		this.updatePlaybackRate();
	};
	C2AudioInstance.prototype.updatePlaybackRate = function ()
	{
		var r = this.playbackRate;
		if (this.isTimescaled)
			r *= audRuntime.timescale;
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.playbackRate !== r)
				this.instanceObject.playbackRate = r;
			break;
		case API_WEBAUDIO:
			if (this.buffer.myapi === API_WEBAUDIO)
			{
				if (this.instanceObject["playbackRate"]["value"] !== r)
					this.instanceObject["playbackRate"]["value"] = r;
			}
			else
			{
				if (this.instanceObject.playbackRate !== r)
					this.instanceObject.playbackRate = r;
			}
			break;
		case API_CORDOVA:
			break;
		case API_APPMOBI:
			break;
		}
	};
	C2AudioInstance.prototype.setSuspended = function (s)
	{
		switch (this.myapi) {
		case API_HTML5:
			if (s)
			{
				if (this.isPlaying())
				{
					this.resume_me = true;
					this.instanceObject["pause"]();
				}
				else
					this.resume_me = false;
			}
			else
			{
				if (this.resume_me)
				{
					this.instanceObject["play"]();
					this.resume_me = false;
				}
			}
			break;
		case API_WEBAUDIO:
			if (s)
			{
				if (this.isPlaying())
				{
					this.resume_me = true;
					if (this.buffer.myapi === API_WEBAUDIO)
					{
						this.resume_position = this.getPlaybackTime(true);
						if (this.looping)
							this.resume_position = this.resume_position % this.getDuration();
						stopSource(this.instanceObject);
					}
					else
						this.instanceObject["pause"]();
				}
				else
					this.resume_me = false;
			}
			else
			{
				if (this.resume_me)
				{
					if (this.buffer.myapi === API_WEBAUDIO)
					{
						this.instanceObject = context["createBufferSource"]();
						this.instanceObject["buffer"] = this.buffer.bufferObject;
						this.instanceObject["connect"](this.gainNode);
						this.instanceObject["onended"] = this.onended_handler;
						this.active_buffer = this.instanceObject;
						this.instanceObject.loop = this.looping;
						this.gainNode["gain"]["value"] = masterVolume * this.volume * this.mutevol;
						this.updatePlaybackRate();
						this.startTime = (this.isTimescaled ? audRuntime.kahanTime.sum : audRuntime.wallTime.sum) - (this.resume_position / (this.playbackRate || 0.001));
						startSourceAt(this.instanceObject, this.resume_position, this.getDuration());
					}
					else
					{
						this.instanceObject["play"]();
					}
					this.resume_me = false;
				}
			}
			break;
		case API_CORDOVA:
			if (s)
			{
				if (this.isPlaying())
				{
					this.instanceObject["pause"]();
					this.resume_me = true;
				}
				else
					this.resume_me = false;
			}
			else
			{
				if (this.resume_me)
				{
					this.resume_me = false;
					this.instanceObject["play"]();
				}
			}
			break;
		case API_APPMOBI:
			break;
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		audRuntime = this.runtime;
		audInst = this;
		this.listenerTracker = null;
		this.listenerZ = -600;
		if (this.runtime.isWKWebView)
			playMusicAsSoundWorkaround = true;
		if ((this.runtime.isiOS || (this.runtime.isAndroid && (this.runtime.isChrome || this.runtime.isAndroidStockBrowser))) && !this.runtime.isCrosswalk && !this.runtime.isDomFree && !this.runtime.isAmazonWebApp && !playMusicAsSoundWorkaround)
		{
			isMusicWorkaround = true;
		}
		context = null;
		if (typeof AudioContext !== "undefined")
		{
			api = API_WEBAUDIO;
			context = new AudioContext();
		}
		else if (typeof webkitAudioContext !== "undefined")
		{
			api = API_WEBAUDIO;
			context = new webkitAudioContext();
		}
		if (this.runtime.isiOS && context)
		{
			if (context.close)
				context.close();
			if (typeof AudioContext !== "undefined")
				context = new AudioContext();
			else if (typeof webkitAudioContext !== "undefined")
				context = new webkitAudioContext();
		}
		var isAndroid = this.runtime.isAndroid;
		var playDummyBuffer = function ()
		{
			if (isContextSuspended || !context["createBuffer"])
				return;
			var buffer = context["createBuffer"](1, 220, 22050);
			var source = context["createBufferSource"]();
			source["buffer"] = buffer;
			source["connect"](context["destination"]);
			startSource(source);
		};
		if (isMusicWorkaround)
		{
			var playQueuedMusic = function ()
			{
				var i, len, m;
				if (isMusicWorkaround)
				{
					if (!silent)
					{
						for (i = 0, len = musicPlayNextTouch.length; i < len; ++i)
						{
							m = musicPlayNextTouch[i];
							if (!m.stopped && !m.is_paused)
								m.instanceObject.play();
						}
					}
					cr.clearArray(musicPlayNextTouch);
				}
			};
			document.addEventListener("touchend", function ()
			{
				if (!iOShadtouchend && context)
				{
					playDummyBuffer();
					iOShadtouchend = true;
				}
				playQueuedMusic();
			}, true);
		}
		else if (playMusicAsSoundWorkaround)
		{
			document.addEventListener("touchend", function ()
			{
				if (!iOShadtouchend && context)
				{
					playDummyBuffer();
					iOShadtouchend = true;
				}
			}, true);
		}
		if (api !== API_WEBAUDIO)
		{
			if (this.runtime.isCordova && typeof window["Media"] !== "undefined")
				api = API_CORDOVA;
			else if (this.runtime.isAppMobi)
				api = API_APPMOBI;
		}
		if (api === API_CORDOVA)
		{
			appPath = location.href;
			var i = appPath.lastIndexOf("/");
			if (i > -1)
				appPath = appPath.substr(0, i + 1);
			appPath = appPath.replace("file://", "");
		}
		if (this.runtime.isSafari && this.runtime.isWindows && typeof Audio === "undefined")
		{
			alert("It looks like you're using Safari for Windows without Quicktime.  Audio cannot be played until Quicktime is installed.");
			this.runtime.DestroyInstance(this);
		}
		else
		{
			if (this.runtime.isDirectCanvas)
				useOgg = this.runtime.isAndroid;		// AAC on iOS, OGG on Android
			else
			{
				try {
					useOgg = !!(new Audio().canPlayType('audio/ogg; codecs="vorbis"'));
				}
				catch (e)
				{
					useOgg = false;
				}
			}
			switch (api) {
			case API_HTML5:
;
				break;
			case API_WEBAUDIO:
;
				break;
			case API_CORDOVA:
;
				break;
			case API_APPMOBI:
;
				break;
			default:
;
			}
			this.runtime.tickMe(this);
		}
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function ()
	{
		this.runtime.audioInstance = this;
		timescale_mode = this.properties[0];	// 0 = off, 1 = sounds only, 2 = all
		this.saveload = this.properties[1];		// 0 = all, 1 = sounds only, 2 = music only, 3 = none
		this.playinbackground = (this.properties[2] !== 0);
		this.nextPlayTime = 0;
		panningModel = this.properties[3];		// 0 = equalpower, 1 = hrtf, 3 = soundfield
		distanceModel = this.properties[4];		// 0 = linear, 1 = inverse, 2 = exponential
		this.listenerZ = -this.properties[5];
		refDistance = this.properties[6];
		maxDistance = this.properties[7];
		rolloffFactor = this.properties[8];
		this.listenerTracker = new ObjectTracker();
		var draw_width = (this.runtime.draw_width || this.runtime.width);
		var draw_height = (this.runtime.draw_height || this.runtime.height);
		if (api === API_WEBAUDIO)
		{
			context["listener"]["setPosition"](draw_width / 2, draw_height / 2, this.listenerZ);
			context["listener"]["setOrientation"](0, 0, 1, 0, -1, 0);
			window["c2OnAudioMicStream"] = function (localMediaStream, tag)
			{
				if (micSource)
					micSource["disconnect"]();
				micTag = tag.toLowerCase();
				micSource = context["createMediaStreamSource"](localMediaStream);
				micSource["connect"](getDestinationForTag(micTag));
			};
		}
		this.runtime.addSuspendCallback(function(s)
		{
			audInst.onSuspend(s);
		});
		var self = this;
		this.runtime.addDestroyCallback(function (inst)
		{
			self.onInstanceDestroyed(inst);
		});
	};
	instanceProto.onInstanceDestroyed = function (inst)
	{
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			if (a.objectTracker)
			{
				if (a.objectTracker.obj === inst)
				{
					a.objectTracker.obj = null;
					if (a.pannerEnabled && a.isPlaying() && a.looping)
						a.stop();
				}
			}
		}
		if (this.listenerTracker.obj === inst)
			this.listenerTracker.obj = null;
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"silent": silent,
			"masterVolume": masterVolume,
			"listenerZ": this.listenerZ,
			"listenerUid": this.listenerTracker.hasObject() ? this.listenerTracker.obj.uid : -1,
			"playing": [],
			"effects": {}
		};
		var playingarr = o["playing"];
		var i, len, a, d, p, panobj, playbackTime;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			if (!a.shouldSave())
				continue;				// no need to save stopped sounds
			if (this.saveload === 3)	// not saving/loading any sounds/music
				continue;
			if (a.is_music && this.saveload === 1)	// not saving/loading music
				continue;
			if (!a.is_music && this.saveload === 2)	// not saving/loading sound
				continue;
			playbackTime = a.getPlaybackTime();
			if (a.looping)
				playbackTime = playbackTime % a.getDuration();
			d = {
				"tag": a.tag,
				"buffersrc": a.buffer.src,
				"is_music": a.is_music,
				"playbackTime": playbackTime,
				"volume": a.volume,
				"looping": a.looping,
				"muted": a.is_muted,
				"playbackRate": a.playbackRate,
				"paused": a.is_paused,
				"resume_position": a.resume_position
			};
			if (a.pannerEnabled)
			{
				d["pan"] = {};
				panobj = d["pan"];
				if (a.objectTracker && a.objectTracker.hasObject())
				{
					panobj["objUid"] = a.objectTracker.obj.uid;
				}
				else
				{
					panobj["x"] = a.panX;
					panobj["y"] = a.panY;
					panobj["a"] = a.panAngle;
				}
				panobj["ia"] = a.panConeInner;
				panobj["oa"] = a.panConeOuter;
				panobj["og"] = a.panConeOuterGain;
			}
			playingarr.push(d);
		}
		var fxobj = o["effects"];
		var fxarr;
		for (p in effects)
		{
			if (effects.hasOwnProperty(p))
			{
				fxarr = [];
				for (i = 0, len = effects[p].length; i < len; i++)
				{
					fxarr.push({ "type": effects[p][i].type, "params": effects[p][i].params });
				}
				fxobj[p] = fxarr;
			}
		}
		return o;
	};
	var objectTrackerUidsToLoad = [];
	instanceProto.loadFromJSON = function (o)
	{
		var setSilent = o["silent"];
		masterVolume = o["masterVolume"];
		this.listenerZ = o["listenerZ"];
		this.listenerTracker.setObject(null);
		var listenerUid = o["listenerUid"];
		if (listenerUid !== -1)
		{
			this.listenerTracker.loadUid = listenerUid;
			objectTrackerUidsToLoad.push(this.listenerTracker);
		}
		var playingarr = o["playing"];
		var i, len, d, src, is_music, tag, playbackTime, looping, vol, b, a, p, pan, panObjUid;
		if (this.saveload !== 3)
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
			{
				a = audioInstances[i];
				if (a.is_music && this.saveload === 1)
					continue;		// only saving/loading sound: leave music playing
				if (!a.is_music && this.saveload === 2)
					continue;		// only saving/loading music: leave sound playing
				a.stop();
			}
		}
		var fxarr, fxtype, fxparams, fx;
		for (p in effects)
		{
			if (effects.hasOwnProperty(p))
			{
				for (i = 0, len = effects[p].length; i < len; i++)
					effects[p][i].remove();
			}
		}
		cr.wipe(effects);
		for (p in o["effects"])
		{
			if (o["effects"].hasOwnProperty(p))
			{
				fxarr = o["effects"][p];
				for (i = 0, len = fxarr.length; i < len; i++)
				{
					fxtype = fxarr[i]["type"];
					fxparams = fxarr[i]["params"];
					switch (fxtype) {
					case "filter":
						addEffectForTag(p, new FilterEffect(fxparams[0], fxparams[1], fxparams[2], fxparams[3], fxparams[4], fxparams[5]));
						break;
					case "delay":
						addEffectForTag(p, new DelayEffect(fxparams[0], fxparams[1], fxparams[2]));
						break;
					case "convolve":
						src = fxparams[2];
						b = this.getAudioBuffer(src, false);
						if (b.bufferObject)
						{
							fx = new ConvolveEffect(b.bufferObject, fxparams[0], fxparams[1], src);
						}
						else
						{
							fx = new ConvolveEffect(null, fxparams[0], fxparams[1], src);
							b.normalizeWhenReady = fxparams[0];
							b.convolveWhenReady = fx;
						}
						addEffectForTag(p, fx);
						break;
					case "flanger":
						addEffectForTag(p, new FlangerEffect(fxparams[0], fxparams[1], fxparams[2], fxparams[3], fxparams[4]));
						break;
					case "phaser":
						addEffectForTag(p, new PhaserEffect(fxparams[0], fxparams[1], fxparams[2], fxparams[3], fxparams[4], fxparams[5]));
						break;
					case "gain":
						addEffectForTag(p, new GainEffect(fxparams[0]));
						break;
					case "tremolo":
						addEffectForTag(p, new TremoloEffect(fxparams[0], fxparams[1]));
						break;
					case "ringmod":
						addEffectForTag(p, new RingModulatorEffect(fxparams[0], fxparams[1]));
						break;
					case "distortion":
						addEffectForTag(p, new DistortionEffect(fxparams[0], fxparams[1], fxparams[2], fxparams[3], fxparams[4]));
						break;
					case "compressor":
						addEffectForTag(p, new CompressorEffect(fxparams[0], fxparams[1], fxparams[2], fxparams[3], fxparams[4]));
						break;
					case "analyser":
						addEffectForTag(p, new AnalyserEffect(fxparams[0], fxparams[1]));
						break;
					}
				}
			}
		}
		for (i = 0, len = playingarr.length; i < len; i++)
		{
			if (this.saveload === 3)	// not saving/loading any sounds/music
				continue;
			d = playingarr[i];
			src = d["buffersrc"];
			is_music = d["is_music"];
			tag = d["tag"];
			playbackTime = d["playbackTime"];
			looping = d["looping"];
			vol = d["volume"];
			pan = d["pan"];
			panObjUid = (pan && pan.hasOwnProperty("objUid")) ? pan["objUid"] : -1;
			if (is_music && this.saveload === 1)	// not saving/loading music
				continue;
			if (!is_music && this.saveload === 2)	// not saving/loading sound
				continue;
			a = this.getAudioInstance(src, tag, is_music, looping, vol);
			if (!a)
			{
				b = this.getAudioBuffer(src, is_music);
				b.seekWhenReady = playbackTime;
				b.pauseWhenReady = d["paused"];
				if (pan)
				{
					if (panObjUid !== -1)
					{
						b.panWhenReady.push({ objUid: panObjUid, ia: pan["ia"], oa: pan["oa"], og: pan["og"], thistag: tag });
					}
					else
					{
						b.panWhenReady.push({ x: pan["x"], y: pan["y"], a: pan["a"], ia: pan["ia"], oa: pan["oa"], og: pan["og"], thistag: tag });
					}
				}
				continue;
			}
			a.resume_position = d["resume_position"];
			a.setPannerEnabled(!!pan);
			a.play(looping, vol, playbackTime);
			a.updatePlaybackRate();
			a.updateVolume();
			a.doSetMuted(a.is_muted || a.is_silent);
			if (d["paused"])
				a.pause();
			if (d["muted"])
				a.setMuted(true);
			a.doSetMuted(a.is_muted || a.is_silent);
			if (pan)
			{
				if (panObjUid !== -1)
				{
					a.objectTracker = a.objectTracker || new ObjectTracker();
					a.objectTracker.loadUid = panObjUid;
					objectTrackerUidsToLoad.push(a.objectTracker);
				}
				else
				{
					a.setPan(pan["x"], pan["y"], pan["a"], pan["ia"], pan["oa"], pan["og"]);
				}
			}
		}
		if (setSilent && !silent)			// setting silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setSilent(true);
			silent = true;
		}
		else if (!setSilent && silent)		// setting not silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setSilent(false);
			silent = false;
		}
	};
	instanceProto.afterLoad = function ()
	{
		var i, len, ot, inst;
		for (i = 0, len = objectTrackerUidsToLoad.length; i < len; i++)
		{
			ot = objectTrackerUidsToLoad[i];
			inst = this.runtime.getObjectByUID(ot.loadUid);
			ot.setObject(inst);
			ot.loadUid = -1;
			if (inst)
			{
				listenerX = inst.x;
				listenerY = inst.y;
			}
		}
		cr.clearArray(objectTrackerUidsToLoad);
	};
	instanceProto.onSuspend = function (s)
	{
		if (this.playinbackground)
			return;
		if (!s && context && context["resume"])
		{
			context["resume"]();
			isContextSuspended = false;
		}
		var i, len;
		for (i = 0, len = audioInstances.length; i < len; i++)
			audioInstances[i].setSuspended(s);
		if (s && context && context["suspend"])
		{
			context["suspend"]();
			isContextSuspended = true;
		}
	};
	instanceProto.tick = function ()
	{
		var dt = this.runtime.dt;
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			a.tick(dt);
			if (timescale_mode !== 0)
				a.updatePlaybackRate();
		}
		var p, arr, f;
		for (p in effects)
		{
			if (effects.hasOwnProperty(p))
			{
				arr = effects[p];
				for (i = 0, len = arr.length; i < len; i++)
				{
					f = arr[i];
					if (f.tick)
						f.tick();
				}
			}
		}
		if (api === API_WEBAUDIO && this.listenerTracker.hasObject())
		{
			this.listenerTracker.tick(dt);
			listenerX = this.listenerTracker.obj.x;
			listenerY = this.listenerTracker.obj.y;
			context["listener"]["setPosition"](this.listenerTracker.obj.x, this.listenerTracker.obj.y, this.listenerZ);
		}
	};
	var preload_list = [];
	instanceProto.setPreloadList = function (arr)
	{
		var i, len, p, filename, size, isOgg;
		var total_size = 0;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			p = arr[i];
			filename = p[0];
			size = p[1] * 2;
			isOgg = (filename.length > 4 && filename.substr(filename.length - 4) === ".ogg");
			if ((isOgg && useOgg) || (!isOgg && !useOgg))
			{
				preload_list.push({
					filename: filename,
					size: size,
					obj: null
				});
				total_size += size;
			}
		}
		return total_size;
	};
	instanceProto.startPreloads = function ()
	{
		var i, len, p, src;
		for (i = 0, len = preload_list.length; i < len; ++i)
		{
			p = preload_list[i];
			src = this.runtime.files_subfolder + p.filename;
			p.obj = this.getAudioBuffer(src, false);
		}
	};
	instanceProto.getPreloadedSize = function ()
	{
		var completed = 0;
		var i, len, p;
		for (i = 0, len = preload_list.length; i < len; ++i)
		{
			p = preload_list[i];
			if (p.obj.isLoadedAndDecoded() || p.obj.hasFailedToLoad() || this.runtime.isDomFree || this.runtime.isAndroidStockBrowser)
			{
				completed += p.size;
			}
			else if (p.obj.isLoaded())	// downloaded but not decoded: only happens in Web Audio API, count as half-way progress
			{
				completed += Math.floor(p.size / 2);
			}
		};
		return completed;
	};
	instanceProto.releaseAllMusicBuffers = function ()
	{
		var i, len, j, b;
		for (i = 0, j = 0, len = audioBuffers.length; i < len; ++i)
		{
			b = audioBuffers[i];
			audioBuffers[j] = b;
			if (b.is_music)
				b.release();
			else
				++j;		// keep
		}
		audioBuffers.length = j;
	};
	instanceProto.getAudioBuffer = function (src_, is_music)
	{
		var i, len, a, ret = null, j, k, lenj, ai;
		for (i = 0, len = audioBuffers.length; i < len; i++)
		{
			a = audioBuffers[i];
			if (a.src === src_)
			{
				ret = a;
				break;
			}
		}
		if (!ret)
		{
			if (playMusicAsSoundWorkaround && is_music)
				this.releaseAllMusicBuffers();
			ret = new C2AudioBuffer(src_, is_music);
			audioBuffers.push(ret);
		}
		return ret;
	};
	instanceProto.getAudioInstance = function (src_, tag, is_music, looping, vol)
	{
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			if (a.src === src_ && (a.canBeRecycled() || is_music))
			{
				a.tag = tag;
				return a;
			}
		}
		var b = this.getAudioBuffer(src_, is_music);
		if (!b.bufferObject)
		{
			if (tag !== "<preload>")
			{
				b.playTagWhenReady = tag;
				b.loopWhenReady = looping;
				b.volumeWhenReady = vol;
			}
			return null;
		}
		a = new C2AudioInstance(b, tag);
		audioInstances.push(a);
		return a;
	};
	var taggedAudio = [];
	function SortByIsPlaying(a, b)
	{
		var an = a.isPlaying() ? 1 : 0;
		var bn = b.isPlaying() ? 1 : 0;
		if (an === bn)
			return 0;
		else if (an < bn)
			return 1;
		else
			return -1;
	};
	function getAudioByTag(tag, sort_by_playing)
	{
		cr.clearArray(taggedAudio);
		if (!tag.length)
		{
			if (!lastAudio || lastAudio.hasEnded())
				return;
			else
			{
				cr.clearArray(taggedAudio);
				taggedAudio[0] = lastAudio;
				return;
			}
		}
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			if (cr.equals_nocase(tag, a.tag))
				taggedAudio.push(a);
		}
		if (sort_by_playing)
			taggedAudio.sort(SortByIsPlaying);
	};
	function reconnectEffects(tag)
	{
		var i, len, arr, n, toNode = context["destination"];
		if (effects.hasOwnProperty(tag))
		{
			arr = effects[tag];
			if (arr.length)
			{
				toNode = arr[0].getInputNode();
				for (i = 0, len = arr.length; i < len; i++)
				{
					n = arr[i];
					if (i + 1 === len)
						n.connectTo(context["destination"]);
					else
						n.connectTo(arr[i + 1].getInputNode());
				}
			}
		}
		getAudioByTag(tag);
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].reconnect(toNode);
		if (micSource && micTag === tag)
		{
			micSource["disconnect"]();
			micSource["connect"](toNode);
		}
	};
	function addEffectForTag(tag, fx)
	{
		if (!effects.hasOwnProperty(tag))
			effects[tag] = [fx];
		else
			effects[tag].push(fx);
		reconnectEffects(tag);
	};
	function Cnds() {};
	Cnds.prototype.OnEnded = function (t)
	{
		return cr.equals_nocase(audTag, t);
	};
	Cnds.prototype.PreloadsComplete = function ()
	{
		var i, len;
		for (i = 0, len = audioBuffers.length; i < len; i++)
		{
			if (!audioBuffers[i].isLoadedAndDecoded() && !audioBuffers[i].hasFailedToLoad())
				return false;
		}
		return true;
	};
	Cnds.prototype.AdvancedAudioSupported = function ()
	{
		return api === API_WEBAUDIO;
	};
	Cnds.prototype.IsSilent = function ()
	{
		return silent;
	};
	Cnds.prototype.IsAnyPlaying = function ()
	{
		var i, len;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			if (audioInstances[i].isPlaying())
				return true;
		}
		return false;
	};
	Cnds.prototype.IsTagPlaying = function (tag)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
		{
			if (taggedAudio[i].isPlaying())
				return true;
		}
		return false;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Play = function (file, looping, vol, tag)
	{
		if (silent)
			return;
		var v = dbToLinear(vol);
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
			return;
		lastAudio.setPannerEnabled(false);
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.PlayAtPosition = function (file, looping, vol, x_, y_, angle_, innerangle_, outerangle_, outergain_, tag)
	{
		if (silent)
			return;
		var v = dbToLinear(vol);
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
		{
			var b = this.getAudioBuffer(src, is_music);
			b.panWhenReady.push({ x: x_, y: y_, a: angle_, ia: innerangle_, oa: outerangle_, og: dbToLinear(outergain_), thistag: tag });
			return;
		}
		lastAudio.setPannerEnabled(true);
		lastAudio.setPan(x_, y_, angle_, innerangle_, outerangle_, dbToLinear(outergain_));
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.PlayAtObject = function (file, looping, vol, obj, innerangle, outerangle, outergain, tag)
	{
		if (silent || !obj)
			return;
		var inst = obj.getFirstPicked();
		if (!inst)
			return;
		var v = dbToLinear(vol);
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
		{
			var b = this.getAudioBuffer(src, is_music);
			b.panWhenReady.push({ obj: inst, ia: innerangle, oa: outerangle, og: dbToLinear(outergain), thistag: tag });
			return;
		}
		lastAudio.setPannerEnabled(true);
		var px = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, true);
		var py = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, false);
		lastAudio.setPan(px, py, cr.to_degrees(inst.angle - inst.layer.getAngle()), innerangle, outerangle, dbToLinear(outergain));
		lastAudio.setObject(inst);
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.PlayByName = function (folder, filename, looping, vol, tag)
	{
		if (silent)
			return;
		var v = dbToLinear(vol);
		var is_music = (folder === 1);
		var src = this.runtime.files_subfolder + filename.toLowerCase() + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
			return;
		lastAudio.setPannerEnabled(false);
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.PlayAtPositionByName = function (folder, filename, looping, vol, x_, y_, angle_, innerangle_, outerangle_, outergain_, tag)
	{
		if (silent)
			return;
		var v = dbToLinear(vol);
		var is_music = (folder === 1);
		var src = this.runtime.files_subfolder + filename.toLowerCase() + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
		{
			var b = this.getAudioBuffer(src, is_music);
			b.panWhenReady.push({ x: x_, y: y_, a: angle_, ia: innerangle_, oa: outerangle_, og: dbToLinear(outergain_), thistag: tag });
			return;
		}
		lastAudio.setPannerEnabled(true);
		lastAudio.setPan(x_, y_, angle_, innerangle_, outerangle_, dbToLinear(outergain_));
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.PlayAtObjectByName = function (folder, filename, looping, vol, obj, innerangle, outerangle, outergain, tag)
	{
		if (silent || !obj)
			return;
		var inst = obj.getFirstPicked();
		if (!inst)
			return;
		var v = dbToLinear(vol);
		var is_music = (folder === 1);
		var src = this.runtime.files_subfolder + filename.toLowerCase() + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0, v);
		if (!lastAudio)
		{
			var b = this.getAudioBuffer(src, is_music);
			b.panWhenReady.push({ obj: inst, ia: innerangle, oa: outerangle, og: dbToLinear(outergain), thistag: tag });
			return;
		}
		lastAudio.setPannerEnabled(true);
		var px = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, true);
		var py = cr.rotatePtAround(inst.x, inst.y, -inst.layer.getAngle(), listenerX, listenerY, false);
		lastAudio.setPan(px, py, cr.to_degrees(inst.angle - inst.layer.getAngle()), innerangle, outerangle, dbToLinear(outergain));
		lastAudio.setObject(inst);
		lastAudio.play(looping!==0, v, 0, this.nextPlayTime);
		this.nextPlayTime = 0;
	};
	Acts.prototype.SetLooping = function (tag, looping)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setLooping(looping === 0);
	};
	Acts.prototype.SetMuted = function (tag, muted)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setMuted(muted === 0);
	};
	Acts.prototype.SetVolume = function (tag, vol)
	{
		getAudioByTag(tag);
		var v = dbToLinear(vol);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setVolume(v);
	};
	Acts.prototype.Preload = function (file)
	{
		if (silent)
			return;
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		if (api === API_APPMOBI)
		{
			if (this.runtime.isDirectCanvas)
				AppMobi["context"]["loadSound"](src);
			else
				AppMobi["player"]["loadSound"](src);
			return;
		}
		else if (api === API_CORDOVA)
		{
			return;
		}
		this.getAudioInstance(src, "<preload>", is_music, false);
	};
	Acts.prototype.PreloadByName = function (folder, filename)
	{
		if (silent)
			return;
		var is_music = (folder === 1);
		var src = this.runtime.files_subfolder + filename.toLowerCase() + (useOgg ? ".ogg" : ".m4a");
		if (api === API_APPMOBI)
		{
			if (this.runtime.isDirectCanvas)
				AppMobi["context"]["loadSound"](src);
			else
				AppMobi["player"]["loadSound"](src);
			return;
		}
		else if (api === API_CORDOVA)
		{
			return;
		}
		this.getAudioInstance(src, "<preload>", is_music, false);
	};
	Acts.prototype.SetPlaybackRate = function (tag, rate)
	{
		getAudioByTag(tag);
		if (rate < 0.0)
			rate = 0;
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setPlaybackRate(rate);
	};
	Acts.prototype.Stop = function (tag)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].stop();
	};
	Acts.prototype.StopAll = function ()
	{
		var i, len;
		for (i = 0, len = audioInstances.length; i < len; i++)
			audioInstances[i].stop();
	};
	Acts.prototype.SetPaused = function (tag, state)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
		{
			if (state === 0)
				taggedAudio[i].pause();
			else
				taggedAudio[i].resume();
		}
	};
	Acts.prototype.Seek = function (tag, pos)
	{
		getAudioByTag(tag);
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
		{
			taggedAudio[i].seek(pos);
		}
	};
	Acts.prototype.SetSilent = function (s)
	{
		var i, len;
		if (s === 2)					// toggling
			s = (silent ? 1 : 0);		// choose opposite state
		if (s === 0 && !silent)			// setting silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setSilent(true);
			silent = true;
		}
		else if (s === 1 && silent)		// setting not silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setSilent(false);
			silent = false;
		}
	};
	Acts.prototype.SetMasterVolume = function (vol)
	{
		masterVolume = dbToLinear(vol);
		var i, len;
		for (i = 0, len = audioInstances.length; i < len; i++)
			audioInstances[i].updateVolume();
	};
	Acts.prototype.AddFilterEffect = function (tag, type, freq, detune, q, gain, mix)
	{
		if (api !== API_WEBAUDIO || type < 0 || type >= filterTypes.length || !context["createBiquadFilter"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new FilterEffect(type, freq, detune, q, gain, mix));
	};
	Acts.prototype.AddDelayEffect = function (tag, delay, gain, mix)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new DelayEffect(delay, dbToLinear(gain), mix));
	};
	Acts.prototype.AddFlangerEffect = function (tag, delay, modulation, freq, feedback, mix)
	{
		if (api !== API_WEBAUDIO || !context["createOscillator"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new FlangerEffect(delay / 1000, modulation / 1000, freq, feedback / 100, mix));
	};
	Acts.prototype.AddPhaserEffect = function (tag, freq, detune, q, mod, modfreq, mix)
	{
		if (api !== API_WEBAUDIO || !context["createOscillator"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new PhaserEffect(freq, detune, q, mod, modfreq, mix));
	};
	Acts.prototype.AddConvolutionEffect = function (tag, file, norm, mix)
	{
		if (api !== API_WEBAUDIO || !context["createConvolver"])
			return;
		var doNormalize = (norm === 0);
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		var b = this.getAudioBuffer(src, false);
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		var fx;
		if (b.bufferObject)
		{
			fx = new ConvolveEffect(b.bufferObject, doNormalize, mix, src);
		}
		else
		{
			fx = new ConvolveEffect(null, doNormalize, mix, src);
			b.normalizeWhenReady = doNormalize;
			b.convolveWhenReady = fx;
		}
		addEffectForTag(tag, fx);
	};
	Acts.prototype.AddGainEffect = function (tag, g)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		addEffectForTag(tag, new GainEffect(dbToLinear(g)));
	};
	Acts.prototype.AddMuteEffect = function (tag)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		addEffectForTag(tag, new GainEffect(0));	// re-use gain effect with 0 gain
	};
	Acts.prototype.AddTremoloEffect = function (tag, freq, mix)
	{
		if (api !== API_WEBAUDIO || !context["createOscillator"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new TremoloEffect(freq, mix));
	};
	Acts.prototype.AddRingModEffect = function (tag, freq, mix)
	{
		if (api !== API_WEBAUDIO || !context["createOscillator"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new RingModulatorEffect(freq, mix));
	};
	Acts.prototype.AddDistortionEffect = function (tag, threshold, headroom, drive, makeupgain, mix)
	{
		if (api !== API_WEBAUDIO || !context["createWaveShaper"])
			return;
		tag = tag.toLowerCase();
		mix = mix / 100;
		if (mix < 0) mix = 0;
		if (mix > 1) mix = 1;
		addEffectForTag(tag, new DistortionEffect(threshold, headroom, drive, makeupgain, mix));
	};
	Acts.prototype.AddCompressorEffect = function (tag, threshold, knee, ratio, attack, release)
	{
		if (api !== API_WEBAUDIO || !context["createDynamicsCompressor"])
			return;
		tag = tag.toLowerCase();
		addEffectForTag(tag, new CompressorEffect(threshold, knee, ratio, attack / 1000, release / 1000));
	};
	Acts.prototype.AddAnalyserEffect = function (tag, fftSize, smoothing)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		addEffectForTag(tag, new AnalyserEffect(fftSize, smoothing));
	};
	Acts.prototype.RemoveEffects = function (tag)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		var i, len, arr;
		if (effects.hasOwnProperty(tag))
		{
			arr = effects[tag];
			if (arr.length)
			{
				for (i = 0, len = arr.length; i < len; i++)
					arr[i].remove();
				cr.clearArray(arr);
				reconnectEffects(tag);
			}
		}
	};
	Acts.prototype.SetEffectParameter = function (tag, index, param, value, ramp, time)
	{
		if (api !== API_WEBAUDIO)
			return;
		tag = tag.toLowerCase();
		index = Math.floor(index);
		var arr;
		if (!effects.hasOwnProperty(tag))
			return;
		arr = effects[tag];
		if (index < 0 || index >= arr.length)
			return;
		arr[index].setParam(param, value, ramp, time);
	};
	Acts.prototype.SetListenerObject = function (obj_)
	{
		if (!obj_ || api !== API_WEBAUDIO)
			return;
		var inst = obj_.getFirstPicked();
		if (!inst)
			return;
		this.listenerTracker.setObject(inst);
		listenerX = inst.x;
		listenerY = inst.y;
	};
	Acts.prototype.SetListenerZ = function (z)
	{
		this.listenerZ = z;
	};
	Acts.prototype.ScheduleNextPlay = function (t)
	{
		if (!context)
			return;		// needs Web Audio API
		this.nextPlayTime = t;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Duration = function (ret, tag)
	{
		getAudioByTag(tag, true);
		if (taggedAudio.length)
			ret.set_float(taggedAudio[0].getDuration());
		else
			ret.set_float(0);
	};
	Exps.prototype.PlaybackTime = function (ret, tag)
	{
		getAudioByTag(tag, true);
		if (taggedAudio.length)
			ret.set_float(taggedAudio[0].getPlaybackTime(true));
		else
			ret.set_float(0);
	};
	Exps.prototype.Volume = function (ret, tag)
	{
		getAudioByTag(tag, true);
		if (taggedAudio.length)
		{
			var v = taggedAudio[0].getVolume();
			ret.set_float(linearToDb(v));
		}
		else
			ret.set_float(0);
	};
	Exps.prototype.MasterVolume = function (ret)
	{
		ret.set_float(linearToDb(masterVolume));
	};
	Exps.prototype.EffectCount = function (ret, tag)
	{
		tag = tag.toLowerCase();
		var arr = null;
		if (effects.hasOwnProperty(tag))
			arr = effects[tag];
		ret.set_int(arr ? arr.length : 0);
	};
	function getAnalyser(tag, index)
	{
		var arr = null;
		if (effects.hasOwnProperty(tag))
			arr = effects[tag];
		if (arr && index >= 0 && index < arr.length && arr[index].freqBins)
			return arr[index];
		else
			return null;
	};
	Exps.prototype.AnalyserFreqBinCount = function (ret, tag, index)
	{
		tag = tag.toLowerCase();
		index = Math.floor(index);
		var analyser = getAnalyser(tag, index);
		ret.set_int(analyser ? analyser.node["frequencyBinCount"] : 0);
	};
	Exps.prototype.AnalyserFreqBinAt = function (ret, tag, index, bin)
	{
		tag = tag.toLowerCase();
		index = Math.floor(index);
		bin = Math.floor(bin);
		var analyser = getAnalyser(tag, index);
		if (!analyser)
			ret.set_float(0);
		else if (bin < 0 || bin >= analyser.node["frequencyBinCount"])
			ret.set_float(0);
		else
			ret.set_float(analyser.freqBins[bin]);
	};
	Exps.prototype.AnalyserPeakLevel = function (ret, tag, index)
	{
		tag = tag.toLowerCase();
		index = Math.floor(index);
		var analyser = getAnalyser(tag, index);
		if (analyser)
			ret.set_float(analyser.peak);
		else
			ret.set_float(0);
	};
	Exps.prototype.AnalyserRMSLevel = function (ret, tag, index)
	{
		tag = tag.toLowerCase();
		index = Math.floor(index);
		var analyser = getAnalyser(tag, index);
		if (analyser)
			ret.set_float(analyser.rms);
		else
			ret.set_float(0);
	};
	Exps.prototype.SampleRate = function (ret)
	{
		ret.set_int(context ? context.sampleRate : 0);
	};
	Exps.prototype.CurrentTime = function (ret)
	{
		ret.set_float(context ? context.currentTime : cr.performance_now());
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Browser = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Browser.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		window.addEventListener("resize", function () {
			self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnResize, self);
		});
		if (typeof navigator.onLine !== "undefined")
		{
			window.addEventListener("online", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOnline, self);
			});
			window.addEventListener("offline", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOffline, self);
			});
		}
		if (typeof window.applicationCache !== "undefined")
		{
			window.applicationCache.addEventListener('updateready', function() {
				self.runtime.loadingprogress = 1;
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateReady, self);
			});
			window.applicationCache.addEventListener('progress', function(e) {
				self.runtime.loadingprogress = (e["loaded"] / e["total"]) || 0;
			});
		}
		if (!this.runtime.isDirectCanvas)
		{
			document.addEventListener("appMobi.device.update.available", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateReady, self);
			});
			document.addEventListener("backbutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
			});
			document.addEventListener("menubutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnMenuButton, self);
			});
			document.addEventListener("searchbutton", function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnSearchButton, self);
			});
			document.addEventListener("tizenhwkey", function (e) {
				var ret;
				switch (e["keyName"]) {
				case "back":
					ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
					if (!ret)
					{
						if (window["tizen"])
							window["tizen"]["application"]["getCurrentApplication"]()["exit"]();
					}
					break;
				case "menu":
					ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnMenuButton, self);
					if (!ret)
						e.preventDefault();
					break;
				}
			});
		}
		if (this.runtime.isWindows10 && typeof Windows !== "undefined")
		{
			Windows["UI"]["Core"]["SystemNavigationManager"]["getForCurrentView"]().addEventListener("backrequested", function (e)
			{
				var ret = self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
				if (ret)
					e.handled = true;
		    });
		}
		else if (this.runtime.isWinJS && WinJS["Application"])
		{
			WinJS["Application"]["onbackclick"] = function (e)
			{
				return !!self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnBackButton, self);
			};
		}
		this.runtime.addSuspendCallback(function(s) {
			if (s)
			{
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnPageHidden, self);
			}
			else
			{
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnPageVisible, self);
			}
		});
		this.is_arcade = (typeof window["is_scirra_arcade"] !== "undefined");
	};
	var batteryManager = null;
	var loadedBatteryManager = false;
	function maybeLoadBatteryManager()
	{
		if (loadedBatteryManager)
			return;
		if (!navigator["getBattery"])
			return;
		var promise = navigator["getBattery"]();
		loadedBatteryManager = true;
		if (promise)
		{
			promise.then(function (manager) {
				batteryManager = manager;
			});
		}
	};
	function Cnds() {};
	Cnds.prototype.CookiesEnabled = function()
	{
		return navigator ? navigator.cookieEnabled : false;
	};
	Cnds.prototype.IsOnline = function()
	{
		return navigator ? navigator.onLine : false;
	};
	Cnds.prototype.HasJava = function()
	{
		return navigator ? navigator.javaEnabled() : false;
	};
	Cnds.prototype.OnOnline = function()
	{
		return true;
	};
	Cnds.prototype.OnOffline = function()
	{
		return true;
	};
	Cnds.prototype.IsDownloadingUpdate = function ()
	{
		if (typeof window["applicationCache"] === "undefined")
			return false;
		else
			return window["applicationCache"]["status"] === window["applicationCache"]["DOWNLOADING"];
	};
	Cnds.prototype.OnUpdateReady = function ()
	{
		return true;
	};
	Cnds.prototype.PageVisible = function ()
	{
		return !this.runtime.isSuspended;
	};
	Cnds.prototype.OnPageVisible = function ()
	{
		return true;
	};
	Cnds.prototype.OnPageHidden = function ()
	{
		return true;
	};
	Cnds.prototype.OnResize = function ()
	{
		return true;
	};
	Cnds.prototype.IsFullscreen = function ()
	{
		return !!(document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
	};
	Cnds.prototype.OnBackButton = function ()
	{
		return true;
	};
	Cnds.prototype.OnMenuButton = function ()
	{
		return true;
	};
	Cnds.prototype.OnSearchButton = function ()
	{
		return true;
	};
	Cnds.prototype.IsMetered = function ()
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			return false;
		return !!connection["metered"];
	};
	Cnds.prototype.IsCharging = function ()
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			return !!battery["charging"]
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				return !!batteryManager["charging"];
			}
			else
			{
				return true;		// if unknown, default to charging (powered)
			}
		}
	};
	Cnds.prototype.IsPortraitLandscape = function (p)
	{
		var current = (window.innerWidth <= window.innerHeight ? 0 : 1);
		return current === p;
	};
	Cnds.prototype.SupportsFullscreen = function ()
	{
		if (this.runtime.isNodeWebkit)
			return true;
		var elem = this.runtime.canvasdiv || this.runtime.canvas;
		return !!(elem["requestFullscreen"] || elem["mozRequestFullScreen"] || elem["msRequestFullscreen"] || elem["webkitRequestFullScreen"]);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Alert = function (msg)
	{
		if (!this.runtime.isDomFree)
			alert(msg.toString());
	};
	Acts.prototype.Close = function ()
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["forceToFinish"]();
		else if (window["tizen"])
			window["tizen"]["application"]["getCurrentApplication"]()["exit"]();
		else if (navigator["app"] && navigator["app"]["exitApp"])
			navigator["app"]["exitApp"]();
		else if (navigator["device"] && navigator["device"]["exitApp"])
			navigator["device"]["exitApp"]();
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.close();
	};
	Acts.prototype.Focus = function ()
	{
		if (this.runtime.isNodeWebkit)
		{
			var win = window["nwgui"]["Window"]["get"]();
			win["focus"]();
		}
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.focus();
	};
	Acts.prototype.Blur = function ()
	{
		if (this.runtime.isNodeWebkit)
		{
			var win = window["nwgui"]["Window"]["get"]();
			win["blur"]();
		}
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.blur();
	};
	Acts.prototype.GoBack = function ()
	{
		if (navigator["app"] && navigator["app"]["backHistory"])
			navigator["app"]["backHistory"]();
		else if (!this.is_arcade && !this.runtime.isDomFree && window.back)
			window.back();
	};
	Acts.prototype.GoForward = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree && window.forward)
			window.forward();
	};
	Acts.prototype.GoHome = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree && window.home)
			window.home();
	};
	Acts.prototype.GoToURL = function (url, target)
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["openURL"](url);
		else if (this.runtime.isEjecta)
			ejecta["openURL"](url);
		else if (this.runtime.isWinJS)
			Windows["System"]["Launcher"]["launchUriAsync"](new Windows["Foundation"]["Uri"](url));
		else if (navigator["app"] && navigator["app"]["loadUrl"])
			navigator["app"]["loadUrl"](url, { "openExternal": true });
		else if (this.runtime.isCordova)
			window.open(url, "_system");
		else if (!this.is_arcade && !this.runtime.isDomFree)
		{
			if (target === 2 && !this.is_arcade)		// top
				window.top.location = url;
			else if (target === 1 && !this.is_arcade)	// parent
				window.parent.location = url;
			else					// self
				window.location = url;
		}
	};
	Acts.prototype.GoToURLWindow = function (url, tag)
	{
		if (this.runtime.isCocoonJs)
			CocoonJS["App"]["openURL"](url);
		else if (this.runtime.isEjecta)
			ejecta["openURL"](url);
		else if (this.runtime.isWinJS)
			Windows["System"]["Launcher"]["launchUriAsync"](new Windows["Foundation"]["Uri"](url));
		else if (navigator["app"] && navigator["app"]["loadUrl"])
			navigator["app"]["loadUrl"](url, { "openExternal": true });
		else if (this.runtime.isCordova)
			window.open(url, "_system");
		else if (!this.is_arcade && !this.runtime.isDomFree)
			window.open(url, tag);
	};
	Acts.prototype.Reload = function ()
	{
		if (!this.is_arcade && !this.runtime.isDomFree)
			window.location.reload();
	};
	var firstRequestFullscreen = true;
	var crruntime = null;
	function onFullscreenError(e)
	{
		if (console && console.warn)
			console.warn("Fullscreen request failed: ", e);
		crruntime["setSize"](window.innerWidth, window.innerHeight);
	};
	Acts.prototype.RequestFullScreen = function (stretchmode)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Requesting fullscreen is not supported on this platform - the request has been ignored");
			return;
		}
		if (stretchmode >= 2)
			stretchmode += 1;
		if (stretchmode === 6)
			stretchmode = 2;
		if (this.runtime.isNodeWebkit)
		{
			if (this.runtime.isDebug)
			{
				debuggerFullscreen(true);
			}
			else if (!this.runtime.isNodeFullscreen && window["nwgui"])
			{
				window["nwgui"]["Window"]["get"]()["enterFullscreen"]();
				this.runtime.isNodeFullscreen = true;
				this.runtime.fullscreen_scaling = (stretchmode >= 2 ? stretchmode : 0);
			}
		}
		else
		{
			if (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || document["fullScreenElement"])
			{
				return;
			}
			this.runtime.fullscreen_scaling = (stretchmode >= 2 ? stretchmode : 0);
			var elem = this.runtime.canvasdiv || this.runtime.canvas;
			if (firstRequestFullscreen)
			{
				firstRequestFullscreen = false;
				crruntime = this.runtime;
				elem.addEventListener("mozfullscreenerror", onFullscreenError);
				elem.addEventListener("webkitfullscreenerror", onFullscreenError);
				elem.addEventListener("MSFullscreenError", onFullscreenError);
				elem.addEventListener("fullscreenerror", onFullscreenError);
			}
			if (elem["requestFullscreen"])
				elem["requestFullscreen"]();
			else if (elem["mozRequestFullScreen"])
				elem["mozRequestFullScreen"]();
			else if (elem["msRequestFullscreen"])
				elem["msRequestFullscreen"]();
			else if (elem["webkitRequestFullScreen"])
			{
				if (typeof Element !== "undefined" && typeof Element["ALLOW_KEYBOARD_INPUT"] !== "undefined")
					elem["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
				else
					elem["webkitRequestFullScreen"]();
			}
		}
	};
	Acts.prototype.CancelFullScreen = function ()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Exiting fullscreen is not supported on this platform - the request has been ignored");
			return;
		}
		if (this.runtime.isNodeWebkit)
		{
			if (this.runtime.isDebug)
			{
				debuggerFullscreen(false);
			}
			else if (this.runtime.isNodeFullscreen && window["nwgui"])
			{
				window["nwgui"]["Window"]["get"]()["leaveFullscreen"]();
				this.runtime.isNodeFullscreen = false;
			}
		}
		else
		{
			if (document["exitFullscreen"])
				document["exitFullscreen"]();
			else if (document["mozCancelFullScreen"])
				document["mozCancelFullScreen"]();
			else if (document["msExitFullscreen"])
				document["msExitFullscreen"]();
			else if (document["webkitCancelFullScreen"])
				document["webkitCancelFullScreen"]();
		}
	};
	Acts.prototype.Vibrate = function (pattern_)
	{
		try {
			var arr = pattern_.split(",");
			var i, len;
			for (i = 0, len = arr.length; i < len; i++)
			{
				arr[i] = parseInt(arr[i], 10);
			}
			if (navigator["vibrate"])
				navigator["vibrate"](arr);
			else if (navigator["mozVibrate"])
				navigator["mozVibrate"](arr);
			else if (navigator["webkitVibrate"])
				navigator["webkitVibrate"](arr);
			else if (navigator["msVibrate"])
				navigator["msVibrate"](arr);
		}
		catch (e) {}
	};
	Acts.prototype.InvokeDownload = function (url_, filename_)
	{
		var a = document.createElement("a");
		if (typeof a["download"] === "undefined")
		{
			window.open(url_);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename_;
			a.href = url_;
			a["download"] = filename_;
			body.appendChild(a);
			var clickEvent = new MouseEvent("click");
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	Acts.prototype.InvokeDownloadString = function (str_, mimetype_, filename_)
	{
		var datauri = "data:" + mimetype_ + "," + encodeURIComponent(str_);
		var a = document.createElement("a");
		if (typeof a["download"] === "undefined")
		{
			window.open(datauri);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename_;
			a.href = datauri;
			a["download"] = filename_;
			body.appendChild(a);
			var clickEvent = new MouseEvent("click");
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	Acts.prototype.ConsoleLog = function (type_, msg_)
	{
		if (typeof console === "undefined")
			return;
		if (type_ === 0 && console.log)
			console.log(msg_.toString());
		if (type_ === 1 && console.warn)
			console.warn(msg_.toString());
		if (type_ === 2 && console.error)
			console.error(msg_.toString());
	};
	Acts.prototype.ConsoleGroup = function (name_)
	{
		if (console && console.group)
			console.group(name_);
	};
	Acts.prototype.ConsoleGroupEnd = function ()
	{
		if (console && console.groupEnd)
			console.groupEnd();
	};
	Acts.prototype.ExecJs = function (js_)
	{
		try {
			if (eval)
				eval(js_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error executing Javascript: ", e);
		}
	};
	var orientations = [
		"portrait",
		"landscape",
		"portrait-primary",
		"portrait-secondary",
		"landscape-primary",
		"landscape-secondary"
	];
	Acts.prototype.LockOrientation = function (o)
	{
		o = Math.floor(o);
		if (o < 0 || o >= orientations.length)
			return;
		this.runtime.autoLockOrientation = false;
		var orientation = orientations[o];
		if (screen["orientation"] && screen["orientation"]["lock"])
			screen["orientation"]["lock"](orientation);
		else if (screen["lockOrientation"])
			screen["lockOrientation"](orientation);
		else if (screen["webkitLockOrientation"])
			screen["webkitLockOrientation"](orientation);
		else if (screen["mozLockOrientation"])
			screen["mozLockOrientation"](orientation);
		else if (screen["msLockOrientation"])
			screen["msLockOrientation"](orientation);
	};
	Acts.prototype.UnlockOrientation = function ()
	{
		this.runtime.autoLockOrientation = false;
		if (screen["orientation"] && screen["orientation"]["unlock"])
			screen["orientation"]["unlock"]();
		else if (screen["unlockOrientation"])
			screen["unlockOrientation"]();
		else if (screen["webkitUnlockOrientation"])
			screen["webkitUnlockOrientation"]();
		else if (screen["mozUnlockOrientation"])
			screen["mozUnlockOrientation"]();
		else if (screen["msUnlockOrientation"])
			screen["msUnlockOrientation"]();
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.URL = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.toString());
	};
	Exps.prototype.Protocol = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.protocol);
	};
	Exps.prototype.Domain = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.hostname);
	};
	Exps.prototype.PathName = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.pathname);
	};
	Exps.prototype.Hash = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.hash);
	};
	Exps.prototype.Referrer = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : document.referrer);
	};
	Exps.prototype.Title = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : document.title);
	};
	Exps.prototype.Name = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.appName);
	};
	Exps.prototype.Version = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.appVersion);
	};
	Exps.prototype.Language = function (ret)
	{
		if (navigator && navigator.language)
			ret.set_string(navigator.language);
		else
			ret.set_string("");
	};
	Exps.prototype.Platform = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.platform);
	};
	Exps.prototype.Product = function (ret)
	{
		if (navigator && navigator.product)
			ret.set_string(navigator.product);
		else
			ret.set_string("");
	};
	Exps.prototype.Vendor = function (ret)
	{
		if (navigator && navigator.vendor)
			ret.set_string(navigator.vendor);
		else
			ret.set_string("");
	};
	Exps.prototype.UserAgent = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : navigator.userAgent);
	};
	Exps.prototype.QueryString = function (ret)
	{
		ret.set_string(this.runtime.isDomFree ? "" : window.location.search);
	};
	Exps.prototype.QueryParam = function (ret, paramname)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		var match = RegExp('[?&]' + paramname + '=([^&]*)').exec(window.location.search);
		if (match)
			ret.set_string(decodeURIComponent(match[1].replace(/\+/g, ' ')));
		else
			ret.set_string("");
	};
	Exps.prototype.Bandwidth = function (ret)
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			ret.set_float(Number.POSITIVE_INFINITY);
		else
		{
			if (typeof connection["bandwidth"] !== "undefined")
				ret.set_float(connection["bandwidth"]);
			else if (typeof connection["downlinkMax"] !== "undefined")
				ret.set_float(connection["downlinkMax"]);
			else
				ret.set_float(Number.POSITIVE_INFINITY);
		}
	};
	Exps.prototype.ConnectionType = function (ret)
	{
		var connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
		if (!connection)
			ret.set_string("unknown");
		else
		{
			ret.set_string(connection["type"] || "unknown");
		}
	};
	Exps.prototype.BatteryLevel = function (ret)
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			ret.set_float(battery["level"]);
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				ret.set_float(batteryManager["level"]);
			}
			else
			{
				ret.set_float(1);		// not supported/unknown: assume charged
			}
		}
	};
	Exps.prototype.BatteryTimeLeft = function (ret)
	{
		var battery = navigator["battery"] || navigator["mozBattery"] || navigator["webkitBattery"];
		if (battery)
		{
			ret.set_float(battery["dischargingTime"]);
		}
		else
		{
			maybeLoadBatteryManager();
			if (batteryManager)
			{
				ret.set_float(batteryManager["dischargingTime"]);
			}
			else
			{
				ret.set_float(Number.POSITIVE_INFINITY);		// not supported/unknown: assume infinite time left
			}
		}
	};
	Exps.prototype.ExecJS = function (ret, js_)
	{
		if (!eval)
		{
			ret.set_any(0);
			return;
		}
		var result = 0;
		try {
			result = eval(js_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error executing Javascript: ", e);
		}
		if (typeof result === "number")
			ret.set_any(result);
		else if (typeof result === "string")
			ret.set_any(result);
		else if (typeof result === "boolean")
			ret.set_any(result ? 1 : 0);
		else
			ret.set_any(0);
	};
	Exps.prototype.ScreenWidth = function (ret)
	{
		ret.set_int(screen.width);
	};
	Exps.prototype.ScreenHeight = function (ret)
	{
		ret.set_int(screen.height);
	};
	Exps.prototype.DevicePixelRatio = function (ret)
	{
		ret.set_float(this.runtime.devicePixelRatio);
	};
	Exps.prototype.WindowInnerWidth = function (ret)
	{
		ret.set_int(window.innerWidth);
	};
	Exps.prototype.WindowInnerHeight = function (ret)
	{
		ret.set_int(window.innerHeight);
	};
	Exps.prototype.WindowOuterWidth = function (ret)
	{
		ret.set_int(window.outerWidth);
	};
	Exps.prototype.WindowOuterHeight = function (ret)
	{
		ret.set_int(window.outerHeight);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Button = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Button.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Button plugin not supported on this platform - the object will not be created");
			return;
		}
		this.isCheckbox = (this.properties[0] === 1);
		this.inputElem = document.createElement("input");
		if (this.isCheckbox)
			this.elem = document.createElement("label");
		else
			this.elem = this.inputElem;
		this.labelText = null;
		this.inputElem.type = (this.isCheckbox ? "checkbox" : "button");
		this.inputElem.id = this.properties[6];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		if (this.isCheckbox)
		{
			jQuery(this.inputElem).appendTo(this.elem);
			this.labelText = document.createTextNode(this.properties[1]);
			jQuery(this.elem).append(this.labelText);
			this.inputElem.checked = (this.properties[7] !== 0);
			jQuery(this.elem).css("font-family", "sans-serif");
			jQuery(this.elem).css("display", "inline-block");
			jQuery(this.elem).css("color", "black");
		}
		else
			this.inputElem.value = this.properties[1];
		this.elem.title = this.properties[2];
		this.inputElem.disabled = (this.properties[4] === 0);
		this.autoFontSize = (this.properties[5] !== 0);
		this.element_hidden = false;
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}
		this.inputElem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.Button.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).keydown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).keyup(function (e) {
			e.stopPropagation();
		});
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"tooltip": this.elem.title,
			"disabled": !!this.inputElem.disabled
		};
		if (this.isCheckbox)
		{
			o["checked"] = !!this.inputElem.checked;
			o["text"] = this.labelText.nodeValue;
		}
		else
		{
			o["text"] = this.elem.value;
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.inputElem.disabled = o["disabled"];
		if (this.isCheckbox)
		{
			this.inputElem.checked = o["checked"];
			this.labelText.nodeValue = o["text"];
		}
		else
		{
			this.elem.value = o["text"];
		}
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	var last_canvas_offset = null;
	var last_checked_tick = -1;
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			this.element_hidden = true;
			return;
		}
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			return;
		}
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function(glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	Cnds.prototype.IsChecked = function ()
	{
		return this.isCheckbox && this.inputElem.checked;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		if (this.isCheckbox)
			this.labelText.nodeValue = text;
		else
			this.elem.value = text;
	};
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.title = text;
	};
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		this.visible = (vis !== 0);
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		this.inputElem.disabled = (en === 0);
	};
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.inputElem.focus();
	};
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.inputElem.blur();
	};
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).css(p, v);
	};
	Acts.prototype.SetChecked = function (c)
	{
		if (this.runtime.isDomFree || !this.isCheckbox)
			return;
		this.inputElem.checked = (c === 1);
	};
	Acts.prototype.ToggleChecked = function ()
	{
		if (this.runtime.isDomFree || !this.isCheckbox)
			return;
		this.inputElem.checked = !this.inputElem.checked;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Dictionary = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Dictionary.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.dictionary = {};
		this.cur_key = "";		// current key in for-each loop
		this.key_count = 0;
	};
	instanceProto.saveToJSON = function ()
	{
		return this.dictionary;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.dictionary = o;
		this.key_count = 0;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
				this.key_count++;
		}
	};
	function Cnds() {};
	Cnds.prototype.CompareValue = function (key_, cmp_, value_)
	{
		return cr.do_cmp(this.dictionary[key_], cmp_, value_);
	};
	Cnds.prototype.ForEachKey = function ()
	{
		var current_event = this.runtime.getCurrentEventStack().current_event;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
			{
				this.cur_key = p;
				this.runtime.pushCopySol(current_event.solModifiers);
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		this.cur_key = "";
		return false;
	};
	Cnds.prototype.CompareCurrentValue = function (cmp_, value_)
	{
		return cr.do_cmp(this.dictionary[this.cur_key], cmp_, value_);
	};
	Cnds.prototype.HasKey = function (key_)
	{
		return this.dictionary.hasOwnProperty(key_);
	};
	Cnds.prototype.IsEmpty = function ()
	{
		return this.key_count === 0;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.AddKey = function (key_, value_)
	{
		if (!this.dictionary.hasOwnProperty(key_))
			this.key_count++;
		this.dictionary[key_] = value_;
	};
	Acts.prototype.SetKey = function (key_, value_)
	{
		if (this.dictionary.hasOwnProperty(key_))
			this.dictionary[key_] = value_;
	};
	Acts.prototype.DeleteKey = function (key_)
	{
		if (this.dictionary.hasOwnProperty(key_))
		{
			delete this.dictionary[key_];
			this.key_count--;
		}
	};
	Acts.prototype.Clear = function ()
	{
		cr.wipe(this.dictionary);		// avoid garbaging
		this.key_count = 0;
	};
	Acts.prototype.JSONLoad = function (json_)
	{
		var o;
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		if (!o["c2dictionary"])		// presumably not a c2dictionary object
			return;
		this.dictionary = o["data"];
		this.key_count = 0;
		for (var p in this.dictionary)
		{
			if (this.dictionary.hasOwnProperty(p))
				this.key_count++;
		}
	};
	Acts.prototype.JSONDownload = function (filename)
	{
		var a = document.createElement("a");
		if (typeof a.download === "undefined")
		{
			var str = 'data:text/html,' + encodeURIComponent("<p><a download='data.json' href=\"data:application/json,"
				+ encodeURIComponent(JSON.stringify({
						"c2dictionary": true,
						"data": this.dictionary
					}))
				+ "\">Download link</a></p>");
			window.open(str);
		}
		else
		{
			var body = document.getElementsByTagName("body")[0];
			a.textContent = filename;
			a.href = "data:application/json," + encodeURIComponent(JSON.stringify({
						"c2dictionary": true,
						"data": this.dictionary
					}));
			a.download = filename;
			body.appendChild(a);
			var clickEvent = document.createEvent("MouseEvent");
			clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(clickEvent);
			body.removeChild(a);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Get = function (ret, key_)
	{
		if (this.dictionary.hasOwnProperty(key_))
			ret.set_any(this.dictionary[key_]);
		else
			ret.set_int(0);
	};
	Exps.prototype.KeyCount = function (ret)
	{
		ret.set_int(this.key_count);
	};
	Exps.prototype.CurrentKey = function (ret)
	{
		ret.set_string(this.cur_key);
	};
	Exps.prototype.CurrentValue = function (ret)
	{
		if (this.dictionary.hasOwnProperty(this.cur_key))
			ret.set_any(this.dictionary[this.cur_key]);
		else
			ret.set_int(0);
	};
	Exps.prototype.AsJSON = function (ret)
	{
		ret.set_string(JSON.stringify({
			"c2dictionary": true,
			"data": this.dictionary
		}));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Function = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Function.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var funcStack = [];
	var funcStackPtr = -1;
	var isInPreview = false;	// set in onCreate
	function FuncStackEntry()
	{
		this.name = "";
		this.retVal = 0;
		this.params = [];
	};
	function pushFuncStack()
	{
		funcStackPtr++;
		if (funcStackPtr === funcStack.length)
			funcStack.push(new FuncStackEntry());
		return funcStack[funcStackPtr];
	};
	function getCurrentFuncStack()
	{
		if (funcStackPtr < 0)
			return null;
		return funcStack[funcStackPtr];
	};
	function getOneAboveFuncStack()
	{
		if (!funcStack.length)
			return null;
		var i = funcStackPtr + 1;
		if (i >= funcStack.length)
			i = funcStack.length - 1;
		return funcStack[i];
	};
	function popFuncStack()
	{
;
		funcStackPtr--;
	};
	instanceProto.onCreate = function()
	{
		isInPreview = (typeof cr_is_preview !== "undefined");
		var self = this;
		window["c2_callFunction"] = function (name_, params_)
		{
			var i, len, v;
			var fs = pushFuncStack();
			fs.name = name_.toLowerCase();
			fs.retVal = 0;
			if (params_)
			{
				fs.params.length = params_.length;
				for (i = 0, len = params_.length; i < len; ++i)
				{
					v = params_[i];
					if (typeof v === "number" || typeof v === "string")
						fs.params[i] = v;
					else if (typeof v === "boolean")
						fs.params[i] = (v ? 1 : 0);
					else
						fs.params[i] = 0;
				}
			}
			else
			{
				cr.clearArray(fs.params);
			}
			self.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, self, fs.name);
			popFuncStack();
			return fs.retVal;
		};
	};
	function Cnds() {};
	Cnds.prototype.OnFunction = function (name_)
	{
		var fs = getCurrentFuncStack();
		if (!fs)
			return false;
		return cr.equals_nocase(name_, fs.name);
	};
	Cnds.prototype.CompareParam = function (index_, cmp_, value_)
	{
		var fs = getCurrentFuncStack();
		if (!fs)
			return false;
		index_ = cr.floor(index_);
		if (index_ < 0 || index_ >= fs.params.length)
			return false;
		return cr.do_cmp(fs.params[index_], cmp_, value_);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.CallFunction = function (name_, params_)
	{
		var fs = pushFuncStack();
		fs.name = name_.toLowerCase();
		fs.retVal = 0;
		cr.shallowAssignArray(fs.params, params_);
		var ran = this.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, this, fs.name);
		if (isInPreview && !ran)
		{
;
		}
		popFuncStack();
	};
	Acts.prototype.SetReturnValue = function (value_)
	{
		var fs = getCurrentFuncStack();
		if (fs)
			fs.retVal = value_;
		else
;
	};
	Acts.prototype.CallExpression = function (unused)
	{
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ReturnValue = function (ret)
	{
		var fs = getOneAboveFuncStack();
		if (fs)
			ret.set_any(fs.retVal);
		else
			ret.set_int(0);
	};
	Exps.prototype.ParamCount = function (ret)
	{
		var fs = getCurrentFuncStack();
		if (fs)
			ret.set_int(fs.params.length);
		else
		{
;
			ret.set_int(0);
		}
	};
	Exps.prototype.Param = function (ret, index_)
	{
		index_ = cr.floor(index_);
		var fs = getCurrentFuncStack();
		if (fs)
		{
			if (index_ >= 0 && index_ < fs.params.length)
			{
				ret.set_any(fs.params[index_]);
			}
			else
			{
;
				ret.set_int(0);
			}
		}
		else
		{
;
			ret.set_int(0);
		}
	};
	Exps.prototype.Call = function (ret, name_)
	{
		var fs = pushFuncStack();
		fs.name = name_.toLowerCase();
		fs.retVal = 0;
		cr.clearArray(fs.params);
		var i, len;
		for (i = 2, len = arguments.length; i < len; i++)
			fs.params.push(arguments[i]);
		var ran = this.runtime.trigger(cr.plugins_.Function.prototype.cnds.OnFunction, this, fs.name);
		if (isInPreview && !ran)
		{
;
		}
		popFuncStack();
		ret.set_any(fs.retVal);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Keyboard = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Keyboard.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.keyMap = new Array(256);	// stores key up/down state
		this.usedKeys = new Array(256);
		this.triggerKey = 0;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				function(info) {
					self.onKeyDown(info);
				}
			);
			jQuery(document).keyup(
				function(info) {
					self.onKeyUp(info);
				}
			);
		}
	};
	var keysToBlockWhenFramed = [32, 33, 34, 35, 36, 37, 38, 39, 40, 44];
	instanceProto.onKeyDown = function (info)
	{
		var alreadyPreventedDefault = false;
		if (window != window.top && keysToBlockWhenFramed.indexOf(info.which) > -1)
		{
			info.preventDefault();
			alreadyPreventedDefault = true;
			info.stopPropagation();
		}
		if (this.keyMap[info.which])
		{
			if (this.usedKeys[info.which] && !alreadyPreventedDefault)
				info.preventDefault();
			return;
		}
		this.keyMap[info.which] = true;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKey, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKey, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCode, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2)
		{
			this.usedKeys[info.which] = true;
			if (!alreadyPreventedDefault)
				info.preventDefault();
		}
	};
	instanceProto.onKeyUp = function (info)
	{
		this.keyMap[info.which] = false;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2 || this.usedKeys[info.which])
		{
			this.usedKeys[info.which] = true;
			info.preventDefault();
		}
	};
	instanceProto.onWindowBlur = function ()
	{
		var i;
		for (i = 0; i < 256; ++i)
		{
			if (!this.keyMap[i])
				continue;		// key already up
			this.keyMap[i] = false;
			this.triggerKey = i;
			this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
			var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
			var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
			if (eventRan || eventRan2)
				this.usedKeys[i] = true;
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return { "triggerKey": this.triggerKey };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.triggerKey = o["triggerKey"];
	};
	function Cnds() {};
	Cnds.prototype.IsKeyDown = function(key)
	{
		return this.keyMap[key];
	};
	Cnds.prototype.OnKey = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnAnyKey = function(key)
	{
		return true;
	};
	Cnds.prototype.OnAnyKeyReleased = function(key)
	{
		return true;
	};
	Cnds.prototype.OnKeyReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.IsKeyCodeDown = function(key)
	{
		key = Math.floor(key);
		if (key < 0 || key >= this.keyMap.length)
			return false;
		return this.keyMap[key];
	};
	Cnds.prototype.OnKeyCode = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnKeyCodeReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastKeyCode = function (ret)
	{
		ret.set_int(this.triggerKey);
	};
	function fixedStringFromCharCode(kc)
	{
		kc = Math.floor(kc);
		switch (kc) {
		case 8:		return "backspace";
		case 9:		return "tab";
		case 13:	return "enter";
		case 16:	return "shift";
		case 17:	return "control";
		case 18:	return "alt";
		case 19:	return "pause";
		case 20:	return "capslock";
		case 27:	return "esc";
		case 33:	return "pageup";
		case 34:	return "pagedown";
		case 35:	return "end";
		case 36:	return "home";
		case 37:	return "←";
		case 38:	return "↑";
		case 39:	return "→";
		case 40:	return "↓";
		case 45:	return "insert";
		case 46:	return "del";
		case 91:	return "left window key";
		case 92:	return "right window key";
		case 93:	return "select";
		case 96:	return "numpad 0";
		case 97:	return "numpad 1";
		case 98:	return "numpad 2";
		case 99:	return "numpad 3";
		case 100:	return "numpad 4";
		case 101:	return "numpad 5";
		case 102:	return "numpad 6";
		case 103:	return "numpad 7";
		case 104:	return "numpad 8";
		case 105:	return "numpad 9";
		case 106:	return "numpad *";
		case 107:	return "numpad +";
		case 109:	return "numpad -";
		case 110:	return "numpad .";
		case 111:	return "numpad /";
		case 112:	return "F1";
		case 113:	return "F2";
		case 114:	return "F3";
		case 115:	return "F4";
		case 116:	return "F5";
		case 117:	return "F6";
		case 118:	return "F7";
		case 119:	return "F8";
		case 120:	return "F9";
		case 121:	return "F10";
		case 122:	return "F11";
		case 123:	return "F12";
		case 144:	return "numlock";
		case 145:	return "scroll lock";
		case 186:	return ";";
		case 187:	return "=";
		case 188:	return ",";
		case 189:	return "-";
		case 190:	return ".";
		case 191:	return "/";
		case 192:	return "'";
		case 219:	return "[";
		case 220:	return "\\";
		case 221:	return "]";
		case 222:	return "#";
		case 223:	return "`";
		default:	return String.fromCharCode(kc);
		}
	};
	Exps.prototype.StringFromKeyCode = function (ret, kc)
	{
		ret.set_string(fixedStringFromCharCode(kc));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.List = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.List.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] List plugin not supported on this platform - the object will not be created");
			return;
		}
		this.elem = document.createElement("select");
		this.elem.id = this.properties[7];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem.title = this.properties[1];
		this.elem.disabled = (this.properties[3] === 0);
		if (this.properties[4] === 0)
			this.elem.size = 2;
		this.elem["multiple"] = (this.properties[5] !== 0);
		this.autoFontSize = (this.properties[6] !== 0);
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
		if (this.properties[0])
		{
			var itemsArr = this.properties[0].split(";");
			var i, len, o;
			for (i = 0, len = itemsArr.length; i < len; i++)
			{
				o = document.createElement("option");
				o.text = itemsArr[i];
				this.elem.add(o);
			}
		}
		var self = this;
		this.elem.onchange = function() {
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnSelectionChanged, self);
			};
		this.elem.onclick = function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		this.elem.ondblclick = function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.List.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.isVisible = true;
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"items": [],
			"sel": []
		};
		var i, len;
		var itemsarr = o["items"];
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			itemsarr.push(this.elem.options[i].text);
		}
		var selarr = o["sel"];
		if (this.elem["multiple"])
		{
			for (i = 0, len = this.elem.length; i < len; i++)
			{
				if (this.elem.options[i].selected)
					selarr.push(i);
			}
		}
		else
		{
			selarr.push(this.elem["selectedIndex"]);
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		var itemsarr = o["items"];
		while (this.elem.length)
			this.elem.remove(this.elem.length - 1);
		var i, len, opt;
		for (i = 0, len = itemsarr.length; i < len; i++)
		{
			opt = document.createElement("option");
			opt.text = itemsarr[i];
			this.elem.add(opt);
		}
		var selarr = o["sel"];
		if (this.elem["multiple"])
		{
			for (i = 0, len = selarr.length; i < len; i++)
			{
				if (selarr[i] < this.elem.length)
					this.elem.options[selarr[i]].selected = true;
			}
		}
		else if (selarr.length >= 1)
		{
			this.elem["selectedIndex"] = selarr[0];
		}
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
				return;
		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (this.isVisible)
				jQuery(this.elem).hide();
			this.isVisible = false;
			return;
		}
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (!this.isVisible)
			{
				jQuery(this.elem).show();
				this.isVisible = true;
			}
			return;
		}
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		if (!this.isVisible)
		{
			jQuery(this.elem).show();
			this.isVisible = true;
		}
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function(glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.CompareSelection = function (cmp_, x_)
	{
		return cr.do_cmp(this.elem["selectedIndex"], cmp_, x_);
	};
	Cnds.prototype.OnSelectionChanged = function ()
	{
		return true;
	};
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	Cnds.prototype.CompareSelectedText = function (x_, case_)
	{
		var selected_text = "";
		var i = this.elem["selectedIndex"];
		if (i < 0 || i >= this.elem.length)
			return false;
		selected_text = this.elem.options[i].text;
		if (case_)
			return selected_text == x_;
		else
			return cr.equals_nocase(selected_text, x_);
	};
	Cnds.prototype.CompareTextAt = function (i_, x_, case_)
	{
		var text = "";
		var i = Math.floor(i_);
		if (i < 0 || i >= this.elem.length)
			return false;
		text = this.elem.options[i].text;
		if (case_)
			return text == x_;
		else
			return cr.equals_nocase(text,x_);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Select = function (i)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem["selectedIndex"] = i;
	};
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.title = text;
	};
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		this.visible = (vis !== 0);
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.disabled = (en === 0);
	};
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.focus();
	};
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.blur();
	};
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).css(p, v);
	};
	Acts.prototype.AddItem = function (text_)
	{
		if (this.runtime.isDomFree)
			return;
		var o = document.createElement("option");
		o.text = text_;
		this.elem.add(o);
	};
	Acts.prototype.AddItemAt = function (index_, text_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		if (index_ < 0)
			index_ = 0;
		var o = document.createElement("option");
		o.text = text_;
		if (index_ >= this.elem.length)
			this.elem.add(o);
		else
		{
			this.elem.add(o, this.elem.options[index_]);
		}
	};
	Acts.prototype.Remove = function (index_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		this.elem.remove(index_);
	};
	Acts.prototype.SetItemText = function (index_, text_)
	{
		if (this.runtime.isDomFree)
			return;
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= this.elem.length)
			return;
		this.elem.options[index_].text = text_;
	};
	Acts.prototype.Clear = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.innerHTML = "";
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ItemCount = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.elem.length);
	};
	Exps.prototype.ItemTextAt = function (ret, i)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		i = Math.floor(i);
		if (i < 0 || i >= this.elem.length)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.options[i].text);
	};
	Exps.prototype.SelectedIndex = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		ret.set_int(this.elem["selectedIndex"]);
	};
	Exps.prototype.SelectedText = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		var i = this.elem["selectedIndex"];
		if (i < 0 || i >= this.elem.length)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.options[i].text);
	};
	Exps.prototype.SelectedCount = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		var i, len, count = 0;
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
				count++;
		}
		ret.set_int(count);
	};
	Exps.prototype.SelectedIndexAt = function (ret, index_)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_int(0);
			return;
		}
		index_ = Math.floor(index_);
		var i, len, count = 0, result = 0;
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
			{
				if (count === index_)
				{
					result = i;
					break;
				}
				count++;
			}
		}
		ret.set_int(result);
	};
	Exps.prototype.SelectedTextAt = function (ret, index_)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		index_ = Math.floor(index_);
		var i, len, count = 0, result = "";
		for (i = 0, len = this.elem.length; i < len; i++)
		{
			if (this.elem.options[i].selected)
			{
				if (count === index_)
				{
					result = this.elem.options[i].text;
					break;
				}
				count++;
			}
		}
		ret.set_string(result);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Multiplayer = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Multiplayer.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var isSupported = false;
	var serverlist = [];
	instanceProto.onCreate = function()
	{
		this.mp = null;
		isSupported = window["C2Multiplayer_IsSupported"]();
		if (isSupported && typeof window["C2Multiplayer"] !== "undefined")
			this.mp = new window["C2Multiplayer"]();
		this.signallingUrl = "";
		this.errorMsg = "";
		this.peerID = "";
		this.peerAlias = "";
		this.leaveReason = "";
		this.msgContent = "";
		this.msgTag = "";
		this.msgFromId = "";
		this.msgFromAlias = "";
		this.typeToRo = {};
		this.instToPeer = {};
		this.peerToInst = {};
		this.gameInstanceList = null;
		this.roomList = null;
		this.wakerWorker = null;
		this.inputPredictObjects = [];
		this.trackObjects = [];				// objects to keep a history for
		this.objectHistories = {};
		var self = this;
		if (isSupported)
		{
			this.mp["onserverlist"] = function (servers) {
				serverlist = servers;
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnServerList, self);
			};
			this.mp["onsignallingerror"] = function (e) {
				self.setError(e);
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingError, self);
			};
			this.mp["onsignallingclose"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingDisconnected, self);
				self.signallingUrl = "";
			};
			this.mp["onsignallingwelcome"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingConnected, self);
			};
			this.mp["onsignallinglogin"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingLoggedIn, self);
			};
			this.mp["onsignallingjoin"] = function (became_host) {
				self.instToPeer = {};
				self.peerToInst = {};
				self.trackObjects.length = 0;
				self.inputPredictObjects.length = 0;
				self.objectHistories = {};
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingJoinedRoom, self);
				if (self.runtime.isSuspended && became_host)
				{
					self.wakerWorker.postMessage("start");
				}
			};
			this.mp["onsignallingleave"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingLeftRoom, self);
			};
			this.mp["onsignallingkicked"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnSignallingKicked, self);
			};
			this.mp["onbeforeclientupdate"] = function () {
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnClientUpdate, self);
			};
			this.mp["onpeeropen"] = function (peer) {
				self.peerID = peer["id"];
				self.peerAlias = peer["alias"];
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnPeerConnected, self);
			};
			this.mp["onpeerclose"] = function (peer, reason) {
				self.peerID = peer["id"];
				self.peerAlias = peer["alias"];
				self.leaveReason = reason || "unknown";
				var inst = self.getAssociatedInstanceForPeer(peer);
				if (inst)
				{
					var ro = self.typeToRo[inst.type];
					if (ro)
						ro["removeObjectNid"](peer["nid"]);
					self.runtime.DestroyInstance(inst);
				}
				if (self.peerToInst.hasOwnProperty(peer["id"]))
					delete self.peerToInst[peer["id"]];
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnPeerDisconnected, self);
			};
			this.mp["onpeermessage"] = function (peer, o) {
				self.msgTag = o["t"];
				if (o["f"])
					self.msgFromId = o["f"];
				else
					self.msgFromId = peer["id"];
				self.msgFromAlias = self.mp["getAliasFromId"](self.msgFromId);
				self.msgContent = o["m"];
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnAnyPeerMessage, self);
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnPeerMessage, self);
			};
			this.mp["onsignallinginstancelist"] = function (list) {
				self.gameInstanceList = list;
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnGameInstanceList, self);
			};
			this.mp["onsignallingroomlist"] = function (list) {
				self.roomList = list;
				self.runtime.trigger(cr.plugins_.Multiplayer.prototype.cnds.OnRoomList, self);
			};
			this.mp["ongetobjectcount"] = function (obj) {
				return obj.instances.length;
			};
			this.mp["ongetobjectvalue"] = function (obj, index, nv) {
				if (!nv)
					return obj.instances[index].uid;
				var tag = nv["tag"];
				var inst = obj.instances[index];
				var value, peer;
				switch (tag) {
				case "x":
					return inst.x;
				case "y":
					return inst.y;
				case "a":
					return inst.angle;
				case "iv":
					if (nv["clientvaluetag"])
					{
						peer = self.instToPeer[inst.uid];
						if (peer && self.mp["me"] !== peer && !peer["wasRemoved"] && peer["hasClientState"](nv["clientvaluetag"]))
						{
							return peer["getInterpClientState"](nv["clientvaluetag"]);
						}
					}
					value = inst.instance_vars[nv["userdata"]];
					if (typeof value === "number")
						return value;
					else
						return 0;
				default:
					return 0;
				}
			};
			this.mp["oninstancedestroyed"] = function (ro, nid, timestamp)
			{
				var userdata = ro["userdata"];
				var instmap = userdata.instmap;		// map NID to C2 instance
				if (!userdata.deadmap)
					userdata.deadmap = {};
				var deadmap = userdata.deadmap;
				deadmap[nid] = timestamp;
				if (!instmap)
				{
					return;
				}
				if (instmap.hasOwnProperty(nid))
				{
					var inst = instmap[nid];
					if (inst)
					{
						self.runtime.DestroyInstance(inst);
					}
					delete instmap[nid];
				}
			};
			this.runtime.addDestroyCallback(function (inst)
			{
				var p;
				var uid = inst.uid;
				if (self.instToPeer.hasOwnProperty(uid))
					delete self.instToPeer[uid];
				for (p in self.peerToInst)
				{
					if (self.peerToInst.hasOwnProperty(p))
					{
						if (self.peerToInst[p] === inst)
						{
							delete self.peerToInst[p];
							break;
						}
					}
				}
				if (self.objectHistories.hasOwnProperty(uid))
					delete self.objectHistories[uid];
				var i = self.inputPredictObjects.indexOf(inst);
				if (i > -1)
					self.inputPredictObjects.splice(i, 1);
				i = self.trackObjects.indexOf(inst);
				if (i > -1)
					self.trackObjects.splice(i, 1);
				self.mp["removeObjectId"](uid);
			});
			this.wakerWorker = new Worker("waker.js");
			this.wakerWorker.addEventListener("message", function (e) {
				if (e.data === "tick" && self.runtime.isSuspended)
				{
					self.runtime.tick(true);
				}
			}, false);
			this.wakerWorker.postMessage("");
		}
		this.runtime.addSuspendCallback(function (s) {
			if (!isSupported || !self.mp["isHost"]())
				return;
			if (s)
			{
				self.wakerWorker.postMessage("start");
			}
			else
			{
				self.wakerWorker.postMessage("stop");
			}
		});
		this.runtime.pretickMe(this);
	};
	instanceProto.getAssociatedInstanceForPeer = function (peer)
	{
		var peer_id = peer["id"];
		if (this.peerToInst.hasOwnProperty(peer_id))
			return this.peerToInst[peer_id];
		else
			return null;
	};
	instanceProto.isInputPredicting = function (inst)
	{
		return this.inputPredictObjects.indexOf(inst) >= 0;
	};
	instanceProto.pretick = function ()
	{
		if (!isSupported)
			return;
		this.mp["tick"](this.runtime.dt1);
		this.trackObjectHistories();
		var i, len, ro;
		if (this.mp["isInRoom"]() && !this.mp["isHost"]())
		{
			for (i = 0, len = this.mp["registeredObjects"].length; i < len; ++i)
			{
				ro = this.mp["registeredObjects"][i];
				this.updateRegisteredObject(ro);
			}
		}
	};
	var netInstToRemove = [];
	instanceProto.updateRegisteredObject = function (ro)
	{
		ro["tick"]();
		var type = ro["obj"];
		var count = ro["getCount"]();
		var netvalues = ro["netvalues"];
		var userdata = ro["userdata"];
		if (!userdata.instmap)
			userdata.instmap = {};
		var instmap = userdata.instmap;		// map NID to C2 instance
		var deadmap = userdata.deadmap;
		var simTime = ro["simTime"];
		var i, netinst, nid, inst, peer, nv, iv, value, j, p, created, lenj = netvalues.length;
		var p;
		for (p in instmap)
		{
			if (instmap.hasOwnProperty(p))
			{
				inst = instmap[p];
				if (!this.runtime.getObjectByUID(inst.uid))
					delete instmap[p];
			}
		}
		if (deadmap)
		{
			for (p in deadmap)
			{
				if (deadmap.hasOwnProperty(p))
				{
					if (deadmap[p] < simTime - 3000)
						delete deadmap[p];
				}
			}
		}
		for (i = 0; i < count; ++i)
		{
			netinst = ro["getNetInstAt"](i);
			nid = netinst["nid"];
			if (deadmap && deadmap[nid] >= simTime - 3000)
			{
				netInstToRemove.push(netinst);
				if (instmap.hasOwnProperty(nid))
				{
					this.runtime.DestroyInstance(instmap[nid]);
					delete instmap[nid];
				}
				continue;
			}
			if (instmap.hasOwnProperty(nid))
			{
				inst = instmap[nid];
				created = false;
			}
			else
			{
				peer = this.mp["getPeerByNid"](nid);
				if (peer)
				{
					this.peerID = peer["id"];
					this.peerAlias = peer["alias"];
				}
				else
				{
					if (ro["hasOverriddenNids"])
					{
						continue;
					}
					this.peerID = "";
					this.peerAlias = "";
				}
				inst = this.runtime.createInstance(type, this.runtime.running_layout.layers[type.default_layerindex], -1000, -1000);
				instmap[nid] = inst;
				created = true;
			}
			if (netinst["isTimedOut"](simTime))
			{
				netInstToRemove.push(netinst);
				if (instmap.hasOwnProperty(nid))
					delete instmap[nid];
				this.runtime.DestroyInstance(inst);
				continue;
			}
			if (this.isInputPredicting(inst))
			{
				this.correctInputPrediction(inst, netinst, netvalues, simTime);
			}
			else
			{
				for (j = 0; j < lenj; ++j)
				{
					value = netinst["getInterp"](simTime, j);
					nv = netvalues[j];
					switch (nv["tag"]) {
					case "x":
						inst.x = value;
						inst.set_bbox_changed();
						break;
					case "y":
						inst.y = value;
						inst.set_bbox_changed();
						break;
					case "a":
						inst.angle = value;
						inst.set_bbox_changed();
						break;
					case "iv":
						iv = nv["userdata"];
						if (iv > inst.instance_vars.length || typeof inst.instance_vars[iv] !== "number")
							break;
						inst.instance_vars[iv] = value;
						break;
					}
				}
			}
			if (created)
			{
				this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
			}
		}
		for (i = 0, count = netInstToRemove.length; i < count; ++i)
		{
			ro["removeNetInstance"](netInstToRemove[i]);
		}
		netInstToRemove.length = 0;
	};
	instanceProto.trackObjectHistories = function ()
	{
		var hosttime = this.mp["getHostInputArrivalTime"]();
		var i, len;
		for (i = 0, len = this.trackObjects.length; i < len; ++i)
		{
			this.trackObjectHistory(this.trackObjects[i], hosttime);
		}
	};
	function ObjectHistory(inst_)
	{
		this.inst = inst_;
		this.history = [];
	};
	ObjectHistory.prototype.getLastDelta = function (tag, i)
	{
		if (this.history.length < 2)
			return 0;		// not yet enough data
		var from = this.history[this.history.length - 2];
		var to = this.history[this.history.length - 1];
		switch (tag) {
		case "x":
			return to.x - from.x;
		case "y":
			return to.y - from.y;
		case "a":
			return to.angle - from.angle;
		case "iv":
			return to.ivs[i] - from.ivs[i];
		}
		return 0;
	};
	ObjectHistory.prototype.getInterp = function (tag, index, time, interp)
	{
		var i, len, h;
		var prev = null;
		var next = null;
		for (i = 0, len = this.history.length; i < len; ++i)
		{
			h = this.history[i];
			if (h.timestamp < time)
				prev = h;
			else
			{
				if (i + 1 < this.history.length)
					next = this.history[i + 1];
				break;
			}
		}
		if (!prev)
			return (void 0);
		var prev_value = 0;
		switch (tag) {
		case "x":
			prev_value = prev.x;
			break;
		case "y":
			prev_value = prev.y;
			break;
		case "a":
			prev_value = prev.angle;
			break;
		case "iv":
			prev_value = prev.ivs[index];
			break;
		}
		if (!next)
			return prev_value;
		var next_value = prev_value;
		switch (tag) {
		case "x":
			next_value = next.x;
			break;
		case "y":
			next_value = next.y;
			break;
		case "a":
			next_value = next.angle;
			break;
		case "iv":
			next_value = next.ivs[index];
			break;
		}
		var x = cr.unlerp(prev.timestamp, next.timestamp, time);
		return window["interpNetValue"](interp, prev_value, next_value, x, false);
	};
	ObjectHistory.prototype.applyCorrection = function (tag, index, correction)
	{
		var i, len, h;
		for (i = 0, len = this.history.length; i < len; ++i)
		{
			h = this.history[i];
			switch (tag) {
			case "x":
				h.x += correction;
				break;
			case "y":
				h.y += correction;
				break;
			case "a":
				h.angle += correction;
				break;
			case "iv":
				h.ivs[index] += correction;
				break;
			}
		};
	};
	function ObjectHistoryEntry(oh_)
	{
		this.oh = oh_;
		this.timestamp = 0;
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.ivs = [];
	};
	var history_cache = [];
	function allocHistoryEntry(oh_)
	{
		var ret;
		if (history_cache.length)
		{
			ret = history_cache.pop();
			ret.oh = oh_;
			return ret;
		}
		else
			return new ObjectHistoryEntry(oh_);
	};
	function freeHistoryEntry(he)
	{
		he.ivs.length = 0;
		if (history_cache.length < 1000)
			history_cache.push(he);
	};
	instanceProto.trackObjectHistory = function (inst, hosttime)
	{
		if (!this.objectHistories.hasOwnProperty(inst.uid))
			this.objectHistories[inst.uid] = new ObjectHistory(inst);
		var oh = this.objectHistories[inst.uid];
		var he = allocHistoryEntry(oh);
		he.timestamp = hosttime;
		he.x = inst.x;
		he.y = inst.y;
		he.angle = inst.angle;
		cr.shallowAssignArray(he.ivs, inst.instance_vars);
		oh.history.push(he);
		while (oh.history.length > 0 && oh.history[0].timestamp <= (hosttime - 2000))
			freeHistoryEntry(oh.history.shift());
	};
	var clientXerror = 0;
	var clientYerror = 0;
	var hostX = 0;
	var hostY = 0;
	function linearCorrect(current, target, delta, position, isPlatformBehavior)
	{
		var diff = target - current;
		if (diff === 0)
			return 0;
		var abs_diff = cr.abs(diff);
		if (abs_diff <= cr.abs(delta / 10) || (position && (abs_diff < 1 || abs_diff >= 1000)))
			return diff;
		var minimum_correction = abs_diff / 50;
		if (isPlatformBehavior)
			minimum_correction = cr.max(minimum_correction, 1);
		var delta_correction = cr.abs(delta / 5);
		if (position && abs_diff >= 10)
		{
			minimum_correction = abs_diff / 10;
			delta_correction = cr.abs(delta / 2);
		}
		var abs_correction = cr.max(minimum_correction, delta_correction);
		if (abs_correction > abs_diff)
			abs_correction = abs_diff;
		if (diff > 0)
			return abs_correction;
		else
			return -abs_correction;
	};
	instanceProto.correctInputPrediction = function (inst, netinst, netvalues, simTime)
	{
		if (!this.objectHistories.hasOwnProperty(inst.uid))
			return;		// no data yet, leave as is
		var oh = this.objectHistories[inst.uid];
		var j, latestupdate, host_value, my_value, nv, diff, iv, tag, interp, userdata, correction;
		var lenj = netvalues.length;
		var position_delta = cr.distanceTo(0, 0, oh.getLastDelta("x"), oh.getLastDelta("y"));
		var isPlatformBehavior = !!inst.extra["isPlatformBehavior"];
		for (j = 0; j < lenj; ++j)
		{
			nv = netvalues[j];
			tag = nv["tag"];
			userdata = nv["userdata"];
			interp = nv["interp"];
			latestupdate = netinst["getLatestUpdate"]();
			if (!latestupdate)
				continue;		// no data from server
			host_value = latestupdate.data[j];
			my_value = oh.getInterp(tag, userdata, latestupdate.timestamp, interp);
			if (typeof my_value === "undefined")
				continue;		// no local history yet
			correction = 0;
			switch (tag) {
			case "x":
				correction = linearCorrect(my_value, host_value, position_delta, true, isPlatformBehavior);
				if (correction !== 0)
				{
					inst.x += correction;
					inst.set_bbox_changed();
				}
				clientXerror = host_value - my_value + correction;
				hostX = host_value;
				break;
			case "y":
				correction = linearCorrect(my_value, host_value, position_delta, true, isPlatformBehavior);
				if (correction !== 0)
				{
					inst.y += correction;
					inst.set_bbox_changed();
				}
				clientYerror = host_value - my_value + correction;
				hostY = host_value;
				break;
			case "a":
				correction = cr.anglelerp(my_value, host_value, 0.5) - my_value;
				if (correction !== 0)
				{
					inst.angle += correction;
					inst.set_bbox_changed();
				}
				break;
			case "iv":
				iv = userdata;
				if (iv > inst.instance_vars.length || typeof inst.instance_vars[iv] !== "number")
					break;
				if (!nv["clientvaluetag"])
					inst.instance_vars[iv] = netinst["getInterp"](simTime, j);
				break;
			}
			if (correction !== 0)
				oh.applyCorrection(tag, userdata, correction);
		}
	};
	instanceProto.setError = function (e)
	{
		if (!e)
			this.errorMsg = "unknown error";
		else if (typeof e === "string")
			this.errorMsg = e;
		else if (typeof e.message === "string")
			this.errorMsg = e;
		else if (typeof e.details === "string")
			this.errorMsg = e;
		else if (typeof e.data === "string")
			this.errorMsg = e;
		else
			this.errorMsg = e.toString();
	};
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
	};
	function Cnds() {};
	Cnds.prototype.OnServerList = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingError = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingConnected = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingDisconnected = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingLoggedIn = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingJoinedRoom = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingLeftRoom = function ()
	{
		return true;
	};
	Cnds.prototype.OnSignallingKicked = function ()
	{
		return true;
	};
	Cnds.prototype.OnPeerConnected = function ()
	{
		return true;
	};
	Cnds.prototype.OnPeerDisconnected = function ()
	{
		return true;
	};
	Cnds.prototype.SignallingIsConnected = function ()
	{
		return isSupported && this.mp["isConnected"]();
	};
	Cnds.prototype.SignallingIsLoggedIn = function ()
	{
		return isSupported && this.mp["isLoggedIn"]();
	};
	Cnds.prototype.SignallingIsInRoom = function ()
	{
		return isSupported && this.mp["isInRoom"]();
	};
	Cnds.prototype.IsHost = function ()
	{
		return isSupported && this.mp["isHost"]();
	};
	Cnds.prototype.IsSupported = function ()
	{
		return isSupported;
	};
	Cnds.prototype.OnPeerMessage = function (tag_)
	{
		return this.msgTag === tag_;
	};
	Cnds.prototype.OnAnyPeerMessage = function ()
	{
		return true;
	};
	Cnds.prototype.OnClientUpdate = function ()
	{
		return true;
	};
	Cnds.prototype.OnGameInstanceList = function ()
	{
		return true;
	};
	Cnds.prototype.OnRoomList = function ()
	{
		return true;
	};
	Cnds.prototype.IsReadyForInput = function ()
	{
		if (!isSupported)
			return false;
		return this.mp["isReadyForInput"]();
	};
	Cnds.prototype.ComparePeerCount = function (cmp_, x_)
	{
		var peercount = 0;
		if (isSupported)
			peercount = this.mp["getPeerCount"]();
		return cr.do_cmp(peercount, cmp_, x_);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.RequestServerList = function (url_)
	{
		if (!isSupported)
			return;
		this.mp["requestServerList"](url_);
	};
	Acts.prototype.SignallingConnect = function (url_)
	{
		if (!isSupported || this.mp["isConnected"]())
			return;
		this.signallingUrl = url_;
		this.mp["signallingConnect"](url_);
	};
	Acts.prototype.SignallingDisconnect = function ()
	{
		if (!isSupported || !this.mp["isConnected"]())
			return;
		this.mp["signallingDisconnect"]();
	};
	Acts.prototype.AddICEServer = function (url_, username_, credential_)
	{
		if (!isSupported)
			return;
		var o = {
			"urls": url_
		};
		if (username_)
			o["username"] = username_;
		if (credential_)
			o["credential"] = credential_;
		this.mp["mergeIceServerList"]([o]);
	};
	Acts.prototype.SignallingLogin = function (alias_)
	{
		if (!isSupported || !this.mp["isConnected"] || this.mp["isLoggedIn"]())
			return;
		this.mp["signallingLogin"](alias_);
	};
	Acts.prototype.SignallingJoinRoom = function (game_, instance_, room_, max_clients_)
	{
		if (!isSupported || !this.mp["isLoggedIn"]() || this.mp["isInRoom"]())
			return;
		this.mp["signallingJoinGameRoom"](game_, instance_, room_, max_clients_);
	};
	Acts.prototype.SignallingAutoJoinRoom = function (game_, instance_, room_, max_clients_, locking_)
	{
		if (!isSupported || !this.mp["isLoggedIn"]() || this.mp["isInRoom"]())
			return;
		this.mp["signallingAutoJoinGameRoom"](game_, instance_, room_, max_clients_, (locking_ === 0));
	};
	Acts.prototype.SignallingLeaveRoom = function ()
	{
		if (!isSupported || !this.mp["isInRoom"]())
			return;
		this.mp["signallingLeaveRoom"]();
	};
	Acts.prototype.DisconnectRoom = function ()
	{
		if (!isSupported)
			return;
		this.mp["disconnectRoom"](true);
	};
	function modeToDCType(mode_)
	{
		switch (mode_) {
		case 0:		// reliable ordered
			return "o";
		case 1:		// reliable unordered
			return "r";
		case 2:		// unreliable
			return "u";
		default:
			return "o";
		}
	};
	Acts.prototype.SendPeerMessage = function (peerid_, tag_, message_, mode_)
	{
		if (!isSupported)
			return;
		if (!peerid_)
			peerid_ = this.mp["getHostID"]();
		var peer = this.mp["getPeerById"](peerid_);
		if (!peer)
			return;
		peer["send"](modeToDCType(mode_), JSON.stringify({
			"c": "m",			// command: message
			"t": tag_,			// tag
			"m": message_		// content
		}));
	};
	Acts.prototype.HostBroadcastMessage = function (from_id_, tag_, message_, mode_)
	{
		if (!isSupported)
			return;
		var skip = this.mp["getPeerById"](from_id_);
		var o = {
			"c": "m",			// command: message
			"t": tag_,			// tag
			"f": (from_id_ || this.mp["getHostID"]()),
			"m": message_		// content
		};
		this.mp["hostBroadcast"](modeToDCType(mode_), JSON.stringify(o), skip);
	};
	Acts.prototype.SimulateLatency = function (latency_, pdv_, loss_)
	{
		if (!isSupported)
			return;
		this.mp["setLatencySimulation"](latency_ * 1000, pdv_ * 1000, loss_);
	};
	instanceProto.doSyncObject = function (type_, data_, precision_, bandwidth_)
	{
		if (!isSupported)
			return;
		var ro = this.mp["registerObject"](type_, type_.sid, bandwidth_);
		if (data_ === 1)		// position only
		{
			ro["addValue"](this.mp["INTERP_LINEAR"], precision_, "x");		// for x
			ro["addValue"](this.mp["INTERP_LINEAR"], precision_, "y");		// for y
		}
		else if (data_ === 2)	// angle only
		{
			ro["addValue"](this.mp["INTERP_ANGULAR"], precision_, "a");		// for angle
		}
		else if (data_ === 3)	// position and angle
		{
			ro["addValue"](this.mp["INTERP_LINEAR"], precision_, "x");		// for x
			ro["addValue"](this.mp["INTERP_LINEAR"], precision_, "y");		// for y
			ro["addValue"](this.mp["INTERP_ANGULAR"], precision_, "a");		// for angle
		}
		this.typeToRo[type_] = ro;
	};
	Acts.prototype.SyncObject = function (type_, data_, precision_, bandwidth_)
	{
		if (!isSupported)
			return;
		var i, len;
		if (type_.is_family)
		{
			for (i = 0, len = type_.members.length; i < len; ++i)
			{
				this.doSyncObject(type_.members[i], data_, precision_, bandwidth_);
			}
		}
		else
		{
			this.doSyncObject(type_, data_, precision_, bandwidth_);
		}
	};
	var prompted_bad_sync = false;
	instanceProto.doSyncObjectInstanceVar = function (type_, var_, precision_, interp_, clientvaluetag_)
	{
		if (!isSupported)
			return;
		var ro = this.typeToRo[type_];
		if (!ro)
		{
			return;
		}
		var ip = this.mp["INTERP_NONE"];
		if (interp_ === 1)		// linear interpolation
			ip = this.mp["INTERP_LINEAR"];
		else if (interp_ === 2)	// angular interpolation
			ip = this.mp["INTERP_ANGULAR"];
		ro["addValue"](ip, precision_, "iv", var_, clientvaluetag_);
	};
	Acts.prototype.SyncObjectInstanceVar = function (type_, var_, precision_, interp_, clientvaluetag_)
	{
		if (!isSupported)
			return;
		var i, len, t;
		if (type_.is_family)
		{
			for (i = 0, len = type_.members.length; i < len; ++i)
			{
				t = type_.members[i];
				this.doSyncObjectInstanceVar(t, var_ + t.family_var_map[type_.family_index], precision_, interp_, clientvaluetag_);
			}
		}
		else
		{
			this.doSyncObjectInstanceVar(type_, var_, precision_, interp_, clientvaluetag_);
		}
	};
	Acts.prototype.AssociateObjectWithPeer = function (type_, peerid_)
	{
		if (!isSupported)
			return;
		var inst = type_.getFirstPicked();
		if (!inst)
			return;
		var ro = this.typeToRo[type_];
		if (!ro)
			return;
		var peer = this.mp["getPeerById"](peerid_);
		if (!peer)
			return;
		if (this.mp["isHost"]())
		{
			ro["overrideNid"](inst.uid, peer["nid"]);
			if (this.trackObjects.indexOf(inst) === -1)		// only add if not already tracked
				this.trackObjects.push(inst);
		}
		this.instToPeer[inst.uid] = peer;
		this.peerToInst[peer["id"]] = inst;
	};
	Acts.prototype.SetClientState = function (tag, x)
	{
		if (!isSupported)
			return;
		this.mp["setClientState"](tag, x);
	};
	Acts.prototype.AddClientInputValue = function (tag, precision, interpolation)
	{
		if (!isSupported)
			return;
		this.mp["addClientInputValue"](tag, precision, interpolation);
	};
	Acts.prototype.InputPredictObject = function (obj)
	{
		if (!isSupported || !obj)
			return;
		if (this.mp["isHost"]())
			return;		// host mustn't input predict anything
		var inst = obj.getFirstPicked();
		if (!inst)
			return;
		if (this.inputPredictObjects.indexOf(inst) >= 0)
			return;		// already input predicted
		inst.extra["inputPredicted"] = true;
		this.trackObjects.push(inst);
		this.inputPredictObjects.push(inst);
	};
	Acts.prototype.SignallingRequestGameInstanceList = function (game_)
	{
		if (!isSupported)
			return;
		this.mp["signallingRequestGameInstanceList"](game_);
	};
	Acts.prototype.SignallingRequestRoomList = function (game_, instance_, which_)
	{
		if (!isSupported)
			return;
		var whichstr = "all";
		if (which_ === 1)
			whichstr = "unlocked";
		else if (which_ === 2)
			whichstr = "available";
		this.mp["signallingRequestRoomList"](game_, instance_, whichstr);
	};
	Acts.prototype.SetBandwidthProfile = function (profile)
	{
		if (!isSupported)
			return;
		var updateRate, delay;
		if (profile === 0)		// Internet
		{
			updateRate = 30;	// 30 Hz updates
			delay = 80;			// 80 ms buffer
		}
		else
		{
			updateRate = 60;	// 60 Hz updates
			delay = 40;			// 40ms buffer
		}
		this.mp["setBandwidthSettings"](updateRate, delay);
	};
	Acts.prototype.KickPeer = function (peerid_, reason_)
	{
		if (!isSupported)
			return;
		if (!this.mp["isHost"]())
			return;
		if (peerid_ === this.mp["getMyID"]())
			return;		// can't kick self
		var peer = this.mp["getPeerById"](peerid_);
		if (!peer)
			return;
		peer["remove"](reason_);
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ServerListCount = function (ret)
	{
		ret.set_int(serverlist.length);
	};
	Exps.prototype.ServerListURLAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= serverlist.length)
			ret.set_string("");
		else
			ret.set_string(serverlist[i]["url"]);
	};
	Exps.prototype.ServerListNameAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= serverlist.length)
			ret.set_string("");
		else
			ret.set_string(serverlist[i]["name"]);
	};
	Exps.prototype.ServerListOperatorAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= serverlist.length)
			ret.set_string("");
		else
			ret.set_string(serverlist[i]["operator"]);
	};
	Exps.prototype.ServerListWebsiteAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= serverlist.length)
			ret.set_string("");
		else
			ret.set_string(serverlist[i]["operator_website"]);
	};
	Exps.prototype.SignallingURL = function (ret)
	{
		ret.set_string(this.signallingUrl);
	};
	Exps.prototype.SignallingVersion = function (ret)
	{
		ret.set_string(isSupported ? this.mp["sigserv_version"] : "");
	};
	Exps.prototype.SignallingName = function (ret)
	{
		ret.set_string(isSupported ? this.mp["sigserv_name"] : "");
	};
	Exps.prototype.SignallingOperator = function (ret)
	{
		ret.set_string(isSupported ? this.mp["sigserv_operator"] : "");
	};
	Exps.prototype.SignallingMOTD = function (ret)
	{
		ret.set_string(isSupported ? this.mp["sigserv_motd"] : "");
	};
	Exps.prototype.MyAlias = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getMyAlias"]() : "");
	};
	Exps.prototype.CurrentGame = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getCurrentGame"]() : "");
	};
	Exps.prototype.CurrentInstance = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getCurrentGameInstance"]() : "");
	};
	Exps.prototype.CurrentRoom = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getCurrentRoom"]() : "");
	};
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMsg);
	};
	Exps.prototype.MyID = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getMyID"]() : "");
	};
	Exps.prototype.PeerID = function (ret)
	{
		ret.set_string(this.peerID);
	};
	Exps.prototype.PeerAlias = function (ret)
	{
		ret.set_string(this.peerAlias);
	};
	Exps.prototype.HostID = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getHostID"]() : "");
	};
	Exps.prototype.HostAlias = function (ret)
	{
		ret.set_string(isSupported ? this.mp["getHostAlias"]() : "");
	};
	Exps.prototype.Message = function (ret)
	{
		ret.set_string(this.msgContent);
	};
	Exps.prototype.Tag = function (ret)
	{
		ret.set_string(this.msgTag);
	};
	Exps.prototype.FromID = function (ret)
	{
		ret.set_string(this.msgFromId);
	};
	Exps.prototype.FromAlias = function (ret)
	{
		ret.set_string(this.msgFromAlias);
	};
	Exps.prototype.PeerAliasFromID = function (ret, id_)
	{
		ret.set_string(isSupported ? this.mp["getAliasFromId"](id_) : "");
	};
	Exps.prototype.PeerLatency = function (ret, id_)
	{
		if (!isSupported)
		{
			ret.set_float(0);
			return;
		}
		var peer = this.mp["getPeerById"](id_);
		ret.set_float(peer ? peer["latency"] : 0);
	};
	Exps.prototype.PeerPDV = function (ret, id_)
	{
		if (!isSupported)
		{
			ret.set_float(0);
			return;
		}
		var peer = this.mp["getPeerById"](id_);
		ret.set_float(peer ? peer["pdv"] : 0);
	};
	Exps.prototype.StatOutboundCount = function (ret)
	{
		ret.set_int(isSupported ? this.mp["stats"]["outboundPerSec"] : 0);
	};
	Exps.prototype.StatOutboundBandwidth = function (ret)
	{
		ret.set_int(isSupported ? this.mp["stats"]["outboundBandwidthPerSec"] : 0);
	};
	Exps.prototype.StatInboundCount = function (ret)
	{
		ret.set_int(isSupported ? this.mp["stats"]["inboundPerSec"] : 0);
	};
	Exps.prototype.StatInboundBandwidth = function (ret)
	{
		ret.set_int(isSupported ? this.mp["stats"]["inboundBandwidthPerSec"] : 0);
	};
	Exps.prototype.PeerState = function (ret, id_, tag_)
	{
		if (!isSupported)
		{
			ret.set_float(0);
			return;
		}
		var peer = this.mp["getPeerById"](id_);
		ret.set_float(peer ? peer["getInterpClientState"](tag_) : 0);
	};
	Exps.prototype.ClientXError = function (ret)
	{
		ret.set_float(clientXerror);
	};
	Exps.prototype.ClientYError = function (ret)
	{
		ret.set_float(clientYerror);
	};
	Exps.prototype.HostX = function (ret)
	{
		ret.set_float(hostX);
	};
	Exps.prototype.HostY = function (ret)
	{
		ret.set_float(hostY);
	};
	Exps.prototype.PeerCount = function (ret)
	{
		ret.set_int(isSupported ? this.mp["getPeerCount"]() : 0);
	};
	Exps.prototype.ListInstanceCount = function (ret)
	{
		if (this.gameInstanceList)
		{
			ret.set_int(this.gameInstanceList.length);
		}
		else
			ret.set_int(0);
	};
	Exps.prototype.ListInstanceName = function (ret, index)
	{
		index = Math.floor(index);
		if (this.gameInstanceList)
		{
			if (index < 0 || index >= this.gameInstanceList.length)
			{
				ret.set_string("");
			}
			else
				ret.set_string(this.gameInstanceList[index]["name"] || "");
		}
		else
			ret.set_string("");
	};
	Exps.prototype.ListInstancePeerCount = function (ret, index)
	{
		index = Math.floor(index);
		if (this.gameInstanceList)
		{
			if (index < 0 || index >= this.gameInstanceList.length)
			{
				ret.set_int(0);
			}
			else
				ret.set_int(this.gameInstanceList[index]["peercount"] || 0);
		}
		else
			ret.set_int(0);
	};
	Exps.prototype.ListRoomCount = function (ret)
	{
		ret.set_int(this.roomList ? this.roomList.length : 0);
	};
	function getListRoomAt(roomList, i)
	{
		if (!roomList)
			return null;
		i = Math.floor(i);
		if (i < 0 || i >= roomList.length)
			return null;
		return roomList[i];
	};
	Exps.prototype.ListRoomName = function (ret, index)
	{
		var r = getListRoomAt(this.roomList, index);
		ret.set_string(r ? r["name"] : "");
	};
	Exps.prototype.ListRoomPeerCount = function (ret, index)
	{
		var r = getListRoomAt(this.roomList, index);
		ret.set_int(r ? r["peercount"] : 0);
	};
	Exps.prototype.ListRoomMaxPeerCount = function (ret, index)
	{
		var r = getListRoomAt(this.roomList, index);
		ret.set_int(r ? r["maxpeercount"] : 0);
	};
	Exps.prototype.ListRoomState = function (ret, index)
	{
		var r = getListRoomAt(this.roomList, index);
		ret.set_string(r ? r["state"] : "");
	};
	Exps.prototype.LeaveReason = function (ret)
	{
		ret.set_string(this.leaveReason);
	};
	instanceProto.lagCompensate = function (movingPeerID, fromPeerID, tag, interp)
	{
		if (!isSupported)
			return 0;
		if (!this.mp["isHost"]())
			return 0;
		var movePeer = this.mp["getPeerById"](movingPeerID);
		if (!movePeer)
			return 0;
		var moveInst = this.getAssociatedInstanceForPeer(movePeer);
		if (!moveInst)
			return 0;
		var ret = 0;
		switch (tag) {
		case "x":	ret = moveInst.x;		break;
		case "y":	ret = moveInst.y;		break;
		case "a":	ret = moveInst.angle;	break;
		}
		var fromPeer = this.mp["getPeerById"](fromPeerID);
		if (!fromPeer || fromPeer === movePeer)		// cannot find that peer or is same peer
			return ret;
		if (this.mp["me"] === fromPeer)
			return ret;
		var delay = (fromPeer["latency"] + this.mp["clientDelay"]) * 2;
		var moveUid = moveInst.uid;
		if (!this.objectHistories.hasOwnProperty(moveUid))
			return ret;		// no object history data yet
		var oh = this.objectHistories[moveUid];
		var interp = oh.getInterp(tag, 0, cr.performance_now() - delay, interp);
		if (typeof interp === "undefined")
			return ret;
		else
			return interp;
	};
	Exps.prototype.LagCompensateX = function (ret, movingPeerID, fromPeerID)
	{
		ret.set_float(this.lagCompensate(movingPeerID, fromPeerID, "x", this.mp["INTERP_LINEAR"]));
	};
	Exps.prototype.LagCompensateY = function (ret, movingPeerID, fromPeerID)
	{
		ret.set_float(this.lagCompensate(movingPeerID, fromPeerID, "y", this.mp["INTERP_LINEAR"]));
	};
	Exps.prototype.LagCompensateAngle = function (ret, movingPeerID, fromPeerID)
	{
		ret.set_float(cr.to_degrees(this.lagCompensate(movingPeerID, fromPeerID, "a", this.mp["INTERP_ANGULAR"])));
	};
	Exps.prototype.PeerIDAt = function (ret, i)
	{
		if (!isSupported)
		{
			ret.set_string("");
			return;
		}
		i = Math.floor(i);
		var peer = this.mp["getPeerAt"](i);
		ret.set_string(peer ? peer["id"] : "");
	};
	Exps.prototype.PeerAliasAt = function (ret, i)
	{
		if (!isSupported)
		{
			ret.set_string("");
			return;
		}
		i = Math.floor(i);
		var peer = this.mp["getPeerAt"](i);
		ret.set_string(peer ? peer["alias"] : "");
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Particles = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Particles.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.webGL_texture = null;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	function Particle(owner)
	{
		this.owner = owner;
		this.active = false;
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.angle = 0;
		this.opacity = 1;
		this.grow = 0;
		this.size = 0;
		this.gs = 0;			// gravity speed
		this.age = 0;
		cr.seal(this);
	};
	Particle.prototype.init = function ()
	{
		var owner = this.owner;
		this.x = owner.x - (owner.xrandom / 2) + (Math.random() * owner.xrandom);
		this.y = owner.y - (owner.yrandom / 2) + (Math.random() * owner.yrandom);
		this.speed = owner.initspeed - (owner.speedrandom / 2) + (Math.random() * owner.speedrandom);
		this.angle = owner.angle - (owner.spraycone / 2) + (Math.random() * owner.spraycone);
		this.opacity = owner.initopacity;
		this.size = owner.initsize - (owner.sizerandom / 2) + (Math.random() * owner.sizerandom);
		this.grow = owner.growrate - (owner.growrandom / 2) + (Math.random() * owner.growrandom);
		this.gs = 0;
		this.age = 0;
	};
	Particle.prototype.tick = function (dt)
	{
		var owner = this.owner;
		this.x += Math.cos(this.angle) * this.speed * dt;
		this.y += Math.sin(this.angle) * this.speed * dt;
		this.y += this.gs * dt;
		this.speed += owner.acc * dt;
		this.size += this.grow * dt;
		this.gs += owner.g * dt;
		this.age += dt;
		if (this.size < 1)
		{
			this.active = false;
			return;
		}
		if (owner.lifeanglerandom !== 0)
			this.angle += (Math.random() * owner.lifeanglerandom * dt) - (owner.lifeanglerandom * dt / 2);
		if (owner.lifespeedrandom !== 0)
			this.speed += (Math.random() * owner.lifespeedrandom * dt) - (owner.lifespeedrandom * dt / 2);
		if (owner.lifeopacityrandom !== 0)
		{
			this.opacity += (Math.random() * owner.lifeopacityrandom * dt) - (owner.lifeopacityrandom * dt / 2);
			if (this.opacity < 0)
				this.opacity = 0;
			else if (this.opacity > 1)
				this.opacity = 1;
		}
		if (owner.destroymode <= 1 && this.age >= owner.timeout)
		{
			this.active = false;
		}
		if (owner.destroymode === 2 && this.speed <= 0)
		{
			this.active = false;
		}
	};
	Particle.prototype.draw = function (ctx)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (curopacity === 0)
			return;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		ctx.globalAlpha = curopacity;
		var drawx = this.x - this.size / 2;
		var drawy = this.y - this.size / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		ctx.drawImage(this.owner.type.texture_img, drawx, drawy, this.size, this.size);
	};
	Particle.prototype.drawGL = function (glw)
	{
		var curopacity = this.owner.opacity * this.opacity;
		if (this.owner.destroymode === 0)
			curopacity *= 1 - (this.age / this.owner.timeout);
		var drawsize = this.size;
		var scaleddrawsize = drawsize * this.owner.particlescale;
		var drawx = this.x - drawsize / 2;
		var drawy = this.y - drawsize / 2;
		if (this.owner.runtime.pixel_rounding)
		{
			drawx = (drawx + 0.5) | 0;
			drawy = (drawy + 0.5) | 0;
		}
		if (scaleddrawsize < 1 || curopacity === 0)
			return;
		if (scaleddrawsize < glw.minPointSize || scaleddrawsize > glw.maxPointSize)
		{
			glw.setOpacity(curopacity);
			glw.quad(drawx, drawy, drawx + drawsize, drawy, drawx + drawsize, drawy + drawsize, drawx, drawy + drawsize);
		}
		else
			glw.point(this.x, this.y, scaleddrawsize, curopacity);
	};
	Particle.prototype.left = function ()
	{
		return this.x - this.size / 2;
	};
	Particle.prototype.right = function ()
	{
		return this.x + this.size / 2;
	};
	Particle.prototype.top = function ()
	{
		return this.y - this.size / 2;
	};
	Particle.prototype.bottom = function ()
	{
		return this.y + this.size / 2;
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var deadparticles = [];
	instanceProto.onCreate = function()
	{
		var props = this.properties;
		this.rate = props[0];
		this.spraycone = cr.to_radians(props[1]);
		this.spraytype = props[2];			// 0 = continuous, 1 = one-shot
		this.spraying = true;				// for continuous mode only
		this.initspeed = props[3];
		this.initsize = props[4];
		this.initopacity = props[5] / 100.0;
		this.growrate = props[6];
		this.xrandom = props[7];
		this.yrandom = props[8];
		this.speedrandom = props[9];
		this.sizerandom = props[10];
		this.growrandom = props[11];
		this.acc = props[12];
		this.g = props[13];
		this.lifeanglerandom = props[14];
		this.lifespeedrandom = props[15];
		this.lifeopacityrandom = props[16];
		this.destroymode = props[17];		// 0 = fade, 1 = timeout, 2 = stopped
		this.timeout = props[18];
		this.particleCreateCounter = 0;
		this.particlescale = 1;
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		this.add_bbox_changed_callback(function (self) {
			self.bbox.set(self.particleBoxLeft, self.particleBoxTop, self.particleBoxRight, self.particleBoxBottom);
			self.bquad.set_from_rect(self.bbox);
			self.bbox_changed = false;
			self.update_collision_cell();
			self.update_render_cell();
		});
		if (!this.recycled)
			this.particles = [];
		this.runtime.tickMe(this);
		this.type.loadTextures();
		if (this.spraytype === 1)
		{
			for (var i = 0; i < this.rate; i++)
				this.allocateParticle().opacity = 0;
		}
		this.first_tick = true;		// for re-init'ing one-shot particles on first tick so they assume any new angle/position
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"r": this.rate,
			"sc": this.spraycone,
			"st": this.spraytype,
			"s": this.spraying,
			"isp": this.initspeed,
			"isz": this.initsize,
			"io": this.initopacity,
			"gr": this.growrate,
			"xr": this.xrandom,
			"yr": this.yrandom,
			"spr": this.speedrandom,
			"szr": this.sizerandom,
			"grnd": this.growrandom,
			"acc": this.acc,
			"g": this.g,
			"lar": this.lifeanglerandom,
			"lsr": this.lifespeedrandom,
			"lor": this.lifeopacityrandom,
			"dm": this.destroymode,
			"to": this.timeout,
			"pcc": this.particleCreateCounter,
			"ft": this.first_tick,
			"p": []
		};
		var i, len, p;
		var arr = o["p"];
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			arr.push([p.x, p.y, p.speed, p.angle, p.opacity, p.grow, p.size, p.gs, p.age]);
		}
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.rate = o["r"];
		this.spraycone = o["sc"];
		this.spraytype = o["st"];
		this.spraying = o["s"];
		this.initspeed = o["isp"];
		this.initsize = o["isz"];
		this.initopacity = o["io"];
		this.growrate = o["gr"];
		this.xrandom = o["xr"];
		this.yrandom = o["yr"];
		this.speedrandom = o["spr"];
		this.sizerandom = o["szr"];
		this.growrandom = o["grnd"];
		this.acc = o["acc"];
		this.g = o["g"];
		this.lifeanglerandom = o["lar"];
		this.lifespeedrandom = o["lsr"];
		this.lifeopacityrandom = o["lor"];
		this.destroymode = o["dm"];
		this.timeout = o["to"];
		this.particleCreateCounter = o["pcc"];
		this.first_tick = o["ft"];
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
		var i, len, p, d;
		var arr = o["p"];
		for (i = 0, len = arr.length; i < len; i++)
		{
			p = this.allocateParticle();
			d = arr[i];
			p.x = d[0];
			p.y = d[1];
			p.speed = d[2];
			p.angle = d[3];
			p.opacity = d[4];
			p.grow = d[5];
			p.size = d[6];
			p.gs = d[7];
			p.age = d[8];
		}
	};
	instanceProto.onDestroy = function ()
	{
		deadparticles.push.apply(deadparticles, this.particles);
		cr.clearArray(this.particles);
	};
	instanceProto.allocateParticle = function ()
	{
		var p;
		if (deadparticles.length)
		{
			p = deadparticles.pop();
			p.owner = this;
		}
		else
			p = new Particle(this);
		this.particles.push(p);
		p.active = true;
		return p;
	};
	instanceProto.tick = function()
	{
		var dt = this.runtime.getDt(this);
		var i, len, p, n, j;
		if (this.spraytype === 0 && this.spraying)
		{
			this.particleCreateCounter += dt * this.rate;
			n = cr.floor(this.particleCreateCounter);
			this.particleCreateCounter -= n;
			for (i = 0; i < n; i++)
			{
				p = this.allocateParticle();
				p.init();
			}
		}
		this.particleBoxLeft = this.x;
		this.particleBoxTop = this.y;
		this.particleBoxRight = this.x;
		this.particleBoxBottom = this.y;
		for (i = 0, j = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			this.particles[j] = p;
			this.runtime.redraw = true;
			if (this.spraytype === 1 && this.first_tick)
				p.init();
			p.tick(dt);
			if (!p.active)
			{
				deadparticles.push(p);
				continue;
			}
			if (p.left() < this.particleBoxLeft)
				this.particleBoxLeft = p.left();
			if (p.right() > this.particleBoxRight)
				this.particleBoxRight = p.right();
			if (p.top() < this.particleBoxTop)
				this.particleBoxTop = p.top();
			if (p.bottom() > this.particleBoxBottom)
				this.particleBoxBottom = p.bottom();
			j++;
		}
		cr.truncateArray(this.particles, j);
		this.set_bbox_changed();
		this.first_tick = false;
		if (this.spraytype === 1 && this.particles.length === 0)
			this.runtime.DestroyInstance(this);
	};
	instanceProto.draw = function (ctx)
	{
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.draw(ctx);
			}
		}
	};
	instanceProto.drawGL = function (glw)
	{
		this.particlescale = this.layer.getScale();
		glw.setTexture(this.type.webGL_texture);
		var i, len, p, layer = this.layer;
		for (i = 0, len = this.particles.length; i < len; i++)
		{
			p = this.particles[i];
			if (p.right() >= layer.viewLeft && p.bottom() >= layer.viewTop && p.left() <= layer.viewRight && p.top() <= layer.viewBottom)
			{
				p.drawGL(glw);
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.IsSpraying = function ()
	{
		return this.spraying;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpraying = function (set_)
	{
		this.spraying = (set_ !== 0);
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.SetRate = function (x)
	{
		this.rate = x;
		var diff, i;
		if (this.spraytype === 1 && this.first_tick)
		{
			if (x < this.particles.length)
			{
				diff = this.particles.length - x;
				for (i = 0; i < diff; i++)
					deadparticles.push(this.particles.pop());
			}
			else if (x > this.particles.length)
			{
				diff = x - this.particles.length;
				for (i = 0; i < diff; i++)
					this.allocateParticle().opacity = 0;
			}
		}
	};
	Acts.prototype.SetSprayCone = function (x)
	{
		this.spraycone = cr.to_radians(x);
	};
	Acts.prototype.SetInitSpeed = function (x)
	{
		this.initspeed = x;
	};
	Acts.prototype.SetInitSize = function (x)
	{
		this.initsize = x;
	};
	Acts.prototype.SetInitOpacity = function (x)
	{
		this.initopacity = x / 100;
	};
	Acts.prototype.SetGrowRate = function (x)
	{
		this.growrate = x;
	};
	Acts.prototype.SetXRandomiser = function (x)
	{
		this.xrandom = x;
	};
	Acts.prototype.SetYRandomiser = function (x)
	{
		this.yrandom = x;
	};
	Acts.prototype.SetSpeedRandomiser = function (x)
	{
		this.speedrandom = x;
	};
	Acts.prototype.SetSizeRandomiser = function (x)
	{
		this.sizerandom = x;
	};
	Acts.prototype.SetGrowRateRandomiser = function (x)
	{
		this.growrandom = x;
	};
	Acts.prototype.SetParticleAcc = function (x)
	{
		this.acc = x;
	};
	Acts.prototype.SetGravity = function (x)
	{
		this.g = x;
	};
	Acts.prototype.SetAngleRandomiser = function (x)
	{
		this.lifeanglerandom = x;
	};
	Acts.prototype.SetLifeSpeedRandomiser = function (x)
	{
		this.lifespeedrandom = x;
	};
	Acts.prototype.SetOpacityRandomiser = function (x)
	{
		this.lifeopacityrandom = x;
	};
	Acts.prototype.SetTimeout = function (x)
	{
		this.timeout = x;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ParticleCount = function (ret)
	{
		ret.set_int(this.particles.length);
	};
	Exps.prototype.Rate = function (ret)
	{
		ret.set_float(this.rate);
	};
	Exps.prototype.SprayCone = function (ret)
	{
		ret.set_float(cr.to_degrees(this.spraycone));
	};
	Exps.prototype.InitSpeed = function (ret)
	{
		ret.set_float(this.initspeed);
	};
	Exps.prototype.InitSize = function (ret)
	{
		ret.set_float(this.initsize);
	};
	Exps.prototype.InitOpacity = function (ret)
	{
		ret.set_float(this.initopacity * 100);
	};
	Exps.prototype.InitGrowRate = function (ret)
	{
		ret.set_float(this.growrate);
	};
	Exps.prototype.XRandom = function (ret)
	{
		ret.set_float(this.xrandom);
	};
	Exps.prototype.YRandom = function (ret)
	{
		ret.set_float(this.yrandom);
	};
	Exps.prototype.InitSpeedRandom = function (ret)
	{
		ret.set_float(this.speedrandom);
	};
	Exps.prototype.InitSizeRandom = function (ret)
	{
		ret.set_float(this.sizerandom);
	};
	Exps.prototype.InitGrowRandom = function (ret)
	{
		ret.set_float(this.growrandom);
	};
	Exps.prototype.ParticleAcceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.ParticleAngleRandom = function (ret)
	{
		ret.set_float(this.lifeanglerandom);
	};
	Exps.prototype.ParticleSpeedRandom = function (ret)
	{
		ret.set_float(this.lifespeedrandom);
	};
	Exps.prototype.ParticleOpacityRandom = function (ret)
	{
		ret.set_float(this.lifeopacityrandom);
	};
	Exps.prototype.Timeout = function (ret)
	{
		ret.set_float(this.timeout);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Rex_ZSorter = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Rex_ZSorter.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
	    this.yIncMode = (this.properties[0] === 0);
        this.xIncMode = (this.properties[1] === 0);
        this.cmpUIDA = 0;
	    this.cmpUIDB = 0;
        this.cmpResult = 0;
		this.sortFnName = "";
		var self = this;
		this.SortByPos = function (instA, instB)
		{
			var ax = instA.x;
			var ay = instA.y;
			var bx = instB.x;
			var by = instB.y;
			if (ay === by)
			{
				if (ax === bx)
					return 0;
				else if (self.xIncMode)
					return (ax > bx)? 1:-1;
				else  // !this.xIncMode
					return (ax < bx)? 1:-1;
			}
			else if (self.yIncMode)
				return (ay > by)? 1:-1;
			else // !this.yIncMode
				return (ay < by)? 1:-1;
		};
		this.SortByFn = function (instA, instB)
		{
			self.cmpUIDA = instA.uid;
			self.cmpUIDB = instB.uid;
			self.runtime.trigger(cr.plugins_.Rex_ZSorter.prototype.cnds.OnSortingFn, self);
			return self.cmpResult;
		};
	};
	var getUID2ZIdx = function (insts, uid2ZIdx)
	{
		if (uid2ZIdx == null)
			uid2ZIdx = {};
		else
		{
			for(var k in uid2ZIdx)
				delete uid2ZIdx[k];
		}
		var i, cnt=insts.length, inst;
		for(i=0; i<cnt; i++)
		{
			inst = insts[i];
			uid2ZIdx[inst.uid] = inst.get_zindex();
		}
		return uid2ZIdx;
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"xi": this.xIncMode,
			"yi": this.yIncMode
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.xIncMode = o["xi"];
		this.yIncMode = o["yi"];
	};
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	Cnds.prototype.OnSortingFn = function (name)
	{
		return cr.equals_nocase(this.sortFnName, name);
	};
	function Acts() {};
	pluginProto.acts = new Acts();
	var uid2ZIdx = {};
	Acts.prototype.SortObjsLayerByY = function (layer)
	{
        if (layer == null)
        {
            alart("Z Sort: Can not find layer");
            return;
		}
		var insts = layer.instances;
		uid2ZIdx = getUID2ZIdx(insts, uid2ZIdx);
		insts.sort(this.SortByPos);
		var i, cnt=insts.length, inst;
		for(i=0; i<cnt; i++)
		{
			inst = insts[i];
			if (i !== uid2ZIdx[inst.uid])
				layer.setZIndicesStaleFrom(i);
		}
	    this.runtime.redraw = true;
	};
	Acts.prototype.SetXorder = function (xOrder)
	{
        this.xIncMode = (xOrder === 0);
	};
	Acts.prototype.SortByFn = function (layer, fnName)
	{
        if (layer == null)
        {
            alart("Z Sort: Can not find layer");
            return;
		}
		var insts = layer.instances;
		uid2ZIdx = getUID2ZIdx(insts, uid2ZIdx);
	    this.sortFnName = fnName;
	    insts.sort(this.SortByFn);
		var i, cnt=insts.length, inst;
		for(i=0; i<cnt; i++)
		{
			inst = insts[i];
			if (i !== uid2ZIdx[inst.uid])
				layer.setZIndicesStaleFrom(i);
		}
	    this.runtime.redraw = true;
	};
	Acts.prototype.SetCmpResultDirectly = function (result)
	{
	    this.cmpResult = result;
	};
    Acts.prototype.SetCmpResultCombo = function (result)
	{
	    this.cmpResult = result -1;
	};
	Acts.prototype.SetYorder = function (yOrder)
	{
        this.yIncMode = (yOrder === 0);
	};
    Acts.prototype.ZMoveToObject = function (uidA, where_, uidB)
	{
	    if (uidA == uidB)
	        return;
	    var instA = this.runtime.getObjectByUID(uidA);
	    var instB = this.runtime.getObjectByUID(uidB);
	    if ((instA == null) || (instB == null))
	        return;
	    var isafter = (where_ === 0);
	    if (instA.layer.index !== instB.layer.index)
	    {
	    	instA.layer.removeFromInstanceList(instA, true);
	    	instA.layer = instB.layer;
	    	instB.layer.appendToInstanceList(instA, true);
	    }
	    instA.layer.moveInstanceAdjacent(instA, instB, isafter);
	    instA.runtime.redraw = true;
	};
	function Exps() {};
	pluginProto.exps = new Exps();
	Exps.prototype.CmpUIDA = function (ret)
	{
	    ret.set_int(this.cmpUIDA);
	};
	Exps.prototype.CmpUIDB = function (ret)
	{
	    ret.set_int(this.cmpUIDB);
	};
}());
;
;
cr.plugins_.Sprite = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Sprite.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
										 0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		return this.datauri;
	};
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		this.all_frames = [];
		this.has_loaded_textures = false;
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.frames = [];
			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameobj = {};
				frameobj.texture_file = frame[0];
				frameobj.texture_filesize = frame[1];
				frameobj.offx = frame[2];
				frameobj.offy = frame[3];
				frameobj.width = frame[4];
				frameobj.height = frame[5];
				frameobj.duration = frame[6];
				frameobj.hotspotX = frame[7];
				frameobj.hotspotY = frame[8];
				frameobj.image_points = frame[9];
				frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";		// generated on demand and cached
				frameobj.getDataUri = frame_getDataUri;
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				frameobj.webGL_texture = null;
				wt = this.runtime.findWaitingTexture(frame[0]);
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img.cr_src = frame[0];
					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	};
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
		this.updateAllCurrentTexture();
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.updateAllCurrentTexture();
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.has_loaded_textures = true;
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.has_loaded_textures)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			this.runtime.glwrap.deleteTexture(frame.webGL_texture);
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
	};
	var already_drawn_images = [];
	typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		cr.clearArray(already_drawn_images);
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		var poly_pts = this.type.animations[0].frames[0].poly_pts;
		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);	// 0=visible, 1=invisible
		this.isTicking = false;
		this.inAnimTrigger = false;
		this.collisionsEnabled = (this.properties[3] !== 0);
		this.cur_animation = this.getAnimationByName(this.properties[1]) || this.type.animations[0];
		this.cur_frame = this.properties[2];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;
		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.cur_anim_speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();
		this.frameStart = this.getNowTime();
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";
		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;
		this.type.loadTextures();
		var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;
					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto
		};
		if (!this.animPlaying)
			o["ap"] = this.animPlaying;
		if (!this.animForwards)
			o["af"] = this.animForwards;
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		var anim = this.getAnimationBySid(o["a"]);
		if (anim)
			this.cur_animation = anim;
		this.cur_frame = o["f"];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		this.cur_anim_speed = o["cas"];
		this.frameStart = o["fs"];
		this.animRepeats = o["ar"];
		this.animTimer.reset();
		this.animTimer.sum = o["at"];
		this.animPlaying = o.hasOwnProperty("ap") ? o["ap"] : true;
		this.animForwards = o.hasOwnProperty("af") ? o["af"] : true;
		if (o.hasOwnProperty("rt"))
			this.cur_anim_repeatto = o["rt"];
		else
			this.cur_anim_repeatto = this.cur_animation.repeatto;
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.collision_poly.set_pts(this.curFrame.poly_pts);
		this.hotspotX = this.curFrame.hotspotX;
		this.hotspotY = this.curFrame.hotspotY;
	};
	instanceProto.animationFinish = function (reverse)
	{
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		this.animTriggerName = this.cur_animation.name;
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;
		this.animRepeats = 0;
	};
	instanceProto.getNowTime = function()
	{
		return this.animTimer.sum;
	};
	instanceProto.tick = function()
	{
		this.animTimer.add(this.runtime.getDt(this));
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();
		var now = this.getNowTime();
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;
		if (this.animPlaying && now >= this.frameStart + cur_frame_time)
		{
			if (this.animForwards)
			{
				this.cur_frame++;
			}
			else
			{
				this.cur_frame--;
			}
			this.frameStart += cur_frame_time;
			if (this.cur_frame >= cur_animation.frames.length)
			{
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
				}
				else if (cur_animation.loop)
				{
					this.cur_frame = this.cur_anim_repeatto;
				}
				else
				{
					this.animRepeats++;
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						this.animationFinish(false);
					}
					else
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
				}
			}
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					if (!cur_animation.loop)
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
					}
				}
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
					else
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
						else
						{
							this.cur_frame = this.cur_anim_repeatto;
						}
					}
				}
			}
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				this.frameStart = now;
			}
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
			this.runtime.redraw = true;
		}
	};
	instanceProto.getAnimationByName = function (name_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (cr.equals_nocase(a.name, name_))
				return a;
		}
		return null;
	};
	instanceProto.getAnimationBySid = function (sid_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (a.sid === sid_)
				return a;
		}
		return null;
	};
	instanceProto.doChangeAnim = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var anim = this.getAnimationByName(this.changeAnimName);
		this.changeAnimName = "";
		if (!anim)
			return;
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		this.cur_anim_repeatto = anim.repeatto;
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		this.runtime.redraw = true;
	};
	instanceProto.doChangeAnimFrame = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var prev_frame_number = this.cur_frame;
		this.cur_frame = cr.floor(this.changeAnimFrame);
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (prev_frame_number !== this.cur_frame)
		{
			this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
			this.frameStart = this.getNowTime();
			this.runtime.redraw = true;
		}
		this.changeAnimFrame = -1;
	};
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnFrameChanged, this);
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		var cur_frame = this.curFrame;
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 myx, myy, w, h);
			}
			else
			{
				ctx.drawImage(cur_image, myx, myy, w, h);
			}
		}
		else
		{
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			ctx.save();
			var widthfactor = w > 0 ? 1 : -1;
			var heightfactor = h > 0 ? 1 : -1;
			ctx.translate(myx, myy);
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);
			ctx.rotate(this.angle * widthfactor * heightfactor);
			var drawx = 0 - (this.hotspotX * cr.abs(w))
			var drawy = 0 - (this.hotspotY * cr.abs(h));
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 drawx, drawy, cr.abs(w), cr.abs(h));
			}
			else
			{
				ctx.drawImage(cur_image, drawx, drawy, cr.abs(w), cr.abs(h));
			}
			ctx.restore();
		}
		/*
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 3;
		ctx.beginPath();
		this.collision_poly.cache_poly(this.width, this.height, this.angle);
		var i, len, ax, ay, bx, by;
		for (i = 0, len = this.collision_poly.pts_count; i < len; i++)
		{
			ax = this.collision_poly.pts_cache[i*2] + this.x;
			ay = this.collision_poly.pts_cache[i*2+1] + this.y;
			bx = this.collision_poly.pts_cache[((i+1)%len)*2] + this.x;
			by = this.collision_poly.pts_cache[((i+1)%len)*2+1] + this.y;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}
		ctx.stroke();
		ctx.closePath();
		*/
		/*
		if (this.behavior_insts.length >= 1 && this.behavior_insts[0].draw)
		{
			this.behavior_insts[0].draw(ctx);
		}
		*/
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		var cur_frame = this.curFrame;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
			else
				glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
			else
				glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};
	instanceProto.getImagePointIndexByName = function(name_)
	{
		var cur_frame = this.curFrame;
		var i, len;
		for (i = 0, len = cur_frame.image_points.length; i < len; i++)
		{
			if (cr.equals_nocase(name_, cur_frame.image_points[i][0]))
				return i;
		}
		return -1;
	};
	instanceProto.getImagePoint = function(imgpt, getX)
	{
		var cur_frame = this.curFrame;
		var image_points = cur_frame.image_points;
		var index;
		if (cr.is_string(imgpt))
			index = this.getImagePointIndexByName(imgpt);
		else
			index = imgpt - 1;	// 0 is origin
		index = cr.floor(index);
		if (index < 0 || index >= image_points.length)
			return getX ? this.x : this.y;	// return origin
		var x = (image_points[index][1] - cur_frame.hotspotX) * this.width;
		var y = image_points[index][2];
		y = (y - cur_frame.hotspotY) * this.height;
		var cosa = Math.cos(this.angle);
		var sina = Math.sin(this.angle);
		var x_temp = (x * cosa) - (y * sina);
		y = (y * cosa) + (x * sina);
		x = x_temp;
		x += this.x;
		y += this.y;
		return getX ? x : y;
	};
	function Cnds() {};
	var arrCache = [];
	function allocArr()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [0, 0, 0];
	};
	function freeArr(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache.push(a);
	};
	function makeCollKey(a, b)
	{
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	function collmemory_add(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;
		var key = makeCollKey(a_uid, b_uid);
		if (collmemory.hasOwnProperty(key))
		{
			collmemory[key][2] = tickcount;
			return;
		}
		var arr = allocArr();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	function collmemory_remove(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			freeArr(collmemory[key]);
			delete collmemory[key];
		}
	};
	function collmemory_removeInstance(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	var last_coll_tickcount = -2;
	function collmemory_has(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount = -2;
			return false;
		}
	};
	var candidates1 = [];
	Cnds.prototype.OnCollision = function (rtype)
	{
		if (!rtype)
			return false;
		var runtime = this.runtime;
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		var collmemory = null;
		if (cnd.extra["collmemory"])
		{
			collmemory = cnd.extra["collmemory"];
		}
		else
		{
			collmemory = {};
			cnd.extra["collmemory"] = collmemory;
		}
		if (!cnd.extra["spriteCreatedDestroyCallback"])
		{
			cnd.extra["spriteCreatedDestroyCallback"] = true;
			runtime.addDestroyCallback(function(inst) {
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		var l, linst, r, rinst;
		var curlsol, currsol;
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			if (rsol.select_all)
			{
				linst.update_bbox();
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
			}
			else
				rinstances = rsol.getObjects();
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));
					collmemory_add(collmemory, linst, rinst, tickcount);
					if (run)
					{
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					collmemory_remove(collmemory, linst, rinst);
				}
			}
			cr.clearArray(candidates1);
		}
		return false;
	};
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	var candidates2 = [];
	var temp_bbox = new cr.rect(0, 0, 0, 0);
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		if (rsol.select_all)
		{
			this.update_bbox();
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
				rinstances = rsol.instances;
			else
				rinstances = rsol.else_instances;
		}
		else
		{
			rinstances = rsol.instances;
		}
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				if (inverted)
					break;
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		cr.clearArray(candidates2);
		return ret;
	};
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			if (sol.select_all)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);
				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}
				if (orblock)
				{
					cr.clearArray(sol.else_instances);
					for (i = 0, len = rpicktype.instances.length; i < len; ++i)
					{
						inst = rpicktype.instances[i];
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
					for (i = 0, len = topick.length; i < len; ++i)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			rpicktype.applySolToContainer();
		}
		rtopick.clear();
		needscollisionfinish = false;
	};
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};
	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};
	Cnds.prototype.CompareFrame = function (cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};
	Cnds.prototype.CompareAnimSpeed = function (cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	Cnds.prototype.OnFrameChanged = function ()
	{
		return true;
	};
	Cnds.prototype.IsMirrored = function ()
	{
		return this.width < 0;
	};
	Cnds.prototype.IsFlipped = function ()
	{
		return this.height < 0;
	};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Spawn = function (obj, layer, imgpt)
	{
		if (!obj || !layer)
			return;
		var inst = this.runtime.createInstance(obj, layer, this.getImagePoint(imgpt, true), this.getImagePoint(imgpt, false));
		if (!inst)
			return;
		if (typeof inst.angle !== "undefined")
		{
			inst.angle = this.angle;
			inst.set_bbox_changed();
		}
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;
		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}
		var sol;
		if (obj != this.type)
		{
			sol = obj.getCurrentSol();
			sol.select_all = false;
			if (reset_sol)
			{
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
			}
			else
				sol.instances.push(inst);
			if (inst.is_contained)
			{
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					if (reset_sol)
					{
						cr.clearArray(sol.instances);
						sol.instances[0] = s;
					}
					else
						sol.instances.push(s);
				}
			}
		}
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
	};
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnim = function (animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnimRepeatToFrame = function (s)
	{
		s = Math.floor(s);
		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;
		this.cur_anim_repeatto = s;
	};
	Acts.prototype.SetMirrored = function (m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);
		if (this.width === neww)
			return;
		this.width = neww;
		this.set_bbox_changed();
	};
	Acts.prototype.SetFlipped = function (f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);
		if (this.height === newh)
			return;
		this.height = newh;
		this.set_bbox_changed();
	};
	Acts.prototype.SetScale = function (s)
	{
		var cur_frame = this.curFrame;
		var mirror_factor = (this.width < 0 ? -1 : 1);
		var flip_factor = (this.height < 0 ? -1 : 1);
		var new_width = cur_frame.width * s * mirror_factor;
		var new_height = cur_frame.height * s * flip_factor;
		if (this.width !== new_width || this.height !== new_height)
		{
			this.width = new_width;
			this.height = new_height;
			this.set_bbox_changed();
		}
	};
	Acts.prototype.LoadURL = function (url_, resize_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		img.onload = function ()
		{
			if (curFrame_.texture_img.src === img.src)
			{
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				if (resize_ === 0)		// resize to image size
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
				return;
			}
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;	// reset to RGBA, since we don't know what type of image will have come in
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);
				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				self.type.updateAllCurrentTexture();
			}
			if (resize_ === 0)		// resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:")
			img["crossOrigin"] = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	Acts.prototype.SetCollisions = function (set_)
	{
		if (this.collisionsEnabled === (set_ !== 0))
			return;		// no change
		this.collisionsEnabled = (set_ !== 0);
		if (this.collisionsEnabled)
			this.set_bbox_changed();		// needs to be added back to cells
		else
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);
			this.collcells.set(0, 0, -1, -1);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.AnimationFrame = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	Exps.prototype.AnimationFrameCount = function (ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};
	Exps.prototype.AnimationName = function (ret)
	{
		ret.set_string(this.cur_animation.name);
	};
	Exps.prototype.AnimationSpeed = function (ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};
	Exps.prototype.ImagePointX = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};
	Exps.prototype.ImagePointY = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};
	Exps.prototype.ImagePointCount = function (ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.curFrame.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.curFrame.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Spriter = function(runtime)
{
	this.runtime = runtime;
};
(function()
{
	var pluginProto = cr.plugins_.Spriter.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
					0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		return this.datauri;
	};
	typeProto.onCreate = function()
	{
		this.doGetFromPreload = false;
		this.scmlFiles = {};
		this.scmlReserved = {};
		this.scmlInstsToNotify = {};
		this.objectArrays = [];
		this.boneWidthArrays = [];
		this.sheetTex = {};
		if (this.is_family)
			return;
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		this.all_frames = [];
		this.has_loaded_textures = false;
		if (this.animations)
		{
			for (i = 0, leni = this.animations.length; i < leni; i++)
			{
				anim = this.animations[i];
				animobj = {};
				animobj.name = anim[0];
				animobj.speed = anim[1];
				animobj.loop = anim[2];
				animobj.repeatcount = anim[3];
				animobj.repeatto = anim[4];
				animobj.pingpong = anim[5];
				animobj.sid = anim[6];
				animobj.frames = [];
				for (j = 0, lenj = anim[7].length; j < lenj; j++)
				{
					frame = anim[7][j];
					frameobj = {};
					frameobj.texture_file = frame[0];
					frameobj.texture_filesize = frame[1];
					frameobj.offx = frame[2];
					frameobj.offy = frame[3];
					frameobj.width = frame[4];
					frameobj.height = frame[5];
					frameobj.duration = frame[6];
					frameobj.hotspotX = frame[7];
					frameobj.hotspotY = frame[8];
					frameobj.image_points = frame[9];
					frameobj.poly_pts = frame[10];
					frameobj.pixelformat = frame[11];
					frameobj.spritesheeted = (frameobj.width !== 0);
					frameobj.datauri = ""; // generated on demand and cached
					frameobj.getDataUri = frame_getDataUri;
					uv = {};
					uv.left = 0;
					uv.top = 0;
					uv.right = 1;
					uv.bottom = 1;
					frameobj.sheetTex = uv;
					this.sheetTex = uv;
					frameobj.webGL_texture = null;
					wt = this.runtime.findWaitingTexture(frame[0]);
					if (wt)
					{
						frameobj.texture_img = wt;
					}
					else
					{
						frameobj.texture_img = new Image();
						frameobj.texture_img.cr_src = frame[0];
						frameobj.texture_img.cr_filesize = frame[1];
						frameobj.texture_img.c2webGL_texture = null;
						this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
					}
					cr.seal(frameobj);
					animobj.frames.push(frameobj);
					this.all_frames.push(frameobj);
				}
				cr.seal(animobj);
				this.animations[i] = animobj; // swap array data for object
			}
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lastData = "";
		this.progress = 0;
		this.entity = 0;
		this.entities = [];
		this.currentSpriterTime = 0;
		this.currentAdjustedTime = 0;
		this.secondTime = 0;
		this.start_time = cr.performance_now();
		this.lastKnownTime = this.getNowTime();
		this.drawSelf = false;
		this.ignoreGlobalTimeScale = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.setEntitiesToOtherEntities = function(otherEntities)
	{
		var NO_INDEX = -1;
		var entityTags = otherEntities;
		var att = 0;
		for (var e = 0; e < entityTags.length; e++)
		{
			var entityTag = entityTags[e];
			att = entityTag;
			var entity = new SpriterEntity();
			att = entityTag;
			entity.name = att.name;
			var animationTags = entityTag.animations;
			for (var a = 0; a < animationTags.length; a++)
			{
				var animationTag = animationTags[a];
				att = animationTag;
				var animation = new SpriterAnimation();
				animation.name = att.name;
				animation.length = att.length;
				animation.looping = att.looping;
				animation.loopTo = att.loopTo;
				animation.l = att.l;
				animation.t = att.t;
				animation.r = att.r;
				animation.b = att.b;
				animation.meta = att.meta;
				var mainlineTag = animationTag.mainlineKeys;
				var mainline = new SpriterTimeline();
				var keyTags = mainlineTag;
				for (var k = 0; k < keyTags.length; k++)
				{
					var keyTag = keyTags[k];
					var key = new SpriterKey();
					att = keyTag;
					key.time = att.time;
					key.curveType = att.curveType;
					key.c1 = att.c1;
					key.c2 = att.c2;
					key.c3 = att.c3;
					key.c4 = att.c4;
					var boneRefTags = keyTag.bones;
					if (boneRefTags)
					{
						for (var o = 0; o < boneRefTags.length; o++)
						{
							var boneRefTag = boneRefTags[o];
							att = boneRefTag;
							var boneRef = new SpriterObjectRef();
							boneRef.timeline = att.timeline;
							boneRef.key = att.key;
							boneRef.parent = att.parent;
							key.bones.push(boneRef);
						}
					}
					var objectRefTags = keyTag.objects;
					if (objectRefTags)
					{
						for (var o = 0; o < objectRefTags.length; o++)
						{
							var objectRefTag = objectRefTags[o];
							att = objectRefTag;
							var objectRef = new SpriterObjectRef();
							objectRef.timeline = att.timeline;
							objectRef.key = att.key;
							objectRef.parent = att.parent;
							key.objects.push(objectRef);
						}
					}
					animation.mainlineKeys.push(key);
				}
				animation.mainline = mainline;
				var timelineTags = animationTag.timelines;
				if (timelineTags)
				{
					for (var t = 0; t < timelineTags.length; t++)
					{
						var timelineTag = timelineTags[t];
						var timeline = new SpriterTimeline();
						timeline.objectType = timelineTag.objectType;
						var timelineName = timelineTag.name;
						timeline.name = timelineName;
						timeline.meta = timelineTag.meta;
						var keyTags = timelineTag.keys;
						if (keyTags)
						{
							for (var k = 0; k < keyTags.length; k++)
							{
								var keyTag = keyTags[k];
								var key = new SpriterKey();
								key.time = keyTag.time;
								key.spin = keyTag.spin;
								key.curveType = keyTag.curveType;
								key.c1 = keyTag.c1;
								key.c2 = keyTag.c2;
								key.c3 = keyTag.c3;
								key.c4 = keyTag.c4;
								var objectTags = keyTag.objects;
								if (objectTags)
								{
									for (var o = 0; o < objectTags.length; o++)
									{
										var objectTag = objectTags[o];
										var object = CloneObject(objectTag);
										key.objects.push(object);
									}
								}
								var boneTags = keyTag.bones;
								if (boneTags)
								{
									for (var o = 0; o < boneTags.length; o++)
									{
										var boneTag = boneTags[o];
										var bone = CloneObject(boneTag);
										key.bones.push(bone);
									}
								}
								timeline.keys.push(key);
							}
						}
						timeline.c2Object = this.c2ObjectArray[findObjectItemInArray(timelineName, this.objectArray, entity.name)];
						timeline.object = timelineTag.object;
						animation.timelines.push(timeline);
					}
				}
				timelineTags = animationTag.soundlines;
				if (timelineTags)
				{
					for (var t = 0; t < timelineTags.length; t++)
					{
						var timelineTag = timelineTags[t];
						var timeline = new SpriterTimeline();
						timeline.objectType = timelineTag.objectType;
						var timelineName = timelineTag.name;
						timeline.name = timelineName;
						timeline.meta = timelineTag.meta;
						var keyTags = timelineTag.keys;
						if (keyTags)
						{
							for (var k = 0; k < keyTags.length; k++)
							{
								var keyTag = keyTags[k];
								var key = new SpriterKey();
								timelineTag = keyTag;
								key.time = timelineTag.time;
								key.curveType = timelineTag.curveType;
								key.c1 = timelineTag.c1;
								key.c2 = timelineTag.c2;
								key.c3 = timelineTag.c3;
								key.c4 = timelineTag.c4;
								var objectTags = keyTag.objects;
								if (objectTags)
								{
									for (var o = 0; o < objectTags.length; o++)
									{
										var objectTag = objectTags[o];
										var object = this.cloneSound(objectTag);
										key.objects.push(object);
									}
								}
								timeline.keys.push(key);
							}
						}
						animation.soundlines.push(timeline);
					}
				}
				timelineTags = animationTag.eventlines;
				if (timelineTags)
				{
					for (var t = 0; t < timelineTags.length; t++)
					{
						var timelineTag = timelineTags[t];
						var timeline = new SpriterTimeline();
						timeline.objectType = timelineTag.objectType;
						var timelineName = timelineTag.name;
						timeline.name = timelineName;
						timeline.meta = timelineTag.meta;
						var keyTags = timelineTag.keys;
						if (keyTags)
						{
							for (var k = 0; k < keyTags.length; k++)
							{
								var keyTag = keyTags[k];
								var key = new SpriterKey();
								timelineTag = keyTag;
								key.time = timelineTag.time;
								timeline.keys.push(key);
							}
						}
						animation.eventlines.push(timeline);
					}
				}
				entity.animations.push(animation);
			}
			this.entities.push(entity);
			if (!this.entity || this.properties[1] === entity.name)
			{
				this.entity = entity;
			}
		}
	};
	instanceProto.forceCharacterFromPreload = function()
	{
		this.getCharacterFromPreload();
	}
	instanceProto.getCharacterFromPreload = function()
	{
		if (this.type.scmlFiles.hasOwnProperty(this.properties[0]))
		{
			{
				this.setEntitiesToOtherEntities(this.type.scmlFiles[this.properties[0]]);
				if (this.type.objectArrays.hasOwnProperty(this.properties[0]))
				{
					this.objectArray = this.type.objectArrays[this.properties[0]];
					this.boneWidthArray = this.type.boneWidthArrays[this.properties[0]];
				}
				this.c2ObjectArray = this.generateTestC2ObjectArray(this.objectArray);
				if (this.startingEntName)
				{
					this.setEntTo(this.startingEntName);
				}
				else
				{
					this.setEntTo(this.properties[1]);
				}
				this.associateAllTypes();
				this.initDOMtoPairedObjects();
				if (this.startingAnimName)
				{
					this.setAnimTo(this.startingAnimName);
				}
				else
				{
					this.setAnimTo(this.properties[2]);
				}
				if (!this.currentAnimation && this.entity && this.entity.animations.length && !this.changeAnimTo)
				{
					if(!this.startingAnimName)
					{
						this.setAnimTo(this.entity.animations[0].name);
					}
					else
					{
						this.setAnimTo(this.startingAnimName);
					}
				}
				if (this.startingLoopType && this.currentAnimation)
				{
					this.currentAnimation.looping = startingLoopType;
				}
				this.doGetFromPreload = true;
			}
			return true;
		}
		else if (this.type.scmlReserved.hasOwnProperty(this.properties[0]))
		{
			if (!this.type.scmlInstsToNotify[this.properties[0]])
			{
				this.type.scmlInstsToNotify[this.properties[0]] = [];
			}
			if(!this in this.type.scmlInstsToNotify[this.properties[0]])
			{
				this.type.scmlInstsToNotify[this.properties[0]].push(this);
			}
			return true;
		}
		return false;
	}
	var PAUSENEVER = 0;
	var PAUSEALLOUTSIDEBUFFER = 1;
	var PAUSEALLBUTSOUNDOUTSIDEBUFFER = 2;
	var COMPONENTANGLE = '0';
	var COMPONENTX = '1';
	var COMPONENTY = '2';
	var COMPONENTSCALEX = '3';
	var COMPONENTSCALEY = '4';
	var COMPONENTIMAGE = '5';
	var COMPONENTPIVOTX = '6';
	var COMPONENTPIVOTY = '7';
	var COMPONENTENTITY = '8';
	var COMPONENTANIMATION = '9';
	var COMPONENTTIMERATIO = '10';
	instanceProto.onCreate = function()
	{
		this.nodeStack = [];
		this.isDestroyed = false;
		this.folders = [];
		this.tagDefs = [];
		this.currentAnimation = "";
		this.secondAnimation = "";
		this.animBlend = 0.0;
		this.blendStartTime = 0.0;
		this.blendEndTime = 0.0;
		this.blendPoseTime = 0.0;
		this.lastKnownInstDataAsObj = null;
		this.lastZ = null;
		this.c2ObjectArray = [];
		this.objectArray = [];
		this.boneWidthArray = {};
		this.boneIkOverrides = {};
		this.objectOverrides = {};
		this.objInfoVarDefs = [];
		this.animPlaying = true;
		this.speedRatio = 1.0;
		this.setLayersForSprites = true;
		this.scaleRatio = this.width / 50.0;
		this.subEntScaleX = 1.0;
		this.subEntScaleY = 1.0;
		this.xFlip = false;
		this.yFlip = false;
		this.playTo = -1;
		this.changeToStartFrom = 0;
		this.runtime.tickMe(this);
		this.runtime.tick2Me(this);
		this.startingEntName = null;
		this.startingAnimName = null;
		this.startingLoopType = null;
		this.leftBuffer = 0;
		this.rightBuffer = 0;
		this.topBuffer = 0;
		this.bottomBuffer = 0;
		this.pauseWhenOutsideBuffer = PAUSENEVER;
		this.soundToTrigger = "";
		this.soundLineToTrigger = {};
		this.eventToTrigger = "";
		this.eventLineToTrigger = {};
		this.lastFoundObject = "";
		this.objectsToSet = [];
		this.drawSelf = this.properties[4] == 1;
		this.properties[0] = this.properties[0].toLowerCase();
		if (this.properties[0].lastIndexOf(".scml") > -1)
		{
			this.properties[0] = this.properties[0].replace(".scml", ".scon");
		}
		if ((!this.getCharacterFromPreload()) && this.properties[0].length > 0)
		{
			var self = this;
			var request = null;
			var doErrorFunc = function() {};
			var errorFunc = function() {};
			var progressFunc = function(e) {};
			this.type.scmlReserved[this.properties[0]] = this;
			if(this.runtime.isWKWebView)
			{
				this.runtime.fetchLocalFileViaCordovaAsText(this.properties[0],
				function (str)
				{
					self.ProcessRawTextFile(str);
				},
				function (err)
				{
					console.log(err);
				});
			}
			else
			{
				request = new XMLHttpRequest();
				request.onreadystatechange = function()
				{
					if (request.readyState === 4 && !self.isDestroyed)
					{
						if (request.status >= 400)
						{
;
						}
						else
						{
							self.ProcessRawTextFile(request.responseText);
						}
					}
				};
				request.onerror = errorFunc;
				request.ontimeout = errorFunc;
				request.onabort = errorFunc;
				request["onprogress"] = progressFunc;
				request.open("GET", this.properties[0]);
				request.send();
			}
		}
		this.force = false;
		this.inAnimTrigger = false;
		this.changeAnimTo = null;
		this.opacity = clamp(0.0, 1.0, this.properties[3] / 100.0);
		if (this.drawSelf)
		{
			var frame = this.type.animations[0].frames[0];
			var maintex = frame.texture_img;
			var uv = frame.sheetTex;
			uv.left = frame.offx / maintex.width;
			uv.top = frame.offy / maintex.height;
			uv.right = (frame.offx + frame.width) / maintex.width;
			uv.bottom = (frame.offy + frame.height) / maintex.height;
		}
	};
	instanceProto.ProcessRawTextFile = function(text)
	{
		text.replace(/\r\n/g, "\n"); // fix windows style line endings
		this.doRequest(JSON.parse(text));
		if (this.startingEntName)
		{
			this.setEntTo(this.startingEntName);
		}
		if (this.startingAnimName)
		{
			this.setAnimTo(this.startingAnimName);
		}
		if (this.startingLoopType && this.currentAnimation)
		{
			this.currentAnimation.looping = this.startingLoopType;
		}
	}
	instanceProto.onDestroy = function()
	{
		this.isDestroyed = true;
	};
	instanceProto.getVarDefsByName = function(objName)
	{
		for (var o = 0; o < this.objInfoVarDefs.length; o++)
		{
			var objInf = this.objInfoVarDefs[o];
			if (objInf)
			{
				if (objInf.name === objName)
				{
					return objInf.varDefs;
				}
			}
		}
	}
	instanceProto.getVarDefByName = function(objName, varName)
	{
		var objInf = this.getVarDefsByName(objName);
		if (objInf)
		{
			for (var v = 0; v < objInfo.varDefs.length; v++)
			{
				var varDef = objInfo.varDefs[v];
				if (varDef)
				{
					if (varDef.name == varName)
					{
						return varDef;
					}
				}
			}
		}
	}
	function ObjInfo()
	{
		this.name = "";
		this.varDefs = [];
	}
	function SpriterEntity()
	{
		this.name = "";
		this.animations = [];
		this.varDefs = [];
	}
	function SpriterAnimation()
	{
		this.name = "";
		this.length = 1;
		this.looping = "true";
		this.loopTo = 0;
		this.mainlineKeys = [];
		this.timelines = [];
		this.soundlines = [];
		this.eventlines = [];
		this.meta = new MetaData();
		this.cur_frame = 0;
		this.localTime = 0;
		this.l = -25;
		this.t = -25;
		this.r = 25;
		this.b = 25;
	}
	function SpriterTimeline()
	{
		this.keys = [];
		this.name = "";
		this.c2Object = 0;
		this.object = 0;
		this.objectType = "sprite";
		this.currentObjectState = {};
		this.currentMappedState = {};
		this.lastTimeSoundCheck = 0;
		this.meta = new MetaData();
	}
	function SpriterKey()
	{
		this.bones = [];
		this.objects = [];
		this.time = 0;
		this.spin = 1;
		this.curveType = "linear";
		this.c1 = 0;
		this.c2 = 0;
		this.c3 = 0;
		this.c4 = 0;
	}
	function C2ObjectToSpriterObjectInstruction(initialC2Object, spriterObjectName, propertiesToSet, pin)
	{
		this.c2Object = Array.from(initialC2Object);
		this.objectName = spriterObjectName;
		this.setType = propertiesToSet;
		this.pin = pin;
	}
	function clamp(low, high, val)
	{
		if (val > high)
		{
			return high;
		}
		if (val < low)
		{
			return low;
		}
		return val;
	}
	function setTimeInfoFromJson(json, targetKey)
	{
		if (json.hasOwnProperty("time") && targetKey.time !== undefined)
		{
			targetKey.time = json["time"];
		}
		if (json.hasOwnProperty("spin") && targetKey.spin !== undefined)
		{
			targetKey.spin = (json["spin"]);
		}
		if (json.hasOwnProperty("curve_type") && targetKey.curveType !== undefined)
		{
			targetKey.curveType = json["curve_type"];
		}
		if (json.hasOwnProperty("c1") && targetKey.c1 !== undefined)
		{
			targetKey.c1 = json["c1"];
		}
		if (json.hasOwnProperty("c2") && targetKey.c2 !== undefined)
		{
			targetKey.c2 = json["c2"];
		}
		if (json.hasOwnProperty("c3") && targetKey.c3 !== undefined)
		{
			targetKey.c3 = json["c3"];
		}
		if (json.hasOwnProperty("c4") && targetKey.c4 !== undefined)
		{
			targetKey.c4 = json["c4"];
		}
	}
	instanceProto.setTimelinesFromJson = function(json, timelines, entity)
	{
		if (json)
		{
			for (var t = 0; t < json.length; t++)
			{
				var timelineTag = json[t];
				var timeline = new SpriterTimeline();
				if (timelineTag.hasOwnProperty("object_type"))
				{
					timeline.objectType = timelineTag["object_type"];
				}
				var timelineName = timelineTag["name"];
				timeline.name = timelineName;
				var keyTags = timelineTag["key"];
				if (keyTags)
				{
					for (var k = 0; k < keyTags.length; k++)
					{
						var keyTag = keyTags[k];
						var key = new SpriterKey();
						setTimeInfoFromJson(keyTag, key);
						var objectTags = keyTag["object"];
						if (objectTags)
						{
							var objectTag = objectTags;
							var object = this.objectFromTag(objectTag, this.objectArray, timelineName, timeline.objectType, entity.name);
							key.objects.push(object);
						}
						var boneTags = keyTag["bone"];
						if (boneTags)
						{
							var boneTag = boneTags;
							var bone = this.objectFromTag(boneTag, this.objectArray, timelineName, timeline.objectType, entity.name);
							key.bones.push(bone);
						}
						timeline.keys.push(key);
					}
				}
				timeline.c2Object = this.c2ObjectArray[findObjectItemInArray(timelineName, this.objectArray, entity.name)];
				var obj = objectFromArray(timelineName, this.objectArray, entity.name);
				var defs = {};
				if (obj)
				{
					defs = obj.varDefs;
				}
				timeline.object = obj;
				this.setMetaDataFromJson(timelineTag["meta"], timeline.meta, defs);
				timelines.push(timeline);
			}
		}
	}
	instanceProto.setSoundlinesFromJson = function(json, timelines, entityname)
	{
		if (json)
		{
			for (var t = 0; t < json.length; t++)
			{
				var timelineTag = json[t];
				var timeline = new SpriterTimeline();
				timeline.objectType = "sound";
				var timelineName = timelineTag["name"];
				timeline.name = timelineName;
				var keyTags = timelineTag["key"];
				if (keyTags)
				{
					for (var k = 0; k < keyTags.length; k++)
					{
						var keyTag = keyTags[k];
						var key = new SpriterKey();
						setTimeInfoFromJson(keyTag, key);
						var soundTags = keyTag["object"];
						if (soundTags)
						{
							var soundTag = soundTags;
							var sound = this.soundFromTag(soundTag);
							key.objects.push(sound);
						}
						timeline.keys.push(key);
					}
				}
				var obj = objectFromArray(timeline.name, this.objectArray, entityname);
				this.setMetaDataFromJson(timelineTag["meta"], timeline.meta, this.getVarDefsByName(timeline.name));
				timelines.push(timeline);
			}
		}
	}
	instanceProto.setVarlinesFromJson = function(json, timelines, vardefs)
	{
		if (json)
		{
			for (var t = 0; t < json.length; t++)
			{
				var timelineTag = json[t];
				var timeline = new VarLine();
				timeline.defIndex = timelineTag["def"];
				timeline.def = vardefs[timeline.defIndex];
				var keyTags = timelineTag["key"];
				if (keyTags)
				{
					for (var k = 0; k < keyTags.length; k++)
					{
						var keyTag = keyTags[k];
						var key = new VarKey();
						setTimeInfoFromJson(keyTag, key);
						key.val = keyTag["val"];
						timeline.keys.push(key);
					}
				}
				timelines.push(timeline);
			}
		}
	}
	instanceProto.setEventlinesFromJson = function(json, timelines, entityname)
	{
		if (json)
		{
			for (var t = 0; t < json.length; t++)
			{
				var timelineTag = json[t];
				var timeline = new EventLine();
				timeline.name = timelineTag["name"];
				var keyTags = timelineTag["key"];
				if (keyTags)
				{
					for (var k = 0; k < keyTags.length; k++)
					{
						var keyTag = keyTags[k];
						var key = new EventKey();
						setTimeInfoFromJson(keyTag, key);
						timeline.keys.push(key);
					}
				}
				this.setMetaDataFromJson(timelineTag["meta"], timeline.meta, this.getVarDefsByName(timeline.name));
				timelines.push(timeline);
			}
		}
	}
	instanceProto.setTaglinesFromJson = function(json, timeline)
	{
		if (json)
		{
			var keyTags = json["key"];
			if (keyTags)
			{
				for (var k = 0; k < keyTags.length; k++)
				{
					var keyTag = keyTags[k];
					var key = new TagKey();
					setTimeInfoFromJson(keyTag, key);
					var tagTags = keyTag["tag"];
					var tags = key.tags;
					if (tagTags)
					{
						for (var ta = 0; ta < tagTags.length; ta++)
						{
							var tagTag = tagTags[ta];
							if (tagTag)
							{
								tags.push(this.tagDefs[tagTag["t"]]);
							}
						}
					}
					timeline.keys.push(key);
				}
			}
		}
	}
	instanceProto.setMetaDataFromJson = function(json, meta, vardefs)
	{
		if (json)
		{
			var innerTag = json["tagline"];
			if (innerTag)
			{
				this.setTaglinesFromJson(innerTag, meta.tagline);
			}
			innerTag = json["valline"];
			if (innerTag)
			{
				this.setVarlinesFromJson(innerTag, meta.varlines, vardefs);
			}
		}
	}
	function TagKey()
	{
		this.tags = [];
		this.time = 0;
	}
	function VarKey()
	{
		this.val = 0;
		this.time = 0;
		this.spin = 1;
		this.curveType = "linear";
		this.c1 = 0;
		this.c2 = 0;
		this.c3 = 0;
		this.c4 = 0;
	}
	function SpriterObject()
	{
		this.type = "sprite";
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.a = 1;
		this.xScale = 1;
		this.yScale = 1;
		this.pivotX = 0.0;
		this.pivotY = 0.0;
		this.entity = 0;
		this.animation = "";
		this.t = 0;
		this.defaultPivot = false;
		this.frame = 0;
		this.storedFrame = 0;
	}
	function SpriterSound()
	{
		this.type = "sound";
		this.name = "";
		this.trigger = true;
		this.panning = 0.0;
		this.volume = 1.0;
	}
	function EventKey()
	{
		this.time = 0;
	}
	function CloneObject(other)
	{
		if (other)
		{
			var newObj = new SpriterObject();
			newObj.type = other.type;
			newObj.x = other.x;
			newObj.y = other.y;
			newObj.angle = other.angle;
			newObj.a = other.a;
			newObj.xScale = other.xScale;
			newObj.yScale = other.yScale;
			newObj.pivotX = other.pivotX;
			newObj.pivotY = other.pivotY;
			newObj.entity = other.entity;
			newObj.animation = other.animation;
			newObj.t = other.t;
			newObj.defaultPivot = other.defaultPivot;
			newObj.frame = other.frame;
			newObj.storedFrame = newObj.storedFrame;
			return newObj;
		}
		else
		{
			return null;
		}
	}
	function sampleCurve(a, b, c, t)
	{
		return ((a * t + b) * t + c) * t;
	}
	function sampleCurveDerivativeX(ax, bx, cx, t)
		{
			return (3.0 * ax * t + 2.0 * bx) * t + cx;
		}
	function solveEpsilon(duration)
	{
		return 1.0 / (200.0 * duration);
	}
	function solve(ax, bx, cx, ay, by, cy, x, epsilon)
		{
			return sampleCurve(ay, by, cy, solveCurveX(ax, bx, cx, x, epsilon));
		}
	function fabs(n)
	{
		if (n >= 0)
		{
			return n;
		}
		else
		{
			return 0 - n;
		}
	}
	function solveCurveX(ax, bx, cx, x, epsilon)
	{
		var t0;
		var t1;
		var t2;
		var x2;
		var d2;
		var i;
		for (t2 = x, i = 0; i < 8; i++)
		{
			x2 = sampleCurve(ax, bx, cx, t2) - x;
			if (fabs(x2) < epsilon)
			{
				return t2;
			}
			d2 = sampleCurveDerivativeX(ax, bx, cx, t2);
			if (fabs(d2) < 1e-6)
			{
				break;
			}
			t2 = t2 - x2 / d2;
		}
		t0 = 0.0;
		t1 = 1.0;
		t2 = x;
		if (t2 < t0)
		{
			return t0;
		}
		if (t2 > t1)
		{
			return t1;
		}
		while (t0 < t1)
		{
			x2 = sampleCurve(ax, bx, cx, t2);
			if (fabs(x2 - x) < epsilon)
			{
				return t2;
			}
			if (x > x2)
			{
				t0 = t2;
			}
			else
			{
				t1 = t2;
			}
			t2 = (t1 - t0) * .5 + t0;
		}
		return t2; // Failure.
	}
	function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration)
	{
		var ax = 0;
		var bx = 0;
		var cx = 0;
		var ay = 0;
		var by = 0;
		var cy = 0;
		cx = 3.0 * p1x;
		bx = 3.0 * (p2x - p1x) - cx;
		ax = 1.0 - cx - bx;
		cy = 3.0 * p1y;
		by = 3.0 * (p2y - p1y) - cy;
		ay = 1.0 - cy - by;
		return solve(ax, bx, cx, ay, by, cy, t, solveEpsilon(duration));
	}
	function getT(a, b, x)
	{
		if (a === b)
		{
			return 0;
		}
		return (x - a) / (b - a);
	}
	function qerp(a, b, c, t)
	{
		return cr.lerp(cr.lerp(a, b, t), cr.lerp(b, c, t), t);
	}
	function cerp(a, b, c, d, t)
	{
		return cr.lerp(qerp(a, b, c, t), qerp(b, c, d, t), t);
	}
	function quartic(a, b, c, d, e, t)
	{
		return cr.lerp(cerp(a, b, c, d, t), cerp(b, c, d, e, t), t);
	}
	function quintic(a, b, c, d, e, f, t)
	{
		return cr.lerp(quartic(a, b, c, d, e, t), quartic(b, c, d, e, f, t), t);
	}
	function trueT(key, t)
	{
		switch (key.curveType)
		{
			case "linear":
				return t;
			case "quadratic":
				return qerp(0, key.c1, 1, t);
			case "cubic":
				return cerp(0, key.c1, key.c2, 1, t);
			case "quartic":
				return quartic(0, key.c1, key.c2, key.c3, 1, t);
			case "quintic":
				return quintic(0, key.c1, key.c2, key.c3, key.c4, 1, t);
			case "bezier":
				return CubicBezierAtTime(t, key.c1, key.c2, key.c3, key.c4, 1.0);
			case "instant":
				if (t >= 1)
				{
					return 1;
				}
				else
				{
					return 0;
				}
		}
		return 0;
	}
	function TweenedSpriterObject(a, b, t, spin, wFactor, hFactor)
	{
		wFactor = typeof wFactor !== 'undefined' ? wFactor : 1;
		hFactor = typeof hFactor !== 'undefined' ? hFactor : 1;
		var newObj = new SpriterObject();
		newObj.type = a.type;
		newObj.x = cr.lerp(a.x, b.x, t);
		newObj.y = cr.lerp(a.y, b.y, t);
		newObj.angle = anglelerp2(a.angle, b.angle, t, spin);
		newObj.a = cr.lerp(a.a, b.a, t);
		newObj.xScale = cr.lerp(a.xScale, b.xScale, t);
		newObj.yScale = cr.lerp(a.yScale, b.yScale, t);
		newObj.pivotX = a.pivotX; //cr.lerp(a.pivotX,b.pivotX,t);
		newObj.pivotY = a.pivotY; //cr.lerp(a.pivotY,b.pivotY,t);
		newObj.defaultPivot = a.defaultPivot;
		newObj.frame = a.frame;
		newObj.entity = a.entity;
		newObj.animation = a.animation;
		newObj.t = cr.lerp(a.t, b.t, t);
		newObj.storedFrame = a.storedFrame;
		return newObj;
	}
	function TweenedSpriterSound(a, b, t)
	{
		var newSound = new SpriterSound();
		newSound.trigger = a.trigger;
		newSound.volume = cr.lerp(a.volume, b.volume, t);
		newSound.panning = cr.lerp(a.panning, b.panning, t);
		newSound.name = a.name;
		return newSound;
	}
	function SpriterObjectRef()
	{
		this.type = "reference";
		this.timeline = 0;
		this.key = 0;
		this.parent = -1;
	}
	function SpriterFolder()
	{
		this.files = [];
	}
	function VarDef()
	{
		this.name = "";
		this.type = "";
		this.def = "";
	}
	function TagLine()
	{
		this.keys = [];
		this.lastTagIndex = 0;
		this.currentTags = [];
	}
	function MetaData()
	{
		this.varlines = [];
		this.tagline = new TagLine();
	}
	function VarLine()
	{
		this.varDef = {};
		this.defIndex = 0;
		this.keys = [];
		this.lastTagIndex = 0;
		this.currentVal = 0;
	}
	function EventLine()
	{
		this.name = "";
		this.keys = [];
		this.meta = new MetaData();
	}
	function SpriterFile()
	{
		this.fileName = "";
		this.pivotX = 0;
		this.pivotY = 0;
		this.w = 1;
		this.h = 1;
		this.atlasX = 0;
		this.atlasY = 0;
		this.atlasXOff = 0;
		this.atlasYOff = 0;
		this.atlasW = 0;
		this.atlasH = 0;
		this.atlasRotated = false;
	}
	function SetSpriteAnimFrame(sprite, framenumber, c2Object)
	{
		if (c2Object && c2Object.appliedMap[framenumber] !== undefined)
		{
			if (c2Object.appliedMap[framenumber] === -1)
			{
				if (sprite)
				{
					sprite.visible = false;
				}
				framenumber = -1;
			}
			else
			{
				framenumber = c2Object.appliedMap[framenumber];
			}
		}
		if (sprite)
		{
			sprite.changeAnimFrame = framenumber;
			if (!sprite.isTicking)
			{
				sprite.runtime.tickMe(sprite);
				sprite.isTicking = true;
			}
			if (!sprite.inAnimTrigger)
			{
				sprite.doChangeAnimFrame();
			}
		}
		return framenumber;
	}
	function anglelerp(a, b, x)
	{
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			return (a + diff * x);
		}
		else
		{
			return (a - diff * x);
		}
	}
	function anglelerp2(a, b, x, spin)
	{
		if (spin === 0)
		{
			return a;
		}
		var diff = cr.angleDiff(a, b);
		if (spin == -1)
		{
			return (a + diff * x);
		}
		else
		{
			return (a - diff * x);
		}
	}
	function findInArray(item, arr)
	{
		for (var i = 0; i < arr.length; i++)
		{
			if (arr[i] == item)
			{
				return i;
			}
		}
		return -1;
	}
	instanceProto.isOutsideViewportBox = function()
	{
		var layer = (this.layer);
		if (layer)
		{
			if (this.x < layer.viewLeft - this.leftBuffer)
			{
				return true;
			}
			if (this.x > layer.viewRight + this.rightBuffer)
			{
				return true;
			}
			if (this.y < layer.viewTop - this.topBuffer)
			{
				return true;
			}
			if (this.y > layer.viewBottom + this.bottomBuffer)
			{
				return true;
			}
		}
		return false;
	}
	instanceProto.MoveToLayer = function(inst, layerMove)
	{
		if (!layerMove || layerMove == inst.layer)
		{
			return;
		}
		cr.arrayRemove(inst.layer.instances, inst.get_zindex());
		inst.layer.setZIndicesStaleFrom(0);
		inst.layer = layerMove;
		inst.zindex = layerMove.instances.length;
		layerMove.instances.push(inst);
		inst.runtime.redraw = true;
	};
	instanceProto.animationFinish = function(reverse)
	{
		this.animTriggerName = this.currentAnimation.name;
		var animTrigger = this.inAnimTrigger;
		if (this.inAnimTrigger === false)
		{
			this.inAnimTrigger = true;
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnAnyAnimFinished, this);
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnAnimFinished, this);
			this.inAnimTrigger = false;
		}
	};
	instanceProto.clearAnimationState = function()
	{
		var anim = this.currentAnimation;
		if (anim)
		{
			for (var t = 0; t < anim.timelines.length; t++)
			{
				anim.timelines[t].currentObjectState = {};
			}
		}
	}
	instanceProto.getNowTime = function()
	{
		return (cr.performance_now() - this.start_time) / 1000.0;
	};
	instanceProto.doAnimChange = function()
	{
		if (this.currentAnimation)
		{
			var ratio = this.currentSpriterTime / this.currentAnimation.length;
		}
		var startFrom = this.changeToStartFrom;
		if (startFrom < 3)
		{
			this.currentAnimation = this.changeAnimTo;
			this.changeAnimTo = null;
			if (startFrom === 0) //play from start
			{
				if (this.speedRatio > 0)
				{
					this.currentSpriterTime = 0;
				}
				else
				{
					this.currentSpriterTime = this.currentAnimation.length;
				}
				this.lastKnownTime = this.getNowTime();
			}
			else if (startFrom == 2) //play from current time ratio
			{
				this.currentSpriterTime = this.currentAnimation.length * ratio;
				this.lastKnownTime = this.getNowTime();
			}
			this.width = (this.currentAnimation.r - this.currentAnimation.l) * this.scaleRatio;
			this.height = (this.currentAnimation.b - this.currentAnimation.t) * this.scaleRatio;
			this.hotspotX = -(this.xFlip ? (-this.currentAnimation.r) : this.currentAnimation.l) / this.width * this.scaleRatio;
			this.hotspotY = -(this.yFlip ? (-this.currentAnimation.b) : this.currentAnimation.t) / this.height * this.scaleRatio;
			this.set_bbox_changed();
			this.currentAdjustedTime = this.currentSpriterTime;
			this.resetEventChecksToCurrentTime();
		}
	};
	instanceProto.endBlendAndSwap = function()
	{
		if (this.secondAnimation)
		{
			this.blendEndTime = 0;
			this.blendStartTime = 0;
			this.animBlend = 0;
			this.blendPoseTime = 0;
			if (this.changeToStartFrom === BLENDTOSTART)
			{
				this.currentSpriterTime = 0;
			}
			this.currentSpriterTime = this.secondAnimation.localTime; //cr.lerp(0,this.secondAnimation.length,getT(0,this.currentAnimation.length,this.currentSpriterTime));
			this.changeAnimTo = null;
			this.currentAnimation = this.secondAnimation;
			this.secondAnimation = null;
			this.changeToStartFrom = 1; //play from current time
		}
	};
	instanceProto.tickCurrentAnimationTime = function()
	{
		var lastKnownTime = this.lastKnownTime;
		var nowTime = this.getNowTime();
		this.lastKnownTime = nowTime;
		var lastSpriterTime = this.currentSpriterTime;
		var cur_timescale = this.ignoreGlobalTimeScale ? 1 : this.runtime.timescale;
		var animation = this.currentAnimation;
		if (this.my_timescale !== -1.0)
		{
			cur_timescale = this.my_timescale;
		}
		if (this.animPlaying)
		{
			this.currentSpriterTime += (this.getNowTime() - lastKnownTime) * 1000 * this.speedRatio * cur_timescale;
		}
		var playTo = this.playTo;
		var animFinished = false;
		if (playTo >= 0)
		{
			if (this.animPlaying)
			{
				if (((lastSpriterTime - playTo) * (this.currentSpriterTime - playTo)) < 0)
				{
					this.animPlaying = false;
					this.currentSpriterTime = this.playTo;
					this.playTo = -1;
					animFinished = true;
				}
			}
		}
		else
		{
			if (this.speedRatio >= 0)
			{
				if (this.currentSpriterTime >= animation.length)
				{
					if (this.changeToStartFrom === BLENDTOSTART && this.secondAnimation && this.blendEndTime > 0)
					{
					}
					else
					{
						if (animation.looping == "false")
						{
							this.currentSpriterTime = animation.length;
							this.animPlaying = false;
						}
						animFinished = true;
					}
				}
			}
			else
			{
				if (this.speedRatio < 0)
				{
					if (this.currentSpriterTime < 0)
					{
						if (this.changeToStartFrom === BLENDTOSTART && this.secondAnimation && this.blendEndTime > 0)
						{
						}
						else
						{
							if (animation.looping == "false")
							{
								this.currentSpriterTime = 0;
								this.animPlaying = false;
							}
							animFinished = true;
						}
					}
				}
			}
		}
		animation = this.currentAnimation;
		while (this.currentSpriterTime < 0)
		{
			this.currentSpriterTime += animation.length;
		}
		if (this.currentSpriterTime !== animation.length)
		{
			this.currentSpriterTime %= animation.length;
		}
		if (this.secondAnimation)
		{
			if (this.changeToStartFrom === BLENDTOSTART)
			{
				this.secondAnimation.localTime = 0;
			}
			else
			{
				this.secondAnimation.localTime = cr.lerp(0, this.secondAnimation.length, getT(0, this.currentAnimation.length, this.currentSpriterTime));
			}
		}
		var blendEndTime = this.blendEndTime;
		if (blendEndTime > 0)
		{
			if (blendEndTime <= nowTime)
			{
				this.endBlendAndSwap();
			}
			else
			{
				this.animBlend = getT(this.blendStartTime, blendEndTime, this.lastKnownTime);
			}
		}
		return animFinished;
	};
	instanceProto.setMainlineKeyByTime = function(animation)
	{
		animation = (typeof animation !== 'undefined') ? animation : this.currentAnimation;
		if (animation)
		{
			var currentTime = 0;
			if (animation === this.currentAnimation)
			{
				if (this.changeToStartFrom === BLENDTOSTART)
				{
					currentTime = this.blendPoseTime;
				}
				else
				{
					currentTime = this.currentSpriterTime;
				}
			}
			else
			{
				currentTime = animation.localTime;
			}
			var mainKeys = animation.mainlineKeys;
			animation.cur_frame = mainKeys.length;
			var secondTime = animation.length;
			for (var k = 1; k < mainKeys.length; k++)
			{
				if (currentTime < mainKeys[k].time)
				{
					secondTime = mainKeys[k].time;
					animation.cur_frame = k - 1;
					break;
				}
			}
			var firstTime = 0;
			if (animation === this.currentAnimation)
			{
				this.currentAdjustedTime = currentTime;
			}
			if (animation.cur_frame < 0)
			{
				animation.cur_frame = 0;
			}
			else if (animation.cur_frame >= animation.mainlineKeys.length)
			{
				animation.cur_frame = animation.mainlineKeys.length - 1;
			}
			var mainKey = mainKeys[animation.cur_frame];
			if (mainKey)
			{
				firstTime = mainKey.time;
				if (animation === this.currentAnimation)
				{
					var t = getT(firstTime, secondTime, this.currentSpriterTime);
					this.currentAdjustedTime = cr.lerp(firstTime, secondTime, trueT(mainKey, t));
				}
				else
				{
					var t = getT(firstTime, secondTime, animation.localTime);
					if (this.changeToStartFrom === BLENDTOSTART)
					{
						animation.localTime = 0;
					}
					else
					{
						animation.localTime = cr.lerp(firstTime, secondTime, trueT(mainKey, t));
					}
				}
			}
		}
	};
	instanceProto.doSecondAnimation = function()
	{
		return this.animBlend !== 0 && this.secondAnimation;
	}
	function shortestSpin(a, b)
	{
		if (a === b)
			return 0;
		var pi = 3.141592653589793;
		var rad = pi * 2;
		while (b - a < -pi)
		{
			a -= rad;
		}
		while (b - a > pi)
		{
			b -= rad;
		}
		return b > a ? -1 : 1;
	}
	instanceProto.tweenBone = function(bone, tweenedBones, animation, bones, currentIndex, currentTime, nextTime, key)
	{
		var nextBone = null;
		var nextFrame = null;
		var timelineIndex;
		var parent = bone.parent;
		if (bone.type == "reference")
		{
			var refTimeline = animation.timelines[bone.timeline];
			var timelineName = refTimeline.name;
			timelineIndex = bone.timeline;
			var refKey = refTimeline.keys[bone.key];
			var refKeyIndex = bone.key;
			lastTime = refKey.time;
			var nextFrame = null;
			var keysLength = refTimeline.keys.length;
			bone = refKey.bones[0];
			if (keysLength > 1)
			{
				if (refKeyIndex + 1 >= keysLength && animation.looping == "true")
				{
					nextFrame = refTimeline.keys[0];
					nextTime = nextFrame.time;
					if (currentTime > lastTime)
					{
						nextTime += animation.length;
					}
					nextBone = nextFrame.bones[0];
				}
				else if (refKeyIndex + 1 < keysLength)
				{
					nextFrame = refTimeline.keys[refKeyIndex + 1];
					nextTime = nextFrame.time;
					nextBone = nextFrame.bones[0];
				}
			}
			var mirror_factor = (this.xFlip == 1 ? -1 : 1);
			var flip_factor = (this.yFlip == 1 ? -1 : 1);
			var flipMe = 1;
			var parentBone = "";
			if (nextBone && refKey.curveType !== "instant")
			{
				var lastTime = refKey.time;
				var t = 0;
				if (currentTime < lastTime)
				{
					lastTime -= animation.length;
				}
				if (nextTime > lastTime)
				{
					t = (currentTime - lastTime) / (nextTime - lastTime);
				}
				t = trueT(refKey, t);
				tweenedBones[currentIndex] = TweenedSpriterObject(bone, nextBone, t, refKey.spin);
			}
			else
			{
				tweenedBones[currentIndex] = CloneObject(bone);
			}
			refTimeline.currentMappedState = CloneObject(tweenedBones[currentIndex]);
			if (animation === this.currentAnimation)
			{
				if (this.animBlend !== 0 && this.secondAnimation)
				{
					var secondTimeline = this.timelineFromName(refTimeline.name, this.secondAnimation);
					if (secondTimeline)
					{
						var secondBone = secondTimeline.currentObjectState;
						if (secondBone)
						{
							var firstBone = tweenedBones[currentIndex];
							tweenedBones[currentIndex] = TweenedSpriterObject(firstBone, secondBone, this.animBlend, shortestSpin(firstBone.angle, secondBone.angle));
						}
					}
				}
			}
			if (parent > -1)
			{
				if (animation === this.currentAnimation)
				{
					flipMe = tweenedBones[parent].xScale * tweenedBones[parent].yScale;
				}
				parentBone = tweenedBones[parent];
			}
			else
			{
				if (animation === this.currentAnimation)
				{
					tweenedBones[currentIndex].x *= mirror_factor * this.scaleRatio;
					tweenedBones[currentIndex].y *= flip_factor * this.scaleRatio;
					tweenedBones[currentIndex].xScale *= mirror_factor * this.scaleRatio;
					tweenedBones[currentIndex].yScale *= flip_factor * this.scaleRatio;
					parentBone = this.objFromInst(this);
					parentBone.xScale *= this.subEntScaleX;
					parentBone.yScale *= this.subEntScaleY;
					flipMe = mirror_factor * flip_factor;
				}
			}
			if (animation === this.currentAnimation)
			{
				tweenedBones[currentIndex] = this.mapObjToObj(parentBone, tweenedBones[currentIndex], flipMe);
			}
			var overrideComponents = this.objectOverrides[timelineName];
			if (typeof overrideComponents !== "undefined")
			{
				for (var component in overrideComponents)
				{
					switch (component)
					{
						case COMPONENTANGLE:
							tweenedBones[currentIndex].angle = cr.to_radians(overrideComponents[component]);
							this.force = true;
							break;
						case COMPONENTX:
							tweenedBones[currentIndex].x = overrideComponents[component];
							this.force = true;
							break;
						case COMPONENTY:
							tweenedBones[currentIndex].y = overrideComponents[component];
							this.force = true;
							break;
						case COMPONENTSCALEX:
							tweenedBones[currentIndex].xScale = overrideComponents[component];
							this.force = true;
							break;
						case COMPONENTSCALEY:
							tweenedBones[currentIndex].yScale = overrideComponents[component];
							this.force = true;
							break;
						default:
							break;
					}
				}
			}
			var ikOverride = this.boneIkOverrides[timelineName];
			if (typeof ikOverride !== "undefined")
			{
				var tweenedChildBone = {};
				var childRefTimeline = {};
				var childTimelineName = "";
				for (var i = currentIndex + 1; i < key.bones.length; i++)
				{
					var childBone = key.bones[i];
					childRefTimeline = animation.timelines[childBone.timeline];
					childTimelineName = childRefTimeline.name;
					if (childTimelineName === ikOverride.childBone)
					{
						this.tweenBone(childBone, tweenedBones, animation, bones, i, currentTime, nextTime, key);
						tweenedChildBone = tweenedBones[i];
						this.force = true;
						break;
					}
				}
				childRefTimeline.currentObjectState = this.applyIk(ikOverride.targetX, ikOverride.targetY, ikOverride.additionalLength, tweenedBones[currentIndex],
					childRefTimeline.currentObjectState, childRefTimeline.currentMappedState, this.boneWidthArray[childTimelineName], currentTime, nextTime, key);
				tweenedBones[i] = childRefTimeline.currentObjectState;
			}
			refTimeline.currentObjectState = CloneObject(tweenedBones[currentIndex]);
		}
	}
	instanceProto.currentTweenedBones = function(animation)
	{
		var tweenedBones = [];
		animation = (typeof animation !== 'undefined') ? animation : this.currentAnimation;
		var key = animation.mainlineKeys[animation.cur_frame];
		var nextTime = 0;
		var currentTime = 0;
		this.clearAnimationState();
		if (animation === this.currentAnimation)
		{
			if (this.changeToStartFrom === BLENDTOSTART)
			{
				currentTime = this.blendPoseTime;
			}
			else
			{
				currentTime = this.currentAdjustedTime;
			}
		}
		else
		{
			currentTime = animation.localTime;
		}
		for (var i = 0; i < key.bones.length; i++)
		{
			var bone = key.bones[i];
			if (!tweenedBones[i])
			{
				this.tweenBone(bone, tweenedBones, animation, key.bones, i, currentTime, nextTime, key);
			}
		}
		return tweenedBones;
	};
	instanceProto.tick = function()
	{
		if (this.doGetFromPreload)
		{
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.readyForSetup, this);
			this.doGetFromPreload = false;
		}
		this.objectOverrides = {};
		this.boneIkOverrides = {};
	}
	instanceProto.tick2 = function(ticklessRefresh)
	{
		if(this.entities.length == 0)
		{
			if((!this.getCharacterFromPreload()) && this.runtime.isWKWebView)
			{
				var self = this;
				this.runtime.fetchLocalFileViaCordovaAsText(this.properties[0],
				function (str)
				{
					self.ProcessRawTextFile(str);
				},
				function (err)
				{
					console.log(err);
				});
			}
		}
		if (this.secondAnimation === this.currentAnimation && this.currentAnimation)
		{
			this.blendStartTime = 0;
			this.blendEndTime = 0;
			this.blendPoseTime = 0;
			this.secondAnimation = null;
			this.changeAnimTo = 0;
			if (this.changeToStartFrom === BLENDTOSTART)
			{
				this.changeToStartFrom = 0;
			}
			else if (this.changeToStartFrom === BLENDATCURRENTTIMERATIO)
			{
				this.changeToStartFrom = 1;
			}
		}
		if (this.changeAnimTo && !this.inAnimTrigger)
		{
			this.doAnimChange();
		}
		var animation = this.currentAnimation;
		if (!animation || this.inAnimTrigger)
		{
			return;
		}
		var changed = null;
		if (!this.animPlaying)
		{
			if (!this.lastKnownInstDataAsObj || !this.instsEqual(this.lastKnownInstDataAsObj, this))
			{
				changed = true;
				this.lastKnownInstDataAsObj = this.objFromInst(this);
			}
			else
			{
				var currZ = findInArray(this, this.layer.instances);
				if (currZ !== this.lastZ)
				{
					changed = true;
					this.lastZ = currZ;
				}
			}
		}
		if (!changed && this.force)
		{
			changed = true;
		}
		this.force = false;
		var pauseAllButSound = false;
		var pauseAll = false;
		if (this.pauseWhenOutsideBuffer != PAUSENEVER)
		{
			var outsideBuffer = this.isOutsideViewportBox();
			if (outsideBuffer)
			{
				if (this.pauseWhenOutsideBuffer == PAUSEALLOUTSIDEBUFFER)
				{
					pauseAll = true;
				}
				else if (this.pauseWhenOutsideBuffer == PAUSEALLBUTSOUNDOUTSIDEBUFFER)
				{
					pauseAllButSound = true;
				}
				this.setAllInvisible();
			}
		}
		if (this.animPlaying || changed || ticklessRefresh)
		{
			if (this.animPlaying && !ticklessRefresh)
			{
				var animFinished = this.tickCurrentAnimationTime();
				if (animFinished)
				{
					this.animationFinish(this.speedRatio < 0);
					if (this.changeAnimTo && !this.inAnimTrigger && !this.animPlaying)
					{
						this.tick2();
						return;
					}
				}
			}
		}
		else
		{
			return;
		}
		if (pauseAll)
		{
			return;
		}
		animation = this.currentAnimation;
		var c2ObjectArray = this.c2ObjectArray;
		this.setAllCollisionsAndVisibility(false);
		this.setMainlineKeyByTime();
		this.runtime.redraw = true;
		if (!animation.mainlineKeys[animation.cur_frame])
		{
			return;
		}
		if (!pauseAllButSound)
		{
			if (this.animBlend !== 0 && this.secondAnimation)
			{
				if (this.changeToStartFrom === BLENDTOSTART)
				{
					this.secondAnimation.localTime = 0;
				}
				else
				{
					this.secondAnimation.localTime = (this.currentSpriterTime / this.currentAnimation.length) * this.secondAnimation.length;
				}
				this.setMainlineKeyByTime(this.secondAnimation);
				var secondTweenedBones = this.currentTweenedBones(this.secondAnimation);
				this.animateCharacter(secondTweenedBones, this.secondAnimation, false);
			}
			var tweenedBones = this.currentTweenedBones();
			this.animateCharacter(tweenedBones);
		}
		if (this.animPlaying)
		{
			this.animateSounds();
			this.animateEvents();
			this.animateMeta(animation.meta);
		}
		for (var i = 0; i < this.objectsToSet.length; i++)
		{
			var currentObjInstruction = this.objectsToSet[i];
			var timeline = this.timelineFromName(currentObjInstruction.objectName);
			if (timeline && timeline.currentObjectState)
			{
				var setType = currentObjInstruction.setType;
				var objState = timeline.currentObjectState;
				var c2Instances = currentObjInstruction.c2Object;
				var c2Obj
				for (var j = 0; j < c2Instances.length; j++)
				{
					c2Obj = c2Instances[j];
					if (c2Obj)
					{
						if (setType === 0 || setType === 1)
						{
							c2Obj.angle = objState.angle;
						}
						if (setType === 0 || setType === 2)
						{
							c2Obj.x = objState.x;
							c2Obj.y = objState.y;
						}
						c2Obj.set_bbox_changed();
					}
				}
			}
			if (!currentObjInstruction.pin)
			{
				this.objectsToSet.splice(i, 1);
				i--;
			}
		}
	};
	instanceProto.animateCharacter = function(tweenedBones, animation, applyToInstances)
	{
		animation = (typeof animation !== 'undefined') ? animation : this.currentAnimation;
		if (!animation)
		{
			return;
		}
		var cur_frame = animation.cur_frame;
		var object;
		var objectRef;
		var nextObject = null;
		var lastTime = 0;
		var nextTime = 0;
		var myx = 0;
		var myy = 0;
		var w = 0;
		var h = 0;
		var layer = this.layer;
		var entity = this.entity;
		var zIndex = this.get_zindex();
		applyToInstances = (typeof applyToInstances !== 'undefined') ? applyToInstances : true;
		var key = animation.mainlineKeys[animation.cur_frame];
		var refKey;
		var instances = layer.instances;
		var currentTime = 0;
		if (animation === this.currentAnimation)
		{
			if (this.changeToStartFrom === BLENDTOSTART)
			{
				currentTime = this.blendPoseTime;
			}
			else
			{
				currentTime = this.currentAdjustedTime;
			}
		}
		else
		{
			currentTime = animation.localTime;
		}
		if (applyToInstances && !this.drawSelf)
		{
			var zOrder = [];
			for (var i = 0; i < key.objects.length; i++)
			{
				object = key.objects[i];
				if (object.type == "reference")
				{
					var refTimeline = animation.timelines[object.timeline];
					var c2Obj = refTimeline.c2Object;
					if (c2Obj)
					{
						var inst = c2Obj.inst;
						if (inst && (this.setLayersForSprites || inst.layer == this.layer))
						{
							var currZ = findInArray(inst, instances);
							if (currZ >= 1 && currZ <= zIndex)
							{
								instances.splice(currZ, 1);
								zIndex--;
							}
						}
					}
				}
			}
			var tempZ = findInArray(this, instances);
			if (zIndex != tempZ)
			{
				instances.splice(tempZ, 1);
				if (tempZ < zIndex)
				{
					zIndex--;
				}
				instances.splice(zIndex, 0, this);
				layer.setZIndicesStaleFrom(0);
				this.zindex = zIndex;
			}
		}
		var zCounter = 0;
		for (var i = 0; i < key.objects.length; i++)
		{
			object = key.objects[i];
			objectRef = key.objects[i];
			nextObject = null;
			var nextFrame = null;
			var timelineIndex;
			if (object.type == "reference")
			{
				var refTimeline = animation.timelines[object.timeline];
				timelineIndex = object.timeline;
				refKey = refTimeline.keys[object.key];
				var refKeyIndex = object.key;
				lastTime = refKey.time;
				var nextFrame = null;
				var keysLength = refTimeline.keys.length;
				object = refKey.objects[0];
				if (keysLength > 1)
				{
					if (refKeyIndex + 1 >= keysLength && animation.looping == "true")
					{
						nextFrame = refTimeline.keys[0];
						nextTime = nextFrame.time;
						if (currentTime > lastTime)
						{
							nextTime += animation.length;
						}
						nextObject = nextFrame.objects[0];
					}
					else if (refKeyIndex + 1 < keysLength)
					{
						nextFrame = refTimeline.keys[refKeyIndex + 1];
						nextTime = nextFrame.time;
						nextObject = nextFrame.objects[0];
					}
				}
			}
			myx = this.x;
			myy = this.y;
			var c2Obj = refTimeline.c2Object;
			if (c2Obj || refTimeline.objectType === "point")
			{
				var inst;
				if (c2Obj)
				{
					inst = c2Obj.inst;
				}
				else
				{
					inst = null;
				}
				if ((inst || this.drawSelf) || refTimeline.objectType === "point" || refTimeline.objectType === "entity")
				{
					if (applyToInstances && inst)
					{
						inst.collisionsEnabled = true;
						inst.visible = this.visible;
						if (this.setLayersForSprites)
						{
							this.MoveToLayer(inst, this.layer);
						}
					}
					var tweenedObj = null;
					if (nextObject && key.curveType !== "instant" && refKey.curveType !== "instant")
					{
						var t = 0;
						if (currentTime < lastTime)
						{
							lastTime -= animation.length;
						}
						if ((nextTime - lastTime) > 0)
						{
							t = (currentTime - lastTime) / (nextTime - lastTime);
						}
						t = trueT(refKey, t);
						tweenedObj = TweenedSpriterObject(object, nextObject, t, refKey.spin);
					}
					else
					{
						tweenedObj = CloneObject(object);
					}
					if (applyToInstances && c2Obj && c2Obj.spriterType == "sprite")
					{
						tweenedObj.frame = SetSpriteAnimFrame(inst, object.frame, c2Obj);
					}
					if (inst)
					{
						var cur_frame = inst.curFrame;
					}
					var mirror_factor = (this.xFlip == 1 ? -1 : 1);
					var flip_factor = (this.yFlip == 1 ? -1 : 1);
					var parent = objectRef.parent;
					refTimeline.currentMappedState = CloneObject(tweenedObj);
					if (animation === this.currentAnimation)
					{
						if (this.animBlend !== 0 && this.secondAnimation)
						{
							var secondTimeline = this.timelineFromName(refTimeline.name, this.secondAnimation);
							if (secondTimeline)
							{
								var secondBone = secondTimeline.currentObjectState;
								if (secondBone)
								{
									var firstBone = tweenedObj;
									tweenedObj = TweenedSpriterObject(firstBone, secondBone, this.animBlend, shortestSpin(firstBone.angle, secondBone.angle));
									if (this.animBlend > 0.5)
									{
										tweenedObj.frame = SetSpriteAnimFrame(inst, secondTimeline.currentObjectState.frame, c2Obj);
									}
								}
							}
						}
					}
					if (animation === this.currentAnimation)
					{
						var flip = false;
						if (parent > -1)
						{
							tweenedObj = this.mapObjToObj(tweenedBones[parent], tweenedObj, tweenedBones[parent].xScale * tweenedBones[parent].yScale);
							tweenedObj.xScale *= mirror_factor;
							tweenedObj.yScale *= flip_factor;
							flip = tweenedBones[parent].xScale < 0;
						}
						else
						{
							tweenedObj.x *= mirror_factor * this.scaleRatio * this.subEntScaleX;
							tweenedObj.y *= flip_factor * this.scaleRatio * this.subEntScaleY;
							tweenedObj.xScale *= this.subEntScaleX;
							tweenedObj.yScale *= this.subEntScaleY;
							tweenedObj = this.mapObjToObj(this.objFromInst(this), tweenedObj, mirror_factor * flip_factor);
							flip = mirror_factor < 0;
						}
						if (refTimeline.objectType === "point" && flip)
						{
							tweenedObj.angle = tweenedObj.angle - cr.to_radians(180);
						}
					}
					var overrodeImage = false;
					if ((inst || (this.drawSelf && c2Obj)) && applyToInstances)
					{
						overrodeImage = this.applyObjToInst(tweenedObj, inst, parent > -1, c2Obj);
					}
					refTimeline.currentObjectState = tweenedObj;
					if (this.drawSelf && parent == -1)
					{
						refTimeline.currentObjectState.xScale *= this.scaleRatio;
						refTimeline.currentObjectState.yScale *= this.scaleRatio;
					}
					if (!overrodeImage)
					{
						refTimeline.currentObjectState.frame = refTimeline.currentMappedState.frame;
					}
					if (this.drawSelf)
					{
						if (tweenedObj.defaultPivot)
						{
							var curPivot = c2Obj.obj.pivots[refTimeline.currentObjectState.frame];
							if (!curPivot)
							{
								curPivot = c2Obj.obj.pivots[0];
							}
							if (curPivot)
							{
								refTimeline.currentObjectState.pivotX = curPivot.x;
								refTimeline.currentObjectState.pivotY = curPivot.y;
							}
						}
					}
					this.animateMeta(refTimeline.meta);
					if (inst && applyToInstances && (this.setLayersForSprites || inst.layer == this.layer))
					{
						var instZOrder = zIndex + 1 + zCounter++;
						if (instances[instZOrder] !== inst)
						{
							var currInstanceZ = findInArray(inst, instances);
							if (currInstanceZ >= 0)
							{
								instances.splice(currInstanceZ, 1);
							}
							instances.splice(instZOrder, 0, inst);
							inst.zorder = instZOrder;
							layer.setZIndicesStaleFrom(0);
						}
					}
				}
			}
		}
	};
	instanceProto.animateSounds = function()
	{
		var anim = this.currentAnimation;
		if (anim)
		{
			for (var s = 0; s < anim.soundlines.length; s++)
			{
				var soundLine = anim.soundlines[s];
				if (soundLine)
				{
					this.animateSound(soundLine, anim.length);
					if (anim != this.currentAnimation)
					{
						return;
					}
				}
			}
		}
	}
	instanceProto.animateMeta = function(meta, anim)
	{
		anim = (typeof anim !== 'undefined') ? anim : this.currentAnimation;
		if (anim)
		{
			this.animateTag(meta.tagline, anim.length, anim);
			for (var s = 0; s < meta.varlines.length; s++)
			{
				var varLine = meta.varlines[s];
				if (varLine)
				{
					this.animateVar(varLine, anim.length, anim);
				}
			}
		}
	}
	instanceProto.animateEvents = function()
	{
		var anim = this.currentAnimation;
		if (anim)
		{
			for (var s = 0; s < anim.eventlines.length; s++)
			{
				var eventLine = anim.eventlines[s];
				if (eventLine)
				{
					this.animateEvent(eventLine, anim.length);
					if (this.currentAnimation != anim)
					{
						return;
					}
				}
			}
		}
	}
	instanceProto.testTriggerTime = function(lastTime, time, triggerTime)
	{
		if (time == triggerTime)
		{
			return true;
		}
		else if (triggerTime == lastTime || lastTime == time)
		{
			return false;
		}
		else if (this.speedRatio > 0)
		{
			if (lastTime < time)
			{
				if (triggerTime > lastTime && triggerTime < time)
				{
					return true;
				}
			}
			else
			{
				if (triggerTime > lastTime || triggerTime < time)
				{
					return true;
				}
			}
		}
		else
		{
			if (lastTime > time)
			{
				if (triggerTime > time && triggerTime < lastTime)
				{
					return true;
				}
			}
			else
			{
				if (triggerTime > time || triggerTime < lastTime)
				{
					return true;
				}
			}
		}
		return false;
	}
	instanceProto.animateSound = function(soundline, animLength, anim)
	{
		var soundKeys = soundline.keys;
		var curSoundFrame = soundKeys.length;
		var secondTime = animLength;
		var curSoundKey = soundKeys[0];
		var curSound;
		this.animateMeta(soundline.meta);
		for (var k = 1; k < soundKeys.length; k++)
		{
			if (this.currentAdjustedTime < soundKeys[k].time)
			{
				secondTime = soundKeys[k].time;
				curSoundFrame = k - 1;
				curSoundKey = soundKeys[curSoundFrame];
				break;
			}
		}
		if (curSoundKey && curSoundKey.objects && curSoundKey.objects[0])
		{
			curSound = curSoundKey.objects[0];
		}
		anim = (typeof anim !== 'undefined') ? anim : this.currentAnimation;
		var keysLength = soundline.keys.length;
		var nextFrame;
		var nextTime;
		var nextObject;
		if (keysLength > 1)
		{
			if (curSoundFrame + 1 >= keysLength && anim.looping == "true")
			{
				nextFrame = soundline.keys[0];
				nextTime = nextFrame.time;
				if (this.currentSpriterTime > lastTime)
				{
					nextTime += anim.length;
				}
				nextObject = nextFrame.objects[0];
			}
			else if (curSoundFrame + 1 < keysLength)
			{
				nextFrame = soundline.keys[curSoundFrame + 1];
				nextTime = nextFrame.time;
				nextObject = nextFrame.objects[0];
			}
		}
		var time = this.currentAdjustedTime;
		var lastTime = soundline.lastTimeSoundCheck;
		var soundlinesToRun = [];
		if (time != lastTime)
		{
			for (var k = 0; k < soundKeys.length; k++)
			{
				var soundKey = soundKeys[k];
				if (soundKey)
				{
					var soundToPlay = soundKey.objects[0];
					if (soundToPlay)
					{
						if (this.testTriggerTime(lastTime, time, soundKey.time))
						{
							soundlinesToRun.push(
							{
								"soundline": soundline,
								"name": soundToPlay.name
							});
						}
					}
				}
			}
		}
		for (const soundline of soundlinesToRun)
		{
			this.playSound(soundline.soundline, soundline.name);
		}
		var tweenedSound;
		if (nextObject)
		{
			var t = 0;
			var lastTime = curSoundKey.time;
			if (this.currentAdjustedTime < lastTime)
			{
				lastTime -= anim.length;
			}
			var t = getT(lastTime, nextTime, this.currentAdjustedTime);
			tweenedSound = TweenedSpriterSound(curSound, nextObject, trueT(curSoundKey, t));
		}
		else
		{
			tweenedSound = this.cloneSound(curSound);
		}
		this.changeVolume(soundline, tweenedSound.volume);
		this.changePanning(soundline, tweenedSound.panning);
		soundline.lastTimeSoundCheck = this.currentAdjustedTime;
		soundline.currentObjectState = tweenedSound;
	}
	instanceProto.animateEvent = function(eventline, animLength, anim)
	{
		var eventKeys = eventline.keys;
		var curEventFrame = eventKeys.length;
		var secondTime = animLength;
		var curEventKey = eventKeys[0];
		var curEvent;
		this.animateMeta(eventline.meta);
		for (var k = 1; k < eventKeys.length; k++)
		{
			if (this.currentAdjustedTime < eventKeys[k].time)
			{
				secondTime = eventKeys[k].time;
				curEventFrame = k - 1;
				curEventKey = eventKeys[curEventFrame];
				break;
			}
		}
		if (curEventKey && curEventKey.objects && curEventKey.objects[0])
		{
			curEvent = curEventKey.objects[0];
		}
		anim = (typeof anim !== 'undefined') ? anim : this.currentAnimation;
		var keysLength = eventline.keys.length;
		var nextFrame;
		var nextTime;
		if (keysLength > 1)
		{
			if (curEventFrame + 1 >= keysLength && anim.looping == "true")
			{
				nextFrame = eventline.keys[0];
				nextTime = nextFrame.time;
				if (this.currentSpriterTime > lastTime)
				{
					nextTime += anim.length;
				}
			}
			else if (curEventFrame + 1 < keysLength)
			{
				nextFrame = eventline.keys[curEventFrame + 1];
				nextTime = nextFrame.time;
			}
		}
		var time = this.currentAdjustedTime;
		var lastTime = eventline.lastTimeEventCheck;
		var eventlinesToRun = [];
		if (time != lastTime)
		{
			for (var k = 0; k < eventKeys.length; k++)
			{
				var eventKey = eventKeys[k];
				if (eventKey)
				{
					if (this.testTriggerTime(lastTime, time, eventKey.time))
					{
						eventlinesToRun.push(eventline);
					}
				}
			}
		}
		for (const eventline of eventlinesToRun)
		{
			this.playEvent(eventline);
		}
		eventline.lastTimeEventCheck = this.currentAdjustedTime;
	}
	instanceProto.animateVar = function(varline, animLength, anim)
	{
		anim = (typeof anim !== 'undefined') ? anim : this.currentAnimation;
		var time = this.currentAdjustedTime;
		var varKeys = varline.keys;
		var firstVarFrame = -1;
		var secondVarFrame = -1;
		var firstTime = 0;
		var secondTime = 0;
		var firstVal = 0;
		var secondVal = 0;
		var type = varline.def.type;
		var firstKey;
		varline.lastTagIndex = 0;
		varline.currentVal = varline.def.def;
		if (varKeys.length === 0)
		{
			return;
		}
		if (varKeys.length > 1)
		{
			for (var k = 0; k < varKeys.length; k++)
			{
				if (time === varKeys[k].time)
				{
					varline.lastTagIndex = k;
					varline.currentVal = varKeys[k].val;
					return;
				}
				else if (time < varKeys[k].time)
				{
					if (k > 0)
					{
						firstVarFrame = k - 1;
						secondVarFrame = k;
					}
					else if (anim.looping === "true")
					{
						firstVarFrame = varKeys.length - 1;
						secondVarFrame = 0;
					}
					else
					{
						return;
					}
					if (firstVarFrame > -1)
					{
						firstKey = varKeys[firstVarFrame];
						var secondKey = varKeys[secondVarFrame];
						firstTime = firstKey.time;
						secondTime = secondKey.time;
						firstVal = firstKey.val;
						secondVal = secondKey.val;
						break;
					}
				}
				else if (k == varKeys.length - 1)
				{
					if (anim.looping === "true")
					{
						firstVarFrame = k;
						secondVarFrame = 0;
						firstKey = varKeys[firstVarFrame];
						var secondKey = varKeys[secondVarFrame];
						firstTime = firstKey.time;
						secondTime = secondKey.time;
						firstVal = firstKey.val;
						secondVal = secondKey.val;
					}
					else
					{
						varline.lastTagIndex = k;
						varline.currentVal = varKeys[k].val;
						return;
					}
				}
			}
		}
		else
		{
			varline.lastTagIndex = 0;
			varline.currentVal = varKeys[0].val;
			return;
		}
		varline.lastTagIndex = firstVarFrame;
		if (type === "string")
		{
			varline.currentVal = firstVal;
			return;
		}
		if (firstTime > time)
		{
			firstTime -= anim.length;
		}
		if (secondTime < time)
		{
			secondTime += anim.length;
		}
		var t = getT(firstTime, secondTime, time);
		varline.currentVal = cr.lerp(firstVal, secondVal, trueT(firstKey, t));
		if (type === "int")
		{
			varline.currentVal = Math.floor(varline.currentVal);
		}
	}
	instanceProto.animateTag = function(tagline, animLength, anim)
	{
		var tagKeys = tagline.keys;
		var curTagFrame = tagKeys.length;
		var secondTime = animLength;
		var curTagKey = tagKeys[0];
		if (curTagKey && curTagKey.time > this.currentAdjustedTime && anim.looping == "true")
		{
			curTagKey = tagKeys[tagKeys.length - 1];
		}
		var curTags = [];
		for (var k = 1; k < tagKeys.length; k++)
		{
			if (this.currentAdjustedTime < tagKeys[k].time)
			{
				secondTime = tagKeys[k].time;
				curTagFrame = k - 1;
				curTagKey = tagKeys[curTagFrame];
				break;
			}
			else if(k == tagKeys.length - 1 && this.currentAdjustedTime >= tagKeys[k].time)
			{
				curTagFrame = k;
				curTagKey = tagKeys[curTagFrame];
			}
		}
		if (curTagKey)
		{
			curTags = curTagKey.tags;
		}
		tagline.lastTagIndex = curTagFrame;
		tagline.currentTags = curTags;
	}
	instanceProto.draw = function(ctx)
	{
		if (!this.drawSelf)
		{
			return;
		}
		ctx.globalAlpha = this.opacity;
		var cur_frame = this.type.animations[0].frames[0];
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		var widthfactor = w > 0 ? 1 : -1;
		var heightfactor = h > 0 ? 1 : -1;
		var mirror_factor = (this.xFlip == 1 ? -1 : 1);
		var flip_factor = (this.yFlip == 1 ? -1 : 1);
		var object = null;
		var animation = (typeof animation !== 'undefined') ? animation : this.currentAnimation;
		var cur_frame = animation.cur_frame;
		if (this.currentAnimation)
		{
			var key = this.currentAnimation.mainlineKeys[this.currentAnimation.cur_frame];
			if (key)
			{
				for (var i = 0; i < key.objects.length; i++)
				{
					object = key.objects[i];
					if (object.type == "reference")
					{
						var refTimeline = animation.timelines[object.timeline];
						var objState = refTimeline.currentObjectState;
						if (objState && typeof objState.frame !== 'undefined' && objState.frame > -1)
						{
							var obj = refTimeline.object;
							if (obj)
							{
								var atlasInfo = obj.imageSizes[objState.frame];
								var angle = objState.angle;
								var drawx = 0;
								var drawy = 0;
								ctx.save();
								ctx.translate(objState.x, objState.y);
								if (widthfactor !== 1 || heightfactor !== 1)
								{
									ctx.scale(widthfactor, heightfactor);
								}
								if (mirror_factor !== 1 || flip_factor !== 1)
								{
									ctx.scale(mirror_factor, flip_factor);
								}
								var absPivotX = objState.pivotX * atlasInfo.w;
								drawx = atlasInfo.atlasXOff - absPivotX;
								if (atlasInfo.atlasRotated)
								{
									var reverseAbsPivotY = (1.0 - objState.pivotY) * atlasInfo.h;
									var reverseXOff = atlasInfo.h - (atlasInfo.atlasYOff + atlasInfo.atlasH);
									angle -= cr.to_radians(90);
									drawy = reverseXOff - reverseAbsPivotY;
								}
								else
								{
									var absPivotY = objState.pivotY * atlasInfo.h;
									drawy = atlasInfo.atlasYOff - absPivotY;
								}
								drawx *= objState.xScale;
								drawy *= objState.yScale;
								if (mirror_factor * flip_factor == -1)
								{
									if (atlasInfo.atlasRotated)
									{
										angle -= cr.to_radians(180);
									}
									angle *= -1;
								}
								ctx.rotate(angle * widthfactor * heightfactor);
								if (atlasInfo.atlasRotated)
								{
									ctx.drawImage(cur_image,
										atlasInfo.atlasX,
										atlasInfo.atlasY,
										atlasInfo.atlasH,
										atlasInfo.atlasW,
										drawy, drawx,
										atlasInfo.atlasH * this.scaleRatio,
										atlasInfo.atlasW * this.scaleRatio);
								}
								else
								{
									ctx.drawImage(cur_image,
										atlasInfo.atlasX,
										atlasInfo.atlasY,
										atlasInfo.atlasW,
										atlasInfo.atlasH,
										drawx, drawy,
										atlasInfo.atlasW * this.scaleRatio,
										atlasInfo.atlasH * this.scaleRatio);
								}
								ctx.restore();
							}
						}
					}
				}
			}
		}
	}
	instanceProto.drawGL = function(glw)
	{
		if (!this.drawSelf)
		{
			return;
		}
		glw.setOpacity(this.opacity);
		var cur_frame = this.type.animations[0].frames[0];
		var cur_image = cur_frame.texture_img;
		var webGL_texture = this.runtime.glwrap.loadTexture(cur_image, false, this.runtime.linearSampling, cur_frame.pixelformat);
		glw.setTexture(webGL_texture);
		var mirror_factor = (this.xFlip == 1 ? -1 : 1);
		var flip_factor = (this.yFlip == 1 ? -1 : 1);
		var object = null;
		var uv = {};
		uv.left = 0;
		uv.top = 0;
		uv.right = 1;
		uv.bottom = 1;
		var animation = this.currentAnimation;
		if (animation)
		{
			var key = animation.mainlineKeys[animation.cur_frame];
			if (key)
			{
				for (var i = 0; i < key.objects.length; i++)
				{
					object = key.objects[i];
					if (object.type == "reference")
					{
						var refTimeline = animation.timelines[object.timeline];
						var objState = refTimeline.currentObjectState;
						if (objState && typeof objState.frame !== 'undefined' && objState.frame > -1)
						{
							var obj = refTimeline.object;
							if (obj)
							{
								var atlasInfo = obj.imageSizes[objState.frame];
								var angle = objState.angle;
								if (mirror_factor * flip_factor == -1)
								{
									angle -= cr.to_radians(180);
									if (!atlasInfo.atlasRotated)
									{
										angle *= -1;
										angle = cr.to_radians(180) - angle;
									}
								}
								uv.left = (atlasInfo.atlasX) / cur_image.width;
								uv.top = (atlasInfo.atlasY) / cur_image.height;
								var w = 0;
								var h = 0;
								if (atlasInfo.atlasRotated)
								{
									angle -= cr.to_radians(90);
									w += atlasInfo.atlasH;
									h += atlasInfo.atlasW;
								}
								else
								{
									w += atlasInfo.atlasW;
									h += atlasInfo.atlasH;
								}
								uv.right = ((atlasInfo.atlasX) + w) / cur_image.width;
								uv.bottom = ((atlasInfo.atlasY) + h) / cur_image.height;
								if (mirror_factor == -1)
								{
									var temp = uv.left;
									uv.left = uv.right;
									uv.right = temp;
								}
								if (flip_factor == -1)
								{
									var temp = uv.top;
									uv.top = uv.bottom;
									uv.bottom = temp;
								}
								var cur_frame = this.curFrame;
								var bbox = new cr.rect(0, 0, 0, 0);
								var bquad = new cr.quad();
								var absPivotX = (objState.pivotX * atlasInfo.w) * objState.xScale;
								var xOff = objState.xScale * atlasInfo.atlasXOff;
								var absPivotY = (objState.pivotY * atlasInfo.h) * objState.yScale;
								var yOff = objState.yScale * atlasInfo.atlasYOff;
								var reverseAbsPivotX = ((1.0 - objState.pivotX) * atlasInfo.w) * objState.xScale;
								var reverseXOff = objState.xScale * (atlasInfo.w - (atlasInfo.atlasXOff + atlasInfo.atlasW));
								var reverseAbsPivotY = ((1.0 - objState.pivotY) * atlasInfo.h) * objState.yScale;
								var reverseYOff = objState.yScale * (atlasInfo.h - (atlasInfo.atlasYOff + atlasInfo.atlasH));
								var offsetX = 0;
								var offsetY = 0;
								if (atlasInfo.atlasRotated)
								{
									bbox.set(objState.x, objState.y, objState.x + (atlasInfo.atlasH * objState.yScale), objState.y + (atlasInfo.atlasW * objState.xScale));
									if (mirror_factor == -1)
									{
										offsetX = yOff - absPivotY;
									}
									else
									{
										offsetX = reverseYOff - reverseAbsPivotY;
									}
									if (flip_factor == -1)
									{
										offsetY = reverseXOff - reverseAbsPivotX;
									}
									else
									{
										offsetY = xOff - absPivotX;
									}
								}
								else
								{
									bbox.set(objState.x, objState.y, objState.x + (atlasInfo.atlasW * objState.xScale), objState.y + (atlasInfo.atlasH * objState.yScale));
									if (mirror_factor == -1)
									{
										offsetX = reverseXOff - reverseAbsPivotX;
									}
									else
									{
										offsetX = xOff - absPivotX;
									}
									if (flip_factor == -1)
									{
										offsetY = reverseYOff - reverseAbsPivotY;
									}
									else
									{
										offsetY = yOff - absPivotY;
									}
								}
								bbox.offset(offsetX, offsetY);
								bbox.offset(-objState.x, -objState.y); // translate to origin
								bquad.set_from_rotated_rect(bbox, angle); // rotate around origin
								bquad.offset(objState.x, objState.y); // translate back to original position
								bquad.bounding_box(bbox);
								bbox.normalize();
								var q = bquad;
								glw.setOpacity(this.opacity * objState.a);
								glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, uv);
							}
						}
					}
				}
			}
		}
	}
	instanceProto.playSound = function(soundLine, name)
	{
		this.soundToTrigger = name;
		this.soundLineToTrigger = soundLine;
		this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnSoundTriggered, this);
	}
	instanceProto.playEvent = function(eventLine)
	{
		this.eventToTrigger = eventLine.name;
		this.eventLineToTrigger = eventLine;
		this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnEventTriggered, this);
	}
	instanceProto.changeVolume = function(soundLine, newVolume)
	{
		if (soundLine.currentObjectState.volume != newVolume)
		{
			soundLine.currentObjectState.volume = newVolume;
			this.soundToTrigger = "";
			this.soundLineToTrigger = soundLine;
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnSoundVolumeChangeTriggered, this);
		}
	}
	instanceProto.changePanning = function(soundLine, newPanning)
	{
		if (soundLine.currentObjectState.panning != newPanning)
		{
			soundLine.currentObjectState.panning = newPanning;
			this.soundToTrigger = "";
			this.soundLineToTrigger = soundLine;
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnSoundPanningChangeTriggered, this);
		}
	}
	function findObjectItemInArray(name, objectArray, entityName)
	{
		for (var o = 0; o < objectArray.length; o++)
		{
			var obj = objectArray[o];
			if (obj && (obj.name === name || (obj.entityName === entityName && obj.originalName === name)))
			{
				return o;
			}
		}
		return -1;
	}
	function objectFromArray(name, objectArray, entityName)
	{
		for (var o = 0; o < objectArray.length; o++)
		{
			var obj = objectArray[o];
			if (obj && (obj.name === name || (obj.entityName === entityName && obj.originalName === name)))
			{
				return obj;
			}
		}
	}
	function SpriterObjectArrayItem(spritername, name, entityName, originalName, varDefs)
	{
		this.name = name;
		this.fullTypeName = spritername + "_" + name;
		this.spriterType = "sprite";
		this.frames = [];
		this.pivots = [];
		this.imageSizes = [];
		this.atlasInfos = [];
		this.charMaps = [];
		this.width = 0;
		this.height = 0;
		this.entityName = entityName;
		this.originalName = originalName;
		this.varDefs = varDefs;
	}
	instanceProto.timelineFromName = function(name, anim)
	{
		anim = typeof anim !== 'undefined' ? anim : this.currentAnimation;
		if (anim)
		{
			for (var t = 0; t < anim.timelines.length; t++)
			{
				var timeline = anim.timelines[t];
				if (timeline && timeline.name === name)
				{
					return timeline;
				}
			}
			for (var t = 0; t < anim.soundlines.length; t++)
			{
				var timeline = anim.soundlines[t];
				if (timeline && timeline.name === name)
				{
					return timeline;
				}
			}
			for (var t = 0; t < anim.eventlines.length; t++)
			{
				var timeline = anim.eventlines[t];
				if (timeline && timeline.name === name)
				{
					return timeline;
				}
			}
		}
	}
	instanceProto.tagStatus = function(tagname, meta)
	{
		if (meta)
		{
			for (var t = 0; t < meta.tagline.currentTags.length; t++)
			{
				var tag = meta.tagline.currentTags[t];
				if (tag)
				{
					if (tag == tagname)
					{
						return true;
					}
				}
			}
		}
		return false;
	}
	instanceProto.varStatus = function(ret, varname, meta)
	{
		if (meta)
		{
			for (var v = 0; v < meta.varlines.length; v++)
			{
				var varline = meta.varlines[v];
				if (varline)
				{
					if (varline.def.name == varname)
					{
						if (varline.def.type === "string")
						{
							ret.set_string(varline.currentVal);
						}
						else if (varline.def.type === "int")
						{
							ret.set_int(varline.currentVal);
						}
						else
						{
							ret.set_float(varline.currentVal);
						}
						return;
					}
				}
			}
		}
		ret.set_float(0);
	}
	instanceProto.loadTagDefs = function(json)
	{
		if (json)
		{
			var tags = json["tag_list"];
			if (tags)
			{
				for (var t = 0; t < tags.length; t++)
				{
					var tagDef = tags[t];
					this.tagDefs.push(tagDef["name"]);
				}
			}
		}
	}
	instanceProto.loadVarDefs = function(json, varDefs)
	{
		if (json)
		{
			for (var d = 0; d < json.length; d++)
			{
				var defJson = json[d];
				if (defJson)
				{
					var newVarDef = new VarDef();
					newVarDef.name = defJson.name;
					newVarDef.type = defJson.type;
					newVarDef.def = defJson["default"];
					varDefs.push(newVarDef);
				}
			}
		}
	}
	instanceProto.findSprites = function(xml) //XMLDocument object, name of entityToLoad
		{
			if (!xml)
			{
				return;
			}
			var thisTypeName = this.type.name;
			var att;
			var json = xml; //.spriter_data")[0];
			var folderTags = json["folder"];
			for (var d = 0; d < folderTags.length; d++)
			{
				var folderTag = folderTags[d];
				this.folders.push(new SpriterFolder());
				var fileTags = folderTag["file"];
				for (var f = 0; f < fileTags.length; f++)
				{
					var fileTag = fileTags[f];
					att = fileTag;
					var spriterFile = new SpriterFile();
					spriterFile.fileName = att["name"];
					if (fileTag.hasOwnProperty("pivot_x"))
					{
						spriterFile.pivotX = (att["pivot_x"]);
					}
					if (fileTag.hasOwnProperty("pivot_y"))
					{
						spriterFile.pivotY = 1.0 - (att["pivot_y"]);
					}
					if (fileTag.hasOwnProperty("width"))
					{
						spriterFile.w = (att["width"]);
					}
					if (fileTag.hasOwnProperty("height"))
					{
						spriterFile.h = (att["height"]);
					}
					if (this.drawSelf)
					{
						if (fileTag.hasOwnProperty("ax"))
						{
							spriterFile.atlasX = (att["ax"]);
						}
						if (fileTag.hasOwnProperty("ay"))
						{
							spriterFile.atlasY = (att["ay"]);
						}
						if (fileTag.hasOwnProperty("axoff"))
						{
							spriterFile.atlasXOff = (att["axoff"]);
						}
						if (fileTag.hasOwnProperty("ayoff"))
						{
							spriterFile.atlasYOff = (att["ayoff"]);
						}
						if (fileTag.hasOwnProperty("aw"))
						{
							spriterFile.atlasW = (att["aw"]);
						}
						if (fileTag.hasOwnProperty("ah"))
						{
							spriterFile.atlasH = (att["ah"]);
						}
						if (fileTag.hasOwnProperty("arot"))
						{
							spriterFile.atlasRotated = (att["arot"]) == "true" ? true : false;
						}
					}
					this.folders[d].files.push(spriterFile);
				}
			}
			var objectArray = [];
			var NO_INDEX = -1;
			var entityTags = json["entity"];
			for (var e = 0; e < entityTags.length; e++)
			{
				var entityTag = entityTags[e];
				att = entityTag;
				var objInfoTags = entityTag["obj_info"];
				var charMapTags = entityTag["character_map"];
				var entityName = att.name;
				if (objInfoTags)
				{
					for (var o = 0; o < objInfoTags.length; o++)
					{
						var infoTag = objInfoTags[o];
						if (infoTag)
						{
							var objInfo = new ObjInfo();
							objInfo.name = infoTag["realname"];
							if (!objInfo.name)
							{
								objInfo.name = infoTag["name"];
							}
							this.loadVarDefs(infoTag["var_defs"], objInfo.varDefs);
							this.boneWidthArray[objInfo.name] = infoTag["w"];
							this.objInfoVarDefs.push(objInfo);
						}
						if (infoTag && (infoTag["type"] === "sprite" || infoTag["type"] === "box" || infoTag["type"] === "entity"))
						{
							var typeName = infoTag["name"];
							var originalName = infoTag["realname"];
							var varDefs = [];
							if (infoTag["var_defs"])
							{
								this.loadVarDefs(infoTag["var_defs"], varDefs);
							}
							objectArray.push(new SpriterObjectArrayItem(thisTypeName, typeName, entityName, originalName, varDefs));
							var lastObj = objectArray[objectArray.length - 1];
							if (infoTag["type"] === "box")
							{
								lastObj.width = infoTag["w"];
								lastObj.height = infoTag["h"];
								lastObj.isBox = true;
								lastObj.spriterType = "box";
								var imageSize = {};
								imageSize.w = lastObj.width;
								imageSize.h = lastObj.height;
								lastObj.imageSizes.push(imageSize);
							}
							if (infoTag["type"] === "entity")
							{
								lastObj.spriterType = "entity";
							}
							else if (infoTag["type"] === "sprite")
							{
								var frames = infoTag["frames"];
								if (frames)
								{
									for (var f = 0; f < frames.length; f++)
									{
										var frame = frames[f];
										if (this.folders[frame["folder"]] && this.folders[frame["folder"]].files[frame["file"]])
										{
											lastObj.frames.push(this.folders[frame["folder"]].files[frame["file"]].fileName);
											var pivot = {};
											pivot.x = 0;
											pivot.y = 0;
											pivot.x = this.folders[frame["folder"]].files[frame["file"]].pivotX;
											pivot.y = this.folders[frame["folder"]].files[frame["file"]].pivotY;
											lastObj.pivots.push(pivot);
											var imageSize = {};
											imageSize.w = 1;
											imageSize.h = 1;
											var currentFile = this.folders[frame["folder"]].files[frame["file"]];
											imageSize.w = currentFile.w;
											imageSize.h = currentFile.h;
											if (this.drawSelf)
											{
												imageSize.fileName = currentFile.fileName;
												imageSize.atlasW = currentFile.atlasW;
												imageSize.atlasH = currentFile.atlasH;
												imageSize.atlasX = currentFile.atlasX;
												imageSize.atlasY = currentFile.atlasY;
												imageSize.atlasXOff = currentFile.atlasXOff;
												imageSize.atlasYOff = currentFile.atlasYOff;
												imageSize.atlasRotated = currentFile.atlasRotated;
											}
											lastObj.imageSizes.push(imageSize);
										}
									}
								}
								if (charMapTags)
								{
									for (var c = 0; c < charMapTags.length; c++)
									{
										var charMapTag = charMapTags[c];
										var mapTags = charMapTag["map"];
										if (mapTags)
										{
											for (var m = 0; m < mapTags.length; m++)
											{
												var mapTag = mapTags[m];
												if (typeof mapTag["folder"] !== "undefined" && typeof mapTag["file"] !== "undefined")
												{
													if (this.folders[mapTag["folder"]] && this.folders[mapTag["folder"]].files[mapTag["file"]])
													{
														var charMap = {};
														charMap.oldFrame = lastObj.frames.indexOf(this.folders[mapTag["folder"]].files[mapTag["file"]].fileName);
														if (charMap.oldFrame > -1)
														{
															charMap.newFrame = -1;
															if (typeof mapTag["target_folder"] !== "undefined" && typeof mapTag["target_file"] !== "undefined")
															{
																charMap.newFrame = lastObj.frames.indexOf(this.folders[mapTag["target_folder"]].files[mapTag["target_file"]].fileName);
															}
															if (!lastObj.charMaps[charMapTag["name"]])
															{
																lastObj.charMaps[charMapTag["name"]] = [];
															}
															lastObj.charMaps[charMapTag["name"]].push(charMap);
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return objectArray;
		};
	instanceProto.generateTestC2ObjectArray = function(objectArray)
	{
		var c2Objects = [];
		var types = this.runtime.types;
		for (var o = 0, len = objectArray.length; o < len; o++)
		{
			var c2Object = {};
			c2Object.type = types[objectArray[o].fullTypeName];
			c2Object.spriterType = objectArray[o].spriterType;
			c2Object.inst = null;
			c2Object.appliedMap = [];
			c2Object.obj = objectArray[o];
			c2Objects.push(c2Object);
		}
		return c2Objects;
	};
	instanceProto.cloneSound = function(other)
	{
		var sound = new SpriterSound();
		sound.trigger = other.trigger;
		sound.volume = other.volume;
		sound.panning = other.panning;
		sound.name = other.name;
		return sound;
	};
	instanceProto.cloneObject = function(other)
	{
		var folderIndex = -null;
		var fileIndex = null;
		var fileName = null;
		var NO_INDEX = -1;
		var object = new SpriterObject();
		object.type = other.type;
		object.frame = other.frame;
		object.storedFrame = other.storedFrame;
		object.x = (other.x);
		object.y = -(other.y);
		object.angle = ((other.angle));
		object.a = ((other.a));
		object.angle = other.angle;
		object.xScale = (other.xScale);
		object.yScale = (other.yScale);
		object.pivotX = (other.pivotX);
		object.pivotY = (other.pivotY);
		object.entity = other.entity;
		object.animation = other.animation;
		object.t = other.t;
		object.defaultPivot = other.defaultPivot;
		return object;
	};
	instanceProto.objectFromTag = function(objectTag, objectArray, timelineName, object_type, entityName)
	{
		var att = objectTag;
		var folderIndex = -null;
		var fileIndex = null;
		var fileName = null;
		var NO_INDEX = -1;
		var object = new SpriterObject();
		object.type = object_type;
		if (object_type === "sprite")
		{
			folderIndex = att["folder"];
			fileIndex = att["file"];
			file = this.folders[folderIndex].files[fileIndex];
			var objectItem = objectArray[findObjectItemInArray(timelineName, objectArray, entityName)];
			object.frame = objectItem.frames.indexOf(file.fileName);
			object.storedFrame = object.frame;
		}
		if (objectTag.hasOwnProperty("x"))
		{
			object.x = (att["x"]);
		}
		if (objectTag.hasOwnProperty("y"))
		{
			object.y = -(att["y"]);
		}
		if (objectTag.hasOwnProperty("angle"))
		{
			object.angle = ((att["angle"]));
		}
		if (objectTag.hasOwnProperty("a"))
		{
			object.a = ((att["a"]));
		}
		object.angle = 360 - object.angle;
		object.angle /= 360;
		if (object.angle > 0.5)
		{
			object.angle -= 1;
		}
		object.angle *= 3.141592653589793 * 2;
		if (objectTag.hasOwnProperty("scale_x"))
		{
			object.xScale = (att["scale_x"]);
		}
		if (objectTag.hasOwnProperty("scale_y"))
		{
			object.yScale = (att["scale_y"]);
		}
		if (objectTag.hasOwnProperty("entity"))
		{
			object.entity = (att["entity"]);
		}
		if (objectTag.hasOwnProperty("animation"))
		{
			object.animation = (att["animation"]);
		}
		if (objectTag.hasOwnProperty("t"))
		{
			object.t = (att["t"]);
		}
		if (objectTag.hasOwnProperty("pivot_x"))
		{
			object.pivotX = (att["pivot_x"]);
		}
		else if (object_type === "sprite")
		{
			var folders = this.folders;
			var folder = folders[folderIndex];
			object.defaultPivot = true;
			if (folder)
			{
				var file = folder.files[fileIndex];
				if (file)
				{
					object.pivotX = file.pivotX;
				}
			}
		}
		if (objectTag.hasOwnProperty("pivot_y"))
		{
			object.pivotY = 1 - (att["pivot_y"]);
		}
		else if (object_type === "sprite")
		{
			var folders = this.folders;
			var folder = folders[folderIndex];
			object.defaultPivot = true;
			if (folder)
			{
				var file = folder.files[fileIndex];
				if (file)
				{
					object.pivotY = file.pivotY;
				}
			}
		}
		return object;
	};
	instanceProto.soundFromTag = function(soundTag)
	{
		var sound = new SpriterSound();
		if (soundTag["folder"] !== undefined && soundTag["file"] !== undefined)
		{
			var file = this.folders[soundTag["folder"]].files[soundTag["file"]];
			if (file)
			{
				sound.name = file.fileName;
				sound.name = sound.name.substr(0, sound.name.lastIndexOf("."));
				sound.name = sound.name.substr(sound.name.lastIndexOf("/") + 1, sound.name.length);
			}
		}
		if (soundTag.hasOwnProperty("trigger"))
		{
			sound.trigger = soundTag["trigger"];
		}
		if (soundTag.hasOwnProperty("panning"))
		{
			sound.panning = soundTag["panning"];
		}
		if (soundTag.hasOwnProperty("volume"))
		{
			sound.volume = soundTag["volume"];
		}
		return sound;
	};
	instanceProto.initDOMtoPairedObjects = function()
	{
		var entities = this.entities;
		for (var e = 0; e < entities.length; e++)
		{
			var entity = entities[e];
			if (entity)
			{
				var animations = entity.animations;
				if (animations)
				{
					for (var a = 0; a < animations.length; a++)
					{
						var animation = animations[a];
						if (animation)
						{
							var timelines = animation.timelines;
							if (timelines)
							{
								for (var t = 0; t < timelines.length; t++)
								{
									var timeline = timelines[t];
									if (timeline)
									{
										timeline.c2Object = this.c2ObjectArray[findObjectItemInArray(timeline.name, this.objectArray, entity.name)];
									}
								}
							}
						}
					}
				}
			}
		}
	};
	instanceProto.associateAllTypes = function()
	{
		var c2ObjectArray = this.c2ObjectArray;
		var objectArray = this.objectArray;
		for (var o = 0, len = objectArray.length; o < len; o++)
		{
			var obj = objectArray[o];
			var siblings = this.siblings;
			if (siblings && siblings.length > 0)
			{
				for (var s = 0; s < siblings.length; s++)
				{
					var sibling = siblings[s];
					if (sibling)
					{
						var type = sibling.type;
						if (type.name === obj.fullTypeName)
						{
							var c2Object = c2ObjectArray[o];
							c2Object.type = type;
							var paired_inst = sibling;
							c2Object.inst = paired_inst;
							var animations = this.entity.animations;
							var name = obj.name;
							for (var a = 0; a < animations.length; a++)
							{
								var animation = animations[a];
								var timelines = animation.timelines;
								for (var t = 0; t < timelines.length; t++)
								{
									var timeline = timelines[t];
									if (name == timeline.name)
									{
										timeline.c2Object = c2Object;
									}
								}
							}
							break;
						}
					}
				}
			}
			else
			{
				var obj = objectArray[o];
				var c2Object = c2ObjectArray[o];
				var type = c2Object.type;
				if (type)
				{
					obj.fullTypeName = type.name;
					c2Object.type = type;
					var iid = this.get_iid(); // get my IID
					var paired_inst = type.instances[iid];
					c2Object.inst = paired_inst;
					var animations = this.entity.animations;
				}
				break;
			}
		}
	};
	instanceProto.loadSCML = function(json_)
	{
		this.loadTagDefs(json_);
		this.objectArray = this.findSprites(json_);
		if (!this.type.objectArrays[this.properties[0]])
		{
			this.type.objectArrays[this.properties[0]] = this.objectArray;
			this.type.boneWidthArrays[this.properties[0]] = this.boneWidthArray;
		}
		this.c2ObjectArray = this.generateTestC2ObjectArray(this.objectArray);
		var thisTypeName = this.type.name;
		var att;
		var json = json_;
		var folderTags = json["folder"];
		var NO_INDEX = -1;
		var entityTags = json["entity"];
		for (var e = 0; e < entityTags.length; e++)
		{
			var entityTag = entityTags[e];
			att = entityTag;
			var entity = new SpriterEntity();
			att = entityTag;
			entity.name = att["name"];
			this.loadVarDefs(entityTag["var_defs"], entity.varDefs);
			var animationTags = entityTag["animation"];
			for (var a = 0; a < animationTags.length; a++)
			{
				var animationTag = animationTags[a];
				att = animationTag;
				var animation = new SpriterAnimation();
				animation.name = att["name"];
				animation.length = att["length"];
				if (animationTag.hasOwnProperty("looping"))
				{
					animation.looping = att["looping"];
				}
				if (animationTag.hasOwnProperty("loop_to"))
				{
					animation.loopTo = att["loop_to"];
				}
				if (animationTag.hasOwnProperty("l"))
				{
					animation.l = att["l"];
				}
				if (animationTag.hasOwnProperty("r"))
				{
					animation.r = att["r"];
				}
				if (animationTag.hasOwnProperty("t"))
				{
					animation.t = att["t"];
				}
				if (animationTag.hasOwnProperty("b"))
				{
					animation.b = att["b"];
				}
				var mainlineTag = animationTag["mainline"];
				var mainline = new SpriterTimeline();
				var keyTags = mainlineTag["key"];
				for (var k = 0; k < keyTags.length; k++)
				{
					var keyTag = keyTags[k];
					var key = new SpriterKey();
					att = keyTag;
					setTimeInfoFromJson(keyTag, key);
					var boneRefTags = keyTag["bone_ref"];
					if (boneRefTags)
					{
						for (var o = 0; o < boneRefTags.length; o++)
						{
							var boneRefTag = boneRefTags[o];
							att = boneRefTag;
							var boneRef = new SpriterObjectRef();
							boneRef.timeline = att["timeline"];
							boneRef.key = att["key"];
							if (boneRefTag.hasOwnProperty("parent"))
							{
								boneRef.parent = att["parent"];
							}
							key.bones.push(boneRef);
						}
					}
					var objectRefTags = keyTag["object_ref"];
					if (objectRefTags)
					{
						for (var o = 0; o < objectRefTags.length; o++)
						{
							var objectRefTag = objectRefTags[o];
							att = objectRefTag;
							var objectRef = new SpriterObjectRef();
							objectRef.timeline = att["timeline"];
							objectRef.key = att["key"];
							if (objectRefTag.hasOwnProperty("parent"))
							{
								objectRef.parent = att["parent"];
							}
							key.objects.push(objectRef);
						}
					}
					animation.mainlineKeys.push(key);
				}
				animation.mainline = mainline;
				var timelineTags = animationTag["timeline"];
				this.setTimelinesFromJson(timelineTags, animation.timelines, entity);
				timelineTags = animationTag["soundline"];
				this.setSoundlinesFromJson(timelineTags, animation.soundlines, entity.name);
				timelineTags = animationTag["eventline"];
				this.setEventlinesFromJson(timelineTags, animation.eventlines, entity.name);
				timelineTags = animationTag["meta"];
				this.setMetaDataFromJson(timelineTags, animation.meta, entity.varDefs);
				entity.animations.push(animation);
			}
			this.entities.push(entity);
			if (!this.entity || this.properties[1] === entity.name)
			{
				this.entity = entity;
			}
		}
	};
	instanceProto.setAnimToIndex = function(animIndex)
	{
		if (this.entity && this.entity.animations.length > animIndex)
		{
			this.playTo = -1;
			this.changeAnimTo = this.entity.animations[animIndex];
			this.changeToStartFrom = 2;
			var anim = this.currentAnimation;
			if (anim)
			{
				this.animPlaying = true;
			}
			this.runtime.tick2Me(this);
		}
	}
	instanceProto.setAnim = function(animName, startFrom, blendDuration)
	{
		var ratio = 0;
		if ((startFrom == 1 || startFrom == 2) && this.currentAnimation && animName == this.currentAnimation.name)
		{
			return;
		}
		if (startFrom > PLAYFROMCURRENTTIMERATIO && blendDuration > 0)
		{
			var secondAnim = this.getAnimFromEntity(animName);
			if (secondAnim === this.secondAnimation && this.blendEndTime > 0)
			{
				return;
			}
			if (secondAnim === this.currentAnimation)
			{
				if (!this.secondAnimation)
				{
					this.blendStartTime = 0;
					this.blendEndTime = 0;
					this.blendPoseTime = 0;
					this.secondAnimation = null;
					this.animBlend = 0;
					this.changeAnimTo = null;
					return;
				}
				else
				{
					this.currentAnimation = this.secondAnimation;
					this.animBlend = 1.0 - this.animBlend;
				}
			}
			else
			{
				this.animBlend = 0;
			}
			this.secondAnimation = secondAnim;
			this.blendStartTime = this.getNowTime();
			this.blendPoseTime = 0;
			this.blendEndTime = this.blendStartTime + ((blendDuration / 1000) / (this.ignoreGlobalTimeScale ? 1 : this.runtime.timescale));
		}
		else
		{
			if (blendDuration <= 0)
			{
				if (startFrom === BLENDATCURRENTTIMERATIO)
				{
					startFrom = 2;
				}
				else if (startFrom == BLENDTOSTART)
				{
					startFrom = 0;
				}
			}
			this.blendStartTime = 0;
			this.blendEndTime = 0;
			this.blendPoseTime = 0;
			this.secondAnimation = null;
		}
		this.changeToStartFrom = startFrom;
		if (startFrom === BLENDTOSTART && this.secondAnimation)
		{
			this.blendPoseTime = this.currentSpriterTime;
			this.secondAnimation.localTime = 0;
			this.setMainlineKeyByTime(this.secondAnimation);
			var secondTweenedBones = this.currentTweenedBones(this.secondAnimation);
			this.animateCharacter(secondTweenedBones, this.secondAnimation, false);
		}
		this.setAnimTo(animName, false);
		var animPlaying = this.animPlaying;
		this.animPlaying = false;
		this.tick2(true);
		this.animPlaying = animPlaying;
	};
	instanceProto.doRequest = function(json, url_, method_)
	{
		var self = this;
		var request = null;
		var errorFunc = function()
		{
		};
		try
		{
			var data = json;
			self.loadSCML(data);
			self.type.scmlFiles[self.properties[0]] = self.entities;
			self.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.readyForSetup, self);
			self.setAnimTo(self.properties[2], true);
			if (!self.currentAnimation && self.entity && self.entity.animations.length)
			{
				self.setAnimTo(self.entity.animations[0].name, true);
			}
			for (var i = 0; i < self.type.scmlInstsToNotify[self.properties[0]].length; i++)
			{
				var inst = self.type.scmlInstsToNotify[self.properties[0]][i];
				inst.forceCharacterFromPreload();
			}
			delete self.type.scmlReserved[self.properties[0]];
			self.type.scmlInstsToNotify[self.properties[0]] = [];
		}
		catch (e)
		{
		}
	};
	instanceProto.getAnimFromEntity = function(animName)
	{
		if (!this.entity || !this.entity.animations)
		{
			return;
		}
		for (var a = 0, len = this.entity.animations.length; a < len; a++)
		{
			if (this.entity.animations[a].name == animName)
			{
				return this.entity.animations[a];
			}
		}
	};
	instanceProto.mapObjToObj = function(parentObject, obj, flipAngle)
	{
		var returnObj = new SpriterObject();
		returnObj.xScale = obj.xScale * parentObject.xScale;
		returnObj.yScale = obj.yScale * parentObject.yScale;
		if (flipAngle < 0)
		{
			returnObj.angle = ((3.141592653589793 * 2) - obj.angle) + parentObject.angle;
		}
		else
		{
			returnObj.angle = obj.angle + parentObject.angle;
		}
		var x = obj.x * parentObject.xScale;
		var y = obj.y * parentObject.yScale;
		var angle = parentObject.angle;
		var s = 0;
		var c = 1;
		if (angle != 0)
		{
			s = Math.sin(angle);
			c = Math.cos(angle);
		}
		var xnew = (x * c) - (y * s);
		var ynew = (x * s) + (y * c);
		returnObj.a = parentObject.a * obj.a;
		returnObj.pivotX = obj.pivotX;
		returnObj.pivotY = obj.pivotY;
		returnObj.defaultPivot = obj.defaultPivot;
		returnObj.x = xnew + parentObject.x;
		returnObj.y = ynew + parentObject.y;
		returnObj.entity = obj.entity;
		returnObj.animation = obj.animation;
		returnObj.t = obj.t;
		return returnObj;
	};
	instanceProto.instsEqual = function(obj, inst)
	{
		return obj.x == inst.x && obj.y == inst.y && obj.a == inst.opacity && obj.angle == inst.angle;
	};
	instanceProto.objFromInst = function(inst)
	{
		var obj = new SpriterObject();
		obj.pivotX = inst.hotspotX;
		obj.pivotY = inst.hotspotY;
		obj.defaultPivot = false;
		obj.x = inst.x;
		obj.y = inst.y;
		obj.a = inst.opacity;
		obj.angle = inst.angle;
		obj.frame = inst.curFrame;
		obj.storedFrame = inst.storedFrame;
		return obj;
	};
	instanceProto.currentFrame = function()
	{
		if (this.currentAnimation)
		{
			return this.currentAnimation.cur_frame;
		}
		return 0;
	}
	instanceProto.applyPivotToInst = function(inst, pivotX, pivotY, objWidth, objHeight)
	{
		var x = -1 * pivotX * objWidth;
		var y = -1 * pivotY * objHeight;
		var angle = inst.angle;
		var s = 0;
		var c = 1;
		if (angle != 0)
		{
			s = Math.sin(angle);
			c = Math.cos(angle);
		}
		var xnew = (x * c) - (y * s);
		var ynew = (x * s) + (y * c);
		inst.x = xnew + inst.x;
		inst.y = ynew + inst.y;
	};
	instanceProto.distance = function(ax, ay, bx, by)
	{
		return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
	}
	instanceProto.applyIk = function(targetX, targetY, addToLength, parentBone, childBoneAbs, childBoneLocal, childBoneLength)
	{
		if (!parentBone || !childBoneLocal)
		{
			return;
		}
		var ikReversal = false;
		var distanceAB = this.distance(0, 0, childBoneLocal.x * parentBone.xScale, childBoneLocal.y * parentBone.yScale);
		var distanceATarget = this.distance(parentBone.x, parentBone.y, targetX, targetY);
		var distanceBTarget = fabs(childBoneLength * childBoneLocal.xScale * parentBone.xScale) + addToLength;
		var parentBoneFactor = parentBone.scaleX * parentBone.scaleY < 0 ? true : false;
		if (distanceATarget > distanceAB + distanceBTarget)
		{
			var newAngle = (cr.to_radians(270) - (Math.atan2(parentBone.x - targetX, parentBone.y - targetY)));
			if (parentBone.scaleX < 0)
			{
				newAngle = newAngle - cr.to_radians(180);
			}
			if (this.xFlip)
			{
				newAngle -= cr.to_radians(180);
			}
			parentBone.angle = newAngle;
		}
		else
		{
			var xDiff = parentBone.x - targetX;
			var yDiff = parentBone.y - targetY;
			var newAngle = Math.acos((((distanceAB * distanceAB) +
					(distanceATarget * distanceATarget) -
					(distanceBTarget * distanceBTarget)) /
				(2 * distanceAB * distanceATarget)));
			var angleOffset = cr.to_radians(270) - Math.atan2(xDiff, yDiff);
			var childAngleOffset = (cr.to_radians(270) - Math.atan2(parentBone.x - childBoneAbs.x, parentBone.y - childBoneAbs.y)) - parentBone.angle;
			if (childBoneLocal.angle > 0)
			{
				ikReversal = true;
			}
			newAngle = angleOffset + (newAngle * (ikReversal ? -1 : 1) * (parentBoneFactor ? -1 : 1));
			if (parentBone.scaleX < 0)
			{
				childAngleOffset = childAngleOffset - cr.to_radians(180);
			}
			newAngle -= childAngleOffset;
			if (newAngle != newAngle)
			{
				newAngle = parentBone.angle;
			}
			else
			{
				if (parentBone.scaleX < 0)
				{
					newAngle = newAngle - cr.to_radians(180);
				}
			}
			parentBone.angle = newAngle;
		}
		childBoneAbs = this.mapObjToObj(parentBone, childBoneLocal, parentBone.xScale * parentBone.yScale);
		var newAngle = cr.to_radians(270) - Math.atan2(childBoneAbs.x - targetX, childBoneAbs.y - targetY);
		if (childBoneAbs.scaleX < 0)
		{
			newAngle -= cr.to_radians(180);
		}
		if (this.xFlip)
		{
			newAngle -= cr.to_radians(180);
		}
		if (parentBoneFactor)
		{
			newAngle = cr.to_radians(360) - newAngle;
			newAngle *= -1;
		}
		childBoneAbs.angle = newAngle;
		return childBoneAbs;
	}
	instanceProto.applyObjToInst = function(obj, inst, dontApplyGlobalScale, c2Object)
	{
		var overrodeImage = false;
		var overrideComponents = this.objectOverrides[c2Object.obj.originalName];
		if (typeof overrideComponents !== "undefined")
		{
			for (var component in overrideComponents)
			{
				switch (component)
				{
					case COMPONENTANGLE:
						obj.angle = cr.to_radians(overrideComponents[component]);
						this.force = true;
						break;
					case COMPONENTX:
						obj.x = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTY:
						obj.y = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTSCALEX:
						obj.xScale = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTSCALEY:
						obj.yScale = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTIMAGE:
						obj.frame = SetSpriteAnimFrame(inst, overrideComponents[component], c2Object);
						overrodeImage = true;
						this.force = true;
						break;
					case COMPONENTPIVOTX:
						obj.pivotX = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTPIVOTY:
						obj.pivotY = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTENTITY:
						obj.entity = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTANIMATION:
						obj.animation = overrideComponents[component];
						this.force = true;
						break;
					case COMPONENTTIMERATIO:
						obj.t = overrideComponents[component];
						this.force = true;
						break;
					default:
						break;
				}
			}
		}
		if (this.drawSelf && !c2Object.inst)
		{
			return overrodeImage;
		}
		inst.angle = obj.angle;
		inst.opacity = obj.a;
		var cur_frame = inst.curFrame;
		inst.hotspotX = 0;
		inst.hotspotY = 0;
		inst.x = obj.x;
		inst.y = obj.y;
		var trueW = inst.width;
		var trueH = inst.height;
		if (c2Object.obj.spriterType === "entity")
		{
			inst.subEntScaleX = obj.xScale;
			inst.subEntScaleY = obj.yScale;
			inst.setEntToIndex(obj.entity);
			if (inst.entity)
			{
				inst.setAnimToIndex(obj.animation);
				inst.setAnimTime(1, obj.t);
			}
		}
		if (c2Object.obj.imageSizes && c2Object.obj.imageSizes.length > inst.cur_frame)
		{
			trueW = c2Object.obj.imageSizes[inst.cur_frame].w;
			trueH = c2Object.obj.imageSizes[inst.cur_frame].h;
		}
		var mirror_factor = (this.xFlip == 1 ? -1 : 1);
		var flip_factor = (this.yFlip == 1 ? -1 : 1);
		var new_width = (dontApplyGlobalScale ? 1 : this.scaleRatio) * trueW * obj.xScale * mirror_factor;
		var new_height = (dontApplyGlobalScale ? 1 : this.scaleRatio) * trueH * obj.yScale * flip_factor;
		if (inst.width !== new_width || inst.height !== new_height)
		{
			inst.width = new_width;
			inst.height = new_height;
		}
		var pivX = obj.pivotX;
		var pivY = obj.pivotY;
		if (obj.defaultPivot)
		{
			var curPivot = c2Object.obj.pivots[inst.cur_frame];
			if (!curPivot)
			{
				curPivot = c2Object.obj.pivots[0];
			}
			if (curPivot)
			{
				pivX = curPivot.x;
				pivY = curPivot.y;
			}
		}
		this.applyPivotToInst(inst, pivX, pivY, new_width, new_height);
		inst.set_bbox_changed();
		return overrodeImage;
	};
	instanceProto.setEntTo = function(entName)
	{
		var entities = this.entities;
		for (var e = 0, len = entities.length; e < len; e++)
		{
			var entity = entities[e];
			if (entity && entName == entity.name)
			{
				this.entity = entity;
			}
		}
		if (!this.entity && this.entities.length)
		{
			this.entity = entities[0];
		}
		if (!this.entity)
		{
			this.startingEntName = entName;
		}
	};
	instanceProto.setEntToIndex = function(entIndex)
	{
		this.entity = this.entities[entIndex];
		if (!this.entity && this.entities.length)
		{
			this.entity = this.entities[0];
		}
	};
	instanceProto.setAllCollisionsAndVisibility = function(newState)
	{
		var c2ObjectArray = this.c2ObjectArray;
		if (c2ObjectArray)
		{
			for (var o = 0; o < c2ObjectArray.length; o++)
			{
				var c2Object = c2ObjectArray[o];
				var inst = c2Object.inst;
				if (!inst)
				{
					if (!this.drawSelf && c2Object.obj && c2Object.obj.frames.length > 0)
					{
						this.associateAllTypes();
						inst = c2Object.inst;
					}
				}
				else
				{
					inst.collisionsEnabled = newState;
					inst.visible = newState;
				}
			}
		}
	};
	instanceProto.setAllInvisible = function()
	{
		var c2ObjectArray = this.c2ObjectArray;
		if (c2ObjectArray)
		{
			for (var o = 0; o < c2ObjectArray.length; o++)
			{
				var c2Object = c2ObjectArray[o];
				var inst = c2Object.inst;
				if (!inst)
				{
					this.associateAllTypes();
					inst = c2Object.inst;
				}
				if (inst)
				{
					inst.visible = false;
				}
			}
		}
	};
	instanceProto.setAnimTo = function(animName, tick)
	{
		tick = (typeof tick !== 'undefined') ? tick : true;
		this.playTo = -1;
		this.changeAnimTo = this.getAnimFromEntity(animName);
		if (!this.changeAnimTo && (!this.currentAnimation) && this.entity)
		{
			this.changeAnimTo = this.entity.animations[0];
		}
		if (!this.changeAnimTo)
		{
			this.startingAnimName = animName;
			this.changeToStartFrom = 0;
			this.blendStartTime = 0;
			this.blendEndTime = 0;
			this.secondAnimation = null;
			this.blendPoseTime = 0;
		}
		var anim = this.currentAnimation;
		if (anim)
		{
			this.animPlaying = true;
		}
		this.setAllCollisionsAndVisibility(false);
		this.runtime.tick2Me(this);
		if (tick)
		{
			this.tick2();
		}
	};
	instanceProto.resetEventChecksToCurrentTime = function()
	{
		this.resetEventChecksToTime(this.currentSpriterTime);
	}
	instanceProto.resetEventChecksToTime = function(time)
	{
		if (this.currentAnimation)
		{
			this.currentAdjustedTime = time;
			time -= 1;
			for (var s = 0; s < this.currentAnimation.soundlines.length; s++)
			{
				var soundline = this.currentAnimation.soundlines[s];
				if (soundline)
				{
					soundline.lastTimeSoundCheck = time;
				}
			}
			for (var e = 0; e < this.currentAnimation.eventlines.length; e++)
			{
				var eventline = this.currentAnimation.eventlines[e];
				if (eventline)
				{
					eventline.lastTimeEventCheck = time;
				}
			}
		}
	}
	instanceProto.setAnimTime = function(units, time)
	{
		var currentAnimation = this.currentAnimation;
		var lastSpriterTime = this.currentSpriterTime;
		if (currentAnimation)
		{
			if (units === 0) // milliseconds
			{
				this.currentSpriterTime = time;
			}
			else if (units == 1) // ratio
			{
				this.currentSpriterTime = time * currentAnimation.length;
			}
		}
		if (lastSpriterTime != this.currentSpriterTime)
		{
			this.force = true;
		}
	};
	instanceProto.soundlineFromName = function(name)
	{
		if (this.soundLineToTrigger && this.soundLineToTrigger.name === name)
		{
			return this.soundLineToTrigger;
		}
		var anim = this.currentAnimation;
		if (anim)
		{
			for (var s = 0; s < anim.soundlines.length; s++)
			{
				var soundline = anim.soundlines[s];
				if (soundline && soundline.name === name)
				{
					return soundline;
				}
			}
		}
	}
	function Cnds()
	{}
	Cnds.prototype.readyForSetup = function()
	{
		return true;
	};
	Cnds.prototype.outsidePaddedViewport = function()
	{
		return this.isOutsideViewportBox();
	}
	Cnds.prototype.actionPointExists = function(pointName)
	{
		var timeline = this.timelineFromName(pointName);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.x !== undefined)
			{
				return true;
			}
		}
		return false;
	};
	Cnds.prototype.objectExists = function(pointName)
	{
		var timeline = this.timelineFromName(pointName);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.x !== undefined)
			{
				return true;
			}
		}
		return false;
	};
	Cnds.prototype.OnAnimFinished = function(animname)
	{
		return this.currentAnimation.name.toLowerCase() === animname.toLowerCase();
	};
	Cnds.prototype.OnSoundTriggered = function()
	{
		return true;
	};
	Cnds.prototype.OnEventTriggered = function(name)
	{
		if (name === this.eventToTrigger)
		{
			return true;
		}
	};
	Cnds.prototype.tagActive = function(tagName, objectName)
	{
		var anim = this.currentAnimation;
		if (anim)
		{
			if (objectName)
			{
				var line = this.timelineFromName(objectName);
				if (line)
				{
					return this.tagStatus(tagName, line.meta);
				}
			}
			else
			{
				return this.tagStatus(tagName, anim.meta);
			}
		}
		return false;
	}
	Cnds.prototype.OnSoundVolumeChangeTriggered = function()
	{
		return true;
	};
	Cnds.prototype.OnSoundPanningChangeTriggered = function()
	{
		return true;
	};
	Cnds.prototype.OnAnyAnimFinished = function()
	{
		return true;
	};
	Cnds.prototype.CompareCurrentKey = function(cmp, frame)
	{
		return cr.do_cmp(this.currentFrame(), cmp, frame);
	};
	Cnds.prototype.CompareCurrentTime = function(cmp, time, format)
	{
		if (format === 0) //milliseconds
		{
			return cr.do_cmp(this.currentSpriterTime, cmp, time);
		}
		else
		{
			var anim = this.currentAnimation;
			if (anim)
			{
				return cr.do_cmp(this.currentSpriterTime / this.currentAnimation.length, cmp, time);
			}
			else
			{
				return false;
			}
		}
	};
	Cnds.prototype.CompareAnimation = function(name)
	{
		var blendingTo = this.secondAnimation;
		if (blendingTo && blendingTo.name === name && this.blendEndTime > 0)
		{
			return true;
		}
		var anim = this.currentAnimation;
		if (anim && anim.name === name)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	Cnds.prototype.CompareEntity = function(name)
	{
		var ent = this.entity;
		if (ent && ent.name === name)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	Cnds.prototype.AnimationPaused = function()
	{
		return !this.animPlaying;
	};
	Cnds.prototype.AnimationLooping = function()
	{
		var anim = this.currentAnimation;
		if (anim && anim.looping === "true")
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	Cnds.prototype.isMirrored = function()
	{
		return this.xFlip;
	};
	Cnds.prototype.isFlipped = function()
	{
		return this.yFlip;
	};
	pluginProto.cnds = new Cnds();
	function Acts()
	{}
	Acts.prototype.setPlaybackSpeedRatio = function(newSpeed)
	{
		this.speedRatio = newSpeed;
	};
	Acts.prototype.setVisible = function(visible)
	{
		if (visible === 1)
		{
			this.visible = true;
		}
		else
		{
			this.visible = false;
		}
	};
	Acts.prototype.setOpacity = function(newOpacity)
	{
		this.opacity = clamp(0.0, 1.0, newOpacity / 100.0);
	};
	Acts.prototype.setAutomaticPausing = function(newPauseSetting, leftBuffer, rightBuffer, topBuffer, bottomBuffer)
	{
		this.pauseWhenOutsideBuffer = newPauseSetting;
		this.leftBuffer = leftBuffer;
		this.rightBuffer = rightBuffer;
		this.topBuffer = topBuffer;
		this.bottomBuffer = bottomBuffer;
	}
	Acts.prototype.setObjectScaleRatio = function(newScale, xFlip, yFlip)
	{
		this.scaleRatio = newScale;
		this.xFlip = xFlip;
		this.yFlip = yFlip;
		this.force = true;
	};
	Acts.prototype.setObjectXFlip = function(xFlip)
	{
		this.xFlip = xFlip;
		this.force = true;
	};
	Acts.prototype.setIgnoreGlobalTimeScale = function(ignore)
	{
		this.ignoreGlobalTimeScale = (ignore == 1);
	}
	Acts.prototype.findSpriterObject = function(c2Object)
	{
		if (this.currentAnimation)
		{
			var timelines = this.currentAnimation.timelines;
			for (var t = 0; t < timelines.length; t++)
			{
				var timeline = timelines[t];
				if (timeline && timeline.c2Object)
				{
					if (timeline.c2Object.inst == c2Object.getFirstPicked())
					{
						this.lastFoundObject = timeline.name;
						return;
					}
				}
			}
		}
	}
	Acts.prototype.stopResumeSettingLayer = function(resume)
	{
		this.setLayersForSprites = resume == 1;
	}
	Acts.prototype.setObjectYFlip = function(yFlip)
	{
		this.yFlip = yFlip;
		this.force = true;
	};
	var PLAYFROMSTART = 0;
	var PLAYFROMCURRENTTIME = 1;
	var PLAYFROMCURRENTTIMERATIO = 2;
	var BLENDTOSTART = 3;
	var BLENDATCURRENTTIMERATIO = 4;
	Acts.prototype.setC2ObjectToSpriterObject = function(c2Object, propertiesToSet, spriterObjectName)
	{
		var c2instance = c2Object.getCurrentSol().instances;
		if (c2instance.length === 0 && c2Object.getCurrentSol().select_all === true)
			c2instance = c2Object.instances;
		this.objectsToSet.push(new C2ObjectToSpriterObjectInstruction(c2instance, spriterObjectName, propertiesToSet, false));
	}
	Acts.prototype.pinC2ObjectToSpriterObject = function(c2Object, propertiesToSet, spriterObjectName)
	{
		var c2instance = c2Object.getCurrentSol().instances;
		if (c2instance.length === 0 && c2Object.getCurrentSol().select_all === true)
			c2instance = c2Object.instances;
		this.objectsToSet.push(new C2ObjectToSpriterObjectInstruction(c2instance, spriterObjectName, propertiesToSet, true));
	}
	Acts.prototype.unpinC2ObjectFromSpriterObject = function(c2Object, spriterObjectName)
	{
		var allObjs = spriterObjectName === "";
		for (var i = 0; i < this.objectsToSet.length; i++)
		{
			if (this.objectsToSet[i].c2Object[0].type === c2Object && (allObjs ? true : this.objectsToSet[i].objectName === spriterObjectName))
			{
				this.objectsToSet.splice(i, 1);
				i--;
			}
		}
	}
	Acts.prototype.unpinAllFromSpriterObject = function(spriterObjectName)
	{
		if (spriterObjectName === "")
		{
			this.objectsToSet = [];
		}
		else
		{
			for (var i = 0; i < this.objectsToSet.length; i++)
			{
				if (this.objectsToSet[i].objectName === spriterObjectName)
				{
					this.objectsToSet.splice(i, 1);
					i--;
				}
			}
		}
	}
	Acts.prototype.setAnimation = function(animName, startFrom, blendDuration)
	{
		this.setAnim(animName, startFrom, blendDuration);
	};
	Acts.prototype.setSecondAnim = function(animName)
	{
		this.secondAnimation = this.getAnimFromEntity(animName);
		if (this.secondAnimation === this.currentAnimation)
		{
			this.secondAnimation = null;
		}
	};
	Acts.prototype.stopSecondAnim = function(animName)
	{
		this.secondAnimation = null;
		this.animBlend = 0;
	};
	Acts.prototype.setAnimBlendRatio = function(newBlend)
	{
		this.animBlend = newBlend;
	};
	Acts.prototype.setEnt = function(entName, animName)
	{
		var newAnimName = animName;
		if (this.entity && this.currentAnimation && this.entity.name == entName && this.currentAnimation.name == animName)
		{
			return;
		}
		var newEntSet = false;
		if (this.currentAnimation && newAnimName === "")
		{
			newAnimName = this.currentAnimation.name;
		}
		var sameAnimName = false;
		if (newAnimName === this.currentAnimation.name)
		{
			sameAnimName = true;
		}
		if (entName !== "" && ((!this.entity) || entName != this.entity.name))
		{
			this.setEntTo(entName);
			newEntSet = true;
		}
		if (newAnimName !== "" && (newEntSet || !sameAnimName))
		{
			this.setAnimTo(newAnimName);
		}
	};
	Acts.prototype.playAnimTo = function(units, playTo)
	{
		if (units === 0) // keyframes
		{
			var mainKeys = this.currentAnimation.mainlineKeys;
			if (mainKeys)
			{
				var key = mainKeys[playTo];
				if (key)
				{
					this.playTo = key.time;
				}
				else
				{
					this.playTo = -1;
					return;
				}
			}
		}
		else if (units == 1) // milliseconds
		{
			this.playTo = playTo;
		}
		else if (units == 2) // ratio
		{
			this.playTo = playTo * this.currentAnimation.length;
		}
		if (this.playTo == this.currentSpriterTime)
		{
			this.playTo = -1;
			return;
		}
		var reverseFactor = 1;
		if (this.currentAnimation.looping == "true")
		{
			var forwardDistance = 0;
			var backwardDistance = 0;
			if (this.playTo > this.currentSpriterTime)
			{
				forwardDistance = this.playTo - this.currentSpriterTime;
				backwardDistance = (this.currentAnimation.length - this.playTo) + this.currentSpriterTime;
			}
			else
			{
				forwardDistance = this.playTo + (this.currentAnimation.length - this.currentSpriterTime);
				backwardDistance = this.currentSpriterTime - this.playTo;
			}
			if (backwardDistance < forwardDistance)
			{
				reverseFactor = -1;
			}
		}
		else
		{
			if (this.playTo < this.currentSpriterTime)
			{
				reverseFactor = -1;
			}
		}
		this.speedRatio = Math.abs(this.speedRatio) * reverseFactor;
		this.animPlaying = true;
		this.tick2();
	};
	Acts.prototype.associateTypeWithName = function(type, name)
	{
		var c2ObjectArray = this.c2ObjectArray;
		var objectArray = this.objectArray;
		for (var o = 0, len = objectArray.length; o < len; o++)
		{
			var obj = objectArray[o];
			if (name == obj.name)
			{
				obj.fullTypeName = type.name;
				var c2Object = c2ObjectArray[o];
				c2Object.type = type;
				var iid = this.get_iid(); // get my IID
				var paired_inst = type.instances[iid];
				c2Object.inst = paired_inst;
				var animations = this.entity.animations;
				for (var a = 0, lenA = animations.length; a < lenA; a++)
				{
					var animation = animations[a];
					var timelines = animation.timelines;
					for (var t = 0, lenT = timelines.length; t < lenT; t++)
					{
						var timeline = timelines[t];
						if (name == timeline.name)
						{
							timeline.c2Object = c2Object;
						}
					}
				}
				break;
			}
		}
	};
	Acts.prototype.setAnimationLoop = function(loopOn)
	{
		var currentAnimation = this.currentAnimation;
		if (this.changeAnimTo)
		{
			currentAnimation = this.changeAnimTo;
		}
		if (currentAnimation)
		{
			if (loopOn === 0)
			{
				currentAnimation.looping = "false";
			}
			else if (loopOn == 1)
			{
				currentAnimation.looping = "true";
			}
		}
		else
		{
			if (loopOn === 0)
			{
				this.startingLoopType = "false";
			}
			else if (loopOn == 1)
			{
				this.startingLoopType = "true";
			}
		}
	};
	Acts.prototype.setAnimationTime = function(units, time)
	{
		this.resetEventChecksToTime(time);
		this.setAnimTime(units, time);
	};
	Acts.prototype.pauseAnimation = function()
	{
		this.animPlaying = false;
	};
	Acts.prototype.resumeAnimation = function()
	{
		if (this.animPlaying === false)
		{
			this.lastKnownTime = this.getNowTime();
		}
		this.animPlaying = true;
		var anim = this.currentAnimation;
		if (anim)
		{
			if (this.speedRatio > 0)
			{
				if (this.currentSpriterTime == anim.length)
				{
					this.currentSpriterTime = 0;
				}
			}
			else if (this.currentSpriterTime === 0)
			{
				this.currentSpriterTime = this.currentAnimation.length;
			}
		}
	};
	Acts.prototype.removeAllCharMaps = function()
	{
		var c2Objs = this.c2ObjectArray;
		for (var c = 0; c < c2Objs.length; c++)
		{
			var c2Obj = c2Objs[c];
			c2Obj.appliedMap = [];
		}
		this.tick2(true);
	};
	Acts.prototype.appendCharMap = function(mapName)
	{
		var c2Objs = this.c2ObjectArray;
		for (var c = 0; c < c2Objs.length; c++)
		{
			var c2Obj = c2Objs[c];
			if (c2Obj)
			{
				if (c2Obj.obj)
				{
					var charMap = c2Obj.obj.charMaps[mapName];
					if (charMap)
					{
						for (var m = 0; m < charMap.length; m++)
						{
							var map = charMap[m];
							if (map)
							{
								c2Obj.appliedMap[map.oldFrame] = map.newFrame;
							}
						}
					}
				}
			}
		}
		this.tick2(true);
	};
	Acts.prototype.overrideObjectComponent = function(objectName, component, newValue)
	{
		var override = this.objectOverrides[objectName];
		if (typeof override === 'undefined')
		{
			this.objectOverrides[objectName] = {};
			override = this.objectOverrides[objectName];
		}
		override[component] = newValue;
	}
	Acts.prototype.overrideBonesWithIk = function(parentBoneName, childBoneName, targetX, targetY, additionalLength)
	{
		var override = this.boneIkOverrides[parentBoneName];
		if (typeof override === 'undefined')
		{
			this.boneIkOverrides[parentBoneName] = {};
			override = this.boneIkOverrides[parentBoneName];
		}
		override.targetX = targetX;
		override.targetY = targetY;
		override.childBone = childBoneName;
		override.additionalLength = additionalLength;
	}
	pluginProto.acts = new Acts();
	function Exps()
	{}
	Exps.prototype.time = function(ret)
	{
		ret.set_int(this.currentSpriterTime);
	};
	Exps.prototype.val = function(ret, varname, objectName)
	{
		var anim = this.currentAnimation;
		if (anim)
		{
			if (objectName)
			{
				var line = this.timelineFromName(objectName);
				if (line)
				{
					this.varStatus(ret, varname, line.meta);
					return;
				}
			}
			else
			{
				this.varStatus(ret, varname, anim.meta);
				return;
			}
		}
		ret.set_float(0);
	}
	Exps.prototype.pointX = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.x !== undefined)
			{
				ret.set_float(timeline.currentObjectState.x);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.pointY = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.y !== undefined)
			{
				ret.set_float(timeline.currentObjectState.y);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.pointAngle = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.angle !== undefined)
			{
				ret.set_float(cr.to_degrees(timeline.currentObjectState.angle));
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.objectX = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.x !== undefined)
			{
				ret.set_float(timeline.currentObjectState.x);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.objectY = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.y !== undefined)
			{
				ret.set_float(timeline.currentObjectState.y);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.objectAngle = function(ret, name)
	{
		var timeline = this.timelineFromName(name);
		if (timeline && timeline.currentObjectState)
		{
			if (timeline.currentObjectState.angle !== undefined)
			{
				ret.set_float(cr.to_degrees(timeline.currentObjectState.angle));
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.timeRatio = function(ret)
	{
		if (this.currentAnimation)
		{
			ret.set_float(this.currentSpriterTime / this.currentAnimation.length);
		}
		else
		{
			ret.set_float(0);
		}
	};
	Exps.prototype.ScaleRatio = function(ret)
	{
		ret.set_float(this.scaleRatio);
	};
	Exps.prototype.key = function(ret)
	{
		ret.set_int(this.currentFrame());
	};
	Exps.prototype.PlayTo = function(ret)
	{
		ret.set_int(this.playTo);
	};
	Exps.prototype.animationName = function(ret)
	{
		if (this.changeAnimTo)
		{
			ret.set_string(this.changeAnimTo.name);
		}
		else if (this.currentAnimation)
		{
			ret.set_string(this.currentAnimation.name);
		}
		else
		{
			ret.set_string("");
		}
	};
	Exps.prototype.animationLength = function(ret)
	{
		if (this.currentAnimation)
		{
			ret.set_int(this.currentAnimation.length);
		}
		else
		{
			ret.set_int(0);
		}
	};
	Exps.prototype.speedRatio = function(ret)
	{
		ret.set_float(this.speedRatio);
	};
	Exps.prototype.secondAnimationName = function(ret)
	{
		if (this.secondAnimation)
		{
			ret.set_string(this.secondAnimation.name);
		}
		else
		{
			ret.set_string("");
		}
	};
	Exps.prototype.entityName = function(ret)
	{
		if (this.entity)
		{
			ret.set_string(this.entity.name);
		}
		else
		{
			ret.set_string("");
		}
	};
	Exps.prototype.PlayToTimeLeft = function(ret)
	{
		if (this.playTo < 0)
		{
			return ret.set_float(0);
		}
		if (this.currentAnimation.looping == "true")
		{
			var forwardDistance = 0;
			var backwardDistance = 0;
			if (speedRatio >= 0)
			{
				if (this.playTo > this.currentSpriterTime)
				{
					return ret.set_float(this.playTo - this.currentSpriterTime);
				}
				else
				{
					return ret.set_float(this.playTo + (this.currentAnimation.length - this.currentSpriterTime));
				}
			}
			else
			{
				if (this.playTo > this.currentSpriterTime)
				{
					return ret.set_float((this.currentAnimation.length - this.playTo) + this.currentSpriterTime);
				}
				else
				{
					return ret.set_float(this.currentSpriterTime - this.playTo);
				}
			}
		}
		else
		{
			return ret.set_float(Math.abs(this.playTo - this.currentSpriterTime));
		}
	};
	Exps.prototype.triggeredSound = function(ret)
	{
		ret.set_string(this.soundToTrigger);
	};
	Exps.prototype.triggeredSoundTag = function(ret)
	{
		if (this.soundLineToTrigger)
		{
			ret.set_string(this.soundLineToTrigger.name);
			return;
		}
		ret.set_string("");
	};
	Exps.prototype.soundVolume = function(ret, soundTag)
	{
		var soundline = this.soundlineFromName(soundTag);
		if (soundline)
		{
			if (soundline.currentObjectState)
			{
				ret.set_float(soundline.currentObjectState.volume);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.soundPanning = function(ret, soundTag)
	{
		var soundline = this.soundlineFromName(soundTag);
		if (soundline)
		{
			if (soundline.currentObjectState)
			{
				ret.set_float(soundline.currentObjectState.panning);
				return;
			}
		}
		ret.set_float(0);
	};
	Exps.prototype.blendRatio = function(ret)
	{
		ret.set_float(this.animBlend);
	};
	Exps.prototype.Opacity = function(ret)
	{
		ret.set_float(this.opacity * 100.0);
	}
	Exps.prototype.BBoxLeft = function(ret)
	{
		this.update_bbox();
		ret.set_float(this.bbox.left);
	};
	Exps.prototype.BBoxTop = function(ret)
	{
		this.update_bbox();
		ret.set_float(this.bbox.top);
	};
	Exps.prototype.BBoxRight = function(ret)
	{
		this.update_bbox();
		ret.set_float(this.bbox.right);
	};
	Exps.prototype.BBoxBottom = function(ret)
	{
		this.update_bbox();
		ret.set_float(this.bbox.bottom);
	};
	Exps.prototype.foundObject = function(ret)
	{
		ret.set_string(this.lastFoundObject);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Text = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Text.prototype;
	pluginProto.onCreate = function ()
	{
		pluginProto.acts.SetWidth = function (w)
		{
			if (this.width !== w)
			{
				this.width = w;
				this.text_changed = true;	// also recalculate text wrapping
				this.set_bbox_changed();
			}
		};
	};
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.mycanvas = null;
			inst.myctx = null;
			inst.mytex = null;
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		if (this.recycled)
			cr.clearArray(this.lines);
		else
			this.lines = [];		// for word wrapping
		this.text_changed = true;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var requestedWebFonts = {};		// already requested web fonts have an entry here
	instanceProto.onCreate = function()
	{
		this.text = this.properties[0];
		this.visible = (this.properties[1] === 0);		// 0=visible, 1=invisible
		this.font = this.properties[2];
		this.color = this.properties[3];
		this.halign = this.properties[4];				// 0=left, 1=center, 2=right
		this.valign = this.properties[5];				// 0=top, 1=center, 2=bottom
		this.wrapbyword = (this.properties[7] === 0);	// 0=word, 1=character
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
		this.line_height_offset = this.properties[8];
		this.facename = "";
		this.fontstyle = "";
		this.ptSize = 0;
		this.textWidth = 0;
		this.textHeight = 0;
		this.parseFont();
		this.mycanvas = null;
		this.myctx = null;
		this.mytex = null;
		this.need_text_redraw = false;
		this.last_render_tick = this.runtime.tickcount;
		if (this.recycled)
			this.rcTex.set(0, 0, 1, 1);
		else
			this.rcTex = new cr.rect(0, 0, 1, 1);
		if (this.runtime.glwrap)
			this.runtime.tickMe(this);
;
	};
	instanceProto.parseFont = function ()
	{
		var arr = this.font.split(" ");
		var i;
		for (i = 0; i < arr.length; i++)
		{
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				this.ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
				this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
				if (i > 0)
					this.fontstyle = arr[i - 1];
				this.facename = arr[i + 1];
				for (i = i + 2; i < arr.length; i++)
					this.facename += " " + arr[i];
				break;
			}
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"t": this.text,
			"f": this.font,
			"c": this.color,
			"ha": this.halign,
			"va": this.valign,
			"wr": this.wrapbyword,
			"lho": this.line_height_offset,
			"fn": this.facename,
			"fs": this.fontstyle,
			"ps": this.ptSize,
			"pxh": this.pxHeight,
			"tw": this.textWidth,
			"th": this.textHeight,
			"lrt": this.last_render_tick
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.text = o["t"];
		this.font = o["f"];
		this.color = o["c"];
		this.halign = o["ha"];
		this.valign = o["va"];
		this.wrapbyword = o["wr"];
		this.line_height_offset = o["lho"];
		this.facename = o["fn"];
		this.fontstyle = o["fs"];
		this.ptSize = o["ps"];
		this.pxHeight = o["pxh"];
		this.textWidth = o["tw"];
		this.textHeight = o["th"];
		this.last_render_tick = o["lrt"];
		this.text_changed = true;
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
	};
	instanceProto.tick = function ()
	{
		if (this.runtime.glwrap && this.mytex && (this.runtime.tickcount - this.last_render_tick >= 300))
		{
			var layer = this.layer;
            this.update_bbox();
            var bbox = this.bbox;
            if (bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom)
			{
				this.runtime.glwrap.deleteTexture(this.mytex);
				this.mytex = null;
				this.myctx = null;
				this.mycanvas = null;
			}
		}
	};
	instanceProto.onDestroy = function ()
	{
		this.myctx = null;
		this.mycanvas = null;
		if (this.runtime.glwrap && this.mytex)
			this.runtime.glwrap.deleteTexture(this.mytex);
		this.mytex = null;
	};
	instanceProto.updateFont = function ()
	{
		this.font = this.fontstyle + " " + this.ptSize.toString() + "pt " + this.facename;
		this.text_changed = true;
		this.runtime.redraw = true;
	};
	instanceProto.draw = function(ctx, glmode)
	{
		ctx.font = this.font;
		ctx.textBaseline = "top";
		ctx.fillStyle = this.color;
		ctx.globalAlpha = glmode ? 1 : this.opacity;
		var myscale = 1;
		if (glmode)
		{
			myscale = Math.abs(this.layer.getScale());
			ctx.save();
			ctx.scale(myscale, myscale);
		}
		if (this.text_changed || this.width !== this.lastwrapwidth)
		{
			this.type.plugin.WordWrap(this.text, this.lines, ctx, this.width, this.wrapbyword);
			this.text_changed = false;
			this.lastwrapwidth = this.width;
		}
		this.update_bbox();
		var penX = glmode ? 0 : this.bquad.tlx;
		var penY = glmode ? 0 : this.bquad.tly;
		if (this.runtime.pixel_rounding)
		{
			penX = (penX + 0.5) | 0;
			penY = (penY + 0.5) | 0;
		}
		if (this.angle !== 0 && !glmode)
		{
			ctx.save();
			ctx.translate(penX, penY);
			ctx.rotate(this.angle);
			penX = 0;
			penY = 0;
		}
		var endY = penY + this.height;
		var line_height = this.pxHeight;
		line_height += this.line_height_offset;
		var drawX;
		var i;
		if (this.valign === 1)		// center
			penY += Math.max(this.height / 2 - (this.lines.length * line_height) / 2, 0);
		else if (this.valign === 2)	// bottom
			penY += Math.max(this.height - (this.lines.length * line_height) - 2, 0);
		for (i = 0; i < this.lines.length; i++)
		{
			drawX = penX;
			if (this.halign === 1)		// center
				drawX = penX + (this.width - this.lines[i].width) / 2;
			else if (this.halign === 2)	// right
				drawX = penX + (this.width - this.lines[i].width);
			ctx.fillText(this.lines[i].text, drawX, penY);
			penY += line_height;
			if (penY >= endY - line_height)
				break;
		}
		if (this.angle !== 0 || glmode)
			ctx.restore();
		this.last_render_tick = this.runtime.tickcount;
	};
	instanceProto.drawGL = function(glw)
	{
		if (this.width < 1 || this.height < 1)
			return;
		var need_redraw = this.text_changed || this.need_text_redraw;
		this.need_text_redraw = false;
		var layer_scale = this.layer.getScale();
		var layer_angle = this.layer.getAngle();
		var rcTex = this.rcTex;
		var floatscaledwidth = layer_scale * this.width;
		var floatscaledheight = layer_scale * this.height;
		var scaledwidth = Math.ceil(floatscaledwidth);
		var scaledheight = Math.ceil(floatscaledheight);
		var absscaledwidth = Math.abs(scaledwidth);
		var absscaledheight = Math.abs(scaledheight);
		var halfw = this.runtime.draw_width / 2;
		var halfh = this.runtime.draw_height / 2;
		if (!this.myctx)
		{
			this.mycanvas = document.createElement("canvas");
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			this.lastwidth = absscaledwidth;
			this.lastheight = absscaledheight;
			need_redraw = true;
			this.myctx = this.mycanvas.getContext("2d");
		}
		if (absscaledwidth !== this.lastwidth || absscaledheight !== this.lastheight)
		{
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			if (this.mytex)
			{
				glw.deleteTexture(this.mytex);
				this.mytex = null;
			}
			need_redraw = true;
		}
		if (need_redraw)
		{
			this.myctx.clearRect(0, 0, absscaledwidth, absscaledheight);
			this.draw(this.myctx, true);
			if (!this.mytex)
				this.mytex = glw.createEmptyTexture(absscaledwidth, absscaledheight, this.runtime.linearSampling, this.runtime.isMobile);
			glw.videoToTexture(this.mycanvas, this.mytex, this.runtime.isMobile);
		}
		this.lastwidth = absscaledwidth;
		this.lastheight = absscaledheight;
		glw.setTexture(this.mytex);
		glw.setOpacity(this.opacity);
		glw.resetModelView();
		glw.translate(-halfw, -halfh);
		glw.updateModelView();
		var q = this.bquad;
		var tlx = this.layer.layerToCanvas(q.tlx, q.tly, true, true);
		var tly = this.layer.layerToCanvas(q.tlx, q.tly, false, true);
		var trx = this.layer.layerToCanvas(q.trx, q.try_, true, true);
		var try_ = this.layer.layerToCanvas(q.trx, q.try_, false, true);
		var brx = this.layer.layerToCanvas(q.brx, q.bry, true, true);
		var bry = this.layer.layerToCanvas(q.brx, q.bry, false, true);
		var blx = this.layer.layerToCanvas(q.blx, q.bly, true, true);
		var bly = this.layer.layerToCanvas(q.blx, q.bly, false, true);
		if (this.runtime.pixel_rounding || (this.angle === 0 && layer_angle === 0))
		{
			var ox = ((tlx + 0.5) | 0) - tlx;
			var oy = ((tly + 0.5) | 0) - tly
			tlx += ox;
			tly += oy;
			trx += ox;
			try_ += oy;
			brx += ox;
			bry += oy;
			blx += ox;
			bly += oy;
		}
		if (this.angle === 0 && layer_angle === 0)
		{
			trx = tlx + scaledwidth;
			try_ = tly;
			brx = trx;
			bry = tly + scaledheight;
			blx = tlx;
			bly = bry;
			rcTex.right = 1;
			rcTex.bottom = 1;
		}
		else
		{
			rcTex.right = floatscaledwidth / scaledwidth;
			rcTex.bottom = floatscaledheight / scaledheight;
		}
		glw.quadTex(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex);
		glw.resetModelView();
		glw.scale(layer_scale, layer_scale);
		glw.rotateZ(-this.layer.getAngle());
		glw.translate((this.layer.viewLeft + this.layer.viewRight) / -2, (this.layer.viewTop + this.layer.viewBottom) / -2);
		glw.updateModelView();
		this.last_render_tick = this.runtime.tickcount;
	};
	var wordsCache = [];
	pluginProto.TokeniseWords = function (text)
	{
		cr.clearArray(wordsCache);
		var cur_word = "";
		var ch;
		var i = 0;
		while (i < text.length)
		{
			ch = text.charAt(i);
			if (ch === "\n")
			{
				if (cur_word.length)
				{
					wordsCache.push(cur_word);
					cur_word = "";
				}
				wordsCache.push("\n");
				++i;
			}
			else if (ch === " " || ch === "\t" || ch === "-")
			{
				do {
					cur_word += text.charAt(i);
					i++;
				}
				while (i < text.length && (text.charAt(i) === " " || text.charAt(i) === "\t"));
				wordsCache.push(cur_word);
				cur_word = "";
			}
			else if (i < text.length)
			{
				cur_word += ch;
				i++;
			}
		}
		if (cur_word.length)
			wordsCache.push(cur_word);
	};
	var linesCache = [];
	function allocLine()
	{
		if (linesCache.length)
			return linesCache.pop();
		else
			return {};
	};
	function freeLine(l)
	{
		linesCache.push(l);
	};
	function freeAllLines(arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; i++)
		{
			freeLine(arr[i]);
		}
		cr.clearArray(arr);
	};
	pluginProto.WordWrap = function (text, lines, ctx, width, wrapbyword)
	{
		if (!text || !text.length)
		{
			freeAllLines(lines);
			return;
		}
		if (width <= 2.0)
		{
			freeAllLines(lines);
			return;
		}
		if (text.length <= 100 && text.indexOf("\n") === -1)
		{
			var all_width = ctx.measureText(text).width;
			if (all_width <= width)
			{
				freeAllLines(lines);
				lines.push(allocLine());
				lines[0].text = text;
				lines[0].width = all_width;
				return;
			}
		}
		this.WrapText(text, lines, ctx, width, wrapbyword);
	};
	function trimSingleSpaceRight(str)
	{
		if (!str.length || str.charAt(str.length - 1) !== " ")
			return str;
		return str.substring(0, str.length - 1);
	};
	pluginProto.WrapText = function (text, lines, ctx, width, wrapbyword)
	{
		var wordArray;
		if (wrapbyword)
		{
			this.TokeniseWords(text);	// writes to wordsCache
			wordArray = wordsCache;
		}
		else
			wordArray = text;
		var cur_line = "";
		var prev_line;
		var line_width;
		var i;
		var lineIndex = 0;
		var line;
		for (i = 0; i < wordArray.length; i++)
		{
			if (wordArray[i] === "\n")
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				cur_line = trimSingleSpaceRight(cur_line);		// for correct center/right alignment
				line = lines[lineIndex];
				line.text = cur_line;
				line.width = ctx.measureText(cur_line).width;
				lineIndex++;
				cur_line = "";
				continue;
			}
			prev_line = cur_line;
			cur_line += wordArray[i];
			line_width = ctx.measureText(cur_line).width;
			if (line_width >= width)
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				prev_line = trimSingleSpaceRight(prev_line);
				line = lines[lineIndex];
				line.text = prev_line;
				line.width = ctx.measureText(prev_line).width;
				lineIndex++;
				cur_line = wordArray[i];
				if (!wrapbyword && cur_line === " ")
					cur_line = "";
			}
		}
		if (cur_line.length)
		{
			if (lineIndex >= lines.length)
				lines.push(allocLine());
			cur_line = trimSingleSpaceRight(cur_line);
			line = lines[lineIndex];
			line.text = cur_line;
			line.width = ctx.measureText(cur_line).width;
			lineIndex++;
		}
		for (i = lineIndex; i < lines.length; i++)
			freeLine(lines[i]);
		lines.length = lineIndex;
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function(text_to_compare, case_sensitive)
	{
		if (case_sensitive)
			return this.text == text_to_compare;
		else
			return cr.equals_nocase(this.text, text_to_compare);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function(param)
	{
		if (cr.is_number(param) && param < 1e9)
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_set = param.toString();
		if (this.text !== text_to_set)
		{
			this.text = text_to_set;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_append = param.toString();
		if (text_to_append)	// not empty
		{
			this.text += text_to_append;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		switch (style_) {
		case 1: newstyle = "bold"; break;
		case 2: newstyle = "italic"; break;
		case 3: newstyle = "bold italic"; break;
		}
		if (face_ === this.facename && newstyle === this.fontstyle)
			return;		// no change
		this.facename = face_;
		this.fontstyle = newstyle;
		this.updateFont();
	};
	Acts.prototype.SetFontSize = function (size_)
	{
		if (this.ptSize === size_)
			return;
		this.ptSize = size_;
		this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
		this.updateFont();
	};
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		if (newcolor === this.color)
			return;
		this.color = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	};
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		var self = this;
		var refreshFunc = (function () {
							self.runtime.redraw = true;
							self.text_changed = true;
						});
		if (requestedWebFonts.hasOwnProperty(cssurl_))
		{
			var newfacename = "'" + familyname_ + "'";
			if (this.facename === newfacename)
				return;	// no change
			this.facename = newfacename;
			this.updateFont();
			for (var i = 1; i < 10; i++)
			{
				setTimeout(refreshFunc, i * 100);
				setTimeout(refreshFunc, i * 1000);
			}
			return;
		}
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		this.facename = "'" + familyname_ + "'";
		this.updateFont();
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
;
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function(ret)
	{
		ret.set_string(this.text);
	};
	Exps.prototype.FaceName = function (ret)
	{
		ret.set_string(this.facename);
	};
	Exps.prototype.FaceSize = function (ret)
	{
		ret.set_int(this.ptSize);
	};
	Exps.prototype.TextWidth = function (ret)
	{
		var w = 0;
		var i, len, x;
		for (i = 0, len = this.lines.length; i < len; i++)
		{
			x = this.lines[i].width;
			if (w < x)
				w = x;
		}
		ret.set_int(w);
	};
	Exps.prototype.TextHeight = function (ret)
	{
		ret.set_int(this.lines.length * (this.pxHeight + this.line_height_offset) - this.line_height_offset);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.TextBox = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.TextBox.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var elemTypes = ["text", "password", "email", "number", "tel", "url"];
	if (navigator.userAgent.indexOf("MSIE 9") > -1)
	{
		elemTypes[2] = "text";
		elemTypes[3] = "text";
		elemTypes[4] = "text";
		elemTypes[5] = "text";
	}
	instanceProto.onCreate = function()
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Textbox plugin not supported on this platform - the object will not be created");
			return;
		}
		if (this.properties[7] === 6)	// textarea
		{
			this.elem = document.createElement("textarea");
			jQuery(this.elem).css("resize", "none");
		}
		else
		{
			this.elem = document.createElement("input");
			this.elem.type = elemTypes[this.properties[7]];
		}
		this.elem.id = this.properties[9];
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		this.elem["autocomplete"] = "off";
		this.elem.value = this.properties[0];
		this.elem["placeholder"] = this.properties[1];
		this.elem.title = this.properties[2];
		this.elem.disabled = (this.properties[4] === 0);
		this.elem["readOnly"] = (this.properties[5] === 1);
		this.elem["spellcheck"] = (this.properties[6] === 1);
		this.autoFontSize = (this.properties[8] !== 0);
		this.element_hidden = false;
		if (this.properties[3] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
			this.element_hidden = true;
		}
		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnTextChanged, self);
			};
		})(this);
		this.elem["oninput"] = onchangetrigger;
		if (navigator.userAgent.indexOf("MSIE") !== -1)
			this.elem["oncut"] = onchangetrigger;
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		this.elem.ondblclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.isInUserInputEvent = true;
				self.runtime.trigger(cr.plugins_.TextBox.prototype.cnds.OnDoubleClicked, self);
				self.runtime.isInUserInputEvent = false;
			};
		})(this);
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		jQuery(this.elem).keydown(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		jQuery(this.elem).keyup(function (e) {
			if (e.which !== 13 && e.which != 27)	// allow enter and escape
				e.stopPropagation();
		});
		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.updatePosition(true);
		this.runtime.tickMe(this);
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"text": this.elem.value,
			"placeholder": this.elem.placeholder,
			"tooltip": this.elem.title,
			"disabled": !!this.elem.disabled,
			"readonly": !!this.elem.readOnly,
			"spellcheck": !!this.elem["spellcheck"]
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.elem.value = o["text"];
		this.elem.placeholder = o["placeholder"];
		this.elem.title = o["tooltip"];
		this.elem.disabled = o["disabled"];
		this.elem.readOnly = o["readonly"];
		this.elem["spellcheck"] = o["spellcheck"];
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
				return;
		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		var rightEdge = this.runtime.width / this.runtime.devicePixelRatio;
		var bottomEdge = this.runtime.height / this.runtime.devicePixelRatio;
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= rightEdge || top >= bottomEdge)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			this.element_hidden = true;
			return;
		}
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= rightEdge)
			right = rightEdge - 1;
		if (bottom >= bottomEdge)
			bottom = bottomEdge - 1;
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			return;
		}
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", ((this.layer.getScale(true) / this.runtime.devicePixelRatio) - 0.2) + "em");
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function(glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function (text, case_)
	{
		if (this.runtime.isDomFree)
			return false;
		if (case_ === 0)	// insensitive
			return cr.equals_nocase(this.elem.value, text);
		else
			return this.elem.value === text;
	};
	Cnds.prototype.OnTextChanged = function ()
	{
		return true;
	};
	Cnds.prototype.OnClicked = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleClicked = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.value = text;
	};
	Acts.prototype.SetPlaceholder = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.placeholder = text;
	};
	Acts.prototype.SetTooltip = function (text)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.title = text;
	};
	Acts.prototype.SetVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		this.visible = (vis !== 0);
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.disabled = (en === 0);
	};
	Acts.prototype.SetReadOnly = function (ro)
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.readOnly = (ro === 0);
	};
	Acts.prototype.SetFocus = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.focus();
	};
	Acts.prototype.SetBlur = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.blur();
	};
	Acts.prototype.SetCSSStyle = function (p, v)
	{
		if (this.runtime.isDomFree)
			return;
		jQuery(this.elem).css(p, v);
	};
	Acts.prototype.ScrollToBottom = function ()
	{
		if (this.runtime.isDomFree)
			return;
		this.elem.scrollTop = this.elem.scrollHeight;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function (ret)
	{
		if (this.runtime.isDomFree)
		{
			ret.set_string("");
			return;
		}
		ret.set_string(this.elem.value);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.TiledBg = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.TiledBg.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		this.pattern = null;
		this.webGL_texture = null;
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		this.webGL_texture = null;
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].webGL_texture = this.webGL_texture;
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.webGL_texture || !this.runtime.glwrap)
			return;
		this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.webGL_texture)
			return;
		this.runtime.glwrap.deleteTexture(this.webGL_texture);
		this.webGL_texture = null;
	};
	typeProto.preloadCanvas2D = function (ctx)
	{
		ctx.drawImage(this.texture_img, 0, 0);
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.rcTex = new cr.rect(0, 0, 0, 0);
		this.has_own_texture = false;										// true if a texture loaded in from URL
		this.texture_img = this.type.texture_img;
		if (this.runtime.glwrap)
		{
			this.type.loadTextures();
			this.webGL_texture = this.type.webGL_texture;
		}
		else
		{
			if (!this.type.pattern)
				this.type.pattern = this.runtime.ctx.createPattern(this.type.texture_img, "repeat");
			this.pattern = this.type.pattern;
		}
	};
	instanceProto.afterLoad = function ()
	{
		this.has_own_texture = false;
		this.texture_img = this.type.texture_img;
	};
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.glwrap && this.has_own_texture && this.webGL_texture)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.webGL_texture = null;
		}
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		ctx.save();
		ctx.fillStyle = this.pattern;
		var myx = this.x;
		var myy = this.y;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		var offX = drawX % this.texture_img.width;
		var offY = drawY % this.texture_img.height;
		if (offX < 0)
			offX += this.texture_img.width;
		if (offY < 0)
			offY += this.texture_img.height;
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
		ctx.translate(offX, offY);
		ctx.fillRect(drawX - offX,
					 drawY - offY,
					 this.width,
					 this.height);
		ctx.restore();
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.webGL_texture);
		glw.setOpacity(this.opacity);
		var rcTex = this.rcTex;
		rcTex.right = this.width / this.texture_img.width;
		rcTex.bottom = this.height / this.texture_img.height;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, rcTex);
		}
		else
			glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, rcTex);
	};
	function Cnds() {};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.LoadURL = function (url_)
	{
		var img = new Image();
		var self = this;
		img.onload = function ()
		{
			self.texture_img = img;
			if (self.runtime.glwrap)
			{
				if (self.has_own_texture && self.webGL_texture)
					self.runtime.glwrap.deleteTexture(self.webGL_texture);
				self.webGL_texture = self.runtime.glwrap.loadTexture(img, true, self.runtime.linearSampling);
			}
			else
			{
				self.pattern = self.runtime.ctx.createPattern(img, "repeat");
			}
			self.has_own_texture = true;
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.TiledBg.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:")
			img.crossOrigin = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.texture_img.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.texture_img.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Touch = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Touch.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.touches = [];
		this.mouseDown = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var dummyoffset = {left: 0, top: 0};
	instanceProto.findTouch = function (id)
	{
		var i, len;
		for (i = 0, len = this.touches.length; i < len; i++)
		{
			if (this.touches[i]["id"] === id)
				return i;
		}
		return -1;
	};
	var appmobi_accx = 0;
	var appmobi_accy = 0;
	var appmobi_accz = 0;
	function AppMobiGetAcceleration(evt)
	{
		appmobi_accx = evt.x;
		appmobi_accy = evt.y;
		appmobi_accz = evt.z;
	};
	var pg_accx = 0;
	var pg_accy = 0;
	var pg_accz = 0;
	function PhoneGapGetAcceleration(evt)
	{
		pg_accx = evt.x;
		pg_accy = evt.y;
		pg_accz = evt.z;
	};
	var theInstance = null;
	var touchinfo_cache = [];
	function AllocTouchInfo(x, y, id, index)
	{
		var ret;
		if (touchinfo_cache.length)
			ret = touchinfo_cache.pop();
		else
			ret = new TouchInfo();
		ret.init(x, y, id, index);
		return ret;
	};
	function ReleaseTouchInfo(ti)
	{
		if (touchinfo_cache.length < 100)
			touchinfo_cache.push(ti);
	};
	var GESTURE_HOLD_THRESHOLD = 15;		// max px motion for hold gesture to register
	var GESTURE_HOLD_TIMEOUT = 500;			// time for hold gesture to register
	var GESTURE_TAP_TIMEOUT = 333;			// time for tap gesture to register
	var GESTURE_DOUBLETAP_THRESHOLD = 25;	// max distance apart for taps to be
	function TouchInfo()
	{
		this.starttime = 0;
		this.time = 0;
		this.lasttime = 0;
		this.startx = 0;
		this.starty = 0;
		this.x = 0;
		this.y = 0;
		this.lastx = 0;
		this.lasty = 0;
		this["id"] = 0;
		this.startindex = 0;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.init = function (x, y, id, index)
	{
		var nowtime = cr.performance_now();
		this.time = nowtime;
		this.lasttime = nowtime;
		this.starttime = nowtime;
		this.startx = x;
		this.starty = y;
		this.x = x;
		this.y = y;
		this.lastx = x;
		this.lasty = y;
		this.width = 0;
		this.height = 0;
		this.pressure = 0;
		this["id"] = id;
		this.startindex = index;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.update = function (nowtime, x, y, width, height, pressure)
	{
		this.lasttime = this.time;
		this.time = nowtime;
		this.lastx = this.x;
		this.lasty = this.y;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.pressure = pressure;
		if (!this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) >= GESTURE_HOLD_THRESHOLD)
		{
			this.tooFarForHold = true;
		}
	};
	TouchInfo.prototype.maybeTriggerHold = function (inst, index)
	{
		if (this.triggeredHold)
			return;		// already triggered this gesture
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime >= GESTURE_HOLD_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			this.triggeredHold = true;
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGesture, inst);
			inst.curTouchX = this.x;
			inst.curTouchY = this.y;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGestureObject, inst);
			inst.getTouchIndex = 0;
		}
	};
	var lastTapX = -1000;
	var lastTapY = -1000;
	var lastTapTime = -10000;
	TouchInfo.prototype.maybeTriggerTap = function (inst, index)
	{
		if (this.triggeredHold)
			return;
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime <= GESTURE_TAP_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			if ((nowtime - lastTapTime <= GESTURE_TAP_TIMEOUT * 2) && cr.distanceTo(lastTapX, lastTapY, this.x, this.y) < GESTURE_DOUBLETAP_THRESHOLD)
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGestureObject, inst);
				lastTapX = -1000;
				lastTapY = -1000;
				lastTapTime = -10000;
			}
			else
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGestureObject, inst);
				lastTapX = this.x;
				lastTapY = this.y;
				lastTapTime = nowtime;
			}
			inst.getTouchIndex = 0;
		}
	};
	instanceProto.onCreate = function()
	{
		theInstance = this;
		this.isWindows8 = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.orient_alpha = 0;
		this.orient_beta = 0;
		this.orient_gamma = 0;
		this.acc_g_x = 0;
		this.acc_g_y = 0;
		this.acc_g_z = 0;
		this.acc_x = 0;
		this.acc_y = 0;
		this.acc_z = 0;
		this.curTouchX = 0;
		this.curTouchY = 0;
		this.trigger_index = 0;
		this.trigger_id = 0;
		this.getTouchIndex = 0;
		this.useMouseInput = (this.properties[0] !== 0);
		var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
		var elem2 = document;
		if (this.runtime.isDirectCanvas)
			elem2 = elem = window["Canvas"];
		else if (this.runtime.isCocoonJs)
			elem2 = elem = window;
		var self = this;
		if (window.navigator["pointerEnabled"])
		{
			elem.addEventListener("pointerdown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("pointermove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("pointerup",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("pointercancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				this.runtime.canvas.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else if (window.navigator["msPointerEnabled"])
		{
			elem.addEventListener("MSPointerDown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("MSPointerMove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("MSPointerUp",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("MSPointerCancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else
		{
			elem.addEventListener("touchstart",
				function(info) {
					self.onTouchStart(info);
				},
				false
			);
			elem.addEventListener("touchmove",
				function(info) {
					self.onTouchMove(info);
				},
				false
			);
			elem2.addEventListener("touchend",
				function(info) {
					self.onTouchEnd(info, false);
				},
				false
			);
			elem2.addEventListener("touchcancel",
				function(info) {
					self.onTouchEnd(info, true);
				},
				false
			);
		}
		if (this.isWindows8)
		{
			var win8accelerometerFn = function(e) {
					var reading = e["reading"];
					self.acc_x = reading["accelerationX"];
					self.acc_y = reading["accelerationY"];
					self.acc_z = reading["accelerationZ"];
				};
			var win8inclinometerFn = function(e) {
					var reading = e["reading"];
					self.orient_alpha = reading["yawDegrees"];
					self.orient_beta = reading["pitchDegrees"];
					self.orient_gamma = reading["rollDegrees"];
				};
			var accelerometer = Windows["Devices"]["Sensors"]["Accelerometer"]["getDefault"]();
            if (accelerometer)
			{
                accelerometer["reportInterval"] = Math.max(accelerometer["minimumReportInterval"], 16);
				accelerometer.addEventListener("readingchanged", win8accelerometerFn);
            }
			var inclinometer = Windows["Devices"]["Sensors"]["Inclinometer"]["getDefault"]();
			if (inclinometer)
			{
				inclinometer["reportInterval"] = Math.max(inclinometer["minimumReportInterval"], 16);
				inclinometer.addEventListener("readingchanged", win8inclinometerFn);
			}
			document.addEventListener("visibilitychange", function(e) {
				if (document["hidden"] || document["msHidden"])
				{
					if (accelerometer)
						accelerometer.removeEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.removeEventListener("readingchanged", win8inclinometerFn);
				}
				else
				{
					if (accelerometer)
						accelerometer.addEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.addEventListener("readingchanged", win8inclinometerFn);
				}
			}, false);
		}
		else
		{
			window.addEventListener("deviceorientation", function (eventData) {
				self.orient_alpha = eventData["alpha"] || 0;
				self.orient_beta = eventData["beta"] || 0;
				self.orient_gamma = eventData["gamma"] || 0;
			}, false);
			window.addEventListener("devicemotion", function (eventData) {
				if (eventData["accelerationIncludingGravity"])
				{
					self.acc_g_x = eventData["accelerationIncludingGravity"]["x"] || 0;
					self.acc_g_y = eventData["accelerationIncludingGravity"]["y"] || 0;
					self.acc_g_z = eventData["accelerationIncludingGravity"]["z"] || 0;
				}
				if (eventData["acceleration"])
				{
					self.acc_x = eventData["acceleration"]["x"] || 0;
					self.acc_y = eventData["acceleration"]["y"] || 0;
					self.acc_z = eventData["acceleration"]["z"] || 0;
				}
			}, false);
		}
		if (this.useMouseInput && !this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
		}
		if (!this.runtime.isiOS && this.runtime.isCordova && navigator["accelerometer"] && navigator["accelerometer"]["watchAcceleration"])
		{
			navigator["accelerometer"]["watchAcceleration"](PhoneGapGetAcceleration, null, { "frequency": 40 });
		}
		this.runtime.tick2Me(this);
	};
	instanceProto.onPointerMove = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault)
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		var nowtime = cr.performance_now();
		if (i >= 0)
		{
			var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
			var t = this.touches[i];
			if (nowtime - t.time < 2)
				return;
			t.update(nowtime, info.pageX - offset.left, info.pageY - offset.top, info.width || 0, info.height || 0, info.pressure || 0);
		}
	};
	instanceProto.onPointerStart = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var touchx = info.pageX - offset.left;
		var touchy = info.pageY - offset.top;
		var nowtime = cr.performance_now();
		this.trigger_index = this.touches.length;
		this.trigger_id = info["pointerId"];
		this.touches.push(AllocTouchInfo(touchx, touchy, info["pointerId"], this.trigger_index));
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
		this.curTouchX = touchx;
		this.curTouchY = touchy;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onPointerEnd = function (info, isCancel)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		this.trigger_index = (i >= 0 ? this.touches[i].startindex : -1);
		this.trigger_id = (i >= 0 ? this.touches[i]["id"] : -1);
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
		if (i >= 0)
		{
			if (!isCancel)
				this.touches[i].maybeTriggerTap(this, i);
			ReleaseTouchInfo(this.touches[i]);
			this.touches.splice(i, 1);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchMove = function (info)
	{
		if (info.preventDefault)
			info.preventDefault();
		var nowtime = cr.performance_now();
		var i, len, t, u;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			var j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
				u = this.touches[j];
				if (nowtime - u.time < 2)
					continue;
				var touchWidth = (t.radiusX || t.webkitRadiusX || t.mozRadiusX || t.msRadiusX || 0) * 2;
				var touchHeight = (t.radiusY || t.webkitRadiusY || t.mozRadiusY || t.msRadiusY || 0) * 2;
				var touchForce = t.force || t.webkitForce || t.mozForce || t.msForce || 0;
				u.update(nowtime, t.pageX - offset.left, t.pageY - offset.top, touchWidth, touchHeight, touchForce);
			}
		}
	};
	instanceProto.onTouchStart = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var nowtime = cr.performance_now();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j !== -1)
				continue;
			var touchx = t.pageX - offset.left;
			var touchy = t.pageY - offset.top;
			this.trigger_index = this.touches.length;
			this.trigger_id = t["identifier"];
			this.touches.push(AllocTouchInfo(touchx, touchy, t["identifier"], this.trigger_index));
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
			this.curTouchX = touchx;
			this.curTouchY = touchy;
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchEnd = function (info, isCancel)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				this.trigger_index = this.touches[j].startindex;
				this.trigger_id = this.touches[j]["id"];
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
				if (!isCancel)
					this.touches[j].maybeTriggerTap(this, j);
				ReleaseTouchInfo(this.touches[j]);
				this.touches.splice(j, 1);
			}
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.getAlpha = function ()
	{
		if (this.runtime.isCordova && this.orient_alpha === 0 && pg_accz !== 0)
			return pg_accz * 90;
		else
			return this.orient_alpha;
	};
	instanceProto.getBeta = function ()
	{
		if (this.runtime.isCordova && this.orient_beta === 0 && pg_accy !== 0)
			return pg_accy * 90;
		else
			return this.orient_beta;
	};
	instanceProto.getGamma = function ()
	{
		if (this.runtime.isCordova && this.orient_gamma === 0 && pg_accx !== 0)
			return pg_accx * 90;
		else
			return this.orient_gamma;
	};
	var noop_func = function(){};
	instanceProto.onMouseDown = function(info)
	{
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchStart(fakeinfo);
		this.mouseDown = true;
	};
	instanceProto.onMouseMove = function(info)
	{
		if (!this.mouseDown)
			return;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchMove(fakeinfo);
	};
	instanceProto.onMouseUp = function(info)
	{
		if (info.preventDefault && this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchEnd(fakeinfo);
		this.mouseDown = false;
	};
	instanceProto.tick2 = function()
	{
		var i, len, t;
		var nowtime = cr.performance_now();
		for (i = 0, len = this.touches.length; i < len; ++i)
		{
			t = this.touches[i];
			if (t.time <= nowtime - 50)
				t.lasttime = nowtime;
			t.maybeTriggerHold(this, i);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnTouchStart = function ()
	{
		return true;
	};
	Cnds.prototype.OnTouchEnd = function ()
	{
		return true;
	};
	Cnds.prototype.IsInTouch = function ()
	{
		return this.touches.length;
	};
	Cnds.prototype.OnTouchObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	var touching = [];
	Cnds.prototype.IsTouchingObject = function (type)
	{
		if (!type)
			return false;
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		var px, py;
		var i, leni, j, lenj;
		for (i = 0, leni = instances.length; i < leni; i++)
		{
			var inst = instances[i];
			inst.update_bbox();
			for (j = 0, lenj = this.touches.length; j < lenj; j++)
			{
				var touch = this.touches[j];
				px = inst.layer.canvasToLayer(touch.x, touch.y, true);
				py = inst.layer.canvasToLayer(touch.x, touch.y, false);
				if (inst.contains_pt(px, py))
				{
					touching.push(inst);
					break;
				}
			}
		}
		if (touching.length)
		{
			sol.select_all = false;
			cr.shallowAssignArray(sol.instances, touching);
			type.applySolToContainer();
			cr.clearArray(touching);
			return true;
		}
		else
			return false;
	};
	Cnds.prototype.CompareTouchSpeed = function (index, cmp, s)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
			return false;
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		var speed = 0;
		if (timediff > 0)
			speed = dist / timediff;
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.OrientationSupported = function ()
	{
		return typeof window["DeviceOrientationEvent"] !== "undefined";
	};
	Cnds.prototype.MotionSupported = function ()
	{
		return typeof window["DeviceMotionEvent"] !== "undefined";
	};
	Cnds.prototype.CompareOrientation = function (orientation_, cmp_, angle_)
	{
		var v = 0;
		if (orientation_ === 0)
			v = this.getAlpha();
		else if (orientation_ === 1)
			v = this.getBeta();
		else
			v = this.getGamma();
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.CompareAcceleration = function (acceleration_, cmp_, angle_)
	{
		var v = 0;
		if (acceleration_ === 0)
			v = this.acc_g_x;
		else if (acceleration_ === 1)
			v = this.acc_g_y;
		else if (acceleration_ === 2)
			v = this.acc_g_z;
		else if (acceleration_ === 3)
			v = this.acc_x;
		else if (acceleration_ === 4)
			v = this.acc_y;
		else if (acceleration_ === 5)
			v = this.acc_z;
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.OnNthTouchStart = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.OnNthTouchEnd = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.HasNthTouch = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return this.touches.length >= touch_ + 1;
	};
	Cnds.prototype.OnHoldGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnHoldGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnDoubleTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	pluginProto.cnds = new Cnds();
	function Exps() {};
	Exps.prototype.TouchCount = function (ret)
	{
		ret.set_int(this.touches.length);
	};
	Exps.prototype.X = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].x);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteXAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].x);
	};
	Exps.prototype.AbsoluteXForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.x);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].y);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteYAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].y);
	};
	Exps.prototype.AbsoluteYForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.y);
	};
	Exps.prototype.SpeedAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		if (timediff === 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.SpeedForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var dist = cr.distanceTo(touch.x, touch.y, touch.lastx, touch.lasty);
		var timediff = (touch.time - touch.lasttime) / 1000;
		if (timediff === 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.AngleAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(t.lastx, t.lasty, t.x, t.y)));
	};
	Exps.prototype.AngleForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(touch.lastx, touch.lasty, touch.x, touch.y)));
	};
	Exps.prototype.Alpha = function (ret)
	{
		ret.set_float(this.getAlpha());
	};
	Exps.prototype.Beta = function (ret)
	{
		ret.set_float(this.getBeta());
	};
	Exps.prototype.Gamma = function (ret)
	{
		ret.set_float(this.getGamma());
	};
	Exps.prototype.AccelerationXWithG = function (ret)
	{
		ret.set_float(this.acc_g_x);
	};
	Exps.prototype.AccelerationYWithG = function (ret)
	{
		ret.set_float(this.acc_g_y);
	};
	Exps.prototype.AccelerationZWithG = function (ret)
	{
		ret.set_float(this.acc_g_z);
	};
	Exps.prototype.AccelerationX = function (ret)
	{
		ret.set_float(this.acc_x);
	};
	Exps.prototype.AccelerationY = function (ret)
	{
		ret.set_float(this.acc_y);
	};
	Exps.prototype.AccelerationZ = function (ret)
	{
		ret.set_float(this.acc_z);
	};
	Exps.prototype.TouchIndex = function (ret)
	{
		ret.set_int(this.trigger_index);
	};
	Exps.prototype.TouchID = function (ret)
	{
		ret.set_float(this.trigger_id);
	};
	Exps.prototype.WidthForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.width);
	};
	Exps.prototype.HeightForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.height);
	};
	Exps.prototype.PressureForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.pressure);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.behaviors.Anchor = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Anchor.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.anch_left = this.properties[0];		// 0 = left, 1 = right, 2 = none
		this.anch_top = this.properties[1];			// 0 = top, 1 = bottom, 2 = none
		this.anch_right = this.properties[2];		// 0 = none, 1 = right
		this.anch_bottom = this.properties[3];		// 0 = none, 1 = bottom
		this.inst.update_bbox();
		this.xleft = this.inst.bbox.left;
		this.ytop = this.inst.bbox.top;
		this.xright = this.runtime.original_width - this.inst.bbox.left;
		this.ybottom = this.runtime.original_height - this.inst.bbox.top;
		this.rdiff = this.runtime.original_width - this.inst.bbox.right;
		this.bdiff = this.runtime.original_height - this.inst.bbox.bottom;
		this.enabled = (this.properties[4] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"xleft": this.xleft,
			"ytop": this.ytop,
			"xright": this.xright,
			"ybottom": this.ybottom,
			"rdiff": this.rdiff,
			"bdiff": this.bdiff,
			"enabled": this.enabled
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.xleft = o["xleft"];
		this.ytop = o["ytop"];
		this.xright = o["xright"];
		this.ybottom = o["ybottom"];
		this.rdiff = o["rdiff"];
		this.bdiff = o["bdiff"];
		this.enabled = o["enabled"];
	};
	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		var n;
		var layer = this.inst.layer;
		var inst = this.inst;
		var bbox = this.inst.bbox;
		if (this.anch_left === 0)
		{
			inst.update_bbox();
			n = (layer.viewLeft + this.xleft) - bbox.left;
			if (n !== 0)
			{
				inst.x += n;
				inst.set_bbox_changed();
			}
		}
		else if (this.anch_left === 1)
		{
			inst.update_bbox();
			n = (layer.viewRight - this.xright) - bbox.left;
			if (n !== 0)
			{
				inst.x += n;
				inst.set_bbox_changed();
			}
		}
		if (this.anch_top === 0)
		{
			inst.update_bbox();
			n = (layer.viewTop + this.ytop) - bbox.top;
			if (n !== 0)
			{
				inst.y += n;
				inst.set_bbox_changed();
			}
		}
		else if (this.anch_top === 1)
		{
			inst.update_bbox();
			n = (layer.viewBottom - this.ybottom) - bbox.top;
			if (n !== 0)
			{
				inst.y += n;
				inst.set_bbox_changed();
			}
		}
		if (this.anch_right === 1)
		{
			inst.update_bbox();
			n = (layer.viewRight - this.rdiff) - bbox.right;
			if (n !== 0)
			{
				inst.width += n;
				if (inst.width < 0)
					inst.width = 0;
				inst.set_bbox_changed();
			}
		}
		if (this.anch_bottom === 1)
		{
			inst.update_bbox();
			n = (layer.viewBottom - this.bdiff) - bbox.bottom;
			if (n !== 0)
			{
				inst.height += n;
				if (inst.height < 0)
					inst.height = 0;
				inst.set_bbox_changed();
			}
		}
	};
	function Cnds() {};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (e)
	{
		if (this.enabled && e === 0)
			this.enabled = false;
		else if (!this.enabled && e !== 0)
		{
			this.inst.update_bbox();
			this.xleft = this.inst.bbox.left;
			this.ytop = this.inst.bbox.top;
			this.xright = this.runtime.original_width - this.inst.bbox.left;
			this.ybottom = this.runtime.original_height - this.inst.bbox.top;
			this.rdiff = this.runtime.original_width - this.inst.bbox.right;
			this.bdiff = this.runtime.original_height - this.inst.bbox.bottom;
			this.enabled = true;
		}
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Bullet = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Bullet.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		var speed = this.properties[0];
		this.acc = this.properties[1];
		this.g = this.properties[2];
		this.bounceOffSolid = (this.properties[3] !== 0);
		this.setAngle = (this.properties[4] !== 0);
		this.dx = Math.cos(this.inst.angle) * speed;
		this.dy = Math.sin(this.inst.angle) * speed;
		this.lastx = this.inst.x;
		this.lasty = this.inst.y;
		this.lastKnownAngle = this.inst.angle;
		this.travelled = 0;
		this.enabled = (this.properties[5] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"acc": this.acc,
			"g": this.g,
			"dx": this.dx,
			"dy": this.dy,
			"lx": this.lastx,
			"ly": this.lasty,
			"lka": this.lastKnownAngle,
			"t": this.travelled,
			"e": this.enabled
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.acc = o["acc"];
		this.g = o["g"];
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.lastx = o["lx"];
		this.lasty = o["ly"];
		this.lastKnownAngle = o["lka"];
		this.travelled = o["t"];
		this.enabled = o["e"];
	};
	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		var dt = this.runtime.getDt(this.inst);
		var s, a;
		var bounceSolid, bounceAngle;
		if (this.inst.angle !== this.lastKnownAngle)
		{
			if (this.setAngle)
			{
				s = cr.distanceTo(0, 0, this.dx, this.dy);
				this.dx = Math.cos(this.inst.angle) * s;
				this.dy = Math.sin(this.inst.angle) * s;
			}
			this.lastKnownAngle = this.inst.angle;
		}
		if (this.acc !== 0)
		{
			s = cr.distanceTo(0, 0, this.dx, this.dy);
			if (this.dx === 0 && this.dy === 0)
				a = this.inst.angle;
			else
				a = cr.angleTo(0, 0, this.dx, this.dy);
			s += this.acc * dt;
			if (s < 0)
				s = 0;
			this.dx = Math.cos(a) * s;
			this.dy = Math.sin(a) * s;
		}
		if (this.g !== 0)
			this.dy += this.g * dt;
		this.lastx = this.inst.x;
		this.lasty = this.inst.y;
		if (this.dx !== 0 || this.dy !== 0)
		{
			this.inst.x += this.dx * dt;
			this.inst.y += this.dy * dt;
			this.travelled += cr.distanceTo(0, 0, this.dx * dt, this.dy * dt)
			if (this.setAngle)
			{
				this.inst.angle = cr.angleTo(0, 0, this.dx, this.dy);
				this.inst.set_bbox_changed();
				this.lastKnownAngle = this.inst.angle;
			}
			this.inst.set_bbox_changed();
			if (this.bounceOffSolid)
			{
				bounceSolid = this.runtime.testOverlapSolid(this.inst);
				if (bounceSolid)
				{
					this.runtime.registerCollision(this.inst, bounceSolid);
					s = cr.distanceTo(0, 0, this.dx, this.dy);
					bounceAngle = this.runtime.calculateSolidBounceAngle(this.inst, this.lastx, this.lasty);
					this.dx = Math.cos(bounceAngle) * s;
					this.dy = Math.sin(bounceAngle) * s;
					this.inst.x += this.dx * dt;			// move out for one tick since the object can't have spent a tick in the solid
					this.inst.y += this.dy * dt;
					this.inst.set_bbox_changed();
					if (this.setAngle)
					{
						this.inst.angle = bounceAngle;
						this.lastKnownAngle = bounceAngle;
						this.inst.set_bbox_changed();
					}
					if (!this.runtime.pushOutSolid(this.inst, this.dx / s, this.dy / s, Math.max(s * 2.5 * dt, 30)))
						this.runtime.pushOutSolidNearest(this.inst, 100);
				}
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		return cr.do_cmp(cr.distanceTo(0, 0, this.dx, this.dy), cmp, s);
	};
	Cnds.prototype.CompareTravelled = function (cmp, d)
	{
		return cr.do_cmp(this.travelled, cmp, d);
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpeed = function (s)
	{
		var a = cr.angleTo(0, 0, this.dx, this.dy);
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.SetAcceleration = function (a)
	{
		this.acc = a;
	};
	Acts.prototype.SetGravity = function (g)
	{
		this.g = g;
	};
	Acts.prototype.SetAngleOfMotion = function (a)
	{
		a = cr.to_radians(a);
		var s = cr.distanceTo(0, 0, this.dx, this.dy)
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.Bounce = function (objtype)
	{
		if (!objtype)
			return;
		var otherinst = objtype.getFirstPicked(this.inst);
		if (!otherinst)
			return;
		var dt = this.runtime.getDt(this.inst);
		var s = cr.distanceTo(0, 0, this.dx, this.dy);
		var bounceAngle = this.runtime.calculateSolidBounceAngle(this.inst, this.lastx, this.lasty, otherinst);
		this.dx = Math.cos(bounceAngle) * s;
		this.dy = Math.sin(bounceAngle) * s;
		this.inst.x += this.dx * dt;			// move out for one tick since the object can't have spent a tick in the solid
		this.inst.y += this.dy * dt;
		this.inst.set_bbox_changed();
		if (this.setAngle)
		{
			this.inst.angle = bounceAngle;
			this.lastKnownAngle = bounceAngle;
			this.inst.set_bbox_changed();
		}
		if (this.bounceOffSolid)
		{
			if (!this.runtime.pushOutSolid(this.inst, this.dx / s, this.dy / s, Math.max(s * 2.5 * dt, 30)))
				this.runtime.pushOutSolidNearest(this.inst, 100);
		}
		else if (s !== 0)
		{
			this.runtime.pushOut(this.inst, this.dx / s, this.dy / s, Math.max(s * 2.5 * dt, 30), otherinst)
		}
	};
	Acts.prototype.SetDistanceTravelled = function (d)
	{
		this.travelled = d;
	};
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		var s = cr.distanceTo(0, 0, this.dx, this.dy);
		s = cr.round6dp(s);
		ret.set_float(s);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.AngleOfMotion = function (ret)
	{
		ret.set_float(cr.to_degrees(cr.angleTo(0, 0, this.dx, this.dy)));
	};
	Exps.prototype.DistanceTravelled = function (ret)
	{
		ret.set_float(this.travelled);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.DragnDrop = function(runtime)
{
	this.runtime = runtime;
	var self = this;
	if (!this.runtime.isDomFree)
	{
		jQuery(document).mousemove(
			function(info) {
				self.onMouseMove(info);
			}
		);
		jQuery(document).mousedown(
			function(info) {
				self.onMouseDown(info);
			}
		);
		jQuery(document).mouseup(
			function(info) {
				self.onMouseUp(info);
			}
		);
	}
	var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
	if (this.runtime.isDirectCanvas)
		elem = window["Canvas"];
	else if (this.runtime.isCocoonJs)
		elem = window;
	if (window.navigator["pointerEnabled"])
	{
		elem.addEventListener("pointerdown",
			function(info) {
				self.onPointerStart(info);
			},
			false
		);
		elem.addEventListener("pointermove",
			function(info) {
				self.onPointerMove(info);
			},
			false
		);
		elem.addEventListener("pointerup",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
		elem.addEventListener("pointercancel",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
	}
	else if (window.navigator["msPointerEnabled"])
	{
		elem.addEventListener("MSPointerDown",
			function(info) {
				self.onPointerStart(info);
			},
			false
		);
		elem.addEventListener("MSPointerMove",
			function(info) {
				self.onPointerMove(info);
			},
			false
		);
		elem.addEventListener("MSPointerUp",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
		elem.addEventListener("MSPointerCancel",
			function(info) {
				self.onPointerEnd(info);
			},
			false
		);
	}
	else
	{
		elem.addEventListener("touchstart",
			function(info) {
				self.onTouchStart(info);
			},
			false
		);
		elem.addEventListener("touchmove",
			function(info) {
				self.onTouchMove(info);
			},
			false
		);
		elem.addEventListener("touchend",
			function(info) {
				self.onTouchEnd(info);
			},
			false
		);
		elem.addEventListener("touchcancel",
			function(info) {
				self.onTouchEnd(info);
			},
			false
		);
	}
};
(function ()
{
	var behaviorProto = cr.behaviors.DragnDrop.prototype;
	var dummyoffset = {left: 0, top: 0};
	function GetDragDropBehavior(inst)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i] instanceof behaviorProto.Instance)
				return inst.behavior_insts[i];
		}
		return null;
	};
	behaviorProto.onMouseDown = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
		this.onInputDown("leftmouse", info.pageX, info.pageY);
	};
	behaviorProto.onMouseMove = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
		this.onInputMove("leftmouse", info.pageX, info.pageY);
	};
	behaviorProto.onMouseUp = function (info)
	{
		if (info.which !== 1)
			return;		// not left mouse button
		this.onInputUp("leftmouse");
	};
	behaviorProto.onTouchStart = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			id = t.identifier;
			this.onInputDown(id ? id.toString() : "<none>", t.pageX, t.pageY);
		}
	};
	behaviorProto.onTouchMove = function (info)
	{
		if (info.preventDefault)
			info.preventDefault();
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			id = t.identifier;
			this.onInputMove(id ? id.toString() : "<none>", t.pageX, t.pageY);
		}
	};
	behaviorProto.onTouchEnd = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var i, len, t, id;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			id = t.identifier;
			this.onInputUp(id ? id.toString() : "<none>");
		}
	};
	behaviorProto.onPointerStart = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		this.onInputDown(info["pointerId"].toString(), info.pageX, info.pageY);
	};
	behaviorProto.onPointerMove = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault)
			info.preventDefault();
		this.onInputMove(info["pointerId"].toString(), info.pageX, info.pageY);
	};
	behaviorProto.onPointerEnd = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		this.onInputUp(info["pointerId"].toString());
	};
	behaviorProto.onInputDown = function (src, pageX, pageY)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var x = pageX - offset.left;
		var y = pageY - offset.top;
		var lx, ly, topx, topy;
		var arr = this.my_instances.valuesRef();
		var i, len, b, inst, topmost = null;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			if (!b.enabled || b.dragging)
				continue;		// don't consider disabled or already-dragging instances
			lx = inst.layer.canvasToLayer(x, y, true);
			ly = inst.layer.canvasToLayer(x, y, false);
			inst.update_bbox();
			if (!inst.contains_pt(lx, ly))
				continue;		// don't consider instances not over this point
			if (!topmost)
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
			if (inst.layer.index > topmost.layer.index)
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
			if (inst.layer.index === topmost.layer.index && inst.get_zindex() > topmost.get_zindex())
			{
				topmost = inst;
				topx = lx;
				topy = ly;
				continue;
			}
		}
		if (topmost)
			GetDragDropBehavior(topmost).onDown(src, topx, topy);
	};
	behaviorProto.onInputMove = function (src, pageX, pageY)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var x = pageX - offset.left;
		var y = pageY - offset.top;
		var lx, ly;
		var arr = this.my_instances.valuesRef();
		var i, len, b, inst;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			if (!b.enabled || !b.dragging || (b.dragging && b.dragsource !== src))
				continue;		// don't consider disabled, not-dragging, or dragging by other sources
			lx = inst.layer.canvasToLayer(x, y, true);
			ly = inst.layer.canvasToLayer(x, y, false);
			b.onMove(lx, ly);
		}
	};
	behaviorProto.onInputUp = function (src)
	{
		var arr = this.my_instances.valuesRef();
		var i, len, b, inst;
		for (i = 0, len = arr.length; i < len; i++)
		{
			inst = arr[i];
			b = GetDragDropBehavior(inst);
			if (b.dragging && b.dragsource === src)
				b.onUp();
		}
	};
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.dragging = false;
		this.dx = 0;
		this.dy = 0;
		this.dragsource = "<none>";
		this.axes = this.properties[0];
		this.enabled = (this.properties[1] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return { "enabled": this.enabled };
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.enabled = o["enabled"];
		this.dragging = false;
	};
	behinstProto.onDown = function(src, x, y)
	{
		this.dx = x - this.inst.x;
		this.dy = y - this.inst.y;
		this.dragging = true;
		this.dragsource = src;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.behaviors.DragnDrop.prototype.cnds.OnDragStart, this.inst);
		this.runtime.isInUserInputEvent = false;
	};
	behinstProto.onMove = function(x, y)
	{
		var newx = x - this.dx;
		var newy = y - this.dy;
		if (this.axes === 0)		// both
		{
			if (this.inst.x !== newx || this.inst.y !== newy)
			{
				this.inst.x = newx;
				this.inst.y = newy;
				this.inst.set_bbox_changed();
			}
		}
		else if (this.axes === 1)	// horizontal
		{
			if (this.inst.x !== newx)
			{
				this.inst.x = newx;
				this.inst.set_bbox_changed();
			}
		}
		else if (this.axes === 2)	// vertical
		{
			if (this.inst.y !== newy)
			{
				this.inst.y = newy;
				this.inst.set_bbox_changed();
			}
		}
	};
	behinstProto.onUp = function()
	{
		this.dragging = false;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.behaviors.DragnDrop.prototype.cnds.OnDrop, this.inst);
		this.runtime.isInUserInputEvent = false;
	};
	behinstProto.tick = function ()
	{
	};
	function Cnds() {};
	Cnds.prototype.IsDragging = function ()
	{
		return this.dragging;
	};
	Cnds.prototype.OnDragStart = function ()
	{
		return true;
	};
	Cnds.prototype.OnDrop = function ()
	{
		return true;
	};
	Cnds.prototype.IsEnabled = function ()
	{
		return !!this.enabled;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (s)
	{
		this.enabled = (s !== 0);
		if (!this.enabled)
			this.dragging = false;
	};
	Acts.prototype.Drop = function ()
	{
		if (this.dragging)
			this.onUp();
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.EightDir = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.EightDir.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
		this.ignoreInput = false;
		this.simup = false;
		this.simdown = false;
		this.simleft = false;
		this.simright = false;
		this.lastuptick = -1;
		this.lastdowntick = -1;
		this.lastlefttick = -1;
		this.lastrighttick = -1;
		this.dx = 0;
		this.dy = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.maxspeed = this.properties[0];
		this.acc = this.properties[1];
		this.dec = this.properties[2];
		this.directions = this.properties[3];	// 0=Up & down, 1=Left & right, 2=4 directions, 3=8 directions"
		this.angleMode = this.properties[4];	// 0=No,1=90-degree intervals, 2=45-degree intervals, 3=360 degree (smooth)
		this.defaultControls = (this.properties[5] === 1);	// 0=no, 1=yes
		this.enabled = (this.properties[6] !== 0);
		if (this.defaultControls && !this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				(function (self) {
					return function(info) {
						self.onKeyDown(info);
					};
				})(this)
			);
			jQuery(document).keyup(
				(function (self) {
					return function(info) {
						self.onKeyUp(info);
					};
				})(this)
			);
		}
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"dx": this.dx,
			"dy": this.dy,
			"enabled": this.enabled,
			"maxspeed": this.maxspeed,
			"acc": this.acc,
			"dec": this.dec,
			"ignoreInput": this.ignoreInput
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.enabled = o["enabled"];
		this.maxspeed = o["maxspeed"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.ignoreInput = o["ignoreInput"];
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
		this.simup = false;
		this.simdown = false;
		this.simleft = false;
		this.simright = false;
		this.lastuptick = -1;
		this.lastdowntick = -1;
		this.lastlefttick = -1;
		this.lastrighttick = -1;
	};
	behinstProto.onKeyDown = function (info)
	{
		var tickcount = this.runtime.tickcount;
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			if (this.lastlefttick < tickcount)
				this.leftkey = true;
			break;
		case 38:	// up
			info.preventDefault();
			if (this.lastuptick < tickcount)
				this.upkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			if (this.lastrighttick < tickcount)
				this.rightkey = true;
			break;
		case 40:	// down
			info.preventDefault();
			if (this.lastdowntick < tickcount)
				this.downkey = true;
			break;
		}
	};
	behinstProto.onKeyUp = function (info)
	{
		var tickcount = this.runtime.tickcount;
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			this.lastlefttick = tickcount;
			break;
		case 38:	// up
			info.preventDefault();
			this.upkey = false;
			this.lastuptick = tickcount;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			this.lastrighttick = tickcount;
			break;
		case 40:	// down
			info.preventDefault();
			this.downkey = false;
			this.lastdowntick = tickcount;
			break;
		}
	};
	behinstProto.onWindowBlur = function ()
	{
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var up = this.upkey || this.simup;
		var down = this.downkey || this.simdown;
		this.simleft = false;
		this.simright = false;
		this.simup = false;
		this.simdown = false;
		if (!this.enabled)
			return;
		var collobj = this.runtime.testOverlapSolid(this.inst);
		if (collobj)
		{
			this.runtime.registerCollision(this.inst, collobj);
			if (!this.runtime.pushOutSolidNearest(this.inst))
				return;		// must be stuck in solid
		}
		if (this.ignoreInput)
		{
			left = false;
			right = false;
			up = false;
			down = false;
		}
		if (this.directions === 0)
		{
			left = false;
			right = false;
		}
		else if (this.directions === 1)
		{
			up = false;
			down = false;
		}
		if (this.directions === 2 && (up || down))
		{
			left = false;
			right = false;
		}
		if (left == right)	// both up or both down
		{
			if (this.dx < 0)
			{
				this.dx += this.dec * dt;
				if (this.dx > 0)
					this.dx = 0;
			}
			else if (this.dx > 0)
			{
				this.dx -= this.dec * dt;
				if (this.dx < 0)
					this.dx = 0;
			}
		}
		if (up == down)
		{
			if (this.dy < 0)
			{
				this.dy += this.dec * dt;
				if (this.dy > 0)
					this.dy = 0;
			}
			else if (this.dy > 0)
			{
				this.dy -= this.dec * dt;
				if (this.dy < 0)
					this.dy = 0;
			}
		}
		if (left && !right)
		{
			if (this.dx > 0)
				this.dx -= (this.acc + this.dec) * dt;
			else
				this.dx -= this.acc * dt;
		}
		if (right && !left)
		{
			if (this.dx < 0)
				this.dx += (this.acc + this.dec) * dt;
			else
				this.dx += this.acc * dt;
		}
		if (up && !down)
		{
			if (this.dy > 0)
				this.dy -= (this.acc + this.dec) * dt;
			else
				this.dy -= this.acc * dt;
		}
		if (down && !up)
		{
			if (this.dy < 0)
				this.dy += (this.acc + this.dec) * dt;
			else
				this.dy += this.acc * dt;
		}
		var ax, ay;
		if (this.dx !== 0 || this.dy !== 0)
		{
			var speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
			if (speed > this.maxspeed)
			{
				var a = Math.atan2(this.dy, this.dx);
				this.dx = this.maxspeed * Math.cos(a);
				this.dy = this.maxspeed * Math.sin(a);
			}
			var oldx = this.inst.x;
			var oldy = this.inst.y;
			var oldangle = this.inst.angle;
			this.inst.x += this.dx * dt;
			this.inst.set_bbox_changed();
			collobj = this.runtime.testOverlapSolid(this.inst);
			if (collobj)
			{
				this.inst.x = oldx;
				this.dx = 0;
				this.inst.set_bbox_changed();
				this.runtime.registerCollision(this.inst, collobj);
			}
			this.inst.y += this.dy * dt;
			this.inst.set_bbox_changed();
			collobj = this.runtime.testOverlapSolid(this.inst);
			if (collobj)
			{
				this.inst.y = oldy;
				this.dy = 0;
				this.inst.set_bbox_changed();
				this.runtime.registerCollision(this.inst, collobj);
			}
			ax = cr.round6dp(this.dx);
			ay = cr.round6dp(this.dy);
			if (ax !== 0 || ay !== 0)
			{
				if (this.angleMode === 1)	// 90 degree intervals
					this.inst.angle = cr.to_clamped_radians(Math.round(cr.to_degrees(Math.atan2(ay, ax)) / 90.0) * 90.0);
				else if (this.angleMode === 2)	// 45 degree intervals
					this.inst.angle = cr.to_clamped_radians(Math.round(cr.to_degrees(Math.atan2(ay, ax)) / 45.0) * 45.0);
				else if (this.angleMode === 3)	// 360 degree
					this.inst.angle = Math.atan2(ay, ax);
			}
			this.inst.set_bbox_changed();
			if (this.inst.angle != oldangle)
			{
				collobj = this.runtime.testOverlapSolid(this.inst);
				if (collobj)
				{
					this.inst.angle = oldangle;
					this.inst.set_bbox_changed();
					this.runtime.registerCollision(this.inst, collobj);
				}
			}
		}
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx !== 0 || this.dy !== 0;
	};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		var speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		return cr.do_cmp(speed, cmp, s);
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Stop = function ()
	{
		this.dx = 0;
		this.dy = 0;
	};
	Acts.prototype.Reverse = function ()
	{
		this.dx *= -1;
		this.dy *= -1;
	};
	Acts.prototype.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	Acts.prototype.SetSpeed = function (speed)
	{
		if (speed < 0)
			speed = 0;
		if (speed > this.maxspeed)
			speed = this.maxspeed;
		var a = Math.atan2(this.dy, this.dx);
		this.dx = speed * Math.cos(a);
		this.dy = speed * Math.sin(a);
	};
	Acts.prototype.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		if (this.maxspeed < 0)
			this.maxspeed = 0;
	};
	Acts.prototype.SetAcceleration = function (acc)
	{
		this.acc = acc;
		if (this.acc < 0)
			this.acc = 0;
	};
	Acts.prototype.SetDeceleration = function (dec)
	{
		this.dec = dec;
		if (this.dec < 0)
			this.dec = 0;
	};
	Acts.prototype.SimulateControl = function (ctrl)
	{
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simup = true;		break;
		case 3:		this.simdown = true;	break;
		}
	};
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	Acts.prototype.SetVectorX = function (x_)
	{
		this.dx = x_;
	};
	Acts.prototype.SetVectorY = function (y_)
	{
		this.dy = y_;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(Math.sqrt(this.dx * this.dx + this.dy * this.dy));
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxspeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(Math.atan2(this.dy, this.dx)));
	};
	Exps.prototype.VectorX = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.VectorY = function (ret)
	{
		ret.set_float(this.dy);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Fade = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Fade.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.activeAtStart = this.properties[0] === 1;
		this.setMaxOpacity = false;					// used to retrieve maxOpacity once in first 'Start fade' action if initially inactive
		this.fadeInTime = this.properties[1];
		this.waitTime = this.properties[2];
		this.fadeOutTime = this.properties[3];
		this.destroy = this.properties[4];			// 0 = no, 1 = after fade out
		this.stage = this.activeAtStart ? 0 : 3;		// 0 = fade in, 1 = wait, 2 = fade out, 3 = done
		if (this.recycled)
			this.stageTime.reset();
		else
			this.stageTime = new cr.KahanAdder();
		this.maxOpacity = (this.inst.opacity ? this.inst.opacity : 1.0);
		if (this.activeAtStart)
		{
			if (this.fadeInTime === 0)
			{
				this.stage = 1;
				if (this.waitTime === 0)
					this.stage = 2;
			}
			else
			{
				this.inst.opacity = 0;
				this.runtime.redraw = true;
			}
		}
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"fit": this.fadeInTime,
			"wt": this.waitTime,
			"fot": this.fadeOutTime,
			"s": this.stage,
			"st": this.stageTime.sum,
			"mo": this.maxOpacity,
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.fadeInTime = o["fit"];
		this.waitTime = o["wt"];
		this.fadeOutTime = o["fot"];
		this.stage = o["s"];
		this.stageTime.reset();
		this.stageTime.sum = o["st"];
		this.maxOpacity = o["mo"];
	};
	behinstProto.tick = function ()
	{
		this.stageTime.add(this.runtime.getDt(this.inst));
		if (this.stage === 0)
		{
			this.inst.opacity = (this.stageTime.sum / this.fadeInTime) * this.maxOpacity;
			this.runtime.redraw = true;
			if (this.inst.opacity >= this.maxOpacity)
			{
				this.inst.opacity = this.maxOpacity;
				this.stage = 1;	// wait stage
				this.stageTime.reset();
				this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnFadeInEnd, this.inst);
			}
		}
		if (this.stage === 1)
		{
			if (this.stageTime.sum >= this.waitTime)
			{
				this.stage = 2;	// fade out stage
				this.stageTime.reset();
				this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnWaitEnd, this.inst);
			}
		}
		if (this.stage === 2)
		{
			if (this.fadeOutTime !== 0)
			{
				this.inst.opacity = this.maxOpacity - ((this.stageTime.sum / this.fadeOutTime) * this.maxOpacity);
				this.runtime.redraw = true;
				if (this.inst.opacity < 0)
				{
					this.inst.opacity = 0;
					this.stage = 3;	// done
					this.stageTime.reset();
					this.runtime.trigger(cr.behaviors.Fade.prototype.cnds.OnFadeOutEnd, this.inst);
					if (this.destroy === 1)
						this.runtime.DestroyInstance(this.inst);
				}
			}
		}
	};
	behinstProto.doStart = function ()
	{
		this.stage = 0;
		this.stageTime.reset();
		if (this.fadeInTime === 0)
		{
			this.stage = 1;
			if (this.waitTime === 0)
				this.stage = 2;
		}
		else
		{
			this.inst.opacity = 0;
			this.runtime.redraw = true;
		}
	};
	function Cnds() {};
	Cnds.prototype.OnFadeOutEnd = function ()
	{
		return true;
	};
	Cnds.prototype.OnFadeInEnd = function ()
	{
		return true;
	};
	Cnds.prototype.OnWaitEnd = function ()
	{
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.StartFade = function ()
	{
		if (!this.activeAtStart && !this.setMaxOpacity)
		{
			this.maxOpacity = (this.inst.opacity ? this.inst.opacity : 1.0);
			this.setMaxOpacity = true;
		}
		if (this.stage === 3)
			this.doStart();
	};
	Acts.prototype.RestartFade = function ()
	{
		this.doStart();
	};
	Acts.prototype.SetFadeInTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.fadeInTime = t;
	};
	Acts.prototype.SetWaitTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.waitTime = t;
	};
	Acts.prototype.SetFadeOutTime = function (t)
	{
		if (t < 0)
			t = 0;
		this.fadeOutTime = t;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.FadeInTime = function (ret)
	{
		ret.set_float(this.fadeInTime);
	};
	Exps.prototype.WaitTime = function (ret)
	{
		ret.set_float(this.waitTime);
	};
	Exps.prototype.FadeOutTime = function (ret)
	{
		ret.set_float(this.fadeOutTime);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Flash = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Flash.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.ontime = 0;
		this.offtime = 0;
		this.stage = 0;			// 0 = on, 1 = off
		this.stagetimeleft = 0;
		this.timeleft = 0;
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"ontime": this.ontime,
			"offtime": this.offtime,
			"stage": this.stage,
			"stagetimeleft": this.stagetimeleft,
			"timeleft": this.timeleft
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.ontime = o["ontime"];
		this.offtime = o["offtime"];
		this.stage = o["stage"];
		this.stagetimeleft = o["stagetimeleft"];
		this.timeleft = o["timeleft"];
	};
	behinstProto.tick = function ()
	{
		if (this.timeleft <= 0)
			return;		// not flashing
		var dt = this.runtime.getDt(this.inst);
		this.timeleft -= dt;
		if (this.timeleft <= 0)
		{
			this.timeleft = 0;
			this.inst.visible = true;
			this.runtime.redraw = true;
			this.runtime.trigger(cr.behaviors.Flash.prototype.cnds.OnFlashEnded, this.inst);
			return;
		}
		this.stagetimeleft -= dt;
		if (this.stagetimeleft <= 0)
		{
			if (this.stage === 0)
			{
				this.inst.visible = false;
				this.stage = 1;
				this.stagetimeleft += this.offtime;
			}
			else
			{
				this.inst.visible = true;
				this.stage = 0;
				this.stagetimeleft += this.ontime;
			}
			this.runtime.redraw = true;
		}
	};
	function Cnds() {};
	Cnds.prototype.IsFlashing = function ()
	{
		return this.timeleft > 0;
	};
	Cnds.prototype.OnFlashEnded = function ()
	{
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Flash = function (on_, off_, dur_)
	{
		this.ontime = on_;
		this.offtime = off_;
		this.stage = 1;		// always start off
		this.stagetimeleft = off_;
		this.timeleft = dur_;
		this.inst.visible = false;
		this.runtime.redraw = true;
	};
	Acts.prototype.StopFlashing = function ()
	{
		this.timeleft = 0;
		this.inst.visible = true;
		this.runtime.redraw = true;
		return;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Pathfinding = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var cellData = {};
	var behaviorProto = cr.behaviors.Pathfinding.prototype;
	behaviorProto.onBeforeLayoutChange = function ()
	{
		var p, d;
		for (p in cellData)
		{
			if (cellData.hasOwnProperty(p))
			{
				d = cellData[p];
				d.pathfinder["unsetReady"]();
				d.regenerate = true;
			}
		}
	};
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
		this.obstacleTypes = [];		// object types to treat as obstacles in custom mode
		this.costTypes = [];			// object types with cost: { obj: type, cost: n }
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.cellSize = this.properties[0];
		if (this.cellSize < 3)
			this.cellSize = 3;
		this.cellBorder = this.properties[1];
		this.obstacles = this.properties[2];		// 0 = solids, 1 = custom
		this.maxSpeed = this.properties[3];
		this.acc = this.properties[4];
		this.dec = this.properties[5];
		this.av = cr.to_radians(this.properties[6]);
		this.rotateEnabled = (this.properties[7] !== 0);
		this.diagonalsEnabled = (this.properties[8] !== 0);
		this.enabled = (this.properties[9] !== 0);
		this.isMoving = false;
		this.movingFromStopped = false;
		this.firstTickMovingWhileMoving = false;
		this.hasPath = false;
		this.moveNode = 0;
		this.a = this.inst.angle;
		this.lastKnownAngle = this.inst.angle;
		this.s = 0;
		this.rabbitX = 0;
		this.rabbitY = 0;
		this.rabbitA = 0;
		this.myHcells = Math.ceil(this.runtime.running_layout.width / this.cellSize);
		this.myVcells = Math.ceil(this.runtime.running_layout.height / this.cellSize);
		this.myPath = [];				// copy of path returned from pathfinder
		this.delayFindPath = false;
		this.delayPathX = 0;
		this.delayPathY = 0;
		this.is_destroyed = false;
		this.isCalculating = false;
		this.calcPathX = 0;
		this.calcPathY = 0;
		this.firstRun = true;
		var self = this;
		if (!this.recycled)
		{
			this.pathSuccessFn = function ()
			{
				if (self.is_destroyed)
					return;
				self.isCalculating = false;
				self.copyResultPath();
				self.hasPath = (self.myPath.length > 0);
				self.moveNode = 0;
				self.runtime.trigger(cr.behaviors.Pathfinding.prototype.cnds.OnPathFound, self.inst);
				self.doDelayFindPath();		// run next pathfind if queued
			};
			this.pathFailFn = function ()
			{
				if (self.is_destroyed)
					return;
				self.isCalculating = false;
				self.clearResultPath();
				self.hasPath = false;
				self.isMoving = false;
				self.moveNode = 0;
				self.runtime.trigger(cr.behaviors.Pathfinding.prototype.cnds.OnFailedToFindPath, self.inst);
				self.doDelayFindPath();		// run next pathfind if queued
			};
		}
	};
	behinstProto.onDestroy = function ()
	{
		this.is_destroyed = true;		// start ignoring callbacks
		this.delayFindPath = false;
	};
	behinstProto.saveToJSON = function ()
	{
		var o = {
			"cs": this.cellSize,
			"cb": this.cellBorder,
			"ms": this.maxSpeed,
			"acc": this.acc,
			"dec": this.dec,
			"av": this.av,
			"re": this.rotateEnabled,
			"de": this.diagonalsEnabled,
			"im": this.isMoving,
			"mfs": this.movingFromStopped,
			"ftmwm": this.firstTickMovingWhileMoving,
			"hp": this.hasPath,
			"mn": this.moveNode,
			"a": this.a,
			"lka": this.lastKnownAngle,
			"s": this.s,
			"rx": this.rabbitX,
			"ry": this.rabbitY,
			"ra": this.rabbitA,
			"myhc": this.myHcells,
			"myvc": this.myVcells,
			"path": this.myPath,
			"en": this.enabled,
			"fr": this.firstRun,
			"obs": [],
			"costs": []
		};
		if (this.isCalculating)
		{
			o["dfp"] = true;
			o["dpx"] = this.calcPathX;
			o["dpy"] = this.calcPathY;
		}
		else
		{
			o["dfp"] = this.delayFindPath;
			o["dpx"] = this.delayPathX;
			o["dpy"] = this.delayPathY;
		}
		var i, len;
		for (i = 0, len = this.type.obstacleTypes.length; i < len; i++)
		{
			o["obs"].push(this.type.obstacleTypes[i].sid);
		}
		for (i = 0, len = this.type.costTypes.length; i < len; i++)
		{
			o["costs"].push({ "sid": this.type.costTypes[i].obj.sid, "cost": this.type.costTypes[i].cost });
		}
		return o;
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.cellSize = o["cs"];
		this.cellBorder = o["cb"];
		this.maxSpeed = o["ms"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.av = o["av"];
		this.rotateEnabled = o["re"];
		this.diagonalsEnabled = o["de"];
		this.isMoving = o["im"];
		this.movingFromStopped = o["mfs"];
		this.firstTickMovingWhileMoving = o["ftmwm"];
		this.hasPath = o["hp"];
		this.moveNode = o["mn"];
		this.a = o["a"];
		this.lastKnownAngle = o["lka"];
		this.s = o["s"];
		this.rabbitX = o["rx"];
		this.rabbitY = o["ry"];
		this.rabbitA = o["ra"];
		this.myHcells = o["myhc"];
		this.myVcells = o["myvc"];
		this.myPath = o["path"];
		this.enabled = o["en"];
		this.firstRun = o["fr"];
		this.delayFindPath = o["dfp"];
		this.delayPathX = o["dpx"];
		this.delayPathY = o["dpy"];
		cr.clearArray(this.type.obstacleTypes);
		var obsarr = o["obs"];
		var i, len, t;
		for (i = 0, len = obsarr.length; i < len; i++)
		{
			t = this.runtime.getObjectTypeBySid(obsarr[i]);
			if (t)
				this.type.obstacleTypes.push(t);
		}
		cr.clearArray(this.type.costTypes);
		var costarr = o["costs"];
		for (i = 0, len = costarr.length; i < len; i++)
		{
			t = this.runtime.getObjectTypeBySid(costarr[i]["sid"]);
			if (t)
				this.type.costTypes.push({ obj: t, cost: costarr[i]["cost"] });
		}
		this.getMyInfo().pathfinder["setDiagonals"](this.diagonalsEnabled);
	};
	behinstProto.afterLoad = function ()
	{
		this.getMyInfo().regenerate = true;
	};
	behinstProto.tick = function ()
	{
		if (!this.enabled || !this.isMoving)
			return;
		if (this.rotateEnabled && this.inst.angle !== this.lastKnownAngle)
			this.a = this.inst.angle;
		var dt = this.runtime.getDt(this.inst);
		var targetAngle, da, dist, nextX, nextY, t, r, curveDist, curMaxSpeed;
		var inst = this.inst;
		var rabbitAheadDist = Math.min(this.maxSpeed * 0.4, Math.abs(this.inst.width) * 2);
		var rabbitSpeed = Math.max(this.s * 1.5, 30);
		if (this.moveNode < this.myPath.length)
		{
			nextX = this.myPath[this.moveNode].x;
			nextY = this.myPath[this.moveNode].y;
			dist = cr.distanceTo(this.rabbitX, this.rabbitY, nextX, nextY);
			if (dist < 3 * rabbitSpeed * dt) // within 3 ticks of movement at the max speed
			{
				this.moveNode++;
				this.rabbitX = nextX;
				this.rabbitY = nextY;
				if (this.moveNode < this.myPath.length)
				{
					nextX = this.myPath[this.moveNode].x;
					nextY = this.myPath[this.moveNode].y;
				}
			}
		}
		else
		{
			nextX = this.myPath[this.myPath.length - 1].x;
			nextY = this.myPath[this.myPath.length - 1].y;
		}
		this.rabbitA = cr.angleTo(this.rabbitX, this.rabbitY, nextX, nextY);
		var distToRabbit = cr.distanceTo(inst.x, inst.y, this.rabbitX, this.rabbitY);
		if (distToRabbit < rabbitAheadDist && this.moveNode < this.myPath.length)
		{
			var moveDist;
			if (this.firstTickMovingWhileMoving)
			{
				moveDist = rabbitAheadDist;
				this.firstTickMovingWhileMoving = false;
			}
			else
				moveDist = rabbitSpeed * dt;
			this.rabbitX += Math.cos(this.rabbitA) * moveDist;
			this.rabbitY += Math.sin(this.rabbitA) * moveDist;
		}
		targetAngle = cr.angleTo(inst.x, inst.y, this.rabbitX, this.rabbitY);
		da = cr.angleDiff(this.a, targetAngle);
		var distToFinish = cr.distanceTo(inst.x, inst.y, this.myPath[this.myPath.length - 1].x, this.myPath[this.myPath.length - 1].y);
		var decelDist = (this.maxSpeed * this.maxSpeed) / (2 * this.dec);
		if (distToRabbit > 1)
		{
			this.a = cr.angleRotate(this.a, targetAngle, this.av * dt);
			if (cr.to_degrees(da) <= 0.5)
			{
				curMaxSpeed = this.maxSpeed;
			}
			else if (cr.to_degrees(da) >= 120 || (this.movingFromStopped && this.moveNode === 0))
			{
				curMaxSpeed = 0;
				this.movingFromStopped = true;	// we're way off, so make sure it rotates all the way round
			}
			else
			{
				t = da / this.av;
				dist = cr.distanceTo(inst.x, inst.y, this.rabbitX, this.rabbitY);
				r = dist / (2 * Math.sin(da));
				curveDist = r * da;
				curMaxSpeed = curveDist / t;
				if (curMaxSpeed < 0)
					curMaxSpeed = 0;
				if (curMaxSpeed > this.maxSpeed)
					curMaxSpeed = this.maxSpeed;
			}
			if (distToFinish < decelDist)
				curMaxSpeed = Math.min(curMaxSpeed, (distToFinish / decelDist) * this.maxSpeed + (this.maxSpeed / 40));
			this.s += this.acc * dt;
			if (this.s > curMaxSpeed)
				this.s = curMaxSpeed;
		}
		/*
		targetAngle = cr.angleTo(inst.x, inst.y, nextX, nextY);
		da = cr.angleDiff(this.a, targetAngle);
		if (this.moveNode === 0)
		{
			this.nextMaxSpeed = this.maxSpeed;
			if (cr.to_degrees(da) <= 0.5)
			{
				this.s += this.acc * dt;
				if (this.s > this.maxSpeed)
					this.s = this.maxSpeed;
			}
			else
			{
				this.a = cr.angleRotate(this.a, targetAngle, this.av * dt);
				this.s = 0;
			}
		}
		else
		{
			if (cr.to_degrees(da) <= 0.5)
				this.nextMaxSpeed = this.maxSpeed;
			this.s += this.acc * dt;
			if (this.s > Math.min(this.maxSpeed, this.nextMaxSpeed))
				this.s = Math.min(this.maxSpeed, this.nextMaxSpeed);
			this.a = cr.angleRotate(this.a, targetAngle, this.av * dt);
			if (cr.to_degrees(da) > 50)
				this.s = 0;
		}
		*/
		inst.x += Math.cos(this.a) * this.s * dt;
		inst.y += Math.sin(this.a) * this.s * dt;
		if (this.rotateEnabled)
		{
			inst.angle = this.a;
			this.lastKnownAngle = this.a;
		}
		inst.set_bbox_changed();
		if (this.moveNode === this.myPath.length && cr.distanceTo(inst.x, inst.y, nextX, nextY) < Math.max(3 * this.s * dt, 10))
		{
			this.isMoving = false;
			this.hasPath = false;
			this.moveNode = 0;
			this.s = 0;
			this.runtime.trigger(cr.behaviors.Pathfinding.prototype.cnds.OnArrived, inst);
			return;
		}
	};
	behinstProto.tick2 = function ()
	{
		if (!this.enabled)
			return;
		this.generateMap();			// not actually done every tick, just checks for regenerate flag
		this.doDelayFindPath();
	};
	behinstProto.doDelayFindPath = function()
	{
		if (this.delayFindPath && !this.is_destroyed)
		{
			this.delayFindPath = false;
			this.doFindPath(this.inst.x, this.inst.y, this.delayPathX, this.delayPathY);
		}
	};
	behinstProto.getMyInfo = function ()
	{
		var cellkey = "" + this.cellSize + "," + this.cellBorder;
		if (!cellData.hasOwnProperty(cellkey))
		{
			cellData[cellkey] = {
				pathfinder: new window["Pathfinder"](),
				cells: null,
				regenerate: false,
				regenerateRegions: []
			};
		}
		return cellData[cellkey];
	};
	behinstProto.generateMap = function ()
	{
		var myinfo = this.getMyInfo();
		if (myinfo.pathfinder["isReady"]() && !myinfo.regenerate && !myinfo.regenerateRegions.length)
			return;		// already got a map and not marked to regenerate
		var arr, x, y, lenx, leny, i, len, r, cx1, cy1, cx2, cy2, q;
		if (!myinfo.pathfinder["isReady"]() || myinfo.regenerate)
		{
			this.myHcells = Math.ceil(this.runtime.running_layout.width / this.cellSize);
			this.myVcells = Math.ceil(this.runtime.running_layout.height / this.cellSize);
			arr = [];
			arr.length = this.myHcells;
			lenx = this.myHcells;
			leny = this.myVcells;
			for (x = 0; x < lenx; ++x)
			{
				arr[x] = [];
				arr[x].length = leny;
				for (y = 0; y < leny; ++y)
					arr[x][y] = this.queryCellCollision(x, y);
			}
			myinfo.cells = arr;
			myinfo.pathfinder["init"](this.myHcells, this.myVcells, arr, this.diagonalsEnabled);
			myinfo.regenerate = false;
			cr.clearArray(myinfo.regenerateRegions);
		}
		else if (myinfo.regenerateRegions.length)
		{
			for (i = 0, len = myinfo.regenerateRegions.length; i < len; ++i)
			{
				r = myinfo.regenerateRegions[i];
				cx1 = r[0];
				cy1 = r[1];
				cx2 = r[2];
				cy2 = r[3];
				arr = [];
				lenx = cx2 - cx1;
				leny = cy2 - cy1;
				arr.length = lenx;
				for (x = 0; x < lenx; ++x)
				{
					arr[x] = [];
					arr[x].length = leny;
					for (y = 0; y < leny; ++y)
					{
						q = this.queryCellCollision(cx1 + x, cy1 + y);
						arr[x][y] = q;
						myinfo.cells[cx1 + x][cy1 + y] = q;
					}
				}
				myinfo.pathfinder["updateRegion"](cx1, cy1, lenx, leny, arr);
			}
			cr.clearArray(myinfo.regenerateRegions);
		}
	};
	behinstProto.clearResultPath = function ()
	{
		var i, len;
		for (i = 0, len = this.myPath.length; i < len; i++)
			window["freeResultNode"](this.myPath[i]);
		cr.clearArray(this.myPath);
	};
	behinstProto.copyResultPath = function ()
	{
		var pathfinder = this.getMyInfo().pathfinder;
		var pathList = pathfinder["pathList"];
		this.clearResultPath();
		var i, len, n, m;
		for (i = 0, len = pathList.length; i < len; i++)
		{
			n = pathList[i];
			m = window["allocResultNode"]();
			m.x = (n.x + 0.5) * this.cellSize;
			m.y = (n.y + 0.5) * this.cellSize;
			this.myPath.push(m);
		}
	};
	var candidates = [];
	var tmpRect = new cr.rect();
	behinstProto.queryCellCollision = function (x_, y_)
	{
		var i, len, t, j, lenj, cost, ret = 0;
		tmpRect.left = x_ * this.cellSize - this.cellBorder;
		tmpRect.top = y_ * this.cellSize - this.cellBorder;
		tmpRect.right = (x_ + 1) * this.cellSize + this.cellBorder;
		tmpRect.bottom = (y_ + 1) * this.cellSize + this.cellBorder;
		if (this.obstacles === 0)	// solids
		{
			if (this.runtime.testRectOverlapSolid(tmpRect))
				return window["PF_OBSTACLE"];
		}
		else
		{
			this.runtime.getTypesCollisionCandidates(this.inst.layer, this.type.obstacleTypes, tmpRect, candidates);
			for (i = 0, len = candidates.length; i < len; ++i)
			{
				if (this.runtime.testRectOverlap(tmpRect, candidates[i]))
				{
					cr.clearArray(candidates);
					return window["PF_OBSTACLE"];
				}
			}
			candidates.length = 0;
		}
		for (i = 0, len = this.type.costTypes.length; i < len; i++)
		{
			t = this.type.costTypes[i].obj;
			cost = this.type.costTypes[i].cost;
			this.runtime.getCollisionCandidates(this.inst.layer, t, tmpRect, candidates);
			for (j = 0, lenj = candidates.length; j < lenj; ++j)
			{
				if (this.runtime.testRectOverlap(tmpRect, candidates[j]))
					ret += cost;
			}
			cr.clearArray(candidates);
		}
		return ret;
	};
	behinstProto.doFindPath = function (startX, startY, endX, endY)
	{
		var pathfinder = this.getMyInfo().pathfinder;
		if (!pathfinder["isReady"]())
			return false;		// not yet ready
		this.isCalculating = true;
		this.calcPathX = endX;
		this.calcPathY = endY;
		var cellX = Math.floor(startX / this.cellSize);
		var cellY = Math.floor(startY / this.cellSize);
		var destCellX = Math.floor(endX / this.cellSize);
		var destCellY = Math.floor(endY / this.cellSize);
		var bestDist, bestX, bestY, x, y, dx, dy, curDist;
		if (pathfinder["at"](destCellX, destCellY) === window["PF_OBSTACLE"])
		{
			bestDist = 1000000;
			bestX = 0;
			bestY = 0;
			for (x = 0; x < this.myHcells; x++)
			{
				for (y = 0; y < this.myVcells; y++)
				{
					if (pathfinder["at"](x, y) !== window["PF_OBSTACLE"])
					{
						dx = destCellX - x;
						dy = destCellY - y;
						curDist = dx*dx + dy*dy;
						if (curDist < bestDist)
						{
							bestDist = curDist;
							bestX = x;
							bestY = y;
						}
					}
				}
			}
			destCellX = bestX;
			destCellY = bestY;
		}
		var self = this;
		pathfinder["findPath"](cellX, cellY, destCellX, destCellY, this.pathSuccessFn, this.pathFailFn);
	};
	function Cnds() {};
	Cnds.prototype.OnPathFound = function ()
	{
		return true;
	};
	Cnds.prototype.OnFailedToFindPath = function ()
	{
		return true;
	};
	Cnds.prototype.IsCellObstacle = function (x_, y_)
	{
		return (this.getMyInfo().pathfinder["at"](x_, y_) === window["PF_OBSTACLE"]);
	};
	Cnds.prototype.IsCalculatingPath = function ()
	{
		return this.isCalculating;
	};
	Cnds.prototype.IsMoving = function ()
	{
		return this.isMoving;
	};
	Cnds.prototype.OnArrived = function ()
	{
		return true;
	};
	Cnds.prototype.CompareSpeed = function (cmp, x)
	{
		return cr.do_cmp(this.isMoving ? this.s : 0, cmp, x);
	};
	Cnds.prototype.DiagonalsEnabled = function (cmp, x)
	{
		return this.diagonalsEnabled;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.FindPath = function (x_, y_)
	{
		if (!this.enabled)
			return;
		if (this.isCalculating || !this.getMyInfo().pathfinder["isReady"]())
		{
			this.delayFindPath = true;
			this.delayPathX = x_;
			this.delayPathY = y_;
		}
		else
			this.doFindPath(this.inst.x, this.inst.y, x_, y_);
	};
	Acts.prototype.StartMoving = function ()
	{
		if (this.hasPath)
		{
			if (this.isMoving)
				this.firstTickMovingWhileMoving = true;
			this.movingFromStopped = !this.isMoving;
			this.isMoving = true;
			this.rabbitX = this.inst.x;
			this.rabbitY = this.inst.y;
			this.rabbitA = this.inst.angle;
		}
	};
	Acts.prototype.Stop = function ()
	{
		this.isMoving = false;
	};
	Acts.prototype.SetEnabled = function (e)
	{
		this.enabled = (e !== 0);
	};
	Acts.prototype.RegenerateMap = function ()
	{
		this.getMyInfo().regenerate = true;
	};
	Acts.prototype.AddObstacle = function (obj_)
	{
		var obstacleTypes = this.type.obstacleTypes;
		if (obstacleTypes.indexOf(obj_) !== -1)
			return;
		var i, len, t;
		for (i = 0, len = obstacleTypes.length; i < len; i++)
		{
			t = obstacleTypes[i];
			if (t.is_family && t.members.indexOf(obj_) !== -1)
				return;
		}
		obstacleTypes.push(obj_);
	};
	Acts.prototype.ClearObstacles = function ()
	{
		cr.clearArray(this.type.obstacleTypes);
	};
	Acts.prototype.AddCost = function (obj_, cost_)
	{
		var costTypes = this.type.costTypes;
		var i, len, t;
		for (i = 0, len = costTypes.length; i < len; i++)
		{
			t = costTypes[i].obj;
			if (t === obj_)
				return;			// already added this one
			if (t.is_family && t.members.indexOf(obj_) !== -1)
				return;			// already added via family
		}
		costTypes.push({ obj: obj_, cost: cost_ });
	};
	Acts.prototype.ClearCost = function ()
	{
		cr.clearArray(this.type.costTypes);
	};
	Acts.prototype.SetMaxSpeed = function (x_)
	{
		this.maxSpeed = x_;
	};
	Acts.prototype.SetSpeed = function (x_)
	{
		if (x_ < 0)
			x_ = 0;
		if (x_ > this.maxSpeed)
			x_ = this.maxSpeed;
		this.s = x_;
	};
	Acts.prototype.SetAcc = function (x_)
	{
		this.acc = x_;
	};
	Acts.prototype.SetDec = function (x_)
	{
		this.dec = x_;
	};
	Acts.prototype.SetRotateSpeed = function (x_)
	{
		this.av = cr.to_radians(x_);
	};
	Acts.prototype.SetDiagonalsEnabled = function (e)
	{
		this.diagonalsEnabled = (e !== 0);
		this.getMyInfo().pathfinder["setDiagonals"](this.diagonalsEnabled);
	};
	Acts.prototype.RegenerateRegion = function (startx, starty, endx, endy)
	{
		this.doRegenerateRegion(startx, starty, endx, endy);
	};
	Acts.prototype.RegenerateObjectRegion = function (obj)
	{
		if (!obj)
			return;
		var instances = obj.getCurrentSol().getObjects();
		var i, len, inst;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			inst = instances[i];
			if (!inst.update_bbox)
				continue;
			inst.update_bbox();
			this.doRegenerateRegion(inst.bbox.left, inst.bbox.top, inst.bbox.right, inst.bbox.bottom);
		}
	};
	behinstProto.doRegenerateRegion = function (startx, starty, endx, endy)
	{
		var x1 = Math.min(startx, endx) - this.cellBorder;
		var y1 = Math.min(starty, endy) - this.cellBorder;
		var x2 = Math.max(startx, endx) + this.cellBorder;
		var y2 = Math.max(starty, endy) + this.cellBorder;
		var cellX1 = Math.max(Math.floor(x1 / this.cellSize), 0);
		var cellY1 = Math.max(Math.floor(y1 / this.cellSize), 0);
		var cellX2 = Math.min(Math.ceil(x2 / this.cellSize), this.myHcells);
		var cellY2 = Math.min(Math.ceil(y2 / this.cellSize), this.myVcells);
		if (cellX1 >= cellX2 || cellY1 >= cellY2)
			return;		// empty area to regenerate
		this.getMyInfo().regenerateRegions.push([cellX1, cellY1, cellX2, cellY2]);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.NodeCount = function (ret)
	{
		ret.set_int(this.myPath.length);
	};
	Exps.prototype.NodeXAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= this.myPath.length)
			ret.set_float(0);
		else
			ret.set_float(this.myPath[i].x);
	};
	Exps.prototype.NodeYAt = function (ret, i)
	{
		i = Math.floor(i);
		if (i < 0 || i >= this.myPath.length)
			ret.set_float(0);
		else
			ret.set_float(this.myPath[i].y);
	};
	Exps.prototype.CellSize = function (ret)
	{
		ret.set_int(this.cellSize);
	};
	Exps.prototype.RabbitX = function (ret)
	{
		ret.set_float(this.rabbitX);
	};
	Exps.prototype.RabbitY = function (ret)
	{
		ret.set_float(this.rabbitY);
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxSpeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.RotateSpeed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.av));
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.a));
	};
	Exps.prototype.CurrentNode = function (ret)
	{
		ret.set_int(this.moveNode);
	};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(this.isMoving ? this.s : 0);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Pin = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Pin.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.pinObject = null;
		this.pinObjectUid = -1;		// for loading
		this.pinAngle = 0;
		this.pinDist = 0;
		this.myStartAngle = 0;
		this.theirStartAngle = 0;
		this.lastKnownAngle = 0;
		this.mode = 0;				// 0 = position & angle; 1 = position; 2 = angle; 3 = rope; 4 = bar
		var self = this;
		if (!this.recycled)
		{
			this.myDestroyCallback = (function(inst) {
													self.onInstanceDestroyed(inst);
												});
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"uid": this.pinObject ? this.pinObject.uid : -1,
			"pa": this.pinAngle,
			"pd": this.pinDist,
			"msa": this.myStartAngle,
			"tsa": this.theirStartAngle,
			"lka": this.lastKnownAngle,
			"m": this.mode
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.pinObjectUid = o["uid"];		// wait until afterLoad to look up
		this.pinAngle = o["pa"];
		this.pinDist = o["pd"];
		this.myStartAngle = o["msa"];
		this.theirStartAngle = o["tsa"];
		this.lastKnownAngle = o["lka"];
		this.mode = o["m"];
	};
	behinstProto.afterLoad = function ()
	{
		if (this.pinObjectUid === -1)
			this.pinObject = null;
		else
		{
			this.pinObject = this.runtime.getObjectByUID(this.pinObjectUid);
;
		}
		this.pinObjectUid = -1;
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		if (this.pinObject == inst)
			this.pinObject = null;
	};
	behinstProto.onDestroy = function()
	{
		this.pinObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.tick2 = function ()
	{
		if (!this.pinObject)
			return;
		if (this.lastKnownAngle !== this.inst.angle)
			this.myStartAngle = cr.clamp_angle(this.myStartAngle + (this.inst.angle - this.lastKnownAngle));
		var newx = this.inst.x;
		var newy = this.inst.y;
		if (this.mode === 3 || this.mode === 4)		// rope mode or bar mode
		{
			var dist = cr.distanceTo(this.inst.x, this.inst.y, this.pinObject.x, this.pinObject.y);
			if ((dist > this.pinDist) || (this.mode === 4 && dist < this.pinDist))
			{
				var a = cr.angleTo(this.pinObject.x, this.pinObject.y, this.inst.x, this.inst.y);
				newx = this.pinObject.x + Math.cos(a) * this.pinDist;
				newy = this.pinObject.y + Math.sin(a) * this.pinDist;
			}
		}
		else
		{
			newx = this.pinObject.x + Math.cos(this.pinObject.angle + this.pinAngle) * this.pinDist;
			newy = this.pinObject.y + Math.sin(this.pinObject.angle + this.pinAngle) * this.pinDist;
		}
		var newangle = cr.clamp_angle(this.myStartAngle + (this.pinObject.angle - this.theirStartAngle));
		this.lastKnownAngle = newangle;
		if ((this.mode === 0 || this.mode === 1 || this.mode === 3 || this.mode === 4)
			&& (this.inst.x !== newx || this.inst.y !== newy))
		{
			this.inst.x = newx;
			this.inst.y = newy;
			this.inst.set_bbox_changed();
		}
		if ((this.mode === 0 || this.mode === 2) && (this.inst.angle !== newangle))
		{
			this.inst.angle = newangle;
			this.inst.set_bbox_changed();
		}
	};
	function Cnds() {};
	Cnds.prototype.IsPinned = function ()
	{
		return !!this.pinObject;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Pin = function (obj, mode_)
	{
		if (!obj)
			return;
		var otherinst = obj.getFirstPicked(this.inst);
		if (!otherinst)
			return;
		this.pinObject = otherinst;
		this.pinAngle = cr.angleTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y) - otherinst.angle;
		this.pinDist = cr.distanceTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y);
		this.myStartAngle = this.inst.angle;
		this.lastKnownAngle = this.inst.angle;
		this.theirStartAngle = otherinst.angle;
		this.mode = mode_;
	};
	Acts.prototype.Unpin = function ()
	{
		this.pinObject = null;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.PinnedUID = function (ret)
	{
		ret.set_int(this.pinObject ? this.pinObject.uid : -1);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Rotate = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Rotate.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.speed = cr.to_radians(this.properties[0]);
		this.acc = cr.to_radians(this.properties[1]);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"speed": this.speed,
			"acc": this.acc
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.speed = o["speed"];
		this.acc = o["acc"];
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		if (dt === 0)
			return;
		if (this.acc !== 0)
			this.speed += this.acc * dt;
		if (this.speed !== 0)
		{
			this.inst.angle = cr.clamp_angle(this.inst.angle + this.speed * dt);
			this.inst.set_bbox_changed();
		}
	};
	function Cnds() {};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetSpeed = function (s)
	{
		this.speed = cr.to_radians(s);
	};
	Acts.prototype.SetAcceleration = function (a)
	{
		this.acc = cr.to_radians(a);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.speed));
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(cr.to_degrees(this.acc));
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Sin = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Sin.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.i = 0;		// period offset (radians)
	};
	var behinstProto = behaviorProto.Instance.prototype;
	var _2pi = 2 * Math.PI;
	var _pi_2 = Math.PI / 2;
	var _3pi_2 = (3 * Math.PI) / 2;
	behinstProto.onCreate = function()
	{
		this.active = (this.properties[0] === 1);
		this.movement = this.properties[1]; // 0=Horizontal|1=Vertical|2=Size|3=Width|4=Height|5=Angle|6=Opacity|7=Value only
		this.wave = this.properties[2];		// 0=Sine|1=Triangle|2=Sawtooth|3=Reverse sawtooth|4=Square
		this.period = this.properties[3];
		this.period += Math.random() * this.properties[4];								// period random
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i = (this.properties[5] / this.period) * _2pi;								// period offset
			this.i += ((Math.random() * this.properties[6]) / this.period) * _2pi;			// period offset random
		}
		this.mag = this.properties[7];													// magnitude
		this.mag += Math.random() * this.properties[8];									// magnitude random
		this.initialValue = 0;
		this.initialValue2 = 0;
		this.ratio = 0;
		this.init();
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"i": this.i,
			"a": this.active,
			"mv": this.movement,
			"w": this.wave,
			"p": this.period,
			"mag": this.mag,
			"iv": this.initialValue,
			"iv2": this.initialValue2,
			"r": this.ratio,
			"lkv": this.lastKnownValue,
			"lkv2": this.lastKnownValue2
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.i = o["i"];
		this.active = o["a"];
		this.movement = o["mv"];
		this.wave = o["w"];
		this.period = o["p"];
		this.mag = o["mag"];
		this.initialValue = o["iv"];
		this.initialValue2 = o["iv2"] || 0;
		this.ratio = o["r"];
		this.lastKnownValue = o["lkv"];
		this.lastKnownValue2 = o["lkv2"] || 0;
	};
	behinstProto.init = function ()
	{
		switch (this.movement) {
		case 0:		// horizontal
			this.initialValue = this.inst.x;
			break;
		case 1:		// vertical
			this.initialValue = this.inst.y;
			break;
		case 2:		// size
			this.initialValue = this.inst.width;
			this.ratio = this.inst.height / this.inst.width;
			break;
		case 3:		// width
			this.initialValue = this.inst.width;
			break;
		case 4:		// height
			this.initialValue = this.inst.height;
			break;
		case 5:		// angle
			this.initialValue = this.inst.angle;
			this.mag = cr.to_radians(this.mag);		// convert magnitude from degrees to radians
			break;
		case 6:		// opacity
			this.initialValue = this.inst.opacity;
			break;
		case 7:
			this.initialValue = 0;
			break;
		case 8:		// forwards/backwards
			this.initialValue = this.inst.x;
			this.initialValue2 = this.inst.y;
			break;
		default:
;
		}
		this.lastKnownValue = this.initialValue;
		this.lastKnownValue2 = this.initialValue2;
	};
	behinstProto.waveFunc = function (x)
	{
		x = x % _2pi;
		switch (this.wave) {
		case 0:		// sine
			return Math.sin(x);
		case 1:		// triangle
			if (x <= _pi_2)
				return x / _pi_2;
			else if (x <= _3pi_2)
				return 1 - (2 * (x - _pi_2) / Math.PI);
			else
				return (x - _3pi_2) / _pi_2 - 1;
		case 2:		// sawtooth
			return 2 * x / _2pi - 1;
		case 3:		// reverse sawtooth
			return -2 * x / _2pi + 1;
		case 4:		// square
			return x < Math.PI ? -1 : 1;
		};
		return 0;
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		if (!this.active || dt === 0)
			return;
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i += (dt / this.period) * _2pi;
			this.i = this.i % _2pi;
		}
		switch (this.movement) {
		case 0:		// horizontal
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
			this.inst.x = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			break;
		case 1:		// vertical
			if (this.inst.y !== this.lastKnownValue)
				this.initialValue += this.inst.y - this.lastKnownValue;
			this.inst.y = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.y;
			break;
		case 2:		// size
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.inst.height = this.inst.width * this.ratio;
			break;
		case 3:		// width
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 4:		// height
			this.inst.height = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 5:		// angle
			if (this.inst.angle !== this.lastKnownValue)
				this.initialValue = cr.clamp_angle(this.initialValue + (this.inst.angle - this.lastKnownValue));
			this.inst.angle = cr.clamp_angle(this.initialValue + this.waveFunc(this.i) * this.mag);
			this.lastKnownValue = this.inst.angle;
			break;
		case 6:		// opacity
			this.inst.opacity = this.initialValue + (this.waveFunc(this.i) * this.mag) / 100;
			if (this.inst.opacity < 0)
				this.inst.opacity = 0;
			else if (this.inst.opacity > 1)
				this.inst.opacity = 1;
			break;
		case 8:		// forwards/backwards
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
			if (this.inst.y !== this.lastKnownValue2)
				this.initialValue2 += this.inst.y - this.lastKnownValue2;
			this.inst.x = this.initialValue + Math.cos(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.inst.y = this.initialValue2 + Math.sin(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			this.lastKnownValue2 = this.inst.y;
			break;
		}
		this.inst.set_bbox_changed();
	};
	behinstProto.onSpriteFrameChanged = function (prev_frame, next_frame)
	{
		switch (this.movement) {
		case 2:	// size
			this.initialValue *= (next_frame.width / prev_frame.width);
			this.ratio = next_frame.height / next_frame.width;
			break;
		case 3:	// width
			this.initialValue *= (next_frame.width / prev_frame.width);
			break;
		case 4:	// height
			this.initialValue *= (next_frame.height / prev_frame.height);
			break;
		}
	};
	function Cnds() {};
	Cnds.prototype.IsActive = function ()
	{
		return this.active;
	};
	Cnds.prototype.CompareMovement = function (m)
	{
		return this.movement === m;
	};
	Cnds.prototype.ComparePeriod = function (cmp, v)
	{
		return cr.do_cmp(this.period, cmp, v);
	};
	Cnds.prototype.CompareMagnitude = function (cmp, v)
	{
		if (this.movement === 5)
			return cr.do_cmp(this.mag, cmp, cr.to_radians(v));
		else
			return cr.do_cmp(this.mag, cmp, v);
	};
	Cnds.prototype.CompareWave = function (w)
	{
		return this.wave === w;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetActive = function (a)
	{
		this.active = (a === 1);
	};
	Acts.prototype.SetPeriod = function (x)
	{
		this.period = x;
	};
	Acts.prototype.SetMagnitude = function (x)
	{
		this.mag = x;
		if (this.movement === 5)	// angle
			this.mag = cr.to_radians(this.mag);
	};
	Acts.prototype.SetMovement = function (m)
	{
		if (this.movement === 5)
			this.mag = cr.to_degrees(this.mag);
		this.movement = m;
		this.init();
	};
	Acts.prototype.SetWave = function (w)
	{
		this.wave = w;
	};
	Acts.prototype.SetPhase = function (x)
	{
		this.i = (x * _2pi) % _2pi;
	};
	Acts.prototype.UpdateInitialState = function ()
	{
		this.init();
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.CyclePosition = function (ret)
	{
		ret.set_float(this.i / _2pi);
	};
	Exps.prototype.Period = function (ret)
	{
		ret.set_float(this.period);
	};
	Exps.prototype.Magnitude = function (ret)
	{
		if (this.movement === 5)	// angle
			ret.set_float(cr.to_degrees(this.mag));
		else
			ret.set_float(this.mag);
	};
	Exps.prototype.Value = function (ret)
	{
		ret.set_float(this.waveFunc(this.i) * this.mag);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.bound = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.bound.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.mode = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.mode = this.properties[0];	// 0 = origin, 1 = edge
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.tick2 = function ()
	{
		this.inst.update_bbox();
		var bbox = this.inst.bbox;
		var layout = this.inst.layer.layout;
		var changed = false;
		if (this.mode === 0)	// origin
		{
			if (this.inst.x < 0)
			{
				this.inst.x = 0;
				changed = true;
			}
			if (this.inst.y < 0)
			{
				this.inst.y = 0;
				changed = true;
			}
			if (this.inst.x > layout.width)
			{
				this.inst.x = layout.width;
				changed = true;
			}
			if (this.inst.y > layout.height)
			{
				this.inst.y = layout.height;
				changed = true;
			}
		}
		else
		{
			if (bbox.left < 0)
			{
				this.inst.x -= bbox.left;
				changed = true;
			}
			if (bbox.top < 0)
			{
				this.inst.y -= bbox.top;
				changed = true;
			}
			if (bbox.right > layout.width)
			{
				this.inst.x -= (bbox.right - layout.width);
				changed = true;
			}
			if (bbox.bottom > layout.height)
			{
				this.inst.y -= (bbox.bottom - layout.height);
				changed = true;
			}
		}
		if (changed)
			this.inst.set_bbox_changed();
	};
}());
;
;
cr.behaviors.custom = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.custom.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;
		this.runtime = type.runtime;
		this.dx = 0;
		this.dy = 0;
		this.cancelStep = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.stepMode = this.properties[0];	// 0=None, 1=Linear, 2=Horizontal then vertical, 3=Vertical then horizontal
		this.pxPerStep = this.properties[1];
		this.enabled = (this.properties[2] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"dx": this.dx,
			"dy": this.dy,
			"cancelStep": this.cancelStep,
			"enabled": this.enabled,
			"stepMode": this.stepMode,
			"pxPerStep": this.pxPerStep
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.cancelStep = o["cancelStep"];
		this.enabled = o["enabled"];
		this.stepMode = o["stepMode"];
		this.pxPerStep = o["pxPerStep"];
	};
	behinstProto.getSpeed = function ()
	{
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
	};
	behinstProto.getAngle = function ()
	{
		return Math.atan2(this.dy, this.dx);
	};
	function sign(x)
	{
		if (x === 0)
			return 0;
		else if (x < 0)
			return -1;
		else
			return 1;
	};
	behinstProto.step = function (x, y, trigmethod)
	{
		if (x === 0 && y === 0)
			return;
		var startx = this.inst.x;
		var starty = this.inst.y;
		var sx, sy, prog;
		var steps = Math.round(Math.sqrt(x * x + y * y) / this.pxPerStep);
		if (steps === 0)
			steps = 1;
		var i;
		for (i = 1; i <= steps; i++)
		{
			prog = i / steps;
			this.inst.x = startx + x * prog;
			this.inst.y = starty + y * prog;
			this.inst.set_bbox_changed();
			this.runtime.trigger(trigmethod, this.inst);
			if (this.cancelStep === 1)
			{
				i--;
				prog = i / steps;
				this.inst.x = startx + x * prog;
				this.inst.y = starty + y * prog;
				this.inst.set_bbox_changed();
				return;
			}
			else if (this.cancelStep === 2)
			{
				return;
			}
		}
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx = this.dx * dt;
		var my = this.dy * dt;
		var i, steps;
		if ((this.dx === 0 && this.dy === 0) || !this.enabled)
			return;
		this.cancelStep = 0;
		if (this.stepMode === 0)		// none
		{
			this.inst.x += mx;
			this.inst.y += my;
		}
		else if (this.stepMode === 1)	// linear
		{
			this.step(mx, my, cr.behaviors.custom.prototype.cnds.OnCMStep);
		}
		else if (this.stepMode === 2)	// horizontal then vertical
		{
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
			this.cancelStep = 0;
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
		}
		else if (this.stepMode === 3)	// vertical then horizontal
		{
			this.step(0, my, cr.behaviors.custom.prototype.cnds.OnCMVertStep);
			this.cancelStep = 0;
			this.step(mx, 0, cr.behaviors.custom.prototype.cnds.OnCMHorizStep);
		}
		this.inst.set_bbox_changed();
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx != 0 || this.dy != 0;
	};
	Cnds.prototype.CompareSpeed = function (axis, cmp, s)
	{
		var speed;
		switch (axis) {
		case 0:		speed = this.getSpeed();	break;
		case 1:		speed = this.dx;			break;
		case 2:		speed = this.dy;			break;
		}
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.OnCMStep = function ()
	{
		return true;
	};
	Cnds.prototype.OnCMHorizStep = function ()
	{
		return true;
	};
	Cnds.prototype.OnCMVertStep = function ()
	{
		return true;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Stop = function ()
	{
		this.dx = 0;
		this.dy = 0;
	};
	Acts.prototype.Reverse = function (axis)
	{
		switch (axis) {
		case 0:
			this.dx *= -1;
			this.dy *= -1;
			break;
		case 1:
			this.dx *= -1;
			break;
		case 2:
			this.dy *= -1;
			break;
		}
	};
	Acts.prototype.SetSpeed = function (axis, s)
	{
		var a;
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx = Math.cos(a) * s;
			this.dy = Math.sin(a) * s;
			break;
		case 1:
			this.dx = s;
			break;
		case 2:
			this.dy = s;
			break;
		}
	};
	Acts.prototype.Accelerate = function (axis, acc)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a;
		switch (axis) {
		case 0:
			a = this.getAngle();
			this.dx += Math.cos(a) * ds;
			this.dy += Math.sin(a) * ds;
			break;
		case 1:
			this.dx += ds;
			break;
		case 2:
			this.dy += ds;
			break;
		}
	};
	Acts.prototype.AccelerateAngle = function (acc, a_)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = cr.to_radians(a_);
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	Acts.prototype.AcceleratePos = function (acc, x, y)
	{
		var dt = this.runtime.getDt(this.inst);
		var ds = acc * dt;
		var a = Math.atan2(y - this.inst.y, x - this.inst.x);
		this.dx += Math.cos(a) * ds;
		this.dy += Math.sin(a) * ds;
	};
	Acts.prototype.SetAngleOfMotion = function (a_)
	{
		var a = cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.RotateAngleOfMotionClockwise = function (a_)
	{
		var a = this.getAngle() + cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.RotateAngleOfMotionCounterClockwise = function (a_)
	{
		var a = this.getAngle() - cr.to_radians(a_);
		var s = this.getSpeed();
		this.dx = Math.cos(a) * s;
		this.dy = Math.sin(a) * s;
	};
	Acts.prototype.StopStepping = function (mode)
	{
		this.cancelStep = mode + 1;
	};
	Acts.prototype.PushOutSolid = function (mode)
	{
		var a, ux, uy;
		switch (mode) {
		case 0:
			a = this.getAngle();
			ux = Math.cos(a);
			uy = Math.sin(a);
			this.runtime.pushOutSolid(this.inst, -ux, -uy, Math.max(this.getSpeed() * 3, 100));
			break;
		case 1:
			this.runtime.pushOutSolidNearest(this.inst);
			break;
		case 2:
			this.runtime.pushOutSolid(this.inst, 0, -1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		case 3:
			this.runtime.pushOutSolid(this.inst, 0, 1, Math.max(Math.abs(this.dy) * 3, 100));
			break;
		case 4:
			this.runtime.pushOutSolid(this.inst, -1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		case 5:
			this.runtime.pushOutSolid(this.inst, 1, 0, Math.max(Math.abs(this.dx) * 3, 100));
			break;
		}
	};
	Acts.prototype.PushOutSolidAngle = function (a)
	{
		a = cr.to_radians(a);
		var ux = Math.cos(a);
		var uy = Math.sin(a);
		this.runtime.pushOutSolid(this.inst, ux, uy, Math.max(this.getSpeed() * 3, 100));
	};
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(this.getSpeed());
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.getAngle()));
	};
	Exps.prototype.dx = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.dy = function (ret)
	{
		ret.set_float(this.dy);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.destroy = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.destroy.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
	};
	behinstProto.tick = function ()
	{
		this.inst.update_bbox();
		var bbox = this.inst.bbox;
		var layout = this.inst.layer.layout;
		if (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height)
			this.runtime.DestroyInstance(this.inst);
	};
}());
;
;
cr.behaviors.solid = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.solid.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.inst.extra["solidEnabled"] = (this.properties[0] !== 0);
	};
	behinstProto.tick = function ()
	{
	};
	function Cnds() {};
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["solidEnabled"];
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["solidEnabled"] = !!e;
	};
	behaviorProto.acts = new Acts();
}());
cr.getObjectRefTable = function () { return [
	cr.plugins_.AJAX,
	cr.plugins_.Audio,
	cr.plugins_.Dictionary,
	cr.plugins_.Function,
	cr.plugins_.Browser,
	cr.plugins_.Button,
	cr.plugins_.List,
	cr.plugins_.Particles,
	cr.plugins_.Keyboard,
	cr.plugins_.Multiplayer,
	cr.plugins_.Spriter,
	cr.plugins_.Text,
	cr.plugins_.Sprite,
	cr.plugins_.TextBox,
	cr.plugins_.Touch,
	cr.plugins_.Rex_ZSorter,
	cr.plugins_.TiledBg,
	cr.behaviors.Anchor,
	cr.behaviors.Fade,
	cr.behaviors.Pathfinding,
	cr.behaviors.bound,
	cr.behaviors.Pin,
	cr.behaviors.solid,
	cr.behaviors.DragnDrop,
	cr.behaviors.Sin,
	cr.behaviors.Bullet,
	cr.behaviors.custom,
	cr.behaviors.destroy,
	cr.behaviors.EightDir,
	cr.behaviors.Flash,
	cr.behaviors.Rotate,
	cr.plugins_.Spriter.prototype.cnds.readyForSetup,
	cr.plugins_.Spriter.prototype.acts.associateTypeWithName,
	cr.system_object.prototype.cnds.IsGroupActive,
	cr.system_object.prototype.cnds.EveryTick,
	cr.plugins_.TextBox.prototype.acts.SetCSSStyle,
	cr.plugins_.Text.prototype.acts.SetWebFont,
	cr.plugins_.TextBox.prototype.cnds.CompareText,
	cr.behaviors.Fade.prototype.acts.SetWaitTime,
	cr.plugins_.Sprite.prototype.acts.SetVisible,
	cr.plugins_.Touch.prototype.cnds.IsTouchingObject,
	cr.plugins_.Sprite.prototype.cnds.CompareOpacity,
	cr.plugins_.Sprite.prototype.acts.SetEffectParam,
	cr.plugins_.Sprite.prototype.acts.SetScale,
	cr.plugins_.Browser.prototype.cnds.IsOnline,
	cr.system_object.prototype.cnds.TriggerOnce,
	cr.plugins_.Sprite.prototype.cnds.CompareFrame,
	cr.system_object.prototype.acts.Wait,
	cr.plugins_.TextBox.prototype.acts.Destroy,
	cr.system_object.prototype.acts.CreateObject,
	cr.plugins_.Sprite.prototype.exps.X,
	cr.plugins_.TextBox.prototype.acts.SetText,
	cr.plugins_.Browser.prototype.cnds.OnOnline,
	cr.system_object.prototype.cnds.LayerVisible,
	cr.system_object.prototype.cnds.CompareVar,
	cr.system_object.prototype.acts.SetVar,
	cr.plugins_.Touch.prototype.cnds.OnTouchObject,
	cr.plugins_.AJAX.prototype.acts.Post,
	cr.plugins_.TextBox.prototype.exps.Text,
	cr.plugins_.AJAX.prototype.cnds.OnComplete,
	cr.plugins_.AJAX.prototype.exps.LastData,
	cr.system_object.prototype.exps.tokenat,
	cr.system_object.prototype.acts.GoToLayout,
	cr.system_object.prototype.cnds.Compare,
	cr.system_object.prototype.exps.len,
	cr.plugins_.Sprite.prototype.acts.SetOpacity,
	cr.system_object.prototype.cnds.Else,
	cr.system_object.prototype.cnds.OnLayoutStart,
	cr.system_object.prototype.acts.SetLayerVisible,
	cr.plugins_.Function.prototype.acts.CallFunction,
	cr.plugins_.Function.prototype.cnds.OnFunction,
	cr.plugins_.TextBox.prototype.cnds.OnTextChanged,
	cr.system_object.prototype.exps.find,
	cr.system_object.prototype.exps.left,
	cr.system_object.prototype.cnds.Every,
	cr.system_object.prototype.acts.SubVar,
	cr.plugins_.TextBox.prototype.cnds.IsOutsideLayout,
	cr.plugins_.Sprite.prototype.cnds.IsAnimPlaying,
	cr.system_object.prototype.exps.windowwidth,
	cr.system_object.prototype.acts.AddVar,
	cr.plugins_.Spriter.prototype.acts.setObjectScaleRatio,
	cr.plugins_.Spriter.prototype.acts.setAnimation,
	cr.plugins_.Text.prototype.acts.SetText,
	cr.plugins_.Sprite.prototype.acts.SetPos,
	cr.system_object.prototype.exps.viewportright,
	cr.system_object.prototype.exps.viewportleft,
	cr.plugins_.Sprite.prototype.acts.SetAnim,
	cr.plugins_.Function.prototype.exps.Param,
	cr.plugins_.Sprite.prototype.exps.AnimationName,
	cr.plugins_.Sprite.prototype.exps.AnimationFrame,
	cr.plugins_.Sprite.prototype.cnds.PickByUID,
	cr.plugins_.Sprite.prototype.acts.SetAnimFrame,
	cr.plugins_.Function.prototype.cnds.CompareParam,
	cr.behaviors.Pin.prototype.acts.Pin,
	cr.plugins_.Sprite.prototype.acts.SetX,
	cr.plugins_.Spriter.prototype.acts.SetX,
	cr.plugins_.TextBox.prototype.cnds.CompareWidth,
	cr.plugins_.TextBox.prototype.acts.SetWidth,
	cr.plugins_.Audio.prototype.cnds.IsTagPlaying,
	cr.plugins_.Audio.prototype.acts.Play,
	cr.plugins_.Multiplayer.prototype.acts.SignallingConnect,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingConnected,
	cr.plugins_.Multiplayer.prototype.acts.SignallingLogin,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingLoggedIn,
	cr.plugins_.Multiplayer.prototype.acts.SignallingJoinRoom,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingJoinedRoom,
	cr.plugins_.Spriter.prototype.cnds.CompareInstanceVar,
	cr.plugins_.Spriter.prototype.cnds.IsOnLayer,
	cr.behaviors.Pathfinding.prototype.acts.Stop,
	cr.plugins_.Spriter.prototype.acts.setObjectXFlip,
	cr.plugins_.Multiplayer.prototype.cnds.IsHost,
	cr.system_object.prototype.acts.SetGroupActive,
	cr.system_object.prototype.cnds.ForEach,
	cr.plugins_.Text.prototype.cnds.CompareText,
	cr.plugins_.Text.prototype.exps.Text,
	cr.plugins_.Spriter.prototype.cnds.PickByUID,
	cr.plugins_.Text.prototype.exps.UID,
	cr.plugins_.Text.prototype.cnds.IsOnLayer,
	cr.plugins_.Spriter.prototype.acts.Destroy,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingLeftRoom,
	cr.plugins_.Sprite.prototype.acts.Destroy,
	cr.plugins_.Multiplayer.prototype.acts.SendPeerMessage,
	cr.plugins_.Spriter.prototype.exps.X,
	cr.plugins_.Spriter.prototype.exps.Y,
	cr.plugins_.Spriter.prototype.exps.animationName,
	cr.plugins_.Multiplayer.prototype.cnds.OnPeerConnected,
	cr.plugins_.Sprite.prototype.cnds.CompareX,
	cr.plugins_.Sprite.prototype.cnds.CompareY,
	cr.plugins_.Sprite.prototype.exps.Y,
	cr.plugins_.Sprite.prototype.cnds.IsVisible,
	cr.plugins_.Text.prototype.acts.SetVisible,
	cr.behaviors.Fade.prototype.acts.StartFade,
	cr.plugins_.Multiplayer.prototype.exps.CurrentRoom,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingKicked,
	cr.plugins_.Multiplayer.prototype.acts.DisconnectRoom,
	cr.plugins_.Multiplayer.prototype.cnds.OnAnyPeerMessage,
	cr.plugins_.Multiplayer.prototype.acts.HostBroadcastMessage,
	cr.plugins_.Multiplayer.prototype.exps.FromID,
	cr.plugins_.Multiplayer.prototype.exps.Tag,
	cr.plugins_.Multiplayer.prototype.exps.Message,
	cr.plugins_.Multiplayer.prototype.cnds.OnPeerMessage,
	cr.system_object.prototype.exps["float"],
	cr.system_object.prototype.exps.newline,
	cr.behaviors.Fade.prototype.acts.RestartFade,
	cr.plugins_.TextBox.prototype.acts.ScrollToBottom,
	cr.behaviors.Anchor.prototype.acts.SetEnabled,
	cr.plugins_.Spriter.prototype.acts.SetInstanceVar,
	cr.plugins_.Text.prototype.acts.SetInstanceVar,
	cr.plugins_.Spriter.prototype.exps.UID,
	cr.plugins_.Sprite.prototype.acts.MoveToLayer,
	cr.plugins_.Text.prototype.acts.MoveToLayer,
	cr.system_object.prototype.cnds.ForEachOrdered,
	cr.plugins_.Text.prototype.exps.Y,
	cr.plugins_.Text.prototype.acts.MoveToTop,
	cr.plugins_.Browser.prototype.cnds.OnOffline,
	cr.plugins_.Multiplayer.prototype.acts.SignallingDisconnect,
	cr.plugins_.Browser.prototype.cnds.OnBackButton,
	cr.plugins_.Multiplayer.prototype.cnds.OnPeerDisconnected,
	cr.plugins_.Multiplayer.prototype.cnds.OnSignallingDisconnected,
	cr.plugins_.Multiplayer.prototype.exps.PeerAlias,
	cr.plugins_.Spriter.prototype.acts.SetPos,
	cr.plugins_.Sprite.prototype.cnds.IsOnLayer,
	cr.plugins_.Text.prototype.cnds.PickByUID,
	cr.plugins_.Spriter.prototype.cnds.OnCreated,
	cr.plugins_.Sprite.prototype.cnds.OnCreated,
	cr.plugins_.Spriter.prototype.cnds.CompareX,
	cr.behaviors.Pathfinding.prototype.cnds.OnPathFound,
	cr.behaviors.Pathfinding.prototype.cnds.OnArrived,
	cr.plugins_.Spriter.prototype.cnds.IsVisible,
	cr.plugins_.Spriter.prototype.exps.ScaleRatio,
	cr.plugins_.Text.prototype.acts.SetPos,
	cr.plugins_.Spriter.prototype.cnds.CompareAnimation,
	cr.plugins_.TextBox.prototype.acts.SetVisible,
	cr.plugins_.Sprite.prototype.acts.SetY,
	cr.plugins_.List.prototype.acts.SetCSSStyle,
	cr.plugins_.TextBox.prototype.acts.SetReadOnly,
	cr.plugins_.Sprite.prototype.acts.SetPosToObject,
	cr.system_object.prototype.cnds.For,
	cr.system_object.prototype.exps.tokencount,
	cr.system_object.prototype.exps.loopindex,
	cr.plugins_.Sprite.prototype.cnds.PickTopBottom,
	cr.plugins_.Sprite.prototype.exps.LayerName,
	cr.system_object.prototype.exps.round,
	cr.plugins_.Sprite.prototype.exps.LayerNumber,
	cr.plugins_.Spriter.prototype.acts.setVisible,
	cr.system_object.prototype.exps.choose,
	cr.plugins_.Spriter.prototype.cnds.OnAnyAnimFinished,
	cr.plugins_.TiledBg.prototype.acts.SetX,
	cr.system_object.prototype.exps.scrollx,
	cr.plugins_.TiledBg.prototype.acts.SetY,
	cr.system_object.prototype.exps.scrolly,
	cr.system_object.prototype.exps.abs,
	cr.system_object.prototype.acts.ScrollX,
	cr.system_object.prototype.acts.ScrollY,
	cr.plugins_.TiledBg.prototype.exps.X,
	cr.plugins_.TiledBg.prototype.exps.Y,
	cr.behaviors.Fade.prototype.acts.SetFadeOutTime,
	cr.system_object.prototype.exps["int"],
	cr.plugins_.Spriter.prototype.acts.SetVisible,
	cr.plugins_.Text.prototype.cnds.OnCreated,
	cr.plugins_.Text.prototype.cnds.CompareInstanceVar,
	cr.plugins_.Text.prototype.cnds.IsVisible,
	cr.system_object.prototype.acts.GoToLayoutByName,
	cr.system_object.prototype.exps.ceil,
	cr.plugins_.TiledBg.prototype.acts.SetWidth,
	cr.plugins_.List.prototype.acts.SetWidth,
	cr.plugins_.Text.prototype.acts.SetWidth,
	cr.plugins_.Text.prototype.acts.SetFontColor,
	cr.system_object.prototype.exps.rgb,
	cr.plugins_.Text.prototype.acts.SetPosToObject,
	cr.plugins_.TextBox.prototype.acts.SetPosToObject,
	cr.plugins_.List.prototype.acts.SetPosToObject,
	cr.plugins_.Sprite.prototype.cnds.CompareInstanceVar,
	cr.plugins_.Sprite.prototype.acts.SetInstanceVar,
	cr.system_object.prototype.exps.replace,
	cr.plugins_.Sprite.prototype.exps.Width,
	cr.plugins_.Sprite.prototype.exps.Height,
	cr.plugins_.Keyboard.prototype.cnds.OnKey,
	cr.behaviors.solid.prototype.acts.SetEnabled,
	cr.behaviors.Pathfinding.prototype.acts.RegenerateMap,
	cr.plugins_.Touch.prototype.cnds.IsInTouch,
	cr.behaviors.Pathfinding.prototype.cnds.IsMoving,
	cr.behaviors.Pathfinding.prototype.acts.FindPath,
	cr.plugins_.Touch.prototype.exps.X,
	cr.plugins_.Touch.prototype.exps.Y,
	cr.behaviors.Pathfinding.prototype.acts.StartMoving,
	cr.behaviors.Pathfinding.prototype.acts.ClearCost,
	cr.plugins_.Spriter.prototype.cnds.OnAnimFinished,
	cr.plugins_.Sprite.prototype.exps.UID,
	cr.system_object.prototype.exps.floor,
	cr.system_object.prototype.exps.time,
	cr.plugins_.Touch.prototype.cnds.OnTouchEnd,
	cr.plugins_.Touch.prototype.cnds.OnTapGestureObject,
	cr.plugins_.Spriter.prototype.cnds.OnDestroyed,
	cr.plugins_.Touch.prototype.cnds.OnDoubleTapGestureObject,
	cr.plugins_.Sprite.prototype.cnds.IsOutsideLayout,
	cr.behaviors.DragnDrop.prototype.acts.SetEnabled,
	cr.plugins_.Sprite.prototype.cnds.IsOverlapping,
	cr.plugins_.Touch.prototype.cnds.OnTouchStart,
	cr.behaviors.EightDir.prototype.acts.SimulateControl,
	cr.behaviors.DragnDrop.prototype.cnds.IsDragging,
	cr.system_object.prototype.exps.viewporttop,
	cr.system_object.prototype.exps.viewportbottom,
	cr.behaviors.DragnDrop.prototype.cnds.IsEnabled,
	cr.plugins_.Touch.prototype.cnds.OnTapGesture,
	cr.plugins_.Sprite.prototype.cnds.IsOverlappingOffset,
	cr.plugins_.Sprite.prototype.acts.ZMoveToObject,
	cr.plugins_.Sprite.prototype.exps.Opacity,
	cr.system_object.prototype.acts.StopLoop,
	cr.plugins_.Sprite.prototype.exps.PickedCount,
	cr.plugins_.Sprite.prototype.acts.SetEffectEnabled,
	cr.plugins_.Sprite.prototype.exps.AnimationFrameCount,
	cr.plugins_.Sprite.prototype.exps.ImagePointX,
	cr.plugins_.Rex_ZSorter.prototype.acts.SortObjsLayerByY,
	cr.plugins_.Sprite.prototype.acts.MoveToTop,
	cr.plugins_.Sprite.prototype.acts.MoveToBottom,
	cr.plugins_.Spriter.prototype.acts.MoveToTop,
	cr.plugins_.TiledBg.prototype.cnds.IsOnLayer,
	cr.plugins_.Spriter.prototype.acts.SetY,
	cr.plugins_.Text.prototype.acts.SetX,
	cr.plugins_.Sprite.prototype.exps.ImagePointY,
	cr.system_object.prototype.cnds.While,
	cr.plugins_.List.prototype.exps.ItemCount,
	cr.plugins_.List.prototype.acts.AddItem,
	cr.plugins_.List.prototype.cnds.OnDoubleClicked,
	cr.plugins_.List.prototype.exps.SelectedText,
	cr.plugins_.List.prototype.acts.SetVisible,
	cr.plugins_.List.prototype.acts.Clear,
	cr.plugins_.Text.prototype.cnds.CompareY,
	cr.plugins_.Text.prototype.acts.SetY,
	cr.system_object.prototype.exps.random,
	cr.system_object.prototype.exps.layoutwidth,
	cr.plugins_.Sprite.prototype.cnds.IsBoolInstanceVarSet,
	cr.plugins_.Dictionary.prototype.acts.AddKey,
	cr.system_object.prototype.exps.distance,
	cr.plugins_.Dictionary.prototype.exps.Get,
	cr.system_object.prototype.exps.lerp,
	cr.system_object.prototype.exps.clamp,
	cr.plugins_.Sprite.prototype.acts.MoveAtAngle,
	cr.plugins_.Sprite.prototype.acts.AddInstanceVar,
	cr.system_object.prototype.exps.dt,
	cr.plugins_.Sprite.prototype.acts.SetBoolInstanceVar,
	cr.plugins_.Sprite.prototype.cnds.OnDestroyed,
	cr.plugins_.Dictionary.prototype.acts.DeleteKey,
	cr.system_object.prototype.acts.RestartLayout,
	cr.behaviors.Bullet.prototype.acts.Bounce,
	cr.plugins_.Sprite.prototype.acts.Spawn,
	cr.behaviors.Bullet.prototype.acts.SetAngleOfMotion,
	cr.behaviors.Bullet.prototype.exps.AngleOfMotion,
	cr.plugins_.TiledBg.prototype.exps.Width,
	cr.plugins_.TiledBg.prototype.cnds.PickByUID,
	cr.plugins_.TiledBg.prototype.exps.Height,
	cr.plugins_.Sprite.prototype.acts.SetWidth,
	cr.plugins_.Sprite.prototype.acts.SetHeight,
	cr.behaviors.custom.prototype.acts.SetSpeed,
	cr.behaviors.Bullet.prototype.acts.SetSpeed,
	cr.behaviors.Bullet.prototype.cnds.CompareTravelled,
	cr.behaviors.Bullet.prototype.acts.SetEnabled,
	cr.plugins_.Sprite.prototype.cnds.OnCollision,
	cr.plugins_.Sprite.prototype.acts.SubInstanceVar,
	cr.plugins_.Particles.prototype.acts.SetEffectParam,
	cr.plugins_.Sprite.prototype.exps.Count,
	cr.plugins_.Particles.prototype.acts.Destroy,
	cr.system_object.prototype.exps.loadingprogress,
	cr.system_object.prototype.cnds.OnLoadFinished,
	cr.plugins_.TextBox.prototype.cnds.PickByUID,
	cr.behaviors.Rotate.prototype.acts.SetSpeed,
	cr.plugins_.Sprite.prototype.cnds.AngleWithin,
	cr.system_object.prototype.exps.layeropacity,
	cr.system_object.prototype.acts.SetLayerOpacity
];};
