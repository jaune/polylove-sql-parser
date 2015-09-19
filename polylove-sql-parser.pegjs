Start
 = "SELECT" _ columns:Columns _ "FROM" _ from:From _ "WHERE" _ where:WhereExpression _ "ORDER" _ "BY" _ orderBy:OrderByExpression { return { columns: columns, from: from, where: where, orderBy: orderBy }; }
 / "SELECT" _ columns:Columns _ "FROM" _ from:From _ "WHERE" _ where:WhereExpression { return { columns: columns, from: from, where: where, orderBy: [] }; }
 / "SELECT" _ columns:Columns _ "FROM" _ from:From { return { columns: columns, from: from, where: [], orderBy: [] }; }

OrderByExpression 
 = begin:OrderByColumn _? "," _? end:OrderByExpression  { return [begin].concat(end); }
 / e:OrderByColumn                                      { return [e]; }


OrderByColumn
 = name:ColumnName _ d:OrderByDirection { return name.concat([d]); }
 / name:ColumnName

OrderByDirection
 = "DESC" / "ASC" / Value

WhereExpression
 = a:WhereExpressionColumn _ "AND" _ b:WhereExpression { return ['and', a, b]; }
 / a:WhereExpressionColumn _ "OR" _ b:WhereExpression { return ['or', a, b]; }
 / WhereExpressionColumn

WhereExpressionColumn
 = name:ColumnName _? "=" _? value:Value { return ['=', name, value]; }
 / value:Value _? "=" _? name:ColumnName { return ['=', name, value]; }

Value
 = "{{" name:Name "}}" { return { type: 'property', name: name }; }
 / ":" name:Name { return { type: 'constant', name: name }; }

Columns "columns"
 = AliasedColumnName _? "," _? Columns
 / AliasedColumnName
 / "*" {return ['*']}

AliasedColumnName
 = ColumnName _ "AS" _ Name
 / ColumnName _ Name
 / ColumnName 

ColumnName
 = begin:Name _? "." _? end:Name { return [begin].concat(end); }
 / name:Name { return [name]; }

From
 = begin:AliasedName _? "," _? end:From    { return [begin].concat(end); }
 / name:AliasedName                        { return [name]; }

AliasedName
 = name:Name _ "AS" _ alias:Name    { return [name, alias]; }
 / name:Name _ alias:Name           { return [name, alias]; }
 / name:Name                        { return [name, name]; }

Keyword = "WHERE" / "FROM"

Name
 = ! Keyword begin:[a-zA-z_] end:[a-zA-Z0-9_]*            { return begin + end.join(''); }

WhiteSpace 
 = ' '
 / '\n'
 / '\r'
 / '\t'

_ "whitespaces"
 = WhiteSpace+ { return null; }