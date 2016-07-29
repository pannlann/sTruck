jQuery.sap.declare("SpicersTruck.util.SignaturePad" );
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend("SpicersTruck.util.SignaturePad", {
    metadata: {
        properties: {
            width: {
              type: "int",
              defaultValue: 450
            },
            height: {
                type: "int",
                defaultValue: 150
            },
            fillStyle: {
                type: "string",
                defaultValue: "#fff"
            },
            strokeStyle: {
                type: "string",
                defaultValue: "#444"
            },
            lineWidth: {
                type: "float",
                defaultValue: 3
            },
            lineCap: {
                type: "string",
                defaultValue: "round"
            },
            penColor: {
                type: "string",
                defaultValue: "#FFFFFF"
            },
            imageUrl: {
                type: "string",
                defaultValue: ""
//                  defaultValue: "data:image/png;base64,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"
            },
            signature: "string"
        }
    },
    renderer: function(e, t) {
        var i = t.getId();
        e.write("<div"), 
        e.writeControlData(t), 
        e.write(">"), 
        e.write('<canvas class="roundCorners" id="' + i + '_c" style="position: relative; margin: 0; padding: 0; border: 1px solid #c4caac; -ms-touch-action: none;""  >'), 
        e.write("</canvas>"), 
        e.write("</div>")
    },
    clear: function() {
        me.c.width = me.getWidth(), 
        me.c.height = me.getHeight();
        var e = me.c.getContext("2d");
        e.fillStyle = this.getFillStyle(), 
        e.strokeStyle = this.getStrokeStyle(), 
        e.lineWidth = this.getLineWidth(), 
        e.lineCap = this.getLineCap(), e.fillRect(0, 0, me.c.width, me.c.height);
        me._isEmpty = true;
    },
    getSignature: function() {
        return me.c.toDataURL("image/png");
    },
    
    isEmpty: function() {
    	return me._isEmpty;
    },
    onAfterRendering: function() {
        function e() {
            me.c.removeEventListener("mousemove", n, !1), 
            me.c.removeEventListener("mouseup", a, !1), 
            me.c.removeEventListener("touchmove", n, !1), 
            me.c.removeEventListener("touchend", a, !1), 
            document.body.removeEventListener("mouseup", a, !1), 
            document.body.removeEventListener("touchend", a, !1)
        }

        function t(e) {
            var t, i;
            if (e.changedTouches && e.changedTouches[0]) {
                var n = me.c.offsetTop || 0,
                    a = me.c.offsetLeft || 0;
                t = e.changedTouches[0].pageX - a, 
                i = e.changedTouches[0].pageY - n
            } else 
            	e.layerX || 0 == e.layerX ? (t = e.layerX, i = e.layerY) : (e.offsetX || 0 == e.offsetX) && (t = e.offsetX, i = e.offsetY);
            return {
                x: t,
                y: i
            }
        }

        function i(e) {
            e.preventDefault(), 
            e.stopPropagation(), 
            me.c.addEventListener("mouseup", a, !1), 
            me.c.addEventListener("mousemove", n, !1), 
            me.c.addEventListener("touchend", a, !1), 
            me.c.addEventListener("touchmove", n, !1), 
            document.body.addEventListener("mouseup", a, !1), 
            document.body.addEventListener("touchend", a, !1), 
            empty = !1;
            me._isEmpty = false;
            var i = t(e);
            r.beginPath(), 
            d.push("moveStart"), 
            r.moveTo(i.x, i.y), 
            d.push(i.x, i.y), 
            u = i
        }

        function n(e) {
            e.preventDefault(), 
            e.stopPropagation();
            var i = t(e),
                n = {
                    x: (u.x + i.x) / 2,
                    y: (u.y + i.y) / 2
                };
            if (l) {
                var a = (c.x + u.x + n.x) / 3,
                    o = (c.y + u.y + n.y) / 3;
                d.push(a, o)
            } else l = !0;
            r.quadraticCurveTo(u.x, u.y, n.x, n.y), 
            d.push(n.x, n.y), 
            r.stroke(), 
            r.beginPath(), 
            r.moveTo(n.x, n.y), 
            c = n, 
            u = i
            me._isEmpty = false;
        }

        function a() {
            e(), 
            s = !1, 
            r.stroke(), 
            d.push("e"), 
            l = !1
        }
        this._isEmpty = true;
        me = this, 
        me.c = document.getElementById(this.getId() + "_c");
        var r = this.c.getContext("2d");
        if (me.c.width = this.getWidth(), me.c.height = this.getHeight(), r.fillStyle = this.getFillStyle(), r.strokeStyle = this.getStrokeStyle(), r.lineWidth = this.getLineWidth(), r.lineCap = this.getLineCap(), r.fillRect(0, 0, me.c.width, me.c.height), me.getImageUrl()) {
            var o = new Image;
            o.src = me.getImageUrl(), r.drawImage(o, 0, 0)
        }
        var s = !0,
            d = [],
            u = {}, c = {}, l = !1;
        me.c.addEventListener("touchstart", i, !1), 
        me.c.addEventListener("mousedown", i, !1)
    }
});
