(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{772:function(e,n){e.exports=function(e){var n={keyword:"break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",literal:"true false iota nil",built_in:"append cap close complex copy imag len make new panic print println real recover delete"};return{aliases:["golang"],keywords:n,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,{begin:"'",end:"[^\\\\]'"},{begin:"`",end:"`"}]},{className:"number",variants:[{begin:e.C_NUMBER_RE+"[i]",relevance:1},e.C_NUMBER_MODE]},{begin:/:=/},{className:"function",beginKeywords:"func",end:/\s*\{/,excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,keywords:n,illegal:/["']/}]}]}}}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_highlight_go-fa9e14fe96cb91a2de38.js.map