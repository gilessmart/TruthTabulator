(function () {

    function getTruthTable (expression) {
        var identifiers;

        function getUniqueIdentifiers () {
            var identifiers = expression.match(/[a-zA-Z_$][0-9a-zA-Z_$]*/g),
                uniqueIdentifiers = [];

            identifiers.forEach(function (identifier) {
                if (!uniqueIdentifiers.some(function (uniqueIdentifier) {
                    return uniqueIdentifier === identifier;
                })) {
                    uniqueIdentifiers.push(identifier);
                }
            });

            return uniqueIdentifiers;
        }

        function getRows () {
            var rowCount = Math.pow(2, identifiers.length),
                i = 0,
                rows = [];

            for (; i < rowCount; i++) {
                rows.push(getRow(i));
            }

            return rows;
        }

        function getRow (rowIndex) {
            var inputs,
                binaryString = padLeft(rowIndex.toString(2), identifiers.length, '0');

            inputs = identifiers.map(function (identifier, identifierIndex) {
                var binaryChar = binaryString.charAt(identifierIndex);
                return {
                    name: identifier,
                    value: !!parseInt(binaryChar)
                };
            });

            return {
                inputs: inputs,
                result: getResult(inputs)
            };
        }

        function padLeft (inputString, minLength, padding) {
            var result = '' + inputString;

            while (result.length < minLength) {
                result = padding + result;
            }

            return result;
        }

        function getResult (inputs) {
            var code = '',
                result;

            inputs.forEach(function (input) {
                code += 'var ' + input.name + '=' + input.value + ';';
            });
            code += 'return ' + expression + ';';

            try {
                result = (new Function(code))();
            }
            catch (error) {
                result = error;
            }

            return result;
        }

        identifiers = getUniqueIdentifiers();

        return {
            identifiers: identifiers,
            expressionText: expression,
            rows: getRows()
        };
    }

    $(document).ready(function () {
        var expressionBox = $('#expressionBox'),
            startButton = $('#startButton'),
            identifiersList = $('#identifiersList'),
            truthTableElement = $('#truthTable'),
            resultsSection = $('#results');

        startButton.click(function () {
            var expression = expressionBox.val(),
                truthTable = getTruthTable(expression);
            setResult(truthTable);
            return false;
        });

        function setResult (truthTable) {
            var tableHeader = $('<thead />'),
                tableBody = $('<tbody />');

            truthTableElement.empty();
            addHeaders(truthTable.identifiers, truthTable.expressionText, tableHeader);

            truthTable.rows.forEach(function (row) {
                addRow(row, tableBody);
            });

            truthTableElement.append(tableHeader);
            truthTableElement.append(tableBody);
            
            resultsSection.show();
        }

		// todo - change to getHeaders
        function addHeaders (identifiers, expression, tableHeader) {
			var row = $('<tr />');
			
            identifiers.forEach(function (identifier) {
                row.append($('<th />').text(identifier));
            });

			row.append($('<th />').addClass('result').text(expression));
			
			tableHeader.append(row);
        }

		// todo - change to getRow
        function addRow(rowData, tableBody) {
            var tableRow = $('<tr />');

            rowData.inputs.forEach(function (input) {
                tableRow.append($('<td />')
					.addClass(input.value ? 'true' : 'false')
					.text(input.value));
            });

            tableRow.append($('<td />')
				.addClass('result')
				.addClass(rowData.result ? 'true' : 'false')
				.text(rowData.result));
				
            tableBody.append(tableRow);
        }
    });

})();
