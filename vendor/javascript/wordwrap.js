var r={};var e=r=function(r,e,t){if("object"===typeof r){t=r;r=t.start;e=t.stop}if("object"===typeof e){t=e;r=r||t.start;e=void 0}if(!e){e=r;r=0}t||(t={});var n=t.mode||"soft";var a="hard"===n?/\b/:/(\S+\s+)/;return function(t){var o=t.toString().split(a).reduce((function(t,a){if("hard"===n)for(var o=0;o<a.length;o+=e-r)t.push(a.slice(o,o+e-r));else t.push(a);return t}),[]);return o.reduce((function(t,n){if(""===n)return t;var a=n.replace(/\t/g,"    ");var o=t.length-1;if(t[o].length+a.length>e){t[o]=t[o].replace(/\s+$/,"");a.split(/\n/).forEach((function(e){t.push(new Array(r+1).join(" ")+e.replace(/^\s+/,""))}))}else if(a.match(/\n/)){var i=a.split(/\n/);t[o]+=i.shift();i.forEach((function(e){t.push(new Array(r+1).join(" ")+e.replace(/^\s+/,""))}))}else t[o]+=a;return t}),[new Array(r+1).join(" ")]).join("\n")}};e.soft=e;e.hard=function(r,t){return e(r,t,{mode:"hard"})};var t=r;export default t;

