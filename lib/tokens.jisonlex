//// Macros
DIGIT       [0-9]
NUMBER      {DIGIT}+(\.{DIGIT}+)?
NAME        [a-zA-Z][\w\-]*
SELECTOR    (\.|\#|\:\:|\:){NAME}

%%

//// Rules
\s+                                   //ignore all spaces, line breaks, and tabs

//Numbers
{NUMBER}(px|em|\%) return 'DIMENSION' // 10px, 1em, 50%
{NUMBER}           return 'NUMBER'    // 0
\#[0-9A-Fa-f]{3,6} return 'COLOR'     // #fff, #f0f0f0

//Selectors
{SELECTOR}         return 'SELECTOR' // .class, #id
{NAME}{SELECTOR}   return 'SELECTOR' // h1.class, body#id

\@{NAME}           return 'VARIABLE'

{NAME}             return 'IDENTIFIER' //body, font-size

.                  return yytext  // {, }, +, :, ;

<<EOF>>            return 'EOF'
