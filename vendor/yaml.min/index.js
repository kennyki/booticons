(function e(e,t,n){function i(r,o){if(!t[r]){if(!e[r]){var u=typeof require=="function"&&require;if(!o&&u)return u(r,!0);if(s)return s(r,!0);var a=new Error("Cannot find module '"+r+"'");throw a.code="MODULE_NOT_FOUND",a}var l=t[r]={exports:{}};e[r][0].call(l.exports,function(t){var n=e[r][1][t];return i(n?n:t)},l,l.exports,e,e,t,n)}return t[r].exports}var s=typeof require=="function"&&require;for(var r=0;r<n.length;r++)i(n[r]);return i})({1:[function(n,r,s){var i,t,e;e=n("./Utils");t=n("./Inline");i=function(){function n(){}n.indentation=4;n.prototype.dump=function(n,s,l,u,a){var h,o,f,r,i,c,p;if(s==null){s=0}if(l==null){l=0}if(u==null){u=false}if(a==null){a=null}o="";f=l?e.strRepeat(" ",l):"";if(s<=0||typeof n!=="object"||n instanceof Date||e.isEmpty(n)){o+=f+t.dump(n,u,a)}else{if(n instanceof Array){for(c=0,p=n.length;c<p;c++){r=n[c];i=s-1<=0||typeof r!=="object"||e.isEmpty(r);o+=f+"-"+(i?" ":"\n")+this.dump(r,s-1,i?0:l+this.indentation,u,a)+(i?"\n":"")}}else{for(h in n){r=n[h];i=s-1<=0||typeof r!=="object"||e.isEmpty(r);o+=f+t.dump(h,u,a)+":"+(i?" ":"\n")+this.dump(r,s-1,i?0:l+this.indentation,u,a)+(i?"\n":"")}}}return o};return n}();r.exports=i},{"./Inline":5,"./Utils":9}],2:[function(n,i,r){var t,e;e=n("./Pattern");t=function(){var n;function t(){}t.LIST_ESCAPEES=["\\\\",'\\"','"',"\x00","","","","","","","","\b","	","\n","","\f","\r","","","","","","","","","","","","","","","","","","",(n=String.fromCharCode)(133),n(160),n(8232),n(8233)];t.LIST_ESCAPED=['\\"',"\\\\",'\\"',"\\0","\\x01","\\x02","\\x03","\\x04","\\x05","\\x06","\\a","\\b","\\t","\\n","\\v","\\f","\\r","\\x0e","\\x0f","\\x10","\\x11","\\x12","\\x13","\\x14","\\x15","\\x16","\\x17","\\x18","\\x19","\\x1a","\\e","\\x1c","\\x1d","\\x1e","\\x1f","\\N","\\_","\\L","\\P"];t.MAPPING_ESCAPEES_TO_ESCAPED=function(){var i,r,e,n;r={};for(i=e=0,n=t.LIST_ESCAPEES.length;0<=n?e<n:e>n;i=0<=n?++e:--e){r[t.LIST_ESCAPEES[i]]=t.LIST_ESCAPED[i]}return r}();t.PATTERN_CHARACTERS_TO_ESCAPE=new e("[\\x00-\\x1f]|Â|Â |â¨|â©");t.PATTERN_MAPPING_ESCAPEES=new e(t.LIST_ESCAPEES.join("|"));t.PATTERN_SINGLE_QUOTING=new e("[\\s'\":{}[\\],&*#?]|^[-?|<>=!%@`]");t.requiresDoubleQuoting=function(e){return this.PATTERN_CHARACTERS_TO_ESCAPE.test(e)};t.escapeWithDoubleQuotes=function(t){var e;e=this.PATTERN_MAPPING_ESCAPEES.replace(t,function(e){return function(t){return e.MAPPING_ESCAPEES_TO_ESCAPED[t]}}(this));return'"'+e+'"'};t.requiresSingleQuoting=function(e){return this.PATTERN_SINGLE_QUOTING.test(e)};t.escapeWithSingleQuotes=function(e){return"'"+e.replace("'","''")+"'"};return t}();i.exports=t},{"./Pattern":7}],3:[function(r,t,s){var e,n={}.hasOwnProperty,i=function(e,t){for(var i in t){if(n.call(t,i))e[i]=t[i]}function r(){this.constructor=e}r.prototype=t.prototype;e.prototype=new r;e.__super__=t.prototype;return e};e=function(t){i(e,t);function e(e,t,n){this.message=e;this.parsedLine=t;this.snippet=n}e.prototype.toString=function(){if(this.parsedLine!=null&&this.snippet!=null){return"<DumpException> "+this.message+" (line "+this.parsedLine+": '"+this.snippet+"')"}else{return"<DumpException> "+this.message}};return e}(Error);t.exports=e},{}],4:[function(r,t,s){var e,n={}.hasOwnProperty,i=function(e,t){for(var i in t){if(n.call(t,i))e[i]=t[i]}function r(){this.constructor=e}r.prototype=t.prototype;e.prototype=new r;e.__super__=t.prototype;return e};e=function(t){i(e,t);function e(e,t,n){this.message=e;this.parsedLine=t;this.snippet=n}e.prototype.toString=function(){if(this.parsedLine!=null&&this.snippet!=null){return"<ParseException> "+this.message+" (line "+this.parsedLine+": '"+this.snippet+"')"}else{return"<ParseException> "+this.message}};return e}(Error);t.exports=e},{}],5:[function(n,a,f){var o,i,u,t,r,s,e,l=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1};r=n("./Pattern");s=n("./Unescaper");i=n("./Escaper");e=n("./Utils");t=n("./Exception/ParseException");o=n("./Exception/DumpException");u=function(){function n(){}n.REGEX_QUOTED_STRING="(?:\"(?:[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|'(?:[^']*(?:''[^']*)*)')";n.PATTERN_TRAILING_COMMENTS=new r("^\\s*#.*$");n.PATTERN_QUOTED_SCALAR=new r("^"+n.REGEX_QUOTED_STRING);n.PATTERN_THOUSAND_NUMERIC_SCALAR=new r("^(-|\\+)?[0-9,]+(\\.[0-9]+)?$");n.PATTERN_SCALAR_BY_DELIMITERS={};n.settings={};n.configure=function(e,t){if(e==null){e=null}if(t==null){t=null}this.settings.exceptionOnInvalidType=e;this.settings.objectDecoder=t};n.parse=function(n,r,s){var i,l;if(r==null){r=false}if(s==null){s=null}this.settings.exceptionOnInvalidType=r;this.settings.objectDecoder=s;if(n==null){return""}n=e.trim(n);if(0===n.length){return""}i={exceptionOnInvalidType:r,objectDecoder:s,i:0};switch(n.charAt(0)){case"[":l=this.parseSequence(n,i);++i.i;break;case"{":l=this.parseMapping(n,i);++i.i;break;default:l=this.parseScalar(n,null,['"',"'"],i)}if(this.PATTERN_TRAILING_COMMENTS.replace(n.slice(i.i),"")!==""){throw new t('Unexpected characters near "'+n.slice(i.i)+'".')}return l};n.dump=function(t,u,r){var s,n,l;if(u==null){u=false}if(r==null){r=null}if(t==null){return"null"}n=typeof t;if(n==="object"){if(t instanceof Date){return t.toISOString()}else if(r!=null){s=r(t);if(typeof s==="string"||s!=null){return s}}return this.dumpObject(t)}if(n==="boolean"){return t?"true":"false"}if(e.isDigits(t)){return n==="string"?"'"+t+"'":String(parseInt(t))}if(e.isNumeric(t)){return n==="string"?"'"+t+"'":String(parseFloat(t))}if(n==="number"){return t===Infinity?".Inf":t===-Infinity?"-.Inf":isNaN(t)?".NaN":t}if(i.requiresDoubleQuoting(t)){return i.escapeWithDoubleQuotes(t)}if(i.requiresSingleQuoting(t)){return i.escapeWithSingleQuotes(t)}if(""===t){return'""'}if(e.PATTERN_DATE.test(t)){return"'"+t+"'"}if((l=t.toLowerCase())==="null"||l==="~"||l==="true"||l==="false"){return"'"+t+"'"}return t};n.dumpObject=function(t,u,s){var r,e,n,i,l;if(s==null){s=null}if(t instanceof Array){e=[];for(i=0,l=t.length;i<l;i++){n=t[i];e.push(this.dump(n))}return"["+e.join(", ")+"]"}else{e=[];for(r in t){n=t[r];e.push(this.dump(r)+": "+this.dump(n))}return"{"+e.join(", ")+"}"}};n.parseScalar=function(u,a,c,s,h){var i,f,_,n,o,p,T,A,E;if(a==null){a=null}if(c==null){c=['"',"'"]}if(s==null){s=null}if(h==null){h=true}if(s==null){s={exceptionOnInvalidType:this.settings.exceptionOnInvalidType,objectDecoder:this.settings.objectDecoder,i:0}}i=s.i;if(A=u.charAt(i),l.call(c,A)>=0){n=this.parseQuotedScalar(u,s);i=s.i;if(a!=null){T=e.ltrim(u.slice(i)," ");if(!(E=T.charAt(0),l.call(a,E)>=0)){throw new t("Unexpected characters ("+u.slice(i)+").")}}}else{if(!a){n=u.slice(i);i+=n.length;p=n.indexOf(" #");if(p!==-1){n=e.rtrim(n.slice(0,p))}}else{f=a.join("|");o=this.PATTERN_SCALAR_BY_DELIMITERS[f];if(o==null){o=new r("^(.+?)("+f+")");this.PATTERN_SCALAR_BY_DELIMITERS[f]=o}if(_=o.exec(u.slice(i))){n=_[1];i+=n.length}else{throw new t("Malformed inline YAML string ("+u+").")}}if(h){n=this.evaluateScalar(n,s)}}s.i=i;return n};n.parseQuotedScalar=function(r,l){var e,i,n;e=l.i;if(!(i=this.PATTERN_QUOTED_SCALAR.exec(r.slice(e)))){throw new t("Malformed inline YAML string ("+r.slice(e)+").")}n=i[0].substr(1,i[0].length-2);if('"'===r.charAt(e)){n=s.unescapeDoubleQuotedString(n)}else{n=s.unescapeSingleQuotedString(n)}e+=i[0].length;l.i=e;return n};n.parseSequence=function(i,n){var o,e,l,u,s,r,a;s=[];u=i.length;e=n.i;e+=1;while(e<u){n.i=e;switch(i.charAt(e)){case"[":s.push(this.parseSequence(i,n));e=n.i;break;case"{":s.push(this.parseMapping(i,n));e=n.i;break;case"]":return s;case",":case" ":case"\n":break;default:l=(a=i.charAt(e))==='"'||a==="'";r=this.parseScalar(i,[",","]"],['"',"'"],n);e=n.i;if(!l&&typeof r==="string"&&(r.indexOf(": ")!==-1||r.indexOf(":\n")!==-1)){try{r=this.parseMapping("{"+r+"}")}catch(f){o=f}}s.push(r);--e}++e}throw new t("Malformed inline YAML string "+i)};n.parseMapping=function(i,n){var f,l,e,s,o,r,a,u;r={};o=i.length;e=n.i;e+=1;a=false;while(e<o){n.i=e;switch(i.charAt(e)){case" ":case",":case"\n":++e;n.i=e;a=true;break;case"}":return r}if(a){a=false;continue}s=this.parseScalar(i,[":"," ","\n"],['"',"'"],n,false);e=n.i;l=false;while(e<o){n.i=e;switch(i.charAt(e)){case"[":u=this.parseSequence(i,n);e=n.i;if(r[s]===void 0){r[s]=u}l=true;break;case"{":f=this.parseMapping(i,n);e=n.i;if(r[s]===void 0){r[s]=u}l=true;break;case":":case" ":case"\n":break;default:u=this.parseScalar(i,[",","}"],['"',"'"],n);e=n.i;if(r[s]===void 0){r[s]=u}l=true;--e}++e;if(l){break}}}throw new t("Malformed inline YAML string "+i)};n.evaluateScalar=function(n,a){var s,h,p,E,i,c,o,r,l,f,u;n=e.trim(n);l=n.toLowerCase();switch(l){case"null":case"":case"~":return null;case"true":return true;case"false":return false;case".inf":return Infinity;case".nan":return NaN;case"-.inf":return Infinity;default:E=l.charAt(0);switch(E){case"!":i=n.indexOf(" ");if(i===-1){c=l}else{c=l.slice(0,i)}switch(c){case"!":if(i!==-1){return parseInt(this.parseScalar(n.slice(2)))}return null;case"!str":return e.ltrim(n.slice(4));case"!!str":return e.ltrim(n.slice(5));case"!!int":return parseInt(this.parseScalar(n.slice(5)));case"!!bool":return e.parseBoolean(this.parseScalar(n.slice(6)),false);case"!!float":return parseFloat(this.parseScalar(n.slice(7)));case"!!timestamp":return e.stringToDate(e.ltrim(n.slice(11)));default:if(a==null){a={exceptionOnInvalidType:this.settings.exceptionOnInvalidType,objectDecoder:this.settings.objectDecoder,i:0}}o=a.objectDecoder,p=a.exceptionOnInvalidType;if(o){u=e.rtrim(n);i=u.indexOf(" ");if(i===-1){return o(u,null)}else{f=e.ltrim(u.slice(i+1));if(!(f.length>0)){f=null}return o(u.slice(0,i),f)}}if(p){throw new t("Custom object support when parsing a YAML file has been disabled.")}return null}break;case"0":if("0x"===n.slice(0,2)){return e.hexDec(n)}else if(e.isDigits(n)){return e.octDec(n)}else if(e.isNumeric(n)){return parseFloat(n)}else{return n}break;case"+":if(e.isDigits(n)){r=n;s=parseInt(r);if(r===String(s)){return s}else{return r}}else if(e.isNumeric(n)){return parseFloat(n)}else if(this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(n)){return parseFloat(n.replace(",",""))}return n;case"-":if(e.isDigits(n.slice(1))){if("0"===n.charAt(1)){return-e.octDec(n.slice(1))}else{r=n.slice(1);s=parseInt(r);if(r===String(s)){return-s}else{return-r}}}else if(e.isNumeric(n)){return parseFloat(n)}else if(this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(n)){return parseFloat(n.replace(",",""))}return n;default:if(h=e.stringToDate(n)){return h}else if(e.isNumeric(n)){return parseFloat(n)}else if(this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(n)){return parseFloat(n.replace(",",""))}return n}}};return n}();a.exports=u},{"./Escaper":2,"./Exception/DumpException":3,"./Exception/ParseException":4,"./Pattern":7,"./Unescaper":8,"./Utils":9}],6:[function(r,l,u){var i,n,s,t,e;i=r("./Inline");t=r("./Pattern");e=r("./Utils");n=r("./Exception/ParseException");s=function(){r.prototype.PATTERN_FOLDED_SCALAR_ALL=new t("^(?:(?<type>![^\\|>]*)\\s+)?(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$");r.prototype.PATTERN_FOLDED_SCALAR_END=new t("(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$");r.prototype.PATTERN_SEQUENCE_ITEM=new t("^\\-((?<leadspaces>\\s+)(?<value>.+?))?\\s*$");r.prototype.PATTERN_ANCHOR_VALUE=new t("^&(?<ref>[^ ]+) *(?<value>.*)");r.prototype.PATTERN_COMPACT_NOTATION=new t("^(?<key>"+i.REGEX_QUOTED_STRING+"|[^ '\"\\{\\[].*?) *\\:(\\s+(?<value>.+?))?\\s*$");r.prototype.PATTERN_MAPPING_ITEM=new t("^(?<key>"+i.REGEX_QUOTED_STRING+"|[^ '\"\\[\\{].*?) *\\:(\\s+(?<value>.+?))?\\s*$");r.prototype.PATTERN_DECIMAL=new t("\\d+");r.prototype.PATTERN_INDENT_SPACES=new t("^ +");r.prototype.PATTERN_TRAILING_LINES=new t("(\n*)$");r.prototype.PATTERN_YAML_HEADER=new t("^\\%YAML[: ][\\d\\.]+.*\n");r.prototype.PATTERN_LEADING_COMMENTS=new t("^(\\#.*?\n)+");r.prototype.PATTERN_DOCUMENT_MARKER_START=new t("^\\-\\-\\-.*?\n");r.prototype.PATTERN_DOCUMENT_MARKER_END=new t("^\\.\\.\\.\\s*$");r.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION={};r.prototype.CONTEXT_NONE=0;r.prototype.CONTEXT_SEQUENCE=1;r.prototype.CONTEXT_MAPPING=2;function r(e){this.offset=e!=null?e:0;this.lines=[];this.currentLineNb=-1;this.currentLine="";this.refs={}}r.prototype.parse=function(l,f,c){var O,N,b,h,d,t,o,R,p,X,L,S,u,w,P,A,v,T,E,a,x,_,C,s,m,I,y,g,M,G,U,Y,F,k,H,j;if(f==null){f=false}if(c==null){c=null}this.currentLineNb=-1;this.currentLine="";this.lines=this.cleanup(l).split("\n");t=null;d=this.CONTEXT_NONE;N=false;while(this.moveToNextLine()){if(this.isCurrentLineEmpty()){continue}if("	"===this.currentLine[0]){throw new n("A YAML file cannot contain tabs as indentation.",this.getRealCurrentLineNb()+1,this.currentLine)}L=v=false;if(s=this.PATTERN_SEQUENCE_ITEM.exec(this.currentLine)){if(this.CONTEXT_MAPPING===d){throw new n("You cannot define a sequence item when in a mapping")}d=this.CONTEXT_SEQUENCE;if(t==null){t=[]}if(s.value!=null&&(A=this.PATTERN_ANCHOR_VALUE.exec(s.value))){L=A.ref;s.value=A.value}if(!(s.value!=null)||""===e.trim(s.value," ")||e.ltrim(s.value," ").indexOf("#")===0){if(this.currentLineNb<this.lines.length-1&&!this.isNextLineUnIndentedCollection()){h=this.getRealCurrentLineNb()+1;a=new r(h);a.refs=this.refs;t.push(a.parse(this.getNextEmbedBlock(null,true),f,c))}else{t.push(null)}}else{if(((k=s.leadspaces)!=null?k.length:void 0)&&(A=this.PATTERN_COMPACT_NOTATION.exec(s.value))){h=this.getRealCurrentLineNb();a=new r(h);a.refs=this.refs;b=s.value;X=this.getCurrentLineIndentation();if(this.isNextLineIndented(false)){b+="\n"+this.getNextEmbedBlock(X+s.leadspaces.length+1,true)}t.push(a.parse(b,f,c))}else{t.push(this.parseValue(s.value,f,c))}}}else if((s=this.PATTERN_MAPPING_ITEM.exec(this.currentLine))&&s.key.indexOf(" #")===-1){if(this.CONTEXT_SEQUENCE===d){throw new n("You cannot define a mapping item when in a sequence")}d=this.CONTEXT_MAPPING;if(t==null){t={}}i.configure(f,c);try{u=i.parseScalar(s.key)}catch(D){o=D;o.parsedLine=this.getRealCurrentLineNb()+1;o.snippet=this.currentLine;throw o}if("<<"===u){v=true;N=true;if(((H=s.value)!=null?H.indexOf("*"):void 0)===0){x=s.value.slice(1);if(this.refs[x]==null){throw new n('Reference "'+x+'" does not exist.',this.getRealCurrentLineNb()+1,this.currentLine)}_=this.refs[x];if(typeof _!=="object"){throw new n("YAML merge keys used with a scalar value instead of an object.",this.getRealCurrentLineNb()+1,this.currentLine)}if(_ instanceof Array){for(p=m=0,M=_.length;m<M;p=++m){l=_[p];if(t[F=String(p)]==null){t[F]=l}}}else{for(u in _){l=_[u];if(t[u]==null){t[u]=l}}}}else{if(s.value!=null&&s.value!==""){l=s.value}else{l=this.getNextEmbedBlock()}h=this.getRealCurrentLineNb()+1;a=new r(h);a.refs=this.refs;T=a.parse(l,f);if(typeof T!=="object"){throw new n("YAML merge keys used with a scalar value instead of an object.",this.getRealCurrentLineNb()+1,this.currentLine)}if(T instanceof Array){for(I=0,G=T.length;I<G;I++){E=T[I];if(typeof E!=="object"){throw new n("Merge items must be objects.",this.getRealCurrentLineNb()+1,E)}if(E instanceof Array){for(p=y=0,U=E.length;y<U;p=++y){l=E[p];S=String(p);if(!t.hasOwnProperty(S)){t[S]=l}}}else{for(u in E){l=E[u];if(!t.hasOwnProperty(u)){t[u]=l}}}}}else{for(u in T){l=T[u];if(!t.hasOwnProperty(u)){t[u]=l}}}}}else if(s.value!=null&&(A=this.PATTERN_ANCHOR_VALUE.exec(s.value))){L=A.ref;s.value=A.value}if(v){}else if(!(s.value!=null)||""===e.trim(s.value," ")||e.ltrim(s.value," ").indexOf("#")===0){if(!this.isNextLineIndented()&&!this.isNextLineUnIndentedCollection()){if(N||t[u]===void 0){t[u]=null}}else{h=this.getRealCurrentLineNb()+1;a=new r(h);a.refs=this.refs;C=a.parse(this.getNextEmbedBlock(),f,c);if(N||t[u]===void 0){t[u]=C}}}else{C=this.parseValue(s.value,f,c);if(N||t[u]===void 0){t[u]=C}}}else{P=this.lines.length;if(1===P||2===P&&e.isEmpty(this.lines[1])){try{l=i.parse(this.lines[0],f,c)}catch(D){o=D;o.parsedLine=this.getRealCurrentLineNb()+1;o.snippet=this.currentLine;throw o}if(typeof l==="object"){if(l instanceof Array){R=l[0]}else{for(u in l){R=l[u];break}}if(typeof R==="string"&&R.indexOf("*")===0){t=[];for(g=0,Y=l.length;g<Y;g++){O=l[g];t.push(this.refs[O.slice(1)])}l=t}}return l}else if((j=e.ltrim(l).charAt(0))==="["||j==="{"){try{return i.parse(l,f,c)}catch(D){o=D;o.parsedLine=this.getRealCurrentLineNb()+1;o.snippet=this.currentLine;throw o}}throw new n("Unable to parse.",this.getRealCurrentLineNb()+1,this.currentLine)}if(L){if(t instanceof Array){this.refs[L]=t[t.length-1]}else{w=null;for(u in t){w=u}this.refs[L]=t[w]}}}if(e.isEmpty(t)){return null}else{return t}};r.prototype.getRealCurrentLineNb=function(){return this.currentLineNb+this.offset};r.prototype.getCurrentLineIndentation=function(){return this.currentLine.length-e.ltrim(this.currentLine," ").length};r.prototype.getNextEmbedBlock=function(i,s){var r,t,a,e,l,u,o;if(i==null){i=null}if(s==null){s=false}this.moveToNextLine();if(i==null){e=this.getCurrentLineIndentation();o=this.isStringUnIndentedCollectionItem(this.currentLine);if(!this.isCurrentLineEmpty()&&0===e&&!o){throw new n("Indentation problem.",this.getRealCurrentLineNb()+1,this.currentLine)}}else{e=i}r=[this.currentLine.slice(e)];if(!s){a=this.isStringUnIndentedCollectionItem(this.currentLine)}u=this.PATTERN_FOLDED_SCALAR_END;l=!u.test(this.currentLine);while(this.moveToNextLine()){t=this.getCurrentLineIndentation();if(t===e){l=!u.test(this.currentLine)}if(a&&!this.isStringUnIndentedCollectionItem(this.currentLine)&&t===e){this.moveToPreviousLine();break}if(this.isCurrentLineBlank()){r.push(this.currentLine.slice(e));continue}if(l&&this.isCurrentLineComment()){if(t===e){continue}}if(t>=e){r.push(this.currentLine.slice(e))}else if(0===t){this.moveToPreviousLine();break}else{throw new n("Indentation problem.",this.getRealCurrentLineNb()+1,this.currentLine)}}return r.join("\n")};r.prototype.moveToNextLine=function(){if(this.currentLineNb>=this.lines.length-1){return false}this.currentLine=this.lines[++this.currentLineNb];return true};r.prototype.moveToPreviousLine=function(){this.currentLine=this.lines[--this.currentLineNb]};r.prototype.parseValue=function(e,a,l){var t,s,r,u,o,f,c,h;if(0===e.indexOf("*")){o=e.indexOf("#");if(o!==-1){e=e.substr(1,o-2)}else{e=e.slice(1)}if(this.refs[e]===void 0){throw new n('Reference "'+e+'" does not exist.',this.currentLine)}return this.refs[e]}if(r=this.PATTERN_FOLDED_SCALAR_ALL.exec(e)){u=(c=r.modifiers)!=null?c:"";s=Math.abs(parseInt(u));if(isNaN(s)){s=0}f=this.parseFoldedScalar(r.separator,this.PATTERN_DECIMAL.replace(u,""),s);if(r.type!=null){i.configure(a,l);return i.parseScalar(r.type+" "+f)}else{return f}}try{return i.parse(e,a,l)}catch(p){t=p;if(((h=e.charAt(0))==="["||h==="{")&&t instanceof n&&this.isNextLineIndented()){e+="\n"+this.getNextEmbedBlock();try{return i.parse(e,a,l)}catch(p){t=p;t.parsedLine=this.getRealCurrentLineNb()+1;t.snippet=this.currentLine;throw t}}else{t.parsedLine=this.getRealCurrentLineNb()+1;t.snippet=this.currentLine;throw t}}};r.prototype.parseFoldedScalar=function(T,o,i){var l,a,c,u,s,f,n,h,E,p;if(o==null){o=""}if(i==null){i=0}s=this.moveToNextLine();if(!s){return""}l=this.isCurrentLineBlank();n="";while(s&&l){if(s=this.moveToNextLine()){n+="\n";l=this.isCurrentLineBlank()}}if(0===i){if(c=this.PATTERN_INDENT_SPACES.exec(this.currentLine)){i=c[0].length}}if(i>0){f=this.PATTERN_FOLDED_SCALAR_BY_INDENTATION[i];if(f==null){f=new t("^ {"+i+"}(.*)$");r.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION[i]=f}while(s&&(l||(c=f.exec(this.currentLine)))){if(l){n+=this.currentLine.slice(i)}else{n+=c[1]}if(s=this.moveToNextLine()){n+="\n";l=this.isCurrentLineBlank()}}}else if(s){n+="\n"}if(s){this.moveToPreviousLine()}if(">"===T){u="";p=n.split("\n");for(h=0,E=p.length;h<E;h++){a=p[h];if(a.length===0||a.charAt(0)===" "){u=e.rtrim(u," ")+a+"\n"}else{u+=a+" "}}n=u}if("+"!==o){n=e.rtrim(n)}if(""===o){n=this.PATTERN_TRAILING_LINES.replace(n,"\n")}else if("-"===o){n=this.PATTERN_TRAILING_LINES.replace(n,"")}return n};r.prototype.isNextLineIndented=function(t){var e,i,n;if(t==null){t=true}i=this.getCurrentLineIndentation();e=!this.moveToNextLine();if(t){while(!e&&this.isCurrentLineEmpty()){e=!this.moveToNextLine()}}else{while(!e&&this.isCurrentLineBlank()){e=!this.moveToNextLine()}}if(e){return false}n=false;if(this.getCurrentLineIndentation()>i){n=true}this.moveToPreviousLine();return n};r.prototype.isCurrentLineEmpty=function(){var t;t=e.trim(this.currentLine," ");return t.length===0||t.charAt(0)==="#"};r.prototype.isCurrentLineBlank=function(){return""===e.trim(this.currentLine," ")};r.prototype.isCurrentLineComment=function(){var t;t=e.ltrim(this.currentLine," ");return t.charAt(0)==="#"};r.prototype.cleanup=function(t){var n,i,r,s,l;if(t.indexOf("\r")!==-1){t=t.split("\r\n").join("\n").split("\r").join("\n")}n=0;r=this.PATTERN_YAML_HEADER.replaceAll(t,""),t=r[0],n=r[1];this.offset+=n;s=this.PATTERN_LEADING_COMMENTS.replaceAll(t,"",1),i=s[0],n=s[1];if(n===1){this.offset+=e.subStrCount(t,"\n")-e.subStrCount(i,"\n");t=i}l=this.PATTERN_DOCUMENT_MARKER_START.replaceAll(t,"",1),i=l[0],n=l[1];if(n===1){this.offset+=e.subStrCount(t,"\n")-e.subStrCount(i,"\n");t=i;t=this.PATTERN_DOCUMENT_MARKER_END.replace(t,"")}return t};r.prototype.isNextLineUnIndentedCollection=function(e){var t,n;if(e==null){e=null}if(e==null){e=this.getCurrentLineIndentation()}t=this.moveToNextLine();while(t&&this.isCurrentLineEmpty()){t=this.moveToNextLine()}if(false===t){return false}n=false;if(this.getCurrentLineIndentation()===e&&this.isStringUnIndentedCollectionItem(this.currentLine)){n=true}this.moveToPreviousLine();return n};r.prototype.isStringUnIndentedCollectionItem=function(){return this.currentLine==="-"||this.currentLine.slice(0,2)==="- "};return r}();l.exports=s},{"./Exception/ParseException":4,"./Inline":5,"./Pattern":7,"./Utils":9}],7:[function(n,t,i){var e;e=function(){e.prototype.regex=null;e.prototype.rawRegex=null;e.prototype.cleanedRegex=null;e.prototype.mapping=null;function e(n,o){var s,i,t,e,l,r,u,a,f;if(o==null){o=""}t="";l=n.length;r=null;s=0;e=0;while(e<l){i=n.charAt(e);if(i==="\\"){t+=n.slice(e,+(e+1)+1||9e9);e++}else if(i==="("){if(e<l-2){a=n.slice(e,+(e+2)+1||9e9);if(a==="(?:"){e+=2;t+=a}else if(a==="(?<"){s++;e+=2;u="";while(e+1<l){f=n.charAt(e+1);if(f===">"){t+="(";e++;if(u.length>0){if(r==null){r={}}r[u]=s}break}else{u+=f}e++}}else{t+=i;s++}}else{t+=i}}else{t+=i}e++}this.rawRegex=n;this.cleanedRegex=t;this.regex=new RegExp(this.cleanedRegex,"g"+o.replace("g",""));this.mapping=r}e.prototype.exec=function(r){var i,e,t,n;this.regex.lastIndex=0;e=this.regex.exec(r);if(e==null){return null}if(this.mapping!=null){n=this.mapping;for(t in n){i=n[t];e[t]=e[i]}}return e};e.prototype.test=function(e){this.regex.lastIndex=0;return this.regex.test(e)};e.prototype.replace=function(e,t){this.regex.lastIndex=0;return e.replace(this.regex,t)};e.prototype.replaceAll=function(e,i,t){var n;if(t==null){t=0}this.regex.lastIndex=0;n=0;while(this.regex.test(e)&&(t===0||n<t)){this.regex.lastIndex=0;e=e.replace(this.regex,"");n++}return[e,n]};return e}();t.exports=e},{}],8:[function(t,r,s){var n,i,e;e=t("./Utils");n=t("./Pattern");i=function(){function t(){}t.PATTERN_ESCAPED_CHARACTER=new n('\\\\([0abt	nvfre "\\/\\\\N_LP]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})');t.unescapeSingleQuotedString=function(e){return e.replace("''","'")};t.unescapeDoubleQuotedString=function(e){if(this._unescapeCallback==null){this._unescapeCallback=function(e){return function(t){return e.unescapeCharacter(t)}}(this)}return this.PATTERN_ESCAPED_CHARACTER.replace(e,this._unescapeCallback)};t.unescapeCharacter=function(n){var t;t=String.fromCharCode;switch(n.charAt(1)){case"0":return t(0);case"a":return t(7);case"b":return t(8);case"t":return"	";case"	":return"	";case"n":return"\n";case"v":return t(11);case"f":return t(12);case"r":return t(13);case"e":return t(27);case" ":return" ";case'"':return'"';case"/":return"/";case"\\":return"\\";case"N":return t(133);case"_":return t(160);case"L":return t(8232);case"P":return t(8233);case"x":return e.utf8chr(e.hexDec(n.substr(2,2)));case"u":return e.utf8chr(e.hexDec(n.substr(2,4)));case"U":return e.utf8chr(e.hexDec(n.substr(2,8)));default:return""}};return t}();r.exports=i},{"./Pattern":7,"./Utils":9}],9:[function(e,i,r){var t,n;t=e("./Pattern");n=function(){function n(){}n.REGEX_LEFT_TRIM_BY_CHAR={};n.REGEX_RIGHT_TRIM_BY_CHAR={};n.REGEX_SPACES=/\s+/g;n.REGEX_DIGITS=/^\d+$/;n.REGEX_OCTAL=/[^0-7]/gi;n.REGEX_HEXADECIMAL=/[^a-f0-9]/gi;n.PATTERN_DATE=new t("^"+"(?<year>[0-9][0-9][0-9][0-9])"+"-(?<month>[0-9][0-9]?)"+"-(?<day>[0-9][0-9]?)"+"(?:(?:[Tt]|[ 	]+)"+"(?<hour>[0-9][0-9]?)"+":(?<minute>[0-9][0-9])"+":(?<second>[0-9][0-9])"+"(?:.(?<fraction>[0-9]*))?"+"(?:[ 	]*(?<tz>Z|(?<tz_sign>[-+])(?<tz_hour>[0-9][0-9]?)"+"(?::(?<tz_minute>[0-9][0-9]))?))?)?"+"$","i");n.LOCAL_TIMEZONE_OFFSET=(new Date).getTimezoneOffset()*60*1e3;n.trim=function(i,e){var t,n;if(e==null){e="\\s"}return i.trim();t=this.REGEX_LEFT_TRIM_BY_CHAR[e];if(t==null){this.REGEX_LEFT_TRIM_BY_CHAR[e]=t=new RegExp("^"+e+""+e+"*")}t.lastIndex=0;n=this.REGEX_RIGHT_TRIM_BY_CHAR[e];if(n==null){this.REGEX_RIGHT_TRIM_BY_CHAR[e]=n=new RegExp(e+""+e+"*$")}n.lastIndex=0;return i.replace(t,"").replace(n,"")};n.ltrim=function(n,e){var t;if(e==null){e="\\s"}t=this.REGEX_LEFT_TRIM_BY_CHAR[e];if(t==null){this.REGEX_LEFT_TRIM_BY_CHAR[e]=t=new RegExp("^"+e+""+e+"*")}t.lastIndex=0;return n.replace(t,"")};n.rtrim=function(n,e){var t;if(e==null){e="\\s"}t=this.REGEX_RIGHT_TRIM_BY_CHAR[e];if(t==null){this.REGEX_RIGHT_TRIM_BY_CHAR[e]=t=new RegExp(e+""+e+"*$")}t.lastIndex=0;return n.replace(t,"")};n.isEmpty=function(e){return!e||e===""||e==="0"};n.subStrCount=function(e,i,u,a){var s,r,t,l,n;s=0;e=""+e;i=""+i;if(u!=null){e=e.slice(u)}if(a!=null){e=e.slice(0,a)}t=e.length;l=i.length;for(r=n=0;0<=t?n<t:n>t;r=0<=t?++n:--n){if(i===e.slice(r,l)){s++;r+=l-1}}return s};n.isDigits=function(e){this.REGEX_DIGITS.lastIndex=0;return this.REGEX_DIGITS.test(e)};n.octDec=function(e){this.REGEX_OCTAL.lastIndex=0;return parseInt((e+"").replace(this.REGEX_OCTAL,""),8)};n.hexDec=function(e){this.REGEX_HEXADECIMAL.lastIndex=0;e=this.trim(e);if((e+"").slice(0,2)==="0x"){e=(e+"").slice(2)}return parseInt((e+"").replace(this.REGEX_HEXADECIMAL,""),16)};n.utf8chr=function(e){var t;t=String.fromCharCode;if(128>(e%=2097152)){return t(e)}if(2048>e){return t(192|e>>6)+t(128|e&63)}if(65536>e){return t(224|e>>12)+t(128|e>>6&63)+t(128|e&63)}return t(240|e>>18)+t(128|e>>12&63)+t(128|e>>6&63)+t(128|e&63)};n.parseBoolean=function(t,n){var e;if(n==null){n=true}if(typeof t==="string"){e=t.toLowerCase();if(!n){if(e==="no"){return false}}if(e==="0"){return false}if(e==="false"){return false}if(e===""){return false}return true}return!!t};n.isNumeric=function(e){this.REGEX_SPACES.lastIndex=0;return typeof e==="number"||typeof e==="string"&&!isNaN(e)&&e.replace(this.REGEX_SPACES,"")!==""};n.stringToDate=function(r){var n,l,t,c,e,h,u,f,o,a,i,s;if(!(r!=null?r.length:void 0)){return null}e=this.PATTERN_DATE.exec(r);if(!e){return null}s=parseInt(e.year,10);u=parseInt(e.month,10)-1;l=parseInt(e.day,10);if(e.hour==null){n=new Date(Date.UTC(s,u,l));return n}c=parseInt(e.hour,10);h=parseInt(e.minute,10);f=parseInt(e.second,10);if(e.fraction!=null){t=e.fraction.slice(0,3);while(t.length<3){t+="0"}t=parseInt(t,10)}else{t=0}if(e.tz!=null){o=parseInt(e.tz_hour,10);if(e.tz_minute!=null){a=parseInt(e.tz_minute,10)}else{a=0}i=(o*60+a)*6e4;if("-"===e.tz_sign){i*=-1}}n=new Date(Date.UTC(s,u,l,c,h,f,t));if(i){n.setTime(n.getTime()+i)}return n};n.strRepeat=function(n,i){var e,t;t="";e=0;while(e<i){t+=n;e++}return t};n.getStringFromFile=function(i,n){var s,l,f,a,t,r,o,u;if(n==null){n=null}t=null;if(typeof window!=="undefined"&&window!==null){if(window.XMLHttpRequest){t=new XMLHttpRequest}else if(window.ActiveXObject){u=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(r=0,o=u.length;r<o;r++){f=u[r];try{t=new ActiveXObject(f)}catch(c){}}}}if(t!=null){if(n!=null){t.onreadystatechange=function(){if(t.readyState===4){if(t.status===200||t.status===0){return n(t.responseText)}else{return n(null)}}};t.open("GET",i,true);return t.send(null)}else{t.open("GET",i,false);t.send(null);if(t.status===200||t.status===0){return t.responseText}return null}}else{a=e;l=a("fs");if(n!=null){return l.readFile(i,function(e,t){if(e){return n(null)}else{return n(String(t))}})}else{s=l.readFileSync(i);if(s!=null){return String(s)}return null}}};return n}();i.exports=n},{"./Pattern":7}],10:[function(e,s,l){var i,r,t,n;r=e("./Parser");i=e("./Dumper");t=e("./Utils");n=function(){function n(){}n.parse=function(n,e,t){if(e==null){e=false}if(t==null){t=null}return(new r).parse(n,e,t)};n.parseFile=function(s,e,n,i){var r;if(e==null){e=null}if(n==null){n=false}if(i==null){i=null}if(e!=null){return t.getStringFromFile(s,function(t){return function(s){var r;r=null;if(s!=null){r=t.parse(s,n,i)}e(r)}}(this))}else{r=t.getStringFromFile(s);if(r!=null){return this.parse(r,n,i)}return null}};n.dump=function(l,e,t,n,r){var s;if(e==null){e=2}if(t==null){t=4}if(n==null){n=false}if(r==null){r=null}s=new i;s.indentation=t;return s.dump(l,e,0,n,r)};n.register=function(){var t;t=function(e,t){return e.exports=YAML.parseFile(t)};if((typeof e!=="undefined"&&e!==null?e.extensions:void 0)!=null){e.extensions[".yml"]=t;return e.extensions[".yaml"]=t}};n.stringify=function(e,t,n,i,r){return this.dump(e,t,n,i,r)};n.load=function(e,t,n,i){return this.parseFile(e,t,n,i)};return n}();if(typeof window!=="undefined"&&window!==null){window.YAML=n}s.exports=n},{"./Dumper":1,"./Parser":6,"./Utils":9}]},{},[10]);