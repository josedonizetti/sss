%{
  var nodes = require('./nodes')
%}

%%

//Parsing starts here
stylesheet:
  statements EOF                  { return new nodes.StyleSheet($1) }
;

statements:
  /* empty */                          { $$ = [] }
| statementGroup                     { $$ = $1 }
| statements ';' statementGroup    { $$ = $1.concat($3) }
| statements ';'                     { $$ = $1 }
;

statementGroup:
  statement       { $$ = [$1] }
| rules
| rules statement { $$ = $1.concat($2) }
;

statement:
  variableDeclaration
;

rules:
  rule                    { $$ = [$1] }
| rules rule              { $$ = $1.concat($2) }
;

rule:
  selector '{' declarations '}' { $$ = new nodes.Rule($1, $3) }
;

selector:
  IDENTIFIER
| SELECTOR
;

declarations:
  /* empty */                          { $$ = [] }
| declarationGroup                     { $$ = $1 }
| declarations ';' declarationGroup    { $$ = $1.concat($3) }
| declarations ';'                     { $$ = $1 }
;

declarationGroup:
  declaration       { $$ = [$1]}
| rules
| rules property { $$ = $1.concat($2) }
;

declaration:
  property
| variableDeclaration
;

variableDeclaration:
  VARIABLE ':' values    {$$ = new nodes.Assign($1, $3)}
;

property:
  IDENTIFIER ':' values      { $$ = new nodes.Property($1, $3) }
;

values:
  value                      { $$ = [$1] }
| values value               { $$ = $1.concat($2) }
;

value:
  IDENTIFIER                 { $$ = new nodes.Literal($1) }
| COLOR                      { $$ = new nodes.Literal($1) }
| NUMBER                     { $$ = new nodes.Literal($1) }
| DIMENSION                  { $$ = new nodes.Literal($1) }
| VARIABLE                   { $$ = new nodes.Variable($1) }
;
